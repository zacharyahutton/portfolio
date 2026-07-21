/**
 * Revox-mirror CONTENT ONLY. Never touches React rebuild.
 */
const fs = require("fs");
const path = require("path");

const INDEX = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com",
  "index.html"
);

let html = fs.readFileSync(INDEX, "utf8");
const before = html;

// Hero typewriter roles
html = html.replace(
  /<strong id="typing-text">[^<]*<\/strong>/,
  '<strong id="typing-text">Full Stack Developer, AI Automation, Custom Software</strong>'
);

// CTA body
html = html.replace(
  /Then you're in the right place\. Get the best designs you're <br> looking for\. Just reach out and let me know!/,
  "I design and ship premium websites, scalable platforms, AI automation, and custom software engineered for performance and growth. <br> Reach out — let's build."
);

// Fake WhatsApp number → email mailto style link text keep whatsapp but use email or remove tel
html = html.replace(
  /href="tel:005544388999"/g,
  'href="mailto:hzach577@gmail.com"'
);

// Pricing
html = html.replace(/<h2>\$149<\/h2>/, "<h2>$399</h2>");
html = html.replace(/<h2>\$299<\/h2>/, "<h2>$1,200</h2>");

// Awards year leftover
html = html.replace(/<p>2010<\/p>/g, "<p>2023</p>");
html = html.replace(/<p>2011<\/p>/g, "<p>2024</p>");
html = html.replace(/<p>2012<\/p>/g, "<p>2025</p>");
html = html.replace(/<p>2013<\/p>/g, "<p>2026</p>");

// Experience fake years → recent
html = html.replace(/Jun 2019 – Feb 2021/g, "2024 – Present");
html = html.replace(/Aug 2017 – May 2019/g, "2023 – 2024");
html = html.replace(/Nov 2011 – Apr 2013/g, "2025 – 2026");
html = html.replace(/Oct 2007 – Jan 2009/g, "2026");
html = html.replace(/Jun 2006 – Sep 2007/g, "2026");
html = html.replace(/Oct 2007 – Jan 2009/g, "2024 – 2025");

// Fake company names in experience → his brands
html = html.replace(/>CreativeMinds Studio</g, ">weROI<");
html = html.replace(/>FutureVision Apps</g, ">PNTCOG<");
html = html.replace(/>BlueWave Media</g, ">Independent<");
html = html.replace(/>RedRocket Studios</g, ">Domus / DevOS<");
html = html.replace(/>GlobalSoft Inc</g, ">WehFiGo<");
html = html.replace(/>Pixelr[^<]*/g, ">Project highlight");

// Job titles
html = html.replace(/>Design Intern</g, ">Frontend Developer<");
html = html.replace(/>Freelance Designer</g, ">Freelance Developer<");
html = html.replace(/>Graphic Designer</g, ">Founder &amp; Engineer<");

// Remove Telegram bot portfolio card — replace with Domus if not already
html = html.replace(
  /<img decoding="async" src="wp-content\/uploads\/zach\/tendem-demo-bot-cover\.png" alt="Telegram Demo Bot">/,
  '<img decoding="async" src="wp-content/uploads/zach/domus-cover.png" alt="Domus">'
);
html = html.replace(
  /<p>Personal · FastAPI \/ Telegram<\/p>/,
  "<p>Client · Next.js / Vercel</p>"
);
html = html.replace(
  /<h3><a href="https:\/\/t\.me\/zachtedem_bot">Telegram Demo Bot<\/a><\/h3>/,
  '<h3><a href="https://domus-topaz.vercel.app">Domus</a></h3>'
);

// Services: Telegram bots → AI Integrations
html = html.replace(
  />Telegram bots &amp; LLM chat</g,
  ">AI Integrations &amp; Automation<"
);
html = html.replace(
  /Automate booking, FAQ, and support on Telegram with reliable webhooks and FAQ fallbacks\./g,
  "LLM chat, intelligent workflows, and automation with resilient fallbacks when models fail."
);

// Soften about telegram line but keep truthful skills
html = html.replace(
  /I ship full stack web apps and messaging bots: Telegram Bot API, FastAPI webhooks, async Python, LLM chat with Groq and OpenAI\./g,
  "I ship full stack web apps and platforms: Next.js, FastAPI, MongoDB, LLM chat with Groq and OpenAI — including weROI."
);

// Logo alts
html = html.replace(/alt="img"/g, 'alt="Zachary"');

// Meta Revox leftovers
html = html.replace(/Revox » Feed/g, "Zachary Hutton Feed");
html = html.replace(/Revox » Comments Feed/g, "Zachary Hutton Comments");

if (html !== before) {
  fs.writeFileSync(INDEX, html, "utf8");
  console.log("index.html patched");
} else {
  console.log("index.html unchanged");
}

// Copy hero if source exists
const srcCandidates = [
  path.join(
    process.env.USERPROFILE || "",
    ".cursor",
    "projects",
    "c-Users-EverybodyHatesA1one-Documents-PORTFOLIO",
    "assets",
    "c__Users_EverybodyHatesA1one_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Adobe_Express_-_file-fc09eb62-36b0-4b0b-aeb3-be80ac7ad77d.png"
  ),
  path.join(__dirname, "..", "public", "zach", "zachary-hutton-hero.png"),
];
const destDir = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com",
  "wp-content",
  "uploads",
  "zach"
);
fs.mkdirSync(destDir, { recursive: true });
for (const src of srcCandidates) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(destDir, "hero-zach-full.png"));
    fs.copyFileSync(src, path.join(destDir, "hero-zach.png"));
    console.log("copied hero from", src);
    break;
  }
}

console.log("done");
