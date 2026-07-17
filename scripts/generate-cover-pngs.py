"""Generate premium logo-mark project cover PNGs for the portfolio."""

from __future__ import annotations

import os
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "case-studies"
W, H = 1200, 675

# Site design tokens (globals.css) — shared dark base
OBSIDIAN = (5, 5, 5)
CHARCOAL = (21, 21, 21)
GRAPHITE = (30, 30, 30)
PEARL = (212, 212, 212)
ASH = (163, 163, 163)


@dataclass(frozen=True)
class AccentPalette:
    """Per-project accent: primary fill, soft outline/grid, glow halo."""

    primary: tuple[int, int, int]
    soft: tuple[int, int, int]
    glow: tuple[int, int, int]


def _glow_from_soft(soft: tuple[int, int, int], factor: float = 0.78) -> tuple[int, int, int]:
    return tuple(max(0, min(255, int(c * factor))) for c in soft)


def _primary_from_soft(soft: tuple[int, int, int], boost: float = 1.08) -> tuple[int, int, int]:
    return tuple(max(0, min(255, int(c * boost))) for c in soft)


def palette(soft: tuple[int, int, int]) -> AccentPalette:
    return AccentPalette(
        primary=_primary_from_soft(soft),
        soft=soft,
        glow=_glow_from_soft(soft),
    )


# Accent colors restored from pre-ab570ce terminal covers (ac column)
PROJECT_PALETTES: dict[str, AccentPalette] = {
    "studysync": palette((99, 102, 241)),       # indigo
    "webhook-relay": palette((16, 185, 129)),   # emerald
    "openapi-devkit": palette((56, 189, 248)),  # cyan
    "phone-store": palette((236, 72, 153)),     # pink
    "portfolio": palette((99, 102, 241)),       # indigo
    "ds-bst-lab": palette((245, 158, 11)),      # amber
    "db-library": palette((14, 165, 233)),       # sky
    "prog-fund-algorithms": palette((168, 85, 247)),  # violet
    "cyber-network": palette((34, 197, 94)),     # green
}


def lerp(a: tuple[int, ...], b: tuple[int, ...], t: float) -> tuple[int, ...]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


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


def mono(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", "consola.ttf")
    if os.path.exists(path):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def draw_background(draw: ImageDraw.ImageDraw) -> None:
    for y in range(H):
        t = y / (H - 1)
        col = lerp(OBSIDIAN, CHARCOAL, min(1.0, t * 1.1))
        draw.line([(0, y), (W, y)], fill=col)


def add_noise(img: Image.Image, strength: int = 8) -> Image.Image:
    rng = random.Random(42)
    noise = Image.new("RGBA", (W, H))
    px = noise.load()
    for y in range(H):
        for x in range(0, W, 2):
            v = rng.randint(-strength, strength)
            c = max(0, min(255, 128 + v))
            px[x, y] = (c, c, c, 12)
    noise = noise.filter(ImageFilter.GaussianBlur(radius=0.6))
    return Image.alpha_composite(img.convert("RGBA"), noise).convert("RGB")


def draw_glow_circle(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    radius: int,
    color: tuple[int, int, int],
    layers: int = 4,
) -> None:
    for i in range(layers, 0, -1):
        t = i / layers
        r = int(radius * (0.55 + 0.45 * t))
        alpha = int(8 + 12 * t)
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(*color, alpha),
        )


def draw_mark_plate(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    accent: AccentPalette,
    size: int = 240,
) -> None:
    half = size // 2
    draw_glow_circle(draw, cx, cy, int(size * 0.72), accent.glow, layers=4)
    draw.rounded_rectangle(
        [cx - half, cy - half, cx + half, cy + half],
        radius=40,
        fill=(*GRAPHITE, 235),
        outline=(*accent.soft, 100),
        width=2,
    )


def draw_footer(
    draw: ImageDraw.ImageDraw,
    title: str,
    subtitle: str,
    accent: AccentPalette,
) -> None:
    title_font = font(26, bold=True)
    sub_font = font(14)
    tw = draw.textlength(title, font=title_font)
    draw.text(((W - tw) / 2, H - 100), title, fill=PEARL, font=title_font)
    sw = draw.textlength(subtitle, font=sub_font)
    draw.text(((W - sw) / 2, H - 66), subtitle, fill=ASH, font=sub_font)
    draw.rounded_rectangle(
        [W // 2 - 22, H - 36, W // 2 + 22, H - 30],
        radius=3,
        fill=accent.primary,
    )


def draw_studysync(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    draw.polygon(
        [
            (cx - 70, cy - 10),
            (cx, cy - 38),
            (cx + 70, cy - 10),
            (cx + 70, cy + 50),
            (cx, cy + 22),
            (cx - 70, cy + 50),
        ],
        fill=accent.primary,
        outline=accent.soft,
    )
    draw.line([(cx, cy - 38), (cx, cy + 22)], fill=PEARL, width=3)
    for dx, sign in ((-95, 1), (95, -1)):
        ax = cx + dx
        draw.arc([ax - 28, cy - 55, ax + 28, cy + 5], 200, 340, fill=accent.soft, width=4)
        tip_x = ax + sign * 22
        draw.polygon(
            [(tip_x, cy - 28), (tip_x - sign * 14, cy - 40), (tip_x - sign * 14, cy - 16)],
            fill=accent.soft,
        )


def draw_webhook_relay(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    nodes = [(cx - 80, cy), (cx, cy - 50), (cx + 80, cy), (cx, cy + 55)]
    for i, (nx, ny) in enumerate(nodes):
        draw.ellipse([nx - 18, ny - 18, nx + 18, ny + 18], fill=accent.primary, outline=accent.soft, width=2)
        if i < len(nodes) - 1:
            n2 = nodes[i + 1]
            draw.line([(nx, ny), n2], fill=accent.soft, width=3)
    draw.line([(nodes[2][0], nodes[2][1]), (nodes[0][0], nodes[0][1])], fill=accent.soft, width=3)
    draw.polygon([(cx + 38, cy - 50), (cx + 58, cy - 50), (cx + 48, cy - 32)], fill=PEARL)


def draw_openapi_devkit(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    bracket_font = mono(120)
    draw.text((cx - 92, cy - 68), "{", fill=accent.primary, font=bracket_font)
    draw.text((cx + 28, cy - 68), "}", fill=accent.soft, font=bracket_font)
    draw.line([(cx - 30, cy + 10), (cx + 30, cy + 10)], fill=PEARL, width=4)
    draw.line([(cx - 18, cy + 28), (cx + 18, cy + 28)], fill=ASH, width=3)
    draw.line([(cx - 24, cy + 46), (cx + 24, cy + 46)], fill=ASH, width=3)


def draw_phone_store(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    pw, ph = 88, 148
    x0, y0 = cx - pw // 2, cy - ph // 2
    draw.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=18, fill=accent.primary, outline=accent.soft, width=2)
    draw.rounded_rectangle(
        [x0 + 10, y0 + 22, x0 + pw - 10, y0 + ph - 34],
        radius=8,
        fill=OBSIDIAN,
    )
    draw.ellipse([cx - 10, y0 + ph - 24, cx + 10, y0 + ph - 8], fill=PEARL)


def draw_portfolio(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    code_font = mono(72)
    draw.text((cx - 78, cy - 52), "</", fill=accent.primary, font=code_font)
    draw.text((cx + 10, cy - 52), ">", fill=accent.soft, font=code_font)
    draw.rounded_rectangle(
        [cx - 42, cy + 18, cx + 42, cy + 54],
        radius=8,
        fill=(*accent.primary, 80),
        outline=accent.soft,
    )
    draw.text((cx - 22, cy + 22), "ZH", fill=PEARL, font=font(22, bold=True))


def draw_ds_java(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    draw.polygon(
        [(cx - 55, cy - 40), (cx + 55, cy - 40), (cx + 48, cy + 50), (cx - 48, cy + 50)],
        fill=accent.primary,
        outline=accent.soft,
        width=2,
    )
    draw.arc([cx - 62, cy - 55, cx + 10, cy + 15], 90, 270, fill=accent.soft, width=5)
    draw.ellipse([cx - 22, cy - 62, cx + 22, cy - 34], fill=CHARCOAL, outline=accent.soft, width=2)
    draw.text((cx - 16, cy - 8), "J", fill=PEARL, font=font(52, bold=True))


def draw_db_library(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    db_x, db_y = cx - 55, cy - 10
    draw.ellipse([db_x, db_y - 35, db_x + 70, db_y + 5], fill=accent.primary, outline=accent.soft, width=2)
    draw.rectangle([db_x, db_y, db_x + 70, db_y + 55], fill=accent.primary)
    draw.ellipse([db_x, db_y + 35, db_x + 70, db_y + 75], fill=accent.soft, outline=accent.soft, width=2)
    draw.rounded_rectangle([cx + 10, cy - 45, cx + 72, cy + 55], radius=6, fill=GRAPHITE, outline=PEARL, width=2)
    for i in range(4):
        draw.line([(cx + 22, cy - 28 + i * 18), (cx + 60, cy - 28 + i * 18)], fill=ASH, width=2)


def draw_algorithms(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    heights = [30, 55, 80, 50, 95, 65, 40]
    bar_w = 18
    gap = 10
    total_w = len(heights) * bar_w + (len(heights) - 1) * gap
    x = cx - total_w // 2
    base_y = cy + 55
    for i, h in enumerate(heights):
        color = accent.primary if i % 2 == 0 else accent.soft
        draw.rounded_rectangle(
            [x, base_y - h, x + bar_w, base_y],
            radius=4,
            fill=color,
        )
        x += bar_w + gap
    draw.line([(cx - total_w // 2 - 10, base_y + 8), (cx + total_w // 2 + 10, base_y + 8)], fill=PEARL, width=2)


def draw_cyber_network(draw: ImageDraw.ImageDraw, cx: int, cy: int, accent: AccentPalette) -> None:
    draw_mark_plate(draw, cx, cy, accent, 210)
    shield = [
        (cx, cy - 62),
        (cx + 58, cy - 32),
        (cx + 48, cy + 38),
        (cx, cy + 62),
        (cx - 48, cy + 38),
        (cx - 58, cy - 32),
    ]
    draw.polygon(shield, fill=accent.primary, outline=accent.soft, width=2)
    inner = [(cx, cy - 18), (cx - 28, cy + 18), (cx + 28, cy + 18)]
    for i, (nx, ny) in enumerate(inner):
        for j in range(i + 1, len(inner)):
            draw.line([inner[i], inner[j]], fill=PEARL, width=2)
    for nx, ny in inner:
        draw.ellipse([nx - 8, ny - 8, nx + 8, ny + 8], fill=PEARL)


DrawFn = Callable[[ImageDraw.ImageDraw, int, int, AccentPalette], None]


def render_cover(
    filename: str,
    title: str,
    subtitle: str,
    draw_mark: DrawFn,
    accent: AccentPalette,
) -> Path:
    img = Image.new("RGBA", (W, H), OBSIDIAN)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_background(draw)
    # No grid overlay — clean premium mark on dark field
    cx, cy = W // 2, H // 2 - 36
    draw_mark(draw, cx, cy, accent)
    draw_footer(draw, title, subtitle, accent)
    out = add_noise(img)
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path, "PNG", optimize=True)
    return path


COVERS: list[tuple[str, str, str, str, DrawFn]] = [
    ("studysync-cover.png", "studysync", "StudySync API", "FastAPI · SQL · JWT", draw_studysync),
    ("webhook-relay-cover.png", "webhook-relay", "Webhook Relay", "HMAC · retries · rate limits", draw_webhook_relay),
    ("openapi-devkit-cover.png", "openapi-devkit", "OpenAPI DevKit", "TypeScript · Zod · CLI", draw_openapi_devkit),
    ("phone-store-cover.png", "phone-store", "Phone Store API", "Express · MongoDB · JWT", draw_phone_store),
    ("portfolio-cover.png", "portfolio", "Personal Portfolio", "Next.js · TypeScript · Motion", draw_portfolio),
    ("ds-bst-lab-cover.png", "ds-bst-lab", "Binary Search Tree Lab", "Java · JUnit · algorithms", draw_ds_java),
    ("db-library-cover.png", "db-library", "Library Management DB", "PostgreSQL · SQL · Python", draw_db_library),
    ("prog-fund-algorithms-cover.png", "prog-fund-algorithms", "Algorithm Analysis", "Python · benchmarking", draw_algorithms),
    ("cyber-network-cover.png", "cyber-network", "Network Hardening", "Linux · policy · security", draw_cyber_network),
]


def main() -> None:
    print(f"Output directory: {OUT}")
    for file, slug, title, subtitle, draw_mark in COVERS:
        accent = PROJECT_PALETTES[slug]
        path = render_cover(file, title, subtitle, draw_mark, accent)
        print(f"  {path.name}  ({path.stat().st_size:,} bytes)  accent={accent.soft}")


if __name__ == "__main__":
    main()
