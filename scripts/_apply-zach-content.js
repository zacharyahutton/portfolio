const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MIRROR = path.join(ROOT, 'public', 'revox-mirror', 'revox.baseecom.com');
const INDEX = path.join(MIRROR, 'index.html');
const BACKUP_PUB = path.join(ROOT, 'backup', 'pre-revox-2026-07-20', 'public');
const ZACH_ASSETS = path.join(MIRROR, 'wp-content', 'uploads', 'zach');
const UPLOADS_01 = path.join(MIRROR, 'wp-content', 'uploads', '2026', '01');

fs.mkdirSync(ZACH_ASSETS, { recursive: true });

function copy(src, dest) {
  if (!fs.existsSync(src)) {
    console.log('MISSING', src);
    return false;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('copied', path.basename(src), '->', path.relative(MIRROR, dest));
  return true;
}

// --- Assets ---
copy(path.join(BACKUP_PUB, 'zachary-hutton-portrait.png'), path.join(ZACH_ASSETS, 'zachary-hutton-portrait.png'));
copy(path.join(BACKUP_PUB, 'zachary-hutton-cutout.png'), path.join(ZACH_ASSETS, 'zachary-hutton-cutout.png'));
copy(path.join(BACKUP_PUB, 'Zach_Hutton_Resume.pdf'), path.join(ROOT, 'public', 'Zach_Hutton_Resume.pdf'));

const caseSrc = path.join(BACKUP_PUB, 'case-studies');
const caseFiles = [
  'weroi.png', 'weroi-cover.png', 'pntcog.png', 'pntcog-cover.png',
  'tendem-demo-bot-cover.png', 'studysync-cover.png', 'phone-store-cover.png',
  'webhook-relay-cover.png', 'openapi-devkit-cover.png', 'portfolio-cover.png',
];
for (const f of caseFiles) {
  copy(path.join(caseSrc, f), path.join(ZACH_ASSETS, f));
}

// Resize/crop portrait to match demo hero-image dimensions using PowerShell System.Drawing
const heroPath = path.join(UPLOADS_01, 'hero-image.png');
const portraitSrc = path.join(ZACH_ASSETS, 'zachary-hutton-portrait.png');
const heroOut = path.join(UPLOADS_01, 'hero-image.png'); // overwrite demo hero slot file
const aboutSlots = []; // discover about images later

const ps = `
Add-Type -AssemblyName System.Drawing
function Fit-Crop($srcPath, $destPath, $tw, $th) {
  $src = [System.Drawing.Image]::FromFile($srcPath)
  $bmp = New-Object System.Drawing.Bitmap $tw, $th
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $scale = [Math]::Max($tw / $src.Width, $th / $src.Height)
  $nw = [int]($src.Width * $scale)
  $nh = [int]($src.Height * $scale)
  # Bias crop slightly toward upper body / face (demo portrait framing)
  $dx = [int](($tw - $nw) / 2)
  $dy = [int](($th - $nh) / 2 - ($nh * 0.06))
  $g.DrawImage($src, $dx, $dy, $nw, $nh)
  $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose()
  Write-Host ("Wrote {0} ({1}x{2})" -f $destPath, $tw, $th)
}
$hero = [System.Drawing.Image]::FromFile('${heroPath.replace(/\\/g, '\\\\')}')
$hw = $hero.Width; $hh = $hero.Height
$hero.Dispose()
Write-Host ("Demo hero size: {0}x{1}" -f $hw, $hh)
Fit-Crop '${portraitSrc.replace(/\\/g, '\\\\')}' '${path.join(ZACH_ASSETS, 'hero-zach.png').replace(/\\/g, '\\\\')}' $hw $hh
# Also overwrite the live hero-image.png slot so existing src keeps working if needed
Fit-Crop '${portraitSrc.replace(/\\/g, '\\\\')}' '${heroOut.replace(/\\/g, '\\\\')}' $hw $hh
# About / choose-us images if present
$choose = '${path.join(UPLOADS_01, 'choose-us.png').replace(/\\/g, '\\\\')}'
if (Test-Path $choose) {
  $c = [System.Drawing.Image]::FromFile($choose)
  $cw=$c.Width; $ch=$c.Height; $c.Dispose()
  Fit-Crop '${portraitSrc.replace(/\\/g, '\\\\')}' '${path.join(ZACH_ASSETS, 'about-zach.png').replace(/\\/g, '\\\\')}' $cw $ch
  Fit-Crop '${portraitSrc.replace(/\\/g, '\\\\')}' $choose $cw $ch
}
`;

fs.writeFileSync(path.join(ROOT, 'scripts', '_crop-portrait.ps1'), ps);
try {
  execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(ROOT, 'scripts', '_crop-portrait.ps1')], {
    stdio: 'inherit',
  });
} catch (e) {
  console.warn('Portrait crop failed, falling back to direct copy', e.message);
  copy(portraitSrc, heroOut);
}

// --- Content patch index.html ---
let html = fs.readFileSync(INDEX, 'utf8');
const before = html;

// Preloader — REVOX (5) vs Zachary (7). Prefer Zachary; animation usually just sets text.
html = html.replace(/>REVOX</g, '>Zachary<');
html = html.replace(/>revox</gi, (m) => (m === '>revox<' ? '>zachary<' : m));

// Title
html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Zachary Hutton – Full Stack Developer</title>'
);

// Hero identity
html = html.replace(/<b>i'm<\/b> Rachel Davis/, "<b>i'm</b> Zachary Hutton");
html = html.replace(
  /<strong id="typing-text">Developer, Designer, Photographer<\/strong>/,
  '<strong id="typing-text">Full Stack Developer, Messaging Bots, APIs</strong>'
);
html = html.replace(
  /trusted clients <br> world wide/,
  'Portmore · Jamaica <br> UTech CS · GPA 3.7'
);
html = html.replace(
  /We're a team of strategic working globally with largest brands, We believe that progress only you to play things safe\./,
  'Portmore based builder: production web platforms, APIs that stay up, and Telegram bots that actually reply. UTech CS (GPA 3.7), open to internships, co-ops, and freelance that ships.'
);

// Hero image src → cropped zach (keep class/markup)
html = html.replace(
  /src="wp-content\/uploads\/2026\/01\/hero-image\.png"/g,
  'src="wp-content/uploads/zach/hero-zach.png"'
);
html = html.replace(
  /alt="Hero Image"/g,
  'alt="Zachary Hutton"'
);

// Social links (hero) — keep 4 anchors, swap labels/hrefs
html = html.replace(
  /<a href="https:\/\/www\.facebook\.com" target="_blank">\s*Facebook\s*<\/a>/,
  '<a href="https://github.com/zacharyahutton" target="_blank" rel="noopener">GitHub</a>'
);
html = html.replace(
  /<a href="https:\/\/www\.twitter\.com" target="_blank">\s*Twitter\s*<\/a>/,
  '<a href="https://www.linkedin.com/in/zachary-hutton-a2ab81415/" target="_blank" rel="noopener">LinkedIn</a>'
);
html = html.replace(
  /<a href="https:\/\/www\.linkedin\.com" target="_blank">\s*Linkedin\s*<\/a>/,
  '<a href="https://www.instagram.com/zachahutton/" target="_blank" rel="noopener">Instagram</a>'
);
html = html.replace(
  /<a href="https:\/\/dribbble\.com" target="_blank">\s*Dribbble\s*<\/a>/,
  '<a href="mailto:hzach577@gmail.com">Email</a>'
);

// Show Reel → View work (href to portfolio)
html = html.replace(
  /href="https:\/\/www\.youtube\.com\/watch\?v=-sAOWhvheK8"/,
  'href="./portfolio-page/index.html"'
);
html = html.replace(/>Show Reel</g, '>View work<');

// Hire Me → mailto (both header/footer CTA text stays, href if present)
html = html.replace(
  /(<a[^>]*class="[^"]*theme-btn[^"]*"[^>]*>)\s*Hire Me/i,
  '$1Hire Me'
);
// Common hire links pointing to contact
html = html.replace(
  /(Hire Me[\s\S]{0,120}?href=")([^"]+)(")/gi,
  '$1mailto:hzach577@gmail.com$3'
);
// Also fix hire me lowercase CTA near footer big text if linked
html = html.replace(
  /href="\.\/contact-us\/index\.html"([^>]*>)\s*hire me/i,
  'href="mailto:hzach577@gmail.com"$1hire me'
);

// About stats (top text)
html = html.replace(
  /<span>10\+ years of<\/span> experience/,
  "<span>GPA 3.7</span> UTech BSc CS"
);
html = html.replace(
  /<span>2\.5K\+ successfully<\/span> projects done/,
  '<span>3+</span> live products shipped'
);

// About skill counters → Zach real-ish stats (no invented skill %). Use backup numbers only.
const counterReplacements = [
  { count: '98', label: 'Figma', newCount: '3', suffix: '+', labelNew: 'Live products' },
  { count: '90', label: 'Photoshop', newCount: '37', suffix: '', labelNew: 'GPA ×10 (3.7)' },
  { count: '79', label: 'Illustrator', newCount: '3', suffix: '+', labelNew: 'Client platforms' },
  { count: '88', label: 'Sketch', newCount: '30', suffix: '+', labelNew: 'FAQ topics (bot)' },
  { count: '93', label: 'Adobe_Xd', newCount: '8', suffix: '', labelNew: 'CSEC Grade I' },
];
// Simpler: replace the five counter blocks by label
html = html.replace(
  /(<span class="count">)98(<\/span>)%([\s\S]*?<p>)Figma(<\/p>)/,
  '$1`KEEP98`'.length ? '$13</span>+$3Live products$4'.replace('KEEP','') : ''
);

// Do explicit sequential replacements for counters
html = html.replace(
  /<span class="count">98<\/span>%\s*<\/h2>\s*<p>Figma<\/p>/,
  '<span class="count">3</span>+</h2><p>Live products</p>'
);
html = html.replace(
  /<span class="count">90<\/span>%\s*<\/h2>\s*<p>Photoshop<\/p>/,
  '<span class="count">3</span>.7</h2><p>UTech GPA</p>'
);
html = html.replace(
  /<span class="count">79<\/span>%\s*<\/h2>\s*<p>Illustrator<\/p>/,
  '<span class="count">2024</span></h2><p>weROI contract</p>'
);
html = html.replace(
  /<span class="count">88<\/span>%\s*<\/h2>\s*<p>Sketch<\/p>/,
  '<span class="count">30</span>+</h2><p>Bot FAQ topics</p>'
);
html = html.replace(
  /<span class="count">93<\/span>%\s*<\/h2>\s*<p>Adobe_Xd<\/p>/,
  '<span class="count">8</span></h2><p>CSEC Grade I</p>'
);

// About copy
html = html.replace(
  /A Senior UX &amp; UI Designer based in Kuala Lumpur with over 5 years of experience, crafting user-centric fintech and web experiences\. Blending product thinking with visual design\./,
  "I'm a Computer Science student at the University of Technology, Jamaica. Dean's List, GPA 3.7. I ship full stack web apps and messaging bots: Telegram Bot API, FastAPI webhooks, async Python, LLM chat with Groq and OpenAI."
);
html = html.replace(
  /I bring both technical expertise and a collaborative mindset to every project\. My work is driven by a commitment to deliver\./,
  "Contract and freelance taught me the unglamorous skills: scope tightly, talk clearly, deliver on time. Whether you need a ministry site, an agency platform, or a bot that books appointments without ghosting users, I build for the handoff."
);
html = html.replace(
  /A Professional Overview of <span>My<\/span> <span class="no-break"> Background<\/span> and Expertise/,
  'Full stack builder · messaging bots · <span>security</span> <span class="no-break">aware engineer</span>'
);
html = html.replace(/My Favorite Tools/, 'Core stack');

// download cv → resume pdf
html = html.replace(
  /(<a href=")[^"]+("[^>]*>)\s*download cv/i,
  '$1/Zach_Hutton_Resume.pdf$2download cv'
);

// Services — map Zach services into 4 slots (titles + descriptions only)
html = html.replace(
  /<h2><a href="\.\/services\/brand-identity-design\/">Brand Identity Design<\/a><\/h2>\s*<p>We design distinctive brand identities that resonate with your audience and drive lasting recognition<\/p>/,
  '<h2><a href="./services/index.html">Web platforms &amp; product sites</a></h2><p>Ship a fast, responsive site or SPA that looks premium and turns visitors into leads or bookings.</p>'
);
html = html.replace(
  /<h2><a href="\.\/services\/frontend-development\/">Frontend Development<\/a><\/h2>\s*<p>We craft intuitive interfaces that merge aesthetics with performance for seamless engagement<\/p>/,
  '<h2><a href="./services/index.html">API development &amp; integrations</a></h2><p>Typed REST APIs with auth, validation, and docs so frontends and bots can plug in cleanly.</p>'
);
html = html.replace(
  /<h2><a href="\.\/services\/e-commerce-solutions\/">E-commerce Solutions<\/a><\/h2>\s*<p>We engineer scalable commerce ecosystems that amplify conversions and accelerate growth<\/p>/,
  '<h2><a href="./services/index.html">Client &amp; ministry sites</a></h2><p>Production sites for businesses and congregations — events, giving, and content that stay editable in code.</p>'
);
html = html.replace(
  /<h2><a href="\.\/services\/digital-marketing\/">Digital Marketing<\/a><\/h2>\s*<p>We build tailored digital journeys aligned with your brand goals delivering innovation and impact<\/p>/,
  '<h2><a href="./services/index.html">Telegram bots &amp; LLM chat</a></h2><p>Automate booking, FAQ, and support on Telegram with reliable webhooks and FAQ fallbacks.</p>'
);
html = html.replace(
  /Transforming Ideas <span>Into Digital Reality<\/span>/,
  'What I <span>ship for clients</span>'
);
html = html.replace(
  /Crafting seamless user experiences <br> that elevate your brand vision <br> through creativity and precision/,
  'Production web platforms, APIs, <br> and bots that actually reply — <br> scoped tightly, delivered on time'
);

// choose-us image already overwritten; also point src to zach asset
html = html.replace(
  /src="wp-content\/uploads\/2026\/01\/choose-us\.png"/g,
  'src="wp-content/uploads/zach/about-zach.png"'
);

// Portfolio projects — 5 cards
const projects = [
  {
    oldTitle: 'Online Learning Platform',
    oldHref: './works/online-learning-platform/',
    oldImg: 'wp-content/uploads/2025/11/project-01-4.jpg',
    title: 'Domus',
    cat: 'Manufacturer · Next.js',
    href: 'https://domus-topaz.vercel.app',
    img: 'wp-content/uploads/zach/portfolio-cover.png',
  },
  {
    oldTitle: 'Banking Mobile App',
    oldHref: './works/banking-mobile-app/',
    oldImg: 'wp-content/uploads/2025/11/project-02-4.jpg',
    title: 'Northern Elite',
    cat: 'Contractor · Next.js',
    href: 'https://northern-elite.vercel.app',
    img: 'wp-content/uploads/zach/weroi-cover.png',
  },
  {
    oldTitle: 'Fitness Wear Identity',
    oldHref: './works/fitness-wear-identity/',
    oldImg: 'wp-content/uploads/2025/11/project-03-2.jpg',
    title: 'weROI Agency Platform',
    cat: 'Full-stack · React / FastAPI',
    href: 'https://weroi.net',
    img: 'wp-content/uploads/zach/weroi.png',
  },
  {
    oldTitle: 'Luxury Watches Store',
    oldHref: './works/luxury-watches-store/',
    oldImg: 'wp-content/uploads/2025/11/project-04-3.jpg',
    title: 'PNTCOG Ministry Platform',
    cat: 'Client site · React',
    href: 'https://portmorentcog.org',
    img: 'wp-content/uploads/zach/pntcog.png',
  },
  {
    oldTitle: 'Predictive Analytics Tool',
    oldHref: './works/predictive-analytics-tool/',
    oldImg: 'wp-content/uploads/2025/11/project-05-2.jpg',
    title: 'Telegram Demo Bot',
    cat: 'Personal · FastAPI / Telegram',
    href: 'https://t.me/zachtedem_bot',
    img: 'wp-content/uploads/zach/tendem-demo-bot-cover.png',
  },
];

for (const p of projects) {
  html = html.split(p.oldHref).join(p.href);
  html = html.split(p.oldTitle).join(p.title);
  html = html.split(p.oldImg).join(p.img);
}

// Category labels under project cards (first 5 "App / Development" in project section)
let catCount = 0;
html = html.replace(/<p>App \/ Development<\/p>/g, () => {
  const cats = projects.map((p) => p.cat);
  const c = cats[catCount] || 'Project';
  catCount += 1;
  return `<p>${c}</p>`;
});

// Testimonials names → keep structure but use professional attribution lightly? User said achievements — leave client quotes as demo OR soften. Better leave quotes, change name only if Rachel.
html = html.replace(/Rachel Davis/g, 'Zachary Hutton');

// Footer socials
html = html.replace(
  /(<div class="icon-items">\s*<a href="#" class="icon"[^>]*>\s*<i class="fa-brands fa-facebook-f"><\/i>\s*<\/a>\s*<a href="#"[^>]*>\s*)Facebook(\s*<\/a>)/,
  `$1GitHub$2`.replace(
    'href="#"',
    'href="https://github.com/zacharyahutton"'
  )
);
// More reliable footer replacements
html = html.replace(
  /fa-facebook-f([\s\S]*?)href="#"/,
  'fa-github$1href="https://github.com/zacharyahutton"'
);
html = html.replace(
  /fa-github([\s\S]{0,200}?)>\s*Facebook\s*</,
  'fa-github$1>GitHub<'
);
html = html.replace(
  /fa-twitter([\s\S]*?)href="#"/,
  'fa-linkedin-in$1href="https://www.linkedin.com/in/zachary-hutton-a2ab81415/"'
);
html = html.replace(
  /fa-linkedin-in([\s\S]{0,200}?)>\s*Twitter\s*</,
  'fa-linkedin-in$1>LinkedIn<'
);
// Third footer icon already linkedin — point to Instagram
html = html.replace(
  /fa-linkedin-in([\s\S]*?icon-items[\s\S]*?fa-linkedin-in[\s\S]*?)href="#"/,
  (m) => m // skip complex; do simple global on remaining #
);

// Copyright
html = html.replace(
  /Copyright © <span>Gramentheme<\/span>/,
  'Copyright © <span>Zachary Hutton</span>'
);

// Awards / approach section if present — patch common demo strings
html = html.replace(/Kuala Lumpur/g, 'Portmore, Jamaica');

fs.writeFileSync(INDEX, html);
console.log('Patched index.html. Changed bytes:', Math.abs(html.length - before.length));

// Verify critical strings
for (const s of ['Zachary', 'Domus', 'Northern Elite', 'weROI', 'PNTCOG', 'preloader-text', 'hero-zach']) {
  console.log(s, html.includes(s) ? 'YES' : 'NO');
}
console.log('REVOX left?', /preloader-text">REVOX</.test(html));
console.log('Rachel left?', html.includes('Rachel'));
