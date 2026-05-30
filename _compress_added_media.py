from PIL import Image
import os

src_dir = "images/added-media"
targets = [
    ("Screen Team Page.png",                      "screen-team-site.webp",    1200, 78),
    ("JNS Construction Page.png",                 "jns-site.webp",            1200, 78),
    ("Knight Group Page.png",                     "knight-group-site.webp",   1200, 78),
    ("Moms Resin Tables Page.png",                "moms-resin-site.webp",     1200, 78),
    ("Perfect Lighthouse Scores.png",             "lighthouse-perfect.webp",  1000, 80),
    ("embedded Google map and reviews carousel.png", "gbp-reviews.webp",      1000, 78),
    ("Knight Logics Home Page.png",               "kl-home-site.webp",        1200, 78),
]

for src, dst, max_w, q in targets:
    src_path = os.path.join(src_dir, src)
    dst_path = os.path.join(src_dir, dst)
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    if w > max_w:
        ratio = max_w / w
        img = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
    img.save(dst_path, "WEBP", quality=q, method=6)
    sz = os.path.getsize(dst_path) / 1024
    print(f"{dst}: {img.size[0]}x{img.size[1]}, {sz:.1f}KB (q={q})")
