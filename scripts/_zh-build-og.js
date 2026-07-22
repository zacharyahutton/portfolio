/**
 * High-quality OG card from real hero portrait.
 * Outputs public/og.png (primary) + public/og.jpg (fallback).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const HERO = path.join(
  ROOT,
  "public/revox-mirror/revox.baseecom.com/wp-content/uploads/zach/zachary-hutton-cutout.png"
);
const OUT_JPG = path.join(ROOT, "public/og.jpg");
const OUT_PNG = path.join(ROOT, "public/og.png");

async function main() {
  const W = 1200;
  const H = 630;
  const PW = 580;

  const meta = await sharp(HERO).metadata();
  const srcW = meta.width || 714;
  const srcH = meta.height || 1010;
  // Prefer upper body / face; trim a bit of empty bottom so face reads larger
  const cropTop = Math.round(srcH * 0.02);
  const cropH = Math.round(srcH * 0.78);

  const portraitBuf = await sharp(HERO)
    .extract({ left: 0, top: cropTop, width: srcW, height: Math.min(cropH, srcH - cropTop) })
    .resize(PW, H, {
      fit: "cover",
      position: "north",
      kernel: sharp.kernel.lanczos3,
    })
    .toBuffer();

  // Fade only (no full black rect). Laptop sits under copy on the left.
  const overlaySvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#09090b" stop-opacity="1"/>
      <stop offset="38%" stop-color="#09090b" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#09090b" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#09090b" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>

  <text x="64" y="220" fill="#ffffff" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="56" font-weight="700">Zachary Hutton</text>
  <text x="64" y="274" fill="#BFF747" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Full Stack Developer</text>
  <text x="64" y="324" fill="#f0f0f0" font-family="Arial, Helvetica, sans-serif" font-size="20">Premium websites, platforms, and AI systems</text>

  <g transform="translate(64,380)">
    <rect x="16" y="6" width="220" height="136" rx="12" fill="#15151a" stroke="#3a3a42" stroke-width="2"/>
    <rect x="26" y="16" width="200" height="108" rx="5" fill="#0c0c10"/>
    <rect x="26" y="16" width="200" height="20" fill="#121218"/>
    <circle cx="38" cy="26" r="3" fill="#ff5f57"/>
    <circle cx="50" cy="26" r="3" fill="#febc2e"/>
    <circle cx="62" cy="26" r="3" fill="#28c840"/>
    <text x="78" y="30" fill="#BFF747" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700">zacharyhutton.online</text>
    <rect x="40" y="50" width="78" height="9" rx="2" fill="#f5f5f5"/>
    <rect x="40" y="66" width="54" height="6" rx="2" fill="#BFF747"/>
    <rect x="40" y="82" width="110" height="5" rx="2" fill="#ffffff" opacity="0.4"/>
    <rect x="40" y="94" width="96" height="5" rx="2" fill="#ffffff" opacity="0.3"/>
    <rect x="40" y="110" width="52" height="14" rx="7" fill="#BFF747"/>
    <rect x="6" y="144" width="240" height="11" rx="3" fill="#1b1b22"/>
  </g>
</svg>`);

  const composed = await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 9, g: 9, b: 11 },
    },
  })
    .composite([
      { input: portraitBuf, left: W - PW, top: 0 },
      { input: overlaySvg, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  await sharp(composed).png({ compressionLevel: 6 }).toFile(OUT_PNG);
  await sharp(composed)
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUT_JPG);

  console.log(
    JSON.stringify({
      png: fs.statSync(OUT_PNG).size,
      jpg: fs.statSync(OUT_JPG).size,
      source: path.basename(HERO),
    })
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
