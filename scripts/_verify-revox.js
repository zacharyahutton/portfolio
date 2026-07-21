const fs = require("fs");
const path = require("path");

const m = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com"
);

function visibleChecks(file) {
  const html = fs.readFileSync(file, "utf8");
  const bad = [];
  const tests = [
    [/>REVOX</i, ">REVOX<"],
    [/preloader-text">REVOX/i, "preloader REVOX"],
    [/>hire me</i, "lowercase hire me"],
    [/Then you're in the right place/i, "THEN YOU CTA"],
    [/Pixelr/i, "Pixelr"],
    [/teachable/i, "teachable"],
    [/hi\.revox/i, "hi.revox"],
    [/t\.me\//i, "telegram"],
    [/CSEC/i, "CSEC"],
    [/#1500ff/i, "blue accent"],
    [/Trusted by 1M|>1M</i, "1M"],
    [/Fashion Model/i, "Fashion Model"],
    [/UNLOCKING SCALABLE/i, "UNLOCKING"],
    [/Shikhon/i, "Shikhon"],
    [/SilverLine/i, "SilverLine"],
    [/NeuroNet/i, "NeuroNet"],
    [/8 years of expertise/i, "8 years"],
  ];
  for (const [re, label] of tests) {
    if (re.test(html)) bad.push(label);
  }
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
];

for (const p of pages) {
  const f = path.join(m, p);
  if (!fs.existsSync(f)) {
    console.log(p, "MISSING");
    continue;
  }
  const bad = visibleChecks(f);
  console.log(p + ":", bad.length ? bad.join(", ") : "OK");
}

const idx = fs.readFileSync(path.join(m, "index.html"), "utf8");
console.log("Hire Me tags", (idx.match(/>Hire Me</g) || []).length);
console.log(
  "preloader",
  (idx.match(/preloader-text">[^<]+/) || [])[0]
);
console.log("cta premium", idx.includes("Need a premium"));
console.log(
  "weroi founder",
  fs
    .readFileSync(path.join(m, "works/weroi/index.html"), "utf8")
    .includes("Founder")
);

// CSS blue check
const cssDir = path.join(
  m,
  "wp-content/themes/revox/assets/css"
);
let blue = 0;
for (const f of fs.readdirSync(cssDir)) {
  if (!f.startsWith("main")) continue;
  const c = fs.readFileSync(path.join(cssDir, f), "utf8");
  blue += (c.match(/#1500ff/gi) || []).length;
}
console.log("css #1500ff remaining", blue);
