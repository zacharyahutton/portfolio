"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useTheme } from "next-themes";
import GithubIcon from "@/components/ui/GithubIcon";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import TechIcon, { type TechIconKind } from "@/components/ui/TechIcon";
import { profile } from "@/content/profile";

type Chip =
  | { kind: TechIconKind; top?: string; left?: string; right?: string; bottom?: string; delay: number; href?: undefined }
  | { kind: "github" | "linkedin"; top?: string; left?: string; right?: string; bottom?: string; delay: number; href: string };

const CHIPS: Chip[] = [
  { kind: "react", top: "8%", left: "-4%", delay: 0 },
  { kind: "nextjs", top: "24%", right: "-8%", delay: 0.4 },
  { kind: "typescript", bottom: "30%", left: "-10%", delay: 0.8 },
  { kind: "fastapi", bottom: "8%", right: "-2%", delay: 1.2 },
  { kind: "python", top: "52%", right: "-12%", delay: 1.6 },
  { kind: "github", top: "42%", left: "-13%", delay: 2, href: "" },
  { kind: "linkedin", bottom: "-2%", left: "14%", delay: 2.4, href: "" },
];

function ChipGlyph({ kind }: { kind: Chip["kind"] }) {
  if (kind === "github") return <GithubIcon size={18} />;
  if (kind === "linkedin") return <LinkedinIcon size={18} />;
  return <TechIcon kind={kind} size={18} />;
}

export default function TiltPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [imgOk, setImgOk] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const chipHref = (kind: Chip["kind"]) =>
    kind === "github"
      ? profile.contact.github
      : kind === "linkedin"
        ? profile.contact.linkedin
        : undefined;

  const isLight = mounted && resolvedTheme === "light";

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto flex w-full max-w-[460px] items-end justify-center pt-6"
      style={{ perspective: 1000 }}
    >
      {/* Moody studio wash — no black slab under the cutout */}
      <div
        aria-hidden
        className="absolute inset-x-4 top-[18%] bottom-[6%] z-0 rounded-[40%] blur-3xl"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 55% 50% at 50% 55%, rgba(21,0,255,0.18), transparent 72%)"
            : "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(21,0,255,0.38), transparent 70%)",
        }}
      />

      {/* FULL STACK behind the head — stronger presence, still behind portrait */}
      <span
        aria-hidden
        className="font-condensed pointer-events-none absolute top-[6%] left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap text-[clamp(3.6rem,9vw,6.25rem)] uppercase leading-none tracking-tight"
        style={{
          color: isLight ? "var(--color-paper)" : "var(--color-paper)",
          opacity: isLight ? 0.55 : 0.62,
          textShadow: isLight
            ? "0 0 40px rgba(21,0,255,0.12)"
            : "0 2px 40px rgba(0,0,0,0.45), 0 0 60px rgba(21,0,255,0.2)",
        }}
      >
        Full Stack
      </span>

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 w-full"
      >
        <div className="relative aspect-[3/3.55] w-full">
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/zachary-hutton-cutout.png"
              alt="Zachary Hutton"
              onError={() => setImgOk(false)}
              className="absolute inset-0 h-full w-full bg-transparent object-contain object-[center_72%]"
              style={{
                filter: "contrast(1.06) brightness(1.02)",
                maskImage: "linear-gradient(180deg, black 92%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 92%, transparent 100%)",
              }}
            />
          ) : (
            <div
              className="absolute inset-6 flex items-center justify-center border border-[var(--color-slate)]"
              style={{
                background:
                  "radial-gradient(circle at 40% 30%, rgba(21,0,255,0.35), var(--color-graphite) 70%)",
              }}
            >
              <span className="font-condensed text-[6rem] uppercase leading-none text-[var(--color-paper)]/80">
                ZH
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* DEVELOPER — outlined / ghost over chest, pulled up, slightly transparent */}
      <span
        aria-hidden
        className="font-condensed pointer-events-none absolute bottom-[18%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[clamp(2.6rem,6.5vw,4.5rem)] uppercase leading-none tracking-tight"
        style={{
          color: "transparent",
          WebkitTextStroke: isLight
            ? "1.5px color-mix(in srgb, var(--color-paper) 55%, transparent)"
            : "1.5px color-mix(in srgb, var(--color-paper) 72%, transparent)",
          opacity: 0.88,
        }}
      >
        Developer
      </span>

      <div className="absolute -bottom-1 right-0 z-20 flex items-center gap-2">
        <span className="status-dot" />
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-paper)]/80">
          Available for work
        </span>
      </div>

      {CHIPS.map((chip) => {
        const href = chipHref(chip.kind);
        const content = (
          <motion.span
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-slate)] bg-[var(--color-charcoal)]/90 text-[var(--color-pearl)] shadow-lg backdrop-blur-sm transition-colors hover:border-[var(--color-electric-indigo)] hover:text-[var(--color-paper)]"
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{
              duration: 4.5,
              delay: chip.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChipGlyph kind={chip.kind} />
          </motion.span>
        );
        const style = {
          top: chip.top,
          left: chip.left,
          right: chip.right,
          bottom: chip.bottom,
        };
        return href ? (
          <a
            key={chip.kind}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={chip.kind === "github" ? "GitHub" : "LinkedIn"}
            className="absolute z-30 hidden md:block"
            style={style}
          >
            {content}
          </a>
        ) : (
          <span key={chip.kind} className="absolute z-30 hidden select-none md:block" style={style} aria-hidden>
            {content}
          </span>
        );
      })}
    </div>
  );
}
