const fs = require("fs");
const path = require("path");
const m = path.join(__dirname, "..", "public", "revox-mirror", "revox.baseecom.com");

function show(file, re) {
  const html = fs.readFileSync(path.join(m, file), "utf8");
  let i = 0;
  let n = 0;
  const r = new RegExp(re, "gi");
  let match;
  while ((match = r.exec(html)) && n < 8) {
    const start = Math.max(0, match.index - 60);
    console.log(file, "=>", JSON.stringify(html.slice(start, match.index + match[0].length + 40)));
    n++;
  }
  if (!n) console.log(file, re, "NONE");
}

show("index.html", "hire me");
show("index.html", "1500ff");
show("about-me/index.html", "SilverLine|NeuroNet");
show("about-me/index.html", "hire me");
show("contact-us/index.html", "1M");
