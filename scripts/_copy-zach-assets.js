const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const mirror = path.join(root, 'public', 'revox-mirror', 'revox.baseecom.com');
const htmlPath = path.join(mirror, 'index.html');
const backupPub = path.join(root, 'backup', 'pre-revox-2026-07-20', 'public');
const assetsDir = path.join(mirror, 'wp-content', 'uploads', 'zach');

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

ensureDir(assetsDir);

// Copy portrait + resume + case-study covers into mirror uploads
const copies = [
  ['zachary-hutton-portrait.png', 'portrait.png'],
  ['zachary-hutton-cutout.png', 'cutout.png'],
  ['Zach_Hutton_Resume.pdf', 'Zach_Hutton_Resume.pdf'],
];
for (const [src, dest] of copies) {
  const from = path.join(backupPub, src);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, path.join(assetsDir, dest));
    console.log('copied', dest);
  } else console.log('MISSING', src);
}

const cs = path.join(backupPub, 'case-studies');
if (fs.existsSync(cs)) {
  for (const f of fs.readdirSync(cs).filter((x) => x.endsWith('.png'))) {
    fs.copyFileSync(path.join(cs, f), path.join(assetsDir, f));
  }
  console.log('case-study pngs copied');
}

// Also put resume at public root for /Zach_Hutton_Resume.pdf
const resumeSrc = path.join(backupPub, 'Zach_Hutton_Resume.pdf');
if (fs.existsSync(resumeSrc)) {
  fs.copyFileSync(resumeSrc, path.join(root, 'public', 'Zach_Hutton_Resume.pdf'));
}

console.log('assets ready');
