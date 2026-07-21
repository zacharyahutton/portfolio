# Portfolio A-Grade Roadmap
> Audit date: 2026-07-20 · Audited by Cursor agent
> Repo: github.com/zacharyahutton/portfolio · Live: zachary-hutton-portfolio.vercel.app
> Stack: Next.js 15.5 / React 19 / TypeScript / Tailwind v4 / GSAP + Framer Motion / Three.js

---

## Current Grade: **C+** (57/100)

The foundation is genuinely good — distinctive typography (Anton + Syne + DM Sans), a real dark design system, 23 actual blog posts, 3 live project spotlights, and a solid FX library. The blockers are structural and content, not "start over" problems.

---

## Scored Audit

| Dimension | Score | Verdict |
|-----------|-------|---------|
| **Design** | 6.5/10 | Good system; hero is cluttered with 5 text layers; 14-section homepage is exhausting; no OG image; Vercel subdomain looks unfinished |
| **Motion** | 6/10 | Ambitious FX library but too many competing effects; no clear hierarchy; Three.js + GSAP + Framer + Shaders + OGL all loaded simultaneously is excessive |
| **Content / Case Studies** | 5/10 | 3 real spotlight items but weROI screenshot is 34KB (placeholder-quality); metrics are features not outcomes; Domus not showcased; blog voice is generic |
| **SEO** | 4.5/10 | No robots.txt, no OG social image, still on Vercel subdomain, title lacks geographic signal, no per-page generateMetadata on project/blog routes (unverified but likely missing) |
| **Accessibility** | 5.5/10 | `prefers-reduced-motion` handled, `aria-hidden` on decoratives — good; no skip-to-content link visible in layout; no Zod in dependencies (contact form validation?) |
| **Performance** | 4.5/10 | `tendem-demo-bot-cover.png` is **1.5MB** unoptimized; Three.js + `@react-three/drei` loaded for the whole app; Playwright build step runs on every Vercel deploy; `@paper-design/shaders-react` GPU shaders without Suspense boundaries |
| **Code Quality** | 7/10 | Clean typed content modules, good CSS custom properties, solid architecture; `Navbar.tsx` is 17KB (complex); build script depends on Playwright which can fail on CI |
| **Conversion (hire me)** | 5/10 | HireCTA + resume modal exist; no per-case-study CTAs; Services page confuses the narrative ("am I a developer or an agency?"); stats are low-signal ("Open" / "3+ products") |

---

## Top 5 Blockers to A-Grade

1. **Homepage is 14 sections long** — Navbar → Hero → SkillsMarquee → Services → LaptopScroll → DevParallax → AboutNarrative → About → SkillsToolkit → Achievements → Blog → HireCTA → Contact → Footer. Most visitors scroll halfway. The weakest sections (redundant About layers, two DevParallax-adjacent sections) eat attention before reaching real work.

2. **No real project screenshots for the biggest work** — `weroi.png` is 34KB (thumbnail at best); `tendem-demo-bot-cover.png` is 1.5MB uncompressed. The visual proof of work is either too small or too slow. A recruiter scanning the Spotlight section sees a tiny branded tile for the most important project.

3. **Metrics read as features, not outcomes** — weROI metrics: "Multi-step / JWT-ready / Resend" — these describe *what was built*, not *what it achieved*. An A-grade portfolio quantifies: leads captured, uptime, users, conversion rate — anything that signals impact over implementation.

4. **Performance bundle is fighting itself** — GSAP + Framer Motion + Three.js (`@react-three/fiber` + `@react-three/drei`) + OGL + `@paper-design/shaders-react` are all in `dependencies` (not lazy). On a slow connection this is a 1.5–2MB JS bundle before images. The motion is impressive when it works; if it stutters, it hurts credibility.

5. **No OG image + no custom domain** — `zachary-hutton-portfolio.vercel.app` looks like a side project shared before it's ready. An OG image for link previews on LinkedIn/Twitter/WhatsApp is table stakes for a developer showcase. Every share without an OG card is a missed impression.

---

## What Already Exists That Should Be Showcased

The following are live, production, or high-quality work that should appear on the portfolio but currently don't (or are underrepresented):

| Project | Status | What to showcase |
|---------|--------|-----------------|
| **Domus** | Live on Vercel (domus.vercel.app) | Premium manufacturer/local-business site — strong design, GSAP reveals, Manufacturer-Premium DNA; add as `/projects/domus` case study |
| **Northern Elite Concrete** | Built, pending domain | Production Next.js 15 site; NEC logo, GSAP, gallery comparison sliders, session splash — add as a work sample once domain is live or with a Vercel preview URL |
| **WehFiGo (Listeo + Fiserv)** | Staging live, Fiserv payment proven | Full-stack WordPress + payment integration; Fiserv sandbox success is a concrete deliverable — add once live Fiserv credentials are in and site is public |
| **Contractor demo batch** | Local, not deployed | 5 training sites (Ridge/Prairie/Northline/Clearflow/Summit) — after client-ready polish, these prove design range across multiple niches; best 2-3 could become portfolio pieces |

**Sanitization rules:** Domus is public. Northern Elite domain pending — use Vercel preview URL. WehFiGo is a client platform — show architecture/case study, no admin credentials/private data. Contractor demos are fictional — clearly labeled as spec/demo work.

---

## Prioritized Roadmap to A-Grade

### Phase 1 — Quick Wins (est. 6–10 hrs)
*No structural changes. Pure polish and fixes.*

- [ ] **Compress `tendem-demo-bot-cover.png`** — Convert to WebP/AVIF, max 200KB. (`public/case-studies/`) — 30 min
- [ ] **Add `robots.txt`** to `public/` — 10 min
- [ ] **Add OG image** (`public/og.png`, 1200×630) — brand name, headline, background, photo — and wire into `layout.tsx` metadata — 1.5 hrs
- [ ] **Add `skip-to-main` link** in `layout.tsx` for a11y — 20 min
- [ ] **Upgrade weROI spotlight image** — take a proper Playwright screenshot of weroi.net at 1280px wide, compress to WebP — 30 min
- [ ] **Fix weROI/PNTCOG/bot metrics** — replace "Multi-step / JWT-ready / Resend" with real outcome numbers: e.g. leads captured, pages served, uptime, users — 1 hr
- [ ] **Add per-page `generateMetadata`** to `app/projects/[slug]/page.tsx` and `app/blog/[slug]/page.tsx` if missing — 1.5 hrs
- [ ] **Hoist blog post titles** — The top 6 on homepage are generic ("CSS Grid vs Flexbox"). Move project-specific posts (telegram-fastapi, weroi-platform, jwt-admin-without-drama) to front — 20 min

### Phase 2 — Structure (est. 12–18 hrs)
*Trim homepage, add Domus, sharpen conversion.*

- [ ] **Cut homepage from 14 to 9 sections** — Remove or merge: LaptopScroll OR DevParallax (keep the better one), remove one of the two About layers (`About.tsx` OR `AboutNarrative.tsx`), remove Services from homepage (it's a separate route). Target: Hero → SkillsMarquee → Spotlight/Projects → About+Skills → Achievements → Blog (3 posts) → HireCTA → Contact — 3 hrs
- [ ] **Services page review** — Either rename it "How I Work" (which tells a story) or redirect it to case studies. The current framing sounds like a freelance agency, not a developer with personality — 2 hrs
- [ ] **Add Domus case study** — Write `content/case-studies/domus.ts` + add to project grid with Vercel URL, Playwright screenshots of key sections — 3 hrs
- [ ] **Improve hero text hierarchy** — The current "Hello / i'm / ZACHARY / HUTTON / a / [typewriter]" is 5 layers. Collapse to 3: Name (large), Role (typewriter), one punchy descriptor + CTAs. Ditch "Hello" and "i'm a" — they're filler — 1.5 hrs
- [ ] **Implement lazy loading for Three.js** — Wrap `@react-three/fiber` components in `dynamic(() => import(...), { ssr: false })`. Same for shader components. Only load when the section is in viewport — 3 hrs
- [ ] **Add custom domain** — Get `zacharyhutton.dev` or similar; add to Vercel, update `metadataBase` in `layout.tsx` — 1 hr (excluding domain purchase)
- [ ] **Harden contact form** — Add `zod` (or at least HTML5 validation), rate-limit on the API route if one exists, honeypot field — 2 hrs

### Phase 3 — Polish (est. 10–14 hrs)
*Case study depth, motion choreography, brand refinement.*

- [ ] **Case study depth: weROI** — Add architecture diagram (even SVG), before/after screenshot of funnel flow, 1 concrete outcome stat — 2 hrs
- [ ] **Case study depth: Telegram bot** — Add a GIF or video of the bot in action; live link to @zachtedem_bot already exists but nothing visual on the page — 1.5 hrs
- [ ] **Motion hierarchy** — Audit which FX components are on the critical path vs scroll-revealed. CustomCursor + FloatingIconField + TiltPhoto in the hero should choreograph; marquee should start at 0.5s; DevParallax should start much later. Currently every effect fires simultaneously — 3 hrs
- [ ] **Northern Elite case study** — Once domain or Vercel preview URL is confirmed, add as a third design/frontend piece alongside Domus — 2 hrs
- [ ] **Blog voice audit** — The generic tutorial posts (CSS Grid, TypeScript Generics) weaken the "I'm a working developer" signal. Front-load the Jamaica/real-project posts; add 2–3 posts with clear personal voice. Consider adding an estimated read time and a photo to each post header — 3 hrs
- [ ] **Light mode** — Quick audit of light mode (`html.light`); it exists in CSS but needs visual QA pass — reported Vercel deploy colors on light mode need spot-check — 1.5 hrs
- [ ] **Reduce bundle size** — Remove `ogl` if not actively used (OGL is for raw WebGL; if you're already using Three.js you don't need both). Audit whether `@paper-design/shaders-react` is in actual use on any deployed route or just imported — 2 hrs

---

## Notes on What NOT to Change

- Keep the electric indigo (#1500ff) — distinctive and memorable when used with discipline
- Keep Anton condensed headline — the oversized uppercase name in the hero is a strong identity signal
- Keep the dark-first palette — don't swap to light default
- Keep `DM_Sans` + `Syne` + `IBM_Plex_Mono` font stack — it's expressive without being gimmicky
- Keep the resume modal + PDF generation — that's a real differentiator for developer portfolios
- Keep the 23 blog posts — the volume is a good signal, even if some need to be resequenced

---

## Estimated Timeline to A-Grade

| Phase | Hours | Expected grade after |
|-------|-------|---------------------|
| Phase 1 (Quick wins) | 6–10 hrs | **B** (70/100) |
| Phase 1 + 2 | 18–28 hrs | **B+/A-** (82/100) |
| All 3 phases | 28–42 hrs | **A** (90+/100) |

---

*Do not implement until Zachary picks a phase. This file is audit + plan only.*
