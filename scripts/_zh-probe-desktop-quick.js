const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
    args: ["--disable-gpu", "--no-sandbox"],
  });
  for (const [label, viewport] of [
    ["mobile", { width: 390, height: 844 }],
    ["desktop", { width: 1440, height: 900 }],
  ]) {
    const page = await browser.newPage({ viewport });
    const t0 = Date.now();
    page.on("pageerror", (e) => console.log(label, "ERR", e.message.slice(0, 120)));
    try {
      await page.goto("http://127.0.0.1:4177/?v=zhfix20pc", {
        waitUntil: "commit",
        timeout: 10000,
      });
      // Don't wait for full load — poll for preloader hide up to 8s
      let state = null;
      for (let i = 0; i < 16; i++) {
        await page.waitForTimeout(500);
        state = await page.evaluate(() => {
          const p = document.querySelector(".preloader");
          const cs = p ? getComputedStyle(p) : null;
          return {
            rs: document.readyState,
            display: cs && cs.display,
            done: !!(p && p.classList.contains("zh-preloader-done")),
            ran: !!window.__zhPreloaderRan,
            lite: !!window.__zhDesktopLite,
          };
        });
        if (state.done || state.display === "none") break;
      }
      console.log(label, Date.now() - t0, "ms", JSON.stringify(state));
    } catch (e) {
      console.log(label, "FAIL", e.message.split("\n")[0], Date.now() - t0);
    }
    await page.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
