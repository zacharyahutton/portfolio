const fs = require("fs");
const path = require("path");

const a =
  "C:/Users/EverybodyHatesA1one/.cursor/projects/c-Users-EverybodyHatesA1one-Documents-PORTFOLIO/assets";
console.log(
  "assets",
  fs.existsSync(a)
    ? fs.readdirSync(a).filter((f) => /\.(png|jpg|webp)$/i.test(f))
    : "MISSING"
);

const m =
  "C:/Users/EverybodyHatesA1one/Documents/PORTFOLIO/public/revox-mirror/revox.baseecom.com";
console.log(
  "dirs",
  fs
    .readdirSync(m)
    .filter((x) => fs.statSync(path.join(m, x)).isDirectory())
    .join(", ")
);

const z = path.join(m, "wp-content/uploads/zach");
console.log(
  "zach files",
  fs.existsSync(z) ? fs.readdirSync(z).join(", ") : "missing"
);

function countIn(file, patterns) {
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, "utf8");
  console.log("\n==", path.relative(m, file));
  for (const c of patterns) {
    const n = (html.match(new RegExp(c, "gi")) || []).length;
    if (n) console.log(" ", c, n);
  }
}

const patterns = [
  "Pixelr",
  "1M",
  "teachable",
  "THEN YOU",
  "Then you",
  "hire me",
  "Hire Me",
  "REVOX",
  "t\\.me",
  "CSEC",
  "SilverLine",
  "NeuroNet",
  "1500ff",
  "Shikhon",
  "Invoca",
  "ShipBob",
  "hi\\.revox",
  "Fashion Model",
  "UNLOCKING",
  "Telegram",
];

countIn(path.join(m, "index.html"), patterns);
for (const page of [
  "blog",
  "contact-us",
  "about-me",
  "services",
  "portfolio-page",
  "portfolio-grid",
  "web-developer",
  "graphic-designer",
  "fashion-model",
  "our-faq",
]) {
  countIn(path.join(m, page, "index.html"), patterns);
}
