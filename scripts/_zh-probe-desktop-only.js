const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
    args: ["--disable-gpu", "--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => console.log("ERR", e.message.slice(0, 160)));
  page.on("console", (m) => {
    if (m.type() === "error") console.log("console", m.text().slice(0, 160));
  });
  const t0 = Date.now();
  console.log("goto");
  await page.goto("http://127.0.0.1:4177/?v=zhfix20desk", {
    waitUntil: "commit",
    timeout: 15000,
  });
  console.log("commit", Date.now() - t0);
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(400);
    const state = await page.evaluate(() => ({
      rs: document.readyState,
      scripts: document.scripts.length,
      pre: document.querySelector(".preloader")
        ? document.querySelector(".preloader").className
        : null,
      display: document.querySelector(".preloader")
        ? getComputedStyle(document.querySelector(".preloader")).display
        : null,
      lite: window.__zhDesktopLite,
      ran: window.__zhPreloaderRan,
    }));
    console.log(i, Date.now() - t0, JSON.stringify(state));
    if (state.display === "none" || (state.pre && state.pre.includes("zh-preloader-done"))) {
      break;
    }
  }
  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
