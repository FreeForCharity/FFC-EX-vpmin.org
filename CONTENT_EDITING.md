# Editing the Viewpoint Ministries website

For the site manager, including @solomon-vpmin. This adapts the template's
[Content Replacement Guide](CONTENT_REPLACEMENT_GUIDE.md) to the migrated site.
You can make a small text change in GitHub without installing anything.

## Find the right file

Most pages have two files. For example, `/about-us/` uses:

- `src/clone-content/about-us.html`: the visible words and pictures.
- `src/app/about-us/page.tsx`: the page title and search description, plus the
  connection to that HTML file. Changing this title does not change the page body.

The home page's visible content is `src/clone-content/index.html`; its title is
in `src/app/page.tsx`. Contact details used by shared site components are in
`src/lib/site.config.ts`. A contact detail repeated inside captured HTML needs
updating there too. Ask for help with a change that affects every page.

The HTML files contain a lot of layout code. Use your browser's Find command to
locate an exact sentence, then change only its words. Keep the surrounding tags
(such as `<p>` and `</p>`) intact. Use `&amp;` for an ampersand in HTML text.
These files came from a WordPress capture: a future recapture could overwrite
local edits, so tell the maintainer about changes before a recapture is run.

## Make a small change and request review

1. Sign in to GitHub and open this repository's **Code** tab.
2. Open the file, then choose the pencil (**Edit this file**). Make one small
   change, such as correcting a sentence. Use **Preview** where available;
   GitHub's source preview is not a preview of the rendered website.
3. Choose **Commit changes**. Describe your change, for example
   `docs: correct the outreach description`. Choose **Create a new branch for
   this commit and start a pull request**, rather than committing to `main`.
4. Open the pull request (PR). Explain which page changed, what visitors should
   see, and link the relevant issue. Ask a maintainer to review it.
5. Open the PR's **Checks** tab. Wait for the checks and review before using the
   available merge option. If GitHub does not offer a merge option, ask a
   maintainer; write access alone may not satisfy all merge requirements.

`main` is protected. PR checks cover formatting, code errors, automated browser
checks, and whether the website can be built. The `check:drift` guardrail checks
some code conventions, but its URL and asset-path scans do not cover the captured
HTML files. Some template URLs produce warnings rather than failures. Green
checks therefore do not prove that links and pictures in your HTML edit work:
open each changed link and check the pictures on the deployed page.
If a check fails, open its details and ask for help with the error; do not bypass
the check. A maintainer can run `pnpm run check:drift` locally.

## Replace a picture

For the easiest swap, find the picture's path in the page HTML and upload a
replacement with the **same filename and file type**, in the same folder under
`public/`. Use a similar shape and size, and check every page that uses it. Upload
to your PR's branch using **Add file → Upload files**. Update the image's `alt`
description if what the picture shows has changed.

Check the image tag for `srcset` before replacing it. Browsers may choose one of
those separate image files at different screen sizes instead of the main `src`.
Ask a maintainer to help replace every size variant and any `<picture>` sources;
replacing only the main file can leave the old picture visible on phones or
larger screens.

For a new filename, ask a maintainer to help connect it. React page files use
`assetPath('/Images/example.webp')` for a file in `public/Images/`. Captured HTML
instead uses `%%BASE%%/Images/example.webp`; keep the `%%BASE%%` marker. It is
replaced during the build so pictures work at both the default Pages URL and
the custom domain. Do not paste JSX or `assetPath()` into an HTML fragment.

## Know when it is live

Merging starts **CI - Build and Test** on `main`. When it succeeds,
**Deploy to GitHub Pages** (`deploy.yml`) builds and publishes the site. This
usually takes a few minutes. In **Actions**, check both runs for your merged
commit; a successful PR check alone does not mean the change has deployed.
Open the site URL shown by the deployment, refresh, and check the changed page
on a phone as well as a larger screen. Report a failed deployment to a maintainer.
Do not change `public/CNAME` as part of a content edit: it controls the domain
cutover tracked in #15.

## Get help

For a content correction or website bug, [open an issue in this repository](https://github.com/FreeForCharity/FFC-EX-vpmin.org/issues/new/choose).
Include the page URL, the current text, and the requested replacement.

For service support, use the automation hub's
[08 — Support Request](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/new?template=08-support-request.yml)
or [09 — Break/Fix](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/new?template=09-break-fix.yml).
Those forms route to a WHMCS support ticket through workflow 206; they are in the
hub, not this site's issue picker. Use the charity contact email associated with
the service. GitHub issues are public: do not include passwords or private donor
information. See [SECURITY.md](SECURITY.md) for private security reporting.

## First edit

Choose one real, small correction and follow the steps above. After it is merged
and visible on the deployed site, record the PR link in #19. The guide alone does
not complete onboarding: the site manager needs to land that change successfully.
