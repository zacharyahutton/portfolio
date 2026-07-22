const fs = require("fs");
const s = fs.readFileSync(
  "public/revox-mirror/revox.baseecom.com/wp-content/themes/revox/assets/js/main_ver=1784315714.js",
  "utf8"
);
const lines = s.split(/\n/);
let depth = 0;
let readyLine = null;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("$documentOn.ready") || line.includes("$(document).ready")) {
    readyLine = i + 1;
    console.log("ready open", readyLine, line.trim().slice(0, 80));
  }
  // crude brace count ignoring strings
  for (const ch of line) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
  }
  if (readyLine && depth <= 2 && i > readyLine + 5) {
    // might be closing ready - depth was ~3 inside ready inside iife
  }
}
// find "End jQuery" and brace depth around coverflow
for (let i = 0; i < lines.length; i++) {
  if (
    /coverflow_slider|End jQuery|Smooth Scroller|feature_work_experience\(\)|\$documentOn\.ready/.test(
      lines[i]
    )
  ) {
    console.log(String(i + 1).padStart(5), "depth~", lines[i].trim().slice(0, 90));
  }
}

// Extract jquery-js-after and find Unexpected number location
const html = fs.readFileSync(
  "public/revox-mirror/revox.baseecom.com/index.html",
  "utf8"
);
const m = html.match(
  /<script id="jquery-js-after">([\s\S]*?)<\/script>/
);
if (m) {
  const code = m[1].trim();
  for (let len = 50; len <= code.length; len += 50) {
    try {
      new Function(code.slice(0, len));
    } catch (e) {
      console.log("jquery-js-after fails at len", len, e.message);
      console.log(JSON.stringify(code.slice(Math.max(0, len - 80), len)));
      break;
    }
  }
  try {
    new Function(code);
    console.log("jquery-js-after OK full?");
  } catch (e) {
    console.log("full fail", e.message);
  }
}
