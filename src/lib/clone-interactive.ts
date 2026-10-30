// Site-owned replacements for interactions that cannot use a WordPress backend.
const contactEmail = 'info@viewpointministriesinternational.org'
const oldSubscriptionForm =
  'https://docs.google.com/forms/d/e/1FAIpQLSf8arxVgp-DFstVZ26HvBGAEqBNg1v06VYoh2XAyrZlEogusw/viewform'

function emailLink(subject: string, label: string): string {
  return `<a style="color:inherit;text-decoration:underline" href="mailto:${contactEmail}?subject=${encodeURIComponent(subject)}">${label}</a>`
}

export function repairInteractiveContent(name: string, html: string): string {
  let repaired = html
    .split(oldSubscriptionForm)
    .join(`mailto:${contactEmail}?subject=${encodeURIComponent('Newsletter subscription request')}`)
  repaired = repaired.replace(/>Subscription Form<\/a>/g, '>Subscribe by email</a>')

  // Hustle's JavaScript was removed by the capture. Its hidden share controls
  // include href="#" and relative Facebook share targets; remove these inert
  // controls while retaining the charity's separate social-profile links.
  repaired = repaired.replace(
    /<li>\s*<a\b[^>]*\bclass="[^"]*\bhustle-share-icon\b[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/li>/gi,
    ''
  )

  // A normal watch link is usable without an iframe, player scripts or consent
  // to an embedded third-party player. Keep the original video ID.
  repaired = repaired.replace(
    /<iframe\b[^>]*\bsrc="https:\/\/www\.youtube\.com\/embed\/([\w-]+)(?:\?[^"]*)?"[^>]*>[\s\S]*?<\/iframe>/gi,
    (_, id: string) =>
      `<p><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch this video on YouTube</a></p>`
  )

  if (name === 'contact-us') {
    repaired = repaired.replace(
      'or send a message using the form.',
      'or send us an email using the link below.'
    )
    repaired = repaired.replace(
      'This form has moved to email. We read every message.',
      'Send your enquiry by email. The link below opens your email app.'
    )
  }
  if (name === 'newsletter' || name === 'volunteers') {
    const subject = name === 'newsletter' ? 'Newsletter subscription request' : 'Volunteer enquiry'
    const label = name === 'newsletter' ? 'Subscribe by email' : 'Ask about volunteering by email'
    // Add the call to action immediately after the page heading, not in a menu.
    repaired = repaired.replace(
      /(<h1\b[^>]*>[\s\S]*?<\/h1>)/i,
      `$1<p>${emailLink(subject, label)}. This opens your email app.</p>`
    )
  }
  return repaired
}
