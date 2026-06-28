# Instagram Highlights — Upload Guide

Upload-ready Story Highlight covers and pinned story slides for **Zachary Hutton**. Design matches portfolio obsidian (`#050505`) and electric indigo (`#1500ff`).

**Regenerate assets:** from `portfolio/` run:

```bash
python scripts/generate-instagram-highlights.py
```

Requires [Pillow](https://pypi.org/project/pillow/). Fonts: DM Sans in `fonts/` (script falls back to Segoe UI on Windows).

---

## Before you start

1. Profile photo, bio, and link in bio set per `brand/INSTAGRAM_SETUP.md`.
2. Transfer PNGs to your phone (AirDrop, Google Drive, USB, or cloud folder).
3. Create highlights **left to right** in the order below so the row reads: About → Projects → Skills → UTech → Contact.

---

## Step 1 — Create highlights (covers)

For each highlight, tap **New** on your profile story row, then **Edit Highlight** → **Edit Cover** → upload the matching PNG from `covers/`.

| Order (L→R) | Highlight name | Cover file |
|-------------|----------------|------------|
| 1 | **About** | `covers/01-about.png` |
| 2 | **Projects** | `covers/02-projects.png` |
| 3 | **Skills** | `covers/03-skills.png` |
| 4 | **UTech** | `covers/04-utech.png` |
| 5 | **Contact** | `covers/05-contact.png` |

Covers are 1080×1080. Text and icon sit in the center safe zone for Instagram’s circular crop.

---

## Step 2 — Upload story slides into each highlight

Post each folder’s PNGs as **Stories** (one image per story), in numeric order. After posting, open the story → **⋯** → **Highlight** → select the matching highlight name.

### About (`stories-about/`)

| File | Content |
|------|---------|
| `01-who-i-am.png` | Name, UTech CS, GPA 3.7, Dean's List, Portmore |
| `02-what-i-build.png` | Full-stack focus, security-aware engineering |
| `03-open-to-internships.png` | Open to internships and co-ops |

### Projects (`stories-projects/`)

| File | Content |
|------|---------|
| `01-portfolio.png` | Personal portfolio (Next.js, Vercel) |
| `02-studysync.png` | StudySync API (FastAPI, JWT, OpenAPI) |
| `03-weroi-platform.png` | weROI platform build (React, FastAPI, MongoDB) |
| `04-pntcog.png` | PNTCOG ministry site (React, live site) |

### Skills (`stories-skills/`)

| File | Content |
|------|---------|
| `01-languages.png` | Python, TypeScript, JavaScript, Java, SQL, HTML/CSS |
| `02-frameworks.png` | React, Next.js, FastAPI, Tailwind, Node, Express |
| `03-tools-practices.png` | Git, Vercel, Railway, MongoDB, REST, secure coding, CI/CD |

### UTech (`stories-utech/`)

| File | Content |
|------|---------|
| `01-cs-student.png` | CS student, GPA, Dean's List, graduation 2029 |
| `02-labs-github.png` | Coursework to GitHub, OWASP / PortSwigger labs |

### Contact (`stories-contact/`)

| File | Content |
|------|---------|
| `01-reach-me.png` | Email, open to work, location |
| `02-links.png` | Portfolio, GitHub, LinkedIn URLs |

Story slides are 1080×1920 (9:16).

---

## Step 3 — Pin stories to highlights

1. Post all slides for one highlight (or post and add to highlight one at a time).
2. When adding to a highlight, pick the highlight you created in Step 1.
3. Repeat for all five folders.
4. In **Edit Highlight**, confirm cover art still shows the correct `covers/*.png`.

**Tip:** Upload in folder order (`01`, `02`, `03`…) so pinned stories read top-to-bottom in a logical flow.

---

## Quick checklist

- [ ] 5 highlight covers uploaded (`covers/`)
- [ ] About: 3 stories pinned (`stories-about/`)
- [ ] Projects: 4 stories pinned (`stories-projects/`)
- [ ] Skills: 3 stories pinned (`stories-skills/`)
- [ ] UTech: 2 stories pinned (`stories-utech/`)
- [ ] Contact: 2 stories pinned (`stories-contact/`)
- [ ] Bio link: https://zachary-hutton-portfolio.vercel.app/
- [ ] Email button: hzach577@gmail.com

**Total assets:** 19 PNGs (5 covers + 14 story slides).

---

*Content sourced from `content/profile.ts`, `content/skills.ts`, and `brand/INSTAGRAM_SETUP.md`.*
