const fs = require("fs");
const path = require("path");

const root = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com"
);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(root);
let htmlN = 0;
let jsN = 0;

for (const f of files) {
  if (f.endsWith(".html")) {
    let c = fs.readFileSync(f, "utf8");
    const n = c.replace(
      /zh-site-fix\.(css|js)\?v=zhfix\d+/g,
      "zh-site-fix.$1?v=zhfix2"
    );
    if (n !== c) {
      fs.writeFileSync(f, n);
      htmlN++;
    }
  }
  if (/main_ver=.+\.js$/.test(f) && f.includes(`${path.sep}js${path.sep}`)) {
    let c = fs.readFileSync(f, "utf8");
    if (!c.includes("ZH_PRELOADER_FAST")) continue;
    const n = c.replace(
      /setTimeout\(function\(\)\{\s*try\s*\{\s*var p=document\.querySelector\('\.preloader'\);[\s\S]*?\}\s*catch\(e\)\{\}\s*\},\s*2500\);/,
      "setTimeout(function(){ try { var p=document.querySelector('.preloader'); if(p){ p.classList.add('zh-preloader-done','is-hidden'); p.style.setProperty('display','none','important'); p.style.setProperty('z-index','-1','important'); p.style.setProperty('opacity','0','important'); p.style.setProperty('pointer-events','none','important'); } } catch(e){} }, 1800);"
    );
    if (n !== c) {
      fs.writeFileSync(f, n);
      jsN++;
    }
  }
}

console.log(JSON.stringify({ htmlN, jsN }));
