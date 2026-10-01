import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'
import { ContactEmail } from '@/components/ui/ContactDetails'
import { PENDING_TEXT, isPending, publishedPhone, siteConfig } from '@/lib/site.config'

const PAGE_NAME = 'Donation Policy'
// Trailing slash to match next.config's `trailingSlash: true` — the export
// writes donation-policy/index.html and nothing answers at /donation-policy.
const CANONICAL_PATH = '/donation-policy/'

// Bare page name as title (the root layout template appends the brand);
// per-page OG/Twitter handling is documented in src/lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: `Donation Policy for ${siteConfig.name} website`,
  canonical: CANONICAL_PATH,
})

export default function DonationPolicy() {
  // A 501(c)(3) (taxStatusLabel set) may call a donation tax-deductible.
  const taxExempt = siteConfig.taxStatusLabel.trim() !== ''
  const phone = publishedPhone()
  // The EIN clause: the EIN itself, the pending placeholder while the charity
  // has not supplied it, or nothing when it has none (see PendingField).
  const ein = siteConfig.ein.trim()
  const einClause = isPending('ein') ? ` (EIN: ${PENDING_TEXT})` : ein ? ` (EIN: ${ein})` : ''
  return (
    <div className="ffc-container py-16">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-faustina)] text-[48px] leading-[60px] mb-8">
          Donation Policy
        </h1>

        <div className="prose max-w-none font-[var(--font-lato)] text-[18px] leading-[28px]">
          <p>
            <strong>Effective Date:</strong> January 1, 2024
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Tax Deductibility
          </h2>
          {taxExempt ? (
            <p>
              {siteConfig.name} is a qualified 501(c)(3) nonprofit organization{einClause}.
              Donations are tax-deductible to the full extent allowed by law.
            </p>
          ) : (
            <p>
              {siteConfig.name}
              {einClause} has not yet received IRS recognition as a 501(c)(3) organization, so
              donations may not be tax-deductible. Please consult a tax advisor before claiming a
              deduction.
            </p>
          )}

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Use of Donations
          </h2>
          {/* The charity's own words, from its Donate page. */}
          <p>
            Your donation will help us to continue providing needed and necessary support and
            assistance to the community, further the prospects of peaceable living, and overcome
            challenges through the provision of instructions and information on practical Christian
            living.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Donation Processing
          </h2>
          <p>
            Donations are processed securely through our payment partners. You will receive a
            receipt for tax purposes via email after your donation is processed.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Refund Policy
          </h2>
          <p>
            We generally do not provide refunds for donations. However, if you believe an error has
            occurred, please contact us within 30 days of your donation.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Privacy
          </h2>
          <p>
            Donor information is kept confidential and will not be shared with third parties except
            as required by law.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Contact Us
          </h2>
          <p>For questions about donations or this policy, please contact us at:</p>
          <p>
            Email: <ContactEmail className="text-primary underline" />
            {phone && (
              <>
                <br />
                Phone: {phone.display}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
