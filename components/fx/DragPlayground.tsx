"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import GithubIcon from "@/components/ui/GithubIcon";
import TechIcon, { type TechIconKind } from "@/components/ui/TechIcon";

type DragItem = {
  id: string;
  kind: TechIconKind | "github";
  size: number;
  x: string;
  y: string;
  accent?: boolean;
};

const ITEMS: DragItem[] = [
  { id: "gh", kind: "github", size: 72, x: "8%", y: "18%", accent: true },
  { id: "react", kind: "react", size: 52, x: "58%", y: "8%" },
  { id: "ts", kind: "typescript", size: 48, x: "70%", y: "55%" },
  { id: "py", kind: "python", size: 48, x: "30%", y: "60%" },
];

export default function DragPlayground({ className = "" }: { className?: string }) {
  const boundsRef = useRef<HTMLDivElement>(null);

  return (
    <div className={className}>
      <div
        ref={boundsRef}
        className="relative h-56 w-full overflow-hidden border border-dashed border-[var(--color-slate)] bg-[var(--color-charcoal)]/40"
      >
        {ITEMS.map((item) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={boundsRef}
            dragElastic={0.18}
            dragMomentum
            dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
            whileHover={{ scale: 1.08 }}
            whileDrag={{ scale: 1.18, rotate: 6 }}
            className={`absolute flex cursor-grab touch-none items-center justify-center rounded-2xl border shadow-lg active:cursor-grabbing ${
              item.accent
                ? "border-[var(--color-electric-indigo)] bg-[var(--color-electric-indigo)] text-white"
                : "border-[var(--color-slate)] bg-[var(--color-graphite)] text-[var(--color-pearl)]"
            }`}
            style={{
              width: item.size,
              height: item.size,
              left: item.x,
              top: item.y,
            }}
            aria-label={item.kind === "github" ? "Draggable GitHub icon" : `Draggable ${item.kind} icon`}
          >
            {item.kind === "github" ? (
              <GithubIcon size={Math.round(item.size * 0.5)} />
            ) : (
              <TechIcon kind={item.kind} size={Math.round(item.size * 0.5)} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
