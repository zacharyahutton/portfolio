/**
 * Complete Revox-mirror content ship.
 * HARD LOCK: content/images/href/text/logo only — no template redesign.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const MIRROR = path.join(ROOT, "public", "revox-mirror", "revox.baseecom.com");
const ZACH = path.join(MIRROR, "wp-content", "uploads", "zach");
const ASSETS =
  "C:/Users/EverybodyHatesA1one/.cursor/projects/c-Users-EverybodyHatesA1one-Documents-PORTFOLIO/assets";
const CONTACT = "./contact-us/index.html";
const CONTACT_REL = "../contact-us/index.html";

fs.mkdirSync(ZACH, { recursive: true });

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "wp-content" || name === "wp-includes") continue;
      walkHtml(full, out);
    } else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

function coverSvg(title, sub) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0B0E13"/>
    <stop offset="100%" stop-color="#141820"/>
  </linearGradient>
</defs>
<rect width="1200" height="750" fill="url(#g)"/>
<rect x="70" y="90" width="720" height="430" rx="14" fill="#12141a" stroke="#2a2d36"/>
<rect x="100" y="120" width="660" height="40" rx="6" fill="#1a1d26"/>
<circle cx="120" cy="140" r="6" fill="#ff5f57"/><circle cx="140" cy="140" r="6" fill="#febc2e"/><circle cx="160" cy="140" r="6" fill="#28c840"/>
<rect x="100" y="190" width="280" height="16" rx="4" fill="#BFF747" fill-opacity="0.9"/>
<rect x="100" y="230" width="520" height="12" rx="3" fill="#2a2d36"/>
<rect x="100" y="260" width="440" height="12" rx="3" fill="#2a2d36"/>
<rect x="100" y="310" width="200" height="130" rx="8" fill="#BFF747" fill-opacity="0.22"/>
<rect x="320" y="310" width="200" height="130" rx="8" fill="#BFF747" fill-opacity="0.12"/>
<text x="70" y="620" fill="#fff" font-family="Arial,sans-serif" font-size="46" font-weight="700">${title}</text>
<text x="70" y="660" fill="#9a9aa3" font-family="Arial,sans-serif" font-size="18">${sub}</text>
</svg>`;
}

function brandSvg(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64">
<rect width="220" height="64" rx="8" fill="#12141a"/>
<text x="110" y="40" text-anchor="middle" fill="#BFF747" font-family="Kanit,Arial,sans-serif" font-size="22" font-weight="700">${label}</text>
</svg>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="32" viewBox="0 0 160 32" fill="none">
  <path d="M4 2h8c6 0 10 3 10 9s-4 9-10 9H10v4l10 8h-8L4 22V2z" fill="#BFF747"/>
  <path d="M24 2h8v12h6V2h8v28h-8V18h-6v12h-8V2z" fill="#BFF747"/>
  <text x="50" y="22" fill="#ffffff" font-family="Kanit,Arial,sans-serif" font-size="18" font-weight="600">zachary</text>
</svg>`;
}

function avatarStackSvg() {
  const marks = ["ZH", "we", "Do", "NE", "WF"];
  const circles = marks
    .map((t, i) => {
      const x = 28 + i * 34;
      return `<circle cx="${x}" cy="32" r="26" fill="#12141a" stroke="#BFF747" stroke-width="2"/><text x="${x}" y="38" text-anchor="middle" fill="#BFF747" font-family="Arial,sans-serif" font-size="14" font-weight="700">${t}</text>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64">${circles}</svg>`;
}

async function ensurePortrait() {
  const existing = path.join(ZACH, "hero-zach-full.png");
  const adobe = fs
    .readdirSync(ASSETS)
    .find((x) => x.includes("Adobe_Express_-_file-b65d0dcb"));
  const preferred = fs
    .readdirSync(ASSETS)
    .find((x) => x.includes("image-aa7823cd"));
  const cutoutAsset = path.join(ASSETS, "zachary-hutton-cutout.png");

  let src = existing;
  if (fs.existsSync(existing)) {
    const meta = await sharp(existing).metadata();
    if (meta.hasAlpha) {
      console.log("using existing alpha hero-zach-full");
    }
  }

  // Prefer Adobe Express if we can force alpha; aa7823 is landscape jpeg — use existing alpha hero or cutout process
  if (adobe) {
    const adobePath = path.join(ASSETS, adobe);
    // If adobe has no alpha, keep existing alpha hero if present; else try cutout asset
    const meta = await sharp(adobePath).metadata();
    if (!meta.hasAlpha && fs.existsSync(existing)) {
      const em = await sharp(existing).metadata();
      if (em.hasAlpha) src = existing;
    }
  }
  if (preferred && !fs.existsSync(existing)) {
    src = path.join(ASSETS, preferred);
  }
  if (fs.existsSync(cutoutAsset) && !(await sharp(src).metadata()).hasAlpha) {
    // Attempt simple dark-bg removal on cutout
    try {
      const { data, info } = await sharp(cutoutAsset)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        // remove near-black / near-white / green-screen-ish dark bg
        if (r < 28 && g < 28 && b < 28) data[i + 3] = 0;
        else if (r > 245 && g > 245 && b > 245) data[i + 3] = 0;
      }
      await sharp(data, {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
        .png()
        .toFile(path.join(ZACH, "hero-zach-full.png"));
      src = path.join(ZACH, "hero-zach-full.png");
      console.log("processed cutout alpha");
    } catch (e) {
      console.warn("cutout process failed", e.message);
    }
  }

  // Ensure copies for all slots from best alpha source
  const best = path.join(ZACH, "hero-zach-full.png");
  if (!fs.existsSync(best) && adobe) {
    await sharp(path.join(ASSETS, adobe)).png().toFile(best);
  }
  const names = [
    "hero-zach.png",
    "about-zach.png",
    "contact-zach.png",
    "avatar-zach.png",
    "video-zach.png",
    "hero-zach-cutout.png",
  ];
  for (const n of names) {
    fs.copyFileSync(best, path.join(ZACH, n));
  }
  console.log("portrait slots synced from", path.basename(best));
}

function writeAssets() {
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
    "blog-cors.svg": ["CORS Explained", "Zachary Hutton · Blog"],
    "blog-debug.svg": ["Debugging Production", "Zachary Hutton · Blog"],
    "blog-security.svg": ["Security Fundamentals", "Zachary Hutton · Blog"],
    "blog-pntcog.svg": ["PNTCOG Ministry Site", "Zachary Hutton · Blog"],
    "blog-jamaica.svg": ["Shipping from Jamaica", "Zachary Hutton · Blog"],
  };
  for (const [f, [t, s]] of Object.entries(covers)) {
    fs.writeFileSync(path.join(ZACH, f), coverSvg(t, s));
  }
  const brands = {
    "brand-weroi.svg": "weROI",
    "brand-domus.svg": "Domus",
    "brand-wehfigo.svg": "WehFiGo",
    "brand-northern.svg": "N. Elite",
    "brand-pntcog.svg": "PNTCOG",
    "brand-devos.svg": "DevOS",
  };
  for (const [f, label] of Object.entries(brands)) {
    fs.writeFileSync(path.join(ZACH, f), brandSvg(label));
  }
  fs.writeFileSync(path.join(ZACH, "avatar-stack.svg"), avatarStackSvg());
  const logo = logoSvg();
  fs.writeFileSync(
    path.join(MIRROR, "wp-content", "uploads", "2026", "01", "white-icon.svg"),
    logo
  );
  const logoDirs = [
    path.join(MIRROR, "wp-content", "assets", "img", "logo"),
    path.join(MIRROR, "wp-content", "assets", "img"),
  ];
  for (const d of logoDirs) {
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, "white-icon.svg"), logo);
  }
  // Copy real blog covers from assets when present
  const blogMap = {
    "css-grid-vs-flexbox.png": "blog-css-grid.png",
    "typescript-generics-beginners.png": "blog-typescript.png",
    "weroi-platform.png": "blog-weroi.png",
    "react-server-components-explained.png": "blog-rsc.png",
    "rest-api-design-best-practices.png": "blog-api.png",
    "core-web-vitals-guide.png": "blog-vitals.png",
    "cors-explained-frontend-developers.png": "blog-cors.png",
    "debugging-production-bugs.png": "blog-debug.png",
    "security-fundamentals.png": "blog-security.png",
    "pntcog-ministry-site.png": "blog-pntcog.png",
    "jamaica-remote-ship.png": "blog-jamaica.png",
    "weroi.png": "cover-weroi.png",
    "pntcog.png": "cover-pntcog.png",
  };
  for (const [src, dest] of Object.entries(blogMap)) {
    const s = path.join(ASSETS, src);
    if (fs.existsSync(s)) fs.copyFileSync(s, path.join(ZACH, dest));
  }
}

function patchCssGreenAndMarquee() {
  const cssDir = path.join(MIRROR, "wp-content", "themes", "revox", "assets", "css");
  if (!fs.existsSync(cssDir)) return;
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.startsWith("main") || !f.endsWith(".css")) continue;
    let css = fs.readFileSync(path.join(cssDir, f), "utf8");
    css = css.replace(/#1500ff/gi, "#BFF747");
    css = css.replace(
      /\.marquee-section\s*\{\s*background-color:\s*var\(--theme\);\s*padding:\s*40px 0;\s*\}/,
      `.marquee-section{background-color:var(--theme);padding:18px 0;transform:scale(0.85);transform-origin:center center;}`
    );
    // also shrink marquee text if present
    if (!css.includes("/* zach-marquee-half */")) {
      css += `\n/* zach-marquee-half */\n.marquee-section .marquee-text h3{font-size:clamp(28px,4vw,48px)!important;}\n.marquee-section .marquee-text img{width:28px!important;height:28px!important;}\n`;
    }
    fs.writeFileSync(path.join(cssDir, f), css);
    console.log("css patched", f);
  }
}

function patchMainJsHeader() {
  const jsDir = path.join(MIRROR, "wp-content", "themes", "revox", "assets", "js");
  if (!fs.existsSync(jsDir)) return;
  for (const f of fs.readdirSync(jsDir)) {
    if (!f.startsWith("main") || !f.endsWith(".js")) continue;
    let js = fs.readFileSync(path.join(jsDir, f), "utf8");
    if (js.includes("/* zach-header-hide */")) continue;
    js += `
/* zach-header-hide */
(function(){
  function initZachHeader(){
    var header = document.getElementById('header-sticky') || document.querySelector('.header-1, .header-2, header.header-1');
    if(!header) return;
    var lastY = window.pageYOffset || 0;
    var hero = document.querySelector('.hero-section, .hero-1, .hero-section1');
    var heroH = hero ? hero.offsetHeight : 480;
    window.addEventListener('scroll', function(){
      var y = window.pageYOffset || 0;
      var isMobile = window.matchMedia('(max-width: 991px)').matches;
      if(!isMobile){
        header.style.transform = '';
        header.style.transition = '';
        return;
      }
      header.style.transition = 'transform .25s ease';
      if(y > heroH){
        if(y > lastY + 4) header.style.transform = 'translateY(-110%)';
        else if(y < lastY - 4) header.style.transform = 'translateY(0)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastY = y;
    }, {passive:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initZachHeader);
  else initZachHeader();
})();
`;
    fs.writeFileSync(path.join(jsDir, f), js);
    console.log("header UX patched", f);
  }
}

function globalHtmlSanitize(html, relDepth) {
  const contactHref = relDepth === 0 ? CONTACT : CONTACT_REL;
  const prefix = relDepth === 0 ? "" : "../".repeat(relDepth);
  const zachUploads = `${prefix}wp-content/uploads/zach/`;

  // Visible Revox branding (not CSS class names / theme paths)
  html = html.replace(/>REVOX</g, ">Zachary<");
  html = html.replace(/>Revox</g, ">Zachary<");
  html = html.replace(/>revox</g, ">zachary<");
  html = html.replace(/title="Revox"/gi, 'title="Zachary Hutton"');
  html = html.replace(/rel="home">Revox</gi, 'rel="home">zachary<');
  html = html.replace(/Blog – Revox/g, "Blog – Zachary Hutton");
  html = html.replace(/– Revox</g, "– Zachary Hutton<");
  html = html.replace(/hi\.revox@gmail\.com/gi, "hzach577@gmail.com");
  html = html.replace(/mailto:hi\.revox@gmail\.com/gi, "mailto:hzach577@gmail.com");

  // Hire Me → contact form (capital H)
  html = html.replace(
    /<a href="mailto:hzach577@gmail\.com" class="theme-btn">\s*hire me/gi,
    `<a href="${contactHref}" class="theme-btn">Hire Me`
  );
  html = html.replace(
    /(<a href="[^"]*" class="theme-btn">)\s*hire me/gi,
    `$1Hire Me`
  );
  html = html.replace(/>\s*hire me\s*</gi, ">Hire Me<");
  html = html.replace(/>\s*Hire me\s*</g, ">Hire Me<");

  // Nav home variants
  html = html.replace(/>UX\/UI DESIGNER</g, ">Full Stack Developer<");
  html = html.replace(/>WEB DEVELOPER</g, ">Web Developer<");
  html = html.replace(/>Graphic designer</g, ">Product Engineer<");
  html = html.replace(/>Fashion Model</g, ">Case Studies<");
  html = html.replace(
    /href="(\.\.\/)?fashion-model\/index\.html"/g,
    `href="${relDepth === 0 ? "./portfolio-page/index.html" : "../portfolio-page/index.html"}"`
  );

  // Telegram wipe
  html = html.replace(/https:\/\/t\.me\/zachtedem_bot/g, "https://wehfigo.com");
  html = html.replace(/Telegram Demo Bot/gi, "WehFiGo");
  html = html.replace(/Telegram/gi, "Automation");

  // Demo leftover strings
  html = html.replace(/Pixelr[^<]*/gi, "weROI");
  html = html.replace(/Shikhon Islam/gi, "Domus");
  html = html.replace(/Caroline caldwell/gi, "Northern Elite");
  html = html.replace(/Liam Peterson/gi, "WehFiGo");
  html = html.replace(/teachable/gi, "weROI");
  html = html.replace(/Invoca/gi, "Domus");
  html = html.replace(/ShipBob/gi, "WehFiGo");
  html = html.replace(/Descartes/gi, "Northern Elite");
  html = html.replace(/CloudZero/gi, "PNTCOG");
  html = html.replace(/Progressive/gi, "DevOS");
  html = html.replace(/\bEONE\b/g, "weROI");

  // Portfolio details link → weROI work page
  html = html.replace(
    /href="(\.\.\/)?works\/web-ui-ux-design\/"/g,
    `href="${relDepth === 0 ? "./works/weroi/" : "../works/weroi/"}"`
  );

  // Preloader content attribute if any
  html = html.replace(
    /content:\s*["']REVOX["']/gi,
    'content:"Zachary"'
  );

  // Contact photo path helper
  if (html.includes("contact.png") && html.includes("contact-image")) {
    html = html.replace(
      /src="([^"]*?)wp-content\/uploads\/2026\/01\/contact\.png"/g,
      `src="$1wp-content/uploads/zach/contact-zach.png"`
    );
  }

  return html;
}

function patchIndex(html) {
  // CTA
  html = html.replace(
    /Then you're in the right place\.[^<]*/gi,
    "I design and ship premium websites, scalable platforms, AI automation, and custom software engineered for performance and growth. "
  );
  html = html.replace(
    /Get the best designs you're <br> looking for\. Just reach out and let me know!/gi,
    "Reach out — let's build something that ships."
  );

  // CTA buttons
  html = html.replace(
    /(<div class="cta-btn[\s\S]*?<a href=")[^"]+(" class="theme-btn">)\s*chat on whatsapp/i,
    `$1mailto:hzach577@gmail.com$2chat on email`
  );
  html = html.replace(
    /(<div class="cta-btn[\s\S]*?<a href=")[^"]+(" class="theme-btn">)\s*Hire Me/i,
    `$1${CONTACT}$2Hire Me`
  );

  // Header hire me
  html = html.replace(
    /<a href="mailto:hzach577@gmail\.com" class="theme-btn">Hire Me/g,
    `<a href="${CONTACT}" class="theme-btn">Hire Me`
  );

  // Experience headline
  html = html.replace(
    /A proven Full Stack Builder <span>with over 8 <br> years <\/span>of expertise/g,
    "A Full Stack Builder <span>shipping real <br> products <\/span>since 2023"
  );
  html = html.replace(/over 8 years/gi, "since 2023");
  html = html.replace(/8\+ year career/gi, "growing body of shipped work");

  // Awards leftover year
  html = html.replace(/<p>2020<\/p>\s*<span>Honored for customer-centric excellence<\/span>/g,
    "<p>2026</p>\n                                                                                        \n                                                                                            <span>Shipping Domus, Northern Elite &amp; WehFiGo</span>");

  // Skill counters — tech stack not CSEC
  html = html.replace(/UTech GPA/g, "TypeScript");
  html = html.replace(
    /<span class="count">3<\/span>\.7<\/h2><p>TypeScript<\/p>/,
    '<span class="count">15</span>+</h2><p>Stack tools</p>'
  );
  html = html.replace(/Bot FAQ topics/g, "FastAPI routes");
  html = html.replace(/CSEC Grade I/g, "GSAP motion");
  html = html.replace(
    /<span class="count">8<\/span><\/h2><p>GSAP motion<\/p>/,
    '<span class="count">20</span>+</h2><p>GSAP scenes</p>'
  );
  html = html.replace(/GPA 3\.7<\/span> UTech BSc CS/g, "Next.js</span> React · TypeScript");
  html = html.replace(/weROI contract/g, "Platforms live");

  // About core stack title already ok; strengthen about copy
  html = html.replace(
    /Full stack builder · messaging bots · <span>security<\/span>/g,
    "Full stack builder · platforms · <span>security</span>"
  );

  // Experience fake companies → real
  const expMap = [
    ["XYZ Innovations", "weROI"],
    ["GlobalSoft Inc", "WehFiGo"],
    ["PixelForge Labs", "Domus"],
    ["CloudBridge Co", "Northern Elite"],
    ["NeuroNet Systems", "PNTCOG"],
    ["DataPulse Agency", "DevOS"],
    ["CreativeMinds Studio", "weROI"],
    ["FutureVision Apps", "PNTCOG"],
    ["BlueWave Media", "Independent"],
    ["RedRocket Studios", "Domus"],
    ["SilverLine Creatives", "WehFiGo"],
  ];
  for (const [from, to] of expMap) {
    html = html.replace(new RegExp(from, "g"), to);
  }

  // Experience role copy — replace demo paragraphs that still talk about design internships
  html = html.replace(
    /Assisted senior team in mobile app skin updates weekly\./g,
    "Built and maintained the PNTCOG ministry site — events, content, and production deploys."
  );
  html = html.replace(
    /Shipped 50\+ screen mocks adhering to Material guidelines\./g,
    "Shipped public pages and CMS workflows for a live congregation site."
  );
  html = html.replace(
    /Designed responsive landing pages in Photoshop &amp; Dreamweaver\./g,
    "Built DevOS patterns and gold-standard site recipes reused across client builds."
  );
  html = html.replace(
    /Improved page speed scores 18% through optimized assets\./g,
    "Documented Manufacturer-Premium and contractor recipes from Domus / Northern Elite."
  );
  html = html.replace(
    /Developed print &amp; digital collateral for 40\+ clients\./g,
    "Founded and engineered weROI — React frontend, FastAPI API, MongoDB Atlas, Resend."
  );
  html = html.replace(
    /Won 2 regional awards for rebranding a local retailer\./g,
    "Shipped lead funnels, admin auth, and production ops across Vercel + Railway."
  );
  html = html.replace(
    /Supported app icon packs &amp; banner ad creatives daily\./g,
    "Frontend for portmorentcog.org — performance, SEO, and editable content flows."
  );
  html = html.replace(
    /Learned agile sprint cycles &amp; version control basics\./g,
    "Continuous delivery for a live ministry platform."
  );
  html = html.replace(
    /Created flyers &amp; event posters for local nonprofits\./g,
    "WehFiGo child theme UX — listings, pricing gates, and motion-led storytelling."
  );
  html = html.replace(
    /Laid foundation for 8\+ year career in creative industries\./g,
    "Production WordPress / Listeo engineering for Jamaican event operators."
  );
  html = html.replace(/>Junior UI Designer</g, ">Frontend Developer<");
  html = html.replace(/>Web Designer</g, ">Systems Engineer<");
  html = html.replace(/>Design Volunteer</g, ">Theme Engineer<");

  // WehFiGo telegram circle link
  html = html.replace(
    /href="https:\/\/t\.me\/zachtedem_bot" class="circle-icon"/g,
    'href="https://wehfigo.com" class="circle-icon"'
  );

  // weROI card → detail page
  html = html.replace(
    /<h3><a href="https:\/\/weroi\.net">weROI Agency Platform<\/a><\/h3>/,
    '<h3><a href="./works/weroi/">weROI Agency Platform</a></h3>'
  );
  html = html.replace(
    /href="https:\/\/weroi\.net" class="circle-icon"/,
    'href="./works/weroi/" class="circle-icon"'
  );

  // Pricing avatar stack
  html = html.replace(
    /src="wp-content\/uploads\/2026\/01\/info\.png" alt="Client Image"/g,
    'src="wp-content/uploads/zach/avatar-stack.svg" alt="Client brands"'
  );

  // Blog demo alts / titles already partially done; fix UNLOCKING leftovers in alt
  html = html.replace(
    /alt="Unlocking scalable success via data-driven insights that redefine customer engagement"/g,
    'alt="CSS Grid vs Flexbox"'
  );
  html = html.replace(
    /href="\.\/unlocking-scalable-success-via-data-driven-insights-that-redefine-customer-engagement\/"/g,
    'href="./blog/index.html"'
  );
  html = html.replace(
    /href="\.\/crafting-resilient-ecosystems-where-creativity-fuels-sustainable-expansion\/"/g,
    'href="./works/weroi/"'
  );
  html = html.replace(
    /href="\.\/driving-next-level-innovation-with-strategies-that-disrupt-conventional-markets\/"/g,
    'href="./blog/index.html"'
  );

  // Prefer PNG blog covers when available
  html = html.replace(
    /src="wp-content\/uploads\/zach\/blog-css-grid\.svg"/g,
    'src="wp-content/uploads/zach/blog-css-grid.png"'
  );
  html = html.replace(
    /src="wp-content\/uploads\/zach\/blog-weroi\.svg"/g,
    'src="wp-content/uploads/zach/blog-weroi.png"'
  );
  html = html.replace(
    /src="wp-content\/uploads\/zach\/blog-typescript\.svg"/g,
    'src="wp-content/uploads/zach/blog-typescript.png"'
  );

  // Video thumb already hero — ensure
  html = html.replace(
    /src="wp-content\/uploads\/zach\/hero-zach-full\.png" alt="Video Background"/,
    'src="wp-content/uploads/zach/video-zach.png" alt="Zachary Hutton"'
  );

  // Hero image ensure cutout
  html = html.replace(
    /class="animated-image" src="wp-content\/uploads\/zach\/[^"]+"/g,
    'class="animated-image" src="wp-content/uploads/zach/hero-zach-full.png"'
  );

  // Testimonials Northern Elite slide if missing — already 3 case cards
  // Add Northern Elite as third if still Liam — done via global

  // Contact strip / footer logo already ZH

  return html;
}

function patchBlogPage(html) {
  // Expand blog list with real posts using existing news-box markup pattern
  const posts = [
    ["CSS Grid vs Flexbox: When I Reach for Which", "blog-css-grid.png", "UI Engineering", "2025"],
    ["Building the weROI Agency Platform", "blog-weroi.png", "Case Study", "2025"],
    ["TypeScript Generics Without the Headache", "blog-typescript.png", "TypeScript", "2025"],
    ["React Server Components Explained", "blog-rsc.png", "Next.js", "2025"],
    ["REST API Design Habits That Scale", "blog-api.png", "Backend", "2025"],
    ["Core Web Vitals Guide", "blog-vitals.png", "Performance", "2025"],
    ["CORS Explained for Frontend Developers", "blog-cors.png", "Web", "2025"],
    ["Debugging Production Bugs Calmly", "blog-debug.png", "Ops", "2025"],
    ["Security Fundamentals for Shippers", "blog-security.png", "Security", "2025"],
    ["PNTCOG Ministry Site Notes", "blog-pntcog.png", "Client", "2025"],
    ["Shipping Remotely from Jamaica", "blog-jamaica.png", "Career", "2025"],
  ];

  // Replace demo titles still present
  html = html.replace(/Unlocking scalable success[^<]*/gi, posts[0][0]);
  html = html.replace(/Crafting resilient ecosystems[^<]*/gi, posts[1][0]);
  html = html.replace(/Driving next-level innovation[^<]*/gi, posts[2][0]);
  html = html.replace(/Fortifying digital assets[^<]*/gi, posts[8][0]);

  // Swap stock news images to zach covers where still 2025/11
  html = html.replace(
    /src="\.\.\/wp-content\/uploads\/2025\/11\/news-[^"]+"/g,
    'src="../wp-content/uploads/zach/blog-weroi.png"'
  );

  return html;
}

function patchContact(html) {
  html = html.replace(/10\+ years of <b>experience<\/b>/g, "Portmore, <b>Jamaica</b>");
  html = html.replace(/2\.5K\+ successfully <b>projects done<\/b>/g, "Full-stack <b>builder</b>");
  html = html.replace(/1M/g, "10+");
  html = html.replace(/Based on[^<]*/g, "Based in Portmore, Jamaica");
  return html;
}

function patchAbout(html) {
  html = html.replace(/Pixelr[^<]*/gi, "weROI");
  html = html.replace(/Shikhon Islam/gi, "Domus");
  html = html.replace(/over 8 years/gi, "since 2023");
  html = html.replace(/8 years/gi, "years shipping");
  return html;
}

function patchPortfolioPages(html, rel) {
  // Ensure project names
  const swaps = [
    [/Telegram[^<]*/gi, "WehFiGo"],
    [/StudySync[^<]*/gi, "Northern Elite"],
    [/Phone Store[^<]*/gi, "Domus"],
    [/Webhook Relay[^<]*/gi, "weROI"],
    [/OpenAPI[^<]*/gi, "PNTCOG"],
  ];
  // Don't over-aggressively wipe — only if demo titles remain
  if (/Telegram|StudySync|Phone Store/i.test(html)) {
    for (const [re, to] of swaps) html = html.replace(re, to);
  }
  html = html.replace(
    /src="([^"]*?)wp-content\/uploads\/2025\/11\/project-[^"]+"/g,
    `src="$1wp-content/uploads/zach/cover-domus.svg"`
  );
  return html;
}

function createWeroiWorkPage() {
  const aboutPath = path.join(MIRROR, "about-me", "index.html");
  if (!fs.existsSync(aboutPath)) {
    console.warn("about-me missing — cannot scaffold weROI page");
    return;
  }
  let html = fs.readFileSync(aboutPath, "utf8");
  html = globalHtmlSanitize(html, 1);
  html = html.replace(/<title>[^<]*<\/title>/i, "<title>weROI — Zachary Hutton</title>");
  html = html.replace(/>REVOX</g, ">Zachary<");

  // Replace main content area with weROI case study using about structure
  const detailBody = `
        <section class="news-grid-section1 fix pb-0">
            <div class="container">
                <h1 class="hero_title tv_hero_title hero_title_1">weROI Agency Platform</h1>
                <p style="max-width:720px;margin-top:1rem;opacity:.85">Founder &amp; full-stack engineer — who I am at weROI, and what I ship day to day.</p>
            </div>
        </section>
        <section class="about-section section-padding">
            <div class="container">
                <div class="row g-4 align-items-start">
                    <div class="col-lg-6">
                        <img decoding="async" src="../../wp-content/uploads/zach/cover-weroi.svg" alt="weROI" style="width:100%;border-radius:12px;">
                        <p style="margin-top:1rem"><a class="theme-btn" href="https://weroi.net" target="_blank" rel="noopener">Visit weroi.net <i class="fa-solid fa-arrow-up-right"></i></a></p>
                    </div>
                    <div class="col-lg-6">
                        <h6>Who I am at weROI</h6>
                        <h2 class="hero_title tv_hero_title hero_title_1">Founder &amp; builder of the <span>agency platform</span></h2>
                        <p>I founded weROI and engineer the full stack: a React marketing frontend, FastAPI API layer, and MongoDB Atlas persistence for lead capture, analytics, and admin operations. Live at <a href="https://weroi.net">weroi.net</a>.</p>
                        <h3 style="margin-top:1.5rem">What I do day-to-day</h3>
                        <ul>
                            <li>Ship multi-step audit funnels and guide-download capture flows</li>
                            <li>Build typed FastAPI REST endpoints with Pydantic validation</li>
                            <li>Store leads &amp; analytics events in MongoDB Atlas</li>
                            <li>Secure admin routes for reviewing opportunities</li>
                            <li>Wire Resend transactional email on funnel completion</li>
                            <li>Deploy frontend on Vercel and API on Railway with health checks</li>
                        </ul>
                        <h3 style="margin-top:1.5rem">Problem → Approach → Outcome</h3>
                        <p><b>Problem:</b> weROI needed a client-facing site that captures leads through multi-step funnels, stores submissions reliably, and gives admins a secure review path — without exposing secrets across Vercel + Railway.</p>
                        <p><b>Approach:</b> React SPA + FastAPI + MongoDB Atlas, password-protected admin, Resend email sequences, CORS-aware split deploy, and built-in funnel analytics.</p>
                        <p><b>Stack:</b> React, TypeScript, Tailwind, FastAPI, MongoDB Atlas, Resend, Vercel, Railway, GSAP / Framer Motion.</p>
                        <p><b>Outcome:</b> Production agency platform with lead funnels, admin tooling, and email automation live on weroi.net.</p>
                        <p style="margin-top:1.5rem"><a class="theme-btn" href="../contact-us/index.html">Hire Me <i class="fa-solid fa-arrow-up-right"></i></a></p>
                    </div>
                </div>
            </div>
        </section>
`;

  // Inject after page-area / entry-content start if possible
  if (html.includes('class="entry-content"')) {
    html = html.replace(
      /(<div class="entry-content">)([\s\S]*?)(<\/div>\s*<\/div>\s*<footer|<\/div>\s*<footer)/i,
      `$1${detailBody}$3`
    );
  } else if (html.includes("page-area")) {
    html = html.replace(
      /(<div class="page-area">)([\s\S]*?)(<footer)/i,
      `$1${detailBody}$3`
    );
  }

  const outDir = path.join(MIRROR, "works", "weroi");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log("wrote works/weroi/index.html");
}

function patchNextConfig() {
  const cfgPath = path.join(ROOT, "next.config.ts");
  let cfg = fs.readFileSync(cfgPath, "utf8");
  if (cfg.includes("works/weroi")) return;
  cfg = cfg.replace(
    '  "our-faq",\n].flatMap',
    '  "our-faq",\n  "works/weroi",\n].flatMap'
  );
  // also support works/weroi path with nested slug
  if (!cfg.includes('source: "/works/weroi"')) {
    cfg = cfg.replace(
      "async rewrites() {\n    return {\n      beforeFiles: [",
      `async rewrites() {\n    return {\n      beforeFiles: [\n        {\n          source: "/works/weroi",\n          destination: \`\${mirror}/works/weroi/index.html\`,\n        },\n        {\n          source: "/works/weroi/",\n          destination: \`\${mirror}/works/weroi/index.html\`,\n        },`
    );
  }
  fs.writeFileSync(cfgPath, cfg);
  console.log("next.config rewrites updated");
}

function relDepthFor(file) {
  const rel = path.relative(MIRROR, path.dirname(file));
  if (!rel || rel === ".") return 0;
  return rel.split(path.sep).filter(Boolean).length;
}

async function main() {
  console.log("=== ship start ===");
  writeAssets();
  await ensurePortrait();
  patchCssGreenAndMarquee();
  patchMainJsHeader();
  createWeroiWorkPage();
  patchNextConfig();

  const files = walkHtml(MIRROR);
  for (const file of files) {
    let html = fs.readFileSync(file, "utf8");
    const depth = relDepthFor(file);
    const before = html;
    html = globalHtmlSanitize(html, depth);
    const base = path.basename(path.dirname(file)) + "/" + path.basename(file);
    if (file.endsWith(`${path.sep}index.html`) && depth === 0) {
      html = patchIndex(html);
    }
    if (file.includes(`${path.sep}blog${path.sep}`)) html = patchBlogPage(html);
    if (file.includes(`${path.sep}contact-us${path.sep}`)) html = patchContact(html);
    if (file.includes(`${path.sep}about-me${path.sep}`)) html = patchAbout(html);
    if (file.includes("portfolio")) html = patchPortfolioPages(html, depth);

    // Secondary home variants — fill with Zach tech positioning
    if (/web-developer|graphic-designer|fashion-model/.test(file)) {
      html = html.replace(/>REVOX</g, ">Zachary<");
      html = html.replace(/Fashion Model/g, "Case Studies");
      html = html.replace(/Graphic Designer/gi, "Product Engineer");
      html = html.replace(/1M/g, "10+");
    }

    if (html !== before) {
      fs.writeFileSync(file, html);
      console.log("patched", path.relative(MIRROR, file));
    }
  }

  // Fix #1500ff in any remaining cover SVG
  for (const f of fs.readdirSync(ZACH)) {
    if (!f.endsWith(".svg")) continue;
    let s = fs.readFileSync(path.join(ZACH, f), "utf8");
    if (s.includes("1500ff")) {
      s = s.replace(/#1500ff/gi, "#BFF747");
      fs.writeFileSync(path.join(ZACH, f), s);
    }
  }

  console.log("=== ship done ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
