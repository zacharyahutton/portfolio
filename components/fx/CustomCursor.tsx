"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCoarsePointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Subtle indigo highlight follower — soft glow ring only, not a full cursor takeover.
 * Disabled for reduced motion and touch / coarse pointers.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [data-magnetic], [role='button'], input, textarea");
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] hidden md:block" aria-hidden>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovering ? 56 : 40,
          height: hovering ? 56 : 40,
          opacity: visible ? 1 : 0,
          background: hovering
            ? "radial-gradient(circle, rgba(21,0,255,0.28) 0%, rgba(21,0,255,0.08) 55%, transparent 70%)"
            : "radial-gradient(circle, rgba(21,0,255,0.18) 0%, rgba(21,0,255,0.05) 50%, transparent 70%)",
          boxShadow: hovering
            ? "0 0 0 1px rgba(21,0,255,0.35), 0 0 24px rgba(21,0,255,0.2)"
            : "0 0 0 1px rgba(21,0,255,0.22)",
        }}
      />
    </div>
  );
}
