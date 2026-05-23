import os
import csv
from pathlib import Path
import qrcode

BASE_URL = "https://knightlogics.com"
OUT_DIR = Path(__file__).resolve().parents[1] / "images" / "referral-qrcodes"

PARTNERS = [
    ("DVC Signs", "dvc-signs", "DVC250"),
    ("Davidson Sign Services Inc", "davidson-sign-services", "DAVID250"),
    ("FASTSIGNS Clearwater", "fastsigns-clearwater", "FASTCLR250"),
    ("FASTSIGNS Largo", "fastsigns-largo", "FASTLARGO250"),
    ("Sir Speedy Clearwater - Drew St", "sir-speedy-clearwater-drew", "SIRDRW250"),
    ("Sir Speedy Clearwater - 142nd Ave", "sir-speedy-clearwater-142nd", "SIR142250"),
    ("Minuteman Press Largo", "minuteman-press-largo", "MMPLARGO250"),
    ("LDI Printing & Signs", "ldi-printing-signs", "LDI250"),
    ("Minuteman Press Dunedin", "minuteman-press-dunedin", "MMPDUN250"),
    ("The Print Shop Dunedin", "print-shop-dunedin", "TPSDUN250"),
    ("FASTSIGNS Palm Harbor", "fastsigns-palm-harbor", "FASTPH250"),
    ("Sir Speedy Palm Harbor", "sir-speedy-palm-harbor", "SIRPH250"),
    ("Post Office Square", "post-office-square", "POSSH250"),
    ("Prints2Go", "prints2go", "P2GO250"),
    ("AE Printing and Graphics", "ae-printing-graphics", "AEPRINT250"),
]


def make_url(partner_slug: str, offer_code: str) -> str:
    return f"{BASE_URL}/ref/{partner_slug}?offer={offer_code}"


os.makedirs(OUT_DIR, exist_ok=True)

manifest_rows = []
for business, slug, code in PARTNERS:
    data = make_url(slug, code)
    img = qrcode.make(data)
    out_path = os.path.join(OUT_DIR, f"{slug}--{code}.png")
    img.save(out_path)
    manifest_rows.append({
        "business": business,
        "code": code,
        "ref_slug": slug,
        "url": data,
        "qr_file": f"{slug}--{code}.png",
    })
    print(f"WROTE {out_path} -> {data}")

with open(OUT_DIR / "manifest.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["business", "code", "ref_slug", "url", "qr_file"])
    writer.writeheader()
    writer.writerows(manifest_rows)
    print(f"WROTE {OUT_DIR / 'manifest.csv'}")

print(f"DONE: {len(PARTNERS)} QR codes written to {OUT_DIR}")
