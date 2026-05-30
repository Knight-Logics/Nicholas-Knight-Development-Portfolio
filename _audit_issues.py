import os, re, json

base = r'E:\KnightLogics-Growth-System\MainSite'
pages = sorted([f for f in os.listdir(base) if f.endswith('.html') and f not in ('404.html','header.html','footer.html','null')])

# ── 1. Build link map: which pages are linked from where ──────────────
incoming = {p: [] for p in pages}
outgoing_redirects = {}  # page -> list of redirect-looking urls
http_links = {}          # page -> list of http:// links

for f in pages:
    raw = open(os.path.join(base, f), encoding='utf-8', errors='ignore').read()
    hrefs = re.findall(r'href=["\']([^"\'#\s]+)["\']', raw)
    for href in hrefs:
        slug = href.lstrip('/').replace('.html','').rstrip('/')
        target = slug + '.html'
        if target in incoming:
            incoming[target].append(f)
        # HTTP links
        if href.startswith('http://'):
            http_links.setdefault(f, []).append(href)

# ── 2. Orphan pages ───────────────────────────────────────────────────
print('=== ORPHAN PAGES (no incoming internal links) ===')
for p, srcs in incoming.items():
    if not srcs:
        print(f'  {p}')

# ── 3. Noindex pages ──────────────────────────────────────────────────
print('\n=== NOINDEX META TAGS ===')
for f in pages:
    raw = open(os.path.join(base, f), encoding='utf-8', errors='ignore').read()
    if re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex', raw, re.I) or \
       re.search(r'<meta[^>]+content=["\'][^"\']*noindex[^"\']*["\'][^>]*name=["\']robots["\']', raw, re.I):
        print(f'  NOINDEX: {f}')

# ── 4. Sitemap pages ──────────────────────────────────────────────────
sitemap_path = os.path.join(base, 'sitemap.xml')
sitemap_slugs = set()
if os.path.exists(sitemap_path):
    sm = open(sitemap_path, encoding='utf-8').read()
    for url in re.findall(r'<loc>([^<]+)</loc>', sm):
        slug = url.rstrip('/').split('/')[-1] or 'index'
        sitemap_slugs.add(slug)
print(f'\n=== SITEMAP URLS ({len(sitemap_slugs)}) ===')
for s in sorted(sitemap_slugs):
    print(f'  {s}')

# ── 5. Meta descriptions ──────────────────────────────────────────────
print('\n=== LONG META DESCRIPTIONS (>160 chars) ===')
for f in pages:
    raw = open(os.path.join(base, f), encoding='utf-8', errors='ignore').read()
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', raw, re.I)
    if not m:
        m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']', raw, re.I)
    if m:
        desc = m.group(1).strip()
        if len(desc) > 160:
            print(f'  {f}: {len(desc)} chars — "{desc[:80]}..."')

# ── 6. HTTP links ─────────────────────────────────────────────────────
print('\n=== HTTP (non-HTTPS) LINKS ===')
for f, hrefs in sorted(http_links.items()):
    for h in hrefs:
        print(f'  {f}: {h}')

# ── 7. Missing alt text ───────────────────────────────────────────────
print('\n=== IMG TAGS MISSING ALT ===')
for f in pages + ['header.html', 'footer.html']:
    fp = os.path.join(base, f)
    if not os.path.exists(fp): continue
    raw = open(fp, encoding='utf-8', errors='ignore').read()
    for img in re.findall(r'<img[^>]+>', raw, re.I):
        if 'alt=' not in img.lower():
            print(f'  {f}: {img[:120]}')

# ── 8. Incoming internal link count per page ─────────────────────────
print('\n=== PAGES WITH <=1 INTERNAL INCOMING LINKS ===')
for p, srcs in sorted(incoming.items()):
    if len(srcs) <= 1:
        print(f'  {len(srcs)} links -> {p}  [from: {", ".join(srcs[:3])}]')
