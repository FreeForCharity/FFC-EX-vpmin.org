import localFont from 'next/font/local'

// Self-host the same three families so builds never depend on a live Google
// Fonts response. Sources and OFL licenses are committed in src/fonts/.
export const openSans = localFont({
  src: '../fonts/open-sans.woff2',
  display: 'swap',
  variable: '--font-open-sans',
  weight: '300 800',
})

export const lato = localFont({
  src: [
    { path: '../fonts/lato-regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/lato-bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-lato',
})

export const faustina = localFont({
  src: '../fonts/faustina.woff2',
  display: 'swap',
  variable: '--font-faustina',
  weight: '400 700',
})
