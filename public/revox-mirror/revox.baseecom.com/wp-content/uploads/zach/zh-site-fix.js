/**
 * ZH site fix v2 — preloader kill, sticky header, mobile chrome,
 * light mobile motion (keep highlight pop + work slider), work nav arrows.
 */
(function () {
  "use strict";

  /* ── Preloader: must never stick (CSS uses :not(.zh-preloader-done)) ── */
  function hidePreloader() {
    var el = document.querySelector(".preloader");
    if (!el) return;
    el.classList.add("zh-preloader-done", "is-hidden");
    try {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("z-index", "-1", "important");
      el.style.setProperty("pointer-events", "none", "important");
    } catch (e) {}
  }
  function armPreloader() {
    // Aggressive failsafes — desktop was stuck because display:flex !important
    // beat inline display:none without the done class.
    setTimeout(hidePreloader, 900);
    setTimeout(hidePreloader, 1600);
    setTimeout(hidePreloader, 2400);
    setTimeout(hidePreloader, 3600);
    if (document.readyState === "complete") {
      setTimeout(hidePreloader, 200);
    } else {
      window.addEventListener("load", function () {
        setTimeout(hidePreloader, 200);
        setTimeout(runHeroPop, 260);
      });
    }
  }
  armPreloader();

  /* ── Hero highlight pop AFTER preloader (mobile + desktop) ── */
  function runHeroPop() {
    hidePreloader();
    var img = document.querySelector(".hero-1 .animated-image, .animated-image");
    if (!img) return;
    if (img.classList.contains("zh-pop-done")) return;
    img.classList.add("zh-pop-pending");
    // Force reflow then play CSS animation
    void img.offsetWidth;
    img.classList.remove("zh-pop-pending");
    img.classList.add("zh-pop-ready", "zh-pop-done");
    try {
      if (window.gsap && window.matchMedia("(min-width: 992px)").matches) {
        window.gsap.fromTo(
          img,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", overwrite: "auto" }
        );
      }
    } catch (e) {}
  }

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
        (document.body.classList.contains("home") ||
          !!document.querySelector(".hero-1"))
      ) {
        document.body.classList.add("zh-has-hero");
      }
      var h = Math.ceil(hdr.getBoundingClientRect().height) || 80;
      document.documentElement.style.setProperty("--zh-header-h", h + "px");
      ["zach-header-hide", "header-hidden", "zh-hide-mobile"].forEach(function (c) {
        hdr.classList.remove(c);
      });
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

  /* ── Soften mobile motion: kill smoother + pins only, keep light motion ── */
  function softenMobileMotion() {
    if (!window.matchMedia("(max-width: 991px)").matches) return;
    try {
      if (window.ScrollSmoother) {
        var sm = window.ScrollSmoother.get && window.ScrollSmoother.get();
        if (sm) {
          try {
            sm.kill();
          } catch (e) {}
        }
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(function (t) {
          try {
            var pin = t.vars && t.vars.pin;
            var scrub = t.vars && t.vars.scrub;
            // Only kill pins / heavy scrubbers that break layout
            if (pin || scrub === true || (typeof scrub === "number" && scrub > 0)) {
              t.kill(true);
            }
          } catch (e) {}
        });
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
    // Titles must be readable (SplitText skipped on mobile, but failsafe)
    document.querySelectorAll(".tv_hero_title, .split-line, .hero_title").forEach(
      function (el) {
        if (parseFloat(getComputedStyle(el).opacity) < 0.2) {
          el.style.opacity = "1";
          el.style.visibility = "visible";
        }
      }
    );
  }

  /* ── Work experience nav arrows ── */
  function ensureWorkNav() {
    var main = document.querySelector(".fw_main_slider_active");
    if (!main) return;
    var wrap =
      main.closest(".feature-work-experience-wrap") ||
      main.closest(".work-experience-section-1") ||
      main.parentElement;
    if (!wrap) return;
    var nav = wrap.querySelector(".zh-work-nav");
    if (!nav) {
      nav = document.createElement("div");
      nav.className = "zh-work-nav";
      nav.setAttribute("aria-label", "Work experience navigation");
      nav.innerHTML =
        '<button type="button" class="zh-work-prev" aria-label="Previous experience">&#8592;</button>' +
        '<span class="zh-work-nav__hint">More work</span>' +
        '<button type="button" class="zh-work-next" aria-label="Next experience">&#8594;</button>';
      if (main.nextSibling) {
        main.parentNode.insertBefore(nav, main.nextSibling);
      } else {
        main.parentNode.appendChild(nav);
      }
    }
    if (nav.getAttribute("data-zh-bound") === "1") return;
    nav.setAttribute("data-zh-bound", "1");
    function getSwiper() {
      return main.swiper || null;
    }
    var prev = nav.querySelector(".zh-work-prev");
    var next = nav.querySelector(".zh-work-next");
    if (prev) {
      prev.addEventListener("click", function () {
        var s = getSwiper();
        if (s) s.slidePrev();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        var s = getSwiper();
        if (s) s.slideNext();
      });
    }
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
        softenMobileMotion();
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
    document.querySelectorAll(".tv_hero_title, .hero_title").forEach(function (el) {
      el.style.opacity = "1";
      el.style.visibility = "visible";
    });
    document.querySelectorAll(".tv_hero_title div, .tv_hero_title span, .split-line").forEach(
      function (el) {
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.transform = "none";
      }
    );
    hidePreloader();
    runHeroPop();
  }

  function boot() {
    fixDesktopHeader();
    initMobileNav();
    lazyImages();
    fixCaseStudyClicks();
    ensureWorkNav();
    setTimeout(softenMobileMotion, 120);
    setTimeout(softenMobileMotion, 700);
    setTimeout(fixDesktopHeader, 200);
    setTimeout(ensureWorkNav, 800);
    setTimeout(revealContentFailsafe, 1500);
    setTimeout(runHeroPop, 1700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    softenMobileMotion();
    fixDesktopHeader();
    hidePreloader();
    ensureWorkNav();
    setTimeout(runHeroPop, 220);
  });
  window.addEventListener("resize", function () {
    fixDesktopHeader();
    initMobileNav();
    softenMobileMotion();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var d = document.getElementById("zh-mobile-drawer");
      if (d && d.classList.contains("is-open")) closeDrawer();
    }
  });
})();
