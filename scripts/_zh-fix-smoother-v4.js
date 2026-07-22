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

const OLD = `    var zhIsMobile = window.matchMedia('(max-width: 991px)').matches;
    let smoother = null;
    try {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: zhIsMobile ? 0.65 : 1.05,
        effects: false,
        smoothTouch: zhIsMobile ? 0.1 : 0,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });
    } catch (zhErr) { console.warn('ScrollSmoother skipped', zhErr); }`;

const NEW = `    var zhIsMobile = window.matchMedia('(max-width: 991px)').matches;
    let smoother = null;
    try {
      // ZH_SMOOTHER_V4: desktop used to hang in ScrollSmoother.create (loading loop).
      // Use the lighter mobile-safe smoother settings on all viewports; keep effects off.
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 0.65,
        effects: false,
        smoothTouch: zhIsMobile ? 0.1 : 0,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });
    } catch (zhErr) { console.warn('ScrollSmoother skipped', zhErr); }`;

let n = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith("main_ver=") || !f.endsWith(".js")) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (s.includes("ZH_SMOOTHER_V4")) {
    console.log("already", f);
    continue;
  }
  if (!s.includes(OLD)) {
    console.log("NO MATCH", f);
    continue;
  }
  s = s.replace(OLD, NEW);
  fs.writeFileSync(p, s);
  n += 1;
  console.log("patched", f);
}
console.log("done", n);
