# Bundled site fonts

These files retain the site's Open Sans, Lato and Faustina typography while
removing Google Fonts network requests from the production build.

Source: https://github.com/google/fonts at commit
`6157dfaa640ca5738b4d1a7070fe389c3036d7fc`:

- `ofl/opensans/OpenSans[wdth,wght].ttf`
- `ofl/lato/Lato-Regular.ttf` and `Lato-Bold.ttf`
- `ofl/faustina/Faustina[wght].ttf`

The accompanying OFL files contain the copyright and redistribution terms.
Fonts were converted with fontTools 4.61.1 and Brotli 1.2.1 to WOFF2, retaining
Latin/Latin-extended characters and common punctuation, currency and symbols:
U+0000–024F, U+1E00–1EFF, U+2000–206F, U+20A0–20CF, U+2100–214F,
U+2190–22FF, U+FEFF and U+FFFD. Open Sans and Faustina retain their variable
weight axes. The Lato-derived subset's internal family name is **Viewpoint Text**
to respect the original reserved font name; its glyph outlines are unchanged.

`src/lib/fonts.ts` loads these files using `next/font/local`. Keep the CSS variable
names and the existing font weights when updating them. The unit tests check
that every configured file and license exists.
