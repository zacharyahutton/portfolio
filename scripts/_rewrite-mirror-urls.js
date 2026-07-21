const fs = require('fs');
const path = require('path');

const siteRoot = path.join(
  __dirname,
  '..',
  'public',
  'revox-mirror',
  'revox.baseecom.com'
);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function rewriteHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const relDir = path.relative(siteRoot, path.dirname(filePath)).replace(/\\/g, '/');
  const depth = relDir === '' ? 0 : relDir.split('/').filter(Boolean).length;
  const prefix = depth === 0 ? '' : '../'.repeat(depth);

  // Absolute demo URLs → local relative
  html = html.replace(/https?:\/\/revox\.baseecom\.com\/?/g, () => prefix || './');

  // Fix accidental ./web-developer/ when we wanted web-developer/
  // prefix '' means replace https://revox.baseecom.com/ with './'
  // So https://revox.baseecom.com/about-me/ → ./about-me/  GOOD for homepage
  // For nested page depth=1: https://revox.baseecom.com/about-me/ → ../about-me/ GOOD

  // Prefer directory index files for known mirrored pages
  const pages = [
    'web-developer',
    'graphic-designer',
    'fashion-model',
    'about-me',
    'services',
    'portfolio-page',
    'portfolio-grid',
    'blog',
    'contact-us',
    'our-faq',
  ];
  for (const page of pages) {
    const re = new RegExp(`(href=["'])([^"']*?)${page}/?(["'])`, 'gi');
    html = html.replace(re, (m, a, pre, b) => {
      // if already ends with index.html skip
      if (pre.includes('index.html')) return m;
      return `${a}${pre}${page}/index.html${b}`;
    });
  }

  // Home links that became just "./" or "" — normalize homepage anchors in menus
  html = html.replace(/href=(["'])\.\/(["'])/g, 'href=$1index.html$2');
  html = html.replace(/href=(["'])\.\.\/(["'])/g, 'href=$1../index.html$2');

  fs.writeFileSync(filePath, html);
  return filePath;
}

const files = walk(siteRoot);
console.log('Rewriting', files.length, 'HTML files');
for (const f of files) {
  rewriteHtml(f);
  console.log(' -', path.relative(siteRoot, f));
}
console.log('Done');
