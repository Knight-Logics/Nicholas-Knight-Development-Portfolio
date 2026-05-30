import os, re
base = r'E:\KnightLogics-Growth-System\MainSite'
hero_imgs = {}
for f in sorted(os.listdir(base)):
    if not f.endswith('.html'):
        continue
    raw = open(os.path.join(base, f), encoding='utf-8', errors='ignore').read()
    found = set()
    for m in re.finditer(r"url\(['\"]?[./]*images/([^'\")\s?]+)", raw, re.I):
        name = m.group(1)
        if 'hero' in name.lower() or 'momhero' in name.lower() or 'jns' in name.lower() or 'knight-group' in name.lower():
            found.add(name)
    for m in re.finditer(r'''href=['"][./]*images/([^'"?\s]+)''', raw, re.I):
        name = m.group(1)
        if 'hero' in name.lower():
            found.add(name)
    if found:
        hero_imgs[f] = sorted(found)

for page, imgs in hero_imgs.items():
    for img in imgs:
        print(f'{page}: {img}')
