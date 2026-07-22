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
    else if (ent.name.endsWith(".html")) out.push(p);
  }
  return out;
}

let renamed = 0;
let hireFixed = 0;
let cache = 0;
let changedFiles = 0;

for (const file of walk(root)) {
  let t = fs.readFileSync(file, "utf8");
  const orig = t;

  if (t.includes('class="mobile-menu fix mb-3"')) {
    t = t.split('class="mobile-menu fix mb-3"').join('class="mobile-menus fix mb-3"');
    renamed++;
  }

  const beforeHire = t;
  t = t.replace(
    /(href="\/hire-me\/">Hire Me<\/a><\/li>)\s*<li><a href="\/hire-me\/">Hire Me<\/a><\/li>/g,
    "$1"
  );
  if (t !== beforeHire) hireFixed++;

  if (t.includes("zhfix11")) {
    t = t.split("zhfix11").join("zhfix12");
    cache++;
  }

  if (t !== orig) {
    fs.writeFileSync(file, t);
    changedFiles++;
  }
}

console.log(
  JSON.stringify({ changedFiles, renamed, hireFixed, cache }, null, 2)
);
