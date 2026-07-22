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
const hireLi =
  '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-hire"><a href="/hire-me/">Hire Me</a></li>';
let n = 0;
for (const f of walk(root)) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  if (!c.includes("menu-item-hire") && c.includes('href="/contact-us/">Contact Me</a></li>')) {
    c = c.replace(
      /(<li[^>]*>\s*<a href="\/contact-us\/">Contact Me<\/a>\s*<\/li>)/g,
      hireLi + "\n$1"
    );
  }
  if (
    c.includes('zh-nav-top" href="/contact-us/">Contact Me') &&
    !c.includes('zh-nav-top" href="/hire-me/">Hire Me')
  ) {
    c = c.split('<a class="zh-nav-top" href="/contact-us/">Contact Me</a>').join(
      '<a class="zh-nav-top" href="/hire-me/">Hire Me</a><a class="zh-nav-top" href="/contact-us/">Contact Me</a>'
    );
  }
  if (
    c.includes('<li><a href="/contact-us/">Contact Me</a></li>') &&
    !c.includes('<li><a href="/hire-me/">Hire Me</a></li>')
  ) {
    c = c
      .split('<li><a href="/contact-us/">Contact Me</a></li>')
      .join('<li><a href="/hire-me/">Hire Me</a></li>\n<li><a href="/contact-us/">Contact Me</a></li>');
  }
  c = c.replace(/zhfix[789]/g, "zhfix9");
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
    console.log(path.relative(root, f));
  }
}
console.log("updated", n);
