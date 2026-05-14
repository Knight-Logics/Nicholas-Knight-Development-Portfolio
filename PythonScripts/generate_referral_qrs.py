import os
import qrcode

BASE_URL = "https://knightlogics.com/"
OUT_DIR = r"c:\Users\nknig\Downloads\KnightLogics-clean-sync\images\referral-qrcodes"

PARTNERS = [
    ("dvc-signs", "DVC250"),
    ("sbt-clearwater", "SBTCLR250"),
    ("fastsigns-clearwater", "FASTCLR250"),
    ("fastsigns-largo", "FASTLARGO250"),
    ("sir-speedy-clearwater-drew", "SIRDRW250"),
    ("sir-speedy-clearwater-142nd", "SIR142250"),
    ("minuteman-press-largo", "MMPLARGO250"),
    ("ldi-printing-signs", "LDI250"),
    ("minuteman-press-dunedin", "MMPDUN250"),
    ("print-shop-dunedin", "TPSDUN250"),
    ("fastsigns-palm-harbor", "FASTPH250"),
    ("sir-speedy-palm-harbor", "SIRPH250"),
    ("post-office-square", "POSSH250"),
    ("prints2go", "P2GO250"),
    ("ae-printing-graphics", "AEPRINT250"),
]


def make_url(partner_slug: str, offer_code: str) -> str:
    return f"{BASE_URL}?ref={partner_slug}&offer={offer_code}"


os.makedirs(OUT_DIR, exist_ok=True)

for slug, code in PARTNERS:
    data = make_url(slug, code)
    img = qrcode.make(data)
    out_path = os.path.join(OUT_DIR, f"{slug}--{code}.png")
    img.save(out_path)
    print(f"WROTE {out_path} -> {data}")

print(f"DONE: {len(PARTNERS)} QR codes written to {OUT_DIR}")
