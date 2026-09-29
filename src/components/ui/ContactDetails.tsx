import React from 'react'
import { PENDING_TEXT, isPending, publishedPhone, siteConfig } from '@/lib/site.config'

/**
 * The charity's contact e-mail as a mailto: link, read from siteConfig so the
 * policy pages never hard-code an address. While the e-mail is pending (see
 * `PendingField`) — or not configured — it renders the "awaiting information"
 * placeholder as plain text instead of a dead mailto: link.
 */
export function ContactEmail({ className = '' }: { className?: string }) {
  const email = siteConfig.contactEmail.trim()
  if (!email || isPending('email')) return <span className="italic">{PENDING_TEXT}</span>
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  )
}

/** "email" or "email or phone" — how a visitor reaches the charity. */
export function ContactDetails({ className = '' }: { className?: string }) {
  const phone = publishedPhone()
  return (
    <>
      <ContactEmail className={className} />
      {phone && (
        <>
          {' '}
          or{' '}
          <a href={`tel:${phone.tel}`} className={className}>
            {phone.display}
          </a>
        </>
      )}
    </>
  )
}
