const fs = require('fs');
const p = require('path').join(__dirname, '..', 'public', 'revox-mirror', 'revox.baseecom.com', 'index.html');
let h = fs.readFileSync(p, 'utf8');
h = h.replace(/hi\.revox@gmail\.com/g, 'hzach577@gmail.com');
h = h.replace(/title="Revox"/g, 'title="Zachary Hutton"');
// Logo text if present as text node (not the green SVG icon)
h = h.replace(/>revox</gi, '>zachary<');
fs.writeFileSync(p, h);
console.log('done', !h.includes('hi.revox'), h.includes('hzach577'));
