import os, re

base = r'E:\KnightLogics-Growth-System\MainSite'
os.chdir(base)

# Check 1: remaining case-studies links
remaining = []
for f in os.listdir(base):
    if not f.endswith('.html'): continue
    raw = open(f, encoding='utf-8', errors='ignore').read()
    if 'case-studies"' in raw or "case-studies'" in raw:
        remaining.append(f)
print('Remaining case-studies links:', remaining if remaining else 'NONE - all fixed')

# Check 2: referral-program static links
idx = open('index.html', encoding='utf-8').read()
auto = open('automation.html', encoding='utf-8').read()
print('referral-program in index.html:', '/referral-program' in idx)
print('referral-program in automation.html:', '/referral-program' in auto)

# Check 3: meta desc lengths
for f, n in [('case-study-evidencedesk-ai.html', 'evidencedesk'), ('web-designer-tampa.html', 'tampa')]:
    raw = open(f, encoding='utf-8').read()
    m = re.search(r'<meta name=["\']description["\'] content=["\']([^"\']+)', raw, re.I)
    if m:
        print(f'{n} meta: {len(m.group(1))} chars | {m.group(1)[:70]}')

print('All checks done.')
