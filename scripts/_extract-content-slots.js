const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'public', 'revox-mirror', 'revox.baseecom.com', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const out = path.join(__dirname, '..', 'scripts', '_content-extract');
fs.mkdirSync(out, { recursive: true });

function grab(re, name) {
  const m = html.match(re);
  if (!m) { console.log('MISS', name); return; }
  fs.writeFileSync(path.join(out, name + '.html'), m[0]);
  console.log('OK', name, m[0].length);
}

grab(/<section class="hero-section[\s\S]*?<\/section>/, 'hero');
grab(/<section class="about-section[\s\S]*?<\/section>/, 'about');
grab(/<section class="project-section[\s\S]*?<\/section>/, 'projects');
grab(/<section class="choose-us-section[\s\S]*?<\/section>/, 'services');
grab(/<footer class="footer-section[\s\S]*?<\/footer>/, 'footer');
grab(/skill-counter[\s\S]{0,800}/g, 'counters-sample'); // may not work with g for write

// counters
const counters = [...html.matchAll(/<div class="skill-counter[^"]*">[\s\S]*?<\/div>\s*<\/div>/g)];
console.log('counters found', counters.length);
counters.forEach((c, i) => fs.writeFileSync(path.join(out, `counter-${i}.html`), c[0]));

// project boxes
const boxes = [...html.matchAll(/<div class="project-box-items[^"]*">[\s\S]*?<\/div>\s*<\/div>/g)];
console.log('project boxes rough', boxes.length);

// hero image src
const imgs = [...html.matchAll(/hero-image[\s\S]{0,400}/g)];
console.log('hero-image blocks', imgs.length);
if (imgs[0]) console.log(imgs[0][0].slice(0, 400));

// portrait backup
const pub = path.join(__dirname, '..', 'backup', 'pre-revox-2026-07-20', 'public');
console.log('backup public files:', fs.readdirSync(pub).filter(f => /zach|portrait|cutout|resume/i.test(f)));
const cs = path.join(pub, 'case-studies');
if (fs.existsSync(cs)) console.log('case-studies:', fs.readdirSync(cs).slice(0, 30));
