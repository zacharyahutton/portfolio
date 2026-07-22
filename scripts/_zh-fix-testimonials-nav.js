const fs = require("fs");
const paths = [
  "public/revox-mirror/revox.baseecom.com/index.html",
  "public/revox-mirror/revox.baseecom.com/testimonials/index.html",
];
for (const p of paths) {
  let h = fs.readFileSync(p, "utf8");
  h = h.replace(
    /\s*<li>\s*<a href="\/testimonials\/">\s*TESTIMONIALS\s*<\/a>\s*<\/li>/gi,
    ""
  );
  h = h.replace(
    /(<a class="zh-nav-top" href="\/hire-me\/">Hire Me<\/a>){2,}/g,
    "$1"
  );
  // Footer: add once after PORTFOLIO quick link
  if (!/widget-title">\s*quick links[\s\S]{0,1200}href="\/testimonials\//i.test(h)) {
    h = h.replace(
      /(<a href="\/portfolio-page\/">\s*PORTFOLIO\s*<\/a>\s*<\/li>)/i,
      '$1\n <li>\n <a href="/testimonials/">\n TESTIMONIALS </a>\n </li>'
    );
  }
  fs.writeFileSync(p, h);
  console.log("cleaned", p);
}
