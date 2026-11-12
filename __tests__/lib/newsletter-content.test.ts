import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { applyNewsletterContent } from '../../src/lib/newsletter-content'
import { loadCloneContent } from '../../src/lib/site-clone-content'

const root = join(process.cwd(), 'src/clone-content')
const newsletter = readFileSync(join(root, 'newsletter.html'), 'utf8')

describe('hosted newsletter editions', () => {
  const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    if (originalBasePath === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
    else process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath
  })

  it.each(['', '/FFC-EX-vpmin.org'])('serves the reader and fallback under %s', (base) => {
    process.env.NEXT_PUBLIC_BASE_PATH = base
    const result = applyNewsletterContent('newsletter', newsletter)
    expect(result).toContain(`src="${base}/2026_VMI_Newsletter.pdf"`)
    expect(result).toContain(`href="${base}/2026_VMI_Newsletter.pdf"`)
    expect(result).toContain('title="2026 Viewpoint Ministries International newsletter"')
    expect(result).toContain('Open or download the 2026 newsletter PDF')
    expect(result).toContain('Read the 2026, 2024 and Winter 2022 newsletters below')
    expect(result).not.toContain('You can read the winter')
    expect(result).toContain(`href="${base}/VMI_2024_Newsletter.pdf"`)
    expect(result).toContain(`src="${base}/VMI_2024_Newsletter.pdf"`)
    expect(result).toContain(`href="${base}/Winter_2022_Newsletter.pdf"`)
    expect(result).toContain(`src="${base}/Winter_2022_Newsletter.pdf"`)
    expect(result).toContain('Open or download the 2024 newsletter PDF')
    expect(result).toContain('Open or download the Winter 2022 newsletter PDF')
    expect(result.match(/<iframe /g)).toHaveLength(3)
    expect(result).not.toContain('https://www.canva.com/design/')
  })

  it('replaces all edition Canva links on every captured page without adding extra readers', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ''
    const files = readdirSync(root, { recursive: true, encoding: 'utf8' }).filter((p) =>
      p.endsWith('.html')
    )
    let menus = 0
    for (const file of files) {
      const raw = readFileSync(join(root, file), 'utf8')
      if (!raw.includes('canva.com/design/DAG9mpRADdw/')) continue
      menus++
      const name = file.replace(/\.html$/, '')
      const result = applyNewsletterContent(name, raw)
      expect(result).not.toMatch(/canva\.com\/design\/(?:DAG9mpRADdw|DAGazRNeHcI|DAFRId63nIY)\//)
      expect(result).toContain('href="/VMI_2024_Newsletter.pdf"')
      expect(result).toContain('href="/Winter_2022_Newsletter.pdf"')
      expect(result).toContain('href="/2026_VMI_Newsletter.pdf"')
      if (name !== 'newsletter') expect(result).not.toContain('newsletter-2026-title')
    }
    expect(menus).toBeGreaterThan(500)
  })

  it('wires the hosted PDF through the site-owned capture wrapper', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ''
    expect(loadCloneContent('newsletter')).toContain('id="newsletter-2026-title"')
    for (const file of [
      '2026_VMI_Newsletter.pdf',
      'VMI_2024_Newsletter.pdf',
      'Winter_2022_Newsletter.pdf',
    ]) {
      const pdf = readFileSync(join(process.cwd(), 'public', file))
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    }
  })
})
