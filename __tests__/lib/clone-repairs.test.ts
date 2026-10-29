import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { repairCloneContent } from '../../src/lib/clone-repairs'

describe('archived WordPress reference repairs', () => {
  it.each(['', '/FFC-EX-vpmin.org'])('serves tract downloads locally at %s', (basePath) => {
    for (const [oldName, localName] of [
      ['bitten-tract.pdf', 'Bitten-Tract.pdf'],
      ['you-can-be-saved-tract.pdf', 'You-can-be-saved-Tract.pdf'],
    ]) {
      const oldUrl = `https://myviewletstalkaboutjesus.files.wordpress.com/2022/05/${oldName}`
      const path = `/_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/07/${localName}`
      const html = `<object data="${oldUrl}"></object><a href="${oldUrl}" download>Download</a>`
      const result = repairCloneContent(html, basePath)
      expect(result).not.toContain(oldUrl)
      expect(result).toContain(`data="${basePath}${path}"`)
      expect(result).toContain(`href="${basePath}${path}" download`)
      expect(existsSync(join(process.cwd(), 'public', path))).toBe(true)
    }
  })

  it('removes unavailable images while retaining captions and other images', () => {
    const html =
      '<figure><img src="https://myviewletstalkaboutjesus.files.wordpress.com/2022/06/img_6331.jpg?w=1024" /><figcaption>Wisdom Pill</figcaption></figure><img src="/photo.jpg" alt="Outreach" />'
    expect(repairCloneContent(html, '')).toBe(
      '<figure><figcaption>Wisdom Pill</figcaption></figure><img src="/photo.jpg" alt="Outreach" />'
    )
  })

  it('unlinks dead author and comment websites without deleting their text', () => {
    for (const host of [
      'solomonoluwabiyi.com',
      'www.solomonoluwabiyi.com',
      'forumslot.forumjudol.com',
      'slojdunman.com',
      'similar.my.id',
    ]) {
      expect(
        repairCloneContent(
          `<a href="https://${host}/" rel="nofollow"><strong>Author</strong></a>`,
          ''
        )
      ).toBe('<strong>Author</strong>')
    }
  })

  it('preserves working donations, email, internal links, and unrelated hosts', () => {
    const html =
      '<a href="https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y">PayPal</a><a href="mailto:viewpoint@solomonoluwabiyi.com">Email</a><a href="/about-us/">About</a><a href="https://similar.my.id.example.org/">Other</a>'
    expect(repairCloneContent(html, '')).toBe(html)
  })
})
