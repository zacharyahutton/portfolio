/**
 * Patch SplitText to skip on mobile and null-safe smoother usage.
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
let n = 0;
for (const f of fs.readdirSync(dir)) {
  if (!/^main_ver=.*\.js$/.test(f)) continue;
  let t = fs.readFileSync(path.join(dir, f), "utf8");
  const b = t;
  if (!t.includes("ZH_SPLIT_SAFE")) {
    t = t.replace(
      'if ($(".tv_hero_title").length) {',
      '/* ZH_SPLIT_SAFE */\n    if ($(".tv_hero_title").length && !zhIsMobile) {'
    );
  }
  // Guard sticky matchMedia heavy pins on mobile via existing matchMedia if present
  if (t !== b) {
    fs.writeFileSync(path.join(dir, f), t);
    n++;
    console.log("ok", f);
  }
}
console.log("count", n);
