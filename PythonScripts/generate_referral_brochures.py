import csv
import os
from PIL import Image, ImageDraw, ImageFont

BASE_BROCHURE = r"c:\Users\nknig\Downloads\KnightLogics-clean-sync\images\referral-brochures\KLBrochureFinal.png"
QR_DIR = r"c:\Users\nknig\Downloads\KnightLogics-clean-sync\images\referral-qrcodes"
MANIFEST = os.path.join(QR_DIR, "manifest.csv")
OUT_DIR = r"c:\Users\nknig\Downloads\KnightLogics-clean-sync\images\referral-brochures"

# Approved placement from single preview: fit inside white placeholder
PLACEHOLDER = (885, 1300, 1006, 1398)
QR_MARGIN = 0


def get_font(size: int):
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_company_name(draw: ImageDraw.ImageDraw, company: str, image_height: int):
    left, _, right, bottom = PLACEHOLDER
    box_w = right - left

    font = get_font(13)
    bbox = draw.textbbox((0, 0), company, font=font)
    text_w = bbox[2]
    text_h = bbox[3]

    text_x = left + (box_w - text_w) // 2
    text_y = min(bottom + 2, image_height - text_h - 3)
    draw.text((text_x, text_y), company, fill=(20, 20, 20), font=font)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    base = Image.open(BASE_BROCHURE).convert("RGB")

    with open(MANIFEST, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    for row in rows:
        company = row["business"].strip()
        code = row["code"].strip()
        qr_file = row["qr_file"].strip()

        qr_path = os.path.join(QR_DIR, qr_file)
        if not os.path.exists(qr_path):
            print(f"SKIP missing QR: {qr_path}")
            continue

        out = base.copy()
        draw = ImageDraw.Draw(out)


        qr = Image.open(qr_path).convert("RGB")
        left, top, right, bottom = PLACEHOLDER
        box_w = right - left
        box_h = bottom - top
        qr_w = max(10, box_w - (QR_MARGIN * 2))
        qr_h = max(10, box_h - (QR_MARGIN * 2))
        qr_size = min(qr_w, qr_h)

        # Trim outer quiet-zone, then add controlled white border
        mask = qr.convert("L").point(lambda p: 0 if p > 245 else 255)
        bbox = mask.getbbox()
        if bbox:
            qr = qr.crop(bbox)
            from PIL import ImageOps
            qr = ImageOps.expand(qr, border=8, fill="white")

        qr = qr.resize((qr_size, qr_size), Image.Resampling.NEAREST)
        qr_x = left + (box_w - qr_size) // 2 + 3
        qr_y = top + QR_MARGIN
        out.paste(qr, (qr_x, qr_y))

        draw_company_name(draw, company, out.height)

        safe_company = row["ref_slug"].strip()
        out_name = f"brochure--{safe_company}--{code}.png"
        out_path = os.path.join(OUT_DIR, out_name)
        out.save(out_path, optimize=True)
        print(f"WROTE {out_path}")

    print(f"DONE: {len(rows)} brochures written to {OUT_DIR}")


if __name__ == "__main__":
    main()
