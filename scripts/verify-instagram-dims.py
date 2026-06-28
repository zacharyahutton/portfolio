from PIL import Image
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "brand" / "instagram"
bad = []
covers = list((root / "covers").glob("*.png"))
stories = [p for d in root.glob("stories-*") if d.is_dir() for p in d.glob("*.png")]
for p in covers + stories:
    im = Image.open(p)
    expected = (1080, 1080) if "covers" in p.parts else (1080, 1920)
    if im.size != expected:
        bad.append(f"{p.relative_to(root)}: {im.size} expected {expected}")
print(f"covers={len(covers)} stories={len(stories)}")
if bad:
    print("BAD:")
    for line in bad:
        print(line)
else:
    print("ALL OK")
