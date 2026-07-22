/**
 * Nested mirror pages (blog/*, works/*) were saved with depth-1 relative
 * asset paths (../wp-content). At URL /blog/slug/ that resolves to
 * /blog/wp-content (404). Rewrite to root-absolute /wp-content and /wp-includes.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(
  __dirname,
  "..",
  "public",
  "revox-mirror",
  "revox.baseecom.com"
);

const nests = [
  path.join(root, "blog"),
  path.join(root, "works"),
];

function listNestedHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const sub = path.join(dir, name);
    if (!fs.statSync(sub).isDirectory()) continue;
    const index = path.join(sub, "index.html");
    if (fs.existsSync(index)) out.push(index);
  }
  return out;
}

function fixFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  const before = html;

  // Asset roots: one level too shallow for /section/slug/
  html = html.replace(/(["'(])\.\.\/wp-content\//g, "$1/wp-content/");
  html = html.replace(/(["'(])\.\.\/wp-includes\//g, "$1/wp-includes/");

  // Sibling blog posts linked as ../slug/index.html → /blog/slug/
  if (filePath.includes(`${path.sep}blog${path.sep}`)) {
    html = html.replace(
      /href=(["'])\.\.\/([a-z0-9-]+)\/index\.html\1/gi,
      'href=$1/blog/$2/$1'
    );
    html = html.replace(
      /href=(["'])\.\.\/([a-z0-9-]+)\/?\1/gi,
      'href=$1/blog/$2/$1'
    );
    html = html.replace(/href=(["'])\.\.\/index\.html\1/gi, 'href=$1/blog/$1');
  }

  // Fonts mirrored beside site root: ../../fonts.* → /fonts.*
  // (Next rewrites; static preview may still miss unless root includes revox-mirror)
  html = html.replace(/(["'])\.\.\/\.\.\/(fonts\.(?:googleapis|gstatic)\.com\/)/g, "$1/$2");

  if (html === before) return false;
  fs.writeFileSync(filePath, html);
  return true;
}

const files = nests.flatMap(listNestedHtml);
let changed = 0;
for (const f of files) {
  if (fixFile(f)) {
    changed += 1;
    console.log("fixed", path.relative(root, f));
  } else {
    console.log("ok   ", path.relative(root, f));
  }
}
console.log(`Done. ${changed}/${files.length} files updated.`);
