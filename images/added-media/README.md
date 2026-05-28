# Added Media Workflow

This folder is now part of the Knight Logics X proof-content pipeline.

What belongs here:
- website screenshots
- application or tool UI screenshots
- dashboard screenshots
- referral system screens
- profile or portfolio proof screens
- branded collateral like cards, shirts, and yard signs
- short demo videos

How the pipeline uses this folder:
- `node ..\..\Social\X-Runner\refresh_media_library.js --apply` indexes these files into the X media catalog
- `node ..\..\Social\X-Runner\seed_queue_posts.js --repair-ready` repairs existing seeded posts and adds new proof-oriented seed templates from indexed assets
- `node ..\..\Social\X-Runner\select_media_for_posts.js --force --apply --top=1` re-scores ready non-URL posts

Default refresh sequence when more media is added here:
1. Drop more screenshots or videos into `added-media`
2. Run `node ..\..\Social\X-Runner\refresh_media_library.js --apply`
3. Run `node ..\..\Social\X-Runner\seed_queue_posts.js --repair-ready`

Naming guidance:
- Natural names work now. Examples already in this folder are usable.
- Better names help the strategy layer infer the right angle faster.

Recommended pattern when practical:
- Project Name + proof type + subject

Examples:
- `Display Control+ Dashboard Presets.png`
- `PixelForge AI Before After Upscale.png`
- `Referral System Checkout Options.png`
- `Knight Logics Lighthouse Mobile.png`
- `Screen Team Yard Signs.png`

What helps inference most:
- include the project name
- include the proof type: page, dashboard, workflow, lighthouse, indexing, profile, business card, yard sign, shirt, video, referral
- include what the screen proves, not just a generic screen number

Optional sidecar metadata:
- Add a `.json` file next to any image or video with the same base name if you want tighter control.

Example:
```json
{
  "project": "display-control-plus",
  "pillar": "product-ui",
  "title": "Display Control+ Preset Grid",
  "description": "Preset grid for multi-monitor layout switching.",
  "tags": ["multi monitor", "windows", "desktop app", "productivity"],
  "suggested_angle": "product_demo"
}
```