const fs = require('fs');
const path = require('path');
const p = 'C:\\Users\\EverybodyHatesA1one\\.cursor\\projects\\c-Users-EverybodyHatesA1one-Documents-PORTFOLIO\\agent-tools\\a57d9505-1943-4c52-9bf1-08f92e9af23a.txt';
const raw = fs.readFileSync(p, 'utf8');
const data = JSON.parse(raw);
const outDir = 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\.tmp-themes\\revox\\live-scrape';
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'homepage.raw.html'), data.rawHtml || '');
fs.writeFileSync(path.join(outDir, 'branding.json'), JSON.stringify(data.branding || {}, null, 2));
fs.writeFileSync(path.join(outDir, 'links.json'), JSON.stringify(data.links || [], null, 2));
if (data.screenshot) {
  // may be URL or base64
  fs.writeFileSync(path.join(outDir, 'screenshot-meta.json'), JSON.stringify({ type: typeof data.screenshot, preview: String(data.screenshot).slice(0, 200) }, null, 2));
}
console.log('rawHtml length', (data.rawHtml || '').length);
console.log('branding keys', Object.keys(data.branding || {}));
console.log('links', (data.links || []).length);
// Extract section class names
const html = data.rawHtml || '';
const sections = [...html.matchAll(/<(?:section|div)[^>]*class="([^"]*(?:section|hero|header|footer|preloader|cursor)[^"]*)"/gi)].slice(0, 80);
console.log('section-like classes sample:');
sections.slice(0, 40).forEach(m => console.log(' -', m[1].slice(0, 120)));
