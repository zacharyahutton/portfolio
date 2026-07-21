# Portfolio Premium Redesign + DevOS Gold Standard Plan

> **Status:** Plan only — await Zachary approval before implementation  
> **Date:** 2026-07-20  
> **Scope:** `Documents/PORTFOLIO` only (not WehFiGo)  
> **Live:** https://zachary-hutton-portfolio.vercel.app/  
> **Remote:** https://github.com/zacharyahutton/portfolio  
> **Prior audit:** [`A-GRADE-ROADMAP.md`](./A-GRADE-ROADMAP.md) — C+ (57/100)

---

## 0. Critical local state

**Local `Documents/PORTFOLIO` currently contains only this docs folder** (roadmap + this plan). Full app source lives on GitHub `main`.

**Phase 0 (before any code):**

```powershell
cd C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO
git clone https://github.com/zacharyahutton/portfolio.git .
# or: git init + remote + fetch if preserving docs/
```

Preserve `docs/A-GRADE-ROADMAP.md` and this file when merging into the clone.

---

## 1. What “gold standard” means in DevOS

### Layer model (cite paths)

| Layer | Path | Role |
|-------|------|------|
| **Template** | `DevOS/Templates/` | Complete UX DNA of an entire site category |
| **Recipe** | `DevOS/Recipes/` | Niche assembly instructions |
| **Pattern** | `DevOS/Patterns/Active/` | Executable capability blocks |
| **Portfolio-Sites** | `DevOS/Portfolio-Sites/` | Living gallery of flight-tested gold sites |
| **Promotion SOP** | `DevOS/Systems/SOPs/Master-Template-Promotion.md` | How a project becomes a Template |
| **Selection SOP** | `DevOS/Systems/SOPs/Master-Template-Selection.md` | Kickoff decision tree |
| **Workflow** | `DevOS/START_HERE.md` + `Systems/SOPs/New-Project-Workflow.md` | Discovery → Template → Brand adapt → Build → Audit → Learn |
| **Law** | `DevOS/.cursor/rules/gold-templates.mdc` | Never downgrade; reuse → adapt → improve |

### Current Portfolio Template status

- `DevOS/Templates/Portfolio/README.md` — **Stub** (“Awaiting promotion”)
- `DevOS/Portfolio-Sites/Portfolio/README.md` — **Candidate** (site exists; DNA not extracted)
- `DevOS/Templates/MASTER_TEMPLATES.md` — Portfolio listed under Planned stubs
- **Only Active gold Template today:** `Templates/Manufacturer-Premium/v1/` (~8.5/10) from Domus + Northern Elite

### Promotion criteria (all required)

From `Master-Template-Promotion.md`:

1. Flight-tested (built, audited, deployable)
2. Brand-agnostic DNA (no personal proprietary secrets; personal brand tokens OK as *example* in provenance, not as Template law)
3. Quality score ≥ 7.5 with audit evidence
4. ≥ 50% referenced Patterns are Active
5. Curation Gate passed

### Reference DNA (adapt for portfolio niche)

Use Manufacturer-Premium as the **quality bar and doc shape**, not the visual system:

- `Templates/Manufacturer-Premium/v1/TEMPLATE.md`
- `page-architecture.md` — disciplined section order
- `motion-system.md` — **2–3 intentional motions**, GSAP-first, reduced-motion
- `anti-patterns.md` — hero clutter, dual motion libs, invented metrics, cards everywhere
- Scaffold: `Templates/_TEMPLATE/` → copy to `Templates/Portfolio/v1/` after flight test

### DevOS workflow this redesign follows

```text
Discovery → (Level 3: First Principles — no Portfolio Template yet)
  → Build premium personal site
  → Hostile audit ≥ 7.5
  → Curation Gate → Promote Templates/Portfolio/v1/
  → Link Portfolio-Sites/Portfolio/ as GOLD
```

This redesign is simultaneously: (A) ship a hire-me site at A-grade, and (B) create the missing DevOS Portfolio Master Template.

---

## 2. Current portfolio audit (strong vs gaps)

### Already strong (keep / elevate)

| Asset | Evidence |
|-------|----------|
| Typed content architecture | `content/types.ts`, modular `case-studies/`, `profile`, `skills`, `services` |
| Case study schema | overview / problem / solution / architecture / keyDecisions / metrics |
| Resume differentiator | modal + `@react-pdf/renderer` generation |
| Blog volume | ~23 posts (SEO surface) |
| Real live work | weROI, PNTCOG, Tendem bot |
| Expressive type + dark system | Anton/Syne/DM Sans + indigo editorial (live); avoid restarting identity |
| Sitemap | `app/sitemap.ts` exists |
| Stack alignment with DevOS gold | Next 15.5 / React 19 / TW4 / GSAP |

### Gaps vs gold bar (Manufacturer-Premium quality + A-grade hire conversion)

| Gap | Current | Gold target |
|-----|---------|-------------|
| Homepage length | 14 sections (`page.tsx`) | ≤ 8–9 jobs; one job per section |
| Work proof | Spotlight metrics = features; weak screenshots | Outcome metrics + crisp WebP proof |
| Missing showcase | Domus / NEC / WehFiGo absent | Domus first; NEC when URL ready |
| Motion | GSAP + Framer + Three + OGL + shaders | One primary motion system; lazy 3D; 2–3 motions |
| SEO chrome | No robots, no OG, Vercel subdomain | `robots.ts`, OG 1200×630, custom domain |
| a11y | Reduced-motion OK; no skip-link | Skip-link + focus traps on modals |
| Contact security | No Zod in deps | Zod + honeypot + rate limit (DevOS lead pattern) |
| Services narrative | Agency-sounding | “How I work” / capabilities tied to case studies |
| DevOS reuse | Stub Template | Full `Templates/Portfolio/v1/` DNA pack |
| Local workspace | Docs-only folder | Full clone at `Documents/PORTFOLIO` |

### Design direction: keep vs elevate

**Keep (identity — do not reinvent):**

- Dark-first indigo editorial (`#1500ff` discipline)
- Anton condensed name / Syne / DM Sans / IBM Plex Mono
- Resume modal + PDF
- Blog corpus (resequence, don’t delete)
- Typed `content/` modules

**Elevate (premium bar):**

- Hero budget: name + role + one sentence + CTA + one visual (drop Hello/i’m filler layers)
- Homepage = proof-first (work within first scroll after marquee)
- Motion hierarchy: choreograph, don’t stack libraries
- Case studies: Domus-level visual proof + honest outcomes
- Chrome: OG, domain, skip-link, hardened contact — table stakes from Manufacturer DNA

**Note:** GitHub `README.md` still describes an older forest+amber rationale; live/`page.tsx` is indigo multi-section. Sync README to the chosen DNA during Phase 6 docs.

---

## 3. Structural template for future DevOS portfolio clones

### Target folder layout (cloneable)

```text
portfolio-clone/
  app/
    layout.tsx          # metadataBase, skip-link, Person JSON-LD
    page.tsx            # ≤9 sections
    projects/[slug]/
    blog/[slug]/
    services/           # or how-i-work/
    sitemap.ts
    robots.ts
    api/contact/        # Zod + honeypot + RL
  brand/                # tokens, logo rules (optional)
  components/
    chrome/             # Navbar, Footer, SkipLink, Theme
    home/               # Hero, Marquee, Spotlight, HireCTA…
    case-study/         # CaseStudyLayout
    resume/             # Modal, PDF, Provider
    fx/                 # ONLY allowed motion primitives (GSAP-first)
  content/
    types.ts            # schema lock
    profile.ts
    spotlight.ts
    case-studies/*.ts
    blog/
    services.ts
    skills.ts
    experience.ts
  public/
    og.png
    case-studies/*.webp
    Zach_*_Resume.pdf
  docs/
    AUDIT.md
    PROJECT_PLAN.md
  scripts/              # resume PDF only; no Playwright on every deploy if avoidable
```

### Content schema (gold)

Extend existing `CaseStudy` / `Project` / `SpotlightItem`:

- **Required outcomes:** ≥1 metric that is an outcome (users, leads, uptime, pages, conversion) — not a stack buzzword
- **Required proof:** ≥1 screenshot WebP ≤ 200KB (or video poster)
- **Sanitization flag:** `visibility: public | preview | demo-labeled`
- **CTA:** every case study ends with hire CTA + related posts

### Component kit (minimum Active-Pattern candidates)

1. Hero name + typewriter role (budget-enforced)
2. Skills marquee (single motion)
3. Spotlight / bento work proof
4. Case study layout (problem → solution → architecture → metrics → CTA)
5. Blog index + article schema
6. Hire CTA + resume modal
7. Contact form (Zod + honeypot + RL)
8. SEO helpers (`createMetadata`, `Person`/`Article` JSON-LD)
9. Skip-link + reduced-motion gate

### Clone checklist (future DevOS users)

- [ ] Instantiate `Templates/Portfolio/v1/` (after promotion)
- [ ] Brand-swap: name, colors, fonts (within expressive rules), photo
- [ ] Replace case studies; keep schema
- [ ] Compress all media; OG image
- [ ] Wire contact API + env
- [ ] Custom domain + metadataBase
- [ ] Hostile audit ≥ 7.5
- [ ] Curation Gate if improvements → Template version bump

---

## 4. Phased workstreams

### Phase 0 — Workspace (30–60 min)

- Restore full git clone into `Documents/PORTFOLIO`
- Keep `docs/*` plans
- Confirm `npm run build` green locally

### Phase 1 — Hero + foundation polish (6–10 hrs) → ~B

*Aligns with A-GRADE Phase 1 quick wins + hero hierarchy*

- Compress bot cover; upgrade weROI screenshot
- `robots.ts` / `public/robots.txt`, OG image, skip-link
- Outcome metrics for spotlight/case studies
- Per-page `generateMetadata`
- Hoist project-specific blog posts
- Collapse hero to 3 layers (name / role / sentence+CTA)

**DoD Phase 1:** Share preview looks intentional; Lighthouse a11y skip path; no 1.5MB images.

### Phase 2 — Work surface (10–14 hrs)

- Cut homepage to ~8–9 sections:  
  `Navbar → Hero → Marquee → Spotlight/Work → About(+skills) → Achievements → Blog(3) → HireCTA → Contact → Footer`  
  Remove or merge: Services-on-home, LaptopScroll XOR DevParallax, duplicate About
- Add Domus case study + screenshots
- Services → “How I work” or deep-link to projects
- Lazy-load Three/shaders; prefer GSAP as law (Framer only if necessary for residual UI)

**DoD Phase 2:** Work visible above fold-ish; Domus live on `/projects/domus`; homepage scroll feels editorial not exhaustive.

### Phase 3 — Case studies depth (8–12 hrs)

- weROI: architecture visual + 1 outcome stat
- Bot: GIF/video proof
- PNTCOG: tighten metrics
- NEC: add when preview/domain OK (demo-labeled if needed)
- WehFiGo: architecture case only when public-safe

**DoD Phase 3:** Every featured study has problem/solution/proof/outcome/CTA.

### Phase 4 — Blog SEO (4–6 hrs)

- Resequence index; personal voice on top posts
- Article JSON-LD; read time; OG per post
- Cull or demote generic tutorial titles from homepage strip

**DoD Phase 4:** Homepage blog strip signals “working builder,” not tutorial farm.

### Phase 5 — Services + chrome (4–6 hrs)

- Services page narrative rewrite
- Contact: Zod + honeypot + rate limit
- Custom domain decision + `metadataBase`
- Light-mode QA pass

**DoD Phase 5:** Conversion path clear; contact fail-visible; domain not “side project.”

### Phase 6 — Polish + motion discipline (6–10 hrs)

- Motion audit: 2–3 page-level motions; remove unused ogl/shaders if dead
- Navbar complexity pass (17KB → simpler if possible)
- Bundle audit

**DoD Phase 6:** Hostile audit ≥ 8.0 design/motion; no dual-motion-lib anti-pattern on critical path.

### Phase 7 — DevOS promotion docs (3–5 hrs)

Extract brand-agnostic DNA to:

```text
DevOS/Templates/Portfolio/v1/
  TEMPLATE.md
  brand-swap-checklist.md
  page-architecture.md
  motion-system.md
  anti-patterns.md
  provenance.md
  links.md
```

Update:

- `Templates/MASTER_TEMPLATES.md` (Active)
- `Portfolio-Sites/Portfolio/README.md` → GOLD
- `Portfolio-Sites/GOLDEN-STANDARDS.md`
- `.cursor/rules/gold-templates.mdc` kickoff one-liner
- `VERSION.md` / `CHANGELOG.md` (DevOS)

**DoD Phase 7:** Another agent can kick off a portfolio clone from Template alone.

---

## 5. Definition of done — Portfolio gold standard

### Site (hire-me)

| Dimension | Threshold |
|-----------|-----------|
| Overall audit | ≥ **8.0 / 10** (honest hostile) |
| Design | Distinctive indigo editorial; hero budget held; no AI-slop |
| Motion | ≤ 3 intentional systems; reduced-motion; no competing 3D on load |
| Content | ≥ 4 featured case studies with outcomes + proof (incl. Domus) |
| SEO | OG, robots, sitemap, per-route metadata, Article/Person schema |
| a11y | Skip-link, focus traps, AA contrast |
| Perf | Hero images ≤ 200KB; 3D lazy; no Playwright on critical CI path unless needed |
| Conversion | Hire CTA + resume + contact hardened |
| Domain | Custom domain preferred (or documented deferral) |

### DevOS

| Criterion | Threshold |
|-----------|-----------|
| Template promoted | `Templates/Portfolio/v1/` complete DNA pack |
| Quality score | ≥ 7.5 documented |
| Portfolio-Sites | Marked GOLD with canonical path |
| Patterns | ≥ 50% referenced are Active or queued Incoming with stubs |
| Law | Never-downgrade satisfied vs pre-redesign C+ |

---

## 6. What we need from Zachary to start Phase 1

1. **Approve this plan** (or mark phase edits)
2. **Approve Phase 0 clone** into `Documents/PORTFOLIO` (preserve docs)
3. **Must-keep list confirmation** — indigo + Anton stack + resume modal? (recommended: yes)
4. **Hero photo / OG assets** — prefer your headshot or brand mark; or authorize generate
5. **Outcome metrics you will stand behind** for weROI / PNTCOG / bot (numbers you own)
6. **Domain preference** — `zacharyhutton.dev` / other / defer
7. **Showcase gates:** Domus = go now?; NEC preview URL OK?; WehFiGo hold until live payments?
8. **Services framing:** keep “Services” vs rename “How I work”
9. **References (optional):** 1–2 portfolio sites you consider premium bar for *personal* sites (not manufacturer)

---

## 7. Explicit non-goals

- Not WehFiGo redesign
- Not promoting contractor demos until client-ready
- Not committing/pushing until asked
- Not inventing client metrics or NEC launch facts
- Not dumping career/`_private-career` into public repo

---

*Next action after approval: Phase 0 clone → Phase 1 implementation.*
