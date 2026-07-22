/**
 * 1) Remove theme scroll-scrub on work circle (click spin lives in zh-site-fix).
 * 2) Bump mobile smoothTouch to match snappy desktop feel.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com/wp-content/themes/revox/assets/js"
);

const SCRUB_RE =
  /\/\*\s*=+\s*GSAP Scroll Rotation\s*=+\s*\*\/\s*gsap\.registerPlugin\(ScrollTrigger\);\s*gsap\.to\(\s*"\.feature-work-experience-preview-slider \.swiper-wrapper"\s*,\s*\{[\s\S]*?\}\);\s*/g;

const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("main_ver=") && f.endsWith(".js"));

let scrub = 0;
let touch = 0;

for (const f of files) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, "utf8");
  const before = s;

  if (SCRUB_RE.test(s)) {
    s = s.replace(
      SCRUB_RE,
      "/* ZH_CIRCLE_SPIN: click/arrow spin handled in zh-site-fix.js */\n"
    );
    scrub++;
  }

  if (s.includes("smoothTouch: 0.1,")) {
    s = s.replace(
      /smoothTouch:\s*0\.1,/g,
      "smoothTouch: 0.28, /* ZH_MOTION_FAST mobile */"
    );
    touch++;
  }

  if (s !== before) {
    fs.writeFileSync(fp, s);
    console.log("patched", f);
  } else {
    console.log("noop", f);
  }
}

console.log(JSON.stringify({ scrub, touch, total: files.length }));
