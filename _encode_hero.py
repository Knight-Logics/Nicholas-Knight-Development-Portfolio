"""
Re-encode non-mobile homepage hero WebP variants from the current desktop source.
"""
from pathlib import Path

from PIL import Image

BASE = Path(r"E:\KnightLogics-Growth-System\MainSite\images")
SOURCE = BASE / "websitehero.png"
QUALITY = 95

img = Image.open(SOURCE).convert("RGB")
print(f"Source: {img.width}x{img.height}")


def encode_resized(width, out_name):
    ratio = width / img.width
    height = round(img.height * ratio)
    resized = img.resize((width, height), Image.Resampling.LANCZOS)
    out_path = BASE / out_name
    resized.save(out_path, "WEBP", quality=QUALITY, method=6)
    print(f"  {out_name}: {resized.width}x{resized.height} | {out_path.stat().st_size // 1024}KB")


def encode_crop(target_w, target_h, out_name):
    target_ratio = target_w / target_h
    source_ratio = img.width / img.height

    if source_ratio > target_ratio:
        crop_h = img.height
        crop_w = round(crop_h * target_ratio)
        left = round((img.width - crop_w) * 0.5)
        box = (left, 0, left + crop_w, crop_h)
    else:
        crop_w = img.width
        crop_h = round(crop_w / target_ratio)
        top = round((img.height - crop_h) * 0.5)
        box = (0, top, crop_w, top + crop_h)

    cropped = img.crop(box).resize((target_w, target_h), Image.Resampling.LANCZOS)
    out_path = BASE / out_name
    cropped.save(out_path, "WEBP", quality=QUALITY, method=6)
    print(f"  {out_name}: {cropped.width}x{cropped.height} | {out_path.stat().st_size // 1024}KB")


encode_resized(1920, "websitehero-1920.webp")
encode_resized(2560, "websitehero.webp")
encode_resized(3440, "websitehero-hd.webp")
encode_crop(3440, 1440, "websitehero-uw.webp")

print("Done.")
