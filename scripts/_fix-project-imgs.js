const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'public', 'revox-mirror', 'revox.baseecom.com', 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');

// Domus / Northern Elite: no real screenshots in backup — restore demo project images for those two slots only (keep titles/hrefs)
html = html.replace(
  /(href="https:\/\/domus-topaz\.vercel\.app"[\s\S]{0,400}?src=")wp-content\/uploads\/zach\/portfolio-cover\.png(")/,
  '$1wp-content/uploads/2025/11/project-01-4.jpg$2'
);
// Also image may come before link — do both orders
html = html.replace(
  /src="wp-content\/uploads\/zach\/portfolio-cover\.png"([^>]*alt="Domus")/,
  'src="wp-content/uploads/2025/11/project-01-4.jpg"$1'
);
html = html.replace(
  /alt="Domus"/g,
  'alt="Domus"'
);
// Find Domus card img by alt
html = html.replace(
  /src="[^"]+"(\s+alt="Domus")/,
  'src="wp-content/uploads/2025/11/project-01-4.jpg"$1'
);
html = html.replace(
  /src="[^"]+"(\s+alt="Northern Elite")/,
  'src="wp-content/uploads/2025/11/project-02-4.jpg"$1'
);
// If alts were updated from old titles already:
html = html.replace(
  /(Northern Elite[\s\S]{0,80})src="wp-content\/uploads\/zach\/weroi-cover\.png"/,
  '$1src="wp-content/uploads/2025/11/project-02-4.jpg"'
);
html = html.replace(
  /src="wp-content\/uploads\/zach\/weroi-cover\.png"/g,
  'src="wp-content/uploads/2025/11/project-02-4.jpg"'
);

fs.writeFileSync(INDEX, html);
console.log('Fixed Domus/NE images to keep demo photos where Zach screenshots missing');
console.log('about-zach exists', fs.existsSync(path.join(__dirname, '..', 'public', 'revox-mirror', 'revox.baseecom.com', 'wp-content', 'uploads', 'zach', 'about-zach.png')));
console.log('hero-zach exists', fs.existsSync(path.join(__dirname, '..', 'public', 'revox-mirror', 'revox.baseecom.com', 'wp-content', 'uploads', 'zach', 'hero-zach.png')));
