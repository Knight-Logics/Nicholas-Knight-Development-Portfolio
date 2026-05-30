# Knight Logics Site Audit Log

Last updated: 2026-05-30

## Purpose

This file is the standing audit log for `knightlogics.com`.
It tracks the main site source of truth, the work completed, what was audited and validated, what is still open, and the highest-ROI growth work to prioritize next.

## Source Of Truth

- Canonical site folder: `E:\KnightLogics-Growth-System\MainSite`
- Canonical workspace: `E:\KnightLogics-Growth-System`
- Authoritative git worktree for edits and pushes: `E:\KnightLogics-Growth-System\MainSite` on branch `main`
- Live production host: Vercel project `knight-logics-checkout`
- Production trigger: push `origin/main` from `E:\KnightLogics-Growth-System\MainSite`
- Removed confusion source on 2026-05-30: stale local worktree `E:\KnightLogics-Growth-System\_mainsite_deploy_20260529b` and stale Vercel project `_mainsite_deploy_20260529b` were removed. A pre-removal patch is archived at `E:\KnightLogics-Growth-System\_mainsite_deploy_20260529b_dirty_before_removal.patch`.

## Current Snapshot

- `MainSite` is the source-of-truth worktree. There is no longer a second KnightLogics.com Vercel project or detached validation worktree to compare against.
- The hero image confusion on 2026-05-29 was not a second live repo. Production already had the new image bytes, but the homepage still referenced the older cache-busting query string until it was bumped.
- The decisive runtime root cause was CSS cascade plus cache-version drift: `index.html` had newer inline hero URLs, but the later-loaded `style.css` still set `.parallax-bg-far` to `websitehero.webp?v=20260529sharp`, so the browser kept rendering the old hero URL even after the new image bytes were deployed.
- The fix path is to treat hero cache busting as one change set: update the hero URLs in `index.html`, `style.css`, `style.min.css`, and any direct page-level `websitehero` preload/background references, then bump the stylesheet query strings on the pages that load those stylesheets.
- Current active homepage performance/door cache version: `20260530perf1`.
- Current mobile hero image cache version: `20260530hero1`.
- Current verified production commit: `48e29fc fix: optimize landing hero performance`.
- The homepage door/parallax asset `images/CircuitBrush3.webp` was optimized from about `1,035,520` bytes to `144,696` bytes while preserving alpha. The mobile/tablet path uses `images/CircuitBrush3-mobile.webp`.
- Live post-deploy Lighthouse mobile baseline: performance `91`, accessibility `100`, best practices `100`, SEO `100`, FCP `1.5s`, LCP `3.5s`, TBT `0ms`, CLS `0.036`, image-delivery savings `0 bytes`.
- For live freshness checks, compare the actual live asset size or headers and the query strings in the loaded DOM before assuming deployment drift.
- For hero incidents specifically, do not stop at checking the image file bytes. Validate the computed `background-image` value of `.parallax-bg-far` or the page-specific hero container on the rendered page.
- The live homepage has been verified serving the latest pushed `20260530perf1` query strings and optimized asset bytes.

## Hero Runtime Playbook

Use this exact sequence whenever the homepage hero or shared hero backgrounds are changed:

1. Update the authoritative image files in `E:\KnightLogics-Growth-System\MainSite\images`.
2. Update every active hero reference to the same cache version:
  - homepage inline hero rules and preloads in `index.html`
  - shared hero rules in `style.css`
  - shared hero rules in `style.min.css`
  - any direct page-level preloads or background URLs that still point at `websitehero.webp`
3. Bump the stylesheet and script query strings for the pages that load the changed CSS or JS files so browsers request the new files.
4. Validate locally by checking computed CSS, not just file contents.
5. For landing scroll changes, verify mouse-wheel exit behavior at mobile-width desktop viewports and normal desktop widths.
6. Push from `E:\KnightLogics-Growth-System\MainSite` on `main`.
7. Validate live by checking the computed `background-image` URL on the rendered page with a cache-busting page URL.

If step 7 still shows the old query string, the problem is runtime CSS selection or stale stylesheet delivery, not missing image bytes.

## Knight Logics Off-Site Authority Status

This is the current source-backed off-site ledger for Knight Logics as of 2026-05-29.
Use this section to avoid redoing listings that are already live, and to keep a clean distinction between a verified platform state and a planned target.

### Source-Of-Truth Files For This Layer

- `E:\KnightLogics-Growth-System\MainSite\KNIGHT-LOGICS-AUTHORITY-PLAN.md` - target list and canonical listing data
- `E:\KnightLogics-Growth-System\Sensitive\Credential-Registry\search-visibility-audit-log.md` - platform-confirmed Bing/GSC and cross-site visibility notes
- `E:\KnightLogics-Growth-System\Sensitive\Credential-Registry\credential-routing.md` - variable names and shared-account routing
- `E:\KnightLogics-Growth-System\Social\Social-Media-Manager\docs\master-account-registry.md` - directory account ownership and per-brand registry state
- `E:\KnightLogics-Growth-System\Social\Social-Media-Manager\docs\registry-progress-chart.md` - normalized live/submitted/blocked chart for the directory stack

### Important Distinctions

- `Bing Webmaster` and `Bing Places` are not the same surface. Bing Webmaster ownership is confirmed, but that does not count as source-backed proof that the Bing Places business profile is fully claimed and optimized.
- Raw passwords are intentionally not stored in repo docs. Use `credential-routing.md` for variable names and `C:\Users\nknig\.copilot-secrets\accounts.env` for secret values.
- `Yelp` uses a shared business-manager account across brands, while many of the other directory signups are routed through brand-specific registration emails.

### Current Status Matrix

| Platform | URL | Current status | Source-backed note | Next action |
| --- | --- | --- | --- | --- |
| Google Business Profile | https://www.google.com/business/ | Existing / active | Existing KL local entity; keep NAP, services, photos, and reviews aligned | Maintain and keep review velocity active |
| Bing Webmaster | Platform-owned property | Verified complete | Shared authenticated account already contains `knightlogics.com` | Keep sitemap and IndexNow state monitored |
| Bing Places | https://www.bingplaces.com/ | Unverified / claim state unknown | Bing Webmaster ownership is confirmed, but no durable KL Bing Places claim/optimization proof is logged yet | Verify live business-profile/login state before recreating anything |
| Apple Business Connect | https://business.apple.com/ | In progress / verification blocked | Logged-in Apple Business account is active under `support@knightlogics.com`; brand setup advanced through logo upload into Step 3 verification, but adding `knightlogics.com` for domain validation returned `Unable to add domain` on 2026-05-29. The available Apple verification lanes shown in-product were `Business ID (D-U-N-S/EIN)`, `Domain Validation`, `Business License`, `Sales Tax Permit`, `Lease/Property Agreement`, `Utility Bill`, and `Other` official document upload. An Apple help/support ticket was submitted after the TXT/domain-validation failure for account-history review | Determine whether `knightlogics.com` is already attached to another Apple Business org or use one of the accepted official-document/business-ID verification paths; a card photo is not a named Apple verification method in the current flow |
| Yelp for Business | https://biz.yelp.com/ | Existing / live | Master registry tracks KL as claimed and optimized; credential routing shows shared Yelp manager flow | Maintain listing, reviews, and photos |
| Better Business Bureau | https://www.bbb.org/ | Unverified / no public listing found | Google site search and BBB's own search returned no public Knight Logics listing on 2026-05-29 | Treat as missing until a business-side verification proves otherwise |
| Clutch | https://clutch.co/profile/knight-logics | Public profile verified / optimize | Public profile verified on 2026-05-29; links to `knightlogics.com` and exposes a live review-submission path, but currently shows `Not yet reviewed` | Complete profile proof/focus sections and collect first reviews |
| GoodFirms | https://www.goodfirms.co/company/knight-logics | Public profile verified / account access confirmed / public NAP still wrong | Correct org dashboard access was confirmed on 2026-05-29 under the email-login account `support@knightlogics.com` rather than the wrong Google-auth path. The listing editor was reachable, the primary HQ fields were filled with `Safety Harbor, FL`, `1225 7th St S`, `34695`, and `(813) 773-5553`, and the wizard was saved through Step 4, but the live public page still showed `750 Main St, 34695` immediately afterward | Recheck propagation; if the public NAP does not update, escalate through GoodFirms support or plan/billing support because the live listing is still not reflecting the entered HQ address |
| DesignRush | https://www.designrush.com/submit/agency | Missing / no public profile found | Google site search found no public Knight Logics DesignRush profile on 2026-05-29; provider submission surface is live | Create profile from the provider submission flow |
| TechBehemoths | https://techbehemoths.com/register | Registration staged / no public profile yet | The current onboarding path was confirmed at `https://techbehemoths.com/register`. Registration fields were staged with `Nicholas`, `Knight`, and `support@knightlogics.com`, but manual password completion did not occur during this pass, so no profile is live yet | Complete registration or login, then finish the company submit flow |
| ChamberofCommerce.com | https://www.chamberofcommerce.com/ | Submitted / unverified | KL is tracked as submitted, not fully live-verified | Verify public listing and complete any pending profile fields |
| Hotfrog | https://www.hotfrog.com/ | Submitted / unverified | KL is tracked as submitted with basic info, not yet fully live-verified | Verify public listing and finish optimization |
| Foursquare | https://business.foursquare.com/ | Submitted / unverified | KL is tracked as submitted with minimal optimization only | Verify public listing, then add photos and fuller description |
| BizListUSA | http://tampa.bizlistusa.com/business/5478731 | Live confirmed | Registry stack treats KL as live | Maintenance edits only |
| FloridaDirectory.biz | https://floridadirectory.biz/ | Live confirmed | Registry stack treats KL as live | Maintenance edits only |
| MerchantCircle | https://www.merchantcircle.com/knight-logics-safety-harbor-fl | Live confirmed | Registry stack treats KL as live | Maintenance edits only |
| Brownbook | https://www.brownbook.net/ | Live confirmed | Registry stack treats KL as live from claim-confirmed emails | Maintenance edits only |
| EZlocal | https://dash.ezlocal.com/ | Access confirmed, profile incomplete | Reset flow reached successfully, but dashboard/profile completion is still pending | Finish password creation and profile completion |
| Alignable | https://www.alignable.com/safety-harbor-fl/knight-logics?user=17938522 | Existing / authenticated / edit-gated | Public KL profile is live and accessible, the active login email is `support@knightlogics.com`, and authenticated account/profile pages were reached on 2026-05-29. The first edit attempt triggered an email-verification gate that sent a 6-digit code to `su*****@knightlogics.com` before any profile changes could be saved | Complete the one-time email verification on the live account, then resume tightening ideal-partner, partner-business, and profile-detail sections from inside the dashboard |
| Patch business listing | https://patch.com/ | Not started | Separate from Patch classifieds | Defer until higher-value citations are tighter |
| Patch classifieds | https://patch.com/florida/safetyharbor/classifieds | Live for KL | Already live, but this is a classifieds lane rather than a core citation | Renew or refresh only on the classifieds cadence |

### Current Priority Order For Off-Site Work

1. Resolve the highest-leverage account blockers first: `GoodFirms` live-address propagation, `Apple Business Connect` domain/verification ownership, and `TechBehemoths` registration completion.
2. Tighten the publicly verified B2B profiles after that: `Clutch` proof/review completion and first real review collection on both `Clutch` and `GoodFirms`.
3. Verify or create the remaining high-trust entity profiles next: `BBB`, `Bing Places`, and `DesignRush`.
4. Convert submitted-only directory items into verified live listings, then finish account-completion blockers: `ChamberofCommerce.com`, `Hotfrog`, `Foursquare`, `EZlocal`, and logged-in `Alignable` optimization.

### 2026-05-30 Recrawl Check After The Raw-HTML Link Expansion

- GSC Performance was refreshed recently enough to confirm demand, but not impact from the newest crawl-fallback deploy: last update `3.5 hours ago`, `43` clicks, `7.97K` impressions, `0.5%` CTR, average position `53.8`, with the top live query cluster still concentrated on St. Petersburg web-design intent.
- GSC Links still looks stale relative to the current codebase: external links total `4` (`github.com` `3`, `x.com` `1`), internal links total `42`, and `/projects` still appears with `16` internal links even though a direct code scan of current `MainSite` `.html` and `.js` files returned `NO_MATCHES` for literal `/projects`.
- GSC Pages is also too stale to judge the newest internal-link rollout yet: last update `5/24/26`, `33` indexed, `32` not indexed, and `21` pages still `Crawled - currently not indexed`.
- Semrush could not provide a trustworthy post-deploy movement check on 2026-05-30. The account hit the current free limit, Domain Overview and Backlinks degraded behind `Limits exceeded`, and Organic Positions returned placeholder `ebay.com` rows instead of valid Knight Logics rankings.
- Working conclusion: treat the latest crawl-fallback deployment as live but not yet reprocessed by Google/Semrush enough to measure. Use GSC demand data plus the standing authority plan to drive the next sprint rather than waiting on another stale report refresh.

## Completed Work

### Repo-Level And Site Foundation Work Already Completed

- Established `E:\KnightLogics-Growth-System\MainSite` as the canonical main site folder.
- Repositioned the old case-study hub into the automation page and routed traffic to `/automation`.
- Added the public referral program page and tightened referral funnel copy so approval happens before QR codes, verification links, or payout status.
- Aligned pricing page CTAs with the checkout catalog and backend package definitions.
- Added video demo support for automation workflows, including video sitemap support and VideoObject schema coverage.
- Reduced crawl waste by blocking non-content parameter combinations in `robots.txt`.
- Cleaned up canonical behavior for package/control query parameters so non-content deep-link parameters do not become canonical search URLs.
- Replaced invalid app-style rich result markup on relevant pages with safer WebPage and SoftwareSourceCode markup where review data was not legitimate.

### Session Work Completed

- Fixed encoding problems across all 8 case-study pages.
- Corrected hero image mismatches across those case-study pages.
- Tightened homepage hero framing so desktop behavior matches the intended top-center composition more closely.
- Shipped a sharper homepage hero asset bundle for desktop and larger screens.
- Forced a production republish once earlier in the hero rollout when the live site lagged the pushed code.
- Brightened the homepage `.hero-subtitle` to a clearer off-white without making it pure white.
- Shortened the mobile secondary hero CTA to `Automation Systems` so it stops expanding into an awkward two-line pill.
- Changed the Growth card CTA to `Growth Systems`.
- Fixed starter package card layout so the CTA buttons align at the bottom across neighboring cards.
- Audited ultrawide behavior and replaced the `>=3200px` homepage path with the sharper HD hero asset instead of the weaker dedicated ultrawide asset.
- Bumped the homepage stylesheet cache version to help the latest CSS break stale browser caches after publish refresh.
- Confirmed locally that the homepage now computes `.parallax-bg-far` from `websitehero.webp?v=20260529hero2` after the cascade fix, rather than the stale `20260529sharp` URL.
- Unified the active hero cache version across `index.html`, `style.css`, `style.min.css`, and direct page-level `websitehero` preload/background references.
- Fixed the small desktop-width mouse-wheel scroll path so the landing hero/parallax sequence exits correctly at mobile-sized desktop viewports.
- Optimized `images/CircuitBrush3.webp` from about `1,035,520` bytes to `144,696` bytes while preserving transparency.
- Added the mobile/tablet door asset `images/CircuitBrush3-mobile.webp` and aligned `index.html` plus `style.css` so small and tablet-width viewports do not pull the heavy desktop door asset.
- Deferred GA and Clarity auto-loads so Lighthouse and first paint are not dominated by third-party analytics, while real user interaction still loads tracking.
- Added reduced-motion handling so reduced-motion users and Lighthouse audits do not enter the landing parallax lock.
- Verified the deployed live site after Vercel served commit `48e29fc`: `412px` viewport loads the mobile door and exits on wheel scroll, desktop loads the optimized desktop door, and live Lighthouse mobile reports performance `91`.

## Commit Log For The Homepage Hero Work

Historical note: one older commit message used `pages rebuild`, but the current live site is served by Vercel rather than GitHub Pages.

- `c8666a1` - refine homepage hero and ultrawide asset
- `7afa353` - force production republish for hero bundle
- `bd1a356` - ship sharper homepage hero bundle
- `3bc5945` - hero background-position top center
- `69b5a46` - add `websitehero-uw.webp` native ultrawide crop
- `b64c74a` - regenerate sharper HD hero source
- `0fa1381` - ultrawide hero sizing fix
- `62f62c3` - restore CircuitBrush3 parallax and serve sharper HD hero on large screens
- `48e29fc` - optimize landing hero performance, door assets, analytics timing, and reduced-motion behavior

## What Was Audited And Validated

### Direct Validation Completed In This Work

- Local runtime validation of the homepage after each substantive hero change.
- Desktop, mobile, and `3440x1440` ultrawide checks for the homepage hero.
- Computed CSS checks for:
  - subtitle color
  - CTA text
  - button alignment
  - active hero image selection
  - hero background positioning
- Asset inspection and comparison for `websitehero.webp`, `websitehero-hd.webp`, and `websitehero-uw.webp`.
- Verification that the homepage now resolves to the HD hero asset on the ultrawide breakpoint locally.
- HTML/CSS problem checks on the touched homepage files, which came back clean.
- Git verification that local HEAD and `origin/main` match at `48e29fc` after the performance push.

### Root Cause Fixes Confirmed

- The homepage subtitle was initially still rendering gray after the first color adjustment.
- Root cause was a later generic `.hero-content p` rule in `style.css` overriding the intended homepage subtitle styling.
- That generic rule was scoped away from the homepage, allowing the intended brighter subtitle color to win.
- The ultrawide softness issue was not primarily a positioning problem; it was driven by the weaker asset path at the `>=3200px` breakpoint.
- The homepage now uses the sharper HD source for that breakpoint locally.

### Existing Audit Surfaces Already Available

- Search Console performance page is already shared in the browser for `sc-domain:knightlogics.com`.
- WAVE reports are already open/shared for:
  - homepage
  - automation page
  - pricing page
- Ahrefs crawl log is already open/shared.
- PageSpeed Insights is already open/shared for `service-websites` mobile.
- BrowserStack and WebPageTest pages are already open/shared for live-site validation.
- Local Lighthouse JSON artifacts already exist in the site folder for prior performance and accessibility checks.

### Important Audit Limitation Right Now

- The homepage was rechecked live after `48e29fc` with Playwright and Lighthouse, but a full multi-page QA/audit sweep has not yet been rerun after that performance commit.
- The next broad sweep should focus on top money pages and conversion paths, not on reopening the now-resolved stale-hero deployment question.

## Open Items

### Immediate

- Keep the documentation consolidation current by using `E:\KnightLogics-Growth-System\WORKSPACE-OPERATING-MANUAL.md` and `E:\KnightLogics-Growth-System\WORKSPACE-DOCUMENTATION-INDEX.md` before adding more standalone `.md` strategy files.
- Re-run a full post-deploy QA/audit pass after any new homepage hero, parallax, pricing, checkout, or conversion-path change.
- Treat the next site sprint as growth/conversion work unless a fresh audit finds a real technical regression.

### Site Work Still Pending From The Standing SEO / Growth Plan

- Push hardest on pages already getting impressions in Search Console and improve CTR before prioritizing broad net-new content.
- Expand the local commercial-intent page cluster for Tampa, Clearwater, St. Petersburg, Safety Harbor, Palm Harbor, and related service areas.
- Keep building proof-heavy case studies with screenshots, outcomes, metrics, and direct links back into money pages.
- Strengthen internal-link flows from home, automation, case studies, and local pages into:
  - websites
  - local SEO
  - Google Business Profile
  - pricing
  - consultation
  - audit offers
- Keep Google Business Profile and review velocity active because local pack strength plus on-site relevance remains one of the best click and impression multipliers.
- Continue building relevant local citations and authority links instead of generic low-value backlinks.
- Protect speed aggressively so visual quality improvements do not turn into performance regressions.
- Publish more bottom-funnel pages before broad blog content.
- Use Search Console query data to choose the next pages or sections to build.
- Tighten conversion event tracking so impression growth can be judged against calls, forms, booked consultations, and audits rather than traffic alone.

## Highest-ROI Growth Priorities

### 1. Search Console CTR Wins First

- Prioritize pages already earning impressions in Search Console.
- Rewrite titles, meta descriptions, and above-the-fold copy for pages already sitting on page 1 or page 2.
- Treat CTR improvement as the fastest near-term growth lever.

### 2. Expand The Local Commercial-Intent Cluster

- Build and improve city/service-area pages with unique proof, FAQs, internal links, and local intent language.
- Focus on Tampa, Clearwater, St. Petersburg, Safety Harbor, Palm Harbor, and nearby service-intent markets before general blog volume.

### 3. Double Down On Proof Pages

- Keep expanding case studies and proof-driven service support pages.
- Add real outcomes, screenshots, Lighthouse results, workflow examples, and implementation details where they help close intent.
- Link proof pages back into service, pricing, consultation, and audit pages.

### 4. Strengthen Internal-Link Flows To Money Pages

- Audit internal-link paths from the homepage, automation page, case studies, and city pages.
- Increase contextual links to the pages that actually make money:
  - `service-websites`
  - `service-local-seo`
  - `service-google-business-profile`
  - `pricing`
  - `book-consultation`
  - `free-website-audit`

### 5. Keep GBP And Review Velocity Active

- Maintain Google Business Profile activity and continue collecting legitimate reviews.
- Local service visibility depends on both site relevance and off-site trust signals.

### 6. Build Relevant Local Authority Links And Citations

- Prioritize chambers, local business directories, referral partners, industry associations, sponsorship mentions, and real showcase mentions.
- Avoid low-quality generic link-building that does not match the brand or target geography.

### 7. Protect Speed As A Ranking And Conversion Asset

- Treat site speed and Core Web Vitals as SEO issues, not just UX polish.
- Keep hero sharpness improvements from turning into image bloat.
- Validate performance after visual changes, especially on the homepage and top money pages.

### 8. Publish Bottom-Funnel Pages Before Blog Volume

- Focus on service pages, city pages, pricing clarifiers, comparison pages, and proof pages before broad thought-leadership content.
- The near-term goal is commercial intent capture, not generic traffic volume.

### 9. Let Search Console Queries Drive The Build Queue

- If a query already has impressions, create or improve a page or section specifically designed to win that query harder.
- Use real search data to prioritize the next content sprint.

### 10. Track Conversions Tightly

- Make sure forms, calls, audits, and booked consultations are tracked cleanly.
- Impression and click growth matter only if they also improve business outcomes.

## Recommended Next Re-Scan Sequence

Run this after meaningful homepage, pricing, checkout, service-page, or conversion-path changes:

1. Homepage live-source freshness check with cache-busting.
2. Homepage WAVE rerun when markup/accessibility changes are included.
3. Homepage PageSpeed / Lighthouse rerun when performance, visual, or script behavior changes are included.
4. Spot-check top money pages:
   - `service-websites`
   - `service-local-seo`
   - `service-google-business-profile`
   - `pricing`
   - `automation`
5. Review Search Console performance deltas for impressions, CTR, and top queries.
6. Review Ahrefs crawl findings for stale crawl waste, internal-link gaps, or crawl anomalies.

## Standing Decision Notes

- Do not treat stale live HTML immediately after a push as proof the patch failed if `origin/main` already contains the commit.
- For homepage hero changes, validate the runtime CSS winner and actual loaded image path, not just the intended source edit.
- Favor pages already showing real impression demand before building broad informational content.
- Treat performance preservation as a core SEO requirement for every visual homepage change.
