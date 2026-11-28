# Resources archive

`src/data/resources.json` contains the 23 resource listing pages (229 entries)
from <https://viewpointministriesinternational.org/resources/>, captured November 27, 2026. Entries retain the source order, titles, dates, categories and excerpts.
Only listing fragments are stored; full articles continue to use the existing
local article routes.

The original Divi grid waits for Salvattore JavaScript to reveal its cards.
`applyResourcesContent` replaces that grid and the stripped pagination in the
captured Resources shell at build time. CSS supplies three columns on desktop,
two on tablets and one on phones, without a client script. Older and newer links
point to statically exported routes under `/resources/page/2/` through
`/resources/page/23/` and respect `NEXT_PUBLIC_BASE_PATH`.

The snapshot replaces the legacy origin with `%%BASE%%`, removes unsupported
author archive links, normalizes encoded/underscore slugs to the existing local
routes, and gives each Read more link a title-specific accessible name.
No request to WordPress is needed at build time or in a visitor's browser.

To update the archive, refresh the listing fragments in `resources.json` in
source pagination order. Keep every linked article/category route available.
`resources-content.test.ts` checks every destination and the pagination bounds;
`resources.spec.ts` checks visibility, responsive layout and navigation with
JavaScript disabled. The generated WordPress capture can be refreshed separately
without overwriting this archive repair.
