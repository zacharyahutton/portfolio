/**
 * Remove desktop header MutationObserver that infinite-loops
 * (strip() mutates class/style → observer fires → freeze).
 * Mobile never hit this path. Replace with safe scroll/interval strip.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com"
);

const BAD = `(function(){
 if(!window.matchMedia('(min-width:992px)').matches) return;
 var hdr=document.getElementById('header-sticky');
 if(!hdr) return;
 var HIDE=['zach-header-hide','header-hidden'];
 function strip(){
  if(!window.matchMedia('(min-width:992px)').matches) return;
  HIDE.forEach(function(c){hdr.classList.remove(c);});
  if(hdr.style.transform&&hdr.style.transform!=='none') hdr.style.removeProperty('transform');
  if(hdr.style.opacity&&hdr.style.opacity!=='1') hdr.style.removeProperty('opacity');
  if(hdr.style.visibility&&hdr.style.visibility!=='visible') hdr.style.removeProperty('visibility');
 }
 new MutationObserver(strip).observe(hdr,{attributes:true,attributeFilter:['class','style']});
 strip();
})();`;

const GOOD = `(function(){
 /* ZH_HDR_STRIP_SAFE: MutationObserver on class/style + strip() = desktop freeze */
 if(!window.matchMedia('(min-width:992px)').matches) return;
 var hdr=document.getElementById('header-sticky');
 if(!hdr) return;
 var HIDE=['zach-header-hide','header-hidden'];
 function strip(){
  if(!window.matchMedia('(min-width:992px)').matches) return;
  HIDE.forEach(function(c){ if(hdr.classList.contains(c)) hdr.classList.remove(c); });
  if(hdr.style.transform&&hdr.style.transform!=='none') hdr.style.removeProperty('transform');
  if(hdr.style.opacity&&hdr.style.opacity!=='1') hdr.style.removeProperty('opacity');
  if(hdr.style.visibility&&hdr.style.visibility!=='visible') hdr.style.removeProperty('visibility');
 }
 strip();
 window.addEventListener('scroll', strip, {passive:true});
 setInterval(strip, 1000);
})();`;

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) {
      if (name === "wp-content" || name === "wp-includes" || name === "node_modules") continue;
      walk(fp, out);
    } else if (name.endsWith(".html")) {
      out.push(fp);
    }
  }
}

const files = [];
walk(root, files);
// also catch pages that only have the pattern (works/ etc under root)
let patched = 0;
let missing = 0;
for (const fp of files) {
  let s = fs.readFileSync(fp, "utf8");
  if (!s.includes("new MutationObserver(strip).observe(hdr")) {
    continue;
  }
  if (s.includes("ZH_HDR_STRIP_SAFE")) {
    continue;
  }
  if (!s.includes(BAD)) {
    // try normalize whitespace variants
    const re =
      /\(function\(\)\{\s*if\(!window\.matchMedia\('\(min-width:992px\)'\)\.matches\) return;\s*var hdr=document\.getElementById\('header-sticky'\);\s*if\(!hdr\) return;\s*var HIDE=\['zach-header-hide','header-hidden'\];\s*function strip\(\)\{[\s\S]*?new MutationObserver\(strip\)\.observe\(hdr,\{attributes:true,attributeFilter:\['class','style'\]\}\);\s*strip\(\);\s*\}\)\(\);/;
    if (!re.test(s)) {
      console.warn("VARIANT", path.relative(root, fp));
      missing++;
      continue;
    }
    s = s.replace(re, GOOD);
  } else {
    s = s.replace(BAD, GOOD);
  }
  fs.writeFileSync(fp, s);
  patched++;
  console.log("patched", path.relative(root, fp));
}

console.log(JSON.stringify({ patched, missing, scanned: files.length }));
