"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MeshGradient } from "@paper-design/shaders-react";

/** Soft neutrals with a muted indigo wash — no saturated #1500ff punch */
const DARK_COLORS = ["#050508", "#0e0e14", "#1c1b2e", "#121218"];
const LIGHT_COLORS = ["#e4e5eb", "#eceef2", "#9a97b0", "#d8dae3"];

/**
 * Site-wide Paper Design MeshGradient atmosphere.
 * Kept very quiet so content stays primary.
 */
export default function PaperMeshBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";
  const colors = isLight ? LIGHT_COLORS : DARK_COLORS;
  const speed = reduceMotion ? 0 : isLight ? 0.2 : 0.32;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ opacity: isLight ? 0.28 : 0.34 }}
    >
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={colors}
        speed={speed}
        distortion={isLight ? 0.4 : 0.55}
        swirl={isLight ? 0.18 : 0.28}
        grainMixer={isLight ? 0.05 : 0.08}
        grainOverlay={isLight ? 0.03 : 0.05}
      />

      {/* Stronger vignette — keep edges quiet, content primary */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at center, transparent 28%, color-mix(in srgb, var(--color-obsidian) 72%, transparent) 100%)"
            : "radial-gradient(ellipse at center, transparent 25%, rgba(5,5,8,0.72) 100%)",
        }}
      />
    </div>
  );
}
