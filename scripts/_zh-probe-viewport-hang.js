/**
 * Compare mobile vs desktop: does DOMContentLoaded ever fire?
 */
const { chromium } = require("playwright");

async function probe(label, viewport) {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport });
  const logs = [];
  page.on("console", (m) => logs.push(m.type() + ": " + m.text().slice(0, 200)));
  page.on("pageerror", (e) => logs.push("ERR: " + e.message.slice(0, 200)));

  const t0 = Date.now();
  let dcl = null;
  let err = null;
  try {
    await page.goto("http://127.0.0.1:4177/?v=zhfix19cmp", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    dcl = Date.now() - t0;
  } catch (e) {
    err = e.message.split("\n")[0];
  }

  let state = null;
  try {
    state = await page.evaluate(() => {
      const p = document.querySelector(".preloader");
      const cs = p ? getComputedStyle(p) : null;
      return {
        readyState: document.readyState,
        preloaderClass: p && p.className,
        display: cs && cs.display,
        opacity: cs && cs.opacity,
        __zhPreloaderRan: !!window.__zhPreloaderRan,
        gsap: typeof window.gsap,
        scripts: Array.from(document.scripts)
          .map((s) => (s.src || s.id || "inline").slice(-60))
          .slice(-12),
      };
    });
  } catch (e) {
    state = { evalError: e.message };
  }

  console.log("\n===", label, "===");
  console.log("dclMs", dcl, "err", err);
  console.log(JSON.stringify(state, null, 2));
  console.log("logs", logs.slice(0, 25).join(" | "));
  await browser.close();
}

(async () => {
  await probe("mobile", { width: 390, height: 844 });
  await probe("desktop", { width: 1440, height: 900 });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
