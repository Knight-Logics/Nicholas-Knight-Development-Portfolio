# New Site Session Kickoff Template

Paste this (or the relevant site block) at the start of a new Copilot Chat session to get full context instantly.

---

## How to Use

1. Open a **new Copilot Chat** window (keep this one open for Knight Logics)
2. Paste the **Global Context** block + the specific **Site Block** for the site you're working on
3. The session will pick up with full awareness of what we've already done and the standard we're building to

---

## Global Context (paste in every new session)

```
I'm Nicholas Knight, owner of Knight Logics — a small web/automation agency in Tampa Bay.
I have multiple client and brand websites I'm optimizing. Each site gets its own chat session.
I have a reference guide at: KnightLogics-clean-sync/WEB_OPTIMIZATION_REFERENCE.md covering all standard techniques.

Standard optimization checklist we apply to every site:
- JSON-LD structured data (LocalBusiness or relevant type, Breadcrumbs on inner pages)
- Full SEO metadata: title, meta description, canonical, og:, twitter: on every page
- Clean/extensionless URLs site-wide (hrefs, canonicals, og:url, JSON-LD, sitemap)
- Sitemap.xml with current lastmod dates, submitted to Google Search Console + Bing Webmaster Tools
- robots.txt with Sitemap: reference
- HTML encoding: no mojibake (â€" etc.) — use HTML entities
- Mobile-first responsive CSS, touch-action:manipulation on interactive elements
- Nav dropdowns: hover on desktop (guarded by matchMedia hover:hover), touchend on mobile
- PageSpeed/Core Web Vitals: images as .webp with width/height attrs, loading=lazy below fold
- Google Reviews section: static HTML with Google G logo SVG, stars, CTA to g.page review link
- Microsoft Clarity tracking snippet on all pages

My key rules:
- Never auto-push. Show me changes, then I confirm before git push.
- Never create new HTML/CSS files unless I ask. Edit existing files only.
- Don't add docstrings, comments, or unnecessary abstractions.
```

---

## Site Blocks

### Knight Logics (knightlogics.com) — KEEP THIS CHAT OPEN, don't start a new one
```
Site: knightlogics.com
Repo local path: c:\Users\nknig\Downloads\KnightLogics-clean-sync
GitHub: Knight-Logics/Nicholas-Knight-Development-Portfolio (main branch → GitHub Pages)
Last commit: 2eb248a — mobile nav touch fix
Status: Fully optimized through April 2026 session. See WEB_OPTIMIZATION_REFERENCE.md in repo.
Pending: GSC sitemap resubmission, Bing WMT setup, real Google reviews when available.
```

---

### JNS Construction Services (jnsbuilds.com)
```
Site: jnsbuilds.com (client site)
Repo local path: c:\Users\nknig\Downloads\JNSConstruction\jnsconstructionservicesllcwebiste
GitHub: JNS-Construction-Services/JNSBuilds-Website (main branch → GitHub Pages)
DNS: Namecheap (4 A records + CNAME www)
Single stylesheet: styles.css. No separate JS file for nav.
Placeholder values still to fix:
  - Phone: (555) 010-0000 — needs real number from client
  - Email: projects@jnsconstructionfl.com (confirmed)
  - Social links: placeholder # hrefs in footer
  - Google Maps embed: placeholder src
  - og:image: needs real image URL
Schema type to use: GeneralContractor (LocalBusiness subtype)
Service pages exist: general-construction, renovations-upgrades, repairs-corrective-work, project-coordination
Policy pages exist: privacy-policy, terms-of-service, cookie-policy, disclaimer, refund-policy
CSS breakpoints: 720px, 600px, 420px, 400px — mobile-first
CSS rules: use clamp() for fonts, no hardcoded px at single breakpoints, hero min-height:60vh no max-height
What we need to do: Full optimization pass — same checklist as KL (JSON-LD, clean URLs, SEO meta audit, mobile nav, Clarity, GSC, Bing)
```

---

### Knight Group Website (knightgroup domain)
```
Site: Knight Group (photography/creative business)
Repo local path: e:\KnightGroupWebsite
Has: _headers file (Netlify-style headers), 404.html, gallery pages, contact, about
Header/footer: separate partial HTML files (header.html, footer.html)
What we need to do: Full optimization pass — same checklist as KL
```

---

## Reference: Standard JSON-LD for a Local Business Homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "url": "https://yourdomain.com",
  "telephone": "+18005550100",
  "email": "contact@yourdomain.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "City",
    "addressRegion": "FL",
    "addressCountry": "US"
  },
  "areaServed": ["City", "Nearby City"],
  "sameAs": [
    "https://www.facebook.com/yourpage",
    "https://www.instagram.com/yourpage"
  ]
}
</script>
```

## Reference: Google Review CTA Button (before you have reviews)

```html
<a href="https://g.page/r/{PLACE_ID}/review" target="_blank" rel="noopener noreferrer" class="google-review-btn">
    <!-- Google G SVG logo here -->
    Leave a Review on Google
</a>
```
Replace `{PLACE_ID}` with the ID from the Google Business Profile review link.

## Reference: Mobile Nav Touch Fix Pattern

```js
const desktopHover = window.matchMedia('(hover: hover) and (pointer: fine)');

dropdown.addEventListener('mouseenter', () => {
    if (desktopHover.matches) dropdown.classList.add('active');
});
dropdown.addEventListener('mouseleave', () => {
    if (desktopHover.matches) dropdown.classList.remove('active');
});
toggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('active');
    closeAllDropdowns();
    if (!isOpen) dropdown.classList.add('active');
});
toggle.addEventListener('click', (e) => {
    if (desktopHover.matches) return;
    e.preventDefault();
    dropdown.classList.toggle('active');
});
```

In the navLinks click handler, guard dropdown toggles:
```js
link.addEventListener('click', () => {
    if (link.classList.contains('nav-dropdown-toggle')) return;
    // close mobile menu...
});
```
