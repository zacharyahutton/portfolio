"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import DarkVeil from "./DarkVeil";

/**
 * Fixed full-viewport DarkVeil atmosphere — below content, above solid page bg.
 * Theme-aware: light mode gets a cooler indigo wash at readable opacity.
 */
export default function DarkVeilBackdrop() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";

  // Static soft wash when reduced motion — still shows atmosphere
  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
        style={{
          opacity: isLight ? 0.45 : 0.35,
          background: isLight
            ? "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(21,0,255,0.12), transparent 55%), linear-gradient(180deg, #dde0ea 0%, #e8e9ef 100%)"
            : "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(21,0,255,0.28), transparent 60%)",
        }}
      />
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{
        // Light mode needs higher opacity so the veil reads on soft gray
        opacity: isLight ? 0.55 : 0.48,
        mixBlendMode: isLight ? "multiply" : "normal",
      }}
    >
      <DarkVeil
        speed={isLight ? 0.28 : 0.38}
        hueShift={isLight ? 200 : 245}
        noiseIntensity={isLight ? 0.02 : 0.03}
        scanlineIntensity={0}
        scanlineFrequency={0}
        warpAmount={isLight ? 0.14 : 0.22}
        resolutionScale={0.7}
      />
    </div>
  );
}
