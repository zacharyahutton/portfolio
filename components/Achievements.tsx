"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import DecryptedText from "./fx/DecryptedText";
import { achievements } from "@/content/achievements";

function CountUp({
  end,
  suffix = "",
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? end : 0);

  useEffect(() => {
    if (!inView || reduce) {
      setValue(end);
      return;
    }
    let frame = 0;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = end * eased;
      setValue(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, reduce, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? value.toFixed(decimals) : value}
      {suffix}
    </span>
  );
}

const STATS = [
  { end: 3.7, suffix: "", label: "GPA", decimals: 1 },
  { end: 3, suffix: "+", label: "Live products", decimals: 0 },
  { end: 5, suffix: "", label: "Wins and roles", decimals: 0 },
];

export default function Achievements() {
  const reduce = useReducedMotion();

  return (
    <section
      id="achievements"
      className="page-section relative overflow-hidden border-t border-[var(--color-slate)] px-6"
    >
      {/* Soft indigo bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-electric-indigo) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--page-max-width)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-condensed text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-[var(--color-paper)]">
            <DecryptedText
              text="Achievements"
              animateOn="view"
              sequential
              speed={32}
              encryptedClassName="text-[var(--color-electric-indigo)]/60"
            />
          </h2>
          <p className="mt-5 text-base text-[var(--color-pearl)]">
            Grades, delivery, and community work that prove I show up when it counts.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-center gap-8 sm:gap-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-condensed text-[clamp(2rem,5vw,3.25rem)] leading-none text-[var(--color-electric-indigo)]">
                <CountUp end={stat.end} suffix={stat.suffix} decimals={stat.decimals} />
              </p>
              <p className="mono-label mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => (
            <motion.article
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -4,
                      transition: { duration: 0.2 },
                    }
              }
              className="surface-card group relative h-full overflow-hidden p-6 transition-colors hover:border-[var(--color-electric-indigo)]/45"
            >
              <div
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px] bg-[var(--color-electric-indigo)] opacity-70 transition group-hover:opacity-100"
              />
              <p className="mono-label text-[var(--color-electric-indigo)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-[var(--color-paper)] sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-pearl)]">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
