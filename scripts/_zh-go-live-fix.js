/**
 * ZH go-live fix pass — patch mirror HTML/CSS/JS for desktop load,
 * preloader, mobile nav paths, case studies, motion ease-up.
 * Run: node scripts/_zh-go-live-fix.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com"
);

const LINK_CSS =
  '<link rel="stylesheet" id="zh-site-fix-css" href="/wp-content/uploads/zach/zh-site-fix.css?v=zhfix1">';
const SCRIPT_JS =
  '<script id="zh-site-fix-js" src="/wp-content/uploads/zach/zh-site-fix.js?v=zhfix1" defer></script>';

const ABS_NAV = {
  "./index.html": "/",
  "../index.html": "/",
  "../../index.html": "/",
  "./about-me/index.html": "/about-me/",
  "../about-me/index.html": "/about-me/",
  "../../about-me/index.html": "/about-me/",
  "./web-developer/index.html": "/web-developer/",
  "../web-developer/index.html": "/web-developer/",
  "../../web-developer/index.html": "/web-developer/",
  "./graphic-designer/index.html": "/graphic-designer/",
  "../graphic-designer/index.html": "/graphic-designer/",
  "../../graphic-designer/index.html": "/graphic-designer/",
  "./fashion-model/index.html": "/fashion-model/",
  "../fashion-model/index.html": "/fashion-model/",
  "../../fashion-model/index.html": "/fashion-model/",
  "./services/index.html": "/services/",
  "../services/index.html": "/services/",
  "../../services/index.html": "/services/",
  "./portfolio-page/index.html": "/portfolio-page/",
  "../portfolio-page/index.html": "/portfolio-page/",
  "../../portfolio-page/index.html": "/portfolio-page/",
  "./blog/index.html": "/blog/",
  "../blog/index.html": "/blog/",
  "../../blog/index.html": "/blog/",
  "./contact-us/index.html": "/contact-us/",
  "../contact-us/index.html": "/contact-us/",
  "../../contact-us/index.html": "/contact-us/",
  "./hire-me/index.html": "/hire-me/",
  "../hire-me/index.html": "/hire-me/",
  "../../hire-me/index.html": "/hire-me/",
  "./our-faq/index.html": "/our-faq/",
  "../our-faq/index.html": "/our-faq/",
  "../../our-faq/index.html": "/our-faq/",
  "./privacy-policy/index.html": "/privacy-policy/",
  "../privacy-policy/index.html": "/privacy-policy/",
  "../../privacy-policy/index.html": "/privacy-policy/",
  "./terms/index.html": "/terms/",
  "../terms/index.html": "/terms/",
  "../../terms/index.html": "/terms/",
  "./works/weroi/index.html": "/works/weroi/",
  "../works/weroi/index.html": "/works/weroi/",
  "../../works/weroi/index.html": "/works/weroi/",
};

const SERVICE_SLUGS = [
  "premium-business-websites",
  "custom-software",
  "ai-integrations",
  "automation-systems",
  "seo",
  "business-platforms",
  "maintenance",
  "performance-optimization",
  "consulting",
];
for (const s of SERVICE_SLUGS) {
  ABS_NAV[`./services/${s}/index.html`] = `/services/${s}/`;
  ABS_NAV[`../services/${s}/index.html`] = `/services/${s}/`;
  ABS_NAV[`../../services/${s}/index.html`] = `/services/${s}/`;
}

const CASE_STUDIES = [
  {
    slug: "domus",
    title: "Domus",
    eyebrow: "Manufacturer Site",
    live: "https://domus-topaz.vercel.app",
    cover: "/wp-content/uploads/zach/cover-domus.png",
    summary:
      "Premium manufacturer site on Next.js with image-led storytelling, fast loads, and conversion-focused information architecture for a uPVC windows and doors brand.",
    stack: "Next.js, Tailwind, GSAP, Vercel",
    role: "Full build and deploy",
    problem:
      "A manufacturer brand needed a premium web presence that felt product-led, loaded fast, and guided visitors toward quotes without looking like a generic brochure template.",
    approach:
      "Built a Next.js site with image-first galleries, clear service hierarchy, GSAP motion used sparingly for presence, and Vercel production hosting.",
    outcome:
      "Live manufacturer site with strong visual storytelling and a clean path from browse to contact.",
  },
  {
    slug: "northern-elite",
    title: "Northern Elite Concrete",
    eyebrow: "Contractor Site",
    live: "https://northern-elite.vercel.app",
    cover: "/wp-content/uploads/zach/cover-northern.png",
    summary:
      "Concrete contractor site with gallery-led services, insights, and scroll-driven motion for a Red Deer brand.",
    stack: "Next.js, GSAP, Tailwind, Vercel",
    role: "Design and build",
    problem:
      "A concrete contractor needed a site that showed finished work clearly, explained services, and felt premium enough to match a growing regional brand.",
    approach:
      "Gallery-led services, insights shell, and intentional GSAP motion around key sections, with a contractor-ready IA.",
    outcome:
      "Production-ready contractor site that leads with proof of work and clear service paths.",
  },
  {
    slug: "wehfigo",
    title: "WehFiGo",
    eyebrow: "Events Platform",
    live: "https://wehfigo.com",
    cover: "/wp-content/uploads/zach/cover-wehfigo.png",
    summary:
      "Jamaican events platform with listings, pricing gates, auth shell, and motion-led storytelling.",
    stack: "WordPress, Listeo, PHP, JS",
    role: "Theme engineering and platform build",
    problem:
      "An events marketplace needed reliable listings, vendor pricing gates, auth flows, and a Jamaica-first UX that still felt modern.",
    approach:
      "Custom Listeo child theme work, auth and pricing gates, listing UX, and production polish across the marketplace surfaces.",
    outcome:
      "Live events platform at wehfigo.com with vendor workflows and polished public pages.",
  },
  {
    slug: "pntcog",
    title: "PNTCOG",
    eyebrow: "Ministry Site",
    live: "https://portmorentcog.org",
    cover: "/wp-content/uploads/zach/cover-pntcog.png",
    summary:
      "Live congregation site for Portmore New Testament Church of God, events, content, and production deploys.",
    stack: "Static site, custom CMS, Bluehost",
    role: "Build and maintain",
    problem:
      "A congregation needed a clear, accessible site for events and content that older members could use, without inventing church facts or overcomplicating updates.",
    approach:
      "Static production site with a practical content workflow, event surfaces, and careful accessibility choices.",
    outcome:
      "Live ministry site at portmorentcog.org with ongoing production deploys.",
  },
  {
    slug: "devos",
    title: "DevOS",
    eyebrow: "Workflow System",
    live: "",
    cover: "/wp-content/uploads/zach/cover-devos.png",
    summary:
      "Personal development operating system for decisions, patterns, Studio workflows, and cross-project continuity. Internal tooling, not a public product site.",
    stack: "TypeScript, Next.js, markdown OS, Studio UI",
    role: "Architect and builder",
    problem:
      "Multi-project delivery needed durable memory, decision logs, and Studio workflows so agents and humans share the same operating context.",
    approach:
      "Markdown DevOS plus Studio surfaces for inspect, factory, docs, and routing policies. Portfolio case study only, no public Visit Site CTA.",
    outcome:
      "Living operating system used across client and personal builds, documented as a portfolio case study.",
  },
];

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "wp-content" || name === "wp-includes") continue;
      walkHtml(p, out);
    } else if (name === "index.html") {
      out.push(p);
    }
  }
  return out;
}

function patchThemeCss() {
  const cssDir = path.join(ROOT, "wp-content", "themes", "revox", "assets", "css");
  let n = 0;
  for (const f of fs.readdirSync(cssDir)) {
    if (!/^main_ver=.*\.css$/.test(f)) continue;
    let t = fs.readFileSync(path.join(cssDir, f), "utf8");
    const before = t;
    t = t.replace(/content:\s*["']Revox["']/gi, 'content: "Zachary"');
    t = t.replace(
      /\.preloader \{[\s\S]*?z-index: 99999999999999;\n\}/,
      `.preloader {
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100%;
  left: 0;
  top: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  overflow: hidden;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  background: #111013;
  z-index: 2147483646;
}`
    );
    if (t !== before) {
      fs.writeFileSync(path.join(cssDir, f), t);
      n++;
    }
  }
  console.log("theme CSS patched:", n);
}

function patchMainJs() {
  const jsDir = path.join(ROOT, "wp-content", "themes", "revox", "assets", "js");
  let n = 0;
  const smootherRe =
    /\/\/ Initialize ScrollSmoother\s*let smoother = ScrollSmoother\.create\(\{[\s\S]*?ignoreMobileResize: true,\s*\}\);/;
  const smootherRep = `// Initialize ScrollSmoother
    /* ZH_MOBILE_SMOOTH_SKIP */
    var zhIsMobile = window.matchMedia('(max-width: 991px)').matches;
    let smoother = null;
    if (!zhIsMobile) {
      try {
        smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
        smoothTouch: 0,
        normalizeScroll: false,
        ignoreMobileResize: true,
    });
      } catch (zhErr) { console.warn('ScrollSmoother skipped', zhErr); }
    } else {
      try { $('#smooth-wrapper, #smooth-content').css({height:'auto',overflow:'visible',transform:'none'}); } catch(e){}
    }`;
  for (const f of fs.readdirSync(jsDir)) {
    if (!/^main_ver=.*\.js$/.test(f)) continue;
    let t = fs.readFileSync(path.join(jsDir, f), "utf8");
    const before = t;

    if (!t.includes("ZH_MOBILE_SMOOTH_SKIP")) {
      t = t.replace(smootherRe, smootherRep);
    }
    if (!t.includes("ZH_PRELOADER_FAST")) {
      t = t.replace(
        /\/\/ Init preloader\s*preloader\(\);/,
        `// Init preloader
  preloader();
  /* ZH_PRELOADER_FAST */
  setTimeout(function(){ try { var p=document.querySelector('.preloader'); if(p && p.style.display!=='none'){ p.style.display='none'; p.style.zIndex='-1'; } } catch(e){} }, 2500);`
      );
    }
    t = t.replace(
      /if\(!isMobile\)\{\s*header\.style\.transform = '';\s*header\.style\.transition = '';\s*return;\s*\}/,
      `if(!isMobile){
        header.style.transform = 'none';
        header.classList.remove('zach-header-hide','header-hidden');
        return;
      }`
    );

    if (t !== before) {
      fs.writeFileSync(path.join(jsDir, f), t);
      n++;
    }
  }
  console.log("theme main.js patched:", n);
}

function rewriteNavHrefs(html) {
  let t = html;
  // Sort longest keys first to avoid partial replacements
  const keys = Object.keys(ABS_NAV).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const v = ABS_NAV[k];
    t = t.split(`href="${k}"`).join(`href="${v}"`);
    t = t.split(`href='${k}'`).join(`href='${v}'`);
  }
  // Service relative from services/* pages
  t = t.replace(
    /href="\.\.\/(premium-business-websites|custom-software|ai-integrations|automation-systems|seo|business-platforms|maintenance|performance-optimization|consulting)\/index\.html"/g,
    'href="/services/$1/"'
  );
  // DRAWER_NAV absolute rewrite inside JS string
  t = t.replace(
    /var DRAWER_NAV='[\s\S]*?';/,
    `var DRAWER_NAV='<a class="zh-nav-top" href="/">Home</a><a class="zh-nav-top" href="/about-me/">About Me</a><div class="zh-nav-group"><button type="button" class="zh-nav-accordion" aria-expanded="false">Services<span class="zh-acc-chevron" aria-hidden="true">▼</span></button><div class="zh-nav-sub"><a href="/services/">All Services</a><a href="/services/premium-business-websites/">Premium Business Websites</a><a href="/services/custom-software/">Custom Software</a><a href="/services/ai-integrations/">AI Integrations</a><a href="/services/automation-systems/">Automation Systems</a><a href="/services/seo/">SEO</a><a href="/services/business-platforms/">Business Platforms</a><a href="/services/maintenance/">Maintenance</a><a href="/services/performance-optimization/">Performance Optimization</a><a href="/services/consulting/">Consulting</a></div></div><div class="zh-nav-group"><button type="button" class="zh-nav-accordion" aria-expanded="false">More<span class="zh-acc-chevron" aria-hidden="true">▼</span></button><div class="zh-nav-sub"><a href="/our-faq/">FAQ</a><a href="/privacy-policy/">Privacy Policy</a><a href="/terms/">Terms</a></div></div><a class="zh-nav-top" href="/portfolio-page/">Portfolio</a><a class="zh-nav-top" href="/blog/">Blog</a><a class="zh-nav-top" href="/contact-us/">Contact Me</a>';`
  );
  // Remove scroll-hide logic from inline zh-header-ux-js
  t = t.replace(
    /var lastY=window\.scrollY\|\|0;[\s\S]*?window\.addEventListener\('scroll',onScroll,\{passive:true\}\);\s*onScroll\(\);/,
    `nav.classList.remove('zh-nav-hidden');`
  );
  t = t.replace(
    /btn\.href='\.\/index\.html';/g,
    `btn.href='/';`
  );
  t = t.replace(
    /window\.location\.href='\.\/index\.html';/g,
    `window.location.href='/';`
  );
  return t;
}

function injectAssets(html) {
  let t = html;
  if (!t.includes("zh-site-fix.css")) {
    if (t.includes("</head>")) {
      t = t.replace("</head>", ` ${LINK_CSS}\n</head>`);
    }
  }
  if (!t.includes("zh-site-fix.js")) {
    if (t.includes("</body>")) {
      t = t.replace("</body>", `${SCRIPT_JS}\n</body>`);
    }
  }
  // Kill zh-nav-hidden CSS rule (always visible)
  t = t.replace(
    /#zh-mobile-nav\.zh-nav-hidden\{[^}]+\}/g,
    `#zh-mobile-nav.zh-nav-hidden{opacity:1!important;pointer-events:auto!important;transform:translateX(-50%)!important;}`
  );
  // Closed drawer must not steal clicks
  if (!t.includes("zh-mobile-drawer:not(.is-open)")) {
    t = t.replace(
      /\.zh-mobile-drawer\.is-open\{transform:translateY\(0\) scale\(1\);opacity:1;\}/,
      `.zh-mobile-drawer:not(.is-open){pointer-events:none!important;visibility:hidden!important;}\n .zh-mobile-drawer.is-open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto!important;visibility:visible!important;}`
    );
  }
  return t;
}

function patchCaseStudyLinks(html, filePath) {
  let t = html;
  const map = {
    "#project-domus-case": "/works/domus/",
    "#project-northern-elite-case": "/works/northern-elite/",
    "#project-wehfigo-case": "/works/wehfigo/",
    "#project-pntcog-case": "/works/pntcog/",
    "#project-devos-case": "/works/devos/",
  };
  for (const [from, to] of Object.entries(map)) {
    t = t.split(`href="${from}"`).join(`href="${to}"`);
  }
  // Homepage relative portfolio anchors → works pages
  t = t.replace(
    /href="\.\/portfolio-page\/index\.html#project-domus-case"/g,
    'href="/works/domus/"'
  );
  t = t.replace(
    /href="\.\/portfolio-page\/index\.html#project-northern-elite-case"/g,
    'href="/works/northern-elite/"'
  );
  t = t.replace(
    /href="\.\/portfolio-page\/index\.html#project-pntcog-case"/g,
    'href="/works/pntcog/"'
  );
  t = t.replace(
    /href="\.\/portfolio-page\/index\.html#project-wehfigo-case"/g,
    'href="/works/wehfigo/"'
  );
  t = t.replace(
    /href="\.\/works\/weroi\/index\.html"/g,
    'href="/works/weroi/"'
  );
  t = t.replace(
    /href="\.\.\/works\/weroi\/index\.html"/g,
    'href="/works/weroi/"'
  );
  return t;
}

function patchHtmlFile(filePath) {
  let t = fs.readFileSync(filePath, "utf8");
  const before = t;
  t = rewriteNavHrefs(t);
  t = injectAssets(t);
  t = patchCaseStudyLinks(t, filePath);
  // Ensure preloader text is Zachary
  t = t.replace(
    /<h5 class="preloader-text">[^<]*<\/h5>/g,
    '<h5 class="preloader-text">Zachary</h5>'
  );
  if (t !== before) {
    fs.writeFileSync(filePath, t);
    return true;
  }
  return false;
}

function caseStudyHtml(cs) {
  const visit = cs.live
    ? `<p style="margin-top:1rem"><a class="theme-btn" href="${cs.live}" target="_blank" rel="noopener noreferrer">Visit Site <i class="fa-solid fa-arrow-up-right"></i></a></p>`
    : "";
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${cs.title} Case Study, Zachary Hutton</title>
<meta name="description" content="${cs.summary.replace(/"/g, "&quot;")}">
<link rel="stylesheet" href="/wp-content/themes/revox/assets/css/bootstrap.min_ver%3D1784315714.css">
<link rel="stylesheet" href="/wp-content/themes/revox/assets/css/main_ver%3D1784315714.css">
<link rel="stylesheet" href="/wp-content/themes/revox/assets/css/all.min_ver%3D1784315714.css">
${LINK_CSS}
<style>
body{margin:0;background:#0a0a0a;color:#fff;font-family:Kanit,system-ui,sans-serif;}
.zh-case-shell{max-width:960px;margin:0 auto;padding:110px 20px 80px;}
.zh-case-shell .eyebrow{color:#BFF747;letter-spacing:.14em;text-transform:uppercase;font-size:12px;font-weight:700;}
.zh-case-shell h1{font-size:clamp(28px,5vw,48px);margin:8px 0 16px;line-height:1.15;}
.zh-case-shell .cover{width:100%;border-radius:12px;margin:24px 0;display:block;}
.zh-case-shell h2{font-size:22px;margin:28px 0 10px;color:#BFF747;}
.zh-case-shell p,.zh-case-shell li{line-height:1.7;color:rgba(255,255,255,.82);}
.zh-case-shell a.theme-btn{display:inline-flex;align-items:center;gap:8px;background:#BFF747;color:#0a0a0a;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:13px;}
.zh-case-nav{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;}
.zh-case-nav a{color:#BFF747;text-decoration:none;}
#header-sticky{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(6,6,6,.92);backdrop-filter:blur(12px);}
#header-sticky .header-main{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;max-width:1200px;margin:0 auto;}
#header-sticky .header-logo img{height:36px;width:auto;}
#header-sticky nav a{color:rgba(255,255,255,.75);margin:0 10px;text-decoration:none;font-size:13px;text-transform:uppercase;letter-spacing:.08em;}
#header-sticky nav a:hover{color:#BFF747;}
@media(max-width:991px){#header-sticky nav{display:none;}}
</style>
</head>
<body class="zh-case-page">
<header id="header-sticky" class="header-2 inner-page-style zh-solid">
  <div class="header-main">
    <a class="header-logo" href="/"><img src="/wp-content/uploads/2026/01/white-icon.svg?v=zh5" alt="Zachary"></a>
    <nav>
      <a href="/">Home</a>
      <a href="/about-me/">About</a>
      <a href="/portfolio-page/">Portfolio</a>
      <a href="/hire-me/">Hire Me</a>
    </nav>
  </div>
</header>
<main class="zh-case-shell">
  <p class="eyebrow">${cs.eyebrow}</p>
  <h1>${cs.title}</h1>
  <p>${cs.summary}</p>
  <img class="cover" src="${cs.cover}" alt="${cs.title}" width="1200" height="675" loading="eager">
  ${visit}
  <h2>Stack</h2>
  <p>${cs.stack}</p>
  <h2>Role</h2>
  <p>${cs.role}</p>
  <h2>Problem</h2>
  <p>${cs.problem}</p>
  <h2>Approach</h2>
  <p>${cs.approach}</p>
  <h2>Outcome</h2>
  <p>${cs.outcome}</p>
  <div class="zh-case-nav">
    <a href="/portfolio-page/">← Back to Portfolio</a>
    <a href="/hire-me/">Hire Me</a>
    <a href="/contact-us/">Contact</a>
  </div>
</main>
${SCRIPT_JS}
</body>
</html>
`;
}

function createCaseStudies() {
  for (const cs of CASE_STUDIES) {
    const dir = path.join(ROOT, "works", cs.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), caseStudyHtml(cs));
  }
  console.log("case study pages:", CASE_STUDIES.length);
}

function patchNextConfig() {
  const cfgPath = path.join(__dirname, "..", "next.config.ts");
  let t = fs.readFileSync(cfgPath, "utf8");
  const slugs = ["domus", "northern-elite", "wehfigo", "pntcog", "devos"];
  let added = 0;
  for (const s of slugs) {
    const key = `"works/${s}"`;
    if (!t.includes(key)) {
      t = t.replace(
        `"works/weroi",`,
        `"works/weroi",\n  "works/${s}",`
      );
      added++;
    }
  }
  fs.writeFileSync(cfgPath, t);
  console.log("next.config works rewrites added:", added);
}

function main() {
  patchThemeCss();
  patchMainJs();
  createCaseStudies();
  patchNextConfig();
  const pages = walkHtml(ROOT).filter(
    (p) => !p.includes(`${path.sep}wp-content${path.sep}`)
  );
  let n = 0;
  for (const p of pages) {
    if (patchHtmlFile(p)) n++;
  }
  console.log("HTML pages patched:", n, "/", pages.length);
  console.log("done");
}

main();
