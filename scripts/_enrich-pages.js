const fs = require("fs");
const path = require("path");
const m = path.join(__dirname, "..", "public", "revox-mirror", "revox.baseecom.com");

// Enrich web-developer page — keep section types, fill tech stack extensively
const wd = path.join(m, "web-developer", "index.html");
if (fs.existsSync(wd)) {
  let html = fs.readFileSync(wd, "utf8");
  html = html.replace(/>REVOX</g, ">Zachary<");
  // Generic demo headlines → Zach tech positioning without changing structure
  html = html.replace(/I'?m a Web Developer/gi, "I'm Zachary Hutton");
  html = html.replace(/Creative Web Developer/gi, "Full Stack Developer");
  html = html.replace(
    /HTML, CSS, JavaScript/gi,
    "Next.js, React, TypeScript, Tailwind, GSAP, FastAPI, MongoDB, Vercel"
  );
  html = html.replace(/WordPress/gi, "Next.js");
  fs.writeFileSync(wd, html);
  console.log("enriched web-developer");
}

// Portfolio pages — ensure project titles/links
for (const page of ["portfolio-page", "portfolio-grid"]) {
  const f = path.join(m, page, "index.html");
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, "utf8");
  // Point portfolio details to weROI work page
  html = html.replace(
    /href="\.\.\/works\/web-ui-ux-design\/"/g,
    'href="../works/weroi/"'
  );
  // Soften remaining demo project names if any stock titles remain
  html = html.replace(/Web UI\/UX Design/gi, "weROI Agency Platform");
  html = html.replace(/Mobile App Design/gi, "Domus Manufacturer Site");
  html = html.replace(/Brand Identity/gi, "Northern Elite Concrete");
  html = html.replace(/Dashboard Design/gi, "WehFiGo Events Platform");
  html = html.replace(/E-commerce Design/gi, "PNTCOG Ministry Site");
  fs.writeFileSync(f, html);
  console.log("enriched", page);
}

// Services page
const svc = path.join(m, "services", "index.html");
if (fs.existsSync(svc)) {
  let html = fs.readFileSync(svc, "utf8");
  html = html.replace(/Mobile App Development/gi, "Custom Software");
  html = html.replace(/Brand Identity Design/gi, "Premium Websites");
  html = html.replace(/Digital Marketing/gi, "AI Automation");
  html = html.replace(/Frontend Development/gi, "Full-Stack Platforms");
  html = html.replace(/E-commerce Solutions/gi, "Client &amp; Ministry Sites");
  fs.writeFileSync(svc, html);
  console.log("enriched services");
}

// Blog — wipe remaining demo title fragments
const blog = path.join(m, "blog", "index.html");
if (fs.existsSync(blog)) {
  let html = fs.readFileSync(blog, "utf8");
  html = html.replace(/Unlocking scalable[^<]*/gi, "CSS Grid vs Flexbox: When I Reach for Which");
  html = html.replace(/Crafting resilient[^<]*/gi, "Building the weROI Agency Platform");
  html = html.replace(/Driving next-level[^<]*/gi, "TypeScript Generics Without the Headache");
  html = html.replace(/Fortifying digital[^<]*/gi, "Security Fundamentals for Shippers");
  html = html.replace(/hi\.revox@gmail\.com/gi, "hzach577@gmail.com");
  html = html.replace(/>REVOX</g, ">Zachary<");
  // Prefer professional covers
  html = html.replace(
    /src="\.\.\/wp-content\/uploads\/2025\/11\/news-[^"]+"/g,
    'src="../wp-content/uploads/zach/blog-weroi.png"'
  );
  fs.writeFileSync(blog, html);
  console.log("enriched blog");
}

console.log("enrich done");
