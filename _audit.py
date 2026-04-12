import re

files = [
    'index.html',
    'projects.html',
    'service-ai-automation.html',
    'service-desktop-apps.html',
    'service-websites.html',
    'service-ecommerce.html',
]

for fname in files:
    try:
        with open(fname, 'r', encoding='utf-8') as f:
            html = f.read()
    except FileNotFoundError:
        continue

    lines = html.split('\n')
    print(f'\n=== {fname} ===')

    # Non-descriptive links
    for i, line in enumerate(lines, 1):
        m = re.search(r'<a[^>]*>([^<]{1,30})</a>', line, re.IGNORECASE)
        if m:
            text = m.group(1).strip().lower()
            if text in ['learn more', 'read more', 'click here', 'here', 'more', 'view more', 'see more', '#', 'link', 'details', 'case study']:
                print(f'  [SEO non-descriptive link] L{i}: "{m.group(1).strip()}" | {line.strip()[:100]}')

    # Images with missing or empty alt
    for i, line in enumerate(lines, 1):
        if '<img' in line:
            has_alt = 'alt=' in line
            alt_m = re.search(r'alt=["\']([^"\']*)["\']', line)
            alt_val = alt_m.group(1) if alt_m else 'MISSING'
            if not has_alt or alt_val == '':
                src_m = re.search(r'src=["\']([^"\']*)["\']', line)
                src_val = src_m.group(1)[:50] if src_m else '?'
                print(f'  [A11Y missing alt] L{i}: src="{src_val}"')

    # Heading hierarchy check
    prev_level = 0
    for i, line in enumerate(lines, 1):
        m = re.search(r'<h([1-6])', line, re.IGNORECASE)
        if m:
            level = int(m.group(1))
            if level > prev_level + 1 and prev_level != 0:
                text = re.sub(r'<[^>]+>', '', line).strip()[:50]
                print(f'  [A11Y heading skip] L{i}: h{prev_level}->h{level} "{text}"')
            prev_level = level
