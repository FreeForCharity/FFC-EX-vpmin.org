import { repairLogoMarkup } from '../../src/lib/clone-branding'

describe('approved logo descriptions', () => {
  it.each(['', '/FFC-EX-vpmin.org'])('retains logo URLs and responsive sizes at %s', (base) => {
    const path = `${base}/_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/05/logo-2.jpg`
    const result = repairLogoMarkup(
      `<img src="${path}" srcset="${path} 1550w" width="1550" height="1258" alt="" title="California transfer support network Logo" />`
    )
    expect(result).toContain(`src="${path}"`)
    expect(result).toContain(`srcset="${path} 1550w"`)
    expect(result).toContain('width="1550" height="1258"')
    expect(result).toContain('alt="Viewpoint Ministries International logo"')
    expect(result).not.toContain('California')
  })

  it('does not change other photographs or attribution graphics', () => {
    const html = '<img src="/Images/other.jpg" alt="Community outreach" title="Outreach" />'
    expect(repairLogoMarkup(html)).toBe(html)
  })
})
