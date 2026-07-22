const fs = require("fs");
const html = fs.readFileSync(
  "public/revox-mirror/revox.baseecom.com/index.html",
  "utf8"
);
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let i = 0;
let m;
while ((m = re.exec(html))) {
  i++;
  const attrs = m[1] || "";
  if (/\bsrc\s*=/.test(attrs)) continue;
  const code = m[2];
  if (!code.trim()) continue;
  try {
    new Function(code);
    console.log("inline", i, "OK", code.length, attrs.slice(0, 40));
  } catch (e) {
    console.log("inline", i, "FAIL", e.message);
    const lines = code.split(/\n/);
    console.log("first line", lines[0].slice(0, 120));
    // find rough location
    for (let li = 0; li < lines.length; li++) {
      try {
        new Function(lines.slice(0, li + 1).join("\n"));
      } catch (e2) {
        console.log("fails by line", li + 1, lines[li].slice(0, 160));
        break;
      }
    }
  }
}
