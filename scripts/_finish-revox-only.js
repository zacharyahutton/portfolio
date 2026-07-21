/**
 * FINAL Revox-mirror content pass only. No React rebuild.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MIRROR = path.join(ROOT, "public", "revox-mirror", "revox.baseecom.com");
const INDEX = path.join(MIRROR, "index.html");
const ZACH = path.join(MIRROR, "wp-content", "uploads", "zach");
fs.mkdirSync(ZACH, { recursive: true });

// --- Hero PNG ---
const heroSrc = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-EverybodyHatesA1one-Documents-PORTFOLIO",
  "assets",
  "c__Users_EverybodyHatesA1one_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Adobe_Express_-_file-fc09eb62-36b0-4b0b-aeb3-be80ac7ad77d.png"
);
if (fs.existsSync(heroSrc)) {
  for (const n of ["hero-zach-full.png", "hero-zach.png", "about-zach.png", "contact-zach.png", "avatar-zach.png"]) {
    fs.copyFileSync(heroSrc, path.join(ZACH, n));
  }
  fs.mkdirSync(path.join(ROOT, "public", "zach"), { recursive: true });
  fs.copyFileSync(heroSrc, path.join(ROOT, "public", "zach", "zachary-hutton-hero.png"));
  console.log("hero copied", fs.statSync(path.join(ZACH, "hero-zach-full.png")).size);
} else {
  console.warn("HERO_SRC_MISSING");
}

function coverSvg(title, sub) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
<rect width="1200" height="750" fill="#0B0E13"/>
<rect x="70" y="90" width="720" height="430" rx="14" fill="#12141a" stroke="#2a2d36"/>
<rect x="100" y="120" width="660" height="40" rx="6" fill="#1a1d26"/>
<circle cx="120" cy="140" r="6" fill="#ff5f57"/><circle cx="140" cy="140" r="6" fill="#febc2e"/><circle cx="160" cy="140" r="6" fill="#28c840"/>
<rect x="100" y="190" width="280" height="16" rx="4" fill="#BFF747" fill-opacity="0.85"/>
<rect x="100" y="230" width="520" height="12" rx="3" fill="#2a2d36"/>
<rect x="100" y="260" width="440" height="12" rx="3" fill="#2a2d36"/>
<rect x="100" y="310" width="200" height="130" rx="8" fill="#1500ff" fill-opacity="0.35"/>
<rect x="320" y="310" width="200" height="130" rx="8" fill="#BFF747" fill-opacity="0.2"/>
<text x="70" y="620" fill="#fff" font-family="Arial,sans-serif" font-size="46" font-weight="700">${title}</text>
<text x="70" y="660" fill="#9a9aa3" font-family="Arial,sans-serif" font-size="18">${sub}</text>
</svg>`;
}

const covers = {
  "cover-domus.svg": ["Domus", "Manufacturer · Next.js · Live"],
  "cover-northern.svg": ["Northern Elite", "Concrete contractor · Next.js"],
  "cover-wehfigo.svg": ["WehFiGo", "Events platform · Jamaica"],
  "cover-weroi.svg": ["weROI", "Agency platform · React / FastAPI"],
  "cover-pntcog.svg": ["PNTCOG", "Ministry platform · Live"],
  "blog-css-grid.svg": ["CSS Grid vs Flexbox", "Zachary Hutton · Blog"],
  "blog-typescript.svg": ["TypeScript Generics", "Zachary Hutton · Blog"],
  "blog-weroi.svg": ["Building weROI", "Zachary Hutton · Blog"],
  "blog-rsc.svg": ["React Server Components", "Zachary Hutton · Blog"],
  "blog-api.svg": ["REST API Habits", "Zachary Hutton · Blog"],
  "blog-vitals.svg": ["Core Web Vitals", "Zachary Hutton · Blog"],
};
for (const [f, [t, s]] of Object.entries(covers)) {
  fs.writeFileSync(path.join(ZACH, f), coverSvg(t, s));
}

// Logo already written; refresh
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="32" viewBox="0 0 160 32" fill="none">
  <path d="M4 2h8c6 0 10 3 10 9s-4 9-10 9H10v4l10 8h-8L4 22V2z" fill="#BFF747"/>
  <path d="M24 2h8v12h6V2h8v28h-8V18h-6v12h-8V2z" fill="#BFF747"/>
  <text x="50" y="22" fill="#ffffff" font-family="Kanit,Arial,sans-serif" font-size="18" font-weight="600">zachary</text>
</svg>`;
fs.writeFileSync(path.join(MIRROR, "wp-content", "uploads", "2026", "01", "white-icon.svg"), logo);

let html = fs.readFileSync(INDEX, "utf8");

// Fake years → 2023–2026
const yearMap = [
  [/Jan 2016 – Jul 2017/g, "2024 – 2025"],
  [/Sep 2014 – Dec 2015/g, "2023 – 2024"],
  [/May 2013 – Aug 2014/g, "2025"],
  [/Mar 2005 – May 2006/g, "2026"],
  [/Jan 2004 – Feb 2005/g, "2026"],
  [/>2015</g, ">2024<"],
  [/>2014</g, ">2023<"],
  [/>2016</g, ">2025<"],
  [/>2013</g, ">2026<"],
];
for (const [re, to] of yearMap) html = html.replace(re, to);

// Fake phone
html = html.replace(/tel:00%20123%205647%208900/g, "mailto:hzach577@gmail.com");
html = html.replace(/>00 123 5647 8900</g, ">hzach577@gmail.com<");

// Portfolio covers
html = html.replace(
  /src="wp-content\/uploads\/2025\/11\/project-01-4\.jpg" alt="Domus"/,
  'src="wp-content/uploads/zach/cover-domus.svg" alt="Domus"'
);
html = html.replace(
  /src="wp-content\/uploads\/2025\/11\/project-02-4\.jpg" alt="Northern Elite"/,
  'src="wp-content/uploads/zach/cover-northern.svg" alt="Northern Elite"'
);
html = html.replace(
  /src="wp-content\/uploads\/zach\/weroi\.png" alt="weROI Agency Platform"/,
  'src="wp-content/uploads/zach/cover-weroi.svg" alt="weROI Agency Platform"'
);
html = html.replace(
  /src="wp-content\/uploads\/zach\/pntcog\.png" alt="PNTCOG Ministry Platform"/,
  'src="wp-content/uploads/zach/cover-pntcog.svg" alt="PNTCOG Ministry Platform"'
);
// Duplicate Domus slot → WehFiGo
html = html.replace(
  /src="wp-content\/uploads\/zach\/domus-cover\.svg" alt="Domus">\s*[\s\S]*?<p>Client · Next\.js \/ Vercel<\/p>\s*<h3><a href="https:\/\/domus-topaz\.vercel\.app">Domus<\/a><\/h3>/,
  `src="wp-content/uploads/zach/cover-wehfigo.svg" alt="WehFiGo">
                                                                                                <div class="content">
                                                                                                            <p>Events · WordPress / Listeo</p>
                                                                                                        <h3><a href="https://wehfigo.com">WehFiGo</a></h3>`
);

// Simpler WehFiGo replace if above fails pattern
if (html.includes('domus-cover.svg" alt="Domus"') && html.includes("Client · Next.js / Vercel")) {
  html = html.replace('domus-cover.svg" alt="Domus"', 'cover-wehfigo.svg" alt="WehFiGo"');
  html = html.replace("<p>Client · Next.js / Vercel</p>", "<p>Events · WordPress / Listeo</p>");
  html = html.replace(
    '<h3><a href="https://domus-topaz.vercel.app">Domus</a></h3>',
    '<h3><a href="https://wehfigo.com">WehFiGo</a></h3>'
  );
}

// Testimonials → case study cards (names + images)
html = html.replace(/alt="Shikhon Islam"/g, 'alt="Domus"');
html = html.replace(/>Shikhon Islam</g, ">Domus<");
html = html.replace(
  /src="wp-content\/uploads\/2026\/01\/testimonial-image\.jpg"/g,
  'src="wp-content/uploads/zach/cover-domus.svg"'
);
html = html.replace(/alt="Caroline caldwell"/g, 'alt="weROI"');
html = html.replace(/>Caroline caldwell</g, ">weROI<");
html = html.replace(
  /src="wp-content\/uploads\/2026\/01\/testimonial-image-2\.jpg"/g,
  'src="wp-content/uploads/zach/cover-weroi.svg"'
);
// Second Domus duplicate quote → Northern Elite
html = html.replace(
  /(testimonial-image-2[\s\S]*?<p>)Domus is a premium manufacturer site shipped on Next\.js — image-led storytelling, fast loads, and conversion-focused IA\. Live on Vercel as a portfolio-ready flight test\.(<\/p>)/,
  "$1Northern Elite Concrete is a premium contractor site — gallery-led services, insights, and Next.js performance on Vercel.$2"
);
html = html.replace(/alt="Liam Peterson"/g, 'alt="WehFiGo"');
html = html.replace(/>Liam Peterson</g, ">WehFiGo<");
html = html.replace(
  /src="wp-content\/uploads\/2026\/01\/testimonial-image-3\.png"/g,
  'src="wp-content/uploads/zach/cover-wehfigo.svg"'
);
html = html.replace(/>founder &amp; CEO</g, ">Case study<");
html = html.replace(/>Marketing Director</g, ">Case study<");
html = html.replace(
  /src="wp-content\/uploads\/2026\/01\/clutech\.png" alt="Company Logo"/g,
  'src="wp-content/uploads/zach/brand-weroi.svg" alt="weROI"'
);

// Fix second testimonial body if still Domus
html = html.replace(
  /(<h4>weROI<\/h4>[\s\S]*?<p>)Domus is a premium manufacturer site shipped on Next\.js — image-led storytelling, fast loads, and conversion-focused IA\. Live on Vercel as a portfolio-ready flight test\./,
  "$1weROI is a full-stack agency platform — React, FastAPI, MongoDB, lead funnels, and admin tooling. Live at weroi.net."
);

// Blog homepage items → his posts
const blogBlocks = [
  {
    title: "CSS Grid vs Flexbox: When I Reach for Which",
    href: "./blog/index.html",
    tag: "Frontend",
    date: "Jul 12, 2026",
    cover: "wp-content/uploads/zach/blog-css-grid.svg",
  },
  {
    title: "Building the weROI Agency Platform",
    href: "https://weroi.net",
    tag: "Full stack",
    date: "Jun 05, 2026",
    cover: "wp-content/uploads/zach/blog-weroi.svg",
  },
  {
    title: "TypeScript Generics Without the Headache",
    href: "./blog/index.html",
    tag: "TypeScript",
    date: "Jul 08, 2026",
    cover: "wp-content/uploads/zach/blog-typescript.svg",
  },
];

// Replace avatar in blog rows with his photo
html = html.replace(
  /src="wp-content\/uploads\/2025\/12\/avatar-1-1765693540\.png"/g,
  'src="wp-content/uploads/zach/avatar-zach.png"'
);

// Replace three demo blog titles/covers if still present
html = html.replace(
  /Unlocking scalable success via data-driven insights that<br>redefine customer engagement/g,
  blogBlocks[0].title
);
html = html.replace(
  /Crafting resilient ecosystems where creativity fuels sustainable expansion/g,
  blogBlocks[1].title
);
html = html.replace(
  /Driving next-level innovation with strategies that disrupt<br>conventional markets/g,
  blogBlocks[2].title
);
html = html.replace(
  /src="wp-content\/uploads\/2025\/11\/news-02\.jpg"/g,
  `src="${blogBlocks[0].cover}"`
);
html = html.replace(
  /src="wp-content\/uploads\/2025\/11\/news-01\.jpg"/g,
  `src="${blogBlocks[1].cover}"`
);
html = html.replace(
  /src="wp-content\/uploads\/2025\/11\/news-03\.jpg"/g,
  `src="${blogBlocks[2].cover}"`
);
// news-03 might be different filename - check
html = html.replace(
  /wp-content\/uploads\/2025\/11\/news-0[0-9][^"\s]*/g,
  (m) => {
    if (m.includes("news-02")) return blogBlocks[0].cover;
    if (m.includes("news-01")) return blogBlocks[1].cover;
    return blogBlocks[2].cover;
  }
);

// Video section — use his portrait as still (no fake video URL)
html = html.replace(
  /(revox_video_section[\s\S]{0,800}?src=")([^"]+\.(jpg|png|jpeg|webp))(")/i,
  `$1wp-content/uploads/zach/hero-zach-full.png$4`
);

// Meta / feed leftovers
html = html.replace(/Revox »/g, "Zachary Hutton ·");
html = html.replace(/title="Revox"/g, 'title="Zachary Hutton"');

// Inject header scroll UX + ensure logo alt before </body>
const inject = `
<style id="zh-header-ux">
@media (max-width: 767px) {
  #header-sticky.zh-hide-mobile { transform: translateY(-110%); transition: transform .35s ease; }
  #header-sticky { transition: transform .35s ease; }
}
#header-sticky.zh-solid { background: rgba(6,6,6,.88) !important; backdrop-filter: blur(12px); }
</style>
<script id="zh-header-ux-js">
(function(){
  var header = document.getElementById('header-sticky');
  if(!header) return;
  var lastY = 0;
  var hero = document.querySelector('.hero-section');
  function heroH(){ return hero ? hero.offsetHeight : window.innerHeight; }
  window.addEventListener('scroll', function(){
    var y = window.scrollY || window.pageYOffset;
    if (y > 40) header.classList.add('zh-solid'); else header.classList.remove('zh-solid');
    var mobile = window.matchMedia('(max-width: 767px)').matches;
    if (!mobile) { header.classList.remove('zh-hide-mobile'); lastY = y; return; }
    if (y < heroH() * 0.85) header.classList.remove('zh-hide-mobile');
    else if (y > lastY + 8) header.classList.add('zh-hide-mobile');
    else if (y < lastY - 8) header.classList.remove('zh-hide-mobile');
    lastY = y;
  }, {passive:true});
})();
</script>
`;
if (!html.includes("zh-header-ux-js")) {
  html = html.replace(/<\/body>/i, inject + "\n</body>");
}

// Footer weROI link nudge — add after copyright if missing visible weROI in footer area
if (!html.includes('href="https://weroi.net"') || (html.match(/weroi\.net/g) || []).length < 2) {
  html = html.replace(
    /Copyright © <span>Zachary Hutton<\/span>/,
    'Copyright © <span>Zachary Hutton</span> · <a href="https://weroi.net" target="_blank" rel="noopener">weROI</a>'
  );
}

fs.writeFileSync(INDEX, html, "utf8");
console.log("index patched");

// Patch blog/index.html lightly if exists
const blogIndex = path.join(MIRROR, "blog", "index.html");
if (fs.existsSync(blogIndex)) {
  let b = fs.readFileSync(blogIndex, "utf8");
  b = b.replace(/Revox »/g, "Zachary Hutton ·");
  b = b.replace(/title="Revox"/g, 'title="Zachary Hutton"');
  b = b.replace(
    /src="wp-content\/uploads\/2025\/12\/avatar-1-1765693540\.png"/g,
    'src="../wp-content/uploads/zach/avatar-zach.png"'
  );
  b = b.replace(/content:\s*"Revox"/g, 'content: "Zachary"');
  fs.writeFileSync(blogIndex, b, "utf8");
  console.log("blog index patched");
}

// CSS preloader both files
for (const cssName of ["main_ver=1784315714.css", "main_ver=1784598828.css"]) {
  const css = path.join(MIRROR, "wp-content", "themes", "revox", "assets", "css", cssName);
  if (!fs.existsSync(css)) continue;
  let c = fs.readFileSync(css, "utf8");
  c = c.replace(/content:\s*"Revox"/g, 'content: "Zachary"');
  c = c.replace(
    /h5\.preloader-text::after\s*\{([^}]*)\}/g,
    (m, body) => {
      let b = body.replace(/color:\s*[^;]+;/, "color: #1500ff;");
      if (!/color:/.test(b)) b += "\n  color: #1500ff;";
      b = b.replace(/content:\s*"[^"]*"/, 'content: "Zachary"');
      return `h5.preloader-text::after {${b}}`;
    }
  );
  fs.writeFileSync(css, c, "utf8");
}

// RECENT
const recent = path.join(process.env.USERPROFILE || "", "Documents", "_shared-brain", "RECENT.md");
if (fs.existsSync(recent)) {
  fs.appendFileSync(
    recent,
    "\n2026-07-20 | [PORTFOLIO] | Revox-only finish: hero PNG, covers, case-study cards, blogs, pricing, header UX, weROI links; preview http://localhost:3000; not pushed\n"
  );
}

console.log("DONE");
