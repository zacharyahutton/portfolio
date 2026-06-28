"""Generate magazine-style Instagram Story Highlight covers and story slides."""

from __future__ import annotations

import argparse
import math
import os
import random
import textwrap
import urllib.error
import urllib.request
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Callable, Sequence

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand" / "instagram"
FONTS_DIR = OUT / "fonts"
SCREENSHOTS_DIR = OUT / "assets" / "screenshots"
ASSETS_DIR = OUT / "assets"
DESK_SETUP = ASSETS_DIR / "desk-setup.png"
UTECH_CAMPUS = ASSETS_DIR / "utech-campus.png"
PUBLIC = ROOT / "public"

# Source dimensions (measured): desk-setup.png 1024×768, utech-campus.png 678×452
DESK_SETUP_REF_SIZE = (1024, 768)
UTECH_REF_SIZE = (678, 452)
DESK_CROP_MONITOR = (12, 28, 548, 400)   # left SANSUI monitor — portfolio on screen
DESK_CROP_LAPTOP = (540, 90, 820, 380)   # MSI laptop — GitHub profile page
UTECH_CROP_SIGN = (0, 0, 678, 272)       # top ~60% — campus sign readable

COVER_SIZE = (1080, 1080)
STORY_SIZE = (1080, 1920)
STORY_MARGIN = 80
MARGIN = 80
LOWER_THIRD_Y = 1640
LOWER_THIRD_H = 280

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
    learned: str
    tags: tuple[str, ...]


@dataclass(frozen=True)
class SkillEntry:
    name: str
    blurb: str
    logo_key: str | None = None


LOGOS_DIR = ASSETS_DIR / "logos"

DEVICON_PATHS: dict[str, str] = {
    "python": "python/python-original",
    "typescript": "typescript/typescript-original",
    "javascript": "javascript/javascript-original",
    "java": "java/java-original",
    "react": "react/react-original",
    "nextjs": "nextjs/nextjs-original",
    "fastapi": "fastapi/fastapi-original",
    "tailwind": "tailwindcss/tailwindcss-original",
    "nodejs": "nodejs/nodejs-original",
    "mongodb": "mongodb/mongodb-original",
    "docker": "docker/docker-original",
    "git": "git/git-original",
    "vercel": "vercel/vercel-original",
    "express": "express/express-original",
    "sqlalchemy": "sqlalchemy/sqlalchemy-original",
    "postman": "postman/postman-original",
    "railway": "railway/railway-original",
}

STACK_LANGUAGES: tuple[SkillEntry, ...] = (
    SkillEntry("Python", "Backend APIs, automation, and coursework labs", "python"),
    SkillEntry("TypeScript", "Type-safe frontends and shared app logic", "typescript"),
    SkillEntry("JavaScript", "Interactive UI and full-stack prototypes", "javascript"),
    SkillEntry("Java", "OOP fundamentals and university coursework", "java"),
)

STACK_FRAMEWORKS: tuple[SkillEntry, ...] = (
    SkillEntry("React", "Component-driven UIs", "react"),
    SkillEntry("Next.js", "Full-stack React with fast deploys", "nextjs"),
    SkillEntry("FastAPI", "Typed Python APIs with OpenAPI docs", "fastapi"),
    SkillEntry("Tailwind CSS", "Utility-first styling at speed", "tailwind"),
    SkillEntry("Express", "Lightweight Node HTTP services", "express"),
    SkillEntry("Node.js", "JavaScript on the server", "nodejs"),
)

STACK_TOOLS: tuple[SkillEntry, ...] = (
    SkillEntry("Git", "Version control and code review", "git"),
    SkillEntry("Docker", "Reproducible dev environments", "docker"),
    SkillEntry("Vercel", "Frontend previews and production", "vercel"),
    SkillEntry("Railway", "Backend and database hosting", "railway"),
    SkillEntry("Postman", "API testing and documentation", "postman"),
)

WHAT_I_BUILD_CARDS: tuple[tuple[str, str], ...] = (
    (
        "Web apps",
        "Interactive products people open in a browser: portfolios, dashboards, "
        "and client sites with polished UI and real auth flows.",
    ),
    (
        "APIs",
        "REST backends that validate input, document endpoints, and let frontends "
        "fetch data safely without exposing secrets.",
    ),
    (
        "Secure backends",
        "Login flows, protected routes, and deploy pipelines so user data stays "
        "private from localhost to production.",
    ),
)


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
    gap: int = 16,
) -> None:
    """Draw underline below y (text bottom edge). gap keeps the line off the glyphs."""
    draw.rectangle([x, y + gap, x + width, y + gap + thickness], fill=INDIGO)


def underline_text_bbox(
    draw: ImageDraw.ImageDraw,
    bbox: tuple[int, int, int, int],
    *,
    max_width: int | None = None,
    thickness: int = 4,
    gap: int = 16,
) -> None:
    x1, _, x2, y2 = bbox
    full_w = x2 - x1
    width = min(full_w, max_width) if max_width else full_w
    ux = x1 + (full_w - width) // 2
    draw_indigo_underline(draw, ux, y2, width, thickness=thickness, gap=gap)


def new_story_canvas(*, grid: bool = True) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = finish_canvas(obsidian_gradient(STORY_SIZE), grid=grid)
    draw = ImageDraw.Draw(img)
    draw_signature_motif(draw)
    return img, draw


def save_story(img: Image.Image, folder: str, filename: str) -> None:
    if img.size != STORY_SIZE:
        raise ValueError(f"{folder}/{filename}: expected {STORY_SIZE}, got {img.size}")
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
        vw = viewport[2] - viewport[0]
        vh = viewport[3] - viewport[1]
        max_w = int(vw * 0.85)
        fitted = contain_photo(inner, (max_w, vh), bg=CHARCOAL, valign="center")
        px = viewport[0] + (vw - fitted.width) // 2
        py = viewport[1] + (vh - fitted.height) // 2
        img.paste(fitted, (px, py))


def load_image(path: Path | None, size: tuple[int, int] | None = None) -> Image.Image | None:
    if path is None or not path.exists():
        return None
    img = Image.open(path).convert("RGB")
    if size:
        img.thumbnail(size, Image.Resampling.LANCZOS)
    return img


def crop_fraction(img: Image.Image, left: float, top: float, right: float, bottom: float) -> Image.Image:
    w, h = img.size
    return img.crop((int(w * left), int(h * top), int(w * right), int(h * bottom)))


def crop_pixels(img: Image.Image, box: tuple[int, int, int, int], *, ref_size: tuple[int, int] | None = None) -> Image.Image:
    """Crop pixel region; scale coords when source size differs from ref_size."""
    if ref_size is None:
        ref_size = DESK_SETUP_REF_SIZE
    ref_w, ref_h = ref_size
    w, h = img.size
    if (w, h) == ref_size:
        return img.crop(box)
    x1, y1, x2, y2 = box
    sx, sy = w / ref_w, h / ref_h
    return img.crop((int(x1 * sx), int(y1 * sy), int(x2 * sx), int(y2 * sy)))


def crop_region(img: Image.Image, x1: int, y1: int, x2: int, y2: int) -> Image.Image:
    """Alias for crop_pixels with explicit coordinates."""
    return crop_pixels(img, (x1, y1, x2, y2))


def fit_image_cover(
    img: Image.Image,
    target: tuple[int, int],
    *,
    anchor: str = "center",
) -> Image.Image:
    """Scale and crop to fill target (object-fit: cover)."""
    return cover_photo(img, target, anchor=anchor)


def fit_image_contain(
    img: Image.Image,
    target: tuple[int, int],
    *,
    bg: tuple[int, int, int] = OBSIDIAN,
    valign: str = "center",
) -> Image.Image:
    """Scale to fit inside target with letterboxing (object-fit: contain)."""
    return contain_photo(img, target, bg=bg, valign=valign)


def cover_photo(
    img: Image.Image,
    target: tuple[int, int],
    *,
    anchor: str = "center",
) -> Image.Image:
    """Scale and crop photo to fill target (ImageOps.fit, LANCZOS)."""
    tw, th = target
    if anchor == "center":
        return ImageOps.fit(img, target, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    fitted = ImageOps.fit(img, target, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    # Re-fit with horizontal anchor when design calls for it
    scale = max(tw / img.width, th / img.height)
    new_w, new_h = int(img.width * scale), int(img.height * scale)
    src = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = 0 if anchor == "left" else (new_w - tw if anchor == "right" else (new_w - tw) // 2)
    y = (new_h - th) // 2
    return src.crop((x, y, x + tw, y + th))


def contain_photo(
    img: Image.Image,
    target: tuple[int, int],
    *,
    bg: tuple[int, int, int] = OBSIDIAN,
    valign: str = "center",
) -> Image.Image:
    """Letterbox image inside target without stretching (LANCZOS)."""
    tw, th = target
    scale = min(tw / img.width, th / img.height)
    new_w, new_h = max(1, int(img.width * scale)), max(1, int(img.height * scale))
    src = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", target, bg)
    x = (tw - new_w) // 2
    if valign == "top":
        y = 0
    elif valign == "bottom":
        y = th - new_h
    else:
        y = (th - new_h) // 2
    canvas.paste(src, (x, y))
    return canvas


def prepare_headshot(img: Image.Image, target: tuple[int, int]) -> Image.Image:
    """Face-centered square crop, fitted to polaroid upper photo area."""
    w, h = img.size
    side = min(w, h)
    cx, cy = w // 2, int(h * 0.42)
    left = max(0, min(cx - side // 2, w - side))
    top = max(0, min(cy - side // 2, h - side))
    square = img.crop((left, top, left + side, top + side))
    return ImageOps.fit(square, target, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def desk_monitor_crop(desk: Image.Image) -> Image.Image:
    return crop_pixels(desk, DESK_CROP_MONITOR)


def desk_laptop_crop(desk: Image.Image) -> Image.Image:
    return crop_pixels(desk, DESK_CROP_LAPTOP)


def desk_laptop_headshot_crop(desk: Image.Image) -> Image.Image:
    """GitHub profile photo from the laptop screen in desk-setup.png."""
    laptop = desk_laptop_crop(desk)
    lw, lh = laptop.size
    return laptop.crop((int(lw * 0.02), int(lh * 0.06), int(lw * 0.42), int(lh * 0.52)))


def utech_sign_crop(campus: Image.Image) -> Image.Image:
    return crop_pixels(campus, UTECH_CROP_SIGN, ref_size=UTECH_REF_SIZE)


def load_desk_setup() -> Image.Image | None:
    return load_image(DESK_SETUP)


def load_utech_campus() -> Image.Image | None:
    return load_image(UTECH_CAMPUS)


def find_headshot() -> Path | None:
    patterns = [
        SCREENSHOTS_DIR / "headshot.png",
        OUT / "assets" / "headshot.jpg",
        OUT / "assets" / "headshot.png",
        PUBLIC / "headshot.jpg",
        PUBLIC / "headshot.png",
        PUBLIC / "zachary-headshot.jpg",
        PUBLIC / "profile.jpg",
    ]
    for p in patterns:
        if p.exists():
            return p
    return None


_LOGOS_ENSURED = False


def ensure_logos() -> None:
    """Ensure assets/logos exists; download PNGs from devicon when CDN allows (once per run)."""
    global _LOGOS_ENSURED
    if _LOGOS_ENSURED:
        return
    _LOGOS_ENSURED = True
    LOGOS_DIR.mkdir(parents=True, exist_ok=True)
    for key, icon_path in DEVICON_PATHS.items():
        out = LOGOS_DIR / f"{key}.png"
        if out.exists() and out.stat().st_size > 500:
            continue
        url = f"https://cdn.jsdelivr.net/gh/devicons/devicon@develop/icons/{icon_path}.svg"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                svg_data = resp.read()
            try:
                import cairosvg

                png_data = cairosvg.svg2png(bytestring=svg_data, output_width=128, output_height=128)
                out.write_bytes(png_data)
                print(f"  logo     {out.relative_to(ROOT)}")
            except ImportError:
                print(f"  logo     skipped {key}: pip install cairosvg for SVG logos")
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            print(f"  logo     skipped {key}: {exc}")


def _initial_badge(name: str, size: int = 40) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, size - 1, size - 1], fill=INDIGO_SOFT)
    initial = "".join(part[0] for part in name.replace("+", " ").split()[:2]).upper() or name[:1].upper()
    f = load_font(max(14, size // 2), "bold")
    tw, th = text_size(d, initial, f)
    d.text(((size - tw) // 2, (size - th) // 2 - 1), initial, font=f, fill=WHITE)
    return img


def load_logo(logo_key: str | None, size: int = 44, *, label: str = "") -> Image.Image | None:
    badge: Image.Image | None = None
    if logo_key:
        path = LOGOS_DIR / f"{logo_key}.png"
        if path.exists():
            badge = Image.open(path).convert("RGBA")
            badge.thumbnail((size, size), Image.Resampling.LANCZOS)
    if badge is None and label:
        return _initial_badge(label, size)
    return badge


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
    tx, ty = cx - tw // 2, cy - th // 2
    draw.text((tx, ty), main, font=font, fill=PEARL)
    bbox = draw.textbbox((tx, ty), main, font=font)
    underline_text_bbox(draw, bbox, max_width=min(bbox[2] - bbox[0], 240), gap=18)

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
        line_bbox = draw.textbbox((x, y), line, font=title_font)
        draw.text((x, y), line, font=title_font, fill=WHITE)
        if underline_at == "headline":
            underline_text_bbox(draw, line_bbox, max_width=min(line_bbox[2] - line_bbox[0], 320))
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
    title_lines = wrap_text(title, 16)
    for line in title_lines:
        cd.text((48, y), line, font=tf, fill=WHITE)
        y += 62
    if title_lines:
        last_bbox = cd.textbbox((48, y - 62), title_lines[-1], font=tf)
        underline_text_bbox(cd, last_bbox, max_width=120, gap=12)
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
        pw, ph = photo_area[2] - photo_area[0], photo_area[3] - photo_area[1]
        fitted = prepare_headshot(photo, (pw, ph))
        px = photo_area[0] + (pw - fitted.width) // 2
        py = photo_area[1] + (ph - fitted.height) // 2
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
    cap_y = fy + frame_h - 100
    draw.text((fx + (frame_w - cw) // 2, cap_y), caption, font=cap_font, fill=CHARCOAL)
    cap_bbox = draw.textbbox((fx + (frame_w - cw) // 2, cap_y), caption, font=cap_font)
    underline_text_bbox(draw, cap_bbox, max_width=frame_w - 160, gap=10)
    save_story(img, folder, filename)


def strip_md(text: str) -> str:
    return text.replace("**", "")


def _ease(progress: float) -> float:
    p = max(0.0, min(1.0, progress))
    return p * p * (3.0 - 2.0 * p)


def _draw_centered_header(
    draw: ImageDraw.ImageDraw,
    eyebrow: str,
    headline: str,
    *,
    y_start: int = 120,
    headline_size: int = 54,
) -> int:
    w = STORY_SIZE[0]
    ef = load_font(26, "medium")
    hf = load_font(headline_size, "bold")
    ew, _ = text_size(draw, eyebrow.upper(), ef)
    draw.text(((w - ew) // 2, y_start), eyebrow.upper(), font=ef, fill=INDIGO_SOFT)
    y = y_start + 52
    for line in wrap_text(headline, 20):
        tw, _ = text_size(draw, line, hf)
        tx = (w - tw) // 2
        bbox = draw.textbbox((tx, y), line, font=hf)
        draw.text((tx, y), line, font=hf, fill=WHITE)
        underline_text_bbox(draw, bbox, gap=12)
        y += 68
    return y


def _skill_card_image(entry: SkillEntry, w: int, h: int) -> Image.Image:
    card = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, w, h], radius=16, fill=CHARCOAL, outline=INDIGO, width=1)
    logo = load_logo(entry.logo_key, 40, label=entry.name)
    tx = 20
    if logo:
        card.paste(logo, (20, (h - logo.height) // 2), logo)
        tx = 72
    nf = load_font(28, "bold")
    bf = load_font(22, "regular")
    cd.text((tx, 18), entry.name, font=nf, fill=WHITE)
    for i, line in enumerate(wrap_text(entry.blurb, 28)):
        cd.text((tx, 54 + i * 30), line, font=bf, fill=MUTED_PEARL)
    return card


def layout_workspace_full(
    folder: str,
    filename: str,
    *,
    photo: Image.Image,
    eyebrow: str,
    headline: str,
    body: str = "",
) -> None:
    photo_h = LOWER_THIRD_Y - STORY_MARGIN - 40
    inner_w = STORY_SIZE[0] - STORY_MARGIN * 2
    fitted = contain_photo(photo, (inner_w, photo_h), valign="center")
    canvas = finish_canvas(obsidian_gradient(STORY_SIZE), grid=False, grain=True)
    draw = ImageDraw.Draw(canvas)
    draw_signature_motif(draw)
    px = (STORY_SIZE[0] - fitted.width) // 2
    py = STORY_MARGIN + (photo_h - fitted.height) // 2
    canvas.paste(fitted, (px, py))

    bar_top = LOWER_THIRD_Y
    overlay = Image.new("RGBA", STORY_SIZE, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle(
        [STORY_MARGIN, bar_top, STORY_SIZE[0] - STORY_MARGIN, STORY_SIZE[1] - STORY_MARGIN],
        radius=20,
        fill=(12, 12, 16, 235),
        outline=(*INDIGO, 180),
        width=1,
    )
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)
    x = STORY_MARGIN + 28
    y = bar_top + 28
    eyebrow_font = load_font(24, "medium")
    title_font = load_font(42, "bold")
    body_font = load_font(28, "regular")
    draw.text((x, y), eyebrow.upper(), font=eyebrow_font, fill=INDIGO_SOFT)
    y += 38
    for line in wrap_text(headline, 24):
        line_bbox = draw.textbbox((x, y), line, font=title_font)
        draw.text((x, y), line, font=title_font, fill=WHITE)
        underline_text_bbox(draw, line_bbox, max_width=min(line_bbox[2] - line_bbox[0], 520), gap=10)
        y += 54
    if body:
        y += 6
        for line in wrap_text(body, 30):
            draw.text((x, y), line, font=body_font, fill=PEARL)
            y += 36
    save_story(canvas, folder, filename)


def layout_github_browser(folder: str, filename: str, screenshot: Image.Image | None) -> None:
    img, draw = new_story_canvas(grid=False)
    w = STORY_SIZE[0]
    _draw_centered_header(draw, "GitHub", "Building every week", y_start=110)
    frame_w, frame_h = w - STORY_MARGIN * 2, 1180
    frame = Image.new("RGB", (frame_w, frame_h), GRAPHITE)
    fd = ImageDraw.Draw(frame)
    draw_browser_frame(
        frame, fd, screenshot, x=0, y=0, w=frame_w, h=frame_h, title="github.com/zacharyahutton",
    )
    img.paste(frame, (STORY_MARGIN, 280))
    draw_handwritten_arrow(draw, (w - 280, 1580), (w - 120, 1720), "every week →")
    save_story(img, folder, filename)


def layout_build_narrative(
    folder: str,
    filename: str,
    *,
    label: str,
    text: str,
    align: str = "left",
    rotate_card: float = 0,
    script_note: str | None = None,
) -> None:
    img, draw = new_story_canvas()
    lines = wrap_text(strip_md(text), 34)
    card_h = min(920, 180 + len(lines) * 44)
    card = Image.new("RGBA", (880, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, 880, card_h], radius=22, fill=CHARCOAL, outline=INDIGO, width=2)
    lf = load_font(24, "medium")
    bf = load_font(30, "regular")
    cd.text((48, 40), label.upper(), font=lf, fill=INDIGO)
    underline_text_bbox(cd, cd.textbbox((48, 40), label.upper(), font=lf), max_width=220, gap=10)
    y = 100
    for ln in lines:
        cd.text((48, y), ln, font=bf, fill=PEARL)
        y += 44
    card_y = max(200, (STORY_SIZE[1] - card_h) // 2 - 40)
    xy = (STORY_MARGIN + 20, card_y) if align == "left" else (STORY_MARGIN, card_y + 40)
    paste_rotated_card(img, card, xy, rotate_card)
    if script_note:
        draw.text((STORY_MARGIN, STORY_SIZE[1] - STORY_MARGIN - 48), script_note, font=load_script_font(34), fill=PEARL)
    save_story(img, folder, filename)


def _render_stack_card_canvas(
    eyebrow: str,
    headline: str,
    body_lines: Sequence[str],
    *,
    progress: float = 1.0,
) -> Image.Image:
    img, draw = new_story_canvas()
    offset = int((1.0 - _ease(progress)) * 36)
    y = _draw_centered_header(draw, eyebrow, headline, y_start=120 + offset)
    y += 24 + offset // 2
    bf = load_font(30, "regular")
    w = STORY_SIZE[0]
    for line in body_lines:
        for wrapped in wrap_text(line, 38):
            tw, _ = text_size(draw, wrapped, bf)
            draw.text(((w - tw) // 2, y), wrapped, font=bf, fill=PEARL)
            y += 44
    return img


def layout_stack_what_i_build(folder: str, filename: str) -> None:
    img, draw = new_story_canvas()
    y = _draw_centered_header(draw, "Stack", "What I build", y_start=120)
    y += 12
    card_w = STORY_SIZE[0] - STORY_MARGIN * 2
    card_h = 340
    gap = 28
    tf = load_font(36, "bold")
    bf = load_font(28, "regular")
    for title, body in WHAT_I_BUILD_CARDS:
        draw.rounded_rectangle(
            [STORY_MARGIN, y, STORY_MARGIN + card_w, y + card_h],
            radius=20,
            fill=CHARCOAL,
            outline=INDIGO,
            width=1,
        )
        inner_y = y + 36
        draw.text((STORY_MARGIN + 36, inner_y), title, font=tf, fill=WHITE)
        title_bbox = draw.textbbox((STORY_MARGIN + 36, inner_y), title, font=tf)
        underline_text_bbox(draw, title_bbox, max_width=160, gap=10)
        inner_y += 56
        for ln in wrap_text(body, 42):
            draw.text((STORY_MARGIN + 36, inner_y), ln, font=bf, fill=PEARL)
            inner_y += 38
        y += card_h + gap
    foot = "Web apps · APIs · secure backends"
    ff = load_font(28, "medium")
    fw, _ = text_size(draw, foot, ff)
    draw.text(((STORY_SIZE[0] - fw) // 2, STORY_SIZE[1] - STORY_MARGIN - 72), foot, font=ff, fill=PEARL)
    save_story(img, folder, filename)


def layout_stack_skill_grid(
    folder: str,
    filename: str,
    entries: Sequence[SkillEntry],
    headline: str,
) -> None:
    ensure_logos()
    img, draw = new_story_canvas()
    y = _draw_centered_header(draw, "Stack", headline, y_start=100)
    y += 20
    card_w = (STORY_SIZE[0] - STORY_MARGIN * 2 - 20) // 2
    card_h = 148
    gap = 16
    for i, entry in enumerate(entries):
        col, row = i % 2, i // 2
        cx = STORY_MARGIN + col * (card_w + gap)
        cy = y + row * (card_h + gap)
        card = _skill_card_image(entry, card_w, card_h)
        img.paste(card, (cx, cy), card)
    save_story(img, folder, filename)


def layout_stack_architecture(folder: str, filename: str) -> None:
    img, draw = new_story_canvas(grid=False)
    w = STORY_SIZE[0]
    y = _draw_centered_header(draw, "Stack", "How my apps are wired", y_start=100)
    y += 16
    sub = "Plain English. No jargon required."
    sf = load_font(26, "regular")
    sw, _ = text_size(draw, sub, sf)
    draw.text(((w - sw) // 2, y), sub, font=sf, fill=MUTED_PEARL)
    y += 56
    boxes = [
        ("Your browser", "What you see: buttons, forms, pages"),
        ("API server", "Checks login, validates data, sends email"),
        ("Database", "Stores users, leads, and events safely"),
    ]
    bw, bh = w - STORY_MARGIN * 2, 200
    bx = STORY_MARGIN
    bf = load_font(32, "bold")
    body_f = load_font(26, "regular")
    for title, blurb in boxes:
        draw.rounded_rectangle([bx, y, bx + bw, y + bh], radius=18, fill=CHARCOAL, outline=INDIGO, width=2)
        tw, _ = text_size(draw, title, bf)
        draw.text((bx + (bw - tw) // 2, y + 28), title, font=bf, fill=WHITE)
        for i, line in enumerate(wrap_text(blurb, 42)):
            lw, _ = text_size(draw, line, body_f)
            draw.text((bx + (bw - lw) // 2, y + 82 + i * 34), line, font=body_f, fill=PEARL)
        y += bh + 28
        if title != boxes[-1][0]:
            ax = w // 2
            draw.line([(ax, y - 20), (ax, y)], fill=INDIGO, width=3)
            draw.polygon([(ax - 10, y - 8), (ax + 10, y - 8), (ax, y + 6)], fill=INDIGO)
            y += 12
    foot = "React on Vercel  →  FastAPI on Railway  →  MongoDB Atlas"
    ff = load_font(24, "medium")
    fw, _ = text_size(draw, foot, ff)
    draw.text(((w - fw) // 2, STORY_SIZE[1] - STORY_MARGIN - 56), foot, font=ff, fill=ASH)
    save_story(img, folder, filename)


def render_stack_what_i_build_frame(progress: float) -> Image.Image:
    img, draw = new_story_canvas()
    y = _draw_centered_header(draw, "Stack", "What I build", y_start=120)
    y += 12
    card_w = STORY_SIZE[0] - STORY_MARGIN * 2
    card_h = 340
    gap = 28
    tf = load_font(36, "bold")
    bf = load_font(28, "regular")
    n = len(WHAT_I_BUILD_CARDS)
    for idx, (title, body) in enumerate(WHAT_I_BUILD_CARDS):
        slot = idx / n
        local = max(0.0, min(1.0, (progress - slot * 0.55) / 0.35))
        alpha = int(255 * local)
        if alpha <= 0:
            y += card_h + gap
            continue
        card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle([0, 0, card_w, card_h], radius=20, fill=(*CHARCOAL, alpha), outline=(*INDIGO, alpha), width=1)
        inner_y = 36
        cd.text((36, inner_y), title, font=tf, fill=(*WHITE, alpha))
        inner_y += 56
        for ln in wrap_text(body, 42):
            cd.text((36, inner_y), ln, font=bf, fill=(*PEARL, alpha))
            inner_y += 38
        img.paste(card, (STORY_MARGIN, y), card)
        y += card_h + gap
    if progress > 0.85:
        foot = "Web apps · APIs · secure backends"
        ff = load_font(28, "medium")
        fw, _ = text_size(draw, foot, ff)
        draw.text(((STORY_SIZE[0] - fw) // 2, STORY_SIZE[1] - STORY_MARGIN - 72), foot, font=ff, fill=PEARL)
    return img


def render_stack_skill_rows_frame(
    entries: Sequence[SkillEntry],
    headline: str,
    progress: float,
) -> Image.Image:
    ensure_logos()
    img, draw = new_story_canvas()
    offset = int((1.0 - _ease(progress)) * 30)
    y = _draw_centered_header(draw, "Stack", headline, y_start=100 + offset)
    y += 20
    card_w = (STORY_SIZE[0] - STORY_MARGIN * 2 - 20) // 2
    card_h = 148
    gap = 16
    visible = max(1, int(len(entries) * _ease(progress)))
    for i, entry in enumerate(entries[:visible]):
        col, row = i % 2, i // 2
        cx = STORY_MARGIN + col * (card_w + gap)
        cy = y + row * (card_h + gap) + offset // 3
        card = _skill_card_image(entry, card_w, card_h)
        img.paste(card, (cx, cy), card)
    return img


def render_stack_logo_grid_frame(
    entries: Sequence[SkillEntry],
    headline: str,
    progress: float,
    *,
    cols: int = 2,
) -> Image.Image:
    return render_stack_skill_rows_frame(entries, headline, progress)


def render_stack_architecture_frame(progress: float) -> Image.Image:
    img, draw = new_story_canvas(grid=False)
    w = STORY_SIZE[0]
    offset = int((1.0 - _ease(progress)) * 24)
    y = _draw_centered_header(draw, "Stack", "How my apps are wired", y_start=100 + offset)
    y += 48
    boxes = [
        ("Your browser", "What you see: buttons, forms, pages"),
        ("API server", "Checks login, validates data, sends email"),
        ("Database", "Stores users, leads, and events safely"),
    ]
    bw, bh = w - STORY_MARGIN * 2, 200
    bx = STORY_MARGIN
    bf = load_font(32, "bold")
    body_f = load_font(26, "regular")
    visible = max(1, int(len(boxes) * _ease(progress)))
    for title, blurb in boxes[:visible]:
        draw.rounded_rectangle([bx, y, bx + bw, y + bh], radius=18, fill=CHARCOAL, outline=INDIGO, width=2)
        tw, _ = text_size(draw, title, bf)
        draw.text((bx + (bw - tw) // 2, y + 28), title, font=bf, fill=WHITE)
        for i, line in enumerate(wrap_text(blurb, 42)):
            lw, _ = text_size(draw, line, body_f)
            draw.text((bx + (bw - lw) // 2, y + 82 + i * 34), line, font=body_f, fill=PEARL)
        y += bh + 28
    return img


def layout_campus_conversational(folder: str, filename: str, campus: Image.Image | None) -> None:
    img, draw = new_story_canvas(grid=False)
    inner_w = STORY_SIZE[0] - STORY_MARGIN * 2
    photo_h = 820
    if campus:
        sign = utech_sign_crop(campus)
        hero = contain_photo(sign, (inner_w, photo_h), valign="center")
        px = (STORY_SIZE[0] - hero.width) // 2
        py = STORY_MARGIN + 60
        draw.rounded_rectangle(
            [px - 8, py - 8, px + hero.width + 8, py + hero.height + 8],
            radius=18,
            outline=INDIGO,
            width=2,
        )
        img.paste(hero, (px, py))
    else:
        draw.rounded_rectangle(
            [STORY_MARGIN, STORY_MARGIN + 60, STORY_SIZE[0] - STORY_MARGIN, STORY_MARGIN + 60 + photo_h],
            radius=18,
            fill=GRAPHITE,
            outline=(55, 55, 62),
            width=2,
        )
    lines = (
        "Third-year CS @ UTech. Dean's List, GPA 3.7.",
        "I turn lecture concepts into GitHub repos I can demo.",
        "Security labs on OWASP & PortSwigger in my own time.",
    )
    y = LOWER_THIRD_Y + 20
    tf = load_font(36, "bold")
    bf = load_font(28, "regular")
    w = STORY_SIZE[0]
    head = "This is where I study"
    tw, _ = text_size(draw, head, tf)
    hx = (w - tw) // 2
    hbbox = draw.textbbox((hx, y), head, font=tf)
    draw.text((hx, y), head, font=tf, fill=WHITE)
    underline_text_bbox(draw, hbbox, gap=10)
    y += 58
    for line in lines:
        for wrapped in wrap_text(line, 40):
            lw, _ = text_size(draw, wrapped, bf)
            draw.text(((w - lw) // 2, y), wrapped, font=bf, fill=PEARL)
            y += 38
    save_story(img, folder, filename)


def layout_browser_slide(
    folder: str,
    filename: str,
    *,
    screenshot: Image.Image | None,
    url: str,
    project_name: str,
    angle: float = -2.5,
    arrow_label: str = "live →",
) -> None:
    img, draw = new_story_canvas()
    draw.text((72, 130), project_name.upper(), font=load_font(28, "medium"), fill=INDIGO_SOFT)

    frame_w, frame_h = 936, 1280
    frame = Image.new("RGBA", (frame_w + 80, frame_h + 80), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frame)
    draw_browser_frame(frame, fd, screenshot, x=40, y=40, w=frame_w, h=frame_h, title=url)
    paste_rotated_card(img, frame, (20, 200), angle)
    draw_handwritten_arrow(draw, (780, 1580), (920, 1720), arrow_label)
    save_story(img, folder, filename)


def layout_one_liner(
    folder: str,
    filename: str,
    *,
    label: str,
    line: str,
    align: str = "left",
    rotate_card: float = 0,
    script_note: str | None = None,
) -> None:
    img, draw = new_story_canvas()
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
    label_bbox = cd.textbbox((48, 40), label.upper(), font=lf)
    underline_text_bbox(cd, label_bbox, max_width=200, gap=10)
    xy = (80, 700) if align == "left" else (60, 720)
    paste_rotated_card(img, card, xy, rotate_card)
    if script_note:
        draw.text((72, 1680), script_note, font=load_script_font(34), fill=PEARL)
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
    foot_bbox = draw.textbbox((72, 1720), "Real route from StudySync API", font=load_font(26, "medium"))
    underline_text_bbox(draw, foot_bbox, max_width=280, gap=10)
    save_story(img, folder, filename)


def layout_logo_grid(folder: str, filename: str, badges: Sequence[str]) -> None:
    img, draw = new_story_canvas()
    draw.text((72, 140), "STACK", font=load_font(28, "medium"), fill=INDIGO_SOFT)
    headline = "Tools I reach for"
    draw.text((72, 190), headline, font=load_font(56, "bold"), fill=WHITE)
    head_bbox = draw.textbbox((72, 190), headline, font=load_font(56, "bold"))
    underline_text_bbox(draw, head_bbox, max_width=200)

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
    draw.text((STORY_MARGIN, 140), "GITHUB", font=load_font(26, "medium"), fill=INDIGO_SOFT)
    headline = "Building every week"
    hf = load_font(58, "bold")
    draw.text((STORY_MARGIN, 200), headline, font=hf, fill=WHITE)
    head_bbox = draw.textbbox((STORY_MARGIN, 200), headline, font=hf)
    underline_text_bbox(draw, head_bbox, max_width=260)

    frame_w, frame_h = 920, 1280
    frame_x = (STORY_SIZE[0] - frame_w) // 2
    frame_y = 300
    if screenshot:
        draw_browser_frame(
            img,
            draw,
            screenshot,
            x=frame_x,
            y=frame_y,
            w=frame_w,
            h=frame_h,
            title="github.com/zacharyahutton",
        )
    else:
        draw.rounded_rectangle(
            [frame_x, frame_y, frame_x + frame_w, frame_y + frame_h],
            radius=16,
            fill=CHARCOAL,
            outline=INDIGO,
            width=1,
        )
        gx, gy = frame_x + 48, frame_y + 120
        rng = random.Random(7)
        for week in range(26):
            for day in range(7):
                level = rng.choice([0, 0, 1, 1, 2, 2, 3, 4])
                colors = [GRAPHITE, (22, 40, 80), (18, 60, 140), (21, 0, 200), INDIGO]
                draw.rounded_rectangle(
                    [gx + week * 34, gy + day * 34, gx + week * 34 + 28, gy + day * 34 + 28],
                    radius=6,
                    fill=colors[level],
                )

    draw_handwritten_arrow(draw, (580, 1580), (900, 1720), "Building every week →")
    save_story(img, folder, filename)


def layout_workspace_contain(
    folder: str,
    filename: str,
    *,
    photo: Image.Image,
    eyebrow: str,
    headline: str,
    body: str = "",
) -> None:
    """Full desk setup letterboxed — text confined to lower-third bar."""
    img = finish_canvas(obsidian_gradient(STORY_SIZE), grid=False, grain=True)
    draw = ImageDraw.Draw(img)
    draw_signature_motif(draw)

    photo_box_w = STORY_SIZE[0] - STORY_MARGIN * 2
    photo_box_h = LOWER_THIRD_Y - STORY_MARGIN - 80
    fitted = fit_image_contain(photo, (photo_box_w, photo_box_h), bg=OBSIDIAN, valign="center")
    px = (STORY_SIZE[0] - fitted.width) // 2
    py = STORY_MARGIN + 72
    img.paste(fitted, (px, py))

    bar_x = STORY_MARGIN
    bar_y = LOWER_THIRD_Y
    bar_w = STORY_SIZE[0] - STORY_MARGIN * 2
    bar_h = STORY_SIZE[1] - STORY_MARGIN - bar_y
    draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + bar_h], radius=18, fill=(8, 8, 12, 230))
    overlay = Image.new("RGBA", STORY_SIZE, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + bar_h], radius=18, fill=(8, 8, 12, 235))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    x = bar_x + 32
    y = bar_y + 28
    eyebrow_font = load_font(24, "medium")
    title_font = load_font(44, "bold")
    body_font = load_font(28, "regular")
    draw.text((x, y), eyebrow.upper(), font=eyebrow_font, fill=INDIGO_SOFT)
    y += 40
    for line in wrap_text(headline, 22):
        line_bbox = draw.textbbox((x, y), line, font=title_font)
        draw.text((x, y), line, font=title_font, fill=WHITE)
        underline_text_bbox(draw, line_bbox, max_width=min(line_bbox[2] - line_bbox[0], 480), gap=12)
        y += 54
    if body:
        y += 8
        for line in wrap_text(body, 28):
            draw.text((x, y), line, font=body_font, fill=PEARL)
            y += 38
    save_story(img, folder, filename)


def layout_photo_hero(
    folder: str,
    filename: str,
    *,
    photo: Image.Image,
    eyebrow: str,
    headline: str,
    body: str = "",
    corner: str = "bl",
    gradient: bool = True,
) -> None:
    img = cover_photo(photo, STORY_SIZE, anchor="center")
    if gradient:
        overlay = Image.new("RGBA", STORY_SIZE, (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for y in range(STORY_SIZE[1]):
            t = y / STORY_SIZE[1]
            alpha = int(40 + t * 180) if corner.startswith("b") else int(180 - t * 140)
            od.line([(0, y), (STORY_SIZE[0], y)], fill=(5, 5, 8, min(alpha, 220)))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    img = finish_canvas(img, grid=False, grain=True)
    draw = ImageDraw.Draw(img)
    draw_signature_motif(draw)

    w, h = STORY_SIZE
    margin = 72
    if corner.startswith("bl"):
        x, y = margin, h - margin - 380
    elif corner.startswith("br"):
        x, y = w - margin - 560, h - margin - 380
    elif corner.startswith("tl"):
        x, y = margin, 180
    else:
        x, y = w - margin - 560, 180

    eyebrow_font = load_font(26, "medium")
    title_font = load_font(58, "bold")
    body_font = load_font(32, "regular")
    draw.text((x, y), eyebrow.upper(), font=eyebrow_font, fill=INDIGO_SOFT)
    y += 48
    for line in wrap_text(headline, 16):
        line_bbox = draw.textbbox((x, y), line, font=title_font)
        draw.text((x, y), line, font=title_font, fill=WHITE)
        underline_text_bbox(draw, line_bbox, max_width=min(line_bbox[2] - line_bbox[0], 360), gap=14)
        y += 72
    if body:
        y += 16
        for line in wrap_text(body, 26):
            draw.text((x, y), line, font=body_font, fill=PEARL)
            y += 44
    save_story(img, folder, filename)


def layout_photo_caption(
    folder: str,
    filename: str,
    *,
    photo: Image.Image,
    caption: str,
    subtitle: str = "",
    rotate_frame: float = 2.0,
) -> None:
    img, draw = new_story_canvas(grid=False)
    framed = contain_photo(photo, (880, 1180), bg=OBSIDIAN, valign="center")
    frame = Image.new("RGBA", (920, 1220), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frame)
    fd.rounded_rectangle([0, 0, 920, 1220], radius=20, outline=INDIGO, width=2)
    frame.paste(framed, (20, 20))
    paste_rotated_card(img, frame, (80, 260), rotate_frame)

    cap_font = load_script_font(42)
    cap_y = 1560
    draw.text((72, cap_y), caption, font=cap_font, fill=PEARL)
    if subtitle:
        draw.text((72, cap_y + 56), subtitle, font=load_font(26, "regular"), fill=MUTED_PEARL)
    save_story(img, folder, filename)


def layout_campus_photo(folder: str, filename: str, campus: Image.Image | None) -> None:
    img = finish_canvas(obsidian_gradient(STORY_SIZE), grid=False, grain=True)
    draw = ImageDraw.Draw(img)
    draw_signature_motif(draw)

    hero_h = int(STORY_SIZE[1] * 0.60)
    m = STORY_MARGIN
    if campus:
        hero = fit_image_contain(campus, (STORY_SIZE[0], hero_h), bg=OBSIDIAN, valign="top")
        img.paste(hero, (0, 0))
    else:
        draw.rounded_rectangle([m, 120, STORY_SIZE[0] - m, hero_h], radius=20, fill=GRAPHITE)
        pf = load_font(32, "medium")
        for i, line in enumerate(wrap_text("Campus photo — add assets/utech-campus.png", 22)):
            lw, _ = text_size(draw, line, pf)
            draw.text(((STORY_SIZE[0] - lw) // 2, 520 + i * 44), line, font=pf, fill=ASH)

    draw.rounded_rectangle(
        [m, LOWER_THIRD_Y, STORY_SIZE[0] - m, LOWER_THIRD_Y + LOWER_THIRD_H],
        radius=18,
        fill=CHARCOAL,
        outline=INDIGO,
        width=2,
    )
    tf = load_font(44, "bold")
    bf = load_font(30, "regular")
    draw.text((m + 48, LOWER_THIRD_Y + 48), "CS @ UTech", font=tf, fill=WHITE)
    draw.text((m + 48, LOWER_THIRD_Y + 118), "GPA 3.7 · Dean's List · 2029", font=bf, fill=PEARL)
    cs_bbox = draw.textbbox((m + 48, LOWER_THIRD_Y + 48), "CS @ UTech", font=tf)
    underline_text_bbox(draw, cs_bbox, max_width=180, gap=10)
    save_story(img, folder, filename)


def layout_connect_links(folder: str, filename: str) -> None:
    img, draw = new_story_canvas()
    links = [
        ("Email", "hzach577@gmail.com", "Fastest way to reach me for internships and project chat."),
        ("LinkedIn", "linkedin.com/in/zachary-hutton-a2ab81415", "Professional background and endorsements."),
        ("GitHub", "github.com/zacharyahutton", "Repos, commits, and open-source work you can review."),
        ("Portfolio", "zachary-hutton-portfolio.vercel.app", "Projects, case studies, and resume in one URL."),
    ]
    draw.text((STORY_MARGIN, 130), "CONNECT", font=load_font(26, "medium"), fill=INDIGO_SOFT)
    draw.text((STORY_MARGIN, 170), "Let's talk", font=load_font(52, "bold"), fill=WHITE)
    head_bbox = draw.textbbox((STORY_MARGIN, 170), "Let's talk", font=load_font(52, "bold"))
    underline_text_bbox(draw, head_bbox, max_width=180)
    y = 260
    lf = load_font(30, "regular")
    sf = load_font(24, "regular")
    for label, value, hint in links:
        draw.text((STORY_MARGIN, y), label, font=load_font(22, "medium"), fill=INDIGO)
        draw.text((STORY_MARGIN, y + 34), value, font=lf, fill=PEARL)
        val_bbox = draw.textbbox((STORY_MARGIN, y + 34), value, font=lf)
        underline_text_bbox(draw, val_bbox, max_width=min(val_bbox[2] - val_bbox[0], 520), gap=8, thickness=3)
        hy = y + 78
        for ln in wrap_text(hint, 38):
            draw.text((STORY_MARGIN, hy), ln, font=sf, fill=MUTED_PEARL)
            hy += 30
        y += 140
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
    qr_head_bbox = draw.textbbox((72, 180), "Scan to portfolio", font=load_font(56, "bold"))
    underline_text_bbox(draw, qr_head_bbox, max_width=240)
    if qr_img:
        draw.rounded_rectangle([300, 520, 780, 1000], radius=20, fill=CHARCOAL, outline=INDIGO, width=2)
        img.paste(qr_img, (330, 550))
    draw.text((STORY_MARGIN, 1100), url, font=load_font(26, "regular"), fill=MUTED_PEARL)
    bar_y = 1180
    draw.rounded_rectangle(
        [STORY_MARGIN, bar_y, STORY_SIZE[0] - STORY_MARGIN, bar_y + 280],
        radius=18,
        fill=CHARCOAL,
        outline=INDIGO,
        width=1,
    )
    bf = load_font(28, "regular")
    y = bar_y + 28
    for paragraph in (
        "Scan to see projects, case studies, and my resume in one place.",
        "If you are hiring, this is the fastest way to understand what I ship.",
    ):
        for ln in wrap_text(paragraph, 36):
            draw.text((STORY_MARGIN + 24, y), ln, font=bf, fill=PEARL)
            y += 38
        y += 8
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
        for key, url in CAPTURE_TARGETS.items():
            out = SCREENSHOTS_DIR / f"{key}.png"
            if out.exists() and not force:
                saved[key] = out
                continue
            try:
                if key == "github":
                    context = browser.new_context(
                        viewport={"width": 1400, "height": 900},
                        device_scale_factor=2,
                    )
                    page = context.new_page()
                    page.goto(url, wait_until="domcontentloaded", timeout=90000)
                    page.wait_for_timeout(3000)
                    page.evaluate("window.scrollTo(0, 0)")
                    page.wait_for_timeout(800)
                    page.screenshot(path=str(out), full_page=True)
                    context.close()
                else:
                    context = browser.new_context(
                        viewport={"width": 1280, "height": 900},
                        device_scale_factor=2,
                    )
                    page = context.new_page()
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(2500)
                    page.screenshot(path=str(out), full_page=False)
                    context.close()
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
        problem=(
            "Recruiters bounce between GitHub, LinkedIn, and PDFs trying to piece together "
            "who I am and what I've shipped. There was no single canonical link with projects, "
            "case studies, and resume in one polished experience."
        ),
        solution=(
            "I built this Next.js portfolio with typed content modules, an obsidian design system, "
            "spotlight carousel, and dedicated case study routes. Everything deploys on Vercel with "
            "preview URLs so I can iterate in public."
        ),
        learned=(
            "Design systems in code beat one-off mockups. When typography and components are "
            "centralized, adding a new project is mostly editing content files, not redesigning pages."
        ),
        tags=("Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"),
    ),
    ProjectStory(
        slug="weroi",
        name="weROI Platform",
        url="weroi.net",
        fallback_image=PUBLIC / "case-studies" / "weroi-cover.png",
        problem=(
            "weROI needed a client-facing site that captures leads through multi-step audit funnels "
            "and guide-download popups, stores submissions reliably, and gives admins a secure way to "
            "review opportunities, with email on submit across Vercel and Railway."
        ),
        solution=(
            "I engineered a React SPA for marketing routes, a FastAPI backend with Pydantic-validated "
            "REST endpoints, and MongoDB Atlas for audit leads and analytics. Resend handles transactional "
            "email; JWT-protected admin routes manage the pipeline."
        ),
        learned=(
            "Splitting frontend and API deployment keeps Vercel fast for static delivery while FastAPI "
            "runs close to MongoDB on Railway. Document stores fit variable funnel fields without rigid migrations."
        ),
        tags=("React", "FastAPI", "MongoDB", "JWT", "Vercel", "Railway"),
    ),
    ProjectStory(
        slug="studysync",
        name="StudySync API",
        url="github.com/zacharyahutton/studysync-api",
        fallback_image=PUBLIC / "case-studies" / "studysync-cover.png",
        problem=(
            "I wanted a backend that mirrors production API patterns: authenticated users, "
            "validated request bodies, relational data modeling, and documented endpoints "
            "I could exercise in Postman. Scattered deadline notes were the real use case."
        ),
        solution=(
            "StudySync exposes REST routes for auth, courses, and deadline CRUD. Pydantic validates "
            "every request, SQLAlchemy maps to SQLite locally, and OpenAPI docs generate "
            "automatically from FastAPI route definitions."
        ),
        learned=(
            "OpenAPI-first design makes frontend and tests easier to align. When the contract "
            "is visible at /docs, integration debates disappear and I ship faster."
        ),
        tags=("Python", "FastAPI", "SQLAlchemy", "JWT", "OpenAPI"),
    ),
    ProjectStory(
        slug="pntcog",
        name="PNTCOG Ministry",
        url="portmorentcog.org",
        fallback_image=PUBLIC / "case-studies" / "pntcog-cover.png",
        problem=(
            "Portmore New Testament Church of God needed a single digital home for ministry programmes, "
            "event promotion, online giving, and prayer requests. Most members browse on mobile, and "
            "volunteers needed to update content without breaking layout consistency."
        ),
        solution=(
            "I architected a modular React site with reusable layout shells and mobile-first navigation. "
            "Each ministry programme maps to its own section. The site ships on Vercel with preview "
            "deployments before changes reach portmorentcog.org."
        ),
        learned=(
            "Non-technical stakeholders need clear sections and preview URLs. Vercel previews let "
            "volunteers approve copy before it hits the live congregation site."
        ),
        tags=("React", "TypeScript", "Vercel", "Responsive UI"),
    ),
]


BUILD_PROJECTS: list[ProjectStory] = PROJECTS


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
    desk = load_desk_setup()
    headshot_path = find_headshot()
    headshot_raw = load_image(headshot_path) if headshot_path else None

    if headshot_raw:
        layout_polaroid(
            "stories-about",
            "01-who-i-am.png",
            photo=headshot_raw,
            caption="Hi, I'm Zach.",
        )
    elif desk:
        headshot_crop = desk_laptop_headshot_crop(desk)
        layout_polaroid(
            "stories-about",
            "01-who-i-am.png",
            photo=headshot_crop,
            caption="Hi, I'm Zach.",
        )
    else:
        layout_corner_text(
            "stories-about",
            "01-who-i-am.png",
            corner="bl",
            eyebrow="About",
            headline="Hi, I'm Zach",
            body=(
                "Full-stack developer and UTech CS student (GPA 3.7, Dean's List). "
                "I build secure web apps, REST APIs, and deploy pipelines from this desk."
            ),
        )

    if desk:
        layout_workspace_full(
            "stories-about",
            "02-workspace.png",
            photo=desk,
            eyebrow="Now",
            headline="Currently focused on secure web applications.",
            body="Dual monitors, GitHub on the laptop, portfolio on the big screen. This is where I ship from.",
        )
    else:
        layout_polaroid(
            "stories-about",
            "02-workspace.png",
            photo=None,
            caption="Where I build",
            placeholder_text="Add assets/desk-setup.png",
        )

    gh_shot = load_image(captures.get("github"))
    layout_github_browser("stories-about", "03-github-weekly.png", gh_shot)

    if desk:
        browser_inner = desk_monitor_crop(desk)
    else:
        browser_inner = screenshot_for("portfolio", captures)
    layout_browser_slide(
        "stories-about",
        "04-portfolio-monitor.png",
        screenshot=browser_inner,
        url="zachary-hutton-portfolio.vercel.app",
        project_name="Portfolio",
        angle=3.0,
        arrow_label="ship it →",
    )


def generate_build(captures: dict[str, Path]) -> None:
    browser_angles = (-3.5, 2.8, -2.0, 3.2)
    arrow_labels = ("live →", "see it →", "demo →", "visit →")
    stack_blurbs: dict[str, str] = {
        "portfolio": "Next.js for typed content and fast Vercel previews. TypeScript keeps case studies consistent. Tailwind + Motion for the obsidian design system.",
        "weroi": "React for marketing and admin UI. FastAPI + MongoDB for lead capture and JWT-protected dashboards. Vercel + Railway split keeps public and API deploys clean.",
        "studysync": "Python + FastAPI for async REST routes. SQLAlchemy for relational models. JWT + OpenAPI so every endpoint is documented and testable in Postman.",
        "pntcog": "React + TypeScript for modular ministry sections. Vercel preview deploys let volunteers approve copy before the congregation sees changes.",
    }

    for i, proj in enumerate(PROJECTS, start=1):
        prefix = f"{i:02d}-{proj.slug}"
        shot = screenshot_for(proj.slug, captures)
        if shot is None:
            shot = load_image(proj.fallback_image)

        layout_browser_slide(
            "stories-build",
            f"{prefix}-a-browser.png",
            screenshot=shot,
            url=proj.url or "github.com/zacharyahutton",
            project_name=proj.name,
            angle=browser_angles[i - 1],
            arrow_label=arrow_labels[i - 1],
        )
        layout_build_narrative(
            "stories-build",
            f"{prefix}-b-problem.png",
            label="The problem",
            text=proj.problem,
            align="left" if i % 2 else "right",
            rotate_card=-2.0 if i % 2 else 3.0,
            script_note="why it mattered" if i == 1 else None,
        )
        layout_build_narrative(
            "stories-build",
            f"{prefix}-c-solution.png",
            label="What I built",
            text=proj.solution,
            align="right" if i % 2 else "left",
            rotate_card=2.5 if i % 2 else -3.5,
            script_note="how it works" if i == 2 else None,
        )
        layout_tilted_card(
            "stories-build",
            f"{prefix}-d-stack.png",
            title="Stack and why",
            body=stack_blurbs.get(proj.slug, proj.name),
            tags=proj.tags,
            angle=-4.0 + i,
        )
        layout_build_narrative(
            "stories-build",
            f"{prefix}-e-learned.png",
            label="What I learned",
            text=proj.learned,
            align="left" if i % 2 == 0 else "right",
            rotate_card=1.5 if i % 2 else -2.5,
        )


def generate_stack() -> None:
    ensure_logos()
    layout_stack_what_i_build("stories-stack", "01-what-i-build.png")
    layout_stack_skill_grid("stories-stack", "02-languages.png", STACK_LANGUAGES, "Languages I write")
    layout_stack_skill_grid("stories-stack", "03-frameworks.png", STACK_FRAMEWORKS, "Frameworks I ship with")
    layout_stack_skill_grid("stories-stack", "04-tools.png", STACK_TOOLS, "Tools & deploy")
    layout_stack_architecture("stories-stack", "05-architecture.png")


def generate_utech() -> None:
    campus = load_utech_campus()
    layout_campus_conversational("stories-utech", "01-campus.png", campus)
    layout_tilted_card(
        "stories-utech",
        "02-labs-github.png",
        title="From labs to GitHub",
        body=(
            "Database and networking labs at UTech connect directly to the APIs I ship. "
            "When I finish coursework, I push a repo recruiters can clone, run, and review. "
            "OWASP and PortSwigger labs on personal time keep security top of mind."
        ),
        tags=("GitHub", "OWASP", "PortSwigger", "Build in public"),
        angle=-2.8,
    )
    layout_corner_text(
        "stories-utech",
        "03-academic-proof.png",
        corner="bl",
        eyebrow="UTech CS",
        headline="GPA 3.7, Dean's List",
        body=(
            "BSc Computer Science at the University of Technology, Jamaica. Expected graduation 2029. "
            "I connect data structures, databases, and networking lectures to full-stack projects on GitHub. "
            "If you are hiring, my transcript and repos tell the same story."
        ),
    )


def generate_connect() -> None:
    layout_corner_text(
        "stories-connect",
        "01-open-to-work.png",
        corner="tl",
        eyebrow="Connect",
        headline="Open to internships and co-ops",
        body=(
            "I am a BSc CS student at UTech (GPA 3.7, Dean's List) based in Portmore, Jamaica. "
            "Remote-friendly. If you are hiring full-stack interns, I bring APIs, deployments, "
            "and security-aware engineering habits from coursework and client projects."
        ),
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
            "01-portrait.png",
            "02-what-i-build.png",
            "03-open-to-internships.png",
        ),
        "stories-utech": ("01-cs-student.png",),
        "stories-build": (
            "03-pntcog-a-browser.png",
            "03-pntcog-b-problem.png",
            "03-pntcog-c-solution.png",
            "03-pntcog-d-stack.png",
            "03-pntcog-e-learned.png",
        ),
        "stories-stack": (
            "02-tech-badges.png",
            "03-code-snippet.png",
        ),
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
                print(f"  removed  {f.relative_to(ROOT)}")
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
