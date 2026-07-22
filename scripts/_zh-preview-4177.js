const http = require("http");
const fs = require("fs");
const path = require("path");

const mirrorRoot = path.join(__dirname, "..", "public", "revox-mirror");
const root = path.join(mirrorRoot, "revox.baseecom.com");

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveFile(u) {
  if (u.startsWith("/fonts.googleapis.com/") || u.startsWith("/fonts.gstatic.com/")) {
    return path.join(mirrorRoot, u.replace(/^\//, ""));
  }
  return path.join(root, u.replace(/^\//, ""));
}

const server = http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || "/").split("?")[0]);
  if (u.endsWith("/")) u += "index.html";
  if (u === "/") u = "/index.html";
  const f = resolveFile(u);
  fs.readFile(f, (e, d) => {
    if (e) {
      res.writeHead(404);
      res.end("404 " + u);
      return;
    }
    const t = MIME[path.extname(f)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": t, "Cache-Control": "no-store" });
    res.end(d);
  });
});
function get(urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get("http://127.0.0.1:4177" + urlPath, (r) => {
        const chunks = [];
        r.on("data", (c) => chunks.push(c));
        r.on("end", () =>
          resolve({ status: r.statusCode, body: Buffer.concat(chunks).toString("utf8") })
        );
      })
      .on("error", reject);
  });
}

server.listen(4177, async () => {
  console.log("listening 4177");
  try {
    const page = await get("/blog/weroi/");
    console.log("page", page.status, "len", page.body.length);
    const css = (page.body.match(/href="([^"]+main_ver[^"]+)"/) || [])[1];
    console.log("css href", css);
    const img = (page.body.match(/src="([^"]+blog-weroi[^"]*)"/) || [])[1];
    console.log("cover", img);
    const bad = page.body.includes('../wp-content/');
    console.log("has relative ../wp-content", bad);
    if (css) {
      const c = await get(css);
      console.log("css status", c.status, "len", c.body.length);
    }
    if (img) {
      const i = await get(img);
      console.log("img status", i.status, "len", i.body.length);
    }
  } catch (e) {
    console.error(e);
  }
  // keep server running for browser check
});
