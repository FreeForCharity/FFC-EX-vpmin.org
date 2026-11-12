# Owner decisions

These decisions were supplied directly in the website-remediation conversation.
They supersede older assumptions in the migration issues.

- No public mailing address or telephone number. Keep the public enquiry email.
- Leave leadership names unpublished for now; do not show an awaiting-information notice.
- Use the existing Viewpoint logo for the website and browser icons (PR #68 merged).
- Candid/GuideStar integration is out of scope; do not show a pending profile notice.
- Children's Bible Outreach registration is active. Sessions are on the second
  and fourth Saturday, 11:00 am to noon Eastern Time, as confirmed in response
  to the schedule question.
- Keep PayPal as the donation option for now. Do not request a Zeffy migration.
- Explore a newsletter PDF hosted with GitHub Pages; see NEWSLETTER_PDF_PLAN.md.
  The actual public-ready newsletter PDF is still needed.
- Owner reports the complete old-site backup remains on WordPress and wants
  the old site available as a fallback. This is not independent proof of a
  tested, separately stored backup. Do not cancel the fallback hosting yet.
- Make vpmin.org primary after the remaining issues are resolved. Repository
  main already contains the custom-domain configuration; this PR makes no DNS,
  custom-domain or email changes.
- Google Workspace exists for the current domain. Add the new domain to that
  existing Workspace when ready; preserve current mail delivery during the move.
- Keep the old domain registered and redirect visitors to matching vpmin.org
  pages after the new site is verified. Retain a documented rollback path.
- Owner confirms the old premature-forwarding problem was corrected.
- Keep Google Analytics decisions open (#17).
- Record the current website service in the existing FFC support-portal account
  (#170); the owner has not confirmed that this record update is already done.
- Owner confirms completing an independent website edit (#19).
- Retirement of old hosting was approved conditionally, but preserving the
  WordPress fallback takes precedence until its storage/hosting arrangement is
  confirmed. Do not remove the only retained original.

Current deployment/smoke incidents (#76/#77) and the final domain/redirect/email
checks remain blockers to completing the overall migration.
