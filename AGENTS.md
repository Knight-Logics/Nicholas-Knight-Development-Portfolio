# KnightLogics.com MainSite Agent Instructions

Last updated: 2026-05-30

These instructions apply to `E:\KnightLogics-Growth-System\MainSite`.

## Source Of Truth

- This folder is the only authoritative KnightLogics.com worktree.
- Branch: `main`
- Remote: `https://github.com/Knight-Logics/Nicholas-Knight-Development-Portfolio.git`
- Live host: `https://knightlogics.com`
- Vercel project: `knight-logics-checkout`
- Vercel project id: `prj_sHEs7MJlcpGO2gsYtnBES85EBd2h`
- Production trigger: push `origin/main` from this folder.

Do not edit from Downloads zips, detached deploy folders, or copied workspaces.

## Required Context

Before work, read:

1. `..\WORKSPACE-OPERATING-MANUAL.md`
2. `..\WORKSPACE-DOCUMENTATION-INDEX.md`
3. `KNIGHTLOGICS-SITE-AUDIT-LOG.md`
4. `LAUNCH_QA_CHECKLIST.md`

For off-site authority, also read `KNIGHT-LOGICS-AUTHORITY-PLAN.md`.

## Current Deployment Baseline

Most recent verified performance commit:

- `48e29fc fix: optimize landing hero performance`

Current active cache versions:

- `style.css?v=20260530perf1`
- `script.js?v=20260530perf1`
- `CircuitBrush3.webp?v=20260530perf1`
- `CircuitBrush3-mobile.webp?v=20260530perf1`
- `website-hero-mobile-optimized.webp?v=20260530hero1`

Verified live after deploy:

- Mobile Lighthouse performance `91`
- Accessibility `100`
- Best Practices `100`
- SEO `100`
- Small desktop-width mouse-wheel scroll exits the hero
- Desktop and mobile door assets load correctly

## Development Protocol

1. Run `git status -sb` first. This worktree often has unrelated dirty files.
2. Stage only intentional files. Do not use `git add .`.
3. Use local preview before frontend commits.
4. Validate visual changes with browser automation and screenshot inspection.
5. For hero/parallax/image changes, verify computed CSS URLs and actual network requests.
6. For JavaScript changes, run `node --check script.js`.
7. For performance changes, run Lighthouse locally or live.
8. After push, verify the live Vercel deployment with cache-busted HTML and asset-header checks.

## Hero And Parallax Rules

- The `CircuitBrush3` door image is intentional. It must fill the landing hero and stay pinned to the left/right edges.
- The center transparency is intentional.
- Do not remove the parallax/animation sequence unless explicitly requested.
- Mobile/tablet widths should use the mobile door asset.
- Desktop widths should use the optimized desktop door asset.
- If production appears stale, compare loaded HTML query strings, computed CSS background URLs, and asset response headers before assuming the wrong repo deployed.

## Documentation Rules

- `KNIGHTLOGICS-SITE-AUDIT-LOG.md` is the site-specific current audit log.
- `LAUNCH_QA_CHECKLIST.md` is the QA runbook.
- `WEB_OPTIMIZATION_REFERENCE.md` is reusable technique reference.
- Older strategy docs are preserved as detail but are not the active priority queue unless the audit log or workspace manual says so.
