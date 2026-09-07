/**
 * Central site configuration for Free For Charity template sites.
 *
 * EDIT THIS FILE to customize a new FFC-supported nonprofit site.
 * Most values that vary between sites flow from here so individual
 * pages, metadata, sitemap, robots, and security headers stay in sync.
 *
 * After editing, run `npm run check:drift` to verify nothing here drifts
 * away from FFC best practices (placeholder URLs left in, etc.).
 */

export type SiteSocialLink = {
  /** Display label, also used for aria-label. */
  label: string
  /** Absolute https URL. Empty string disables the link. */
  href: string
}

export type SiteAddress = {
  /** Heading shown above the address (e.g. "Main Address"). */
  label: string
  /** Address text, one entry per visual line. */
  lines: readonly string[]
  /** Google Maps (or other) link opened when the address is clicked. */
  mapUrl: string
}

export type SiteConfig = {
  /** Display name of the charity (used in titles, OG/Twitter cards). */
  name: string
  /** Short tagline used in the default title template. */
  tagline: string
  /** Plain-language description used for the <meta description> tag. */
  description: string
  /**
   * Shorter description tuned for OG/Twitter social card previews.
   * Falls back to `description` if empty. Aim for <= 200 chars and avoid
   * em-dashes — some card renderers break on them.
   */
  shortDescription: string
  /**
   * Canonical production URL with no trailing slash.
   * Used by metadataBase, sitemap, and robots. The drift check verifies that
   * this is updated whenever public/CNAME points to a custom domain, and
   * that public/.well-known/security.txt no longer carries the placeholder.
   */
  url: string
  /**
   * Twitter / X handle including the leading @ — e.g. `@freeforcharity`.
   * Empty string omits the twitter:site meta entirely. Handles without `@`
   * are auto-prefixed so a typo doesn't silently break attribution.
   */
  twitterHandle: string
  /**
   * Primary contact email. Used by your own pages; security.txt carries
   * its own `Contact:` line and is not auto-derived from this value.
   * Keep them in sync manually when you change either.
   */
  contactEmail: string
  /** SEO keywords used in the root layout metadata. */
  keywords: readonly string[]
  /** Default theme color (used by manifest and meta tag). */
  themeColor: string
  /** Where the vulnerability disclosure policy lives on this site. */
  vulnerabilityDisclosurePath: string
  /** Social links displayed in the footer. */
  social: readonly SiteSocialLink[]
  /** IRS Employer Identification Number (tax ID), e.g. '46-2471893'. */
  ein: string
  /**
   * Year (or ISO date) the organization was founded, e.g. '2014'.
   * Emitted as schema.org `foundingDate`. Omit to skip it.
   */
  foundingDate?: string
  /**
   * schema.org nonprofit status URL, e.g. 'https://schema.org/Nonprofit501c3'.
   * FFC-supported sites are 501(c)(3) organizations; omit to skip it.
   */
  nonprofitStatus?: string
  /**
   * Other names the organization is known by (brands, abbreviations).
   * Emitted as schema.org `alternateName`. Omit to skip it.
   */
  alternateNames?: readonly string[]
  /**
   * Primary phone number. `display` is the human-readable form shown to users;
   * `tel` is the value used in the `tel:` link (digits, optionally E.164).
   */
  phone: { display: string; tel: string }
  /** Physical office addresses shown in the footer contact column. */
  addresses: readonly SiteAddress[]
  /** GuideStar / Candid transparency profile links shown in the footer. */
  guidestar: { profileUrl: string; directProfileUrl: string }
  /**
   * Permanent attribution to the supporting organization (FFC). Drives the
   * always-rendered "Supported by" clause in the footer bottom bar and the
   * "Supported Charity Login" quick link (`hubUrl`). This is part of the FFC
   * footer standard for every supported charity site: it is REQUIRED, always
   * rendered, and NOT to be removed or repointed when customizing a fork.
   * Distinct from `parentOrg` below, which covers genuine fiscal-sponsorship
   * ("a project of") relationships.
   */
  supportedBy: { name: string; url: string; hubUrl: string }
  /**
   * Parent / umbrella organization, when this site is "a project of" another
   * nonprofit. Omit for a standalone charity (the footer clause is hidden).
   */
  parentOrg?: { name: string; url: string; hubUrl: string }
  /**
   * Label appended after the org name in the footer copyright line to describe
   * tax status, e.g. 'a US 501c3 Non Profit' or 'a pre-501(c)(3) nonprofit'.
   * Empty string renders just the org name with no trailing status clause.
   */
  taxStatusLabel: string
  /**
   * Visibility flags for home-page sections whose default content is
   * FFC-specific marketing rather than per-charity data. A rebranded fork sets
   * these false so the section self-hides instead of showing FFC placeholders.
   * Data-driven sections (Team, Testimonials, Results) self-hide on their own
   * when their data files are emptied and need no flag here.
   */
  sections: {
    /** FFC Endowment feature cards. */
    showEndowment: boolean
    /** FFC's own three-program (Domains/Hosting/Consulting) marketing block. */
    showPrograms: boolean
    /**
     * Unified events section (Google Calendar / Microsoft 365 / Facebook).
     * Also self-hides when no event sources are configured and the committed
     * snapshot (src/data/events.generated.json) is empty — see
     * src/lib/events/visibility.ts.
     */
    showEvents: boolean
  }
  /**
   * Third-party integration endpoints. Each fork points these at its own
   * accounts — the domains are already allow-listed in the CSP, so only the
   * path/ID changes here.
   */
  integrations: {
    /** Zeffy donation-form embed URL (the iframe `src`). */
    zeffyDonationUrl: string
    /** Idealist volunteer-opportunities profile URL. */
    idealistUrl: string
    /**
     * Public Facebook page URL used by the Events section ("View all events
     * on Facebook" link and the empty-state follow button). This is public
     * identity, not a secret — the calendar-source endpoints/tokens stay in
     * EVENTS_* environment variables (see EVENTS_SETUP.md). Empty string
     * hides those links.
     */
    eventsFacebookPageUrl: string
    /** Microsoft Forms application-form URL (https://forms.office.com/r/<id>). */
    microsoftFormUrl: string
  }
}

export const siteConfig: SiteConfig = {
  // Every value below is taken from what Viewpoint Ministries International
  // publishes on its own site (captured in src/clone-content/), not composed
  // for it. Where the charity publishes nothing, the field is left empty or at
  // the template default rather than invented.
  //
  // `name` and `ein` are DELIBERATELY still Free For Charity's. They are not a
  // separable "safe half" of the rebrand, which is what this change set out to
  // land, and the reason is measured rather than assumed:
  //
  //   * `check-drift.mjs`'s brand-identity scan is dormant while `name` is the
  //     template's and activates the moment it is not. Flipping it alone
  //     produced 103 errors across 10 files — the whole policy suite
  //     (privacy, cookie, terms, donation, vulnerability disclosure, security
  //     acknowledgements) names Free For Charity as the data controller and as
  //     the counterparty for donations, carries FFC's EIN, phone and email,
  //     and is linked from the footer of every one of the 596 pages. Those
  //     documents are legal commitments; rewriting them to name this charity
  //     would make it the controller and counterparty in text nobody here has
  //     reviewed. That is the charity's to supply — see issue #28.
  //   * The gate is right to refuse: a footer reading "Viewpoint Ministries
  //     International" above policies reading "Free For Charity" is worse than
  //     today's wrong-but-consistent state, not better.
  //   * `ein` is coupled to `name` through ffc-footer's identity line
  //     (`${name} — EIN ${ein}`). Setting the EIN alone would publish
  //     "Free For Charity — EIN 87-4114240" on 596 pages, pairing one
  //     organisation's name with another's tax ID.
  //
  // The charity's EIN is 87-4114240 (supplied by FFC from the onboarding
  // record; the live site publishes no EIN anywhere in its 587 pages). It could
  // NOT be checked against Candid: workflow 801 was dispatched and failed
  // before reaching the API, at the Azure OIDC exchange, with AADSTS700213 —
  // no federated identity record for `…:environment:candid-prod-read`. That
  // lane has never had its one-time provisioning. Every public registry that
  // would answer independently (IRS TEOS, ProPublica, GuideStar) is blocked by
  // this environment's egress proxy. What does corroborate it: an EIN registry
  // pairs 87-4114240 with "VIEWPOINT MINISTRIES INTERNATIONAL" at Hyattsville,
  // Maryland, and the charity's own site links a Givelify campaign whose slug
  // reads `viewpoint-ministries-international-inc-hyattsville-md`.
  //
  // When the identity flip does land: the legal name is "Viewpoint Ministries
  // International, **Inc.**", as the site's own donation and status lines write
  // it, but `name` should omit the suffix — it is the title-template suffix and
  // `og:site_name`, and the converter only stops emitting absolute titles when
  // it matches the brand string in the captured titles exactly.
  name: 'Free For Charity',
  tagline: 'Contend Earnestly For The Faith (Jude 1:3)',
  description:
    'Viewpoint Ministries International, Inc. is a registered 501(c)(3) nonprofit providing support and assistance to communities in the United States and abroad, furthering the prospects of peaceable living through instruction and information on practical Christian living.',
  shortDescription:
    'A registered 501(c)(3) nonprofit supporting communities in the United States and abroad through practical Christian living, school outreach and Bible tracts.',
  // Bare origin only (drift-check enforced). The template deploys to the
  // GitHub Pages default URL; the /FFC-IN-FFC_Single_Page_Template subpath
  // comes from NEXT_PUBLIC_BASE_PATH, which siteUrl() folds in at build time.
  // A fork with a custom domain sets its own origin here (and no basePath).
  url: 'https://freeforcharity.github.io',
  twitterHandle: '@viewpointmin',
  contactEmail: 'info@viewpointministriesinternational.org',
  keywords: [
    'nonprofit',
    'charity',
    'ministry',
    'Christian living',
    'school outreach',
    'Bible tracts',
    'donate',
  ],
  themeColor: '#ffffff',
  // Trailing slash to match next.config's `trailingSlash: true`: the export
  // writes vulnerability-disclosure-policy/index.html, so the slashless form
  // only resolves via a host-specific directory fallback (a 301 on GitHub
  // Pages). error.tsx and not-found.tsx link straight here.
  vulnerabilityDisclosurePath: '/vulnerability-disclosure-policy/',
  // The charity's own accounts, as linked from every captured page's footer.
  social: [
    { label: 'Facebook', href: 'http://facebook.com/ViewpointMinistries' },
    { label: 'X (Twitter)', href: 'https://twitter.com/viewpointmin' },
    { label: 'Instagram', href: 'https://www.instagram.com/viewpointministries/' },
    { label: 'YouTube', href: 'https://www.youtube.com/c/ViewpointMinistries/videos' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/viewpoint-ministries/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/viewpointministries/_created/' },
    { label: 'Tumblr', href: 'https://www.tumblr.com/blog/viewpointministries' },
  ],
  // Still the template's, and coupled to `name` — see the note at the top of
  // this object for the charity's real EIN and what verification stands behind
  // it. ffc-footer treats this exact value as absent, so no EIN is published.
  ein: '46-2471893',
  // `foundingDate` dropped rather than replaced: the template carried FFC's
  // 2014, and the charity publishes no founding year. It is optional, so an
  // absent `foundingDate` simply omits schema.org's `foundingDate`.
  nonprofitStatus: 'https://schema.org/Nonprofit501c3',
  phone: { display: '(301) 683-8930', tel: '3016838930' },
  // The charity publishes no mailing address. Empty rather than FFC's Raleigh
  // and State College offices, which are not this organisation's. Nothing
  // renders `addresses`, and the shared schema sets no `minItems`, so an empty
  // array is valid — carrying the wrong address would not be.
  addresses: [],
  // Still Free For Charity's — coupled to `name`/`ein`, see the note above.
  guidestar: {
    profileUrl: 'https://www.guidestar.org/profile/46-2471893',
    directProfileUrl:
      'https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742',
  },
  supportedBy: {
    name: 'Free For Charity',
    url: 'https://freeforcharity.org',
    hubUrl: 'https://freeforcharity.org/hub/',
  },
  parentOrg: {
    name: 'Free For Charity',
    url: 'https://freeforcharity.org',
    hubUrl: 'https://freeforcharity.org/hub/',
  },
  taxStatusLabel: 'a US 501c3 Non Profit',
  sections: {
    showEndowment: true,
    showPrograms: true,
    showEvents: true,
  },
  integrations: {
    zeffyDonationUrl: 'https://www.zeffy.com/embed/donation-form/free-for-charity-endowment-fund',
    idealistUrl:
      'https://www.idealist.org/en/nonprofit/356bfc8e2ae64f83beea4a4e677e99d7-free-for-charity-state-college#opportunities',
    eventsFacebookPageUrl: 'https://www.facebook.com/freeforcharity',
    microsoftFormUrl: 'https://forms.office.com/r/vePxGq6JqG',
  },
}

/**
 * Compose a fully-qualified URL on this site.
 *
 * The path is required to be a same-origin absolute path (starting with `/`).
 * This rules out protocol-relative inputs like `//evil.com` that could leak
 * into a future redirect or canonical link.
 */
export function siteUrl(path = '/'): string {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    throw new TypeError(
      `siteUrl: path must be a same-origin absolute path starting with a single "/" (got: ${JSON.stringify(path)})`
    )
  }
  // Fold in the GitHub Pages subpath (empty on custom-domain deploys) so
  // canonical/OG/sitemap URLs stay correct on the default *.github.io URL.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const base = siteConfig.url.replace(/\/$/, '') + basePath
  return `${base}${path}`
}

/**
 * Returns the Twitter handle with a guaranteed leading `@`.
 * Returns `undefined` (so the meta tag is omitted) if the handle is empty
 * or is just an `@` with no body — emitting a bare `@` would advertise a
 * malformed handle to Twitter's scraper.
 */
export function twitterSite(): string | undefined {
  const raw = siteConfig.twitterHandle.trim().replace(/^@+/, '')
  if (!raw) return undefined
  return `@${raw}`
}

/** Returns the OG/Twitter card description, falling back to the longer page description. */
export function cardDescription(): string {
  return siteConfig.shortDescription.trim() || siteConfig.description
}
