const fs = require("fs");
const path = require("path");
const m = path.join(__dirname, "..", "public", "revox-mirror", "revox.baseecom.com");

function check(file) {
  const html = fs.readFileSync(path.join(m, file), "utf8");
  const bad = [];
  // case-sensitive where needed
  if (/>hire me</.test(html)) bad.push("lowercase hire me");
  if (/>REVOX</.test(html)) bad.push("REVOX text");
  if (/preloader-text">REVOX/.test(html)) bad.push("preloader REVOX");
  if (/Then you're in the right place/i.test(html)) bad.push("THEN YOU");
  if (/Pixelr/i.test(html)) bad.push("Pixelr");
  if (/teachable/i.test(html)) bad.push("teachable");
  if (/hi\.revox/i.test(html)) bad.push("hi.revox");
  if (/t\.me\//i.test(html)) bad.push("telegram");
  if (/CSEC/i.test(html)) bad.push("CSEC");
  if (/#1500ff/i.test(html)) bad.push("blue");
  if (/fashion model/i.test(html)) bad.push("Fashion Model");
  if (/Revox »/.test(html)) bad.push("Revox feed");
  if (/revox workflow/i.test(html)) bad.push("revox workflow");
  if (/Revox-Resume/i.test(html)) bad.push("Revox resume");
  if (/UNLOCKING SCALABLE/i.test(html)) bad.push("UNLOCKING");
  if (/Shikhon/i.test(html)) bad.push("Shikhon");
  if (/SilverLine|NeuroNet|PixelForge|XYZ Innovations/i.test(html)) bad.push("fake companies");
  if (/Trusted by 1M|>1M</.test(html)) bad.push("1M");
  if (/modeling journey/i.test(html)) bad.push("modeling journey");
  return bad;
}

const pages = [
  "index.html",
  "blog/index.html",
  "contact-us/index.html",
  "about-me/index.html",
  "services/index.html",
  "portfolio-page/index.html",
  "portfolio-grid/index.html",
  "works/weroi/index.html",
  "web-developer/index.html",
  "graphic-designer/index.html",
  "fashion-model/index.html",
  "our-faq/index.html",
];

let failed = 0;
for (const p of pages) {
  const f = path.join(m, p);
  if (!fs.existsSync(f)) {
    console.log("MISSING", p);
    failed++;
    continue;
  }
  const bad = check(p);
  if (bad.length) {
    console.log("FAIL", p, bad.join(", "));
    failed++;
  } else console.log("OK", p);
}

const idx = fs.readFileSync(path.join(m, "index.html"), "utf8");
console.log("---");
console.log("Hire Me ->", [...idx.matchAll(/href="([^"]+)" class="theme-btn">Hire Me/g)].map((x) => x[1]));
console.log("$399", idx.includes("$399"));
console.log("Custom Plan", idx.includes("Custom Plan"));
console.log("Web Development", idx.includes("Web Development"));
console.log("Trusted by 10+", idx.includes("Trusted by 10+"));
console.log("Domus", idx.includes("Domus"));
console.log("WehFiGo", idx.includes("WehFiGo"));
console.log("Northern Elite", idx.includes("Northern Elite"));
console.log("weROI", /weROI/.test(idx));
console.log("PNTCOG", idx.includes("PNTCOG"));
console.log("theme green", /--theme:\s*#BFF747/i.test(idx));
console.log("FAILED", failed);
process.exit(failed ? 1 : 0);
