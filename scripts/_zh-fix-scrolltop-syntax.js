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
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

const bad = "scrollTop()100";
const good = "scrollTop()>100";
let n = 0;
for (const f of walk(root)) {
  let s = fs.readFileSync(f, "utf8");
  if (!s.includes(bad)) continue;
  fs.writeFileSync(f, s.split(bad).join(good));
  n += 1;
  console.log("fixed", path.relative(root, f));
}
console.log("done", n);
