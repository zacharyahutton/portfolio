/**
 * Inject Google-style testimonials section + /testimonials page content + nav.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MIRROR = path.join(ROOT, "public/revox-mirror/revox.baseecom.com");

const GOOGLE_G = `<svg class="zh-review-google" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`;

const STARS = `<div class="zh-review-stars" aria-label="5 out of 5 stars"><span></span><span></span><span></span><span></span><span></span></div>`;

function liveCard({ href, quote, name, when, role, initials, aria }) {
  return `<a class="zh-review-card" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${aria}">
 <div class="zh-review-top">${STARS}${GOOGLE_G}</div>
 <p class="zh-review-quote">“${quote}”</p>
 <div class="zh-review-divider"></div>
 <div class="zh-review-author">
 <div class="zh-review-avatar" aria-hidden="true">${initials}</div>
 <div class="zh-review-meta">
 <p class="zh-review-name">${name} <span>· ${when}</span></p>
 <p class="zh-review-role">${role}</p>
 </div>
 </div>
 </a>`;
}

function pendingCard({ href, project, blurb, initials, aria }) {
  return `<a class="zh-review-card zh-review-card--pending" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${aria}">
 <div class="zh-review-top">${STARS}${GOOGLE_G}</div>
 <p class="zh-review-quote">Client feedback for ${project} will appear here once published. ${blurb}</p>
 <div class="zh-review-divider"></div>
 <div class="zh-review-author">
 <div class="zh-review-avatar zh-review-avatar--pending" aria-hidden="true">${initials}</div>
 <div class="zh-review-meta">
 <p class="zh-review-name">Coming soon <span>· awaiting review</span></p>
 <p class="zh-review-role">${project}</p>
 </div>
 </div>
 </a>`;
}

const CARDS = [
  liveCard({
    href: "https://portmorentcog.org",
    quote:
      "Zach did excellent work on our church website. The build is professional and thoughtful, and our media team loves how it turned out. Leadership is ready to announce it, and we are proud to share portmorentcog.org with our congregation.",
    name: "Tamara Corke Watson",
    when: "1 week ago",
    role: "Media Team Leader, PNTCOG",
    initials: "TC",
    aria: "Read PNTCOG testimonial and visit portmorentcog.org",
  }),
  pendingCard({
    href: "https://weroi.net",
    project: "weROI",
    blurb: "Visit the live platform meanwhile.",
    initials: "WR",
    aria: "weROI feedback coming soon, visit weroi.net",
  }),
  pendingCard({
    href: "https://domus-topaz.vercel.app",
    project: "Domus",
    blurb: "Visit the live manufacturer site meanwhile.",
    initials: "DM",
    aria: "Domus feedback coming soon, visit live site",
  }),
  pendingCard({
    href: "https://northern-elite.vercel.app",
    project: "Northern Elite",
    blurb: "Visit the live contractor site meanwhile.",
    initials: "NE",
    aria: "Northern Elite feedback coming soon, visit live site",
  }),
  pendingCard({
    href: "https://wehfigo.com",
    project: "WehFiGo",
    blurb: "Visit the live events platform meanwhile.",
    initials: "WF",
    aria: "WehFiGo feedback coming soon, visit wehfigo.com",
  }),
  pendingCard({
    href: "/works/devos/",
    project: "DevOS",
    blurb: "Open the case study meanwhile.",
    initials: "DO",
    aria: "DevOS feedback coming soon, open case study",
  }),
].join("\n");

const HOME_SECTION = ` <section id="testimonials" class="testimonial-section zh-reviews-section fix section-padding pt-0">
 <div class="container">
 <div class="section-title-area mb-4">
 <div class="section-title mb-0">
 <h6>testimonials</h6>
 <h2 class="hero_title tv_hero_title hero_title_1">What clients <span>say</span></h2>
 </div>
 <a href="/testimonials/" class="theme-btn zh-btn-outline zh-btn-sm">All testimonials <i class="fa-solid fa-arrow-up-right"></i></a>
 </div>
 <div class="zh-reviews-grid">
${CARDS}
 </div>
 </div>
 </section>`;

const PAGE_BODY = ` <section class="zh-reviews-section zh-reviews-page fix section-padding">
 <div class="container">
 <div class="section-title mb-4">
 <h6>testimonials</h6>
 <h1 class="hero_title tv_hero_title hero_title_1">Client feedback on live work</h1>
 <p class="zh-reviews-lede">Real reviews from shipped projects. Placeholders stay until each client publishes feedback. Nothing here invents praise for unfinished work.</p>
 </div>
 <div class="zh-reviews-grid">
${CARDS}
 </div>
 </div>
 </section>`;

function injectNav(html) {
  // Desktop / offcanvas: after Portfolio
  let out = html.replace(
    /(<li[^>]*menu-item-47[^>]*>\s*<a href="\/portfolio-page\/">Portfolio<\/a><\/li>)/g,
    `$1\n<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-testimonials"><a href="/testimonials/">Testimonials</a></li>`
  );
  // Avoid double-inject
  out = out.replace(
    /(menu-item-testimonials"><a href="\/testimonials\/">Testimonials<\/a><\/li>\s*){2,}/g,
    `$1`
  );
  // Footer quick links
  out = out.replace(
    /(<a href="\/portfolio-page\/">\s*PORTFOLIO\s*<\/a>\s*<\/li>)/i,
    `$1\n <li>\n <a href="/testimonials/">\n TESTIMONIALS </a>\n </li>`
  );
  return out;
}

function injectDrawerString(html) {
  return html.replace(
    /(<a class="zh-nav-top" href="\/portfolio-page\/">Portfolio<\/a>)/g,
    `$1<a class="zh-nav-top" href="/testimonials/">Testimonials</a>`
  );
}

// Homepage section replace
const indexPath = path.join(MIRROR, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(
  /<section class="testimonial-section fix section-padding pt-0">[\s\S]*?<\/section>/,
  HOME_SECTION
);
index = injectNav(index);
index = injectDrawerString(index);
index = index.replace(/zhfix29/g, "zhfix30");
fs.writeFileSync(indexPath, index);

// zh-site-fix.js drawer
const jsPath = path.join(MIRROR, "wp-content/uploads/zach/zh-site-fix.js");
let js = fs.readFileSync(jsPath, "utf8");
if (!js.includes('/testimonials/')) {
  js = js.replace(
    "'<a class=\"zh-nav-top\" href=\"/portfolio-page/\">Portfolio</a>' +",
    "'<a class=\"zh-nav-top\" href=\"/portfolio-page/\">Portfolio</a>' +\n    '<a class=\"zh-nav-top\" href=\"/testimonials/\">Testimonials</a>' +"
  );
  fs.writeFileSync(jsPath, js);
}

// Testimonials page from FAQ clone
const pagePath = path.join(MIRROR, "testimonials/index.html");
let page = fs.readFileSync(pagePath, "utf8");
page = page
  .replace(/FAQ, Zachary Hutton/g, "Testimonials, Zachary Hutton")
  .replace(/Answers about working with Zachary Hutton: stack, timeline, mobile, and how to hire\./g, "Client testimonials for Zachary Hutton. Real feedback from live projects, with more reviews added as clients publish them.")
  .replace(/https:\/\/zacharyhutton\.online\/our-faq\//g, "https://zacharyhutton.online/testimonials/")
  .replace(/frequently asked questions/i, "testimonials");
page = page.replace(
  /<section class="news-grid-section1 fix">[\s\S]*?<\/section>/,
  PAGE_BODY
);
page = injectNav(page);
page = injectDrawerString(page);
// Fix relative paths already ../ from copy
fs.writeFileSync(pagePath, page);

// next.config
const cfgPath = path.join(ROOT, "next.config.ts");
let cfg = fs.readFileSync(cfgPath, "utf8");
if (!cfg.includes('"testimonials"')) {
  cfg = cfg.replace('"our-faq",', '"our-faq",\n  "testimonials",');
  fs.writeFileSync(cfgPath, cfg);
}

console.log("OK: homepage section, /testimonials/, nav, rewrite");
