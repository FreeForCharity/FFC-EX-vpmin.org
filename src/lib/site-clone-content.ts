// Site-owned wrapper: the converter may regenerate clone-content.ts safely.
// Keep the exact @/lib/clone-content alias in tsconfig.json and jest.config.js
// pointing here. Import the generated reader relatively to avoid that alias.
import { loadCloneContent as loadCapturedContent } from './clone-content'
import { repairCloneContent } from './clone-repairs'
import { repairInteractiveContent } from './clone-interactive'

export function loadCloneContent(name: string): string {
  return repairInteractiveContent(
    name,
    repairCloneContent(loadCapturedContent(name), process.env.NEXT_PUBLIC_BASE_PATH || '')
  )
}
