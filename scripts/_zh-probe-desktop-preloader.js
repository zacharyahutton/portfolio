/**
 * Desktop preloader / hang probe — does not wait for window load.
 */
const path = require("path");
const { chromium } = require("playwright");

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch (e1) {
    try {
      browser = await chromium.launch({ headless: true, channel: "msedge" });
    } catch (e2) {
      console.error("playwright missing", e1.message, e2.message);
      process.exit(2);
    }
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];
  page.on("console", (m) => logs.push("CONSOLE " + m.type() + " " + m.text()));
  page.on("pageerror", (e) => logs.push("PAGEERROR " + e.message));

  const started = Date.now();
  await page.goto("http://127.0.0.1:4177/?v=zhfix19pc", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  console.log("domcontentloaded", Date.now() - started, "ms");

  await page.waitForTimeout(7000);

  const state = await page.evaluate(() => {
    const p = document.querySelector(".preloader");
    const cs = p ? getComputedStyle(p) : null;
    return {
      preloader: !!p,
      classes: p ? p.className : null,
      display: cs && cs.display,
      opacity: cs && cs.opacity,
      visibility: cs && cs.visibility,
      zIndex: cs && cs.zIndex,
      transform: cs && cs.transform,
      bodyOverflow: getComputedStyle(document.body).overflow,
      zhFix: !!document.getElementById("zh-site-fix-js"),
      gsap: typeof window.gsap,
      ScrollSmoother: typeof window.ScrollSmoother,
      __zhPreloaderRan: !!window.__zhPreloaderRan,
      heroOpacity: (() => {
        const img = document.querySelector(".animated-image");
        return img ? getComputedStyle(img).opacity : null;
      })(),
      titleOpacity: (() => {
        const t = document.querySelector(".tv_hero_title");
        return t ? getComputedStyle(t).opacity : null;
      })(),
      charsZero: document.querySelectorAll(".tv_hero_title .split-line, .tv_hero_title div").length,
    };
  });

  console.log(JSON.stringify(state, null, 2));
  console.log("logs", logs.slice(0, 40).join("\n"));
  await page.screenshot({
    path: path.join(__dirname, "..", "public", "revox-mirror", "_smoke-desktop-preloader.png"),
    fullPage: false,
  });
  console.log("screenshot written");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
