import argparse
import csv
import os
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat


ROOT = Path(__file__).resolve().parents[1]
QR_DIR = ROOT / "images" / "referral-qrcodes"
MANIFEST = QR_DIR / "manifest.csv"
STANDARD_BASE = ROOT / "images" / "referral-brochures" / "KLBrochureFinal.png"
STANDARD_OUT_DIR = ROOT / "images" / "referral-brochures"
PRINT_BASE = ROOT / "images" / "KLBrochure.png"
PRINT_OUT_DIR = ROOT / "images" / "referral-brochures-printopt"

# Standard preview placement. Matches generate_referral_brochures.py.
STANDARD_PLACEHOLDER = (885, 1300, 1006, 1398)
STANDARD_QR_MARGIN = 0

# Print-optimized placement. Matches generate_referral_brochures_printopt.py.
PRINT_QR_SIZE = 82
PRINT_QR_X = 939
PRINT_QR_Y = 1264
PRINT_CLEAR_X0 = 922
PRINT_CLEAR_Y0 = 1258
PRINT_CLEAR_X1 = 1043
PRINT_CLEAR_Y1 = 1366
PRINT_TEXT_AREA_X0 = 900
PRINT_TEXT_AREA_X1 = 1060
PRINT_CTA_Y = 1348
PRINT_COMPANY_Y = 1361


def log(verbose, message):
    if verbose:
        print(f"[referral-assets] {message}")


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


def make_url(base_url: str, slug: str, code: str) -> str:
    base = base_url.rstrip("/")
    return f"{base}/ref/{slug}?offer={code}" if code else f"{base}/ref/{slug}"


def write_qr(url: str, slug: str, code: str, verbose: bool) -> Path:
    QR_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{slug}--{code}.png" if code else f"{slug}.png"
    out_path = QR_DIR / name
    log(verbose, f"writing QR {out_path} -> {url}")
    img = qrcode.make(url)
    img.save(out_path)
    return out_path


def read_manifest():
    if not MANIFEST.exists():
        return []
    with open(MANIFEST, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_manifest(rows):
    QR_DIR.mkdir(parents=True, exist_ok=True)
    fieldnames = ["business", "code", "ref_slug", "url", "qr_file"]
    with open(MANIFEST, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def upsert_manifest(business: str, slug: str, code: str, url: str, qr_file: str, verbose: bool):
    rows = read_manifest()
    row = {
        "business": business,
        "code": code,
        "ref_slug": slug,
        "url": url,
        "qr_file": qr_file,
    }
    replaced = False
    for idx, existing in enumerate(rows):
        if existing.get("ref_slug") == slug and existing.get("code") == code:
            rows[idx] = row
            replaced = True
            break
    if not replaced:
        rows.append(row)
    write_manifest(rows)
    log(verbose, f"{'updated' if replaced else 'added'} manifest row in {MANIFEST}")


def draw_standard_company_name(draw: ImageDraw.ImageDraw, company: str, image_height: int):
    left, _, right, bottom = STANDARD_PLACEHOLDER
    box_w = right - left
    font = get_font(13, bold=True)
    bbox = draw.textbbox((0, 0), company, font=font)
    text_w = bbox[2]
    text_h = bbox[3]
    text_x = left + (box_w - text_w) // 2
    text_y = min(bottom + 2, image_height - text_h - 3)
    draw.text((text_x, text_y), company, fill=(20, 20, 20), font=font)


def generate_standard_brochure(business: str, slug: str, code: str, qr_path: Path, verbose: bool) -> Path:
    STANDARD_OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not STANDARD_BASE.exists():
        raise FileNotFoundError(f"standard base brochure not found: {STANDARD_BASE}")
    base = Image.open(STANDARD_BASE).convert("RGB")
    out = base.copy()
    draw = ImageDraw.Draw(out)

    qr = Image.open(qr_path).convert("RGB")
    left, top, right, bottom = STANDARD_PLACEHOLDER
    box_w = right - left
    box_h = bottom - top
    qr_w = max(10, box_w - (STANDARD_QR_MARGIN * 2))
    qr_h = max(10, box_h - (STANDARD_QR_MARGIN * 2))
    qr_size = min(qr_w, qr_h)

    mask = qr.convert("L").point(lambda p: 0 if p > 245 else 255)
    bbox = mask.getbbox()
    if bbox:
        qr = qr.crop(bbox)
        qr = ImageOps.expand(qr, border=8, fill="white")

    qr = qr.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    qr_x = left + (box_w - qr_size) // 2 + 3
    qr_y = top + STANDARD_QR_MARGIN
    out.paste(qr, (qr_x, qr_y))
    draw_standard_company_name(draw, business, out.height)

    out_path = STANDARD_OUT_DIR / f"brochure--{slug}--{code}.png"
    out.save(out_path, optimize=True)
    log(verbose, f"wrote standard brochure {out_path}")
    return out_path


def draw_centered(draw: ImageDraw.ImageDraw, text: str, y: int, font, fill):
    w = draw.textbbox((0, 0), text, font=font)[2]
    x = PRINT_TEXT_AREA_X0 + ((PRINT_TEXT_AREA_X1 - PRINT_TEXT_AREA_X0) - w) // 2
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


def generate_print_brochure(business: str, slug: str, code: str, qr_path: Path, verbose: bool) -> Path:
    PRINT_OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not PRINT_BASE.exists():
        raise FileNotFoundError(f"print base brochure not found: {PRINT_BASE}")
    base = Image.open(PRINT_BASE).convert("RGB")
    out = base.copy()
    draw = ImageDraw.Draw(out)

    bg_patch = base.crop((880, 1310, 910, 1330))
    avg = tuple(int(value) for value in ImageStat.Stat(bg_patch).mean[:3])

    draw.rectangle((PRINT_CLEAR_X0, PRINT_CLEAR_Y0, PRINT_CLEAR_X1, PRINT_CLEAR_Y1), fill=avg)
    pad = 4
    draw.rectangle(
        (PRINT_QR_X - pad, PRINT_QR_Y - pad, PRINT_QR_X + PRINT_QR_SIZE + pad, PRINT_QR_Y + PRINT_QR_SIZE + pad),
        fill=(255, 255, 255)
    )

    qr = Image.open(qr_path).convert("RGB").resize((PRINT_QR_SIZE, PRINT_QR_SIZE), Image.Resampling.NEAREST)
    out.paste(qr, (PRINT_QR_X, PRINT_QR_Y))

    cta_font = get_font(10, bold=True)
    company_font = get_font(13, bold=True)
    draw_centered(draw, "Scan for partner offer", PRINT_CTA_Y, cta_font, (30, 30, 30))

    lines = wrap_two_lines(draw, business, company_font, PRINT_TEXT_AREA_X1 - PRINT_TEXT_AREA_X0)
    if len(lines) == 1:
        draw_centered(draw, lines[0], PRINT_COMPANY_Y, company_font, (10, 10, 10))
    else:
        draw_centered(draw, lines[0], PRINT_COMPANY_Y - 7, company_font, (10, 10, 10))
        draw_centered(draw, lines[1], PRINT_COMPANY_Y + 7, company_font, (10, 10, 10))

    out_path = PRINT_OUT_DIR / f"brochure--{slug}--{code}--printopt.png"
    out.save(out_path, optimize=True)
    log(verbose, f"wrote print brochure {out_path}")
    return out_path


def main():
    parser = argparse.ArgumentParser(description="Generate QR and brochure assets for one referral partner.")
    parser.add_argument("--business", required=True, help="Partner display name, e.g. Krylo")
    parser.add_argument("--slug", required=True, help="Referral slug, e.g. krylo")
    parser.add_argument("--code", required=True, help="Offer code, e.g. KRYLO250")
    parser.add_argument("--base-url", default="https://knightlogics.com")
    parser.add_argument("--skip-manifest", action="store_true")
    parser.add_argument("--skip-printopt", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    business = args.business.strip()
    slug = args.slug.strip().lower()
    code = args.code.strip().upper()
    if not business or not slug or not code:
        raise ValueError("business, slug, and code are required")

    log(args.verbose, f"root={ROOT}")
    url = make_url(args.base_url, slug, code)
    qr_path = write_qr(url, slug, code, args.verbose)
    if not args.skip_manifest:
        upsert_manifest(business, slug, code, url, qr_path.name, args.verbose)

    standard_path = generate_standard_brochure(business, slug, code, qr_path, args.verbose)
    print_path = None
    if not args.skip_printopt:
        print_path = generate_print_brochure(business, slug, code, qr_path, args.verbose)

    print("DONE")
    print(f"URL: {url}")
    print(f"QR: {qr_path}")
    print(f"BROCHURE: {standard_path}")
    if print_path:
        print(f"PRINTOPT: {print_path}")


if __name__ == "__main__":
    main()
