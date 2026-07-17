"""Generate obsidian + indigo blog cover PNGs for portfolio posts."""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "blog"
W, H = 1200, 675

OBSIDIAN = (12, 12, 16)
CHARCOAL = (22, 22, 28)
INDIGO = (21, 0, 255)
PEARL = (212, 212, 212)
ASH = (168, 168, 176)
PAPER = (253, 253, 253)

# Existing covers we keep as-is
SKIP = {
    "telegram-fastapi.png",
    "weroi-platform.png",
    "security-fundamentals.png",
}

COVERS: list[tuple[str, str, str]] = [
    ("pntcog-ministry-site.png", "PNTCOG", "Ministry site · mobile first"),
    ("webhook-hmac-retries.png", "Webhooks", "HMAC · retries · limits"),
    ("jwt-admin-without-drama.png", "JWT Admin", "Auth patterns that hold"),
    ("nextjs-portfolio-ship.png", "Next.js", "Portfolio · Vercel · typed content"),
    ("fastapi-async-telegram.png", "Async FastAPI", "Telegram · event loop"),
    ("railway-vercel-split.png", "Deploy", "Vercel + Railway split"),
    ("openapi-typed-clients.png", "OpenAPI", "Typed clients · Zod"),
    ("studysync-jwt-sqlite.png", "StudySync", "FastAPI · SQL · JWT"),
    ("jamaica-remote-ship.png", "Portmore", "Remote ready shipping"),
    ("llm-faq-fallback.png", "LLM Bots", "FAQ safety net"),
    ("mongodb-atlas-leads.png", "MongoDB", "Lead funnels · Atlas"),
    ("resend-email-automation.png", "Resend", "Transactional email"),
    ("utech-gpa-to-ship.png", "UTech CS", "Labs → production habits"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    windir = os.environ.get("WINDIR", r"C:\Windows")
    names = (["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"])
    for name in names:
        path = os.path.join(windir, "Fonts", name)
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                pass
    return ImageFont.load_default()


def render(filename: str, title: str, subtitle: str) -> Path:
    img = Image.new("RGB", (W, H), OBSIDIAN)
    draw = ImageDraw.Draw(img, "RGBA")

    for y in range(H):
        t = y / (H - 1)
        r = int(OBSIDIAN[0] + (CHARCOAL[0] - OBSIDIAN[0]) * t)
        g = int(OBSIDIAN[1] + (CHARCOAL[1] - OBSIDIAN[1]) * t)
        b = int(OBSIDIAN[2] + (CHARCOAL[2] - OBSIDIAN[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Soft indigo bloom — no grid
    for i, radius in enumerate((420, 280, 160)):
        alpha = 28 - i * 6
        draw.ellipse(
            [W // 2 - radius, H // 2 - radius - 40, W // 2 + radius, H // 2 + radius - 40],
            fill=(*INDIGO, alpha),
        )

    draw.rounded_rectangle(
        [W // 2 - 120, H // 2 - 120, W // 2 + 120, H // 2 + 40],
        radius=28,
        fill=(*CHARCOAL, 230),
        outline=(*INDIGO, 160),
        width=2,
    )
    mark = font(42, bold=True)
    mw = draw.textlength("ZH", font=mark)
    draw.text(((W - mw) / 2, H // 2 - 70), "ZH", fill=PAPER, font=mark)
    draw.rounded_rectangle(
        [W // 2 - 18, H // 2 + 8, W // 2 + 18, H // 2 + 14],
        radius=2,
        fill=INDIGO,
    )

    title_font = font(34, bold=True)
    sub_font = font(16)
    tw = draw.textlength(title, font=title_font)
    draw.text(((W - tw) / 2, H - 120), title, fill=PEARL, font=title_font)
    sw = draw.textlength(subtitle, font=sub_font)
    draw.text(((W - sw) / 2, H - 72), subtitle, fill=ASH, font=sub_font)

    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(path, "PNG", optimize=True)
    return path


def main() -> None:
    print(f"Output: {OUT}")
    written = 0
    for filename, title, subtitle in COVERS:
        if filename in SKIP:
            print(f"  skip {filename}")
            continue
        path = render(filename, title, subtitle)
        written += 1
        print(f"  {path.name} ({path.stat().st_size:,} bytes)")
    print(f"Wrote {written} covers")


if __name__ == "__main__":
    main()
