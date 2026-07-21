/**
 * Final publish scrub — content/href/text only inside Revox HTML slots.
 * Does not redesign template structure.
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
      if (name === "wp-content" || name === "wp-includes") continue;
      walkHtml(full, out);
    } else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

function relDepth(file) {
  const rel = path.relative(MIRROR, path.dirname(file)).replace(/\\/g, "/");
  if (!rel || rel === ".") return 0;
  return rel.split("/").filter(Boolean).length;
}

function contactHref(depth) {
  return depth === 0 ? "./contact-us/index.html" : "../".repeat(depth) + "contact-us/index.html";
}

function servicesHref(depth) {
  return depth === 0 ? "./services/index.html" : "../".repeat(depth) + "services/index.html";
}

function blogHref(depth) {
  return depth === 0 ? "./blog/index.html" : "../".repeat(depth) + "blog/index.html";
}

function weroiHref(depth) {
  return depth === 0 ? "./works/weroi/" : "../".repeat(depth) + "works/weroi/";
}

function scrub(html, file) {
  const depth = relDepth(file);
  const contact = contactHref(depth);
  const services = servicesHref(depth);
  const blog = blogHref(depth);
  const weroi = weroiHref(depth);

  // Feed / meta branding
  html = html.replace(/title="Revox » Feed"/g, 'title="Zachary Hutton Feed"');
  html = html.replace(
    /title="Revox » Comments Feed"/g,
    'title="Zachary Hutton Comments"'
  );
  html = html.replace(/Fashion%20Model%20%E2%80%93%20Revox/g, "Case%20Studies%20%E2%80%93%20Zachary%20Hutton");
  html = html.replace(/Graphic%20designer%20%E2%80%93%20Revox/g, "Product%20Engineer%20%E2%80%93%20Zachary%20Hutton");
  html = html.replace(/%E2%80%93%20Revox/g, "%E2%80%93%20Zachary%20Hutton");
  html = html.replace(/– Revox/g, "– Zachary Hutton");
  html = html.replace(/— Revox/g, "— Zachary Hutton");

  // Broken / demo detail routes
  html = html.replace(
    /href="(\.\/|\.\.\/)*services\/mobile-app-development\/"/g,
    `href="${services}"`
  );
  html = html.replace(
    /href="(\.\/|\.\.\/)*fortifying-digital-assets-against-evolving-threats-in-a-hybrid-world\/"/g,
    `href="${blog}"`
  );
  html = html.replace(
    /href="(\.\/|\.\.\/)*works\/web-ui-ux-design\/"/g,
    `href="${weroi}"`
  );
  html = html.replace(
    /href="[^"]*Revox-Resume\.pdf"/gi,
    `href="${contact}"`
  );

  // Resume / location leftovers
  html = html.replace(
    /based in florida, download resume/gi,
    "Portmore, Jamaica — request resume"
  );
  html = html.replace(/Download Resume/gi, "Contact Me");
  html = html.replace(
    /based in florida, newyork with over 5 years of experience/gi,
    "based in Portmore, Jamaica — UTech CS, shipping since 2023"
  );
  html = html.replace(/florida, newyork/gi, "Portmore, Jamaica");
  html = html.replace(/based in florida/gi, "based in Portmore, Jamaica");

  // FAQ
  html = html.replace(
    /How does the revox workflow unfold\?/gi,
    "How does a typical project with Zachary unfold?"
  );

  // Studio / fake CEO testimonials
  html = html.replace(/revox Studio/gi, "Zachary");
  html = html.replace(/CEO at CreativePixels Studio/gi, "Case note · Domus");
  html = html.replace(/CEO at Revox Studio/gi, "Case note · weROI");
  html = html.replace(/CEO at NovaSphere Labs/gi, "Case note · WehFiGo");
  html = html.replace(/CEO at RollUpLife Inc/gi, "Case note · Northern Elite");
  html = html.replace(/CEO at BrightWave Dynamics/gi, "Case note · PNTCOG");

  // Fashion model page → case studies (tech)
  html = html.replace(/>fashion Model</gi, ">Case Studies<");
  html = html.replace(/fashion Model/gi, "Case Studies");
  html = html.replace(/my modeling journey/gi, "selected case studies");
  html = html.replace(
    /I am a professional fashion model driven by elegance, creativity, and timeless style\. With experience across editorial, runway, and commercial shoots, I bring sophistication and emotion to every project\. My presence in front of the camera reflects confidence, grace, and individuality\. For me, fashion is an art — a way to express beauty beyond boundaries\./gi,
    "Selected builds across manufacturer sites, contractor platforms, agency software, events, and ministry — Domus, Northern Elite, WehFiGo, weROI, and PNTCOG. Each case is engineered for performance, clarity, and long-term growth."
  );
  html = html.replace(
    /Working with this brand has completely transformed my journey as a fashion model\. Their creative vision, attention to detail, and commitment to high-quality work make every project feel effortless and inspiring\. From the very first shoot, I felt supported, confident, and truly valued\./gi,
    "Shipped a premium manufacturer site and contractor platform stack — Next.js, Tailwind, GSAP motion, and lead funnels built for real client acquisition."
  );

  // Graphic design category leftovers → tech labels
  html = html.replace(/>graphic design</gi, ">Web Development<");
  html = html.replace(/>Graphic Design</g, ">Web Development<");
  html = html.replace(/graphic design/gi, "web development");
  html = html.replace(/>Graphic Designer</g, ">Full Stack Developer<");

  // Product engineer page demo body
  html = html.replace(
    /I'm a passionate Product Engineer who loves turning ideas into visually engaging designs\. With expertise in branding, logo design, and digital graphics, I focus on creating designs that leave a lasting impression\./gi,
    "I'm a product-minded full stack engineer who turns business requirements into shipped platforms — Next.js frontends, FastAPI/Node APIs, MongoDB, and automation that compounds."
  );
  html = html.replace(
    /A Senior Product Engineer based in Portmore, Jamaica — UTech CS, shipping since 2023, crafting user-centric fintech and web experiences\. Blending product thinking with visual design\./gi,
    "A full stack / product engineer based in Portmore, Jamaica — UTech CS, shipping since 2023. Blending product thinking with production engineering across web platforms."
  );

  // Whitney / brand identity demo quotes on product page
  html = html.replace(
    /Zachary has created remarkable work for The Whitney building that helped us define not just this individual building but the new direction in which we are heading as a group/gi,
    "Domus shipped as a premium manufacturer site — clear IA, motion-led storytelling, and a conversion path built for Kingston buyers."
  );
  html = html.replace(
    /Working with Zachary elevated our brand identity beyond expectations—every design choice felt intentional and perfectly aligned with our vision\./gi,
    "Northern Elite concrete contractor site — services IA, gallery systems, and lead capture tuned for Red Deer acquisition."
  );

  // Web developer fake studio testimonials
  html = html.replace(
    /Working with Zachary transformed our digital presence completely\. Their innovative approach and attention to detail delivered results beyond/gi,
    "WehFiGo event platform work — Listeo child theme, pricing gates, auth, and Jamaica-first UX shipped to production."
  );
  html = html.replace(
    /The team at Zachary exceeded all our expectations\. Their creative solutions and strategic thinking helped us achieve remarkable growth in just six months\./gi,
    "weROI agency platform — React frontend, FastAPI API, MongoDB Atlas, and Resend email — founded and engineered end to end."
  );
  html = html.replace(
    /Choosing Zachary was the best decision for our brand\. Their expertise and dedication brought our vision to life with stunning results that truly resonate\./gi,
    "PNTCOG ministry site — events, content workflows, and production deploys for portmorentcog.org."
  );

  // Visible REVOX text nodes only
  html = html.replace(/>REVOX</g, ">Zachary<");
  html = html.replace(/>Revox</g, ">Zachary<");

  // Hire Me casing + contact
  html = html.replace(/>\s*hire me\s*</gi, ">Hire Me<");
  html = html.replace(
    /<a href="mailto:hzach577@gmail\.com" class="theme-btn">Hire Me/g,
    `<a href="${contact}" class="theme-btn">Hire Me`
  );

  return html;
}

const files = walkHtml(MIRROR);
let n = 0;
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = scrub(before, file);
  if (after !== before) {
    fs.writeFileSync(file, after);
    n++;
    console.log("scrubbed", path.relative(MIRROR, file));
  }
}
console.log("done", n, "files of", files.length);
