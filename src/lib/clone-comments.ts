// FFC static sites do not carry comments. The WordPress capture brought each
// post's comment thread and reply form with it (including spam), so strip every
// trace of the comment system: the thread/form section, the "N comments" byline
// link, and any leftover link to a #respond / #comments anchor or ?replytocom=.
// Runs at export time so a regenerated capture cannot bring them back.

const COMMENT_SECTION_OPEN = /<section\b[^>]*\bid\s*=\s*(["'])comment-wrap\1[^>]*>/i

function removeCommentSections(html: string): string {
  let out = html
  for (;;) {
    const open = COMMENT_SECTION_OPEN.exec(out)
    if (!open) return out
    const tags = /<(\/?)section\b[^>]*>/gi
    tags.lastIndex = open.index
    let depth = 0
    let end = -1
    for (let m = tags.exec(out); m; m = tags.exec(out)) {
      depth += m[1] ? -1 : 1
      if (depth === 0) {
        end = m.index + m[0].length
        break
      }
    }
    // An unclosed section would swallow the rest of the page; drop only the
    // opening tag rather than guess where it ends.
    out = out.slice(0, open.index) + out.slice(end === -1 ? open.index + open[0].length : end)
  }
}

export function stripWordPressComments(html: string): string {
  let out = removeCommentSections(html)
  // Byline count: `... | <span class="comments-number"><a href="…#respond">3 comments</a></span>`
  out = out.replace(
    /(?:\s*\|\s*)?<span\b[^>]*class\s*=\s*(["'])[^"']*\bcomments-number\b[^"']*\1[^>]*>[\s\S]*?<\/span>/gi,
    ''
  )
  // Any other link into the comment system.
  out = out.replace(/<a\b([^>]*)>[\s\S]*?<\/a>/gi, (tag, attrs: string) => {
    const href = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2] ?? ''
    return /#(respond|comments?)(?:$|-)|[?&]replytocom=/i.test(href) ? '' : tag
  })
  return out
}
