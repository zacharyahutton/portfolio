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
  if (/\bsrc\s*=/.test(m[1] || "")) continue;
  const code = m[2];
  if (!code.trim()) continue;
  try {
    new Function(code);
  } catch (e) {
    if (!/Unexpected number/.test(e.message)) continue;
    console.log("attrs", m[1]);
    console.log("len", code.length);
    const start = code.search(/\S/);
    console.log(
      "codes",
      [...code.slice(start, start + 40)].map((c) => c.charCodeAt(0))
    );
    console.log("snippet", JSON.stringify(code.slice(start, start + 120)));
  }
}
