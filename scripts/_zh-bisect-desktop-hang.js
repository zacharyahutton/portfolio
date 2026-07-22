const { chromium } = require("playwright");

async function run(label, patch) {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript((patchMode) => {
    const orig = window.matchMedia.bind(window);
    window.matchMedia = function (query) {
      const q = String(query);
      const fake = (matches) => ({
        matches,
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        onchange: null,
        dispatchEvent() {
          return false;
        },
      });
      if (patchMode === "zhMobileOnly") {
        if (q.includes("max-width: 991") || q.includes("max-width:991")) return fake(true);
      }
      if (patchMode === "no1199") {
        if (q.includes("min-width: 1199") || q.includes("min-width: 1200")) return fake(false);
      }
      if (patchMode === "no992") {
        if (q.includes("min-width: 992") || q.includes("min-width:992")) return fake(false);
      }
      if (patchMode === "noDesktopPins") {
        if (q.includes("min-width: 1199") || q.includes("min-width: 1200") || q.includes("min-width: 992"))
          return fake(false);
        if (q.includes("max-width: 991") || q.includes("max-width:991")) return fake(false);
      }
      return orig(query);
    };
  }, patch);

  const t0 = Date.now();
  let dcl = null;
  let err = null;
  try {
    await page.goto("http://127.0.0.1:4177/?v=zhfix19bisect", {
      waitUntil: "domcontentloaded",
      timeout: 12000,
    });
    dcl = Date.now() - t0;
    await page.waitForTimeout(2500);
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
        display: cs && cs.display,
        done: !!(p && p.classList.contains("zh-preloader-done")),
        ran: !!window.__zhPreloaderRan,
      };
    });
  } catch (e) {
    state = { evalError: e.message };
  }
  console.log(label, JSON.stringify({ dcl, err, state }));
  await browser.close();
}

(async () => {
  await run("A zhMobileOnly (smoother mobile)", "zhMobileOnly");
  await run("B no1199 pins", "no1199");
  await run("C no992 circle", "no992");
  await run("D noDesktopPins keep desktop smoother", "noDesktopPins");
  await run("E native", "none");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
