/** Run the actual checker against a small exported-site fixture. */
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, symlinkSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'

function fixture(html: string) {
  const root = mkdtempSync(join(tmpdir(), 'ffc-link-check-'))
  for (const path of ['scripts', 'out/child', 'src/lib'])
    mkdirSync(join(root, path), { recursive: true })
  copyFileSync(
    join(process.cwd(), 'scripts/check-links.mjs'),
    join(root, 'scripts/check-links.mjs')
  )
  symlinkSync(join(process.cwd(), 'node_modules'), join(root, 'node_modules'), 'junction')
  writeFileSync(join(root, 'out/index.html'), html)
  writeFileSync(join(root, 'out/child/index.html'), '<p>Child page</p>')
  writeFileSync(
    join(root, 'src/lib/site.config.ts'),
    "export const siteConfig = { url: 'https://example.org' }"
  )
  writeFileSync(
    join(root, '.linkinatorrc.json'),
    JSON.stringify({
      skip: ['^https://skip.invalid/'],
      timeout: 1000,
      retry: true,
      retryErrors: true,
      retryErrorsCount: 1,
      retryErrorsJitter: 10,
    })
  )
  return root
}

async function run(root: string): Promise<{ code: number | null; output: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(root, 'scripts/check-links.mjs')], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    child.stdout.on('data', (chunk) => {
      output += chunk
    })
    child.stderr.on('data', (chunk) => {
      output += chunk
    })
    const timeout = setTimeout(() => {
      child.kill()
      reject(new Error(output))
    }, 20000)
    child.on('error', reject)
    child.on('close', (code) => {
      clearTimeout(timeout)
      resolve({ code, output })
    })
  })
}

it('rewrites canonical self-links, recurses, and respects configured skips', async () => {
  const root = fixture(
    '<a href="https://example.org/child/">Child</a><a href="https://skip.invalid/">Skip</a>'
  )
  try {
    const result = await run(root)
    expect(result.code).toBe(0)
    expect(result.output).toContain('Successfully scanned')
    expect(result.output).toMatch(/\[200\].*\/child\//)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}, 25000)

it('still fails for a genuinely missing internal page', async () => {
  const root = fixture('<a href="/missing-page/">Missing</a>')
  try {
    const result = await run(root)
    expect(result.code).toBe(1)
    expect(result.output).toContain('Detected 1 broken links')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}, 25000)

it('waits for a queued retry and reports the completed result', async () => {
  let attempts = 0
  const server = createServer((_req, res) => {
    res.statusCode = ++attempts === 1 ? 503 : 200
    res.end('Ready')
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = (server.address() as { port: number }).port
  const root = fixture(`<a href="http://127.0.0.1:${port}/retry">Retry</a>`)
  try {
    const result = await run(root)
    expect(result.code).toBe(0)
    expect(attempts).toBeGreaterThan(1)
    expect(result.output).toContain('Successfully scanned')
  } finally {
    server.close()
    rmSync(root, { recursive: true, force: true })
  }
}, 25000)
