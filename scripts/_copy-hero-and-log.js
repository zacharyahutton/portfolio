const fs = require("fs");
const path = require("path");

const src = path.join(
  process.env.USERPROFILE,
  ".cursor",
  "projects",
  "c-Users-EverybodyHatesA1one-Documents-PORTFOLIO",
  "assets",
  "c__Users_EverybodyHatesA1one_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Adobe_Express_-_file-fc09eb62-36b0-4b0b-aeb3-be80ac7ad77d.png"
);
const destDir = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com",
  "wp-content",
  "uploads",
  "zach"
);
fs.mkdirSync(destDir, { recursive: true });
fs.mkdirSync(path.join(__dirname, "..", "public", "zach"), { recursive: true });

if (!fs.existsSync(src)) {
  console.error("SRC_MISSING", src);
  process.exit(1);
}
for (const name of ["hero-zach-full.png", "hero-zach.png"]) {
  fs.copyFileSync(src, path.join(destDir, name));
}
fs.copyFileSync(src, path.join(__dirname, "..", "public", "zach", "zachary-hutton-hero.png"));
console.log("OK", fs.statSync(path.join(destDir, "hero-zach-full.png")).size);

const recent = path.join(
  process.env.USERPROFILE,
  "Documents",
  "_shared-brain",
  "RECENT.md"
);
fs.appendFileSync(
  recent,
  "\n2026-07-20 | [PORTFOLIO] | CORRECTED Revox-only: reverted React rebuild; content patches in revox-mirror; preview localhost:3002 (kill stale :3000 if needed); not pushed\n"
);
console.log("RECENT appended");
