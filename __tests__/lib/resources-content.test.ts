import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { applyResourcesContent, resourcePageCount } from '@/lib/resources-content'
import pages from '@/data/resources.json'

const capture = readFileSync(join(process.cwd(), 'src/clone-content/resources.html'), 'utf8')
const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH

afterEach(() => {
  if (originalBasePath === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
  else process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath
})

it.each(['', '/FFC-EX-vpmin.org'])('restores cards and local pagination under %s', (basePath) => {
  process.env.NEXT_PUBLIC_BASE_PATH = basePath
  const document = new DOMParser().parseFromString(
    applyResourcesContent('resources', capture),
    'text/html'
  )
  const cards = document.querySelectorAll('.ffc-resources-grid > article')
  expect(cards).toHaveLength(10)
  expect(cards[0].querySelector('h2')?.textContent?.trim()).toBe('Challenges of Abundant Living')
  expect(cards[9].querySelector('h2')?.textContent?.trim()).toBe('Lay It All Out at The Altar')
  expect(cards[0].querySelector('a')?.getAttribute('href')).toBe(
    `${basePath}/challenges-of-abundant-living/`
  )
  expect(
    document.querySelector('nav[aria-label="Resources pages"] a[rel="next"]')?.getAttribute('href')
  ).toBe(`${basePath}/resources/page/2/`)
  expect(document.querySelector('a[rel="prev"]')).toBeNull()
  expect(document.querySelector('.et_pb_section_2')).not.toBeNull()
  expect(document.querySelector('.et_pb_salvattore_content')).toBeNull()
})

it('renders every archive page with working local article and category destinations', () => {
  pages.forEach((_, index) => {
    const page = index + 1
    const name = page === 1 ? 'resources' : `resources/page/${page}`
    const document = new DOMParser().parseFromString(
      applyResourcesContent(name, capture),
      'text/html'
    )
    const cards = document.querySelectorAll('.ffc-resources-grid > article')
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.length).toBeLessThanOrEqual(10)
    for (const link of document.querySelectorAll('.ffc-resources-grid a')) {
      const href = link.getAttribute('href')!
      expect(href).toMatch(/^\//)
      expect(readFileSync(join(process.cwd(), 'src/app', href, 'page.tsx'), 'utf8')).toBeTruthy()
    }
    const next = document.querySelector('nav a[rel="next"]')
    const prev = document.querySelector('nav a[rel="prev"]')
    expect(Boolean(next)).toBe(page < resourcePageCount)
    expect(Boolean(prev)).toBe(page > 1)
    if (page === 2) expect(prev?.getAttribute('href')).toBe('/resources/')
  })
})

it('does not change unrelated pages', () => {
  expect(applyResourcesContent('index', capture)).toBe(capture)
})
