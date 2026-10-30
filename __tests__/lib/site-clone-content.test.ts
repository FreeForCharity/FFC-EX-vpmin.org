jest.mock('../../src/lib/clone-content', () => ({
  loadCloneContent: () =>
    '<p>Archive</p><a href="http://www.solomonoluwabiyi.com/">Author</a><a href="https://myviewletstalkaboutjesus.files.wordpress.com/2022/05/bitten-tract.pdf">Tract</a>',
}))

// Import through the actual route alias, so a lost alias breaks these tests.
import { loadCloneContent } from '@/lib/clone-content'

const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH

afterEach(() => {
  if (originalBasePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath
  }
})

it.each([undefined, '', '/FFC-EX-vpmin.org'])(
  'repairs captured content with deployment base path %s',
  (basePath) => {
    if (basePath === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH
    } else {
      process.env.NEXT_PUBLIC_BASE_PATH = basePath
    }

    expect(loadCloneContent('index')).toBe(
      '<p>Archive</p>Author' +
        `<a href="${basePath ?? ''}/_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/07/Bitten-Tract.pdf">Tract</a>`
    )
  }
)
