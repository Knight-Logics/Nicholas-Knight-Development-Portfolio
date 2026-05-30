import re

files = [
    'web-designer-tampa.html',
    'web-designer-clearwater.html',
    'web-designer-st-petersburg.html',
]

for f in files:
    with open(f, 'rb') as fh:
        raw = fh.read()
    text = raw.decode('utf-8', errors='replace')
    if '\ufffd' in text:
        print(f'REPLACEMENT CHARS in {f}')
    # Non-ASCII in JSON-LD blocks
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', text, re.DOTALL):
        block = m.group(1)
        for cm in re.finditer(r'[^\x00-\x7F]', block):
            ctx = block[max(0, cm.start()-30):cm.start()+30]
            print(f'{f} JSON-LD non-ASCII chr={ord(cm.group())} U+{ord(cm.group()):04X}: ...{repr(ctx)}...')
    # Doubled entities like &amp;mdash;
    for m in re.finditer(r'&amp;[a-z]+;', text):
        ctx = text[max(0, m.start()-20):m.start()+30]
        print(f'{f} doubled entity: {m.group()} | ctx: {repr(ctx)}')
    # Arrow characters in HTML body (outside scripts)
    html_body = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
    arrow_count = html_body.count('\u2192')
    mdash_count = html_body.count('\u2014')
    ndash_count = html_body.count('\u2013')
    print(f'{f}: → x{arrow_count}, — x{mdash_count}, – x{ndash_count}')
