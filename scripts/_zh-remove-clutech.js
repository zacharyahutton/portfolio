const fs = require("fs");
const path = require("path");

const files = [
  path.join(
    __dirname,
    "..",
    "public",
    "revox-mirror",
    "revox.baseecom.com",
    "index.html"
  ),
  path.join(
    __dirname,
    "..",
    "public",
    "revox-mirror",
    "revox.baseecom.com",
    "about-me",
    "index.html"
  ),
];

const re = /\s*<div class="clutech-image">[\s\S]*?<\/div>/g;

for (const f of files) {
  let t = fs.readFileSync(f, "utf8");
  const n = (t.match(re) || []).length;
  t = t.replace(re, "");
  t = t.replace(/zhfix14/g, "zhfix15");
  fs.writeFileSync(f, t);
  console.log(path.basename(path.dirname(f)) + "/" + path.basename(f), "removed", n);
}
