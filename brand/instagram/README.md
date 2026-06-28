# Instagram Highlights — Upload Guide

Magazine-style Story Highlight covers and pinned story slides for **Zachary Hutton**. Obsidian (`#050505`) + electric indigo (`#1500ff`), varied layouts — not identical AI slides.

**Regenerate:**

```bash
cd portfolio
pip install pillow qrcode[pil]
python scripts/generate-instagram-highlights.py
```

**Live screenshots** (Playwright — optional devDependency):

```bash
python scripts/generate-instagram-highlights.py --capture --force-capture
npx playwright install chromium   # first time only
```

Output: `brand/instagram/` — covers, five story folders, `assets/`, `photos-needed.md`, `motion/README.md`.

---

## Before you start

1. Profile photo, bio, link per `brand/INSTAGRAM_SETUP.md`.
2. Real photos live in `assets/` (`desk-setup.png`, `utech-campus.png`); optional headshot per `photos-needed.md`.
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

1080×1080, text-only, safe for circular crop. Indigo underline sits **below** title text (not through glyphs).

---

## Step 2 — Story slides (numeric order)

Post each PNG as a Story → **Highlight** → matching folder name.

### About (`stories-about/`) — 4 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-who-i-am.png` | Headshot polaroid **or** laptop/GitHub crop — “Hi, I'm Zach” |
| 2 | `02-workspace.png` | Full desk setup — “Currently focused on secure web applications.” |
| 3 | `03-github-weekly.png` | GitHub profile (README, stats, pins) + “Building every week →” |
| 4 | `04-portfolio-monitor.png` | SANSUI monitor crop — portfolio on the big screen |

### Build (`stories-build/`) — 20 slides

Four projects × five slides each (browser → problem → solution → stack → learned):

| Project | A browser | B problem | C solution | D stack | E learned |
|---------|-----------|-----------|------------|---------|-----------|
| Portfolio | `01-portfolio-a-browser.png` | `01-portfolio-b-problem.png` | `01-portfolio-c-solution.png` | `01-portfolio-d-stack.png` | `01-portfolio-e-learned.png` |
| weROI | `02-weroi-a-browser.png` | `02-weroi-b-problem.png` | `02-weroi-c-solution.png` | `02-weroi-d-stack.png` | `02-weroi-e-learned.png` |
| StudySync | `03-studysync-a-browser.png` | `03-studysync-b-problem.png` | `03-studysync-c-solution.png` | `03-studysync-d-stack.png` | `03-studysync-e-learned.png` |
| PNTCOG | `04-pntcog-a-browser.png` | `04-pntcog-b-problem.png` | `04-pntcog-c-solution.png` | `04-pntcog-d-stack.png` | `04-pntcog-e-learned.png` |

Tilted browser frames, handwritten arrows, rotated cards — layouts vary per project. Portfolio browser slide uses real desk monitor crop.

### Stack (`stories-stack/`) — 3 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-what-i-build.png` | Web apps, APIs, internal tools |
| 2 | `02-tech-badges.png` | Text badge grid |
| 3 | `03-code-snippet.png` | Real StudySync FastAPI route |

### UTech (`stories-utech/`) — 2 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-campus.png` | Real UTech campus photo + CS @ UTech card |
| 2 | `02-labs-github.png` | Labs → GitHub |

### Connect (`stories-connect/`) — 3 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-open-to-work.png` | Internships & co-ops |
| 2 | `02-links.png` | Email, LinkedIn, GitHub, portfolio |
| 3 | `03-qr-portfolio.png` | QR to portfolio |

Slides are **1080×1920** (9:16). Every slide: `ZH // 2026` label + indigo accent + grain/grid texture.

---

## Step 3 — Pin to highlights

1. Post slides in folder order (`01`, `02`, …).
2. Add each to the highlight created in Step 1.
3. Confirm cover art in **Edit Highlight**.

Optional motion clips: see `motion/README.md`.

---

## Complete file list (37 PNGs)

```
covers/
  01-about.png
  02-build.png
  03-stack.png
  04-utech.png
  05-connect.png

stories-about/
  01-who-i-am.png
  02-workspace.png
  03-github-weekly.png
  04-portfolio-monitor.png

stories-build/
  01-portfolio-a-browser.png … 01-portfolio-e-learned.png
  02-weroi-a-browser.png … 02-weroi-e-learned.png
  03-studysync-a-browser.png … 03-studysync-e-learned.png
  04-pntcog-a-browser.png … 04-pntcog-e-learned.png

stories-stack/
  01-what-i-build.png
  02-tech-badges.png
  03-code-snippet.png

stories-utech/
  01-campus.png
  02-labs-github.png

stories-connect/
  01-open-to-work.png
  02-links.png
  03-qr-portfolio.png

assets/
  desk-setup.png
  utech-campus.png
  screenshots/   (Playwright captures when --capture succeeds)
```

---

## Checklist

- [ ] 5 covers
- [ ] About: 4 stories
- [ ] Build: 20 stories
- [ ] Stack: 3 stories
- [ ] UTech: 2 stories
- [ ] Connect: 3 stories
- [ ] Bio link: https://zachary-hutton-portfolio.vercel.app/

**Total:** 37 PNGs (5 covers + 32 stories).

---

*Content from `content/profile.ts`, project modules, and StudySync API source.*
