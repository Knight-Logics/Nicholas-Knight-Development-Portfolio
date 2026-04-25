# Web Optimization Reference Guide

Techniques applied across Knight Logics and client sites. Use this as a checklist for any new static site build or SEO audit.

---

## 1. Structured Data (JSON-LD)

Schema markup tells search engines exactly what your page represents — it powers rich results (star ratings, business info in the Knowledge Panel, breadcrumbs in SERPs).

### LocalBusiness / GeneralContractor / Service
Place in `<head>` with `<script type="application/ld+json">`.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "url": "https://yourdomain.com",
  "telephone": "+18005550100",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tampa",
    "addressRegion": "FL",
    "addressCountry": "US"
  }
}
```

**Types to use by page:**
- Homepage → `LocalBusiness`, `GeneralContractor`, `ProfessionalService`, or the closest match
- Service pages → `Service` with `provider` referencing the business
- Blog/article → `Article`
- Product pages → `Product` + `AggregateRating`

### Breadcrumbs
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourdomain.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://yourdomain.com/services" }
  ]
}
```

### AggregateRating (for Google Reviews)
Only add once you have real reviews. Google will validate the count.
```json
{
  "@type": "AggregateRating",
  "ratingValue": "5",
  "reviewCount": "12"
}
```

**Validate:** https://search.google.com/test/rich-results

---

## 2. SEO Metadata — Every Page Must Have

```html
<title>Page Title — Brand Name</title>
<meta name="description" content="150–160 char description with primary keyword.">
<link rel="canonical" href="https://yourdomain.com/page">

<!-- Open Graph (controls how links look when shared on social/Slack/iMessage) -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:url" content="https://yourdomain.com/page">
<meta property="og:image" content="https://yourdomain.com/images/social-preview.png">
<meta property="og:type" content="website">

<!-- Twitter/X card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:image" content="https://yourdomain.com/images/social-preview.png">
```

**Rules:**
- `canonical` and `og:url` must match exactly — no trailing slash inconsistency, no `.html` if you use clean URLs
- `og:image` should be at least 1200×630px, under 5MB, served over HTTPS
- Only one `<h1>` per page — the page's primary topic, not the brand name

---

## 3. Clean / Extensionless URLs

Removing `.html` from URLs makes them look professional and is better for SEO (fewer duplicate URL variants).

| Where | Before | After |
|---|---|---|
| `<a href>` | `./about.html` | `/about` |
| `<link rel="canonical">` | `.../about.html` | `.../about` |
| `og:url` | `.../about.html` | `.../about` |
| JSON-LD `"url"/"@id"` | `.../about.html` | `.../about` |
| `sitemap.xml <loc>` | `.../about.html` | `.../about` |

**Hosting support:**
- GitHub Pages: ✅ built-in — `/about` resolves to `about.html` automatically
- Netlify: ✅ built-in
- Apache/Nginx: requires `.htaccess` or `try_files` rule
- Local dev (Live Server / `python -m http.server`): ❌ use `npx serve .` instead

---

## 4. Sitemap.xml

Tells search engines all pages that exist and when they were last changed.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- Update `<lastmod>` whenever content changes on that page
- Submit via Google Search Console and Bing Webmaster Tools
- Reference in `robots.txt`: `Sitemap: https://yourdomain.com/sitemap.xml`

---

## 5. Robots.txt

Controls what crawlers can and can't index.

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://yourdomain.com/sitemap.xml
```

- Keep it minimal — don't block anything you want indexed
- Always include the `Sitemap:` line

---

## 6. Google Search Console

The primary tool for monitoring a site's presence in Google Search.

**Setup steps:**
1. Go to https://search.google.com/search-console
2. Add property → Domain or URL prefix
3. Verify via DNS TXT record (most reliable) or HTML file/tag
4. Submit sitemap: Sitemaps → enter `sitemap.xml` → Submit
5. Use URL Inspection to force-index new/updated pages

**Key reports to check regularly:**
- Coverage → see indexing errors
- Core Web Vitals → real-user performance data
- Search results → queries, impressions, CTR

---

## 7. Bing Webmaster Tools

Bing (and by extension DuckDuckGo and Yahoo) has its own separate index. Don't ignore it.

**Setup:** https://www.bing.com/webmasters

- Import your Google Search Console property directly — one-click import of sitemap and verified ownership
- Submit sitemap separately
- Use URL Submission to force-crawl new pages (Bing allows up to 10/day free, more via IndexNow)

**IndexNow:** A protocol that notifies Bing (and Yandex) instantly when a page is published or updated. Add the IndexNow API endpoint to your deployment workflow if automating.

---

## 8. Microsoft Clarity

Free session recording and heatmap tool — shows exactly how real users interact with your site.

**Setup:**
1. Create project at https://clarity.microsoft.com
2. Paste the JS snippet into every page's `<head>` (or via GTM)
3. Automatically integrates with Google Analytics if you have it

**What to watch:**
- Dead clicks (users tapping things that aren't links)
- Rage clicks (frustrated repeated taps — indicates broken interactions)
- Scroll depth (how far users get before leaving)
- Session recordings on mobile vs desktop separately

---

## 9. PageSpeed Insights / Core Web Vitals

Google uses Core Web Vitals as a ranking signal. Target: **green (90+) on mobile**.

**Primary metrics:**
| Metric | What it measures | Target |
|---|---|---|
| LCP | Largest Contentful Paint — when does the main content appear? | < 2.5s |
| CLS | Cumulative Layout Shift — does content jump around? | < 0.1 |
| INP | Interaction to Next Paint — do taps/clicks respond quickly? | < 200ms |

**Quick wins:**
- Convert images to `.webp`, add `width` and `height` attributes, use `loading="lazy"` on below-fold images
- Inline critical CSS; defer non-critical CSS
- Add `<link rel="preconnect">` for external font/CDN domains
- Use `font-display: swap` on custom fonts
- Minify JS and CSS for production

**Test:** https://pagespeed.web.dev

---

## 10. Progressive Web App (PWA)

Adding a manifest and service worker lets mobile users install your site as an app-like shortcut and can improve return visits.

**Minimum setup:**
```html
<!-- In <head> -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0a0a0a">
```

```json
// manifest.json
{
  "name": "Your Site Name",
  "short_name": "ShortName",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/images/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

A minimal service worker caches assets for offline use and faster repeat loads.

---

## 11. Mobile Touch Optimization

### Touch vs Mouse event model
On touchscreen devices, tapping fires events in this order: `touchstart` → `touchend` → (300ms delay) → `mouseenter` → `mouseleave` → `click`

The 300ms delay and ghost `mouseenter` cause bugs in hover-based nav dropdowns. **Fix:**

```js
// Gate hover behavior to real pointer devices only
const isHoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)');

dropdown.addEventListener('mouseenter', () => {
    if (isHoverDevice.matches) dropdown.classList.add('active');
});

// Use touchend (not click) for instant touch response
toggle.addEventListener('touchend', (e) => {
    e.preventDefault(); // cancels the ghost click that follows
    dropdown.classList.toggle('active');
});
```

### Eliminate 300ms tap delay
```css
.interactive-element {
    touch-action: manipulation; /* tells browser this won't use double-tap zoom */
}
```

Apply to: buttons, nav links, dropdown toggles, form submit buttons, any tappable element.

### Target sizes
Minimum tap target: **48×48px** (Google's recommendation). Anything smaller causes mis-taps on mobile. Use `padding` to extend the touch area without changing visual size.

---

## 12. Google Reviews — Static vs Third-Party Widget

**If you have no reviews yet:**
Build static HTML with the Google "Leave a Review" CTA button. Link to `https://g.page/r/{PLACE_ID}/review`. No third-party JS needed, no performance hit.

**When you have reviews:**
- **Free approach:** Trustindex.io — free widget, paste JS embed, auto-pulls from Google Business Profile
- **Paid/advanced:** Elfsight, ReviewsOnMyWebsite — more customization
- **DIY/API:** Google Places API requires billing enabled even for low-volume use

**Why not WordPress-style plugins:**
WordPress review plugins (Trustindex WP, etc.) are PHP-based — they're not portable to static HTML sites. The embed widget version from Trustindex.io works anywhere.

**SEO note:** Add `AggregateRating` JSON-LD to `<head>` once you have reviews — it can trigger star ratings in search results.

---

## 13. HTML Encoding — Avoiding Mojibake

Mojibake is garbled text caused by reading a file with the wrong encoding (typically UTF-8 content read as Windows-1252 or Latin-1).

**Common patterns and their fixes:**

| Broken display | What it should be | HTML entity |
|---|---|---|
| `â€"` | — (em dash) | `&mdash;` |
| `â€"` | – (en dash) | `&ndash;` |
| `â†'` | → (right arrow) | `&rarr;` |
| `â€˜` | ' (left single quote) | `&lsquo;` |
| `â€™` | ' (right single quote) | `&rsquo;` |
| `â€œ` | " (left double quote) | `&ldquo;` |
| `â€` | " (right double quote) | `&rdquo;` |

**Prevention:** Always save HTML files as **UTF-8 without BOM**. Set `<meta charset="UTF-8">` as the first element inside `<head>`. Use HTML entities for any typographic characters instead of pasting them directly.

---

## 14. CSS Responsive Patterns

### Use `clamp()` for fluid font sizes
```css
/* Fluid: min 1rem at narrow, max 1.5rem at wide, scales between */
font-size: clamp(1rem, 2.5vw, 1.5rem);
```

### Standard breakpoints (mobile-first)
```css
/* Base = mobile */
.element { ... }

/* Tablet+ */
@media (min-width: 600px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }
```

### Specificity traps to avoid
- Modifier classes (`.grid--4col`) are higher specificity than `.grid` — include modifier variants in *every* breakpoint override, not just the base rule
- High-specificity parent wrappers (`.section-services .container`) won't be overridden by a generic `.container` mobile rule — write a specific override

### `touch-action: manipulation` on all interactive controls
Eliminates the 300ms tap delay on iOS without requiring a polyfill. Apply broadly to buttons, links, and form elements.

---

## 15. Nav Dropdown Pattern — Desktop Hover + Mobile Touch

The correct pattern for a nav that works on both mouse and touchscreen:

```js
const desktopHover = window.matchMedia('(hover: hover) and (pointer: fine)');

// Desktop: hover
dropdown.addEventListener('mouseenter', () => {
    if (desktopHover.matches) dropdown.classList.add('active');
});
dropdown.addEventListener('mouseleave', () => {
    if (desktopHover.matches) dropdown.classList.remove('active');
});

// Mobile: instant tap via touchend
toggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('active');
    closeAllDropdowns();
    if (!isOpen) dropdown.classList.add('active');
});

// Mouse click fallback (keyboard nav, non-hover pointer devices)
toggle.addEventListener('click', (e) => {
    if (desktopHover.matches) return;
    e.preventDefault();
    dropdown.classList.toggle('active');
});
```

**Important:** In the navLinks click handler that closes the mobile menu, add a guard so dropdown toggles don't accidentally close the whole nav:
```js
link.addEventListener('click', () => {
    if (link.classList.contains('nav-dropdown-toggle')) return;
    // close menu logic...
});
```
