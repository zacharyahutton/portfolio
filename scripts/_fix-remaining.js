const fs = require("fs");
const path = require("path");
const m = path.join(__dirname, "..", "public", "revox-mirror", "revox.baseecom.com");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "wp-content" || name === "wp-includes") continue;
      walk(full, out);
    } else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const expMap = [
  ["XYZ Innovations", "weROI"],
  ["GlobalSoft Inc", "WehFiGo"],
  ["PixelForge Labs", "Domus"],
  ["CloudBridge Co", "Northern Elite"],
  ["NeuroNet Systems", "PNTCOG"],
  ["DataPulse Agency", "DevOS"],
  ["CreativeMinds Studio", "weROI"],
  ["FutureVision Apps", "PNTCOG"],
  ["BlueWave Media", "Independent"],
  ["RedRocket Studios", "Domus"],
  ["SilverLine Creatives", "WehFiGo"],
];

for (const file of walk(m)) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = html.replace(/--theme:\s*#1500ff/gi, "--theme: #BFF747");
  html = html.replace(/#1500ff/gi, "#BFF747");
  for (const [from, to] of expMap) {
    html = html.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), to);
  }
  // Ensure Hire Me links go to contact form
  html = html.replace(
    /<a href="mailto:[^"]+" class="theme-btn">Hire Me/g,
    (m0, offset, str) => {
      const depth = path
        .relative(m, path.dirname(file))
        .split(path.sep)
        .filter(Boolean).length;
      const href = depth === 0 ? "./contact-us/index.html" : "../contact-us/index.html";
      return `<a href="${href}" class="theme-btn">Hire Me`;
    }
  );
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log("fixed", path.relative(m, file));
  }
}

// Contact map → Portmore Jamaica approximate embed (optional soft replace of Melbourne coords text labels only)
const contact = path.join(m, "contact-us", "index.html");
let c = fs.readFileSync(contact, "utf8");
c = c.replace(/Melbourne|Australia|New York|London/gi, "Portmore");
fs.writeFileSync(contact, c);
console.log("contact labels softened");

console.log("done");
