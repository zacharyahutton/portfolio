/**
 * Build a sharp OG card from the real hero portrait (not a mushy AI face).
 * 1200x630, dark left copy, portrait right, light laptop cue.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const HERO = path.join(
  ROOT,
  "public/revox-mirror/revox.baseecom.com/wp-content/uploads/zach/hero-zach-full.png"
);
const OUT_JPG = path.join(ROOT, "public/og.jpg");
const OUT_PNG = path.join(ROOT, "public/og.png");

async function main() {
  const W = 1200;
  const H = 630;

  // Soft dark base
  const base = sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 10, g: 10, b: 12 },
    },
  }).png();

  // Portrait: keep face crisp, place on right
  const portraitBuf = await sharp(HERO)
    .resize(520, 630, {
      fit: "cover",
      position: "top",
    })
    .png()
    .toBuffer();

  // Soft left fade so text area stays clean
  const fadeSvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0a0a0c" stop-opacity="1"/>
      <stop offset="42%" stop-color="#0a0a0c" stop-opacity="1"/>
      <stop offset="62%" stop-color="#0a0a0c" stop-opacity="0.55"/>
      <stop offset="78%" stop-color="#0a0a0c" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0a0c" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
</svg>`);

  // Laptop + tiny code cue (sparse)
  const propsSvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- laptop -->
  <g transform="translate(700,430)">
    <rect x="18" y="8" width="210" height="132" rx="10" fill="#16161a" stroke="#2a2a30" stroke-width="2"/>
    <rect x="28" y="18" width="190" height="104" rx="4" fill="#0d0d10"/>
    <!-- fake portfolio UI on screen -->
    <rect x="28" y="18" width="190" height="18" fill="#121218"/>
    <circle cx="38" cy="27" r="2.5" fill="#ff5f57"/>
    <circle cx="48" cy="27" r="2.5" fill="#febc2e"/>
    <circle cx="58" cy="27" r="2.5" fill="#28c840"/>
    <text x="78" y="31" fill="#BFF747" font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="700">zacharyhutton.online</text>
    <rect x="40" y="48" width="70" height="8" rx="2" fill="#f2f2f2"/>
    <rect x="40" y="62" width="50" height="5" rx="2" fill="#BFF747" opacity="0.9"/>
    <rect x="40" y="76" width="100" height="4" rx="2" fill="#ffffff" opacity="0.35"/>
    <rect x="40" y="86" width="88" height="4" rx="2" fill="#ffffff" opacity="0.28"/>
    <rect x="40" y="102" width="46" height="12" rx="6" fill="#BFF747"/>
    <rect x="8" y="142" width="230" height="10" rx="3" fill="#1c1c22"/>
    <rect x="70" y="152" width="106" height="6" rx="2" fill="#141418"/>
  </g>
  <!-- tiny react-like atom, sparse -->
  <g transform="translate(980,120)" opacity="0.35" fill="none" stroke="#BFF747" stroke-width="1.5">
    <ellipse cx="0" cy="0" rx="28" ry="12" transform="rotate(0)"/>
    <ellipse cx="0" cy="0" rx="28" ry="12" transform="rotate(60)"/>
    <ellipse cx="0" cy="0" rx="28" ry="12" transform="rotate(120)"/>
    <circle cx="0" cy="0" r="3.5" fill="#BFF747" stroke="none"/>
  </g>
  <!-- tiny brackets -->
  <text x="1040" y="520" fill="#ffffff" opacity="0.22" font-family="Consolas, monospace" font-size="42">{ }</text>
</svg>`);

  const textSvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="64" y="250" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700">Zachary Hutton</text>
  <text x="64" y="300" fill="#BFF747" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">Full Stack Developer</text>
  <text x="64" y="348" fill="#ffffff" opacity="0.82" font-family="Arial, Helvetica, sans-serif" font-size="18">Premium websites, platforms, and AI systems</text>
</svg>`);

  const composed = await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 10, g: 10, b: 12 },
    },
  })
    .composite([
      { input: portraitBuf, left: W - 520, top: 0 },
      { input: fadeSvg, left: 0, top: 0 },
      { input: propsSvg, left: 0, top: 0 },
      { input: textSvg, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  // High-quality JPEG for WhatsApp/social (still under ~300KB ideally)
  await sharp(composed)
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUT_JPG);

  await sharp(composed).png({ compressionLevel: 8 }).toFile(OUT_PNG);

  const jpgStat = fs.statSync(OUT_JPG);
  const pngStat = fs.statSync(OUT_PNG);
  console.log(
    JSON.stringify({
      jpg: jpgStat.size,
      png: pngStat.size,
      out: OUT_JPG,
    })
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
