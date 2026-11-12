# Newsletter PDFs hosted with the website

Recommended: commit the owner-approved PDF under `public/newsletters/` and link
to it from `/newsletter/`. Use an embedded browser PDF viewer with an always
visible “Open or download the PDF” link, because some mobile browsers do not
display an embedded viewer. No external newsletter account is needed.

## Options

| Option                                        | Benefit                                         | Tradeoff                                            |
| --------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| PDF link only                                 | Smallest change; opens the browser's PDF reader | Leaves the newsletter page to read it               |
| Embedded PDF plus download link (recommended) | Read on the page with a reliable fallback       | Viewer support differs across devices               |
| PDF.js custom viewer                          | Consistent controls and page navigation         | Adds JavaScript, maintenance and accessibility work |

## Publishing steps after the PDF is supplied

1. Export the approved newsletter from Canva as a public-ready PDF, not an edit link.
2. Supply the PDF and its edition/title. The newsletter is public once committed.
3. Store it as `public/newsletters/<edition>.pdf` using a stable, descriptive name.
4. Use `assetPath('/newsletters/<edition>.pdf')` for viewer and download URLs.
5. Check CSP before choosing a viewer: `<object>` needs `object-src 'self'`,
   while an iframe needs `frame-src 'self'`. Keep the download link outside it.
6. Verify the PDF loads on desktop and mobile, has readable/selectable text,
   and that the download link works on both subpath and custom-domain builds.
7. Replace the existing 2026 Canva edit link only when the real PDF is available;
   retain previous editions until their replacements are supplied.

## Published newsletter editions

The owner supplied these PDFs; keep their uploaded filenames:

| Edition     | File                                |
| ----------- | ----------------------------------- |
| 2026        | `public/2026_VMI_Newsletter.pdf`    |
| 2024        | `public/VMI_2024_Newsletter.pdf`    |
| Winter 2022 | `public/Winter_2022_Newsletter.pdf` |

`src/lib/newsletter-content.ts` uses `assetPath()` to replace each edition's
Canva link in every captured menu and embed all three PDFs on `/newsletter/`.
Each reader has an always-visible open/download link. The site-owned capture
wrapper applies this after loading generated markup, preserving the changes
across recaptures.

Both CSP declarations allow same-origin iframes (`frame-src 'self'`); object
embedding stays disabled. Future editions can use `public/newsletters/` as
described above. Update the helper when a new owner-approved edition is supplied.

References:

- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object
