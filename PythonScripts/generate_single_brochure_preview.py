import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "images" / "referral-brochures" / "KLBrochureFinal.png"
QR = ROOT / "images" / "referral-qrcodes" / "ae-printing-graphics--AEPRINT250.png"
OUT = ROOT / "images" / "referral-brochures" / "brochure--ae-printing-graphics--AEPRINT250.png"

PLACEHOLDER = (885, 1300, 1006, 1398)
QR_MARGIN = 0

# Company text centered under QR
COMPANY = "AE Printing and Graphics"


def get_font(size=13):
    paths = [
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


img = Image.open(BASE).convert("RGB")
qr = Image.open(QR).convert("RGB")
draw = ImageDraw.Draw(img)

left, top, right, bottom = PLACEHOLDER
box_w = right - left
box_h = bottom - top

qr_w = max(10, box_w - (QR_MARGIN * 2))
qr_h = max(10, box_h - (QR_MARGIN * 2))
qr_size = min(qr_w, qr_h)

# Trim the source QR's outer quiet-zone so the code fills more of the slot.
mask = qr.convert("L").point(lambda p: 0 if p > 245 else 255)
bbox = mask.getbbox()
if bbox:
    qr = qr.crop(bbox)
    qr = ImageOps.expand(qr, border=8, fill="white")


# Center QR horizontally in the white placeholder
qr = qr.resize((qr_size, qr_size), Image.Resampling.NEAREST)
qr_x = left + (box_w - qr_size) // 2 + 3
qr_y = top + QR_MARGIN
img.paste(qr, (qr_x, qr_y))

# Put the company label directly below the placeholder box.
font = get_font(13)
bbox = draw.textbbox((0, 0), COMPANY, font=font)
text_w = bbox[2]
text_h = bbox[3]
text_x = left + (box_w - text_w) // 2
text_y = min(bottom + 2, img.height - text_h - 3)
draw.text((text_x, text_y), COMPANY, font=font, fill=(20, 20, 20))

img.save(OUT, optimize=True)
print(f"WROTE {OUT}")
