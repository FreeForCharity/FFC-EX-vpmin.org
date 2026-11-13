import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = resolve(root, 'migration/legacy-redirect-map.json')
const normalizedPath = (path) => path.replace(/%[0-9a-f]{2}/gi, (part) => part.toUpperCase())

export function currentRoutes() {
  const app = resolve(root, 'src/app')
  return new Set(
    readdirSync(app, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name === 'page.tsx')
      .map((entry) => {
        const dir = relative(app, entry.parentPath).replaceAll('\\', '/')
        return dir ? `/${dir}/` : '/'
      })
  )
}

export function buildLegacyRedirectMap(report, routes) {
  const rawPaths = new Set(report.entries.map((entry) => new URL(entry.link).pathname))
  const paths = [...new Set([...rawPaths].map(normalizedPath))].sort()
  const overrides = {}
  for (const path of paths) {
    if (routes.has(path)) continue
    // The converter changed underscores/punctuation to kebab-case and kept
    // percent-encoded byte names (for example %EF%BF%BC -> -ef-bf-bc).
    // Never choose a fuzzy match or silently send an unknown page to home.
    const target = path
      .toLowerCase()
      .replace(/[^a-z0-9/-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/-\//g, '/')
    if (!routes.has(target)) throw new Error(`No verified destination for legacy path ${path}`)
    overrides[path] = target
  }
  return {
    sourceHosts: [
      'viewpointministriesinternational.org',
      'www.viewpointministriesinternational.org',
    ],
    targetOrigin: 'https://vpmin.org',
    statusCode: 301,
    preserveQueryString: true,
    defaultBehavior: 'Preserve the requested path; apply overrides before the default redirect.',
    inventoryRows: report.entries.length,
    normalizedPaths: paths.length,
    unchangedPaths: paths.length - Object.keys(overrides).length,
    overrides,
  }
}

export function legacyRedirectTarget(source, manifest) {
  const url = new URL(source)
  if (!manifest.sourceHosts.includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) {
    throw new Error('URL is outside the legacy website')
  }
  const path = normalizedPath(url.pathname)
  const lookup = path.endsWith('/') ? path : `${path}/`
  const target = new URL(manifest.targetOrigin)
  // Assign pathname rather than resolving a relative URL: a request for
  // //another-host/path must never become an off-site redirect.
  target.pathname = manifest.overrides[lookup] || url.pathname
  target.search = url.search
  return target.href
}

export function expectedManifest() {
  const report = JSON.parse(readFileSync(resolve(root, 'public/wp-capture-report.json'), 'utf8'))
  return buildLegacyRedirectMap(report, currentRoutes())
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = expectedManifest()
  const formatted = JSON.stringify(manifest, null, 2) + '\n'
  if (process.argv.includes('--write')) writeFileSync(manifestPath, formatted)
  else if (readFileSync(manifestPath, 'utf8') !== formatted) {
    throw new Error('Redirect map is stale; run node scripts/legacy-redirect-map.mjs --write')
  }
  console.log(
    `${manifest.normalizedPaths} normalized legacy paths verified against current routes; ` +
      `${Object.keys(manifest.overrides).length} explicit overrides; no missing destinations.`
  )
}
