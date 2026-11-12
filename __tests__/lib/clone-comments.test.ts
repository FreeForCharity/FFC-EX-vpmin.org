import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { stripWordPressComments } from '../../src/lib/clone-comments'
import { loadCloneContent } from '@/lib/clone-content'

// Anything that would show a visitor a comment, a comment count, or a way to
// post one. Static FFC sites carry no comment system.
const COMMENT_MARKERS =
  /id=["']comment-wrap|id=["']comments["']|id=["']respond["']|comment-respond|commentlist|comments-number|replytocom=|#respond\b|#comments?\b|wp-comments-post|gravatar\.com/i

const CONTENT_DIR = join(process.cwd(), 'src', 'clone-content')
const pages = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))

describe('stripWordPressComments', () => {
  it('removes the comment thread and reply form section, including nested sections', () => {
    const html =
      '<p>Post</p><section id="comment-wrap"><h2 id="comments">2 Comments</h2>' +
      '<ol class="commentlist"><li><a href="https://spam.example/">slot</a></li></ol>' +
      '<section class="inner"><p>x</p></section>' +
      '<div id="respond" class="comment-respond"><form></form></div></section><p>After</p>'
    expect(stripWordPressComments(html)).toBe('<p>Post</p><p>After</p>')
  })

  it('removes the byline comment count with its separator and keeps the rest of the byline', () => {
    const html =
      '<p class="post-meta"> by <span class="author">VM</span> | <a href="/category/x/">X</a> | ' +
      '<span class="comments-number"><a href="/post/#respond">0 comments</a></span></p>'
    expect(stripWordPressComments(html)).toBe(
      '<p class="post-meta"> by <span class="author">VM</span> | <a href="/category/x/">X</a></p>'
    )
  })

  it('removes stray links into the comment system but keeps ordinary links', () => {
    const html =
      '<a href="/post/#respond">Leave a comment</a><a href="/post/#comment-209">reply</a>' +
      '<a href="/post/?replytocom=218#respond">Reply</a><a href="/post/#content">Skip</a>'
    expect(stripWordPressComments(html)).toBe('<a href="/post/#content">Skip</a>')
  })

  it('leaves a page without comments untouched', () => {
    const html = '<main><section id="hero"><p>Hello</p></section></main>'
    expect(stripWordPressComments(html)).toBe(html)
  })
})

describe('the captured site carries no comments', () => {
  it('finds the captured pages (guards against an empty scan passing vacuously)', () => {
    expect(pages.length).toBeGreaterThan(200)
  })

  it.each(pages)('source %s has no comment markup', (page) => {
    const html = readFileSync(join(CONTENT_DIR, `${page}.html`), 'utf8')
    expect(html.match(COMMENT_MARKERS)?.[0] ?? null).toBeNull()
  })

  it.each(pages)('rendered %s has no comment markup', (page) => {
    expect(loadCloneContent(page).match(COMMENT_MARKERS)?.[0] ?? null).toBeNull()
  })
})
