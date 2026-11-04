# Static-site interactions (issue #10)

Inventory of the 587 captured HTML routes, reviewed 2026-10-30. This covers the
committed capture, not a new crawl or an audit of the former WordPress database.
Site-owned replacements run through `site-clone-content.ts`; generated readers
and archived HTML remain untouched by this PR.

## Owner decisions

- Contact and volunteer enquiries: `info@viewpointministriesinternational.org`.
- Newsletter subscriptions: request by email at the same address; replace the
  old Google subscription form throughout the menus.
- Keep the published Children Bible Outreach and live-broadcast instructions.
- Retain PayPal and existing external donation destinations. Do not add Zeffy.

## Inventory and decisions

| Surface                                             | Decision and resulting behavior                                                                                                                                                                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Contact (`/contact-us/`)                            | Existing captured form was already replaced by email. Remove misleading references to submitting a form and the unsupported response promise. Explain that the link opens an email app.                                                                            |
| Newsletter (`/newsletter/`, shared navigation)      | Replace the specific Google subscription form URL with an email subscription request. Add a visible email action on the newsletter page and relabel navigation to “Subscribe by email.” Existing newsletter editions remain external links.                        |
| Volunteers (`/volunteers/`)                         | No signup form exists in the capture. Add a visible volunteer email action; keep the volunteer biographies.                                                                                                                                                        |
| Children Bible Outreach (`/childrenbibleoutreach/`) | Keep the parent/guardian application at `https://forms.gle/XLwstRhy4FuTvEfd7`, the published schedule, and enquiry email. The subscription replacement does not affect this distinct registration form.                                                            |
| Let's Talk About Jesus (`/letstalkaboutjesus/`)     | Keep the existing external YouTube channel/watch link and Sunday schedule. No live-player iframe is present on this page.                                                                                                                                          |
| Four archived YouTube videos                        | Replace heavy iframe players with ordinary external watch links preserving each original video ID: `attitude-of-gratitude`, `blazing-uncompromising-light`, `fasting-weight-gain-lets-talk-about-it-2`, `this-is-essential-for-your-continuous-victorious-living`. |
| Podcast (`/podcast/`)                               | Keep five external Anchor episode iframes. They depend on the external provider, not WordPress.                                                                                                                                                                    |
| BibleGateway verse widget                           | Keep the external verse iframe and existing external fallback link on Children Bible Outreach.                                                                                                                                                                     |
| Donations                                           | Preserve PayPal button ID `259HPTKEZQ57Y`, Givelify, Kindrid Giving, Pledge, and the published Zelle instructions. No local payment form or WordPress payment endpoint exists.                                                                                     |
| Support/sponsor booking                             | Keep the external Calendly destination `https://calendly.com/viewpointministries/supportsponsorinquiry`.                                                                                                                                                           |
| Mobile app and radio                                | Keep the MinistryOne app link and Citrus3 radio destination. These are externally hosted.                                                                                                                                                                          |
| Hustle share widgets                                | Remove inert share controls, including `href="#"` controls and malformed relative Facebook share URLs. Keep the separate social-profile links.                                                                                                                     |
| Mobile menus and scroll effects                     | Keep the existing site-owned `CloneEnhance` implementation; it does not require WordPress or jQuery.                                                                                                                                                               |
| Forms, inputs, scripts, search/calendar widgets     | The captured HTML contains no form, input, button, script, audio, or video elements; no backend search/calendar widget was found. Native links and the ten iframes above are the remaining external interactions before this PR; six iframes remain afterwards.    |

## Verification and remaining acceptance work

Regression tests inspect every captured route after applying the replacements:
no backend form/input/script markup, no old subscription form link, no Hustle
share anchors, and no YouTube player iframes. Targeted tests preserve donation,
registration, broadcast and podcast destinations. Browser tests check the
rendered email actions, contact wording, and video fallback.

Read-only external checks on 2026-10-30 reached PayPal's donation/cookie page
and Calendly's client-rendered page. These do not prove payment completion or
available appointment slots. The lookup service could not access the children’s
Google application or Givelify destination; that is not evidence they are dead.
Remaining donation/registration destinations need direct provider verification
before #10 can close. Never submit payments, book slots, or submit a child's
details merely to test a link.

Owner follow-ups: confirm the application accepts registrations; confirm the
retained alternative donation accounts are active; verify newsletter edition
links are public viewer links (the 2026 navigation currently uses a Canva edit
URL). The captured children's schedule says “12:00 am”; it is retained per the
owner's instruction, but confirm whether noon was intended before changing it.

Keep #10 open until external donation/registration verification is recorded.
