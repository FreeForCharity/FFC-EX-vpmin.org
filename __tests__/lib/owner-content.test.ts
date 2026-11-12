import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { applyOwnerContent } from '../../src/lib/owner-content'

describe('owner-approved published content', () => {
  it('removes the phone and alternative donation destinations from every captured page', () => {
    const root = join(process.cwd(), 'src/clone-content')
    const files = readdirSync(root, {
      recursive: true,
      encoding: 'utf8',
    }).filter((p) => p.endsWith('.html'))
    expect(files.length).toBeGreaterThan(500)
    for (const file of files) {
      const result = applyOwnerContent(
        file.replace(/\.html$/, ''),
        readFileSync(join(root, file), 'utf8')
      )
      expect(result).not.toMatch(/\(?301\)?[\s.-]*683[\s.-]*8930|href=["']tel:/i)
      expect(result).not.toMatch(
        /href=["']https?:\/\/(?:www\.)?(?:givelify\.com|kindridgiving\.com|pledge\.to)\//i
      )
      expect(result).not.toContain('You can Zelle your donation to')
    }
  })

  it('keeps the active application and adds the twice-monthly schedule', () => {
    const raw = readFileSync(
      join(process.cwd(), 'src/clone-content/childrenbibleoutreach.html'),
      'utf8'
    )
    const result = applyOwnerContent('childrenbibleoutreach', raw)
    expect(result).toContain('https://forms.gle/XLwstRhy4FuTvEfd7')
    expect(result).toContain('second and fourth Saturday of each month')
    expect(result).toContain('11:00 am to 12:00 pm Eastern Time.')
  })

  it('removes an entire nested phone module without losing the following email module', () => {
    const html =
      '<div><div class="et_pb_blurb"><div><h2>Phone</h2><p>(301) 683-8930</p></div></div><div class="et_pb_blurb"><p>Email us</p></div></div>'
    expect(applyOwnerContent('contact-us', html)).toBe(
      '<div><div class="et_pb_blurb"><p>Email us</p></div></div>'
    )
  })

  it('preserves PayPal and non-donation external services', () => {
    const html =
      '<a href="https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y">PayPal</a><a href="https://forms.gle/XLwstRhy4FuTvEfd7">Application</a>'
    expect(applyOwnerContent('donate', html)).toBe(html)
  })
})
