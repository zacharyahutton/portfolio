const { chromium } = require("playwright");

async function run(label, viewport, forceMobileMq) {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport });
  if (forceMobileMq) {
    await page.addInitScript(() => {
      const orig = window.matchMedia.bind(window);
      window.matchMedia = function (query) {
        if (String(query).includes("max-width: 991") || String(query).includes("max-width:991")) {
          return {
            matches: true,
            media: query,
            addEventListener: function () {},
            removeEventListener: function () {},
            addListener: function () {},
            removeListener: function () {},
            onchange: null,
            dispatchEvent: function () { return false; },
          };
        }
        if (String(query).includes("min-width: 992") || String(query).includes("min-width:992") || String(query).includes("min-width: 1199") || String(query).includes("min-width: 1200")) {
          return {
            matches: false,
            media: query,
            addEventListener: function () {},
            removeEventListener: function () {},
            addListener: function () {},
            removeListener: function () {},
            onchange: null,
            dispatchEvent: function () { return false; },
          };
        }
        return orig(query);
      };
    });
  }

  const t0 = Date.now();
  let dcl = null;
  let err = null;
  try {
    await page.goto("http://127.0.0.1:4177/?v=zhfix19mq", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    dcl = Date.now() - t0;
    await page.waitForTimeout(4000);
  } catch (e) {
    err = e.message.split("\n")[0];
  }

  let state = {};
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
      };
    });
  } catch (e) {
    state = { evalError: e.message };
  }

  console.log(label, { dcl, err, state });
  await browser.close();
}

(async () => {
  await run("desktop-forced-mobile-mq", { width: 1440, height: 900 }, true);
  await run("desktop-native", { width: 1440, height: 900 }, false);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
