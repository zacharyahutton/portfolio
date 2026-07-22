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

const NEW = `    // ZH: never call smoother.refresh() from ScrollTrigger "refresh" —
    // that re-entrancy freezes desktop when many pins exist. ScrollSmoother syncs itself.
    /* ZH_ST_REFRESH_GUARD_V4 */`;

const re =
  /\/\/ Update ScrollTrigger when smoother refreshes[\s\S]*?zhStRefreshing = false;\s*\}\);/;

let n = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith("main_ver=") || !f.endsWith(".js")) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (s.includes("ZH_ST_REFRESH_GUARD_V4")) {
    console.log("already", f);
    continue;
  }
  if (!re.test(s)) {
    console.log("NO MATCH", f);
    continue;
  }
  s = s.replace(re, NEW);
  fs.writeFileSync(p, s);
  n += 1;
  console.log("patched", f);
}
console.log("done", n);
