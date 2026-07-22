# DevOS Lessons: Revox portfolio go-live fix pass

**Date:** 2026-07-22  
**Repo:** `Documents/PORTFOLIO`  
**Serve path:** `public/revox-mirror/revox.baseecom.com/` via Next.js `beforeFiles` rewrites

## What broke

| Symptom | Root cause |
|---|---|
| Desktop blank / broken, phone OK | ScrollSmoother + SplitText set hero chars / images to `opacity:0`; if smoother init fails or ScrollTrigger scroller mismatches, content never reveals. Header hide classes + MutationObserver fights added noise. Stale `next dev` can also serve old React `src/app` instead of mirror rewrites. |
| Preloader shows "Revox" behind Zachary | Most theme CSS builds (`main_ver=*.css` except one) still had `h5.preloader-text::after { content: "Revox" }`. Preloader `background: transparent` let page content show through under the SVG. |
| Mobile menu broken / wrong redirects | Drawer + desktop nav used relative `./` / `../` hrefs. From `/services/seo/` or `/blog/slug/` those resolve to nested 404s. Closed drawer lacked `pointer-events:none`, and scroll-hide (`zh-nav-hidden`) made chrome disappear. |
| Case Study buttons glitch | Hash anchors (`#project-*-case`) inside ScrollSmoother scroll oddly; felt like a glitch instead of navigation. |
| Mobile animations hide content | Heavy GSAP (ScrollSmoother, SplitText opacity 0, pins) runs on small screens; users never see showcase content. |
| Mobile Menu / Back / HOME vanish | Intentional hide-on-scroll on `#zh-mobile-nav`. |
| Desktop header disappears | Theme `zach-header-hide` + ScrollSmoother transform context; fixed header must live outside smoother content. |

## What fixed it

1. **Shared assets** (single source of truth):
   - `/wp-content/uploads/zach/zh-site-fix.css`
   - `/wp-content/uploads/zach/zh-site-fix.js`
2. **Theme CSS:** all `main_ver=*.css` → opaque `#111013` preloader + `content: "Zachary"`.
3. **Theme JS:** skip ScrollSmoother on `max-width:991px`; try/catch create; null-safe `smoother.scrollContainer` / `refresh`; skip SplitText on mobile; preloader failsafe hide at 2.5s.
4. **Nav:** sitewide root-absolute paths (`/about-me/`, `/services/seo/`, …) in desktop menu + `DRAWER_NAV`.
5. **Mobile chrome:** never apply `zh-nav-hidden`; closed drawer `pointer-events:none`.
6. **Case studies:** real pages under `/works/{domus,northern-elite,wehfigo,pntcog,devos}/` (+ existing weroi); portfolio CTAs point there.
7. **Desktop header:** reparent `#header-sticky` to `body`, MutationObserver strips hide classes, `zh-ready` failsafe forces hero visibility after 1.8s.
8. **Perf:** lazy-load below-fold images; faster preloader hide; shorter smoother duration on desktop.

**Script:** `scripts/_zh-go-live-fix.js` (+ `_zh-split-safe.js`).

## Rules for future portfolio / template builds

1. **One serve path.** Mirror HTML under `public/…` + Next rewrites. Never mix React portfolio components with the live mirror. After config changes, kill stale `next dev` and clear `.next`.
2. **Root-absolute nav only** (`/slug/`) for any page that can nest deeper than one level.
3. **Preloader:** opaque fixed inset cover, brand text only, failsafe hide. Grep every CSS build for leftover template brand (`Revox`).
4. **ScrollSmoother is desktop-only.** Mobile: kill smoother, pins, SplitText opacity tricks; prefer static/fade or no motion.
5. **Sticky header:** fixed on `body`, outside smoother; strip hide classes with observer; never rely on transform hide on desktop.
6. **Case studies:** real routes under `/works/{slug}/`, not hash-only anchors inside smoother.
7. **Mobile chrome:** Menu + Back + HOME always visible. No hide-on-scroll.
8. **Verify live with curl** for `smooth-wrapper`, `zh-site-fix`, abs nav, and zero preloader `Revox` before calling it done.
9. **No em dashes** in user-facing copy (workspace `no-prose-dashes` rule).

## Gold-standard checklist (quick)

- [ ] `curl /` returns Revox mirror HTML (not React shell)
- [ ] Grep: no `content: "Revox"` in theme CSS; preloader text Zachary
- [ ] Desktop header fixed and visible while scrolling
- [ ] Mobile drawer opens; SERVICES/MORE expand; links work from `/blog/x/` and `/services/x/`
- [ ] Case Study → `/works/...` 200
- [ ] Mobile: no ScrollSmoother; titles visible without waiting for GSAP
