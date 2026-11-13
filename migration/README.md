# Remaining migration work

Verified 2026-11-13 against main `a21c07e` and the successful live smoke run:
https://github.com/FreeForCharity/FFC-EX-vpmin.org/actions/runs/43371379938

`vpmin.org` is live over HTTPS, `www` resolves, and all 594 sitemap routes pass.
The rebrand, owner-approved footer, newsletter PDFs and single-provider Donate
menu are implemented. The old domain still returned WordPress HTTP 200 at
`/about-us/` on this audit; its path-preserving 301 has **not** been deployed.

## Old-domain redirect (#16)

`legacy-redirect-map.json` records the default path/query-preserving 301 and
the explicit exceptions required by the converted route names. It is a plan,
not an installed Cloudflare rule. The 590 capture inventory entries include
589 distinct raw path spellings; literal Unicode and percent-encoded spellings
normalize to 587 request paths. Of those, 576 keep their paths and 11 need an
override. All destinations exist in `src/app`.

```bash
node scripts/legacy-redirect-map.mjs          # verify inventory and map
node scripts/legacy-redirect-map.mjs --write  # regenerate after capture changes
```

The map is generated from the capture and current routes; an unmapped source
fails verification. No fuzzy matching or homepage fallback is used. Tests cover
underscore slugs, encoded/literal Unicode variants, duplicate query parameters,
and preservation of the target host for a path starting with two slashes.

For the authorized Cloudflare operator:

1. Confirm the retained WordPress fallback and an authenticated origin/admin
   access route. Keep the original hosting and backup intact.
2. Record/export the old zone's current redirect rules. Keep existing DNS and
   Google Workspace MX/TXT records unchanged; MX is currently `smtp.google.com`.
3. Use the existing redirect workflow/operator process from #16. Apply these
   path exceptions before the general old-domain-to-`https://vpmin.org` 301.
   Handle both old apex and `www`, preserve the query string, and keep unknown
   paths intact so the destination can return an honest 404.
4. Verify the first response is 301 and its Location points to the matching
   new path, including exceptions and a query-string example. Verify the new
   destination serves the expected page; do not validate only the homepage.
5. Recheck apex/www HTTPS and existing Google Workspace mail records. Close
   #16 only after the live redirect is measured.

Rollback: disable only the new redirect rules and restore the saved ruleset.
Because the WordPress origin, domain registration, DNS/mail records and
WordPress `home`/`siteurl` values were not changed by this plan, the original
site remains the fallback. Verify it again before considering the rollback
complete. Never implement this redirect by rewriting WordPress's site address.

## Interaction verification (#10)

On 2026-11-13 the public PayPal form opened in a browser for the correct
Viewpoint recipient with amount and payment controls. No donation was submitted.
Calendly returned HTTP 200, and the owner confirms the children's registration
remains active. This completes the interaction issue; the smoke bot-challenge
classification remains deliberately unchanged. See INTERACTIVE_INVENTORY.md.

## Work that remains open

| Issue | Remaining action                                                                                                                                                                                                                          |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #8    | Record a durable backup location and independently verify a restore of files plus database. The owner reports a WordPress backup; that is not restore evidence.                                                                           |
| #10   | Perform the remaining human provider check. PayPal may return a DataDome challenge to automation; the passing smoke labels that availability **unverified**, not confirmed. The children's registration is confirmed active by the owner. |
| #16   | Deploy and measure the old-domain 301 using the map above.                                                                                                                                                                                |
| #17   | Analytics provisioning remains explicitly deferred by the owner. The current GTM container is the only remaining rebrand-checker finding.                                                                                                 |
| #18   | An authorized FFC administrator must verify/add the current website service under existing WHMCS client #170; do not create a duplicate customer.                                                                                         |
| #20   | Keep hosting/order #311 and the WordPress fallback until backup, redirect, mail and independent fallback-storage requirements are satisfied.                                                                                              |

The connected GitHub account has read-only access to the automation repository;
this change does not deploy Cloudflare rules, modify WHMCS, touch mail, provision
analytics or retire hosting.
