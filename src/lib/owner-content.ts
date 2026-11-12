// Owner-confirmed publishing choices. Applied after loading the capture so a
// future WordPress regeneration cannot silently restore private contact data.
const publicPhone = /(?:\+?1[\s.-]?)?\(?301\)?[\s.-]*683[\s.-]*8930/g
const paypal = 'https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y'
const otherGiving =
  /^https?:\/\/(?:www\.)?(?:givelify\.com|giv\.li|kindridgiving\.com|pledge\.to)\//i

// Captured Divi modules contain nested divs. Match their balanced boundaries
// rather than stopping at the first inner closing div and corrupting the page.
function removeModules(html: string): string {
  const tags = /<\/?div\b[^>]*>/gi
  const stack: { start: number; module: boolean }[] = []
  const ranges: [number, number][] = []
  let match: RegExpExecArray | null
  while ((match = tags.exec(html))) {
    if (!/^<\//.test(match[0])) {
      stack.push({
        start: match.index,
        module: /\bclass="[^"]*\bet_pb_(?:blurb|image)\b/.test(match[0]),
      })
      continue
    }
    const open = stack.pop()
    if (!open?.module) continue
    const content = html.slice(open.start, tags.lastIndex)
    if (
      /\(?301\)?[\s.-]*683[\s.-]*8930|Givelify|giv\.li|kindridgiving\.com|pledge\.to|Zelle[ -]Logo/i.test(
        content
      )
    ) {
      ranges.push([open.start, tags.lastIndex])
    }
  }
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    html = html.slice(0, start) + html.slice(end)
  }
  return html
}

export function applyOwnerContent(name: string, html: string): string {
  let result = removeModules(html)
  result = result.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (tag, attrs: string) => {
    const href = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2]
    if (href?.startsWith('tel:')) return ''
    if (href && otherGiving.test(href)) return `<a href="${paypal}">Donate with PayPal</a>`
    return tag
  })
  result = result.replace(publicPhone, '')
  result = result.replace(/<p\b[^>]*>You can Zelle your donation to[\s\S]*?<\/p>/gi, '')
  if (name === 'childrenbibleoutreach') {
    result = result.replace(
      'This class is offered monthly on Saturday',
      'This class is offered on the second and fourth Saturday of each month'
    )
    // Owner confirmed the 11 am–noon time in response to the schedule question.
    result = result.replace(
      '11:00am to 12:00 am eastern time.',
      '11:00 am to 12:00 pm Eastern Time.'
    )
  }
  return result
}
