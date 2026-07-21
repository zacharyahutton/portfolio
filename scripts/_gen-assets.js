const fs = require("fs");
const path = require("path");

function cover(title, accent = "#BFF747") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750" fill="none">
  <rect width="1200" height="750" fill="#0B0E13"/>
  <rect x="0" y="0" width="1200" height="750" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#1500ff" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <rect x="80" y="90" width="720" height="420" rx="12" fill="#12141a" stroke="#2a2d36"/>
  <rect x="110" y="120" width="660" height="36" rx="6" fill="#1a1d26"/>
  <circle cx="128" cy="138" r="6" fill="#ff5f57"/>
  <circle cx="148" cy="138" r="6" fill="#febc2e"/>
  <circle cx="168" cy="138" r="6" fill="#28c840"/>
  <rect x="110" y="180" width="280" height="14" rx="4" fill="${accent}" fill-opacity="0.7"/>
  <rect x="110" y="210" width="520" height="10" rx="3" fill="#2a2d36"/>
  <rect x="110" y="232" width="460" height="10" rx="3" fill="#2a2d36"/>
  <rect x="110" y="254" width="400" height="10" rx="3" fill="#2a2d36"/>
  <rect x="110" y="300" width="200" height="120" rx="8" fill="#1500ff" fill-opacity="0.35"/>
  <rect x="330" y="300" width="200" height="120" rx="8" fill="${accent}" fill-opacity="0.2"/>
  <rect x="550" y="300" width="200" height="120" rx="8" fill="#ffffff" fill-opacity="0.06"/>
  <text x="80" y="620" fill="#ffffff" font-family="Arial,sans-serif" font-size="42" font-weight="700">${title}</text>
  <text x="80" y="660" fill="#9a9aa3" font-family="Arial,sans-serif" font-size="18">Zachary Hutton · Live build</text>
</svg>`;
}

function mark(label, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#12141a" stroke="#2a2d36"/>
  <text x="32" y="38" text-anchor="middle" fill="${color}" font-family="Arial,sans-serif" font-size="14" font-weight="700">${label}</text>
</svg>`;
}

const root = path.join(__dirname, "..", "public");
const dirs = [
  path.join(root, "case-studies"),
  path.join(root, "brand"),
  path.join(root, "blog-covers"),
  path.join(root, "zach"),
];
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

const cases = [
  ["domus-cover.svg", "Domus"],
  ["wehfigo-cover.svg", "WehFiGo"],
  ["northern-elite-cover.svg", "Northern Elite"],
  ["weroi-cover.svg", "weROI"],
  ["pntcog-cover.svg", "PNTCOG"],
];
cases.forEach(([f, t]) => fs.writeFileSync(path.join(root, "case-studies", f), cover(t)));

const brands = [
  ["domus-mark.svg", "DM", "#BFF747"],
  ["wehfigo-mark.svg", "WF", "#BFF747"],
  ["northern-elite-mark.svg", "NE", "#BFF747"],
  ["weroi-mark.svg", "WR", "#1500ff"],
  ["pntcog-mark.svg", "PN", "#d4a843"],
];
brands.forEach(([f, l, c]) => fs.writeFileSync(path.join(root, "brand", f), mark(l, c)));

const blogs = [
  "css-grid","typescript","react-rsc","api","debug","vitals","cors","weroi","pntcog","webhook","jwt","portfolio","fastapi","deploy","openapi","sqlite","security","jamaica","llm","mongo","email","utech","telegram"
];
blogs.forEach((id) => {
  fs.writeFileSync(path.join(root, "blog-covers", `${id}.svg`), cover(id.replace(/-/g, " ").toUpperCase()));
});

// Zachary wordmark replacing Revox leaf+revox
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="32" viewBox="0 0 160 32" fill="none">
  <path d="M8 4h10c1.5 0 2.5 1.5 1.8 2.8L14 16l5.8 9.2c.7 1.3-.3 2.8-1.8 2.8H8c-1.5 0-2.5-1.5-1.8-2.8L12 16 6.2 6.8C5.5 5.5 6.5 4 8 4z" fill="#BFF747"/>
  <path d="M20 4h8v8h-4l6 16h-8l-4-10.5L14 28H6l6-16h-4V4h8z" fill="#BFF747"/>
  <text x="42" y="22" fill="#fff" font-family="Kanit,Arial,sans-serif" font-size="18" font-weight="600">zachary</text>
</svg>`;
fs.writeFileSync(path.join(root, "zach", "logo-zachary.svg"), logo);

const markZh = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <path d="M8 6h10c1.5 0 2.5 1.5 1.8 2.8L14 18l5.8 9.2c.7 1.3-.3 2.8-1.8 2.8H8c-1.5 0-2.5-1.5-1.8-2.8L12 18 6.2 8.8C5.5 7.5 6.5 6 8 6z" fill="#BFF747"/>
  <path d="M22 6h10v8H28l6 16h-8l-4-10  -4 10h-8l6-16h-4V6h8z" fill="#BFF747"/>
</svg>`;
fs.writeFileSync(path.join(root, "zach", "mark-zh.svg"), markZh);

console.log("covers+brands+logo written");
