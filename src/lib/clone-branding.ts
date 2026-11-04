// The captured header/footer already uses the owner-approved logo artwork.
// Repair its accessible text without modifying generated routes or the archive.
export function repairLogoMarkup(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2]
    if (!src || !/\/2022\/05\/logo-2(?:-\d+x\d+)?\.jpg(?:[?#]|$)/.test(src)) return tag
    const withoutText = tag.replace(/\s+(?:alt|title)\s*=\s*(["']).*?\1/gi, '')
    return withoutText.replace(/\s*\/?\s*>$/, ' alt="Viewpoint Ministries International logo" />')
  })
}
