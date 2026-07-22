/**
 * Inject ZH_DESKTOP_LITE early return at start of document.ready
 * on all main_ver files that lack it. Mobile path unchanged.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com/wp-content/themes/revox/assets/js"
);

const INSERT = `    $documentOn.ready( function() {
      window.__zhDesktopLite = !window.matchMedia('(max-width: 991px)').matches;
      /* ZH_DESKTOP_LITE: theme GSAP/pin/swiper stack freezes desktop tabs.
         Keep full motion on mobile; desktop uses native scroll + early preloader failsafe. */
      if (window.__zhDesktopLite) {
        $(".sidebar__toggle").on("click", function () {
          $(".offcanvas__info").addClass("info-open");
          $(".offcanvas__overlay").addClass("overlay-open");
        });
        $(".offcanvas__close, .offcanvas__overlay").on("click", function () {
          $(".offcanvas__info").removeClass("info-open");
          $(".offcanvas__overlay").removeClass("overlay-open");
        });
        $windowOn.on('scroll', function() {
          var windowScrollTop = $(this).scrollTop();
          var windowHeight = $(window).height();
          var documentHeight = $(document).height();
          if (windowScrollTop + windowHeight >= documentHeight - 10) {
            $("#back-top").addClass("show");
          } else {
            $("#back-top").removeClass("show");
          }
        });
        $("#back-top").on("click", function() {
          $('html, body').animate({ scrollTop: 0 }, 800);
          return false;
        });
        return;
      }
`;

const OLD = `    $documentOn.ready( function() {
`;

const files = fs.readdirSync(dir).filter((f) => f.startsWith("main_ver=") && f.endsWith(".js"));
let patched = 0;
let skipped = 0;

for (const f of files) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, "utf8");
  if (s.includes("ZH_DESKTOP_LITE:")) {
    skipped++;
    continue;
  }
  if (!s.includes(OLD)) {
    console.warn("NO_MATCH ready:", f);
    continue;
  }
  // Only replace the first ready opener
  s = s.replace(OLD, INSERT);
  fs.writeFileSync(fp, s);
  patched++;
  console.log("patched", f);
}

console.log(JSON.stringify({ patched, skipped, total: files.length }));
