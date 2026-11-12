import { assetPath } from './assetPath'

// Keep owner-approved PDFs outside the generated WordPress capture so a
// recapture cannot restore the Canva editing link in the site-wide menus.
export function applyNewsletterContent(name: string, html: string): string {
  const pdf = assetPath('/2026_VMI_Newsletter.pdf')
  let result = html.replace(
    /href=(["'])https:\/\/www\.canva\.com\/design\/DAG9mpRADdw\/[^"']*\1/gi,
    `href="${pdf}"`
  )

  if (name === 'newsletter') {
    result = result.replace(
      /You can read the winter by using\s+the dropdown menu above\.\s*/,
      'Read the 2026 newsletter below, or use the dropdown menu above for earlier editions. '
    )
    result = result.replace(
      /(<div class="et_pb_header_content_wrapper"><p><span>Welcome to the Viewpoint Ministries Newsletter\.<\/span><\/p>[\s\S]*?)(<\/div>)/,
      `$1<section aria-labelledby="newsletter-2026-title" style="margin-top:2rem">
<h2 id="newsletter-2026-title">2026 VMI Newsletter</h2>
<p><a href="${pdf}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Open or download the 2026 newsletter PDF (8 MB)</a></p>
<iframe src="${pdf}" title="2026 Viewpoint Ministries International newsletter" loading="lazy" style="width:100%;height:75vh;min-height:400px;border:0;background:#fff"></iframe>
</section>$2`
    )
  }
  return result
}
