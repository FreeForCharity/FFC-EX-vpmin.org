import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { applyOwnerContent } from '../../src/lib/owner-content'

describe('owner-approved published content', () => {
  it.each(['index', 'donate'])('offers one PayPal option per Donate menu on %s', (name) => {
    const raw = readFileSync(join(process.cwd(), `src/clone-content/${name}.html`), 'utf8')
    const result = applyOwnerContent(name, raw)
    const page = document.createElement('div')
    page.innerHTML = result
    const menus = page.querySelectorAll('li.menu-item-87')
    expect(menus).toHaveLength(2)
    menus.forEach((menu) => {
      const toggle = menu.querySelector('[data-donate-toggle]')
      expect(toggle?.textContent).toBe('Donate')
      expect(toggle?.getAttribute('aria-expanded')).toBe('false')
      const submenu = menu.querySelector(':scope > ul')!
      const options = submenu.querySelectorAll('a')
      expect(options).toHaveLength(1)
      expect(options[0].textContent).toBe('PayPal')
      expect(options[0].getAttribute('href')).toBe(
        'https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y'
      )
      expect(submenu.querySelectorAll('ul')).toHaveLength(0)
    })
    expect(result).not.toMatch(/Other ways to Donate|Ways to Donate/)
    if (name === 'donate') {
      const bodyLink = page.querySelector('.ffc-paypal-donation a')
      expect(bodyLink?.textContent).toBe('Donate with PayPal')
      expect(bodyLink?.getAttribute('href')).toBe(
        'https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y'
      )
      expect(bodyLink?.closest('li.menu-item-87')).toBeNull()
    }
  })

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
        /href=["']https?:\/\/(?:www\.)?(?:givelify\.com|giv\.li|kindridgiving\.com|pledge\.to)\//i
      )
      expect(result).not.toContain('You can Zelle your donation to')
      expect(result).not.toMatch(/Zelle[ -]Logo/i)
      expect(result).not.toMatch(/Other ways to Donate/i)
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

  it('redirects captured Givelify short links to PayPal', () => {
    const raw = readFileSync(
      join(
        process.cwd(),
        'src/clone-content/insulate-your-expectations-before-marriage-audio.html'
      ),
      'utf8'
    )
    expect(raw).toContain('https://giv.li/fhsltd')
    const result = applyOwnerContent('insulate-your-expectations-before-marriage-audio', raw)
    expect(result).not.toContain('https://giv.li/fhsltd')
    expect(result).toContain(
      '<a href="https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y">Donate with PayPal</a>'
    )
  })

  it('removes nested Zelle image modules while preserving adjacent PayPal artwork', () => {
    const paypal = '<div class="et_pb_image"><span><img src="PayPal.png" /></span></div>'
    const html =
      '<div><div class="et_pb_image"><div><img src="Zelle-Logo.png" /></div></div>' +
      paypal +
      '</div>'
    expect(applyOwnerContent('donate', html)).toBe('<div>' + paypal + '</div>')
    const raw = readFileSync(join(process.cwd(), 'src/clone-content/donate.html'), 'utf8')
    expect(raw).toContain('Zelle-Logo.png')
    const result = applyOwnerContent('donate', raw)
    expect(result).not.toMatch(/Zelle[ -]Logo/i)
    expect(result).toContain('hosted_button_id=259HPTKEZQ57Y')
  })

  it('preserves PayPal and non-donation external services', () => {
    const html =
      '<a href="https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y">PayPal</a><a href="https://forms.gle/XLwstRhy4FuTvEfd7">Application</a>'
    expect(applyOwnerContent('donate', html)).toBe(html)
  })
})
