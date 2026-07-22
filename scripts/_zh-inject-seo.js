/**
 * Inject sitewide SEO + Open Graph + Twitter Card + JSON-LD into mirror HTML.
 * Domain: https://zacharyhutton.online
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com"
);
const SITE = "https://zacharyhutton.online";
const OG_IMAGE = `${SITE}/og.jpg`;
const DEFAULT_DESC =
  "Zachary Hutton builds premium websites, scalable business platforms, AI-powered automation, and custom software from Portmore, Jamaica.";

const PAGE_META = {
  "": {
    title: "Zachary Hutton, Full Stack Developer",
    description: DEFAULT_DESC,
    path: "/",
  },
  "about-me": {
    title: "About Me, Zachary Hutton",
    description:
      "Full stack developer from Portmore, Jamaica. Building premium websites, platforms, and AI systems for real businesses.",
    path: "/about-me/",
  },
  "hire-me": {
    title: "Hire Me, Zachary Hutton",
    description:
      "Hire Zachary Hutton for premium websites, custom software, AI integrations, and business platforms.",
    path: "/hire-me/",
  },
  "contact-us": {
    title: "Contact, Zachary Hutton",
    description:
      "Get in touch with Zachary Hutton for web, software, and automation projects.",
    path: "/contact-us/",
  },
  services: {
    title: "Services, Zachary Hutton",
    description:
      "Premium business websites, custom software, AI integrations, automation, SEO, and platform builds.",
    path: "/services/",
  },
  "portfolio-page": {
    title: "Portfolio, Zachary Hutton",
    description:
      "Selected work from Zachary Hutton: weROI, WehFiGo, Domus, Northern Elite, PNTCOG, and more.",
    path: "/portfolio-page/",
  },
  blog: {
    title: "Blog, Zachary Hutton",
    description:
      "Practical notes on frontend, TypeScript, performance, security, and shipping real products.",
    path: "/blog/",
  },
  "our-faq": {
    title: "FAQ, Zachary Hutton",
    description:
      "Answers about working with Zachary Hutton: stack, timeline, mobile, and how to hire.",
    path: "/our-faq/",
  },
};

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "wp-content" || name === "wp-includes") continue;
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) walk(fp, out);
    else if (name === "index.html") out.push(fp);
  }
}

function slugFromFile(fp) {
  const rel = path.relative(ROOT, path.dirname(fp)).replace(/\\/g, "/");
  return rel === "" ? "" : rel;
}

function buildBlock(meta) {
  const title = meta.title;
  const desc = meta.description;
  const url = `${SITE}${meta.path}`;
  const isHome = meta.path === "/";

  const jsonLd = isHome
    ? `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Zachary Hutton","url":"${SITE}/","jobTitle":"Full Stack Developer","description":${JSON.stringify(DEFAULT_DESC)},"address":{"@type":"PostalAddress","addressLocality":"Portmore","addressCountry":"JM"},"sameAs":["https://github.com/zacharyahutton","https://www.linkedin.com/in/zacharyahutton","https://www.instagram.com/zacharyahutton"]}
</script>`
    : `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":${JSON.stringify(title)},"description":${JSON.stringify(desc)},"url":${JSON.stringify(url)},"isPartOf":{"@type":"WebSite","name":"Zachary Hutton","url":"${SITE}/"}}
</script>`;

  return `<!-- ZH_SEO_V1 -->
<meta name="description" content="${desc.replace(/"/g, "&quot;")}">
<meta name="author" content="Zachary Hutton">
<meta name="theme-color" content="#0a0a0a">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${isHome ? "website" : "article"}">
<meta property="og:site_name" content="Zachary Hutton">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${title.replace(/"/g, "&quot;")}">
<meta property="og:description" content="${desc.replace(/"/g, "&quot;")}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:secure_url" content="${OG_IMAGE}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Zachary Hutton, Full Stack Developer">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}">
<meta name="twitter:description" content="${desc.replace(/"/g, "&quot;")}">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta name="twitter:image:alt" content="Zachary Hutton, Full Stack Developer">
${jsonLd}
<!-- /ZH_SEO_V1 -->`;
}

const files = [];
walk(ROOT, files);
let patched = 0;

for (const fp of files) {
  let html = fs.readFileSync(fp, "utf8");
  const slug = slugFromFile(fp);

  // Remove previous inject
  html = html.replace(
    /<!-- ZH_SEO_V1 -->[\s\S]*?<!-- \/ZH_SEO_V1 -->\s*/g,
    ""
  );

  let meta = PAGE_META[slug];
  if (!meta) {
    const m = html.match(/<title>([^<]*)<\/title>/i);
    const title = (m ? m[1].trim() : "Zachary Hutton").replace(/\s+/g, " ");
    const pathPart = slug ? `/${slug}/` : "/";
    meta = {
      title: title || "Zachary Hutton",
      description: DEFAULT_DESC,
      path: pathPart,
    };
  }

  const block = buildBlock(meta);

  // Fix broken relative canonical if present
  html = html.replace(
    /<link rel="canonical"[^>]*>\s*/i,
    ""
  );

  if (/<title>[^<]*<\/title>/i.test(html)) {
    html = html.replace(
      /(<title>[^<]*<\/title>)/i,
      `$1\n${block}`
    );
  } else if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head[^>]*>/i, (h) => `${h}\n${block}`);
  } else {
    continue;
  }

  // Prefer absolute title for known pages
  if (PAGE_META[slug]) {
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${PAGE_META[slug].title}</title>`
    );
  }

  fs.writeFileSync(fp, html);
  patched++;
}

fs.writeFileSync(
  path.join(__dirname, "../public/robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`
);

const urls = [
  "/",
  "/about-me/",
  "/services/",
  "/portfolio-page/",
  "/blog/",
  "/hire-me/",
  "/contact-us/",
  "/our-faq/",
  "/works/weroi/",
  "/works/wehfigo/",
  "/works/domus/",
  "/works/northern-elite/",
  "/works/pntcog/",
  "/works/devos/",
  "/services/premium-business-websites/",
  "/services/custom-software/",
  "/services/ai-integrations/",
  "/privacy-policy/",
  "/terms/",
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), sitemap);

console.log(JSON.stringify({ patched, files: files.length, og: OG_IMAGE }));
