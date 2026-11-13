import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = join(__dirname, '../..')
const moduleUrl = pathToFileURL(join(root, 'scripts/legacy-redirect-map.mjs')).href

function targetFor(source: string): string {
  return execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { expectedManifest, legacyRedirectTarget } from ${JSON.stringify(moduleUrl)};
       console.log(legacyRedirectTarget(${JSON.stringify(source)}, expectedManifest()));`,
    ],
    { encoding: 'utf8' }
  ).trim()
}

it('maps every captured legacy path to an existing route and keeps the committed map in sync', () => {
  execFileSync(process.execPath, ['scripts/legacy-redirect-map.mjs'], { cwd: root })
  const manifest = JSON.parse(
    readFileSync(join(root, 'migration/legacy-redirect-map.json'), 'utf8')
  )
  expect(manifest.inventoryRows).toBe(590)
  expect(Object.keys(manifest.overrides)).toHaveLength(11)
})

it('preserves an unchanged path and duplicate query parameters', () => {
  expect(targetFor('https://viewpointministriesinternational.org/about-us/?ref=print&ref=2')).toBe(
    'https://vpmin.org/about-us/?ref=print&ref=2'
  )
})

it('handles underscore slugs and encoded or literal Unicode variants without guessing content', () => {
  expect(
    targetFor(
      'https://viewpointministriesinternational.org/identity_-our-place-in-god-w-dr-toba-ajagemo-1-of-2/?x=1'
    )
  ).toBe('https://vpmin.org/identity-our-place-in-god-w-dr-toba-ajagemo-1-of-2/?x=1')
  for (const ending of ['%ef%bf%bc', '\uFFFC']) {
    expect(
      targetFor(
        `https://viewpointministriesinternational.org/politics-the-old-time-game-in-our-contemporary-world-5${ending}/`
      )
    ).toBe('https://vpmin.org/politics-the-old-time-game-in-our-contemporary-world-5-ef-bf-bc/')
  }
})

it('keeps an unknown path intact rather than collapsing it to the homepage', () => {
  expect(targetFor('https://www.viewpointministriesinternational.org/unknown-archive/?x=1')).toBe(
    'https://vpmin.org/unknown-archive/?x=1'
  )
  expect(targetFor('https://viewpointministriesinternational.org//another-host.invalid/path')).toBe(
    'https://vpmin.org//another-host.invalid/path'
  )
})
