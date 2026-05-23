import csv
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BASE_BROCHURE = ROOT / "images" / "KLBrochure.png"
QR_DIR = ROOT / "images" / "referral-qrcodes"
MANIFEST = QR_DIR / "manifest.csv"
OUT_DIR = ROOT / "images" / "referral-brochures-printopt"

# Print-optimized placement
QR_SIZE = 82
QR_X = 939
QR_Y = 1264
CLEAR_X0 = 922
CLEAR_Y0 = 1258
CLEAR_X1 = 1043
CLEAR_Y1 = 1366

TEXT_AREA_X0 = 900
TEXT_AREA_X1 = 1060
CTA_Y = 1348
COMPANY_Y = 1361


def get_font(size: int, bold: bool = False):
    candidates = []
    if bold:
        candidates.extend([
            r"C:\Windows\Fonts\arialbd.ttf",
            r"C:\Windows\Fonts\segoeuib.ttf",
        ])
    candidates.extend([
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
    ])
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_centered(draw: ImageDraw.ImageDraw, text: str, y: int, font, fill):
    w = draw.textbbox((0, 0), text, font=font)[2]
    x = TEXT_AREA_X0 + ((TEXT_AREA_X1 - TEXT_AREA_X0) - w) // 2
    draw.text((x, y), text, fill=fill, font=font)


def wrap_two_lines(draw: ImageDraw.ImageDraw, text: str, font, max_w: int):
    words = text.split()
    if not words:
        return [""]
    line1 = words[0]
    i = 1
    while i < len(words):
        test = line1 + " " + words[i]
        if draw.textbbox((0, 0), test, font=font)[2] <= max_w:
            line1 = test
            i += 1
        else:
            break
    line2 = " ".join(words[i:])
    if line2 and draw.textbbox((0, 0), line2, font=font)[2] > max_w:
        while len(line2) > 4 and draw.textbbox((0, 0), line2 + "...", font=font)[2] > max_w:
            line2 = line2[:-1]
        line2 = line2.rstrip() + "..."
    return [line1] + ([line2] if line2 else [])


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    base = Image.open(BASE_BROCHURE).convert("RGB")

    bg_patch = base.crop((880, 1310, 910, 1330))
    pixels = list(bg_patch.getdata())
    avg = tuple(int(sum(c[i] for c in pixels) / len(pixels)) for i in range(3))

    cta_font = get_font(10, bold=True)
    company_font = get_font(13, bold=True)

    with open(MANIFEST, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    for row in rows:
        company = row["business"].strip()
        code = row["code"].strip()
        qr_file = row["qr_file"].strip()
        slug = row["ref_slug"].strip()

        qr_path = os.path.join(QR_DIR, qr_file)
        if not os.path.exists(qr_path):
            print(f"SKIP missing QR: {qr_path}")
            continue

        out = base.copy()
        draw = ImageDraw.Draw(out)

        # Clear old QR/caption zone.
        draw.rectangle((CLEAR_X0, CLEAR_Y0, CLEAR_X1, CLEAR_Y1), fill=avg)

        # White border pad for better print contrast.
        pad = 4
        draw.rectangle((QR_X - pad, QR_Y - pad, QR_X + QR_SIZE + pad, QR_Y + QR_SIZE + pad), fill=(255, 255, 255))

        qr = Image.open(qr_path).convert("RGB").resize((QR_SIZE, QR_SIZE), Image.Resampling.NEAREST)
        out.paste(qr, (QR_X, QR_Y))

        draw_centered(draw, "Scan for partner offer", CTA_Y, cta_font, (30, 30, 30))

        lines = wrap_two_lines(draw, company, company_font, TEXT_AREA_X1 - TEXT_AREA_X0)
        if len(lines) == 1:
            draw_centered(draw, lines[0], COMPANY_Y, company_font, (10, 10, 10))
        else:
            draw_centered(draw, lines[0], COMPANY_Y - 7, company_font, (10, 10, 10))
            draw_centered(draw, lines[1], COMPANY_Y + 7, company_font, (10, 10, 10))

        out_name = f"brochure--{slug}--{code}--printopt.png"
        out_path = os.path.join(OUT_DIR, out_name)
        out.save(out_path, optimize=True)
        print(f"WROTE {out_path}")

    print(f"DONE: {len(rows)} brochures written to {OUT_DIR}")


if __name__ == "__main__":
    main()
