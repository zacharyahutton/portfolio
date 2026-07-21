/**
 * Final publish scrub — content/links only inside Revox HTML slots.
 */
const fs = require("fs");
const path = require("path");

const MIRROR = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com"
);

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "wp-includes" || name === "plugins" || name === "themes") continue;
      walkHtml(full, out);
    } else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const POSTS = [
  ["CSS Grid vs Flexbox: When I Reach for Which", "blog-css-grid.png", "UI Engineering"],
  ["Building the weROI Agency Platform", "blog-weroi.png", "Case Study"],
  ["TypeScript Generics Without the Headache", "blog-typescript.png", "TypeScript"],
  ["React Server Components Explained", "blog-rsc.png", "Next.js"],
  ["REST API Design Habits That Scale", "blog-api.png", "Backend"],
  ["Core Web Vitals Guide", "blog-vitals.png", "Performance"],
  ["CORS Explained for Frontend Developers", "blog-cors.png", "Web"],
  ["Debugging Production Bugs Calmly", "blog-debug.png", "Ops"],
  ["Security Fundamentals for Web Apps", "blog-security.png", "Security"],
  ["PNTCOG Ministry Site Notes", "blog-pntcog.png", "Client"],
  ["Shipping Remotely from Jamaica", "blog-jamaica.png", "Career"],
];

function blogCard(title, img, cat) {
  return `<div class="news-standard-box-items">
    <div class="thumb">
                    <a href="../blog/index.html">
                <img width="450" height="280" src="../wp-content/uploads/zach/${img}" class="attachment-full size-full wp-post-image" alt="${title}" decoding="async">            </a> 
            </div>
    <div class="content">
        <h3>
            <a href="../blog/index.html">${title}</a>
        </h3>
        <div class="client-info-area">
            <div class="client-info">
                <div class="client-image">
                    <img alt="Zachary Hutton" src="../wp-content/uploads/zach/avatar-zach.png" class="avatar avatar-64 photo" height="64" width="64" style="border-radius:50%; object-fit:cover;">                </div>
                <div class="client-content">
                    <p class="name">Zachary Hutton</p>
                    <p>Authored by</p>
                </div>
            </div>
            <div class="line-shape"></div>
            <ul>
                <li>
                    <span>${cat}</span>                    <span class="color-2">2025</span>
                </li>
            </ul>
        </div>
    </div>
</div>`;
}

function patchGlobal(html, depth) {
  const services =
    depth === 0 ? "./services/index.html" : "../".repeat(depth) + "services/index.html";
  const blog =
    depth === 0 ? "./blog/index.html" : "../".repeat(depth) + "blog/index.html";
  const weroi =
    depth === 0 ? "./works/weroi/" : "../".repeat(depth) + "works/weroi/";
  const contact =
    depth === 0 ? "./contact-us/index.html" : "../".repeat(depth) + "contact-us/index.html";

  html = html.replace(/title="Revox » Feed"/g, 'title="Zachary Hutton Feed"');
  html = html.replace(
    /title="Revox » Comments Feed"/g,
    'title="Zachary Hutton Comments"'
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?services\/mobile-app-development\/"/g,
    `href="${services}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?works\/web-ui-ux-design\/"/g,
    `href="${weroi}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?fortifying-digital-assets-against-evolving-threats-in-a-hybrid-world\/"/g,
    `href="${blog}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?unlocking-insights-with-machine-learning-to-drive-smarter-decisions\/"/g,
    `href="${blog}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?harnessing-cloud-power-to-scale-agile-teams-and-accelerate-delivery\/"/g,
    `href="${blog}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?driving-the-next-era-of-growth-combining-smart-technology-with-transformative-design-excellence\/"/g,
    `href="${blog}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?unlocking-scalable-success-via-data-driven-insights-that-redefine-customer-engagement\/"/g,
    `href="${blog}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?crafting-resilient-ecosystems-where-creativity-fuels-sustainable-expansion\/"/g,
    `href="${weroi}"`
  );
  html = html.replace(
    /href="(\.\.\/|\.\/)?driving-next-level-innovation-with-strategies-that-disrupt-conventional-markets\/"/g,
    `href="${blog}"`
  );
  html = html.replace(/>Fashion Model</g, ">Case Studies<");
  html = html.replace(/>hire me</g, ">Hire Me<");
  html = html.replace(/Rachel Davis/g, "Zachary Hutton");
  html = html.replace(/Composed by/g, "Authored by");
  html = html.replace(
    /Security Fundamentals for Shippers/g,
    "Security Fundamentals for Web Apps"
  );
  html = html.replace(
    /(<a href=")[^"]*(" class="theme-btn">Hire Me)/g,
    `$1${contact}$2`
  );
  return html;
}

function patchBlogList(html) {
  const cards = POSTS.map((p) => blogCard(p[0], p[1], p[2])).join("\n");
  const start = html.indexOf('<div class="news-standard-box-items');
  const sidebar = html.indexOf('col-lg-4');
  if (start > -1 && sidebar > start) {
    const rowOpen = html.lastIndexOf('<div class="row">', start);
    if (rowOpen > -1) {
      return (
        html.slice(0, rowOpen) +
        `<div class="row">\n${cards}\n            </div>\n            <div class="` +
        html.slice(sidebar)
      );
    }
  }
  return html;
}

function depthFor(file) {
  const rel = path.relative(MIRROR, file).replace(/\\/g, "/");
  return Math.max(0, rel.split("/").length - 1);
}

let n = 0;
for (const file of walkHtml(MIRROR)) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = patchGlobal(html, depthFor(file));
  if (file.replace(/\\/g, "/").endsWith("/blog/index.html")) {
    html = patchBlogList(html);
  }
  if (html !== before) {
    fs.writeFileSync(file, html);
    n++;
    console.log("patched", path.relative(MIRROR, file));
  }
}
console.log("files patched:", n);
