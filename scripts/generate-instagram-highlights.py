"""Generate magazine-style Instagram Story Highlight covers and story slides."""

from __future__ import annotations

import argparse
import math
import os
import random
import textwrap
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Callable, Sequence

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand" / "instagram"
FONTS_DIR = OUT / "fonts"
SCREENSHOTS_DIR = OUT / "assets" / "screenshots"
PUBLIC = ROOT / "public"

COVER_SIZE = (1080, 1080)
STORY_SIZE = (1080, 1920)

OBSIDIAN = (5, 5, 5)
CHARCOAL = (21, 21, 21)
GRAPHITE = (47, 47, 47)
INDIGO = (21, 0, 255)
INDIGO_SOFT = (99, 102, 241)
PEARL = (232, 232, 237)
WHITE = (255, 255, 255)
ASH = (163, 163, 163)
MUTED_PEARL = (140, 140, 150)
CODE_BG = (13, 17, 23)
CODE_GREEN = (126, 231, 135)
CODE_BLUE = (121, 184, 255)
CODE_PURPLE = (197, 134, 255)
CODE_ORANGE = (255, 166, 87)

CODE_SNIPPET = '''@router.post("", response_model=DeadlineRead)
def create_deadline(
    body: DeadlineCreate,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> Deadline:
    _owned_course(db, user.id, body.course_id)
    deadline = Deadline(user_id=user.id, **body.model_dump())
    db.add(deadline)
    db.commit()
    return deadline'''


@dataclass(frozen=True)
class ProjectStory:
    slug: str
    name: str
    url: str | None
    fallback_image: Path
    problem: str
    solution: str
    tags: tuple[str, ...]


# ---------------------------------------------------------------------------
# Fonts & helpers
# ---------------------------------------------------------------------------


def load_font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    windir = os.environ.get("WINDIR", r"C:\Windows")
    weight_map = {
        "regular": ["DMSans-Regular.ttf", "DMSans-Medium.ttf"],
        "medium": ["DMSans-Medium.ttf", "DMSans-Regular.ttf"],
        "bold": ["DMSans-Bold.ttf", "segoeuib.ttf", "arialbd.ttf"],
    }
    candidates: list[Path] = []
    for name in weight_map.get(weight, weight_map["regular"]):
        candidates.extend([FONTS_DIR / name, Path(windir) / "Fonts" / name])
    fallback = {
        "bold": ["segoeuib.ttf", "arialbd.ttf"],
        "medium": ["segoeui.ttf", "arial.ttf"],
        "regular": ["segoeui.ttf", "arial.ttf"],
    }
    for name in fallback.get(weight, fallback["regular"]):
        candidates.append(Path(windir) / "Fonts" / name)
    for path in candidates:
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size)
            except OSError:
                continue
    return ImageFont.load_default()


def load_script_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    windir = os.environ.get("WINDIR", r"C:\Windows")
    for name in ("segoesc.ttf", "SegoeScript.ttf", "BRUSHSCI.TTF", "ITCEDSCR.TTF"):
        path = Path(windir) / "Fonts" / name
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size)
            except OSError:
                continue
    return load_font(size, "regular")


def load_mono_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    windir = os.environ.get("WINDIR", r"C:\Windows")
    for name in ("Consolas.ttf", "cour.ttf", "lucon.ttf"):
        path = Path(windir) / "Fonts" / name
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size)
            except OSError:
                continue
    return load_font(size, "regular")


def wrap_text(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


# ---------------------------------------------------------------------------
# Canvas, texture, signature motif
# ---------------------------------------------------------------------------


def obsidian_gradient(size: tuple[int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, OBSIDIAN)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(5 + t * 14)
        g = int(5 + t * 12)
        b = int(8 + t * 28)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def apply_dot_grid(img: Image.Image, spacing: int = 48, alpha: int = 22) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    dot = (255, 255, 255, alpha)
    for x in range(0, w, spacing):
        for y in range(0, h, spacing):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=dot)
    base = img.convert("RGBA")
    return Image.alpha_composite(base, overlay).convert("RGB")


def apply_grain(img: Image.Image, intensity: float = 0.06) -> Image.Image:
    w, h = img.size
    rng = random.Random(42)
    noise = Image.new("L", (w, h))
    px = noise.load()
    for y in range(h):
        for x in range(0, w, 2):
            v = rng.randint(0, 255)
            px[x, y] = v
            if x + 1 < w:
                px[x + 1, y] = v
    noise = noise.filter(ImageFilter.GaussianBlur(radius=0.6))
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    return ImageChops.blend(img, noise_rgb, alpha=intensity)


def finish_canvas(img: Image.Image, *, grid: bool = True, grain: bool = True) -> Image.Image:
    if grid:
        img = apply_dot_grid(img)
    if grain:
        img = apply_grain(img)
    return img


def draw_signature_motif(draw: ImageDraw.ImageDraw) -> None:
    font = load_font(22, "medium")
    draw.text((56, 52), "ZH // 2026", font=font, fill=MUTED_PEARL)


def draw_indigo_underline(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    *,
    thickness: int = 4,
    offset_y: int = 8,
) -> None:
    draw.rectangle([x, y + offset_y, x + width, y + offset_y + thickness], fill=INDIGO)


def new_story_canvas(*, grid: bool = True) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = finish_canvas(obsidian_gradient(STORY_SIZE), grid=grid)
    draw = ImageDraw.Draw(img)
    draw_signature_motif(draw)
    return img, draw


def save_story(img: Image.Image, folder: str, filename: str) -> None:
    out = OUT / folder / filename
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    print(f"  story  {out.relative_to(ROOT)}")


def save_cover(img: Image.Image, filename: str) -> None:
    out = OUT / "covers" / filename
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    print(f"  cover  {out.relative_to(ROOT)}")


# ---------------------------------------------------------------------------
# Layout primitives
# ---------------------------------------------------------------------------


def draw_tags(
    draw: ImageDraw.ImageDraw,
    tags: Sequence[str],
    *,
    x: int,
    y: int,
    max_width: int,
    font: ImageFont.ImageFont,
    accent: tuple[int, int, int] = INDIGO,
    rotate_deg: float = 0,
) -> int:
    pad_x, pad_y = 18, 10
    gap = 12
    rows: list[list[tuple[str, tuple[int, int, int, int]]]] = [[]]
    cursor_x = 0
    for tag in tags:
        tw, th = text_size(draw, tag, font)
        box_w = tw + pad_x * 2
        box_h = th + pad_y * 2
        if cursor_x + box_w > max_width and rows[-1]:
            rows.append([])
            cursor_x = 0
        rows[-1].append((tag, (cursor_x, 0, cursor_x + box_w, box_h)))
        cursor_x += box_w + gap

    cy = y
    for row in rows:
        row_h = max(r[1][3] - r[1][1] for r in row)
        for tag, (rx1, _, rx2, _) in row:
            rect = [x + rx1, cy, x + rx2, cy + row_h]
            if rotate_deg:
                # Simple offset for imperfect alignment
                rect[0] += int(math.sin(len(tag)) * 3)
            draw.rounded_rectangle(rect, radius=8, fill=CHARCOAL, outline=accent, width=1)
            tw, th = text_size(draw, tag, font)
            tx = rect[0] + (rect[2] - rect[0] - tw) // 2
            ty = rect[1] + (rect[3] - rect[1] - th) // 2 - 1
            draw.text((tx, ty), tag, font=font, fill=PEARL)
        cy += row_h + gap
    return cy


def draw_handwritten_arrow(
    draw: ImageDraw.ImageDraw,
    start: tuple[int, int],
    end: tuple[int, int],
    label: str | None = None,
) -> None:
    sx, sy = start
    ex, ey = end
    mid_x = (sx + ex) // 2 + random.randint(-20, 20)
    mid_y = (sy + ey) // 2 + random.randint(-15, 15)
    draw.line([(sx, sy), (mid_x, mid_y), (ex, ey)], fill=INDIGO, width=3)
    angle = math.atan2(ey - mid_y, ex - mid_x)
    ah = 18
    for da in (2.6, -2.6):
        ax = ex - ah * math.cos(angle - da)
        ay = ey - ah * math.sin(angle - da)
        draw.line([(ex, ey), (int(ax), int(ay))], fill=INDIGO, width=3)
    if label:
        script = load_script_font(36)
        draw.text((sx, sy - 44), label, font=script, fill=PEARL)


def paste_rotated_card(base: Image.Image, card: Image.Image, xy: tuple[int, int], angle: float) -> None:
    rotated = card.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    base.paste(rotated, xy, rotated if rotated.mode == "RGBA" else None)


def draw_browser_frame(
    img: Image.Image,
    draw: ImageDraw.ImageDraw,
    inner: Image.Image | None,
    *,
    x: int,
    y: int,
    w: int,
    h: int,
    title: str,
) -> None:
    chrome_h = 52
    draw.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=GRAPHITE, outline=(60, 60, 68), width=2)
    draw.rectangle([x, y, x + w, y + chrome_h], fill=(32, 32, 38))
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse([x + 18 + i * 28, y + 18, x + 30 + i * 28, y + 30], fill=color)
    url_font = load_font(20, "regular")
    draw.text((x + 110, y + 14), title, font=url_font, fill=ASH)
    viewport = [x + 8, y + chrome_h + 8, x + w - 8, y + h - 8]
    draw.rectangle(viewport, fill=CHARCOAL)
    if inner:
        fitted = inner.copy()
        fitted.thumbnail((viewport[2] - viewport[0], viewport[3] - viewport[1]), Image.Resampling.LANCZOS)
        px = viewport[0] + (viewport[2] - viewport[0] - fitted.width) // 2
        py = viewport[1] + (viewport[3] - viewport[1] - fitted.height) // 2
        img.paste(fitted, (px, py))


def load_image(path: Path | None, size: tuple[int, int] | None = None) -> Image.Image | None:
    if path is None or not path.exists():
        return None
    img = Image.open(path).convert("RGB")
    if size:
        img.thumbnail(size, Image.Resampling.LANCZOS)
    return img


def find_headshot() -> Path | None:
    patterns = [
        PUBLIC / "headshot.jpg",
        PUBLIC / "headshot.png",
        PUBLIC / "zachary-headshot.jpg",
        PUBLIC / "profile.jpg",
        OUT / "assets" / "headshot.jpg",
        OUT / "assets" / "headshot.png",
    ]
    for p in patterns:
        if p.exists():
            return p
    return None


# ---------------------------------------------------------------------------
# Cover layouts
# ---------------------------------------------------------------------------


def draw_minimal_cover(label: str, filename: str, *, letter_only: bool = False) -> None:
    img = finish_canvas(obsidian_gradient(COVER_SIZE), grid=True, grain=True)
    draw = ImageDraw.Draw(img)
    w, h = COVER_SIZE
    draw_signature_motif(draw)

    if letter_only:
        main = label[0]
        font = load_font(280, "bold")
    else:
        main = label
        font = load_font(88, "bold")

    tw, th = text_size(draw, main, font)
    cx, cy = w // 2, h // 2 - 20
    draw.text((cx - tw // 2, cy - th // 2), main, font=font, fill=PEARL)
    draw_indigo_underline(draw, cx - min(tw, 180) // 2, cy + th // 2 + 12, min(tw, 180))

    if not letter_only and len(label) == 1:
        pass
    elif not letter_only:
        sub_font = load_font(24, "medium")
        sub = label[0]
        sw, _ = text_size(draw, sub, sub_font)
        draw.text((cx - sw // 2, cy + th // 2 + 36), sub, font=sub_font, fill=MUTED_PEARL)

    save_cover(img, filename)


# ---------------------------------------------------------------------------
# Story layout functions
# ---------------------------------------------------------------------------


def layout_corner_text(
    folder: str,
    filename: str,
    *,
    corner: str,
    eyebrow: str,
    headline: str,
    body: str,
    underline_at: str = "headline",
) -> None:
    img, draw = new_story_canvas()
    w, h = STORY_SIZE
    margin = 72
    title_font = load_font(64, "bold")
    body_font = load_font(34, "regular")
    eyebrow_font = load_font(26, "medium")

    if corner.startswith("bl"):
        x, y = margin, h - margin - 420
    elif corner.startswith("br"):
        x, y = w - margin - 520, h - margin - 420
    elif corner.startswith("tl"):
        x, y = margin, 160
    else:
        x, y = w - margin - 520, 160

    draw.text((x, y), eyebrow.upper(), font=eyebrow_font, fill=INDIGO_SOFT)
    y += 44
    for line in wrap_text(headline, 14):
        draw.text((x, y), line, font=title_font, fill=WHITE)
        if underline_at == "headline":
            lw, lh = text_size(draw, line, title_font)
            draw_indigo_underline(draw, x, y + lh, min(lw, 320))
        y += 76
    y += 20
    for line in wrap_text(body, 28):
        draw.text((x, y), line, font=body_font, fill=PEARL)
        y += 48

    save_story(img, folder, filename)


def layout_tilted_card(
    folder: str,
    filename: str,
    *,
    title: str,
    body: str,
    tags: Sequence[str] = (),
    angle: float = -3.5,
) -> None:
    img, draw = new_story_canvas(grid=False)
    card_w, card_h = 780, 920
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, card_w, card_h], radius=24, fill=CHARCOAL, outline=INDIGO, width=2)
    y = 48
    tf = load_font(52, "bold")
    bf = load_font(32, "regular")
    for line in wrap_text(title, 16):
        cd.text((48, y), line, font=tf, fill=WHITE)
        y += 62
    y += 16
    draw_indigo_underline(cd, 48, y, 120)
    y += 28
    for line in wrap_text(body, 30):
        cd.text((48, y), line, font=bf, fill=PEARL)
        y += 46
    if tags:
        tag_font = load_font(24, "medium")
        draw_tags(cd, tags, x=48, y=y + 24, max_width=card_w - 96, font=tag_font)

    paste_rotated_card(img, card, (140, 280), angle)
    save_story(img, folder, filename)


def layout_polaroid(
    folder: str,
    filename: str,
    *,
    photo: Image.Image | None,
    caption: str,
    placeholder_text: str = "Drop your photo here",
) -> None:
    img, draw = new_story_canvas()
    frame_w, frame_h = 720, 880
    fx, fy = 180, 320
    draw.rectangle([fx, fy, fx + frame_w, fy + frame_h], fill=(245, 245, 240))
    photo_area = [fx + 36, fy + 36, fx + frame_w - 36, fy + frame_h - 160]
    draw.rectangle(photo_area, fill=GRAPHITE)

    if photo:
        fitted = photo.copy()
        fitted.thumbnail((photo_area[2] - photo_area[0], photo_area[3] - photo_area[1]), Image.Resampling.LANCZOS)
        px = photo_area[0] + (photo_area[2] - photo_area[0] - fitted.width) // 2
        py = photo_area[1] + (photo_area[3] - photo_area[1] - fitted.height) // 2
        img.paste(fitted, (px, py))
    else:
        pf = load_font(28, "medium")
        lines = wrap_text(placeholder_text, 16)
        ty = photo_area[1] + (photo_area[3] - photo_area[1]) // 2 - len(lines) * 20
        for line in lines:
            lw, _ = text_size(draw, line, pf)
            cx = photo_area[0] + (photo_area[2] - photo_area[0] - lw) // 2
            draw.text((cx, ty), line, font=pf, fill=ASH)
            ty += 40

    cap_font = load_script_font(38)
    cw, _ = text_size(draw, caption, cap_font)
    draw.text((fx + (frame_w - cw) // 2, fy + frame_h - 100), caption, font=cap_font, fill=CHARCOAL)
    draw_indigo_underline(draw, fx + 80, fy + frame_h - 48, frame_w - 160)
    save_story(img, folder, filename)


def layout_browser_slide(
    folder: str,
    filename: str,
    *,
    screenshot: Image.Image | None,
    url: str,
    project_name: str,
) -> None:
    img, draw = new_story_canvas()
    draw.text((72, 130), project_name.upper(), font=load_font(28, "medium"), fill=INDIGO_SOFT)
    draw_browser_frame(img, draw, screenshot, x=72, y=220, w=936, h=1280, title=url)
    draw_handwritten_arrow(draw, (780, 1580), (920, 1720), "live →")
    save_story(img, folder, filename)


def layout_one_liner(
    folder: str,
    filename: str,
    *,
    label: str,
    line: str,
    align: str = "left",
    rotate_card: float = 0,
) -> None:
    img, draw = new_story_canvas()
    w, _ = STORY_SIZE
    card = Image.new("RGBA", (860, 360), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, 860, 360], radius=20, fill=CHARCOAL, outline=GRAPHITE, width=2)
    lf = load_font(24, "medium")
    tf = load_font(40, "bold")
    cd.text((48, 40), label.upper(), font=lf, fill=INDIGO)
    y = 100
    for ln in wrap_text(line, 32):
        cd.text((48, y), ln, font=tf, fill=WHITE)
        y += 52
    draw_indigo_underline(cd, 48, y + 8, 200)
    xy = (110, 760) if align == "left" else (80, 820)
    paste_rotated_card(img, card, xy, rotate_card)
    save_story(img, folder, filename)


def layout_code_ide(folder: str, filename: str) -> None:
    img, draw = new_story_canvas(grid=False)
    panel = [64, 180, 1016, 1680]
    draw.rounded_rectangle(panel, radius=18, fill=CODE_BG, outline=GRAPHITE, width=2)
    draw.rectangle([panel[0], panel[1], panel[2], panel[1] + 44], fill=(22, 27, 34))
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse([panel[0] + 16 + i * 22, panel[1] + 14, panel[0] + 28 + i * 22, panel[1] + 26], fill=c)
    draw.text((panel[0] + 90, panel[1] + 10), "deadlines.py — studysync-api", font=load_font(18, "regular"), fill=ASH)

    mono = load_mono_font(26)
    y = panel[1] + 72
    for line in CODE_SNIPPET.splitlines():
        color = PEARL
        if line.strip().startswith("@"):
            color = CODE_PURPLE
        elif "def " in line:
            color = CODE_BLUE
        elif "return" in line:
            color = CODE_ORANGE
        elif '"' in line or "Annotated" in line:
            color = CODE_GREEN
        draw.text((panel[0] + 32, y), line, font=mono, fill=color)
        y += 38

    draw.text((72, 1720), "Real route from StudySync API", font=load_font(26, "medium"), fill=MUTED_PEARL)
    draw_indigo_underline(draw, 72, 1758, 280)
    save_story(img, folder, filename)


def layout_logo_grid(folder: str, filename: str, badges: Sequence[str]) -> None:
    img, draw = new_story_canvas()
    draw.text((72, 140), "STACK", font=load_font(28, "medium"), fill=INDIGO_SOFT)
    draw.text((72, 190), "Tools I reach for", font=load_font(56, "bold"), fill=WHITE)
    draw_indigo_underline(draw, 72, 268, 200)

    cols = 2
    bw, bh, gap = 420, 100, 24
    sx, sy = 72, 340
    bf = load_font(32, "bold")
    for i, badge in enumerate(badges):
        col = i % cols
        row = i // cols
        x = sx + col * (bw + gap) + (row % 2) * 18
        y = sy + row * (bh + gap) + (col % 2) * 8
        draw.rounded_rectangle([x, y, x + bw, y + bh], radius=14, fill=CHARCOAL, outline=INDIGO, width=1)
        tw, th = text_size(draw, badge, bf)
        draw.text((x + (bw - tw) // 2, y + (bh - th) // 2 - 2), badge, font=bf, fill=PEARL)
    save_story(img, folder, filename)


def layout_github_contributions(folder: str, filename: str, screenshot: Image.Image | None) -> None:
    img, draw = new_story_canvas()
    draw.text((72, 140), "GITHUB", font=load_font(26, "medium"), fill=INDIGO_SOFT)
    draw.text((72, 200), "Building every week", font=load_font(58, "bold"), fill=WHITE)
    draw_indigo_underline(draw, 72, 278, 260)

    if screenshot:
        fitted = screenshot.copy()
        fitted.thumbnail((920, 720), Image.Resampling.LANCZOS)
        px = (STORY_SIZE[0] - fitted.width) // 2
        draw.rounded_rectangle([px - 12, 340, px + fitted.width + 12, 340 + fitted.height + 12], radius=16, fill=CHARCOAL)
        img.paste(fitted, (px, 352))
    else:
        # Stylized contribution grid mock
        gx, gy = 120, 380
        rng = random.Random(7)
        for week in range(26):
            for day in range(7):
                level = rng.choice([0, 0, 1, 1, 2, 2, 3, 4])
                colors = [GRAPHITE, (22, 40, 80), (18, 60, 140), (21, 0, 200), INDIGO]
                c = colors[level]
                draw.rounded_rectangle(
                    [gx + week * 34, gy + day * 34, gx + week * 34 + 28, gy + day * 34 + 28],
                    radius=6,
                    fill=c,
                )
        draw.text((120, 680), "github.com/zacharyahutton", font=load_font(28, "medium"), fill=ASH)

    draw_handwritten_arrow(draw, (620, 1480), (880, 1680), "Building every week →")
    save_story(img, folder, filename)


def layout_connect_links(folder: str, filename: str) -> None:
    img, draw = new_story_canvas()
    links = [
        ("Email", "hzach577@gmail.com"),
        ("LinkedIn", "linkedin.com/in/zachary-hutton-a2ab81415"),
        ("GitHub", "github.com/zacharyahutton"),
        ("Portfolio", "zachary-hutton-portfolio.vercel.app"),
    ]
    y = 220
    hf = load_font(52, "bold")
    lf = load_font(30, "regular")
    draw.text((72, 140), "CONNECT", font=load_font(26, "medium"), fill=INDIGO_SOFT)
    for label, value in links:
        draw.text((72 + random.randint(-4, 8), y), label, font=load_font(22, "medium"), fill=INDIGO)
        draw.text((72 + random.randint(0, 12), y + 36), value, font=lf, fill=PEARL)
        lw, _ = text_size(draw, value, lf)
        draw_indigo_underline(draw, 72, y + 36 + 34, min(lw, 520), thickness=3)
        y += 120
    save_story(img, folder, filename)


def layout_qr_slide(folder: str, filename: str) -> None:
    img, draw = new_story_canvas()
    url = "https://zachary-hutton-portfolio.vercel.app/"
    qr_img: Image.Image | None = None
    try:
        import qrcode

        qr = qrcode.QRCode(box_size=8, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="white", back_color=CHARCOAL).convert("RGB")
        qr_img = qr_img.resize((420, 420), Image.Resampling.NEAREST)
    except ImportError:
        draw.text((72, 400), "pip install qrcode[pil]", font=load_font(28, "regular"), fill=ASH)

    draw.text((72, 180), "Scan to portfolio", font=load_font(56, "bold"), fill=WHITE)
    draw_indigo_underline(draw, 72, 258, 240)
    if qr_img:
        draw.rounded_rectangle([300, 520, 780, 1000], radius=20, fill=CHARCOAL, outline=INDIGO, width=2)
        img.paste(qr_img, (330, 550))
    draw.text((72, 1100), url, font=load_font(26, "regular"), fill=MUTED_PEARL)
    save_story(img, folder, filename)


def layout_campus_placeholder(folder: str, filename: str) -> None:
    img, draw = new_story_canvas()
    draw.rounded_rectangle([72, 220, 1008, 980], radius=20, fill=GRAPHITE, outline=(55, 55, 62), width=2)
    pf = load_font(32, "medium")
    msg = "Campus / study spot — replace with your photo"
    lines = wrap_text(msg, 22)
    ty = 520
    for line in lines:
        lw, _ = text_size(draw, line, pf)
        draw.text(((STORY_SIZE[0] - lw) // 2, ty), line, font=pf, fill=ASH)
        ty += 44

    card = Image.new("RGBA", (880, 280), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, 880, 280], radius=18, fill=CHARCOAL, outline=INDIGO, width=2)
    tf = load_font(44, "bold")
    cd.text((48, 48), "CS @ UTech", font=tf, fill=WHITE)
    cd.text((48, 118), "GPA 3.7 · Dean's List · 2029", font=load_font(30, "regular"), fill=PEARL)
    draw_indigo_underline(cd, 48, 200, 180)
    paste_rotated_card(img, card, (100, 1040), 2.5)
    save_story(img, folder, filename)


# ---------------------------------------------------------------------------
# Playwright capture (optional)
# ---------------------------------------------------------------------------


CAPTURE_TARGETS = {
    "portfolio": "https://zachary-hutton-portfolio.vercel.app/",
    "weroi": "https://weroi.net",
    "pntcog": "https://portmorentcog.org",
    "github": "https://github.com/zacharyahutton",
}


def capture_screenshots(force: bool = False) -> dict[str, Path]:
    saved: dict[str, Path] = {}
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("  capture  playwright not installed — using fallbacks")
        return saved

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
        page = context.new_page()
        for key, url in CAPTURE_TARGETS.items():
            out = SCREENSHOTS_DIR / f"{key}.png"
            if out.exists() and not force:
                saved[key] = out
                continue
            try:
                page.goto(url, wait_until="networkidle", timeout=45000)
                page.wait_for_timeout(1500)
                if key == "github":
                    page.evaluate("window.scrollTo(0, 400)")
                    page.wait_for_timeout(800)
                page.screenshot(path=str(out), full_page=False)
                saved[key] = out
                print(f"  capture  {out.relative_to(ROOT)}")
            except Exception as exc:
                print(f"  capture  skipped {key}: {exc}")
        browser.close()
    return saved


# ---------------------------------------------------------------------------
# Project data & generation orchestration
# ---------------------------------------------------------------------------


PROJECTS: list[ProjectStory] = [
    ProjectStory(
        slug="portfolio",
        name="Personal Portfolio",
        url="zachary-hutton-portfolio.vercel.app",
        fallback_image=PUBLIC / "case-studies" / "portfolio-cover.png",
        problem="Recruiters need one place to see projects, case studies, and resume.",
        solution="Next.js portfolio with typed content, obsidian design, Vercel deploy.",
        tags=("Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"),
    ),
    ProjectStory(
        slug="weroi",
        name="weROI Platform",
        url="weroi.net",
        fallback_image=PUBLIC / "case-studies" / "weroi-cover.png",
        problem="Agency needed lead capture, admin tooling, and email integration.",
        solution="React + FastAPI + MongoDB stack with JWT admin and Resend email.",
        tags=("React", "FastAPI", "MongoDB", "JWT", "Vercel", "Railway"),
    ),
    ProjectStory(
        slug="studysync",
        name="StudySync API",
        url=None,
        fallback_image=PUBLIC / "case-studies" / "studysync-cover.png",
        problem="Track coursework deadlines and study sessions in one API.",
        solution="FastAPI + SQLAlchemy + JWT auth with OpenAPI docs.",
        tags=("Python", "FastAPI", "SQLAlchemy", "JWT", "OpenAPI"),
    ),
    ProjectStory(
        slug="pntcog",
        name="PNTCOG Ministry",
        url="portmorentcog.org",
        fallback_image=PUBLIC / "case-studies" / "pntcog-cover.png",
        problem="Church community needed events, giving, prayer, and media online.",
        solution="Multi-section React site — mobile-first, live on Vercel.",
        tags=("React", "TypeScript", "Vercel", "Responsive UI"),
    ),
]


def screenshot_for(slug: str, captures: dict[str, Path]) -> Image.Image | None:
    path = captures.get(slug)
    if path and path.exists():
        return load_image(path)
    fallback = next((p.fallback_image for p in PROJECTS if p.slug == slug), None)
    return load_image(fallback)


def generate_covers() -> None:
    covers = [
        ("ABOUT", "01-about.png"),
        ("BUILD", "02-build.png"),
        ("STACK", "03-stack.png"),
        ("UTECH", "04-utech.png"),
        ("CONNECT", "05-connect.png"),
    ]
    for label, filename in covers:
        draw_minimal_cover(label, filename, letter_only=False)


def generate_about(captures: dict[str, Path]) -> None:
    headshot = load_image(find_headshot(), (640, 640))
    layout_polaroid(
        "stories-about",
        "01-portrait.png",
        photo=headshot,
        caption="Zachary Hutton",
        placeholder_text="Drop your photo here",
    )
    layout_polaroid(
        "stories-about",
        "02-workspace.png",
        photo=None,
        caption="Where I build",
        placeholder_text="Desk / laptop setup — replace with your photo",
    )
    gh_shot = load_image(captures.get("github"))
    layout_github_contributions("stories-about", "03-github-weekly.png", gh_shot)


def generate_build(captures: dict[str, Path]) -> None:
    for i, proj in enumerate(PROJECTS, start=1):
        prefix = f"{i:02d}-{proj.slug}"
        shot = screenshot_for(proj.slug, captures)
        if shot is None:
            shot = load_image(proj.fallback_image)
        layout_browser_slide(
            "stories-build",
            f"{prefix}-a-browser.png",
            screenshot=shot,
            url=proj.url or "github.com/zacharyahutton/studysync-api",
            project_name=proj.name,
        )
        layout_one_liner(
            "stories-build",
            f"{prefix}-b-problem.png",
            label="Problem solved",
            line=proj.problem,
            align="left" if i % 2 else "right",
            rotate_card=-2.0 if i % 2 else 3.0,
        )
        layout_one_liner(
            "stories-build",
            f"{prefix}-c-solution.png",
            label="Solution",
            line=proj.solution,
            align="right" if i % 2 else "left",
            rotate_card=2.5 if i % 2 else -3.5,
        )
        layout_tilted_card(
            "stories-build",
            f"{prefix}-d-stack.png",
            title=proj.name,
            body="Stack",
            tags=proj.tags,
            angle=-4.0 + i,
        )


def generate_stack() -> None:
    layout_corner_text(
        "stories-stack",
        "01-what-i-build.png",
        corner="bl",
        eyebrow="Stack",
        headline="What I build",
        body="Web apps, REST APIs, and internal tools — shipped with auth, docs, and deploy pipelines.",
    )
    layout_logo_grid(
        "stories-stack",
        "02-tech-badges.png",
        badges=("React", "Next.js", "FastAPI", "Python", "TypeScript", "MongoDB", "Tailwind", "Vercel"),
    )
    layout_code_ide("stories-stack", "03-code-snippet.png")


def generate_utech() -> None:
    layout_campus_placeholder("stories-utech", "01-campus.png")
    layout_tilted_card(
        "stories-utech",
        "02-labs-github.png",
        title="Labs → GitHub",
        body="Coursework concepts become repos I can demo. OWASP & PortSwigger labs on personal time.",
        tags=("GitHub", "OWASP", "PortSwigger", "Build in public"),
        angle=-2.8,
    )


def generate_connect() -> None:
    layout_corner_text(
        "stories-connect",
        "01-open-to-work.png",
        corner="tl",
        eyebrow="Connect",
        headline="Open to internships & co-ops",
        body="BSc CS @ UTech · Portmore, Jamaica · remote OK · portfolio & resume in bio.",
        underline_at="headline",
    )
    layout_connect_links("stories-connect", "02-links.png")
    layout_qr_slide("stories-connect", "03-qr-portfolio.png")


def cleanup_legacy_folders() -> None:
    legacy_covers = ("02-projects.png", "03-skills.png", "05-contact.png")
    for name in legacy_covers:
        path = OUT / "covers" / name
        if path.exists():
            path.unlink()
            print(f"  removed  {path.relative_to(ROOT)}")

    legacy_stories = {
        "stories-about": (
            "01-who-i-am.png",
            "02-what-i-build.png",
            "03-open-to-internships.png",
        ),
        "stories-utech": ("01-cs-student.png",),
    }
    for folder, names in legacy_stories.items():
        for name in names:
            path = OUT / folder / name
            if path.exists():
                path.unlink()
                print(f"  removed  {path.relative_to(ROOT)}")

    for name in ("stories-projects", "stories-skills", "stories-contact"):
        folder = OUT / name
        if folder.is_dir():
            for f in folder.glob("*.png"):
                f.unlink()
            try:
                folder.rmdir()
            except OSError:
                pass


def write_photos_needed() -> None:
    path = OUT / "photos-needed.md"
    path.write_text(
        """# Photos to shoot or replace

Replace placeholder slides by saving images to `brand/instagram/assets/` and re-running the generator (or swap PNGs manually before upload).

| Priority | Asset | Used on | Shot notes |
|----------|-------|---------|------------|
| **High** | Portrait / headshot | About slide 1 | Natural light, shoulders up, neutral or dark background, square-safe crop |
| **High** | Desk / laptop setup | About slide 2 | Your actual workspace — laptop, notebook, coffee optional |
| **High** | UTech campus or study spot | UTech slide 1 | Outdoor campus, lab, or library — horizontal, well lit |
| Medium | Whiteboard or notebook | Optional BUILD/About B-roll | Sketches, pseudocode, or task lists — candid, not staged |
| Medium | Coffee shop / coworking | Optional About filler | Environment shot if you want more lifestyle texture |
| Low | Candid “at work” | Motion folder B-roll | 3–4 sec clip for animated Stories later |

## File naming (optional automation)

- `assets/headshot.jpg` — auto-used on About slide 1 when present
- `assets/workspace.jpg` — wire into script later for slide 2
- `assets/campus.jpg` — wire into script later for UTech slide 1

## Style guide

- Prefer **natural light**, slight imperfection, magazine candid — not stock-photo stiff
- Dark/neutral tones match obsidian portfolio palette
- Leave headroom for Instagram UI overlays (top/bottom ~15%)
""",
        encoding="utf-8",
    )
    print(f"  wrote  {path.relative_to(ROOT)}")


def write_motion_readme() -> None:
    motion_dir = OUT / "motion"
    motion_dir.mkdir(parents=True, exist_ok=True)
    path = motion_dir / "README.md"
    path.write_text(
        """# Motion assets for Instagram Stories

Optional **3–4 second** screen recordings to post as video Stories (same highlight folders).

## Suggested clips

1. **Portfolio scroll** — slow scroll through https://zachary-hutton-portfolio.vercel.app/ (hero → projects)
2. **Terminal** — `git log --oneline -5` or a quick test run (`pytest -q`, `npm run build`)
3. **IDE** — pan across a real file in studysync-api or portfolio (no secrets on screen)

## How to record

- **Windows:** Xbox Game Bar (`Win + G`) or OBS Studio
- **macOS:** QuickTime → New Screen Recording
- Keep **1080×1920** or record landscape and crop in CapCut / Instagram

## Convert to MP4 for Stories

- [CloudConvert WebM → MP4](https://cloudconvert.com/webm-to-mp4)
- CapCut / Instagram editor: import → trim to 3–4s → export 1080×1920

## Upload

Post as Stories → pin to the same highlight (**BUILD** or **About**). Mix 1–2 motion slides among static PNGs so the highlight feels alive.

No motion files are generated by the script — add your own MP4/WebM here when ready.
""",
        encoding="utf-8",
    )
    print(f"  wrote  {path.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Instagram highlight PNGs")
    parser.add_argument("--capture", action="store_true", help="Capture live site screenshots via Playwright")
    parser.add_argument("--force-capture", action="store_true", help="Re-capture even if screenshots exist")
    args = parser.parse_args()

    print(f"Output: {OUT}")
    captures: dict[str, Path] = {}
    if args.capture or args.force_capture:
        captures = capture_screenshots(force=args.force_capture)
    else:
        for key in CAPTURE_TARGETS:
            p = SCREENSHOTS_DIR / f"{key}.png"
            if p.exists():
                captures[key] = p

    # Attempt capture once if no screenshots yet
    if not captures and not args.capture:
        print("  capture  trying Playwright for missing screenshots…")
        captures = capture_screenshots(force=False)

    cleanup_legacy_folders()
    generate_covers()
    generate_about(captures)
    generate_build(captures)
    generate_stack()
    generate_utech()
    generate_connect()
    write_photos_needed()
    write_motion_readme()

    cover_count = len(list((OUT / "covers").glob("*.png")))
    story_count = sum(len(list(d.glob("*.png"))) for d in OUT.glob("stories-*") if d.is_dir())
    print(f"Done. Generated {cover_count} covers + {story_count} story slides.")


if __name__ == "__main__":
    main()
