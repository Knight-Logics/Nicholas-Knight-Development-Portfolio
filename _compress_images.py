from PIL import Image
import os

images_dir = "images"
targets = [
    ("code hero2.png",           "code hero2.webp",           1440, 80),
    ("code hero3.png",           "code hero3.webp",           1440, 80),
    ("CircuitBrush3.png",        "CircuitBrush3.webp",        1440, 72),
    ("ai-orchestrator-logo.png", "ai-orchestrator-logo.webp", 800,  72),
]

for src, dst, max_w, q in targets:
    src_path = os.path.join(images_dir, src)
    dst_path = os.path.join(images_dir, dst)
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    if w > max_w:
        ratio = max_w / w
        img = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
    img.save(dst_path, "WEBP", quality=q, method=6)
    size_kb = os.path.getsize(dst_path) / 1024
    print(f"{dst}: {img.size[0]}x{img.size[1]}, {size_kb:.1f}KB (q={q})")
