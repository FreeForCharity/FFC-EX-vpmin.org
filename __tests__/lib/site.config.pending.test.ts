import { isPending, PENDING_TEXT, siteConfig, type PendingField } from '../../src/lib/site.config'
import { restoreSiteConfig, withFooterFieldsPending } from '../helpers/site-identity'

// The `pending` convention, ported from
// FreeForCharity/FFC-IN-FFC_Single_Page_Template#483. Every PendingField,
// mapped to "its value is empty". A pending field must carry no value, so no
// placeholder or borrowed (template / Free For Charity) value can ship behind
// the "awaiting information" notice.
const PENDING_IS_EMPTY: Record<PendingField, () => boolean> = {
  email: () => siteConfig.contactEmail.trim() === '',
  phone: () => siteConfig.phone.display.trim() === '' && siteConfig.phone.tel.trim() === '',
  address: () => siteConfig.addresses.length === 0,
  ein: () => siteConfig.ein.trim() === '',
  guidestar: () =>
    siteConfig.guidestar.profileUrl.trim() === '' &&
    siteConfig.guidestar.directProfileUrl.trim() === '',
  social: () => siteConfig.social.every((s) => s.href.trim() === ''),
  // This site publishes no leadership section, so there is never a team value.
  team: () => true,
  donationUrl: () => siteConfig.integrations.zeffyDonationUrl.trim() === '',
  volunteerUrl: () => siteConfig.integrations.idealistUrl.trim() === '',
}

/** Every way the current config breaks the pending contract (empty = none). */
function pendingViolations(): string[] {
  const pending = siteConfig.pending ?? []
  const known = Object.keys(PENDING_IS_EMPTY)
  const violations: string[] = []
  for (const field of pending) {
    if (!known.includes(field)) violations.push(`unknown pending field "${field}"`)
    else if (!PENDING_IS_EMPTY[field]()) violations.push(`pending ${field} has a value`)
  }
  if (new Set(pending).size !== pending.length) violations.push('pending lists a field twice')
  return violations
}

// Free For Charity's own identity: it must never be this charity's value.
const FFC_VALUES = [/46-?2471893/, /520[\s.-]?222[\s.-]?8104/, /bbbe173a/, /@freeforcharity\.org/i]

describe('siteConfig.pending contract', () => {
  afterEach(restoreSiteConfig)

  it('the checked-in config satisfies the pending contract', () => {
    expect(pendingViolations()).toEqual([])
  })

  it('carries a well-formed EIN and email, or empty ones while they are pending', () => {
    expect(siteConfig.ein).toMatch(isPending('ein') ? /^$/ : /^\d{2}-\d{7}$/)
    expect(siteConfig.contactEmail).toMatch(
      isPending('email') ? /^$/ : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    )
  })

  it("carries none of Free For Charity's own identity values", () => {
    const text = JSON.stringify({ ...siteConfig, supportedBy: undefined })
    for (const re of FFC_VALUES) expect(text).not.toMatch(re)
  })

  it('isPending reports exactly the listed fields', () => {
    siteConfig.pending = ['phone', 'guidestar']
    expect(isPending('phone')).toBe(true)
    expect(isPending('guidestar')).toBe(true)
    expect(isPending('email')).toBe(false)
    expect(isPending('team')).toBe(false)
  })

  it('exposes the visible placeholder text', () => {
    expect(PENDING_TEXT).toBe('Awaiting information from the charity')
  })

  it('accepts every footer field pending with an empty value', () => {
    withFooterFieldsPending()
    expect(pendingViolations()).toEqual([])
  })

  it.each([
    ['email', { contactEmail: 'hello@pantry.example' }],
    ['phone', { phone: { display: '(555) 010-0101', tel: '15550100101' } }],
    [
      'address',
      { addresses: [{ label: 'Office', lines: ['1 Main St'], mapUrl: 'https://maps.example' }] },
    ],
    ['ein', { ein: '12-3456789' }],
    [
      'guidestar',
      {
        guidestar: {
          profileUrl: 'https://www.guidestar.org/profile/12-3456789',
          directProfileUrl: '',
        },
      },
    ],
    ['social', { social: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/company/x' }] }],
  ] as const)('flags a pending %s that still carries a value', (field, value) => {
    withFooterFieldsPending()
    Object.assign(siteConfig, value)
    expect(pendingViolations()).toEqual([`pending ${field} has a value`])
  })

  it('flags a pending donation / volunteer page that still carries a URL', () => {
    withFooterFieldsPending()
    siteConfig.integrations = {
      ...siteConfig.integrations,
      zeffyDonationUrl: 'https://www.zeffy.com/x',
      idealistUrl: 'https://www.idealist.org/x',
    }
    expect(pendingViolations()).toEqual([
      'pending donationUrl has a value',
      'pending volunteerUrl has a value',
    ])
  })

  it('flags unknown and duplicated fields', () => {
    withFooterFieldsPending()
    siteConfig.pending = ['phone', 'phone', 'fax' as PendingField]
    expect(pendingViolations()).toEqual([
      'unknown pending field "fax"',
      'pending lists a field twice',
    ])
  })
})
