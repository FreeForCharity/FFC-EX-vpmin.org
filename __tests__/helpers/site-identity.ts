import { siteConfig, type SiteConfig } from '@/lib/site.config'

/**
 * Put `siteConfig` into a known identity for one test, independent of what the
 * checked-in config says (ported from
 * FreeForCharity/FFC-IN-FFC_Single_Page_Template#483).
 *
 * Mutates the shared config object, so call `restoreSiteConfig()` in
 * `afterEach`.
 */

const ORIGINAL: SiteConfig = JSON.parse(JSON.stringify(siteConfig))

export function restoreSiteConfig(): void {
  // Drop keys a test added that the checked-in config does not have (e.g. an
  // optional `pending` list), then restore every original value.
  for (const key of Object.keys(siteConfig) as (keyof SiteConfig)[]) {
    if (!(key in ORIGINAL)) delete (siteConfig as Partial<SiteConfig>)[key]
  }
  Object.assign(siteConfig, JSON.parse(JSON.stringify(ORIGINAL)))
}

/** A provisioned charity's identity. Every value is deliberately not FFC's. */
export const CHARITY: Partial<SiteConfig> = {
  name: 'Riverbend Test Pantry',
  contactEmail: 'hello@riverbend-pantry.example',
  ein: '12-3456789',
  phone: { display: '(555) 010-0101', tel: '15550100101' },
  addresses: [],
  guidestar: { profileUrl: '', directProfileUrl: '' },
  social: [{ label: 'Facebook', href: 'https://www.facebook.com/riverbend-test' }],
  pending: [],
}

/** A charity site with nothing pending; `overrides` layer on top of `CHARITY`. */
export function asCharitySite(overrides: Partial<SiteConfig> = {}): void {
  Object.assign(siteConfig, JSON.parse(JSON.stringify(CHARITY)), overrides)
}

/**
 * Every footer `PendingField` pending at once (all but `team`, which lives in
 * src/data/team), each with the EMPTY value the pending contract requires.
 */
export function withFooterFieldsPending(): void {
  Object.assign(siteConfig, {
    contactEmail: '',
    phone: { display: '', tel: '' },
    addresses: [],
    ein: '',
    guidestar: { profileUrl: '', directProfileUrl: '' },
    social: siteConfig.social.map((s) => ({ ...s, href: '' })),
    integrations: { ...siteConfig.integrations, zeffyDonationUrl: '', idealistUrl: '' },
    pending: [
      'email',
      'phone',
      'address',
      'ein',
      'guidestar',
      'social',
      'donationUrl',
      'volunteerUrl',
    ],
  } satisfies Partial<SiteConfig>)
}
