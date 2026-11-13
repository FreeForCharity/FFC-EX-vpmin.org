# Static-site interactions (issue #10)

Inventory of the 587 captured HTML routes, reviewed 2026-10-30 and reconciled with merged changes on 2026-11-13. This covers the
committed capture, not a new crawl or an audit of the former WordPress database.
Site-owned replacements run through `site-clone-content.ts`; generated readers
and archived HTML remain untouched by this PR.

## Owner decisions

- Contact and volunteer enquiries: `info@viewpointministriesinternational.org`.
- Newsletter subscriptions: request by email at the same address; replace the
  old Google subscription form throughout the menus.
- Keep the published Children Bible Outreach and live-broadcast instructions.
- Use PayPal only. Remove retired alternatives and keep one PayPal option in the
  Donate dropdown. Do not add Zeffy (merged PRs #79 and #89).

## Inventory and decisions

| Surface                                             | Decision and resulting behavior                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contact (`/contact-us/`)                            | Existing captured form was already replaced by email. Remove misleading references to submitting a form and the unsupported response promise. Explain that the link opens an email app.                                                                                                                                       |
| Newsletter (`/newsletter/`, shared navigation)      | Replace the specific Google subscription form URL with an email subscription request. Add a visible email action on the newsletter page and relabel navigation to “Subscribe by email.” The 2026, 2024 and Winter 2022 editions now use the uploaded local PDFs, each with a reader and open/download link (PRs #83 and #87). |
| Volunteers (`/volunteers/`)                         | No signup form exists in the capture. Add a visible volunteer email action; keep the volunteer biographies.                                                                                                                                                                                                                   |
| Children Bible Outreach (`/childrenbibleoutreach/`) | Keep the parent/guardian application at `https://forms.gle/XLwstRhy4FuTvEfd7`, the owner-confirmed second/fourth Saturday schedule, 11 am to noon Eastern Time, and enquiry email. The subscription replacement does not affect this distinct registration form.                                                              |
| Let's Talk About Jesus (`/letstalkaboutjesus/`)     | Keep the existing external YouTube channel/watch link and Sunday schedule. No live-player iframe is present on this page.                                                                                                                                                                                                     |
| Four archived YouTube videos                        | Replace heavy iframe players with ordinary external watch links preserving each original video ID: `attitude-of-gratitude`, `blazing-uncompromising-light`, `fasting-weight-gain-lets-talk-about-it-2`, `this-is-essential-for-your-continuous-victorious-living`.                                                            |
| Podcast (`/podcast/`)                               | Keep five external Anchor episode iframes. They depend on the external provider, not WordPress.                                                                                                                                                                                                                               |
| BibleGateway verse widget                           | Keep the external verse iframe and existing external fallback link on Children Bible Outreach.                                                                                                                                                                                                                                |
| Donations                                           | Preserve PayPal button ID `259HPTKEZQ57Y` only. Donate opens one PayPal option; the donation page has a normal body link usable without JavaScript. Remove Givelify, Kindrid Giving, Pledge, Zelle and Other ways to Donate. No local payment form or WordPress payment endpoint exists.                                      |
| Support/sponsor booking                             | Keep the external Calendly destination `https://calendly.com/viewpointministries/supportsponsorinquiry`.                                                                                                                                                                                                                      |
| Mobile app and radio                                | Keep the MinistryOne app link and Citrus3 radio destination. These are externally hosted.                                                                                                                                                                                                                                     |
| Hustle share widgets                                | Remove inert share controls, including `href="#"` controls and malformed relative Facebook share URLs. Keep the separate social-profile links.                                                                                                                                                                                |
| Mobile menus and scroll effects                     | Keep the existing site-owned `CloneEnhance` implementation; it does not require WordPress or jQuery.                                                                                                                                                                                                                          |
| Forms, inputs, scripts, search/calendar widgets     | The captured HTML contains no form, input, button, script, audio, or video elements; no backend search/calendar widget was found. Remaining external interactions are ordinary links and provider-owned podcast/scripture embeds. Hosted newsletter readers are same-origin PDF frames; no WordPress backend is needed.       |

## Verification

Regression tests inspect every captured route after applying the replacements:
no backend form/input/script markup, no old subscription form link, no Hustle
share anchors, and no YouTube player iframes. Targeted tests preserve donation,
registration, broadcast and podcast destinations. Browser tests check the
rendered email actions, contact wording, and video fallback.

On 2026-11-13, the public PayPal donation page for hosted button
`259HPTKEZQ57Y` opened normally in a browser. It displayed **Viewpoint Ministries
International, Inc.**, preset/custom amounts, a recurring-gift option, and PayPal
and card payment controls. This verifies the public form opens for the correct
recipient; no gift was selected or submitted. The retained Calendly booking URL
also returned HTTP 200; no slot was booked.

The owner confirms the children's application is active; sessions are on the
second and fourth Saturdays, 11 am to noon Eastern Time. The owner retained
PayPal only and supplied all three newsletter PDFs. Those implementations are
merged. Givelify, Kindrid Giving, Pledge and Zelle are no longer retained
providers requiring verification.

Automated smoke may still classify PayPal's recognizable DataDome challenge as
`automation-blocked` with availability **unverified** (PR #90). Keep that honest
classification: the browser observation above is separate evidence, not a reason
to treat every future bot challenge as proof the provider is healthy. Issue #10
is complete against the owner-approved interaction scope.
