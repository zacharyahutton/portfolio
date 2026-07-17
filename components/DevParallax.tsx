"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import FuzzyText from "@/components/fx/FuzzyText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Indigo parallax bridge with oversized, low-intensity FuzzyText brand lines.
 */
export default function DevParallax() {
  const scope = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const layers = isMobile
        ? [
            { sel: ".parallax-stars", y: 18 },
            { sel: ".parallax-hills", y: 28 },
            { sel: ".parallax-glow", y: 14 },
          ]
        : [
            { sel: ".parallax-stars", y: 48 },
            { sel: ".parallax-words", y: 64 },
            { sel: ".parallax-hills-far", y: 28 },
            { sel: ".parallax-hills", y: 62 },
            { sel: ".parallax-mid", y: 40 },
            { sel: ".parallax-glow", y: 34 },
          ];

      layers.forEach(({ sel, y }) => {
        gsap.to(sel, {
          y,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope },
  );

  const isLight = mounted && resolvedTheme === "light";
  const primary = isLight ? "#1500ff" : "#fdfdfd";
  const secondary = isLight ? "#2e2e3a" : "rgba(253,253,253,0.7)";

  return (
    <section
      ref={scope}
      aria-hidden
      className="relative h-[58vh] min-h-[320px] max-h-[580px] overflow-hidden border-y border-[var(--color-electric-indigo)]/25 sm:h-[64vh]"
    >
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "linear-gradient(180deg, #d8dae6 0%, #e4e5ef 40%, #ececf4 70%, var(--color-obsidian) 100%)"
            : "linear-gradient(180deg, #06040f 0%, #0c0824 35%, #120a38 55%, #0a0618 78%, var(--color-obsidian) 100%)",
        }}
      />

      <div className="parallax-stars absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(2px 2px at 10% 20%, rgba(253,253,253,0.9), transparent)," +
              "radial-gradient(1.5px 1.5px at 22% 48%, rgba(180,170,255,0.85), transparent)," +
              "radial-gradient(2px 2px at 38% 14%, rgba(253,253,253,0.75), transparent)," +
              "radial-gradient(1px 1px at 52% 36%, rgba(21,0,255,0.9), transparent)," +
              "radial-gradient(2px 2px at 68% 18%, rgba(253,253,253,0.8), transparent)," +
              "radial-gradient(1.5px 1.5px at 78% 42%, rgba(180,170,255,0.7), transparent)," +
              "radial-gradient(1px 1px at 88% 28%, rgba(253,253,253,0.7), transparent)," +
              "radial-gradient(2px 2px at 15% 68%, rgba(253,253,253,0.55), transparent)," +
              "radial-gradient(1.5px 1.5px at 45% 72%, rgba(180,170,255,0.6), transparent)," +
              "radial-gradient(1px 1px at 62% 62%, rgba(253,253,253,0.5), transparent)," +
              "radial-gradient(2px 2px at 92% 70%, rgba(21,0,255,0.7), transparent)",
            opacity: isLight ? 0.35 : 1,
          }}
        />
      </div>

      {/* Bigger brand moment, quieter glitch */}
      <div className="parallax-words pointer-events-none absolute inset-x-0 top-[8%] z-[2] flex flex-col items-center gap-3 sm:top-[10%] sm:gap-4">
        <FuzzyText
          fontSize="clamp(5rem,16vw,11rem)"
          fontWeight={800}
          fontFamily="var(--font-condensed), Arial Narrow, sans-serif"
          color={primary}
          baseIntensity={0.06}
          hoverIntensity={0.18}
          fuzzRange={12}
          enableHover
        >
          SHIP IT
        </FuzzyText>
        <FuzzyText
          fontSize="clamp(1.85rem,5vw,3.25rem)"
          fontWeight={600}
          fontFamily="var(--font-mono), monospace"
          color={secondary}
          baseIntensity={0.04}
          hoverIntensity={0.12}
          fuzzRange={8}
          enableHover
        >
          design · build · deploy
        </FuzzyText>
      </div>

      <div className="parallax-mid pointer-events-none absolute inset-0 hidden sm:block">
        <div
          className="absolute left-[12%] top-[30%] h-24 w-24 rounded-full border border-[var(--color-electric-indigo)]/40"
          style={{ boxShadow: "0 0 40px rgba(21,0,255,0.25)" }}
        />
        <div className="absolute right-[18%] top-[22%] h-3 w-3 rounded-full bg-[var(--color-electric-indigo)]" />
        <div className="absolute right-[28%] top-[48%] h-2 w-16 bg-[var(--color-electric-indigo)]/50" />
      </div>

      <svg
        className="parallax-hills-far absolute bottom-0 left-0 w-[140%] max-w-none -translate-x-[10%] text-[#2a1a8a]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        height="58%"
        style={{ opacity: isLight ? 0.35 : 1 }}
      >
        <path
          fill="currentColor"
          d="M0,140 C180,90 320,160 520,120 C720,80 880,150 1100,100 C1280,65 1380,110 1440,90 L1440,200 L0,200 Z"
        />
      </svg>

      <svg
        className="parallax-hills absolute bottom-0 left-0 w-[160%] max-w-none -translate-x-[15%] text-[var(--color-electric-indigo)]"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        height="72%"
        style={{ opacity: isLight ? 0.45 : 0.72 }}
      >
        <path
          fill="currentColor"
          d="M0,160 C220,110 380,180 560,140 C780,90 960,170 1180,120 C1320,90 1400,140 1440,130 L1440,220 L0,220 Z"
        />
      </svg>

      <div
        className="parallax-glow pointer-events-none absolute bottom-[-25%] left-1/2 h-[70%] w-[80%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(21,0,255,0.55), rgba(21,0,255,0.15) 45%, transparent 70%)",
        }}
      />
    </section>
  );
}
