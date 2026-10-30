// Link checker that mirrors how GitHub Pages serves the static export.
//
// Why this exists: `next build` (output: 'export') emits clean-URL pages as
// `out/<route>.html`, while internal links use extensionless clean URLs
// (e.g. `href="/privacy-policy"`). Next also emits a sibling directory
// `out/<route>/` containing RSC prefetch payloads (`__next.*.txt`) with no
// `index.html`. Running linkinator directly against the `./out` *filesystem*
// resolves `/privacy-policy` to that index-less directory and reports a false
// 404 — even though GitHub Pages serves `privacy-policy.html` for that path.
//
// To check links the way the deployed site actually behaves, we serve `out/`
// over HTTP with GitHub-Pages-style resolution (try the path, then `.html`,
// then `/index.html`) and point linkinator at the URL. Real missing routes
// still return 404, so genuine broken links are still caught.

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { join, normalize, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LinkChecker, LinkState } from 'linkinator'

const ROOT = fileURLToPath(new URL('../out', import.meta.url))

// The site's canonical origin (siteConfig.url). Absolute self-URLs baked into
// the build — og:image, twitter:image, JSON-LD logo, rel=canonical — point at
// this PRODUCTION origin. Below we rewrite that origin to the local preview
// server so the checker validates THIS build's own assets instead of whatever
// is currently deployed. Without this, any brand-new asset (e.g. a fresh OG
// image) 404s in the link check until it ships — a false failure.
function canonicalOrigin() {
  try {
    const cfg = readFileSync(
      fileURLToPath(new URL('../src/lib/site.config.ts', import.meta.url)),
      'utf8'
    )
    const m = cfg.match(/url:\s*['"]([^'"]+)['"]/)
    return m ? new URL(m[1]).origin : null
  } catch {
    return null
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

async function resolveFile(urlPath) {
  // Strip query/hash and decode. decodeURIComponent throws on malformed
  // escapes (e.g. a bare `%`), so guard it rather than crash the handler.
  let decoded
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  } catch {
    return null
  }

  // Drop leading slashes so the request always resolves *relative* to ROOT
  // (an absolute-looking path like `/etc/passwd` must not escape it), and a
  // trailing slash is irrelevant — `/privacy-policy` and `/privacy-policy/`
  // resolve identically, just as GitHub Pages and the `serve` preview treat
  // them.
  const rel = normalize(decoded.replace(/^[/\\]+/, '').replace(/\/+$/, ''))
  const base = resolve(ROOT, rel)
  // Defense in depth: never serve anything resolved outside ROOT.
  if (base !== ROOT && !base.startsWith(ROOT + sep)) return null

  // Resolution order mirrors GitHub Pages for `output: 'export'`:
  // exact file, then `<path>.html` (clean URL), then `<path>/index.html`.
  const candidates =
    rel === '' || rel === '.'
      ? [join(ROOT, 'index.html')]
      : [base, `${base}.html`, join(base, 'index.html')]

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate)
      if (info.isFile()) return candidate
    } catch {
      // try next candidate
    }
  }
  return null
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/')
  if (!file) {
    res.statusCode = 404
    res.end('Not found')
    return
  }
  try {
    const body = await readFile(file)
    res.statusCode = 200
    res.setHeader('Content-Type', CONTENT_TYPES[extname(file)] || 'application/octet-stream')
    res.end(body)
  } catch {
    res.statusCode = 500
    res.end('Server error')
  }
})

function shutdown(code) {
  server.close(() => process.exit(code))
  // Safety net: don't hang the job if a socket lingers.
  setTimeout(() => process.exit(code), 2000).unref()
}

// Keep the preview server alive until the API crawl completes. The CLI can
// otherwise exit 13 with an unsettled top-level await while delayed retries
// are queued and no referenced sockets remain.
server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address()
  const target = `http://127.0.0.1:${port}`
  try {
    const { skip, ...config } = JSON.parse(
      readFileSync(fileURLToPath(new URL('../.linkinatorrc.json', import.meta.url)), 'utf8')
    )
    const origin = canonicalOrigin()
    const checker = new LinkChecker()
    checker.on('link', (link) => {
      console.log(`[${link.status ?? link.state}] ${link.url}`)
    })
    checker.on('retry', ({ url, secondsUntilRetry }) => {
      console.log(`Retrying: ${url} in ${secondsUntilRetry} seconds.`)
    })
    // Retain a deadline so a stalled dependency fails rather than hanging CI.
    const deadline = setTimeout(
      () => {
        console.error('Link check did not complete within five minutes.')
        shutdown(1)
      },
      5 * 60 * 1000
    )
    try {
      const result = await checker.check({
        ...config,
        path: target,
        recurse: true,
        linksToSkip: skip,
        urlRewriteExpressions: origin
          ? [{ pattern: new RegExp(`^${escapeRegExp(origin)}`), replacement: target }]
          : [],
      })
      const broken = result.links.filter((link) => link.state === LinkState.BROKEN)
      if (!result.passed) {
        for (const link of broken) console.error(`[${link.status ?? 0}] ${link.url}`)
        console.error(`ERROR: Detected ${broken.length} broken links.`)
      } else {
        console.log(`Successfully scanned ${result.links.length} links.`)
      }
      shutdown(result.passed ? 0 : 1)
    } finally {
      clearTimeout(deadline)
    }
  } catch (err) {
    console.error('Failed to run linkinator:', err)
    shutdown(1)
  }
})
