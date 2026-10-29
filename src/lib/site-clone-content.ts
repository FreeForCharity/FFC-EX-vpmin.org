// Site-owned wrapper: the converter may regenerate clone-content.ts safely.
// Keep the exact @/lib/clone-content alias in tsconfig.json and jest.config.js
// pointing here. Import the generated reader relatively to avoid that alias.
import { loadCloneContent as loadCapturedContent } from './clone-content'
import { repairCloneContent } from './clone-repairs'

export function loadCloneContent(name: string): string {
  return repairCloneContent(loadCapturedContent(name), process.env.NEXT_PUBLIC_BASE_PATH || '')
}
