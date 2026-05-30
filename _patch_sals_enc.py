import re

p = r"E:\KnightLogics-Growth-System\MainSite\case-study-sals-painting.html"
content = open(p, encoding='utf-8').read()

JSONLD_RE = re.compile(
    r'(<script[^>]+type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)',
    re.DOTALL
)

def fix_jsonld_fffd(m):
    inner = m.group(2).replace('\ufffd', r'\u2014')
    return m.group(1) + inner + m.group(3)

content = JSONLD_RE.sub(fix_jsonld_fffd, content)
open(p, 'w', encoding='utf-8').write(content)
print("Patched.")

# Verify
lines = open(p, encoding='utf-8').readlines()
bad = [(i+1, repr(ch)) for i, line in enumerate(lines) for ch in line if ord(ch) > 127]
print(f"Remaining non-ASCII chars: {len(bad)}")
for ln, ch in bad[:5]:
    print(f"  L{ln}: {ch}")
