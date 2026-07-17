"use client";

import { useEffect, useRef } from "react";
import GithubIcon from "@/components/ui/GithubIcon";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import TechIcon from "@/components/ui/TechIcon";
import { profile } from "@/content/profile";

type Floater = {
  id: string;
  x: number;
  y: number;
  size: number;
  href?: string;
  label: string;
  kind: "github" | "linkedin" | "instagram" | "react" | "python" | "next";
};

const FLOATERS: Floater[] = [
  { id: "gh", x: 12, y: 22, size: 44, href: profile.contact.github, label: "GitHub", kind: "github" },
  { id: "li", x: 82, y: 18, size: 40, href: profile.contact.linkedin, label: "LinkedIn", kind: "linkedin" },
  { id: "ig", x: 78, y: 68, size: 38, href: profile.contact.instagram, label: "Instagram", kind: "instagram" },
  { id: "re", x: 18, y: 72, size: 36, label: "React", kind: "react" },
  { id: "py", x: 48, y: 12, size: 34, label: "Python", kind: "python" },
  { id: "nx", x: 55, y: 78, size: 36, label: "Next.js", kind: "next" },
];

function IconGlyph({ kind, size }: { kind: Floater["kind"]; size: number }) {
  const iconSize = Math.round(size * 0.42);
  switch (kind) {
    case "github":
      return <GithubIcon size={iconSize} />;
    case "linkedin":
      return <LinkedinIcon size={iconSize} />;
    case "instagram":
      return <InstagramIcon size={iconSize} />;
    case "react":
      return <TechIcon kind="react" size={iconSize} />;
    case "python":
      return <TechIcon kind="python" size={iconSize} />;
    case "next":
      return <TechIcon kind="nextjs" size={iconSize} />;
  }
}

export default function FloatingIconField({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.current = {
        x: (e.clientX - rect.left) / Math.max(1, rect.width),
        y: (e.clientY - rect.top) / Math.max(1, rect.height),
      };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const { x: px, y: py } = pointer.current;
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const base = FLOATERS[i];
        const dx = (px - base.x / 100) * 28;
        const dy = (py - base.y / 100) * 22;
        el.style.transform = `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden={false}>
      {FLOATERS.map((f, i) => {
        const className =
          "absolute flex items-center justify-center rounded-full border border-[var(--color-slate)] bg-[var(--color-graphite)]/85 text-[var(--color-pearl)] shadow-lg backdrop-blur-md will-change-transform";
        const style = {
          left: `${f.x}%`,
          top: `${f.y}%`,
          width: f.size,
          height: f.size,
          transform: "translate3d(-50%, -50%, 0)",
        } as const;

        if (f.href) {
          return (
            <a
              key={f.id}
              ref={(node) => {
                itemsRef.current[i] = node;
              }}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={f.label}
              className={`${className} pointer-events-auto z-10 transition-colors hover:border-[var(--color-electric-indigo)] hover:text-[var(--color-paper)]`}
              style={style}
            >
              <IconGlyph kind={f.kind} size={f.size} />
            </a>
          );
        }

        return (
          <span
            key={f.id}
            ref={(node) => {
              itemsRef.current[i] = node;
            }}
            className={`${className} pointer-events-none`}
            style={style}
            aria-hidden
          >
            <IconGlyph kind={f.kind} size={f.size} />
          </span>
        );
      })}
    </div>
  );
}
