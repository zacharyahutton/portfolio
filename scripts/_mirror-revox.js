const scrape = require('website-scraper').default || require('website-scraper');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, '..', 'public', 'revox-mirror');

async function main() {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }

  const pages = [
    'https://revox.baseecom.com/',
    'https://revox.baseecom.com/web-developer/',
    'https://revox.baseecom.com/graphic-designer/',
    'https://revox.baseecom.com/fashion-model/',
    'https://revox.baseecom.com/about-me/',
    'https://revox.baseecom.com/services/',
    'https://revox.baseecom.com/portfolio-page/',
    'https://revox.baseecom.com/portfolio-grid/',
    'https://revox.baseecom.com/blog/',
    'https://revox.baseecom.com/contact-us/',
    'https://revox.baseecom.com/our-faq/',
  ];

  console.log('Starting mirror of', pages.length, 'pages...');
  const result = await scrape({
    urls: pages,
    directory: outDir,
    recursive: false,
    maxRecursiveDepth: 0,
    requestConcurrency: 4,
    sources: [
      { selector: 'img', attr: 'src' },
      { selector: 'img', attr: 'data-src' },
      { selector: 'img', attr: 'data-lazy-src' },
      { selector: 'img', attr: 'srcset' },
      { selector: 'source', attr: 'srcset' },
      { selector: 'link[rel="stylesheet"]', attr: 'href' },
      { selector: 'link[rel="icon"]', attr: 'href' },
      { selector: 'link[rel="preload"]', attr: 'href' },
      { selector: 'script', attr: 'src' },
      { selector: 'video', attr: 'src' },
      { selector: 'video source', attr: 'src' },
      { selector: 'audio', attr: 'src' },
      { selector: 'embed', attr: 'src' },
      { selector: 'object', attr: 'data' },
    ],
    urlFilter: (url) => {
      // Keep same-origin + common CDNs used by WP/Elementor/Google fonts
      try {
        const u = new URL(url);
        if (u.hostname.includes('revox.baseecom.com')) return true;
        if (u.hostname.includes('fonts.googleapis.com')) return true;
        if (u.hostname.includes('fonts.gstatic.com')) return true;
        if (u.hostname.includes('cdnjs.cloudflare.com')) return true;
        if (u.hostname.includes('cdn.jsdelivr.net')) return true;
        // Elementor / WP uploads & assets on same host only otherwise
        return false;
      } catch {
        return false;
      }
    },
    filenameGenerator: 'bySiteStructure',
  });

  console.log('Saved resources:', result.length);
  // Rename homepage index
  const indexCandidates = [
    path.join(outDir, 'index.html'),
    path.join(outDir, 'revox.baseecom.com', 'index.html'),
  ];
  for (const c of indexCandidates) {
    if (fs.existsSync(c)) console.log('INDEX FOUND:', c);
  }
  // List top-level
  console.log('TOP:', fs.readdirSync(outDir).slice(0, 30));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
