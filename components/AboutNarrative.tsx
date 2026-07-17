"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DragPlayground from "@/components/fx/DragPlayground";
import { experience } from "@/content/experience";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutNarrative() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = gsap.utils.toArray<HTMLElement>(".narrative-entry");
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          },
        );
      });

    },
    { scope },
  );

  return (
    <section
      id="experience"
      ref={scope}
      className="relative border-t border-[var(--color-slate)] bg-[var(--color-obsidian)] px-6 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[var(--page-max-width)] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Sticky heading column */}
        <div className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
          <h2 className="font-condensed text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.86] tracking-tight text-[var(--color-paper)]">
            <span className="text-[var(--color-electric-indigo)]">Destructuring</span>
            <br />
            my work
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-pearl)] sm:text-base">
            Contract desks, freelance builds, and UTech labs: the places I learned to scope hard,
            ship on schedule, and leave something running when I walk away.
          </p>

          <DragPlayground className="mt-10 hidden max-w-sm lg:block" />
        </div>

        {/* Entries */}
        <div className="flex flex-col">
          {experience.map((entry, i) => (
            <div
              key={entry.id}
              className="narrative-entry border-b border-[var(--color-slate)] py-8 first:border-t"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                <span className="mono-label text-right">{entry.period}</span>
              </div>
              <h3 className="mt-4 text-2xl font-medium leading-tight text-[var(--color-paper)] sm:text-3xl">
                {entry.title}{" "}
                <span className="text-[var(--color-electric-indigo)]">@ {entry.org}</span>
              </h3>
              <ul className="mt-5 space-y-3">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-pearl)] sm:text-base"
                  >
                    <span className="status-dot mt-2 shrink-0" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
