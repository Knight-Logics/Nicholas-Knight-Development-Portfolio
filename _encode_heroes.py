"""
Re-encode hero images from their lossless PNG sources at optimal quality.
"""
from PIL import Image
import os

base = r'E:\KnightLogics-Growth-System\MainSite\images'

def encode(src_name, out_name, width=None, quality=85):
    src = os.path.join(base, src_name)
    out = os.path.join(base, out_name)
    img = Image.open(src).convert('RGB')
    if width and img.width > width:
        ratio = width / img.width
        height = int(img.height * ratio)
        img = img.resize((width, height), Image.LANCZOS)
    img.save(out, 'WEBP', quality=quality, method=6)
    size_kb = os.path.getsize(out) // 1024
    print(f'  {out_name}: {img.width}x{img.height} | {size_kb}KB (q={quality})')

# momhero: source PNG is 1916x821, current webp is only 1200x514 — encode at full width
print('momhero:')
encode('momhero.png', 'momhero.webp', width=None, quality=85)

# city hero: source PNG is 1536x1024, re-encode at higher quality
print('city hero:')
encode('city hero.png', 'city hero.webp', width=None, quality=85)

print('Done.')
