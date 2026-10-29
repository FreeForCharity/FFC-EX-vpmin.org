// Repair known dead references in the archived WordPress markup at export time.
// Keep the archive intact and preserve visible text when an outbound link dies.
const archivedFiles: Record<string, string> = {
  'https://myviewletstalkaboutjesus.files.wordpress.com/2022/05/bitten-tract.pdf':
    '/_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/07/Bitten-Tract.pdf',
  'https://myviewletstalkaboutjesus.files.wordpress.com/2022/05/you-can-be-saved-tract.pdf':
    '/_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/07/You-can-be-saved-Tract.pdf',
}

const unavailableImages = new Set([
  'https://myviewletstalkaboutjesus.files.wordpress.com/2022/06/img_6331.jpg?w=1024',
  'https://myviewletstalkaboutjesus.files.wordpress.com/2022/02/viewpoint.png?w=683',
])

const unavailableHosts = new Set([
  'solomonoluwabiyi.com',
  'www.solomonoluwabiyi.com',
  'forumslot.forumjudol.com',
  'slojdunman.com',
  'similar.my.id',
])

export function repairCloneContent(html: string, basePath: string): string {
  let repaired = html
  for (const [oldUrl, localPath] of Object.entries(archivedFiles)) {
    repaired = repaired.split(oldUrl).join(`${basePath}${localPath}`)
  }

  // These two source images return 410 and have no archived copy. Retain the
  // surrounding figure/caption instead of inventing replacement photography.
  repaired = repaired.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2]
    return src && unavailableImages.has(src) ? '' : tag
  })

  return repaired.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (tag, attrs, text) => {
    const href = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2]
    if (!href) return tag
    try {
      const url = new URL(href)
      return unavailableHosts.has(url.hostname) && /^https?:$/.test(url.protocol) ? text : tag
    } catch {
      return tag
    }
  })
}
