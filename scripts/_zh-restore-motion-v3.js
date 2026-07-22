/**
 * Restore Revox motion across all theme main_ver JS builds:
 * - ScrollSmoother on all viewports (lighter on mobile)
 * - SplitText on mobile again
 * - Circle logo orbit desktop-only (mobile uses strip + CSS)
 * - Preloader failsafe at 5.5s only if still stuck
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com",
  "wp-content",
  "themes",
  "revox",
  "assets",
  "js"
);

const OLD_SMOOTH = `    // Initialize ScrollSmoother
    /* ZH_MOBILE_SMOOTH_SKIP */
    var zhIsMobile = window.matchMedia('(max-width: 991px)').matches;
    let smoother = null;
    if (!zhIsMobile) {
      try {
        smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
        smoothTouch: 0,
        normalizeScroll: false,
        ignoreMobileResize: true,
    });
      } catch (zhErr) { console.warn('ScrollSmoother skipped', zhErr); }
    } else {
      try { $('#smooth-wrapper, #smooth-content').css({height:'auto',overflow:'visible',transform:'none'}); } catch(e){}
    }

    // After smoother initialized, run SplitText animations
    /* ZH_SPLIT_SAFE */
    if ($(".tv_hero_title").length && !zhIsMobile) {`;

const NEW_SMOOTH = `    // Initialize ScrollSmoother (full motion; lighter on mobile)
    /* ZH_SMOOTHER_V3 */
    var zhIsMobile = window.matchMedia('(max-width: 991px)').matches;
    let smoother = null;
    try {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: zhIsMobile ? 0.65 : 1.05,
        effects: !zhIsMobile,
        smoothTouch: zhIsMobile ? 0.1 : 0,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });
    } catch (zhErr) { console.warn('ScrollSmoother skipped', zhErr); }

    // After smoother initialized, run SplitText animations (desktop + mobile)
    /* ZH_SPLIT_V3 */
    if ($(".tv_hero_title").length) {`;

const OLD_FAILSAFE = `  /* ZH_PRELOADER_FAST */
  setTimeout(function(){ try { var p=document.querySelector('.preloader'); if(p){ p.classList.add('zh-preloader-done','is-hidden'); p.style.setProperty('display','none','important'); p.style.setProperty('z-index','-1','important'); p.style.setProperty('opacity','0','important'); p.style.setProperty('pointer-events','none','important'); } } catch(e){} }, 1800);`;

const NEW_FAILSAFE = `  /* ZH_PRELOADER_FAILSAFE_V3 — only if stuck after full wave (~5.5s) */
  setTimeout(function(){ try { var p=document.querySelector('.preloader'); if(!p||p.classList.contains('zh-preloader-done')) return; var cs=window.getComputedStyle(p); if(cs.display==='none'||Number(cs.opacity)<0.05){ p.classList.add('zh-preloader-done','is-hidden'); return; } p.classList.add('zh-preloader-done','is-hidden'); p.style.setProperty('display','none','important'); p.style.setProperty('z-index','-1','important'); p.style.setProperty('opacity','0','important'); p.style.setProperty('pointer-events','none','important'); } catch(e){} }, 5500);`;

const OLD_CIRCLE = `    if ($(".feature-work-experience-preview-slider").length) {

        const $wrapper = document.querySelector(".feature-work-experience-preview-slider .swiper-wrapper");
        const $slides = $wrapper.querySelectorAll(".swiper-slide");`;

const NEW_CIRCLE = `    if ($(".feature-work-experience-preview-slider").length && window.matchMedia('(min-width: 992px)').matches) {

        const $wrapper = document.querySelector(".feature-work-experience-preview-slider .swiper-wrapper");
        if (!$wrapper) return;
        const $slides = $wrapper.querySelectorAll(".swiper-slide");`;

const files = fs.readdirSync(dir).filter((f) => f.startsWith("main_ver=") && f.endsWith(".js"));
let ok = 0;
for (const f of files) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  let n = 0;
  if (s.includes(OLD_SMOOTH)) {
    s = s.replace(OLD_SMOOTH, NEW_SMOOTH);
    n++;
  } else if (s.includes("ZH_SMOOTHER_V3")) {
    // already patched
  } else if (s.includes("ZH_MOBILE_SMOOTH_SKIP")) {
    console.warn("SMOOTH block mismatch:", f);
  }
  if (s.includes(OLD_FAILSAFE)) {
    s = s.replace(OLD_FAILSAFE, NEW_FAILSAFE);
    n++;
  } else if (s.includes("ZH_PRELOADER_FAILSAFE_V3")) {
    // ok
  } else if (s.includes("ZH_PRELOADER_FAST")) {
    console.warn("FAILSAFE block mismatch:", f);
  }
  if (s.includes(OLD_CIRCLE)) {
    s = s.replace(OLD_CIRCLE, NEW_CIRCLE);
    n++;
  }
  // Also mark done when timeline hides preloader
  if (!s.includes("ZH_PRELOADER_ONCOMPLETE_V3") && s.includes('.set(".preloader", { display: "none", zIndex: -1 })')) {
    s = s.replace(
      '.set(".preloader", { display: "none", zIndex: -1 })',
      '.set(".preloader", { display: "none", zIndex: -1 }).add(function(){ try { var p=document.querySelector(".preloader"); if(p){ p.classList.add("zh-preloader-done","is-hidden"); } } catch(e){} }) /* ZH_PRELOADER_ONCOMPLETE_V3 */'
    );
    n++;
  }
  fs.writeFileSync(p, s);
  ok++;
  console.log(f, "patches~", n);
}
console.log("Updated", ok, "files");
