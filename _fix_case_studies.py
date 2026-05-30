"""
_fix_case_studies.py
1. Copy + compress client hero images into images/ as WebP
2. Fix encoding: strip BOM, cp1252 → unicode, HTML entities in HTML parts, \\u escapes in JSON-LD
3. Update hero CSS background URLs to local paths
4. Add @media mobile hero overrides where missing (Screen Team, Sal's)
"""
import os, re, shutil
from pathlib import Path

MAINSITE = Path(r"E:\KnightLogics-Growth-System\MainSite")
IMGS = MAINSITE / "images"
os.chdir(MAINSITE)

# ── 1. Image copy / compress ───────────────────────────────────────────────────

COPIES = [
    (r"C:\Users\nknig\Downloads\Screen-Team-LLC-screen-team-website\Images\ScreenTeamBanner.webp",
     IMGS / "screen-team-hero.webp", False),
    (r"C:\Users\nknig\Downloads\Screen-Team-LLC-screen-team-website\Images\ScreenTeamBanner-mobile.webp",
     IMGS / "screen-team-hero-mobile.webp", False),
    (r"E:\KnightGroupWebsite\Images\KGHero-mobile.webp",
     IMGS / "knight-group-hero-mobile.webp", False),
    (r"C:\Users\nknig\OneDrive\Desktop\Ferrell Website\HeroImage.png",
     IMGS / "farrell-hero.webp", True),       # PNG → WebP compress
    (r"C:\Users\nknig\OneDrive\Desktop\Fusco Painting\SalsHeroImage.webp",
     IMGS / "sals-hero.webp", False),
    (r"C:\Users\nknig\OneDrive\Desktop\Fusco Painting\SalsHeroImage-mobile.jpg",
     IMGS / "sals-hero-mobile.webp", True),   # JPG → WebP convert
]

try:
    from PIL import Image as PILImage
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("WARNING: Pillow not available — PNG/JPG compression skipped, will copy raw")

print("=== Step 1: Hero images ===")
for src_str, dst, compress in COPIES:
    src = Path(src_str)
    if not src.exists():
        print(f"  MISSING: {src.name}")
        continue
    if compress and HAS_PIL:
        img = PILImage.open(src).convert('RGB')
        if img.width > 1400:
            img = img.resize((1400, int(img.height * 1400 / img.width)), PILImage.LANCZOS)
        img.save(dst, 'WebP', quality=82, method=4)
    else:
        shutil.copy2(src, dst)
    print(f"  OK: {dst.name}  {dst.stat().st_size // 1024}KB")


# ── 2. Encoding fix helpers ────────────────────────────────────────────────────

def decode_mixed(raw: bytes) -> str:
    """
    Decode a file that is mostly UTF-8 but may contain embedded cp1252 chars
    (0x80–0x9F range). Strips UTF-8 BOM if present.
    """
    out = []
    i = 3 if raw[:3] == b'\xef\xbb\xbf' else 0
    while i < len(raw):
        b = raw[i]
        if b <= 0x7F:                          # plain ASCII
            out.append(chr(b)); i += 1
        elif 0x80 <= b <= 0x9F:                # cp1252 special range
            out.append(bytes([b]).decode('cp1252')); i += 1
        elif 0xC2 <= b <= 0xDF:                # 2-byte UTF-8
            seq = raw[i:i+2]
            try:    out.append(seq.decode('utf-8')); i += 2
            except: out.append(bytes([b]).decode('latin-1')); i += 1
        elif 0xE0 <= b <= 0xEF:                # 3-byte UTF-8
            seq = raw[i:i+3]
            try:    out.append(seq.decode('utf-8')); i += 3
            except: out.append(bytes([b]).decode('latin-1')); i += 1
        elif 0xF0 <= b <= 0xF7:                # 4-byte UTF-8
            seq = raw[i:i+4]
            try:    out.append(seq.decode('utf-8')); i += 4
            except: out.append(bytes([b]).decode('latin-1')); i += 1
        else:
            out.append(bytes([b]).decode('latin-1')); i += 1
    return ''.join(out)


HTML_ENT = [
    ('\u2014', '&mdash;'),   # em dash
    ('\u2013', '&ndash;'),   # en dash
    ('\u2192', '&rarr;'),    # right arrow
    ('\u2019', '&rsquo;'),   # right single quote
    ('\u2018', '&lsquo;'),   # left single quote
    ('\u201c', '&ldquo;'),   # left double quote
    ('\u201d', '&rdquo;'),   # right double quote
    ('\u00a0', '&nbsp;'),    # non-breaking space
    ('\u2026', '&hellip;'),  # ellipsis
    ('\u2022', '&#8226;'),   # bullet
    ('\u2605', '&#9733;'),   # filled star ★
]

JSONLD_ESC = [
    ('\u2014', r'\u2014'), ('\u2013', r'\u2013'), ('\u2192', r'\u2192'),
    ('\u2019', r'\u2019'), ('\u2018', r'\u2018'),
    ('\u201c', r'\u201c'), ('\u201d', r'\u201d'),
    ('\u00a0', r'\u00a0'), ('\u2026', r'\u2026'),
]

_JSONLD_RE = re.compile(
    r'(<script[^>]+type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)',
    re.DOTALL
)


def fix_encoding(content: str) -> str:
    """
    Apply HTML entity replacements to HTML parts and \\u escapes to JSON-LD blocks.
    Also fixes residual U+FFFD replacement chars (★★★★★ and em dashes).
    """
    parts = _JSONLD_RE.split(content)
    out = []
    for i, part in enumerate(parts):
        m = i % 4
        if m == 0:      # HTML content between / around JSON-LD blocks
            for old, new in HTML_ENT:
                part = part.replace(old, new)
            # Residual U+FFFD chars: 5 consecutive = star row, single = em dash
            part = re.sub('\ufffd{5}', '&#9733;&#9733;&#9733;&#9733;&#9733;', part)
            part = part.replace('\ufffd', '&mdash;')
        elif m == 2:    # inside <script type="application/ld+json">...</script>
            for old, new in JSONLD_ESC:
                part = part.replace(old, new)
        # m==1 (<script> tag) and m==3 (</script>) pass through unchanged
        out.append(part)
    return ''.join(out)


# ── 3. Hero CSS URL swaps ──────────────────────────────────────────────────────

# Direct string replacements for known exact URLs
URL_SWAPS = {
    "case-study-screen-team.html": [
        ("url('https://screenteamllc.com/Images/ScreenTeamBanner.png')",
         "url('./images/screen-team-hero.webp')"),
    ],
    "case-study-knight-group.html": [
        ("url('https://www.knightgroup.com/Images/KGHero.webp')",
         "url('./images/knight-group-hero.webp')"),
        ("url('https://www.knightgroup.com/Images/KGHero-mobile.webp')",
         "url('./images/knight-group-hero-mobile.webp')"),
    ],
    "case-study-farrell-electric.html": [
        # both desktop + existing mobile override share the same URL → both get replaced
        ("url('https://farrell-electric.github.io/farrell-electric-website/HeroImage.png')",
         "url('./images/farrell-hero.webp')"),
    ],
    "case-study-sals-painting.html": [
        ("url('https://salspaintingrenovation.com/SalsHeroImage.png')",
         "url('./images/sals-hero.webp')"),
    ],
}

# Pages that need a mobile @media override added (anchor = new desktop URL snippet)
ADD_MOBILE = {
    "case-study-screen-team.html": (
        "url('./images/screen-team-hero.webp') top center/cover no-repeat;",
        (
            "\n        @media (max-width: 720px) {\n"
            "            .cs-hero { background: linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)),"
            " url('./images/screen-team-hero-mobile.webp') top center/cover no-repeat; }\n"
            "        }"
        ),
    ),
    "case-study-sals-painting.html": (
        "url('./images/sals-hero.webp') top center/cover no-repeat;",
        (
            "\n        @media (max-width: 720px) {\n"
            "            .cs-hero { background: linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)),"
            " url('./images/sals-hero-mobile.webp') top center/cover no-repeat; }\n"
            "        }"
        ),
    ),
}


def update_hero(content: str, page: str) -> str:
    # Replace known external URLs with local paths
    for old, new in URL_SWAPS.get(page, []):
        content = content.replace(old, new)

    # Add mobile override if needed
    if page in ADD_MOBILE:
        anchor, insert = ADD_MOBILE[page]
        if anchor in content and insert.strip() not in content:
            idx = content.find(anchor)
            # Find the closing brace of the .cs-hero {} block (next } after the anchor)
            close_brace = content.find('}', idx + len(anchor))
            if close_brace != -1:
                content = content[:close_brace + 1] + insert + content[close_brace + 1:]

    return content


# ── Main ───────────────────────────────────────────────────────────────────────

PAGES = [
    "case-study-screen-team.html",
    "case-study-jns.html",
    "case-study-knight-group.html",
    "case-study-moms-resin-tables.html",
    "case-study-farrell-electric.html",
    "case-study-sals-painting.html",
    "case-study-evidencedesk-ai.html",
    "case-study-knight-logics.html",
]

print("\n=== Step 2: Fix encoding + hero URLs ===")
for page in PAGES:
    p = Path(page)
    if not p.exists():
        print(f"  SKIP (not found): {page}")
        continue
    raw = p.read_bytes()
    content = decode_mixed(raw)
    content = fix_encoding(content)
    content = update_hero(content, page)
    p.write_text(content, encoding='utf-8')
    print(f"  OK: {page}")

print("\nAll done.")
