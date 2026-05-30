import os, re
base = r'E:\KnightLogics-Growth-System\MainSite'
for f in sorted(os.listdir(base)):
    if not f.endswith('.html'):
        continue
    raw = open(os.path.join(base, f), encoding='utf-8', errors='ignore').read()
    for m in re.finditer(r'<img[^>]+>', raw, re.I | re.S):
        tag = m.group()
        if 'alt=' not in tag.lower():
            print(f'{f}: {tag[:150]}')
print("done")
