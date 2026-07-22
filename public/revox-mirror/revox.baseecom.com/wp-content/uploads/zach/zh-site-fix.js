/**
 * ZH site fix — mobile nav (root paths), always-visible chrome,
 * ScrollSmoother mobile kill, fast preloader, sticky header, case study scroll.
 */
(function () {
  "use strict";

  /* ── Fast preloader hide (don't wait forever on window load) ── */
  function hidePreloader() {
    var el = document.querySelector(".preloader");
    if (!el || el.classList.contains("zh-preloader-done")) return;
    el.classList.add("zh-preloader-done");
    el.style.display = "none";
    el.style.zIndex = "-1";
    el.style.pointerEvents = "none";
  }
  function armPreloader() {
    if (document.readyState === "complete") {
      setTimeout(hidePreloader, 280);
    } else {
      window.addEventListener("load", function () {
        setTimeout(hidePreloader, 280);
      });
      // Failsafe: never leave users stuck behind the loader
      setTimeout(hidePreloader, 2200);
    }
  }
  armPreloader();

  /* ── Desktop sticky header outside ScrollSmoother + never hide ── */
  function fixDesktopHeader() {
    var hdr = document.getElementById("header-sticky");
    if (!hdr) return;
    var desktop = window.matchMedia("(min-width: 992px)").matches;
    if (desktop) {
      if (hdr.parentElement !== document.body) {
        document.body.appendChild(hdr);
      }
      document.body.classList.add("zh-has-fixed-header");
      if (
        document.querySelector(
          ".hero-section, .hero-section1, .hero-1, .hero-5, .hero-3"
        ) &&
        document.body.classList.contains("home")
      ) {
        document.body.classList.add("zh-has-hero");
      }
      var h = Math.ceil(hdr.getBoundingClientRect().height) || 80;
      document.documentElement.style.setProperty("--zh-header-h", h + "px");
      ["zach-header-hide", "header-hidden", "zh-hide-mobile"].forEach(
        function (c) {
          hdr.classList.remove(c);
        }
      );
      hdr.style.removeProperty("transform");
      hdr.style.removeProperty("opacity");
      hdr.style.removeProperty("visibility");
      if (!hdr._zhObs) {
        hdr._zhObs = new MutationObserver(function () {
          if (!window.matchMedia("(min-width: 992px)").matches) return;
          ["zach-header-hide", "header-hidden", "zh-hide-mobile"].forEach(
            function (c) {
              hdr.classList.remove(c);
            }
          );
          if (hdr.style.transform && hdr.style.transform !== "none") {
            hdr.style.removeProperty("transform");
          }
        });
        hdr._zhObs.observe(hdr, {
          attributes: true,
          attributeFilter: ["class", "style"],
        });
      }
    }
  }

  /* ── Kill ScrollSmoother + pinned triggers on mobile ── */
  function killMobileMotion() {
    if (!window.matchMedia("(max-width: 991px)").matches) return;
    try {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(function (t) {
          try {
            t.kill(true);
          } catch (e) {}
        });
      }
      if (window.ScrollSmoother) {
        var sm = window.ScrollSmoother.get && window.ScrollSmoother.get();
        if (sm) {
          try {
            sm.kill();
          } catch (e) {}
        }
      }
    } catch (e) {}
    var wrap = document.getElementById("smooth-wrapper");
    var content = document.getElementById("smooth-content");
    if (wrap) {
      wrap.style.height = "auto";
      wrap.style.overflow = "visible";
      wrap.style.transform = "none";
    }
    if (content) {
      content.style.transform = "none";
      content.style.height = "auto";
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.querySelectorAll(".tv_hero_title, .split-line").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.visibility = "visible";
    });
  }

  /* ── Mobile drawer with root-absolute paths ── */
  var DRAWER_NAV =
    '<a class="zh-nav-top" href="/">Home</a>' +
    '<a class="zh-nav-top" href="/about-me/">About Me</a>' +
    '<div class="zh-nav-group"><button type="button" class="zh-nav-accordion" aria-expanded="false">Services<span class="zh-acc-chevron" aria-hidden="true">▼</span></button><div class="zh-nav-sub">' +
    '<a href="/services/">All Services</a>' +
    '<a href="/services/premium-business-websites/">Premium Business Websites</a>' +
    '<a href="/services/custom-software/">Custom Software</a>' +
    '<a href="/services/ai-integrations/">AI Integrations</a>' +
    '<a href="/services/automation-systems/">Automation Systems</a>' +
    '<a href="/services/seo/">SEO</a>' +
    '<a href="/services/business-platforms/">Business Platforms</a>' +
    '<a href="/services/maintenance/">Maintenance</a>' +
    '<a href="/services/performance-optimization/">Performance Optimization</a>' +
    '<a href="/services/consulting/">Consulting</a>' +
    "</div></div>" +
    '<div class="zh-nav-group"><button type="button" class="zh-nav-accordion" aria-expanded="false">More<span class="zh-acc-chevron" aria-hidden="true">▼</span></button><div class="zh-nav-sub">' +
    '<a href="/our-faq/">FAQ</a>' +
    '<a href="/privacy-policy/">Privacy Policy</a>' +
    '<a href="/terms/">Terms</a>' +
    "</div></div>" +
    '<a class="zh-nav-top" href="/portfolio-page/">Portfolio</a>' +
    '<a class="zh-nav-top" href="/blog/">Blog</a>' +
    '<a class="zh-nav-top" href="/contact-us/">Contact Me</a>';

  function openDrawer() {
    var d = document.getElementById("zh-mobile-drawer");
    var b = document.getElementById("zh-mobile-drawer-backdrop");
    var btn = document.querySelector("#zh-mobile-nav .zh-hamburger");
    if (!d || !b) return;
    d.classList.add("is-open");
    b.classList.add("is-open");
    document.body.classList.add("zh-drawer-open");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    var d = document.getElementById("zh-mobile-drawer");
    var b = document.getElementById("zh-mobile-drawer-backdrop");
    var btn = document.querySelector("#zh-mobile-nav .zh-hamburger");
    if (d) d.classList.remove("is-open");
    if (b) b.classList.remove("is-open");
    document.body.classList.remove("zh-drawer-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (d) {
      d.querySelectorAll(".zh-nav-group.is-open").forEach(function (g) {
        g.classList.remove("is-open");
        var ab = g.querySelector(".zh-nav-accordion");
        if (ab) ab.setAttribute("aria-expanded", "false");
      });
    }
  }
  function bindAccordions(drawer) {
    drawer.querySelectorAll(".zh-nav-accordion").forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var group = btn.closest(".zh-nav-group");
        if (!group) return;
        var wasOpen = group.classList.contains("is-open");
        drawer.querySelectorAll(".zh-nav-group.is-open").forEach(function (g) {
          g.classList.remove("is-open");
          var a = g.querySelector(".zh-nav-accordion");
          if (a) a.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          group.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      };
    });
  }
  function ensureDrawer() {
    var backdrop = document.getElementById("zh-mobile-drawer-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "zh-mobile-drawer-backdrop";
      backdrop.className = "zh-mobile-drawer-backdrop";
      backdrop.addEventListener("click", closeDrawer);
      document.body.appendChild(backdrop);
    }
    var drawer = document.getElementById("zh-mobile-drawer");
    if (drawer) drawer.remove();
    drawer = document.createElement("div");
    drawer.id = "zh-mobile-drawer";
    drawer.className = "zh-mobile-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Site navigation");
    drawer.innerHTML =
      '<div class="zh-mobile-drawer-header"><span>Menu</span><button type="button" class="zh-mobile-drawer-close" aria-label="Close menu">&times;</button></div><nav class="zh-mobile-drawer-nav">' +
      DRAWER_NAV +
      "</nav>";
    drawer.querySelector(".zh-mobile-drawer-close").addEventListener("click", closeDrawer);
    drawer.querySelectorAll(".zh-mobile-drawer-nav a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
    bindAccordions(drawer);
    document.body.appendChild(drawer);
  }
  function buildNav() {
    var existing = document.getElementById("zh-mobile-nav");
    if (existing) existing.remove();
    var nav = document.createElement("div");
    nav.id = "zh-mobile-nav";
    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "zh-back-btn";
    backBtn.setAttribute("aria-label", "Go back");
    backBtn.innerHTML = "&#8592;";
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.history.length > 1) window.history.back();
      else window.location.href = "/";
    });
    var menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "zh-hamburger";
    menuBtn.setAttribute("aria-label", "Open menu");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML =
      '<span class="zh-hamburger-icon" aria-hidden="true">&#9776;</span><span class="zh-hamburger-chevron" aria-hidden="true">&#9660;</span>';
    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var d = document.getElementById("zh-mobile-drawer");
      if (d && d.classList.contains("is-open")) closeDrawer();
      else openDrawer();
    });
    nav.appendChild(backBtn);
    nav.appendChild(menuBtn);
    document.body.appendChild(nav);
    return nav;
  }
  function buildHomeBtn() {
    var existing = document.querySelector(".zh-mobile-home-btn");
    if (existing) {
      existing.href = "/";
      return;
    }
    var btn = document.createElement("a");
    btn.className = "zh-mobile-home-btn";
    btn.href = "/";
    btn.setAttribute("aria-label", "Go to home page");
    btn.innerHTML = "&#8592; HOME";
    document.body.appendChild(btn);
  }
  function initMobileNav() {
    var mq = window.matchMedia("(max-width: 991px)");
    if (!mq.matches) {
      ["zh-mobile-nav", "zh-mobile-drawer-backdrop", "zh-mobile-drawer"].forEach(
        function (id) {
          var el = document.getElementById(id);
          if (el) el.remove();
        }
      );
      var hb = document.querySelector(".zh-mobile-home-btn");
      if (hb) hb.remove();
      document.body.classList.remove("zh-drawer-open");
      return;
    }
    ensureDrawer();
    buildNav();
    buildHomeBtn();
  }

  /* ── Lazy-load below-fold images ── */
  function lazyImages() {
    var imgs = document.querySelectorAll("img:not([loading])");
    imgs.forEach(function (img, i) {
      if (img.classList.contains("animated-image")) return;
      if (img.closest(".hero-section, .hero-1, .hero-section1, .preloader")) return;
      if (i < 2) {
        img.loading = "eager";
        return;
      }
      img.loading = "lazy";
      if (!img.getAttribute("decoding")) img.decoding = "async";
    });
  }

  /* ── Case study hash links: native scroll without ScrollSmoother glitch ── */
  function fixCaseStudyClicks() {
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#project-"]');
        if (!a) return;
        var id = a.getAttribute("href").slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        killMobileMotion();
        try {
          var sm =
            window.ScrollSmoother &&
            window.ScrollSmoother.get &&
            window.ScrollSmoother.get();
          if (sm && window.matchMedia("(min-width: 992px)").matches) {
            sm.scrollTo(target, true, "top 100px");
            return;
          }
        } catch (err) {}
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + id);
      },
      true
    );
  }

  function revealContentFailsafe() {
    document.body.classList.add("zh-ready");
    document.querySelectorAll(".animated-image, .tv_hero_title, .hero_title").forEach(function (el) {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
    document.querySelectorAll(".tv_hero_title div, .tv_hero_title span, .split-line").forEach(function (el) {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
    hidePreloader();
  }

  function boot() {
    fixDesktopHeader();
    initMobileNav();
    lazyImages();
    fixCaseStudyClicks();
    // Run after theme main.js (GSAP) has likely initialized
    setTimeout(killMobileMotion, 100);
    setTimeout(killMobileMotion, 600);
    setTimeout(killMobileMotion, 1500);
    setTimeout(fixDesktopHeader, 200);
    // Desktop blank failsafe: if SplitText/ScrollTrigger leave content at opacity 0
    setTimeout(revealContentFailsafe, 1800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    killMobileMotion();
    fixDesktopHeader();
    hidePreloader();
  });
  window.addEventListener("resize", function () {
    fixDesktopHeader();
    initMobileNav();
    killMobileMotion();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var d = document.getElementById("zh-mobile-drawer");
      if (d && d.classList.contains("is-open")) closeDrawer();
    }
  });
})();
