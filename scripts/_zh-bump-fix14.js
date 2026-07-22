const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "public", "revox-mirror", "revox.baseecom.com");
function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (e.name.endsWith(".html")) a.push(p);
  }
  return a;
}
let n = 0;
for (const f of walk(root)) {
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("zhfix13") && !t.includes("zhfix12")) continue;
  const o = t;
  t = t.replace(/zhfix1[23]/g, "zhfix14");
  if (t !== o) {
    fs.writeFileSync(f, t);
    n++;
  }
}
console.log("bumped", n);
