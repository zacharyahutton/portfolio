const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'public', 'revox-mirror', 'revox.baseecom.com', 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');

// --- Work experience section: replace demo job titles/companies with Zach timeline ---
// Extract a sample of work-experience titles
const weTitles = [...html.matchAll(/feature-work-experience[\s\S]{0,200}?<(?:h3|h4|h2)[^>]*>([^<]+)</gi)].slice(0, 12);
console.log('WE title samples:', weTitles.map((m) => m[1].trim()));

// Common Revox demo experience strings — replace with Zach experience from backup
const expMap = [
  [/Senior Product Designer/gi, 'Software Developer (Contract)'],
  [/Lead UI\/UX Designer/gi, 'Freelance Web Developer'],
  [/Creative Director/gi, 'BSc Computer Science'],
  [/UI Designer/gi, 'Full Stack Developer'],
  [/Product Designer/gi, 'API & Bot Engineer'],
  [/Google/g, 'weROI'],
  [/Apple/g, 'Independent'],
  [/Microsoft/g, 'UTech Jamaica'],
  [/Amazon/g, 'Client & OSS'],
  [/Facebook/g, 'GitHub'],
];

// Safer: only replace inside work-experience section
html = html.replace(
  /(<section class="work-experience-section-1[\s\S]*?<\/section>)/,
  (section) => {
    let s = section;
    s = s.replace(/Senior Product Designer/gi, 'Software Developer (Contract)');
    s = s.replace(/Lead UI\/UX Designer/gi, 'Freelance Web Developer');
    s = s.replace(/Creative Director/gi, 'BSc Computer Science');
    s = s.replace(/UI\/UX Designer/gi, 'Full Stack Builder');
    s = s.replace(/Product Designer/gi, 'Messaging Bots & APIs');
    s = s.replace(/>Google</g, '>weROI<');
    s = s.replace(/>Apple</g, '>Independent<');
    s = s.replace(/>Microsoft</g, '>UTech Jamaica<');
    s = s.replace(/>Amazon</g, '>Open Source<');
    s = s.replace(/>Dribbble</g, '>Telegram Bot API<');
    s = s.replace(/>Behance</g, '>FastAPI / Railway<');
    s = s.replace(/2018\s*[–-]\s*2020/g, '2024 – Present');
    s = s.replace(/2020\s*[–-]\s*2022/g, '2023 – Present');
    s = s.replace(/2022\s*[–-]\s*2024/g, '2024 – 2029');
    s = s.replace(/2021\s*[–-]\s*2023/g, '2024 – Present');
    s = s.replace(/2019\s*[–-]\s*2021/g, '2023 – Present');
    return s;
  }
);

// Awards section — map to achievements
html = html.replace(
  /(<section class="award-section[\s\S]*?<\/section>)/,
  (section) => {
    let s = section;
    const awards = [
      ["Dean's List", "BSc Computer Science at UTech Jamaica — GPA 3.7 while balancing contract development and personal projects."],
      ['Contract & freelance delivery', 'Shipped production web apps for ministry and agency clients with React, FastAPI, MongoDB, Vercel, and Railway.'],
      ['Senior church volunteer', 'Leads and supports technical roles at church, coordinating events and keeping digital tools running.'],
      ['Jamaica Red Cross volunteer', 'Community service through the Red Cross — teamwork, communication, and reliability beyond coursework.'],
      ['Security-aware engineering', 'OWASP-aligned practices, secure auth patterns, and networking fundamentals from coursework and labs.'],
    ];
    // Replace h3/h4 award titles in order where possible
    let i = 0;
    s = s.replace(/<(h3|h4)([^>]*)>([^<]+)<\/\1>/g, (m, tag, attrs, text) => {
      if (i < awards.length && !/award|my|selected/i.test(text.trim())) {
        const t = awards[i++][0];
        return `<${tag}${attrs}>${t}</${tag}>`;
      }
      return m;
    });
    return s;
  }
);

// News/blog cards — map to real post titles from backup (content only)
const posts = [
  { title: 'weROI Agency Platform', href: 'https://weroi.net' },
  { title: 'PNTCOG Ministry Site', href: 'https://portmorentcog.org' },
  { title: 'Telegram + FastAPI Bots', href: 'https://github.com/zacharyahutton/telegram-bot-demo' },
];
html = html.replace(
  /(<section class="news-section[\s\S]*?<\/section>)/,
  (section) => {
    let s = section;
    let i = 0;
    s = s.replace(/<h3>\s*<a href="[^"]+">([^<]+)<\/a>\s*<\/h3>/g, (m, title) => {
      if (i < posts.length) {
        const p = posts[i++];
        return `<h3><a href="${p.href}" target="_blank" rel="noopener">${p.title}</a></h3>`;
      }
      return m;
    });
    return s;
  }
);

// Footer social block — rewrite the three icon-items cleanly
html = html.replace(
  /<div class="icon-items-area">[\s\S]*?<\/div>\s*<\/div>\s*<div class="footer-bottom/,
  `<div class="icon-items-area">
                                                            <div class="icon-items">
                                    <a href="https://github.com/zacharyahutton" class="icon" target="_blank" rel="noopener">
                                        <i class="fa-brands fa-github"></i>
                                    </a>
                                    <a href="https://github.com/zacharyahutton" target="_blank" rel="noopener">
                                        GitHub                                    </a>
                                </div>
                                                            <div class="icon-items">
                                    <a href="https://www.linkedin.com/in/zachary-hutton-a2ab81415/" class="icon" target="_blank" rel="noopener">
                                        <i class="fa-brands fa-linkedin-in"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/in/zachary-hutton-a2ab81415/" target="_blank" rel="noopener">
                                        LinkedIn                                    </a>
                                </div>
                                                            <div class="icon-items">
                                    <a href="mailto:hzach577@gmail.com" class="icon" rel="noopener">
                                        <i class="fa-solid fa-envelope"></i>
                                    </a>
                                    <a href="mailto:hzach577@gmail.com" rel="noopener">
                                        Email                                    </a>
                                </div>
                                                    </div>
                                    </div>
                
                <div class="footer-bottom`
);

// Hire Me buttons — find anchors containing Hire Me and set mailto
html = html.replace(
  /<a ([^>]*?)>(\s*Hire Me[\s\S]*?)<\/a>/gi,
  (m, attrs, inner) => {
    let a = attrs;
    if (/href=/.test(a)) a = a.replace(/href="[^"]*"/, 'href="mailto:hzach577@gmail.com"');
    else a += ' href="mailto:hzach577@gmail.com"';
    return `<a ${a}>${inner}</a>`;
  }
);
html = html.replace(
  /<a ([^>]*?)>(\s*hire me[\s\S]*?)<\/a>/gi,
  (m, attrs, inner) => {
    let a = attrs;
    if (/href=/.test(a)) a = a.replace(/href="[^"]*"/, 'href="mailto:hzach577@gmail.com"');
    else a += ' href="mailto:hzach577@gmail.com"';
    return `<a ${a}>${inner}</a>`;
  }
);

// Pricing section — optional soften to not invent prices: leave structure, change plan names to real offerings? Skip pricing dollar amounts (don't invent). Change headers only if obvious demo.
html = html.replace(/Basic Plan/gi, 'Landing / brochure');
html = html.replace(/Standard Plan/gi, 'Full platform');
html = html.replace(/Premium Plan/gi, 'Bot + API package');

// CTA footer big text if present
html = html.replace(/Let's Work Together/gi, "Let's build something");
html = html.replace(/Have a project in mind\?/gi, 'Open to internships, co-ops &amp; freelance');

fs.writeFileSync(INDEX, html);

// Verify
const checks = {
  preloader: /preloader-text">Zachary</.test(html),
  heroName: /Zachary Hutton/.test(html),
  domus: html.includes('domus-topaz.vercel.app'),
  ne: html.includes('northern-elite.vercel.app'),
  weroi: html.includes('weroi.net'),
  pntcog: html.includes('portmorentcog.org'),
  bot: html.includes('t.me/zachtedem_bot'),
  portrait: html.includes('hero-zach.png'),
  resume: html.includes('Zach_Hutton_Resume.pdf'),
  rachel: html.includes('Rachel'),
  revoxPre: /preloader-text">REVOX</.test(html),
};
console.log(checks);

// Confirm counter patches
console.log('Live products', html.includes('Live products'));
console.log('UTech GPA', html.includes('UTech GPA'));
