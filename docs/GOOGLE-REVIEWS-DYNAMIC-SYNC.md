# Google Reviews Dynamic Sync (GBP -> JSON)

Last updated: 2026-05-30

This document defines the reusable workflow for dynamic Google review ingestion on static sites in this workspace.

## What This Powers

- Frontend review rendering from `data/google-reviews.json`.
- Filterable states like `All`, `Replied`, `Unreplied` already supported by `script.js`.
- No hard-coded manual review edits in page HTML once sync is active.

## MainSite Command

From `E:/KnightLogics-Growth-System/MainSite`:

```powershell
npm run reviews:sync-google
```

The command writes:

- `data/google-reviews.json`

## Required Secret Variables

Store in `C:/Users/nknig/.copilot-secrets/accounts.env`:

- `GBP_OAUTH_CLIENT_ID`
- `GBP_OAUTH_CLIENT_SECRET`
- `GBP_REFRESH_TOKEN`

Recommended selector variables:

- `GBP_ACCOUNT_NAME` (format: `accounts/123456...`) or `GBP_ACCOUNT_ID`
- `GBP_LOCATION_NAME` (format: `locations/123456...`) or `GBP_LOCATION_ID`
- `GBP_LOCATION_TITLE` (fallback name match, defaults to `Knight Logics`)

Direct mode variables (best when account discovery API is quota-blocked):

- `GBP_ACCOUNT_NAME` (required in direct mode)
- `GBP_LOCATION_NAME` (required in direct mode)

Optional:

- `KL_ACCOUNTS_ENV_PATH` to override the default secret file path.

## Dry Run

```powershell
node scripts/sync-google-reviews.js --dry-run
```

## Validation Steps

1. Run sync command.
2. Confirm JSON updated in `data/google-reviews.json`.
3. Load local site and verify carousel content/filter counts.
4. If publishing, deploy and check live with cache-busting query strings.

## Quota-Blocked Discovery (Important)

If you get a 429 quota error for `mybusinessaccountmanagement.googleapis.com` and the message shows a `0/min` limit:

1. Use direct mode by setting both:
   - `GBP_ACCOUNT_NAME=accounts/...`
   - `GBP_LOCATION_NAME=locations/...`
2. Re-run `npm run reviews:sync-google`.
3. Request a quota increase for the account-management API in Google Cloud so auto-discovery can be used later.

The sync script now supports this direct mode and skips account discovery when both values are provided.

## Reuse Across Other Sites

Use this pattern for any static site in this machine:

1. Copy `scripts/sync-google-reviews.js` into that site's `scripts/` folder.
2. Add npm script:
   - `"reviews:sync-google": "node scripts/sync-google-reviews.js"`
3. Ensure that site's frontend reads from a JSON feed path (for example `./data/google-reviews.json`).
4. Reuse the same three OAuth secret variables if the same GBP account is intended, or set account/location selectors for each site.

## Specific Note For E:/KnightLogics-Client-Sites.code-workspace

For each client site folder in that workspace:

1. Add a per-site JSON target such as `data/google-reviews.json`.
2. Add one of these selector strategies per client:
   - explicit: `GBP_ACCOUNT_NAME` + `GBP_LOCATION_NAME`
   - fallback: `GBP_ACCOUNT_NAME` + `GBP_LOCATION_TITLE`
3. Keep shared OAuth app credentials centralized in `accounts.env`, but isolate selector values by site.

Recommended per-site env naming convention in `accounts.env`:

- `CLIENTA_GBP_ACCOUNT_NAME`
- `CLIENTA_GBP_LOCATION_NAME`
- `CLIENTB_GBP_ACCOUNT_NAME`
- `CLIENTB_GBP_LOCATION_NAME`

Then map those into `GBP_ACCOUNT_NAME` / `GBP_LOCATION_NAME` in the run shell before running sync.

Example:

```powershell
$env:GBP_ACCOUNT_NAME = $env:CLIENTA_GBP_ACCOUNT_NAME
$env:GBP_LOCATION_NAME = $env:CLIENTA_GBP_LOCATION_NAME
npm run reviews:sync-google
```

Reusable PowerShell wrapper pattern:

```powershell
function Invoke-ClientGbpSync {
   param(
      [Parameter(Mandatory = $true)] [string] $SitePath,
      [Parameter(Mandatory = $true)] [string] $AccountName,
      [Parameter(Mandatory = $true)] [string] $LocationName
   )

   Push-Location $SitePath
   try {
      $env:GBP_ACCOUNT_NAME = $AccountName
      $env:GBP_LOCATION_NAME = $LocationName
      npm run reviews:sync-google
   }
   finally {
      Pop-Location
   }
}
```

## Operational Notes

- This is pull-based dynamic data for static hosting.
- Schedule the sync command (Task Scheduler, CI, or deployment hook) for automatic freshness.
- Never store raw tokens or secrets in repo files.
