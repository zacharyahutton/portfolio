# Instagram Highlights — Upload Guide

Magazine-style Story Highlight covers and pinned story slides for **Zachary Hutton**. Obsidian (`#050505`) + electric indigo (`#1500ff`), varied layouts — not identical AI slides.

**Regenerate:**

```bash
cd portfolio
pip install pillow qrcode[pil]
python scripts/generate-instagram-highlights.py
```

**Optional live screenshots** (Playwright — uses `portfolio` devDependency):

```bash
python scripts/generate-instagram-highlights.py --capture
npx playwright install chromium   # first time only
```

Output: `brand/instagram/` — covers, five story folders, `assets/screenshots/`, `photos-needed.md`, `motion/README.md`.

---

## Before you start

1. Profile photo, bio, link per `brand/INSTAGRAM_SETUP.md`.
2. Replace placeholders listed in `photos-needed.md` (portrait, desk, campus).
3. Transfer PNGs to phone (AirDrop, Drive, USB).
4. Create highlights **left → right**: About → Build → Stack → UTech → Connect.

---

## Step 1 — Highlight covers (`covers/`)

| Order | Name | File |
|-------|------|------|
| 1 | **About** | `01-about.png` |
| 2 | **Build** | `02-build.png` |
| 3 | **Stack** | `03-stack.png` |
| 4 | **UTech** | `04-utech.png` |
| 5 | **Connect** | `05-connect.png` |

1080×1080, text-only, safe for circular crop.

---

## Step 2 — Story slides (numeric order)

Post each PNG as a Story → **Highlight** → matching folder name.

### About (`stories-about/`)

| File | Content |
|------|---------|
| `01-portrait.png` | Polaroid — headshot or placeholder |
| `02-workspace.png` | Desk / laptop placeholder |
| `03-github-weekly.png` | GitHub contributions + “Building every week →” |

### Build (`stories-build/`)

Four projects × four slides each (browser → problem → solution → stack):

| Project | A browser | B problem | C solution | D stack |
|---------|-----------|-----------|------------|---------|
| Portfolio | `01-portfolio-a-browser.png` | `…-b-problem.png` | `…-c-solution.png` | `…-d-stack.png` |
| weROI | `02-weroi-…` | | | |
| StudySync | `03-studysync-…` | | | |
| PNTCOG | `04-pntcog-…` | | | |

### Stack (`stories-stack/`)

| File | Content |
|------|---------|
| `01-what-i-build.png` | Web apps, APIs, internal tools |
| `02-tech-badges.png` | Text badge grid |
| `03-code-snippet.png` | Real StudySync FastAPI route |

### UTech (`stories-utech/`)

| File | Content |
|------|---------|
| `01-campus.png` | Campus placeholder + CS @ UTech card |
| `02-labs-github.png` | Labs → GitHub |

### Connect (`stories-connect/`)

| File | Content |
|------|---------|
| `01-open-to-work.png` | Internships & co-ops |
| `02-links.png` | Email, LinkedIn, GitHub, portfolio |
| `03-qr-portfolio.png` | QR to portfolio |

Slides are **1080×1920** (9:16). Every slide: `ZH // 2026` label + indigo accent + grain/grid texture.

---

## Step 3 — Pin to highlights

1. Post slides in folder order (`01`, `02`, …).
2. Add each to the highlight created in Step 1.
3. Confirm cover art in **Edit Highlight**.

Optional motion clips: see `motion/README.md`.

---

## Checklist

- [ ] 5 covers
- [ ] About: 3 stories
- [ ] Build: 16 stories
- [ ] Stack: 3 stories
- [ ] UTech: 2 stories
- [ ] Connect: 3 stories
- [ ] Bio link: https://zachary-hutton-portfolio.vercel.app/
- [ ] Personal photos swapped per `photos-needed.md`

**Total:** 32 PNGs (5 covers + 27 stories).

---

*Content from `content/profile.ts`, project modules, and StudySync API source.*
