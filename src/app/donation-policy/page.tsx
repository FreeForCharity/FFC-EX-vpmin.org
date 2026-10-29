import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'
import { ContactEmail } from '@/components/ui/ContactDetails'
import { siteConfig } from '@/lib/site.config'

const PAGE_NAME = 'Donation Policy'
const CANONICAL_PATH = '/donation-policy/'

export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: `Donation Policy for ${siteConfig.name} website`,
  canonical: CANONICAL_PATH,
})

// Approved by the charity in the issue-remediation session on October 29, 2026.
const sections = [
  {
    title: 'How donations help',
    paragraphs: [
      'Your donations support our ministries and community outreach, including sharing practical Christian teaching and providing support and assistance to the community.',
    ],
  },
  {
    title: 'Payment processing',
    paragraphs: [
      'Online donations made through our PayPal donation link are processed by PayPal. Please review the amount and whether your gift is one-time or recurring before completing your donation.',
    ],
  },
  {
    title: 'Receipts and acknowledgments',
    paragraphs: [
      'Please retain your payment confirmation. To request a donation acknowledgment or correct your donor information, contact us with your name, donation date, amount, and transaction reference. Do not send card numbers or account passwords.',
      'Donations may be tax-deductible to the extent permitted by law. A payment confirmation may not contain everything needed for your tax records; contact us if you need a written acknowledgment.',
    ],
  },
  {
    title: 'Refund requests',
    paragraphs: [
      'Donations are generally non-refundable. If you made a donation in error or believe you were charged twice, please contact us within 30 days of the transaction. We will review requests individually.',
      'For suspected unauthorized payments, contact PayPal or your payment provider promptly.',
    ],
  },
  {
    title: 'Recurring donations',
    paragraphs: [
      'If you established a recurring donation through PayPal, you may cancel future payments through your PayPal account’s automatic-payment settings. Contact us if you need assistance.',
      'Cancelling future payments does not automatically refund donations already processed. Please submit any refund request separately.',
    ],
  },
  {
    title: 'Donor information',
    paragraphs: [
      'We use the information you provide to administer donations, respond to inquiries, and maintain required records. PayPal handles payment information under its own privacy policy. Please do not email sensitive financial information.',
    ],
  },
]

export default function DonationPolicy() {
  return (
    <div className="ffc-container py-16">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-faustina)] text-[48px] leading-[60px] mb-8">
          Donation Policy
        </h1>

        <div className="prose max-w-none font-[var(--font-lato)] text-[18px] leading-[28px]">
          <p>
            <strong>{siteConfig.name}</strong>
            <br />
            <strong>EIN: {siteConfig.ein}</strong>
            <br />A Registered 501(c)(3) Nonprofit Organization
          </p>

          {sections.map(({ title, paragraphs }) => (
            <section key={title}>
              <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
                {title}
              </h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Contact
          </h2>
          <p>For donation questions, acknowledgment requests, or refund inquiries:</p>
          <p>
            <ContactEmail className="text-primary underline" />
          </p>
        </div>
      </div>
    </div>
  )
}
