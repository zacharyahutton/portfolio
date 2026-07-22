/**
 * Restore desktop animations after MutationObserver freeze was fixed.
 * Keeps: ZH_HDR_STRIP_SAFE (HTML), ZH_ST_REFRESH_GUARD_V4, ZH_SMOOTHER_V5 defer.
 * Removes: early desktop lite return, desktop GSAP skips, desktop preloader kill.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com/wp-content/themes/revox/assets/js"
);

const EARLY_LITE_RE =
  /\$documentOn\.ready\(\s*function\(\)\s*\{\s*window\.__zhDesktopLite[\s\S]*?return;\s*\}\s*/;

const EARLY_REPLACEMENT = `$documentOn.ready( function() {
      /* ZH_MOTION_RESTORE: desktop animations on again; hang was header MutationObserver thrash */
      window.__zhDesktopLite = false;
`;

const PRELOADER_KILL_RE =
  /function preloader\(\)\s*\{\s*\/\* ZH: desktop GSAP preloader[\s\S]*?return;\s*\}\s*function runZhPreloader\(\)\s*\{/;

const PRELOADER_CLEAN = `function preloader() {
        function runZhPreloader() {`;

const SKIP_FW_RE =
  /function feature_work_experience\(\)\s*\{\s*\/\* ZH_DESKTOP_SKIP_FEATURE_WORK \*\/\s*if \(window\.matchMedia\('\(min-width: 992px\)'\)\.matches\) return;/;

const SKIP_FW_CLEAN = `function feature_work_experience() {`;

const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("main_ver=") && f.endsWith(".js"));

let stats = { early: 0, smoother: 0, preloader: 0, fw: 0, liteFalse: 0 };

for (const f of files) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, "utf8");
  let changed = false;

  if (EARLY_LITE_RE.test(s)) {
    s = s.replace(EARLY_LITE_RE, EARLY_REPLACEMENT);
    stats.early++;
    changed = true;
  }

  // Force lite off even if early block already patched differently
  if (s.includes("window.__zhDesktopLite = !window.matchMedia")) {
    s = s.replace(
      /window\.__zhDesktopLite = !window\.matchMedia\('\(max-width: 991px\)'\)\.matches;/g,
      "window.__zhDesktopLite = false; /* ZH_MOTION_RESTORE */"
    );
    stats.liteFalse++;
    changed = true;
  }
  if (s.includes("var zhDesktopLite = !window.matchMedia")) {
    s = s.replace(
      /var zhDesktopLite = !window\.matchMedia\('\(max-width: 991px\)'\)\.matches;\s*window\.__zhDesktopLite = zhDesktopLite;/,
      "var zhDesktopLite = false; /* ZH_MOTION_RESTORE */\n    window.__zhDesktopLite = false;"
    );
    stats.liteFalse++;
    changed = true;
  }

  // Allow ScrollSmoother + SplitText on desktop
  if (s.includes("&& !zhDesktopLite)")) {
    s = s.replace(
      /if \(\$\('#smooth-wrapper'\)\.length && \$\('#smooth-content'\)\.length && !zhDesktopLite\)/,
      "if ($('#smooth-wrapper').length && $('#smooth-content').length)"
    );
    stats.smoother++;
    changed = true;
  }

  if (PRELOADER_KILL_RE.test(s)) {
    s = s.replace(PRELOADER_KILL_RE, PRELOADER_CLEAN);
    stats.preloader++;
    changed = true;
  }

  if (SKIP_FW_RE.test(s)) {
    s = s.replace(SKIP_FW_RE, SKIP_FW_CLEAN);
    stats.fw++;
    changed = true;
  }

  // Soften pin guards: remove __zhDesktopLite early returns (flags are false now anyway)
  // Keep deferred setTimeout pins as-is.

  if (changed) {
    fs.writeFileSync(fp, s);
    console.log("patched", f);
  } else {
    console.log("noop", f);
  }
}

console.log(JSON.stringify(stats));
