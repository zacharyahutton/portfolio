# DevOS Lessons: Revox portfolio go-live fix pass

**Date:** 2026-07-22  
**Repo:** `Documents/PORTFOLIO`  
**Serve path:** `public/revox-mirror/revox.baseecom.com/` via Next.js `beforeFiles` rewrites

## What broke

| Symptom | Root cause |
|---|---|
| Desktop blank / broken, phone OK | ScrollSmoother + SplitText set hero chars / images to `opacity:0`; if smoother init fails or ScrollTrigger scroller mismatches, content never reveals. Header hide classes + MutationObserver fights added noise. Stale `next dev` can also serve old React `src/app` instead of mirror rewrites. |
| Desktop infinite loading loop, mobile fine | Inline `zh-header-ux` desktop block: `MutationObserver` on `#header-sticky` `class`/`style` whose `strip()` mutates those same attributes → main-thread freeze. Mobile early-returns before that observer. Fix: scroll/interval strip only (`ZH_HDR_STRIP_SAFE`). Also skip GSAP preloader timeline on desktop (`zhDesktopKillPreloader`). |
| Preloader shows "Revox" behind Zachary | Most theme CSS builds (`main_ver=*.css` except one) still had `h5.preloader-text::after { content: "Revox" }`. Preloader `background: transparent` let page content show through under the SVG. |
| Mobile menu broken / wrong redirects | Drawer + desktop nav used relative `./` / `../` hrefs. From `/services/seo/` or `/blog/slug/` those resolve to nested 404s. Closed drawer lacked `pointer-events:none`, and scroll-hide (`zh-nav-hidden`) made chrome disappear. |
| Case Study buttons glitch | Hash anchors (`#project-*-case`) inside ScrollSmoother scroll oddly; felt like a glitch instead of navigation. |
| Mobile animations hide content | Heavy GSAP (ScrollSmoother, SplitText opacity 0, pins) runs on small screens; users never see showcase content. |
| Mobile Menu / Back / HOME vanish | Intentional hide-on-scroll on `#zh-mobile-nav`. |
| Desktop header disappears | Theme `zach-header-hide` + ScrollSmoother transform context; fixed header must live outside smoother content. |

## Correction (2026-07-22 evening, v3)

Do **not** gut mobile motion. Over-killing SplitText / forcing `opacity:1 !important` on split lines made text reveal look broken.

| Lesson | Detail |
|---|---|
| Preloader CSS must not lock `display/opacity/transform !important` while playing | That blocked the Revox SVG wave exit. Only force-hide with `.zh-preloader-done`. |
| Preloader must not wait only on `window.load` | Stuck CDN fonts (cdnfonts) can delay load forever. Run wave on load **or** ~2.2s timeout. |
| ScrollTrigger `refresh` → `smoother.refresh()` needs a re-entrancy guard | Unbounded loop freezes the tab (“Page Unresponsive”). |
| Invalid `\u1fac8` in WP emoji loader | 5-hex `\u` escape → `SyntaxError: Unexpected number` sitewide. Fix to 4-digit escapes. |
| Mobile: restore SplitText + light ScrollSmoother | Soften with `smooth:0.65`, `effects:false`, `smoothTouch:0.1`. Do not skip SplitText. |
| Work arrows | Mount beside logo preview (`←` logos `→`), never under the text slider. |
| Old React portfolio | Runtime is thin Next shell + `public/revox-mirror/` only. `backup/` is offline and not served. |
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

## Follow-up 2026-07-22: preloader stuck + over-killed mobile motion
- Root cause PC stuck: `.preloader { display:flex !important }` beat inline `display:none` failsafes without `.zh-preloader-done` class
- Fix: CSS only applies flex when `:not(.zh-preloader-done)`; JS always adds class + setProperty important; multi timeout failsafes
- User still wants highlight pop after load and work slider arrows on mobile; do not kill all wow/GSAP on mobile, only ScrollSmoother + pins
- Social icons need compact wrap on mobile
