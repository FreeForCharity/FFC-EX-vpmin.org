import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { repairInteractiveContent } from '../../src/lib/clone-interactive'

const captureDir = join(process.cwd(), 'src/clone-content')

describe('static interaction replacements', () => {
  it('keeps every captured route free of backend forms and obsolete subscription links', () => {
    const files = readdirSync(captureDir, { recursive: true, encoding: 'utf8' }).filter((file) =>
      file.endsWith('.html')
    )
    expect(files.length).toBeGreaterThan(500)
    for (const file of files) {
      const result = repairInteractiveContent(
        file.replace(/\.html$/, ''),
        readFileSync(join(captureDir, file), 'utf8')
      )
      expect(result).not.toMatch(/<form\b|<input\b|<script\b/i)
      expect(result).not.toContain('1FAIpQLSf8arxVgp-DFstVZ26HvBGAEqBNg1v06VYoh2XAyrZlEogusw')
      expect(result).not.toMatch(/<a\b[^>]*class="[^"]*hustle-share-icon/)
      expect(result).not.toMatch(/<iframe\b[^>]*src="https:\/\/www\.youtube\.com\/embed\//)
    }
  })

  it.each(['newsletter', 'volunteers'])('offers a visible email action on %s', (name) => {
    const result = repairInteractiveContent(name, '<h1>Page</h1><p>Content</p>')
    expect(result).toContain('mailto:info@viewpointministriesinternational.org?subject=')
    expect(result).toContain('This opens your email app.')
    expect(result).toContain('style="color:inherit;text-decoration:underline"')
  })

  it('removes the obsolete form instructions from contact', () => {
    const html = readFileSync(join(captureDir, 'contact-us.html'), 'utf8')
    const result = repairInteractiveContent('contact-us', html)
    expect(result).not.toContain('using the form.')
    expect(result).not.toContain('We read every message.')
    expect(result).toContain('mailto:info@viewpointministriesinternational.org')
  })

  it('preserves donations, registration, broadcast and audio destinations', () => {
    for (const name of ['donate', 'childrenbibleoutreach', 'letstalkaboutjesus', 'podcast']) {
      const html = readFileSync(join(captureDir, `${name}.html`), 'utf8')
      const result = repairInteractiveContent(name, html)
      const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1])
      for (const link of links.filter((url) =>
        /paypal\.com|givelify\.com|forms\.gle|youtube\.com\/c\/|anchor\.fm/.test(url)
      )) {
        expect(result).toContain(link)
      }
    }
  })

  it('turns embedded videos into watch links with the same ID', () => {
    expect(
      repairInteractiveContent(
        'article',
        '<iframe src="https://www.youtube.com/embed/u_xt_5raqzg?feature=oembed"></iframe>'
      )
    ).toContain('https://www.youtube.com/watch?v=u_xt_5raqzg')
  })
})
