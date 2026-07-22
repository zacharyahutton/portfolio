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

const V5 = `    var zhIsMobile = window.matchMedia('(max-width: 991px)').matches;
    let smoother = null;
    try {
      // ZH_SMOOTHER_V5: desktop hung in sync ScrollSmoother.create (infinite loading).
      // Mobile creates immediately. Desktop defers one frame so preloader can finish.
      var zhSmootherOpts = {
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 0.65,
        effects: false,
        smoothTouch: 0.1,
        normalizeScroll: false,
        ignoreMobileResize: true,
      };
      if (zhIsMobile) {
        smoother = ScrollSmoother.create(zhSmootherOpts);
      } else {
        requestAnimationFrame(function () {
          try {
            smoother = ScrollSmoother.create(zhSmootherOpts);
            try { ScrollTrigger.refresh(); } catch (e2) {}
          } catch (e3) { console.warn('ScrollSmoother deferred skipped', e3); }
        });
      }
    } catch (zhErr) { console.warn('ScrollSmoother skipped', zhErr); }`;

const re =
  /var zhIsMobile = window\.matchMedia\('\(max-width: 991px\)'\)\.matches;[\s\S]*?catch \(zhErr\) \{ console\.warn\('ScrollSmoother skipped', zhErr\); \}/;

let n = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith("main_ver=") || !f.endsWith(".js")) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (!re.test(s)) {
    console.log("NO MATCH", f);
    continue;
  }
  s = s.replace(re, V5);
  fs.writeFileSync(p, s);
  n += 1;
  console.log("patched", f);
}
console.log("done", n);
