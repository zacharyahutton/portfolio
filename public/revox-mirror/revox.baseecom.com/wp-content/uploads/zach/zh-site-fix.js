/**
 * ZH site fix v3
 * - Let Revox preloader wave run; failsafe only if stuck (~5.5s)
 * - Sticky desktop header (no MutationObserver thrash)
 * - Mobile drawer / home chrome
 * - Work nav beside logo preview
 * - No mobile animation killers, no forced title transform resets
 */
(function () {
  "use strict";

  var preloaderHidden = false;

  function hidePreloader() {
    if (preloaderHidden) return;
    var el = document.querySelector(".preloader");
    if (!el) {
      preloaderHidden = true;
      return;
    }
    preloaderHidden = true;
    el.classList.add("zh-preloader-done", "is-hidden");
    try {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("z-index", "-1", "important");
      el.style.setProperty("pointer-events", "none", "important");
    } catch (e) {}
  }

  function armPreloaderFailsafe() {
    // Theme timeline is ~2.4s+. Only intervene if still covering the page.
    setTimeout(function () {
      var el = document.querySelector(".preloader");
      if (!el || preloaderHidden) return;
      if (el.classList.contains("zh-preloader-done")) return;
      try {
        var cs = window.getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.05) {
          el.classList.add("zh-preloader-done", "is-hidden");
          preloaderHidden = true;
          return;
        }
      } catch (e) {}
      hidePreloader();
    }, 5500);

    // If hero portrait stayed at GSAP start state, reveal it (do not fight mid-animation)
    setTimeout(function () {
      document.querySelectorAll(".animated-image").forEach(function (img) {
        try {
          if (parseFloat(window.getComputedStyle(img).opacity) < 0.15) {
            img.style.opacity = "1";
            img.style.visibility = "visible";
            img.style.transform = "none";
          }
        } catch (e) {}
      });
      document.querySelectorAll(".tv_hero_title").forEach(function (el) {
        try {
          if (parseFloat(window.getComputedStyle(el).opacity) < 0.15) {
            el.style.opacity = "1";
            el.style.visibility = "visible";
          }
        } catch (e) {}
      });
    }, 6500);
  }
  armPreloaderFailsafe();

  // When theme GSAP finishes sliding the preloader away, mark done.
  function watchThemePreloader() {
    var el = document.querySelector(".preloader");
    if (!el || typeof MutationObserver === "undefined") return;
    var obs = new MutationObserver(function () {
      try {
        var cs = window.getComputedStyle(el);
        if (cs.display === "none" || Number(cs.opacity) < 0.05) {
          el.classList.add("zh-preloader-done", "is-hidden");
          preloaderHidden = true;
          obs.disconnect();
        }
      } catch (e) {}
    });
    obs.observe(el, { attributes: true, attributeFilter: ["style", "class"] });
  }
  watchThemePreloader();

  /* ── Desktop sticky header (outside ScrollSmoother) ── */
  function fixDesktopHeader() {
    var hdr = document.getElementById("header-sticky");
    if (!hdr) return;
    var desktop = window.matchMedia("(min-width: 992px)").matches;
    if (!desktop) return;

    if (hdr.parentElement !== document.body) {
      document.body.appendChild(hdr);
    }
    document.body.classList.add("zh-has-fixed-header");
    if (
      document.querySelector(".hero-section, .hero-section1, .hero-1, .hero-5, .hero-3") &&
      (document.body.classList.contains("home") || !!document.querySelector(".hero-1"))
    ) {
      document.body.classList.add("zh-has-hero");
    }
    var h = Math.ceil(hdr.getBoundingClientRect().height) || 80;
    document.documentElement.style.setProperty("--zh-header-h", h + "px");

    function clearHide() {
      ["zach-header-hide", "header-hidden", "zh-hide-mobile"].forEach(function (c) {
        hdr.classList.remove(c);
      });
      if (hdr.style.transform && hdr.style.transform !== "none") {
        hdr.style.removeProperty("transform");
      }
      hdr.style.removeProperty("opacity");
      hdr.style.removeProperty("visibility");
    }
    clearHide();

    // Scroll listener instead of MutationObserver (avoids attribute thrash / freezes)
    if (!hdr._zhScrollGuard) {
      hdr._zhScrollGuard = true;
      var ticking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            ticking = false;
            if (!window.matchMedia("(min-width: 992px)").matches) return;
            clearHide();
          });
        },
        { passive: true }
      );
    }
  }

  /* ── Work experience nav: arrows flanking logo preview ── */
  function ensureWorkNav() {
    var preview = document.querySelector(".feature-work-experience-preview");
    var main = document.querySelector(".fw_main_slider_active");
    if (!preview && !main) return;

    // Remove nav sitting after text slider
    document
      .querySelectorAll(
        ".fw_main_slider_active + .zh-work-nav, .feature-work-experience-main-slider + .zh-work-nav"
      )
      .forEach(function (n) {
        n.remove();
      });

    if (preview) {
      var prev = preview.querySelector(":scope > .zh-work-prev");
      var next = preview.querySelector(":scope > .zh-work-next");
      var slider = preview.querySelector(".feature-work-experience-preview-slider");
      if (!prev) {
        prev = document.createElement("button");
        prev.type = "button";
        prev.className = "zh-work-prev";
        prev.setAttribute("aria-label", "Previous experience");
        prev.innerHTML = "&#8592;";
        preview.insertBefore(prev, preview.firstChild);
      }
      if (!next) {
        next = document.createElement("button");
        next.type = "button";
        next.className = "zh-work-next";
        next.setAttribute("aria-label", "Next experience");
        next.innerHTML = "&#8594;";
        if (slider && slider.nextSibling) preview.insertBefore(next, slider.nextSibling);
        else preview.appendChild(next);
      } else if (slider && next.previousElementSibling !== slider) {
        preview.insertBefore(next, slider.nextSibling);
      }
    }

    function getMainSwiper() {
      var el = document.querySelector(".fw_main_slider_active");
      return el && el.swiper ? el.swiper : null;
    }
    function getPreviewSwiper() {
      var el = document.querySelector(".fw_preview_slider_active");
      return el && el.swiper ? el.swiper : null;
    }
    function syncPreviewToMain() {
      var mainS = getMainSwiper();
      var prevS = getPreviewSwiper();
      if (!mainS || !prevS) return;
      try {
        prevS.slideTo(mainS.activeIndex, 450);
      } catch (e) {}
      try {
        if (typeof window.__zhSpinWorkCircle === "function") {
          window.__zhSpinWorkCircle(mainS.activeIndex, true);
        }
      } catch (e2) {}
    }
    function stepWork(dir) {
      var mainS = getMainSwiper();
      var prevS = getPreviewSwiper();
      var nextIndex = null;
      if (mainS) {
        nextIndex =
          dir < 0
            ? (mainS.activeIndex - 1 + mainS.slides.length) %
              mainS.slides.length
            : (mainS.activeIndex + 1) % mainS.slides.length;
        if (dir < 0) mainS.slidePrev();
        else mainS.slideNext();
      } else if (prevS) {
        nextIndex =
          dir < 0
            ? (prevS.activeIndex - 1 + prevS.slides.length) %
              prevS.slides.length
            : (prevS.activeIndex + 1) % prevS.slides.length;
        if (dir < 0) prevS.slidePrev();
        else prevS.slideNext();
      }
      try {
        if (
          nextIndex != null &&
          typeof window.__zhSpinWorkCircle === "function"
        ) {
          window.__zhSpinWorkCircle(nextIndex, true, dir < 0 ? -1 : 1);
        }
      } catch (e3) {}
      setTimeout(syncPreviewToMain, 30);
      setTimeout(syncPreviewToMain, 320);
    }

    if (preview && preview.getAttribute("data-zh-work-bound") === "1") {
      // Still re-bind slideChange if main exists now
    } else if (preview) {
      preview.setAttribute("data-zh-work-bound", "1");
    }

    document.querySelectorAll(".zh-work-prev").forEach(function (btn) {
      if (btn.getAttribute("data-zh-click") === "1") return;
      btn.setAttribute("data-zh-click", "1");
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          stepWork(-1);
        },
        true
      );
    });
    document.querySelectorAll(".zh-work-next").forEach(function (btn) {
      if (btn.getAttribute("data-zh-click") === "1") return;
      btn.setAttribute("data-zh-click", "1");
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          stepWork(1);
        },
        true
      );
    });

    var mainS = getMainSwiper();
    if (mainS && !mainS._zhPreviewSync) {
      mainS._zhPreviewSync = true;
      mainS.on("slideChange", syncPreviewToMain);
      syncPreviewToMain();
    }
  }

  /* ── Desktop circle: smooth 360° snap to selected logo, then stop ── */
  function initWorkCircleSpin() {
    if (!window.matchMedia("(min-width: 992px)").matches) return;
    if (!window.gsap) return;
    var root = document.querySelector(
      ".feature-work-experience-preview-slider.fw_preview_slider_active, .feature-work-experience-preview-slider"
    );
    if (!root) return;
    var wrapper = root.querySelector(".swiper-wrapper");
    if (!wrapper) return;
    if (wrapper.getAttribute("data-zh-spin") === "1") return;

    var slides = Array.prototype.slice.call(
      wrapper.querySelectorAll(".swiper-slide")
    );
    if (slides.length < 2) return;

    var total = slides.length;
    var stepDeg = 360 / total;
    var rot = -90;
    var currentIndex = 0;
    var tries = 0;
    var spinning = false;

    function indexNow() {
      var main = document.querySelector(".fw_main_slider_active");
      if (main && main.swiper) {
        return typeof main.swiper.realIndex === "number"
          ? main.swiper.realIndex
          : main.swiper.activeIndex;
      }
      var prev = document.querySelector(".fw_preview_slider_active");
      if (prev && prev.swiper) return prev.swiper.activeIndex;
      var active = wrapper.querySelector(
        ".swiper-slide-thumb-active, .swiper-slide-active"
      );
      var i = active ? slides.indexOf(active) : 0;
      return i < 0 ? 0 : i;
    }

    function keepLogosUpright() {
      var r = Number(gsap.getProperty(wrapper, "rotation")) || 0;
      slides.forEach(function (slide) {
        gsap.set(slide, { rotation: -r });
      });
    }

    /**
     * Move around the full 360° ring by step count (not a random reverse).
     * dirHint: 1 = next / forward, -1 = prev / backward, 0 = shortest arc.
     */
    function spinTo(index, animate, dirHint) {
      if (index == null || isNaN(index)) index = 0;
      index = ((index % total) + total) % total;

      rot = Number(gsap.getProperty(wrapper, "rotation"));
      if (isNaN(rot)) rot = -90 - currentIndex * stepDeg;

      var forward = (index - currentIndex + total) % total;
      var backward = (currentIndex - index + total) % total;
      var steps = 0;

      if (dirHint === 1) {
        steps = forward === 0 ? 0 : forward;
      } else if (dirHint === -1) {
        steps = backward === 0 ? 0 : -backward;
      } else if (forward === 0 && backward === 0) {
        steps = 0;
      } else {
        steps = forward <= backward ? forward : -backward;
      }

      if (steps === 0) {
        currentIndex = index;
        if (!animate) {
          gsap.killTweensOf(wrapper);
          rot = -90 - index * stepDeg;
          gsap.set(wrapper, { rotation: rot });
          keepLogosUpright();
        }
        return;
      }

      // Increasing index moves clockwise on our ring (more negative rotation)
      var target = rot - steps * stepDeg;
      currentIndex = index;
      rot = target;

      gsap.killTweensOf(wrapper);
      spinning = !!animate;

      if (!animate) {
        gsap.set(wrapper, { rotation: rot });
        keepLogosUpright();
        spinning = false;
        return;
      }

      var dur = Math.min(0.72, 0.34 + Math.abs(steps) * 0.07);
      gsap.to(wrapper, {
        rotation: rot,
        duration: dur,
        ease: "power3.out",
        overwrite: true,
        onUpdate: keepLogosUpright,
        onComplete: function () {
          spinning = false;
          // Hard stop on exact angle for this step (no drift)
          gsap.set(wrapper, { rotation: rot });
          keepLogosUpright();
        },
      });
    }

    window.__zhSpinWorkCircle = function (index, animate, dirHint) {
      spinTo(index, animate !== false, dirHint || 0);
    };

    function bind() {
      var positioned = slides.some(function (s) {
        return (
          s.style.position === "absolute" ||
          window.getComputedStyle(s).position === "absolute"
        );
      });
      if (!positioned && tries < 40) {
        tries += 1;
        setTimeout(bind, 120);
        return;
      }

      wrapper.setAttribute("data-zh-spin", "1");
      root.classList.add("zh-work-circle-spin");
      gsap.set(wrapper, { transformOrigin: "50% 50%", force3D: true });

      try {
        if (window.ScrollTrigger) {
          ScrollTrigger.getAll().forEach(function (st) {
            var t = st.vars && st.vars.trigger;
            var el =
              typeof t === "string" ? document.querySelector(t) : t;
            if (
              el &&
              el.classList &&
              el.classList.contains("feature-work-experience-preview-slider")
            ) {
              st.kill();
            }
          });
        }
      } catch (e) {}

      currentIndex = indexNow();
      rot = -90 - currentIndex * stepDeg;
      spinTo(currentIndex, false, 0);

      function onChange() {
        var idx = indexNow();
        var forward = (idx - currentIndex + total) % total;
        var backward = (currentIndex - idx + total) % total;
        var dir = 0;
        if (forward === 1 || (forward > 0 && forward < backward)) dir = 1;
        else if (backward === 1 || (backward > 0 && backward < forward))
          dir = -1;
        spinTo(idx, true, dir);
      }

      var main = document.querySelector(".fw_main_slider_active");
      var prev = document.querySelector(".fw_preview_slider_active");
      if (main && main.swiper && !main.swiper._zhCircleSpin) {
        main.swiper._zhCircleSpin = true;
        main.swiper.on("slideChange", onChange);
      }
      if (prev && prev.swiper && !prev.swiper._zhCircleSpin) {
        prev.swiper._zhCircleSpin = true;
        prev.swiper.on("slideChange", onChange);
      }
      slides.forEach(function (slide, i) {
        slide.addEventListener(
          "click",
          function () {
            var forward = (i - currentIndex + total) % total;
            var backward = (currentIndex - i + total) % total;
            var dir =
              forward === 0 && backward === 0
                ? 0
                : forward <= backward
                  ? 1
                  : -1;
            setTimeout(function () {
              spinTo(i, true, dir);
            }, 10);
          },
          true
        );
      });
    }

    bind();
  }

  /* ── Mobile drawer ── */
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
    '<a class="zh-nav-top" href="/testimonials/">Testimonials</a>' +
    '<a class="zh-nav-top" href="/blog/">Blog</a>' +
    '<a class="zh-nav-top" href="/hire-me/">Hire Me</a>' +
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
      ["zh-mobile-nav", "zh-mobile-drawer-backdrop", "zh-mobile-drawer"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.remove();
      });
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
        try {
          var sm =
            window.ScrollSmoother &&
            window.ScrollSmoother.get &&
            window.ScrollSmoother.get();
          if (sm) {
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

  function fixOffcanvasMenuDupes() {
    document.querySelectorAll(".offcanvas__info .mobile-menus, .offcanvas__info .mobile-menu").forEach(function (wrap) {
      var source = wrap.querySelector("#mobile-menus, nav.menu-main-menu-container");
      var meanNav = wrap.querySelector(".mean-nav");
      if (meanNav && source && source !== meanNav) {
        source.style.setProperty("display", "none", "important");
      }
      var means = wrap.querySelectorAll(".mean-nav");
      for (var i = 1; i < means.length; i++) {
        means[i].remove();
      }
    });
  }

  /** Collapse offcanvas submenus; parent label toggles instead of navigating */
  function fixOffcanvasAccordion() {
    var roots = document.querySelectorAll(".offcanvas__info .mean-nav");
    if (!roots.length) return;

    function collapseNav(nav) {
      nav.querySelectorAll(":scope > ul > li").forEach(function (li) {
        var sub = null;
        for (var c = 0; c < li.children.length; c++) {
          if (li.children[c].tagName === "UL") {
            sub = li.children[c];
            break;
          }
        }
        var expand = li.querySelector("a.mean-expand");
        if (sub) {
          sub.style.display = "none";
          li.classList.remove("dropdown-opened", "zh-submenu-open");
        }
        if (expand) {
          expand.classList.remove("mean-clicked");
          var icon = expand.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
          }
        }
      });
    }

    roots.forEach(function (nav) {
      collapseNav(nav);
      if (nav.getAttribute("data-zh-acc") === "1") return;
      nav.setAttribute("data-zh-acc", "1");

      nav.querySelectorAll(":scope > ul > li").forEach(function (li) {
        var sub = null;
        var link = null;
        var expand = null;
        for (var c = 0; c < li.children.length; c++) {
          var child = li.children[c];
          if (child.tagName === "UL") sub = child;
          if (child.tagName === "A" && child.classList.contains("mean-expand")) expand = child;
          else if (child.tagName === "A" && !link) link = child;
        }
        if (!sub || !link) return;

        link.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = li.classList.contains("dropdown-opened") || li.classList.contains("zh-submenu-open");

            nav.querySelectorAll(":scope > ul > li").forEach(function (sib) {
              if (sib === li) return;
              var sibSub = null;
              for (var i = 0; i < sib.children.length; i++) {
                if (sib.children[i].tagName === "UL") {
                  sibSub = sib.children[i];
                  break;
                }
              }
              var sibExp = sib.querySelector("a.mean-expand");
              if (sibSub) {
                sibSub.style.display = "none";
                sib.classList.remove("dropdown-opened", "zh-submenu-open");
              }
              if (sibExp) {
                sibExp.classList.remove("mean-clicked");
                var sibIcon = sibExp.querySelector("i");
                if (sibIcon) {
                  sibIcon.classList.remove("fa-minus");
                  sibIcon.classList.add("fa-plus");
                }
              }
            });

            if (isOpen) {
              sub.style.display = "none";
              li.classList.remove("dropdown-opened", "zh-submenu-open");
              if (expand) {
                expand.classList.remove("mean-clicked");
                var iconClose = expand.querySelector("i");
                if (iconClose) {
                  iconClose.classList.remove("fa-minus");
                  iconClose.classList.add("fa-plus");
                }
              }
            } else {
              sub.style.display = "block";
              li.classList.add("dropdown-opened", "zh-submenu-open");
              if (expand) {
                expand.classList.add("mean-clicked");
                var iconOpen = expand.querySelector("i");
                if (iconOpen) {
                  iconOpen.classList.remove("fa-plus");
                  iconOpen.classList.add("fa-minus");
                }
              }
            }
          },
          true
        );
      });
    });
  }

  /** Centered project-inner carousel with properly fitted covers */
  function fixProjectInnerSlider() {
    var el = document.querySelector(".project-section-3 .project-inner-slider");
    if (!el || typeof window.Swiper === "undefined") return;
    if (el.swiper && el.getAttribute("data-zh-inner") === "1") return;

    try {
      if (el.swiper) el.swiper.destroy(true, true);
    } catch (err) {}

    try {
      // eslint-disable-next-line no-new
      new Swiper(el, {
        spaceBetween: 16,
        speed: 900,
        loop: true,
        centeredSlides: true,
        slidesPerView: 1.12,
        watchOverflow: true,
        autoplay: {
          delay: 2800,
          disableOnInteraction: false,
        },
        breakpoints: {
          575: { slidesPerView: 1.2, spaceBetween: 18 },
          767: { slidesPerView: 1.55, spaceBetween: 22 },
          991: { slidesPerView: 2.05, spaceBetween: 24 },
          1200: { slidesPerView: 2.35, spaceBetween: 28 },
        },
      });
      el.setAttribute("data-zh-inner", "1");
    } catch (e2) {}
  }

  /** Featured project cards: light L/R slide-in (faster, shorter travel) */
  function initFeaturedProjectCards() {
    var section = document.querySelector(".tp-project-5-2-area");
    if (!section) return;
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.setAttribute("data-zh-cards", "1");
      return;
    }
    if (section.getAttribute("data-zh-cards") === "1") return;
    section.setAttribute("data-zh-cards", "1");

    var cards = section.querySelectorAll(".project-box-items");
    if (!cards.length) return;

    var wide = window.matchMedia("(min-width: 992px)").matches;
    var dist = wide ? 64 : 40;

    cards.forEach(function (card, i) {
      var fromLeft = i % 2 === 0;
      gsap.fromTo(
        card,
        {
          x: fromLeft ? -dist : dist,
          opacity: 0,
          rotate: 0,
          force3D: true,
        },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: wide ? 0.55 : 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    try {
      ScrollTrigger.refresh();
    } catch (e2) {}
  }

  function boot() {
    fixDesktopHeader();
    initMobileNav();
    lazyImages();
    fixCaseStudyClicks();
    ensureWorkNav();
    setTimeout(fixDesktopHeader, 200);
    setTimeout(ensureWorkNav, 600);
    setTimeout(ensureWorkNav, 1400);
    setTimeout(initWorkCircleSpin, 400);
    setTimeout(initWorkCircleSpin, 1200);
    setTimeout(initFeaturedProjectCards, 80);
    setTimeout(initFeaturedProjectCards, 600);
    setTimeout(fixOffcanvasMenuDupes, 200);
    setTimeout(fixOffcanvasMenuDupes, 800);
    setTimeout(fixOffcanvasAccordion, 250);
    setTimeout(fixOffcanvasAccordion, 900);
    setTimeout(fixProjectInnerSlider, 500);
    setTimeout(fixProjectInnerSlider, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    fixDesktopHeader();
    ensureWorkNav();
    initWorkCircleSpin();
    initFeaturedProjectCards();
    fixOffcanvasMenuDupes();
    fixOffcanvasAccordion();
    fixProjectInnerSlider();
  });

  document.addEventListener(
    "click",
    function (e) {
      var toggle = e.target.closest && e.target.closest(".sidebar__toggle");
      if (!toggle) return;
      setTimeout(function () {
        fixOffcanvasMenuDupes();
        fixOffcanvasAccordion();
        document.querySelectorAll(".offcanvas__info .mean-nav ul ul, .offcanvas__info #mobile-menus > ul > li > ul").forEach(function (ul) {
          ul.style.display = "none";
        });
        document.querySelectorAll(".offcanvas__info .mean-nav li, .offcanvas__info #mobile-menus > ul > li").forEach(function (li) {
          li.classList.remove("dropdown-opened", "zh-submenu-open");
        });
        document.querySelectorAll(".offcanvas__info a.mean-expand").forEach(function (a) {
          a.classList.remove("mean-clicked");
          var icon = a.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
          }
        });
      }, 30);
    },
    true
  );
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      fixDesktopHeader();
      initMobileNav();
    }, 150);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var d = document.getElementById("zh-mobile-drawer");
      if (d && d.classList.contains("is-open")) closeDrawer();
    }
  });
})();
