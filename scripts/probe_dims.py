from PIL import Image
from pathlib import Path

base = Path(__file__).resolve().parents[1] / "brand" / "instagram"
files = ["assets/desk-setup.png", "assets/utech-campus.png"]
files += sorted(str(p.relative_to(base)).replace("\\", "/") for p in (base / "assets/screenshots").glob("*.png"))
for f in files:
    p = base / f
    im = Image.open(p)
    print(f"{f}: {im.size[0]}x{im.size[1]}")
