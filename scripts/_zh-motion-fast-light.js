/**
 * Lighten + speed up Revox motion (desktop restored, keep safe guards).
 * Applies to all main_ver=*.js
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "../public/revox-mirror/revox.baseecom.com/wp-content/themes/revox/assets/js"
);

const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("main_ver=") && f.endsWith(".js"));

let n = 0;
for (const f of files) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, "utf8");
  const before = s;

  // Snappier ScrollSmoother
  s = s.replace(/smooth:\s*0\.65,/g, "smooth: 0.35, /* ZH_MOTION_FAST */");

  // Lighter SplitText travel + faster reveal
  s = s.replace(
    /gsap\.set\(split\.chars,\s*\{\s*x:\s*100,\s*opacity:\s*0\s*\}\);/g,
    "gsap.set(split.chars, { x: 40, opacity: 0 }); /* ZH_MOTION_FAST */"
  );
  s = s.replace(
    /gsap\.set\(split\.chars,\s*\{\s*y:\s*100,\s*opacity:\s*0\s*\}\);/g,
    "gsap.set(split.chars, { y: 36, opacity: 0 }); /* ZH_MOTION_FAST */"
  );
  s = s.replace(
    /gsap\.set\(split\.chars,\s*\{\s*y:\s*100,\s*scaleY:\s*0,\s*opacity:\s*0,\s*rotationX:\s*15\s*\}\);/g,
    "gsap.set(split.chars, { y: 28, scaleY: 0.85, opacity: 0, rotationX: 6 }); /* ZH_MOTION_FAST */"
  );

  // SplitText tween timing (common block)
  s = s.replace(
    /opacity:\s*1,\s*duration:\s*1,\s*stagger:\s*0\.05,\s*rotationX:\s*15,\s*delay:\s*0\.1,\s*ease:\s*"power3\.inOut"/g,
    'opacity: 1, duration: 0.5, stagger: 0.02, rotationX: 0, delay: 0.04, ease: "power2.out" /* ZH_MOTION_FAST */'
  );

  // Faster preloader wave
  s = s.replace(
    /tl\.to\("\.preloader-text",\s*\{\s*delay:\s*0\.3,\s*y:\s*-100,\s*opacity:\s*0,\s*duration:\s*0\.5,/g,
    'tl.to(".preloader-text", {\n            delay: 0.12,\n            y: -60,\n            opacity: 0,\n            duration: 0.28,'
  );
  s = s.replace(
    /tl\.to\(svg,\s*\{\s*duration:\s*0\.3,\s*attr:\s*\{\s*d:\s*curve\s*\},\s*ease:\s*"power2\.in",\s*\}\)\.to\(svg,\s*\{\s*duration:\s*0\.5,/g,
    'tl.to(svg, {\n            duration: 0.18,\n            attr: { d: curve },\n            ease: "power2.in",\n        }).to(svg, {\n            duration: 0.32,'
  );
  s = s.replace(
    /tl\.to\("\.preloader",\s*\{\s*y:\s*-1500,\s*duration:\s*0\.8,/g,
    'tl.to(".preloader", {\n            y: -1500,\n            duration: 0.45,'
  );
  s = s.replace(
    /duration:\s*1,\s*ease:\s*"power3\.out",\s*\},\s*"-=0\.3"/g,
    'duration: 0.55, ease: "power2.out",\n            },\n            "-=0.2" /* ZH_MOTION_FAST */'
  );

  // Snappier pin scrub (scroll-linked, less lag)
  s = s.replace(/scrub:\s*3,/g, "scrub: 1.2, /* ZH_MOTION_FAST */");
  s = s.replace(/scrub:\s*2,/g, "scrub: 1, /* ZH_MOTION_FAST */");
  s = s.replace(/scrub:\s*1\.5,/g, "scrub: 0.8, /* ZH_MOTION_FAST */");

  // Faster title scale timelines that feel sluggish
  s = s.replace(
    /project_text\.to\("\.gt-project-title4",\s*\{\s*scale:\s*1,\s*duration:\s*2\s*\}\);/g,
    'project_text.to(".gt-project-title4", { scale: 1, duration: 1.1 }); /* ZH_MOTION_FAST */'
  );

  if (s !== before) {
    fs.writeFileSync(fp, s);
    n++;
    console.log("tuned", f);
  } else {
    console.log("noop", f);
  }
}
console.log(JSON.stringify({ tuned: n, total: files.length }));
