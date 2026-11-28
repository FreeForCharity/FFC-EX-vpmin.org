import pages from '@/data/resources.json'
import { assetPath } from './assetPath'

// Keep the archive outside the generated capture, which depends on Divi's
// removed grid script and drops pagination links during conversion.
export const resourcePageCount = pages.length

export function resourcePagePath(page: number): string {
  return page === 1 ? '/resources/' : `/resources/page/${page}/`
}

export function applyResourcesContent(name: string, html: string): string {
  if (name !== 'resources' && !/^resources\/page\/\d+$/.test(name)) return html
  const page = name === 'resources' ? 1 : Number(name.split('/').at(-1))
  const articles = pages[page - 1]
  if (!articles) throw new Error(`Unknown resources page: ${page}`)
  const older =
    page < resourcePageCount
      ? `<a href="${assetPath(resourcePagePath(page + 1))}" rel="next">&laquo; Older Entries</a>`
      : ''
  const newer =
    page > 1
      ? `<a href="${assetPath(resourcePagePath(page - 1))}" rel="prev">Next Entries &raquo;</a>`
      : ''
  const listing = articles.split('%%BASE%%').join(process.env.NEXT_PUBLIC_BASE_PATH || '')
  return html.replace(
    /<div class="et_pb_salvattore_content"[^>]*>[\s\S]*?<div class="alignright">[\s\S]*?<\/div>\s*<\/div>/,
    `<div class="ffc-resources-grid">${listing}</div><div><nav class="pagination clearfix" aria-label="Resources pages"><div class="alignleft">${older}</div><div class="alignright">${newer}</div></nav>`
  )
}
