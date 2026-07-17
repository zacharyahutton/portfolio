"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Renders a stat value. If it contains a number ("3.7", "3+"),
 * the numeric part counts up when scrolled into view.
 */
export default function StatValue({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const match = value.match(/(\d+(?:\.\d+)?)/);
  const target = match ? parseFloat(match[1]) : null;
  const decimals = match?.[1].includes(".") ? match[1].split(".")[1].length : 0;
  const [display, setDisplay] = useState(target !== null && !reduce ? 0 : target);

  useEffect(() => {
    if (target === null || reduce || !inView) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce]);

  if (target === null || !match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const [before, after] = value.split(match[1]);
  return (
    <span ref={ref} className={className}>
      {before}
      {(display ?? target).toFixed(decimals)}
      {after}
    </span>
  );
}
