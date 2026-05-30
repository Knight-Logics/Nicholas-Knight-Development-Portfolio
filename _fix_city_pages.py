"""
One-shot transformation for all 3 city landing pages.
Fixes: JSON-LD encoding, HTML entity safety, article max-width,
       image height/object-fit, responsive grids, hero CTA+form.
"""
import re

CITY_HERO_STYLE = """
    <style>
        .city-hero-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 330px;
            gap: 40px;
            align-items: start;
            margin-top: 24px;
        }
        .city-hero-form-shell { width: 100%; }
        .city-hero-form-card {
            background: rgba(7, 18, 30, .90);
            border: 1px solid rgba(100, 255, 218, .22);
            border-radius: 20px;
            padding: 22px 24px;
            backdrop-filter: blur(14px);
        }
        .city-form-group { margin-bottom: 11px; }
        .city-form-group label {
            display: block;
            margin-bottom: 3px;
            font-size: .82rem;
            color: rgba(100, 255, 218, .92);
        }
        .city-form-group input,
        .city-form-group select,
        .city-form-group textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 8px 11px;
            border-radius: 8px;
            background: rgba(255, 255, 255, .11);
            border: 1px solid rgba(100, 255, 218, .28);
            color: #fff;
            font-size: .9rem;
            font-family: inherit;
        }
        .city-form-group textarea { min-height: 70px; resize: vertical; }
        .city-form-submit {
            width: 100%;
            padding: 13px;
            border: 0;
            border-radius: 10px;
            background: linear-gradient(135deg, #64ffda, #4ecdc4);
            color: #0a0a0a;
            font-weight: 700;
            font-size: .95rem;
            cursor: pointer;
            margin-top: 8px;
            font-family: inherit;
        }
        @media (max-width: 900px) {
            .city-hero-layout { grid-template-columns: 1fr; }
            .city-hero-form-shell { display: none; }
        }
        /* Responsive grids inside article */
        .city-grid-2col {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
        }
        .city-industries-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 8px 24px;
        }
    </style>"""

PAGES = [
    {
        'file': 'web-designer-tampa.html',
        'breadcrumb_label': 'Website Designer Tampa FL',
        'h1': 'Web Design for Tampa, FL &mdash; Built for a More Competitive Local Market',
        'subtext': ('Tampa businesses compete across a large metro, against more aggressive local SEO setups, '
                    'and in markets where being mediocre online is enough to lose to a smaller competitor with a '
                    'better-structured site. Knight Logics builds hand-coded sites that are fast, locally targeted, '
                    'and built to convert &mdash; without the CMS overhead that holds rankings back.'),
        'form_source': 'Tampa city landing page hero form',
    },
    {
        'file': 'web-designer-clearwater.html',
        'breadcrumb_label': 'Web Developer Clearwater FL',
        'h1': 'Web Design for Clearwater, FL &mdash; Clean, Fast, and Built for Pinellas County Search',
        'subtext': ('Clearwater service businesses compete against a mix of local operators, franchise sites, and '
                    'builder templates in a market where the first handful of results gets nearly all the clicks. '
                    'Knight Logics builds hand-coded, fast-loading sites with proper local structure so Clearwater '
                    'businesses aren&rsquo;t invisible to people already searching for what they offer.'),
        'form_source': 'Clearwater city landing page hero form',
    },
    {
        'file': 'web-designer-st-petersburg.html',
        'breadcrumb_label': 'Website Design St. Petersburg FL',
        'h1': 'Web Design for St. Petersburg, FL &mdash; Custom, Fast, and Built to Rank',
        'subtext': ('St. Petersburg businesses compete for attention across search, mobile, and word-of-mouth. '
                    'A site that loads slowly, buries its CTAs, or lacks local SEO structure doesn&rsquo;t just '
                    'look bad &mdash; it actively costs you leads. Knight Logics builds hand-coded sites that are '
                    'fast, indexed properly, and structured to convert from the first visit.'),
        'form_source': 'St. Pete city landing page hero form',
    },
]


def fix_jsonld_encoding(text):
    """Escape non-ASCII chars inside JSON-LD <script> blocks."""
    def replacer(m):
        block = m.group(0)
        # Em dash U+2014, en dash U+2013, arrow U+2192
        block = block.replace('\u2014', r'\u2014')
        block = block.replace('\u2013', r'\u2013')
        block = block.replace('\u2192', r'\u2192')
        return block
    return re.sub(
        r'<script\s+type="application/ld\+json">.*?</script>',
        replacer, text, flags=re.DOTALL
    )


def fix_html_encoding(text):
    """Replace bare Unicode chars outside <script> blocks with HTML entities."""
    # Split on script blocks to avoid double-processing JSON-LD we just fixed
    parts = re.split(r'(<script\b[^>]*>.*?</script>)', text, flags=re.DOTALL)
    out = []
    for part in parts:
        if part.startswith('<script'):
            out.append(part)
        else:
            part = part.replace('\u2014', '&mdash;')
            part = part.replace('\u2013', '&ndash;')
            part = part.replace('\u2192', '&rarr;')
            out.append(part)
    return ''.join(out)


def add_style_block(text):
    """Insert city hero <style> block just before </head>."""
    if 'city-hero-layout' in text:
        return text  # already present
    return text.replace('</head>', CITY_HERO_STYLE + '\n</head>', 1)


def build_hero(page):
    """Return the full replacement hero HTML for a city page."""
    source = page['form_source']
    return f"""    <section class="cs-hero" style="padding: 80px 0 60px; background: linear-gradient(160deg, #050a14 0%, #0a1628 100%);">
        <div class="container" style="max-width: 1100px;">
            <nav aria-label="Breadcrumb" class="cs-breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/service-websites">Custom Websites</a>
                <span>/</span>
                <span>{page['breadcrumb_label']}</span>
            </nav>
            <div class="city-hero-layout">
                <div>
                    <h1 style="font-size: clamp(1.9rem, 4vw, 2.8rem); margin: 0 0 18px; line-height: 1.2;">{page['h1']}</h1>
                    <p style="font-size: 1.08rem; color: #a8b2c8; line-height: 1.7; margin-bottom: 28px;">{page['subtext']}</p>
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <a href="/free-website-audit" class="services-panel-link">Get a Free Audit</a>
                        <a href="/contact" class="services-panel-link" style="background:transparent; border:1px solid rgba(100,255,218,.4);">Talk to Nicholas &rarr;</a>
                    </div>
                </div>
                <aside class="city-hero-form-shell" aria-label="Contact Knight Logics">
                    <div class="city-hero-form-card">
                        <div style="margin-bottom:16px;">
                            <span style="display:inline-flex;align-items:center;padding:5px 12px;border-radius:999px;background:rgba(100,255,218,.1);border:1px solid rgba(100,255,218,.2);color:#64ffda;font-size:.76rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;">Get in Touch</span>
                            <h2 style="margin:12px 0 6px;font-size:1.1rem;color:#fff;line-height:1.15;">Talk Through Your Project</h2>
                            <p style="margin:0;color:rgba(255,255,255,.72);font-size:.86rem;line-height:1.35;">Need a stronger site or better rankings? Start here.</p>
                        </div>
                        <form class="consultation-form" action="https://formspree.io/f/xnnggyzp" method="POST">
                            <div class="city-form-group">
                                <label for="cityBusiness_{source[:3].replace(' ','')}">Business Name</label>
                                <input type="text" id="cityBusiness_{source[:3].replace(' ','')}" name="businessName" placeholder="Your business name" required>
                            </div>
                            <div class="city-form-group">
                                <label for="cityName_{source[:3].replace(' ','')}">Your Name</label>
                                <input type="text" id="cityName_{source[:3].replace(' ','')}" name="contactName" placeholder="First and last name" required>
                            </div>
                            <div class="city-form-group">
                                <label for="cityEmail_{source[:3].replace(' ','')}">Email</label>
                                <input type="email" id="cityEmail_{source[:3].replace(' ','')}" name="email" placeholder="you@example.com" required>
                            </div>
                            <div class="city-form-group">
                                <label for="cityService_{source[:3].replace(' ','')}">What do you need?</label>
                                <select id="cityService_{source[:3].replace(' ','')}" name="serviceType" required>
                                    <option value="">Select a service...</option>
                                    <option value="website">New Website / Redesign</option>
                                    <option value="seo">Local SEO &amp; Google Business</option>
                                    <option value="audit">Free Website Audit</option>
                                    <option value="automation">Business Automation</option>
                                    <option value="other">Other / Consultation</option>
                                </select>
                            </div>
                            <div class="city-form-group">
                                <label for="cityDetails_{source[:3].replace(' ','')}">Project Details (optional)</label>
                                <textarea id="cityDetails_{source[:3].replace(' ','')}" name="projectDetails" placeholder="What&rsquo;s the goal?"></textarea>
                            </div>
                            <input type="hidden" name="source" value="{source}">
                            <button type="submit" class="city-form-submit">Send My Request</button>
                        </form>
                    </div>
                </aside>
            </div>
        </div>
    </section>"""


def replace_hero(text, page):
    """Replace the existing cs-hero section with the new 2-column version."""
    # Match the entire <section class="cs-hero"...>...</section>
    pattern = r'<section class="cs-hero"[^>]*>.*?</section>'
    new_hero = build_hero(page)
    result, count = re.subn(pattern, new_hero, text, count=1, flags=re.DOTALL)
    if count == 0:
        print(f'  WARNING: hero section not found in {page["file"]}')
    return result


def fix_article_maxwidth(text):
    """Widen article container from 780px to 1040px."""
    return text.replace(
        'max-width: 780px; line-height: 1.8; color: #a8b2c8;',
        'max-width: 1040px; line-height: 1.8; color: #a8b2c8;'
    )


def fix_screenshot_images(text):
    """Add consistent height + object-fit to portfolio screenshot images."""
    # Target the 4 client site screenshots (not lighthouse or gbp images)
    screenshot_imgs = [
        'screen-team-site.webp',
        'jns-site.webp',
        'knight-group-site.webp',
        'moms-resin-site.webp',
    ]
    old_style = 'style="width:100%; border-radius:6px; border:1px solid rgba(100,255,218,.15); display:block; margin-bottom:12px;"'
    new_style = 'style="width:100%; height:360px; object-fit:cover; object-position:top center; border-radius:6px; border:1px solid rgba(100,255,218,.15); display:block; margin-bottom:12px;"'
    # Only replace for screenshot images
    for img in screenshot_imgs:
        # Find img tags with this src
        pattern = rf'(<img[^>]+{re.escape(img)}[^>]+){re.escape(old_style)}([^>]*>)'
        text = re.sub(pattern, lambda m: m.group(1) + new_style + m.group(2), text)
    return text


def fix_case_study_grid(text):
    """Change 2-column case study card grid to responsive auto-fit."""
    old_grid = 'display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 0 0 16px;'
    new_grid = 'display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 0 0 16px;'
    return text.replace(old_grid, new_grid)


def fix_industries_grid(text):
    """Change 2-column industries list to responsive auto-fit."""
    old_grid = 'padding-left: 1.4em; margin-bottom: 24px; display:grid; grid-template-columns: 1fr 1fr; gap: 8px 24px;'
    new_grid = 'padding-left: 1.4em; margin-bottom: 24px; display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px 24px;'
    return text.replace(old_grid, new_grid)


def process(page):
    fname = page['file']
    with open(fname, 'r', encoding='utf-8') as fh:
        text = fh.read()

    text = fix_jsonld_encoding(text)
    text = fix_html_encoding(text)
    text = add_style_block(text)
    text = replace_hero(text, page)
    text = fix_article_maxwidth(text)
    text = fix_screenshot_images(text)
    text = fix_case_study_grid(text)
    text = fix_industries_grid(text)

    with open(fname, 'w', encoding='utf-8') as fh:
        fh.write(text)
    print(f'Done: {fname}')


for p in PAGES:
    process(p)

print('All city pages updated.')
