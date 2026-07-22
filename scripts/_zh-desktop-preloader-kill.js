/**
 * Desktop-only: skip GSAP preloader timeline (freezes PC tabs).
 * Mobile path unchanged. Also skip feature_work_experience on desktop.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com/wp-content/themes/revox/assets/js"
);

const DESKTOP_PRELOADER = `     function preloader() {
        /* ZH: desktop GSAP preloader timeline freezes the tab (loading loop).
           Mobile keeps the Revox SVG wave path unchanged. */
        if (window.matchMedia('(min-width: 992px)').matches) {
          function zhDesktopKillPreloader() {
            if (window.__zhPreloaderRan) return;
            window.__zhPreloaderRan = true;
            try {
              var p = document.querySelector(".preloader");
              if (p) {
                p.classList.add("zh-preloader-done", "is-hidden");
                p.style.setProperty("display", "none", "important");
                p.style.setProperty("opacity", "0", "important");
                p.style.setProperty("visibility", "hidden", "important");
                p.style.setProperty("z-index", "-1", "important");
                p.style.setProperty("pointer-events", "none", "important");
              }
              document.querySelectorAll(".animated-image").forEach(function (img) {
                img.style.opacity = "1";
                img.style.visibility = "visible";
                img.style.transform = "none";
              });
              document.querySelectorAll(".tv_hero_title").forEach(function (el) {
                el.style.opacity = "1";
                el.style.visibility = "visible";
              });
            } catch (e) {}
          }
          setTimeout(zhDesktopKillPreloader, 500);
          $(window).on("load", zhDesktopKillPreloader);
          setTimeout(zhDesktopKillPreloader, 2500);
          return;
        }
        function runZhPreloader() {`;

const OLD_START = `     function preloader() {
        function runZhPreloader() {`;

const files = fs.readdirSync(dir).filter((f) => f.startsWith("main_ver=") && f.endsWith(".js"));
let patched = 0;
let skipped = 0;

for (const f of files) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, "utf8");
  let changed = false;

  if (s.includes("zhDesktopKillPreloader")) {
    skipped++;
  } else if (s.includes(OLD_START)) {
    s = s.replace(OLD_START, DESKTOP_PRELOADER);
    changed = true;
  } else {
    console.warn("NO_MATCH preloader:", f);
  }

  // Skip feature work experience circular/swiper stack on desktop
  if (
    s.includes("function feature_work_experience()") &&
    !s.includes("ZH_DESKTOP_SKIP_FEATURE_WORK")
  ) {
    s = s.replace(
      "function feature_work_experience() {",
      `function feature_work_experience() {
    /* ZH_DESKTOP_SKIP_FEATURE_WORK */
    if (window.matchMedia('(min-width: 992px)').matches) return;`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, s);
    patched++;
    console.log("patched", f);
  }
}

console.log(JSON.stringify({ patched, skipped, total: files.length }));
