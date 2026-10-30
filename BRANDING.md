# Approved Viewpoint logo

The owner supplied the approved logo on 2026-10-30. Its decoded RGB pixels are
identical to the existing captured `public/_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/05/logo-2.jpg`
(1550 × 1258), so that file remains the master artwork used by page headers and
footers. Existing responsive JPEG variants remain in place.

`node scripts/generate-brand-assets.mjs` regenerates the browser favicon
(16/32/48 px), 32 px PNG icon, 180 px Apple touch icon, 192/512 px Android
icons, legacy 512 px manifest icon, and 1200 × 630 social preview from that
master. Install the repository's dependencies first. The script uses Next.js's
existing Sharp image processor.

All derived images preserve the complete artwork, its proportions and white
background. None of the lettering, globe, Bible or motto is cropped or redrawn.
Fine lettering is necessarily small in a browser-tab icon.

The existing layout and web manifest already reference these asset paths through
`assetPath()`, so they work on both the GitHub Pages subpath and the custom domain.
The social preview is shared by the root layout and per-page metadata.

`clone-branding.ts` gives the captured logo images the correct alternative text
and removes obsolete or unrelated tooltips through the site-owned reader wrapper.
The generated reader and archived HTML do not need hand edits.
