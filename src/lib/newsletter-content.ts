import { assetPath } from './assetPath'

const editions = [
  { year: '2026', design: 'DAG9mpRADdw', file: '2026_VMI_Newsletter.pdf', size: '8 MB' },
  { year: '2024', design: 'DAGazRNeHcI', file: 'VMI_2024_Newsletter.pdf', size: '5.1 MB' },
  { year: '2022', design: 'DAFRId63nIY', file: 'Winter_2022_Newsletter.pdf', size: '4.4 MB' },
]

// Keep owner-approved PDFs outside the generated WordPress capture so a
// recapture cannot restore Canva links in the site-wide menus.
export function applyNewsletterContent(name: string, html: string): string {
  let result = html
  for (const edition of editions) {
    const canva = new RegExp(
      `href=(["'])https://www\\.canva\\.com/design/${edition.design}/[^"']*\\1`,
      'gi'
    )
    result = result.replace(canva, `href="${assetPath(`/${edition.file}`)}"`)
  }

  if (name === 'newsletter') {
    result = result.replace(
      /You can read the winter by using\s+the dropdown menu above\.\s*/,
      'Read the 2026, 2024 and Winter 2022 newsletters below, or choose an edition from the dropdown menu above. '
    )
    const readers = editions
      .map(({ year, file, size }) => {
        const pdf = assetPath(`/${file}`)
        const label = year === '2022' ? 'Winter 2022' : year
        return `<section aria-labelledby="newsletter-${year}-title" style="margin-top:2rem">
<h2 id="newsletter-${year}-title">${label} VMI Newsletter</h2>
<p><a href="${pdf}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Open or download the ${label} newsletter PDF (${size})</a></p>
<iframe src="${pdf}" title="${year} Viewpoint Ministries International newsletter" loading="lazy" style="width:100%;height:75vh;min-height:400px;border:0;background:#fff"></iframe>
</section>`
      })
      .join('\n')
    result = result.replace(
      /(<div class="et_pb_header_content_wrapper"><p><span>Welcome to the Viewpoint Ministries Newsletter\.<\/span><\/p>[\s\S]*?)(<\/div>)/,
      `$1${readers}$2`
    )
  }
  return result
}
