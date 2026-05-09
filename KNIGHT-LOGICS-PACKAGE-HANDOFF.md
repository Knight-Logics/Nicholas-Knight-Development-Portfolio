# Knight Logics Package Handoff

Generated from the Social Media Manager workspace on 2026-04-28 so the website-side work can be completed directly inside the AllProjects-Window2 workspace.

## Current GBP Product Set

- Website + Local SEO Starter Package — $1,997
- Google Business Profile Optimization — $297
- Monthly Local SEO Starter — $397/mo
- Free Website & SEO Audit — Free

## Important Consistency Note

Google Business Profile Optimization should use $297 everywhere on the website.

Google is still showing an older description on the live GBP product card that mentions $247. That mismatch could not be edited from the Google UI surface available in-session, so the website should treat $297 as the correct public number.

## Recommended Website Placement

Primary file:

- index.html

Exact insertion target:

- Insert the package section immediately after the existing services CTA block and before the Professional Work section.
- In the current file, that means placing it after the block that ends with Start with a Free Consultation / Review The Proof and before the comment for Professional Work Section.
- Current anchor region in source: around line 1037, before the section that begins near line 1041.

Why this spot:

- It keeps the package cards close to the website/SEO services narrative.
- It lands before the contact close, so the visitor sees concrete entry offers before deciding whether to reach out.
- It avoids burying the offers below unrelated portfolio material.

## CTA Direction

- Primary CTA target: /contact
- Keep the tone practical, low-friction, and specific.
- Do not use review-for-discount language on the site.

## Package Copy Summary

### Website + Local SEO Starter Package — $1,997

Hand-coded website work plus technical SEO and Google Business alignment for local businesses that need a stronger front door.

Include:

- custom website build or rebuild
- technical SEO, schema, and Search Console setup
- Google Business Profile alignment for local visibility

### Google Business Profile Optimization — $297

One-time GBP cleanup for businesses with a weak, incomplete, or underperforming listing.

Include:

- profile cleanup and offer positioning
- category, service, and conversion-path tuning
- local visibility best-practice pass

### Monthly Local SEO Starter — $397/mo

Light ongoing local SEO support for businesses that need steady cleanup and visibility work without a bloated retainer.

Include:

- ongoing local SEO cleanup and tuning
- website and GBP alignment checks
- practical next-step recommendations

### Free Website & SEO Audit — Free

Fast audit with direct findings on speed, visibility, calls to action, and local search issues.

Include:

- website review
- local SEO and GBP review
- practical next steps

## Ready-To-Paste Self-Contained HTML

This is the exact self-contained section generated for the site handoff. It can be pasted into index.html at the insertion point above.

```html
<section class="kl-package-section" id="starter-packages">
  <style>
    .kl-package-section {
      --kl-bg: #f5efe7;
      --kl-card: rgba(255, 255, 255, 0.92);
      --kl-ink: #181514;
      --kl-muted: #5a524d;
      --kl-accent: #9c312f;
      --kl-line: rgba(24, 21, 20, 0.1);
      padding: 88px 24px;
      background:
        radial-gradient(circle at 85% 12%, rgba(156, 49, 47, 0.14), transparent 18%),
        linear-gradient(180deg, #fbf7f1 0%, var(--kl-bg) 100%);
      color: var(--kl-ink);
    }

    .kl-package-shell {
      max-width: 1180px;
      margin: 0 auto;
    }

    .kl-package-intro {
      max-width: 760px;
      margin-bottom: 32px;
    }

    .kl-package-eyebrow {
      margin: 0 0 12px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--kl-accent);
    }

    .kl-package-intro h2 {
      margin: 0 0 14px;
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1.02;
    }

    .kl-package-intro p {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.65;
      color: var(--kl-muted);
    }

    .kl-package-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 22px;
    }

    .kl-package-card {
      position: relative;
      display: grid;
      gap: 18px;
      padding: 28px;
      border: 1px solid var(--kl-line);
      border-radius: 28px;
      background: var(--kl-card);
      box-shadow: 0 22px 44px rgba(24, 21, 20, 0.08);
    }

    .kl-package-card--featured {
      background: linear-gradient(180deg, rgba(156, 49, 47, 0.08), rgba(255, 255, 255, 0.96));
      border-color: rgba(156, 49, 47, 0.22);
    }

    .kl-package-tag {
      width: fit-content;
      padding: 7px 11px;
      border-radius: 999px;
      background: rgba(156, 49, 47, 0.12);
      color: var(--kl-accent);
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .kl-package-head h3 {
      margin: 0 0 8px;
      font-size: 1.35rem;
      line-height: 1.2;
    }

    .kl-package-price {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
    }

    .kl-package-desc {
      margin: 0;
      color: var(--kl-muted);
      line-height: 1.65;
    }

    .kl-package-points {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 10px;
      color: var(--kl-ink);
    }

    .kl-package-points li {
      padding-left: 18px;
      position: relative;
      line-height: 1.5;
    }

    .kl-package-points li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.6em;
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--kl-accent);
    }

    .kl-package-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-width: 180px;
      padding: 12px 18px;
      border-radius: 999px;
      background: var(--kl-accent);
      color: #fff;
      font-weight: 700;
      text-decoration: none;
    }

    .kl-package-note {
      margin-top: 20px;
      font-size: 0.96rem;
      color: var(--kl-muted);
    }

    @media (max-width: 700px) {
      .kl-package-section {
        padding: 72px 18px;
      }

      .kl-package-card {
        padding: 24px;
      }
    }
  </style>

  <div class="kl-package-shell">
    <div class="kl-package-intro">
      <p class="kl-package-eyebrow">Starter Packages</p>
      <h2>Clear entry points for businesses that need a better website or stronger local visibility.</h2>
      <p>These are the easiest ways to start with Knight Logics. If your project needs a custom scope, use the same contact form and ask for a tailored quote.</p>
    </div>

    <div class="kl-package-grid">
      <article class="kl-package-card kl-package-card--featured">
        <div class="kl-package-tag">Most Popular</div>
        <div class="kl-package-head">
          <h3>Website + Local SEO Starter Package</h3>
          <p class="kl-package-price">$1,997</p>
        </div>
        <p class="kl-package-desc">Hand-coded website work plus technical SEO and Google Business alignment for local businesses that need a stronger front door.</p>
        <ul class="kl-package-points">
          <li>Custom website build or rebuild</li>
          <li>Technical SEO, schema, and Search Console setup</li>
          <li>Google Business Profile alignment for local visibility</li>
        </ul>
        <a class="kl-package-cta" href="/contact">Start This Package</a>
      </article>

      <article class="kl-package-card">
        <div class="kl-package-tag">One-Time Fix</div>
        <div class="kl-package-head">
          <h3>Google Business Profile Optimization</h3>
          <p class="kl-package-price">$297</p>
        </div>
        <p class="kl-package-desc">One-time GBP cleanup for businesses with a weak, incomplete, or underperforming listing.</p>
        <ul class="kl-package-points">
          <li>Profile cleanup and offer positioning</li>
          <li>Category, service, and conversion-path tuning</li>
          <li>Local visibility best-practice pass</li>
        </ul>
        <a class="kl-package-cta" href="/contact">Fix My GBP</a>
      </article>

      <article class="kl-package-card">
        <div class="kl-package-tag">Ongoing Support</div>
        <div class="kl-package-head">
          <h3>Monthly Local SEO Starter</h3>
          <p class="kl-package-price">$397/mo</p>
        </div>
        <p class="kl-package-desc">Light ongoing local SEO support for businesses that need steady cleanup and visibility work without a bloated retainer.</p>
        <ul class="kl-package-points">
          <li>Ongoing local SEO cleanup and tuning</li>
          <li>Website and GBP alignment checks</li>
          <li>Practical next-step recommendations</li>
        </ul>
        <a class="kl-package-cta" href="/contact">Ask About Monthly SEO</a>
      </article>

      <article class="kl-package-card">
        <div class="kl-package-tag">No-Risk Start</div>
        <div class="kl-package-head">
          <h3>Free Website &amp; SEO Audit</h3>
          <p class="kl-package-price">Free</p>
        </div>
        <p class="kl-package-desc">Fast audit with direct findings on speed, visibility, calls to action, and local search issues.</p>
        <ul class="kl-package-points">
          <li>Website review</li>
          <li>Local SEO and GBP review</li>
          <li>Practical next steps</li>
        </ul>
        <a class="kl-package-cta" href="/contact">Request Free Audit</a>
      </article>
    </div>

    <p class="kl-package-note">Free consultation. 24-hour response. Custom scope is available if your project does not fit a starter package.</p>
  </div>
</section>
```

## Suggested Implementation Order

1. Paste the section into index.html at the insertion point above.
2. Confirm button hrefs stay on /contact.
3. Adjust any spacing to match the existing home page rhythm if needed.
4. Keep the website copy aligned with the prices listed in this file, even if Google still shows the stale $247 description on one GBP card.