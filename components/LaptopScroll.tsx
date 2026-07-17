"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/** Chrome-free projects grid , no site Navbar inside the machine. */
const PREVIEW_PATH = "/projects/preview";

export default function LaptopScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Phase 1: lid opens. Phase 2: zoom in. Phase 3: browse projects inside the screen.
  const rotateX = useTransform(scrollYProgress, [0, 0.28], [38, 0]);
  const scale = useTransform(scrollYProgress, [0.05, 0.3, 0.78], [0.82, 1, 1.28]);
  const deckOpacity = useTransform(scrollYProgress, [0.45, 0.7], [1, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0.28, 0.48], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0.28, 0.48], [0, -40]);
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.88], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.72, 0.88], [24, 0]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      const doc = win.document;
      const max = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight);
      // Browse the project list while zoomed in
      const inner = Math.min(1, Math.max(0, (p - 0.32) / 0.52));
      win.scrollTo({ top: inner * max, behavior: "auto" });
    } catch {
      // cross-origin , skip
    }
  });

  return (
    <section id="preview" ref={trackRef} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        <motion.div
          style={reduce ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-6 flex flex-col items-center text-center sm:mb-8"
        >
          <h2 className="font-condensed text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-[var(--color-paper)]">
            Shipped &amp; running
          </h2>
          <p className="mt-4 max-w-md text-sm text-[var(--color-pearl)] sm:text-base">
            Keep scrolling. The machine opens, zooms in, and browses the project list.
          </p>
        </motion.div>

        <div className="relative w-full max-w-[860px]" style={{ perspective: 1600 }}>
          <motion.div
            style={reduce ? undefined : { scale, transformOrigin: "50% 40%" }}
            className="relative"
          >
            <motion.div
              style={
                reduce
                  ? undefined
                  : { rotateX, transformOrigin: "50% 100%", transformStyle: "preserve-3d" }
              }
              className="relative mx-auto w-full overflow-hidden rounded-t-xl border border-[var(--color-slate)] bg-[#0a0a0a] shadow-[0_40px_120px_-20px_rgba(21,0,255,0.25)]"
            >
              <div className="relative aspect-[16/10] w-full bg-[var(--color-charcoal)]">
                <div className="flex items-center gap-2 border-b border-[var(--color-slate)] bg-[var(--color-graphite)] px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="mono-label ml-3 truncate text-[var(--color-stone)]">
                    /projects
                  </span>
                </div>
                <iframe
                  ref={iframeRef}
                  src={PREVIEW_PATH}
                  title="Projects showcase"
                  loading="lazy"
                  scrolling="no"
                  className="pointer-events-none h-[calc(100%-37px)] w-full border-0 bg-[var(--color-obsidian)]"
                  sandbox="allow-scripts allow-same-origin"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.06) 0%, transparent 30%)",
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              style={reduce ? undefined : { opacity: deckOpacity }}
              className="relative mx-auto h-3.5 w-[104%] -translate-x-[2%] rounded-b-xl border border-t-0 border-[var(--color-slate)] bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-charcoal)]"
            >
              <div className="absolute left-1/2 top-0 h-1 w-24 -translate-x-1/2 rounded-b-md bg-[var(--color-slate)]" />
            </motion.div>
          </motion.div>

          <motion.div
            style={
              reduce
                ? undefined
                : { opacity: ctaOpacity, y: ctaY }
            }
            className={`z-20 flex justify-center ${
              reduce ? "relative mt-8" : "pointer-events-auto absolute inset-x-0 -bottom-2"
            }`}
          >
            <Link
              href="/projects"
              className="btn-primary inline-flex min-h-[44px] items-center gap-1.5 shadow-[0_12px_40px_-8px_rgba(21,0,255,0.55)]"
            >
              View all projects
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
