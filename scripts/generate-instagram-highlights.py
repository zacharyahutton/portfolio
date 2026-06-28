"""Generate Instagram Story Highlight covers and upload-ready story slides."""

from __future__ import annotations

import os
import textwrap
from dataclasses import dataclass
from pathlib import Path
from typing import Sequence

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand" / "instagram"
FONTS_DIR = OUT / "fonts"

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


@dataclass(frozen=True)
class SlideSpec:
    folder: str
    filename: str
    eyebrow: str
    title: str
    body: str
    tags: tuple[str, ...] = ()
    accent: tuple[int, int, int] = INDIGO


@dataclass(frozen=True)
class CoverSpec:
    filename: str
    title: str
    icon: str


def load_font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    windir = os.environ.get("WINDIR", r"C:\Windows")
    candidates: list[Path] = []

    weight_map = {
        "regular": ["DMSans-Regular.ttf", "DMSans-Medium.ttf"],
        "medium": ["DMSans-Medium.ttf", "DMSans-Regular.ttf"],
        "bold": ["DMSans-Bold.ttf", "segoeuib.ttf", "arialbd.ttf"],
    }
    for name in weight_map.get(weight, weight_map["regular"]):
        candidates.append(FONTS_DIR / name)
        candidates.append(Path(windir) / "Fonts" / name)

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


def draw_grid(draw: ImageDraw.ImageDraw, size: tuple[int, int], spacing: int = 54) -> None:
    w, h = size
    for x in range(0, w, spacing):
        draw.line([(x, 0), (x, h)], fill=(18, 18, 22), width=1)
    for y in range(0, h, spacing):
        draw.line([(0, y), (w, y)], fill=(18, 18, 22), width=1)


def draw_accent_bar(
    draw: ImageDraw.ImageDraw,
    size: tuple[int, int],
    *,
    vertical: bool = False,
    inset: int = 72,
) -> None:
    w, h = size
    if vertical:
        draw.rectangle([inset, inset + 120, inset + 6, h - inset - 120], fill=INDIGO)
    else:
        draw.rectangle([inset, inset + 48, w - inset, inset + 54], fill=INDIGO)


def wrap_text(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


def text_block_height(lines: Sequence[str], line_height: int) -> int:
    return max(line_height, len(lines) * line_height)


def draw_centered_multiline(
    draw: ImageDraw.ImageDraw,
    lines: Sequence[str],
    *,
    cx: int,
    cy: int,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    line_height: int,
) -> None:
    total_h = text_block_height(lines, line_height)
    y = cy - total_h // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw // 2, y), line, font=font, fill=fill)
        y += line_height


def draw_cover(spec: CoverSpec) -> None:
    img = Image.new("RGB", COVER_SIZE, OBSIDIAN)
    draw = ImageDraw.Draw(img)
    draw_grid(draw, COVER_SIZE, spacing=60)

    w, h = COVER_SIZE
    cx, cy = w // 2, h // 2

    # Safe zone guide (center 70%): keep icon + title inside ~756px diameter
    safe_r = int(min(w, h) * 0.35)
    draw.ellipse(
        [cx - safe_r, cy - safe_r, cx + safe_r, cy + safe_r],
        outline=(30, 30, 38),
        width=1,
    )

    icon_font = load_font(120, "bold")
    title_font = load_font(64, "bold")

    icon_bbox = draw.textbbox((0, 0), spec.icon, font=icon_font)
    icon_w = icon_bbox[2] - icon_bbox[0]
    icon_h = icon_bbox[3] - icon_bbox[1]
    draw.text((cx - icon_w // 2, cy - icon_h - 36), spec.icon, font=icon_font, fill=INDIGO)

    title_lines = wrap_text(spec.title, width=12)
    draw_centered_multiline(
        draw,
        title_lines,
        cx=cx,
        cy=cy + 56,
        font=title_font,
        fill=PEARL,
        line_height=72,
    )

    draw.rectangle([cx - 48, cy + 140, cx + 48, cy + 146], fill=INDIGO_SOFT)

    out = OUT / "covers" / spec.filename
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    print(f"  cover  {out.relative_to(ROOT)}")


def draw_tags(
    draw: ImageDraw.ImageDraw,
    tags: Sequence[str],
    *,
    x: int,
    y: int,
    max_width: int,
    font: ImageFont.ImageFont,
    accent: tuple[int, int, int],
) -> int:
    pad_x, pad_y = 22, 14
    gap = 14
    rows: list[list[tuple[str, tuple[int, int, int, int]]]] = [[]]
    cursor_x = 0
    row_h = 0
    for tag in tags:
        bbox = draw.textbbox((0, 0), tag, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        box_w = tw + pad_x * 2
        box_h = th + pad_y * 2
        row_h = max(row_h, box_h)
        if cursor_x + box_w > max_width and rows[-1]:
            rows.append([])
            cursor_x = 0
            row_h = box_h
        rows[-1].append((tag, (cursor_x, 0, cursor_x + box_w, box_h)))
        cursor_x += box_w + gap

    cy = y
    for row in rows:
        row_h = max(r[1][3] - r[1][1] for r in row)
        for tag, (rx1, _, rx2, _) in row:
            rect = [x + rx1, cy, x + rx2, cy + row_h]
            draw.rounded_rectangle(rect, radius=12, fill=CHARCOAL, outline=accent, width=2)
            tb = draw.textbbox((0, 0), tag, font=font)
            tw = tb[2] - tb[0]
            th = tb[3] - tb[1]
            tx = rect[0] + (rect[2] - rect[0] - tw) // 2
            ty = rect[1] + (rect[3] - rect[1] - th) // 2 - 2
            draw.text((tx, ty), tag, font=font, fill=PEARL)
        cy += row_h + gap
    return cy


def draw_story(spec: SlideSpec) -> None:
    img = Image.new("RGB", STORY_SIZE, OBSIDIAN)
    draw = ImageDraw.Draw(img)
    draw_grid(draw, STORY_SIZE, spacing=72)
    draw_accent_bar(draw, STORY_SIZE, vertical=True, inset=64)

    w, h = STORY_SIZE
    margin_l, margin_r = 120, 96
    content_w = w - margin_l - margin_r

    eyebrow_font = load_font(28, "medium")
    title_font = load_font(72, "bold")
    body_font = load_font(36, "regular")
    tag_font = load_font(28, "medium")
    footer_font = load_font(24, "regular")

    y = 180
    draw.text((margin_l, y), spec.eyebrow.upper(), font=eyebrow_font, fill=spec.accent)
    y += 56

    title_lines = wrap_text(spec.title, width=16)
    for line in title_lines:
        draw.text((margin_l, y), line, font=title_font, fill=WHITE)
        y += 84
    y += 24

    body_lines = wrap_text(spec.body, width=34)
    for line in body_lines:
        draw.text((margin_l, y), line, font=body_font, fill=PEARL)
        y += 52
    y += 36

    if spec.tags:
        y = draw_tags(
            draw,
            spec.tags,
            x=margin_l,
            y=y,
            max_width=content_w,
            font=tag_font,
            accent=spec.accent,
        )
        y += 24

    footer = "Zachary Hutton"
    fb = draw.textbbox((0, 0), footer, font=footer_font)
    fw = fb[2] - fb[0]
    draw.text((w - margin_r - fw, h - 96), footer, font=footer_font, fill=ASH)

    out = OUT / spec.folder / spec.filename
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    print(f"  story  {out.relative_to(ROOT)}")


COVERS: list[CoverSpec] = [
    CoverSpec("01-about.png", "About", "◎"),
    CoverSpec("02-projects.png", "Projects", "◆"),
    CoverSpec("03-skills.png", "Skills", "▣"),
    CoverSpec("04-utech.png", "UTech", "✦"),
    CoverSpec("05-contact.png", "Contact", "✉"),
]

STORIES: list[SlideSpec] = [
    # About
    SlideSpec(
        "stories-about",
        "01-who-i-am.png",
        "About",
        "Who I am",
        "Zachary Hutton. BSc Computer Science at the University of Technology, Jamaica. "
        "GPA 3.7, Dean's List. Based in Portmore, available remote.",
        ("CS Student", "Dean's List", "Jamaica"),
    ),
    SlideSpec(
        "stories-about",
        "02-what-i-build.png",
        "About",
        "What I build",
        "Full-stack web apps with React, Python, and TypeScript. I connect coursework "
        "to projects I can run, test, and ship. Security-aware engineering on personal time.",
        ("Full-Stack", "Security-aware", "Ship fast"),
    ),
    SlideSpec(
        "stories-about",
        "03-open-to-internships.png",
        "About",
        "Open to internships",
        "Seeking software internships and co-ops. Strong fundamentals, quick learner, "
        "team-oriented. Portfolio and resume linked in bio.",
        ("Internships", "Co-ops", "Remote OK"),
        accent=INDIGO_SOFT,
    ),
    # Projects
    SlideSpec(
        "stories-projects",
        "01-portfolio.png",
        "Projects",
        "Personal Portfolio",
        "Next.js App Router site with typed content, case studies, spotlight carousel, "
        "and obsidian design system. Deployed on Vercel.",
        ("Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"),
    ),
    SlideSpec(
        "stories-projects",
        "02-studysync.png",
        "Projects",
        "StudySync API",
        "FastAPI backend for coursework deadlines and study sessions. JWT auth, "
        "SQLAlchemy models, Pydantic validation, and OpenAPI docs.",
        ("Python", "FastAPI", "SQLAlchemy", "JWT", "OpenAPI"),
        accent=INDIGO_SOFT,
    ),
    SlideSpec(
        "stories-projects",
        "03-weroi-platform.png",
        "Projects",
        "weROI Platform",
        "Full-stack agency platform I built: React frontend, FastAPI backend, MongoDB Atlas. "
        "Lead capture, admin dashboard, JWT auth, email integration. Vercel and Railway.",
        ("React", "FastAPI", "MongoDB", "JWT", "Vercel", "Railway"),
    ),
    SlideSpec(
        "stories-projects",
        "04-pntcog.png",
        "Projects",
        "PNTCOG Ministry",
        "Multi-section React ministry site: events, giving, prayer requests, and media. "
        "Mobile-first, responsive layouts. Live at portmorentcog.org.",
        ("React", "TypeScript", "Vercel", "Responsive UI"),
        accent=(245, 158, 11),
    ),
    # Skills
    SlideSpec(
        "stories-skills",
        "01-languages.png",
        "Skills",
        "Languages",
        "Languages I use across coursework and projects.",
        (
            "Python",
            "TypeScript",
            "JavaScript",
            "Java",
            "SQL",
            "HTML5 / CSS3",
        ),
    ),
    SlideSpec(
        "stories-skills",
        "02-frameworks.png",
        "Skills",
        "Frameworks",
        "Frameworks and libraries for frontends, backends, and APIs.",
        (
            "React",
            "Next.js",
            "FastAPI",
            "Tailwind CSS",
            "Node.js",
            "Express",
            "SQLAlchemy",
            "Pydantic",
        ),
        accent=INDIGO_SOFT,
    ),
    SlideSpec(
        "stories-skills",
        "03-tools-practices.png",
        "Skills",
        "Tools & practices",
        "Infrastructure, workflow, and engineering habits.",
        (
            "Git & GitHub",
            "Vercel",
            "Railway",
            "MongoDB Atlas",
            "Docker basics",
            "REST API design",
            "Secure coding",
            "CI/CD",
        ),
    ),
    # UTech
    SlideSpec(
        "stories-utech",
        "01-cs-student.png",
        "UTech",
        "CS @ UTech",
        "BSc Computer Science, University of Technology, Jamaica. GPA 3.7, Dean's List. "
        "Expected graduation 2029. Data structures, databases, and networking.",
        ("GPA 3.7", "Dean's List", "2029"),
    ),
    SlideSpec(
        "stories-utech",
        "02-labs-github.png",
        "UTech",
        "Labs to GitHub",
        "I connect class concepts to repos I can demo. OWASP and PortSwigger labs on "
        "personal time. Coursework wins without sharing graded work.",
        ("GitHub", "OWASP", "PortSwigger", "Build in public"),
        accent=INDIGO_SOFT,
    ),
    # Contact
    SlideSpec(
        "stories-contact",
        "01-reach-me.png",
        "Contact",
        "Reach me",
        "Open to internships, co-ops, and collaboration. Based in Portmore, Jamaica. "
        "Remote opportunities welcome.",
        ("hzach577@gmail.com", "Open to work"),
    ),
    SlideSpec(
        "stories-contact",
        "02-links.png",
        "Contact",
        "Links",
        "Portfolio, GitHub, and LinkedIn. All projects and resume in one place.",
        (
            "zachary-hutton-portfolio.vercel.app",
            "github.com/zacharyahutton",
            "linkedin.com/in/zachary-hutton-a2ab81415",
        ),
        accent=INDIGO_SOFT,
    ),
]


def main() -> None:
    print(f"Output: {OUT}")
    for spec in COVERS:
        draw_cover(spec)
    for spec in STORIES:
        draw_story(spec)
    total = len(COVERS) + len(STORIES)
    print(f"Done. Generated {total} PNGs.")


if __name__ == "__main__":
    main()
