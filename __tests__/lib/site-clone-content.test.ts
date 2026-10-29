jest.mock('../../src/lib/clone-content', () => ({
  loadCloneContent: () => '<p>Archive</p><a href="http://www.solomonoluwabiyi.com/">Author</a>',
}))

// Import through the actual route alias, so a lost alias breaks this test.
import { loadCloneContent } from '@/lib/clone-content'

it('routes captured pages through site repairs without modifying the generated reader', () => {
  expect(loadCloneContent('index')).toBe('<p>Archive</p>Author')
})
