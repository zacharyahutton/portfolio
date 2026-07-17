"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tile = {
  left: string;
  top: string;
  size: number;
  rotate: number;
  delayFactor: number;
  variant: "solid" | "outline" | "glow";
};

const TILES: Tile[] = [
  { left: "4%", top: "12%", size: 46, rotate: -14, delayFactor: 0, variant: "outline" },
  { left: "12%", top: "68%", size: 34, rotate: 22, delayFactor: 0.15, variant: "solid" },
  { left: "22%", top: "30%", size: 26, rotate: 8, delayFactor: 0.3, variant: "glow" },
  { left: "78%", top: "16%", size: 40, rotate: 18, delayFactor: 0.1, variant: "solid" },
  { left: "88%", top: "52%", size: 30, rotate: -20, delayFactor: 0.25, variant: "outline" },
  { left: "70%", top: "76%", size: 48, rotate: -6, delayFactor: 0.4, variant: "glow" },
  { left: "40%", top: "8%", size: 22, rotate: 30, delayFactor: 0.2, variant: "solid" },
  { left: "56%", top: "88%", size: 28, rotate: -28, delayFactor: 0.35, variant: "outline" },
];

/**
 * Scroll-driven ambient layer for the Services section — indigo tiles tip,
 * drift, and cascade as the user scrolls through, then the energy dies down
 * (fades out) when the section leaves the viewport. Pointer-events none.
 */
export default function ServicesAmbient({ scrollTarget = "#services" }: { scrollTarget?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;

      // Energy envelope: rise entering the section, die down leaving it.
      gsap.fromTo(
        scope.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scrollTarget,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
      gsap.to(scope.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scrollTarget,
          start: "bottom 60%",
          end: "bottom 15%",
          scrub: true,
        },
      });

      if (isCoarse) return; // keep mobile calm: envelope only, no tile physics

      // Tiles knock over / cascade as you scrub through the section — domino feel.
      gsap.utils.toArray<HTMLElement>(".svc-tile").forEach((el, i) => {
        const factor = Number(el.dataset.factor ?? 0);
        gsap.to(el, {
          y: 120 + i * 14,
          rotation: `+=${(i % 2 === 0 ? 1 : -1) * (55 + i * 12)}`,
          ease: "none",
          scrollTrigger: {
            trigger: scrollTarget,
            start: `top ${70 - factor * 25}%`,
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      // Rolling "ball" that sweeps across and knocks the tiles — playful anchor.
      gsap.fromTo(
        ".svc-ball",
        { xPercent: -140, rotation: 0 },
        {
          xPercent: 140,
          rotation: 720,
          ease: "none",
          scrollTrigger: {
            trigger: scrollTarget,
            start: "top 65%",
            end: "bottom 35%",
            scrub: 1,
          },
        },
      );
    },
    { scope, dependencies: [scrollTarget] },
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0"
    >
      {/* Faint indigo grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--color-electric-indigo) 14%, transparent) 1px, transparent 1px)," +
            "linear-gradient(90deg, color-mix(in srgb, var(--color-electric-indigo) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(180deg, transparent, black 65%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 65%)",
        }}
      />

      {/* Indigo bloom */}
      <div
        className="absolute left-1/2 top-1/3 h-[55%] w-[70%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-electric-indigo) 22%, transparent), transparent 70%)",
        }}
      />

      {/* Rolling ball */}
      <div
        className="svc-ball absolute left-1/2 top-[58%] h-10 w-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, color-mix(in srgb, var(--color-paper) 55%, var(--color-electric-indigo)), var(--color-electric-indigo) 70%)",
          boxShadow: "0 0 32px color-mix(in srgb, var(--color-electric-indigo) 55%, transparent)",
        }}
      />

      {/* Dominos / tiles */}
      {TILES.map((tile, i) => (
        <div
          key={i}
          data-factor={tile.delayFactor}
          className="svc-tile absolute"
          style={{
            left: tile.left,
            top: tile.top,
            width: tile.size,
            height: tile.size * 1.4,
            transform: `rotate(${tile.rotate}deg)`,
            borderRadius: 6,
            ...(tile.variant === "solid" && {
              background: "color-mix(in srgb, var(--color-electric-indigo) 55%, var(--color-graphite))",
            }),
            ...(tile.variant === "outline" && {
              border: "1.5px solid color-mix(in srgb, var(--color-electric-indigo) 60%, transparent)",
            }),
            ...(tile.variant === "glow" && {
              background: "color-mix(in srgb, var(--color-electric-indigo) 30%, transparent)",
              boxShadow: "0 0 24px color-mix(in srgb, var(--color-electric-indigo) 45%, transparent)",
            }),
          }}
        />
      ))}
    </div>
  );
}
