import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

jest.mock('next/font/local', () => ({
  __esModule: true,
  default: (config: Record<string, unknown>) => ({
    className: 'mock-className',
    style: { fontFamily: 'mock-family' },
    ...config,
  }),
}))

import { openSans, lato, faustina } from '../../src/lib/fonts'

type FontConfig = {
  variable: string
  display: string
  weight?: string
  src: string | { path: string; weight: string }[]
}

const fonts = { openSans, lato, faustina } as unknown as Record<string, FontConfig>

it('preserves the CSS variables and swap display used by the site', () => {
  expect(
    Object.fromEntries(Object.entries(fonts).map(([name, font]) => [name, font.variable]))
  ).toEqual({
    openSans: '--font-open-sans',
    lato: '--font-lato',
    faustina: '--font-faustina',
  })
  for (const font of Object.values(fonts)) expect(font.display).toBe('swap')
})

it('uses committed local files and includes the redistribution licenses', () => {
  for (const font of Object.values(fonts)) {
    const paths = typeof font.src === 'string' ? [font.src] : font.src.map((src) => src.path)
    for (const path of paths) {
      expect(path).toMatch(/^\.\.\/fonts\/.*\.woff2$/)
      expect(existsSync(resolve(process.cwd(), 'src/lib', path))).toBe(true)
    }
  }
  for (const family of ['opensans', 'lato', 'faustina']) {
    expect(existsSync(resolve(process.cwd(), 'src/fonts', `${family}-OFL.txt`))).toBe(true)
  }
})

it('includes all previously used font weights', () => {
  expect(fonts.openSans.weight).toBe('300 800')
  expect(fonts.faustina.weight).toBe('400 700')
  expect((fonts.lato.src as { weight: string }[]).map((src) => src.weight)).toEqual(['400', '700'])
})
