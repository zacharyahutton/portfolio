# Instagram Highlights — Upload Guide

Magazine-style Story Highlight covers and pinned story slides for **Zachary Hutton**. Obsidian (`#050505`) + electric indigo (`#1500ff`), varied layouts with substantive copy on every slide.

**Regenerate:**

```bash
cd portfolio
pip install pillow qrcode[pil]
python scripts/generate-instagram-highlights.py
```

**Live screenshots** (Playwright — optional):

```bash
python scripts/generate-instagram-highlights.py --capture --force-capture
npx playwright install chromium   # first time only
```

Output: `brand/instagram/` — covers, five story folders, `assets/logos/`, `photos-needed.md`, `motion/README.md`.

Every slide uses **80px margins**, `ZH // 2026` motif, and headline + multi-line body copy (no sparse one-word tags).

---

## Before you start

1. Profile photo, bio, link per `brand/INSTAGRAM_SETUP.md`.
2. Real photos in `assets/` (`desk-setup.png`, `utech-campus.png`); optional headshot per `photos-needed.md`.
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
| 1 | `01-who-i-am.png` | Headshot polaroid + intro copy (full-stack, UTech, GPA 3.7) |
| 2 | `02-workspace.png` | Full desk setup in lower-third bar + secure web apps focus |
| 3 | `03-github-weekly.png` | GitHub profile in browser frame + caption on what recruiters see |
| 4 | `04-portfolio-monitor.png` | Portfolio on SANSUI monitor (desk crop) or live capture |

### Build (`stories-build/`) — 20 slides

Four projects × five slides each (browser → problem → solution → stack → learned):

| Project | Files |
|---------|-------|
| Portfolio | `01-portfolio-a-browser.png` … `01-portfolio-e-learned.png` |
| weROI | `02-weroi-a-browser.png` … `02-weroi-e-learned.png` |
| StudySync | `03-studysync-a-browser.png` … `03-studysync-e-learned.png` |
| PNTCOG | `04-pntcog-a-browser.png` … `04-pntcog-e-learned.png` |

Each narrative slide has 2–4 sentences of context. Stack slide explains **why** each technology matters.

### Stack (`stories-stack/`) — 5 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-what-i-build.png` | Web apps, APIs, secure backends (card layout) |
| 2 | `02-languages.png` | Languages grid with one-line blurbs |
| 3 | `03-frameworks.png` | Frameworks grid with copy |
| 4 | `04-tools.png` | Tools and deploy grid with copy |
| 5 | `05-architecture.png` | Browser → API → database diagram in plain English |

Logos download to `assets/logos/` on regen when CDN is reachable; text badges render as fallback.

### UTech (`stories-utech/`) — 3 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-campus.png` | Campus sign photo + conversational lower-third |
| 2 | `02-labs-github.png` | Labs → GitHub, OWASP, PortSwigger |
| 3 | `03-academic-proof.png` | GPA 3.7, Dean's List, graduation 2029 |

### Connect (`stories-connect/`) — 3 slides

| Order | File | Content |
|-------|------|---------|
| 1 | `01-open-to-work.png` | Internships and co-ops availability |
| 2 | `02-links.png` | Email, LinkedIn, GitHub, portfolio with context per link |
| 3 | `03-qr-portfolio.png` | QR + why scan the portfolio |

Slides are **1080×1920** (9:16).

---

## Step 3 — Pin to highlights

1. Post slides in folder order (`01`, `02`, …).
2. Add each to the highlight created in Step 1.
3. Confirm cover art in **Edit Highlight**.

Optional motion clips: see `motion/README.md`.

---

## Complete file list (45 PNGs)

```
covers/                          5 PNGs
stories-about/                   4 PNGs
stories-build/                  20 PNGs
stories-stack/                   5 PNGs
stories-utech/                   3 PNGs
stories-connect/                 3 PNGs
```

**Total: 45 PNGs** (5 covers + 40 stories).

---

## Checklist

- [ ] 5 covers
- [ ] About: 4 stories
- [ ] Build: 20 stories
- [ ] Stack: 5 stories
- [ ] UTech: 3 stories
- [ ] Connect: 3 stories
- [ ] Bio link: https://zachary-hutton-portfolio.vercel.app/

---

*Content from `content/profile.ts`, `content/skills.ts`, project modules, and StudySync API source.*
