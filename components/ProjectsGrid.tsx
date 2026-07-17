"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import ArchiveProjectCard from "./ui/ArchiveProjectCard";
import { allProjects } from "@/content/projects";
import { cn } from "@/lib/utils";
import type { ProjectType } from "@/content/types";

const filters: { key: "all" | ProjectType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "professional", label: "Contract" },
  { key: "personal", label: "Personal" },
  { key: "coursework", label: "Coursework" },
];

interface ProjectsGridProps {
  className?: string;
  /** Kept for API compatibility; archive always prefers case studies when present. */
  linkToCaseStudy?: boolean;
}

export default function ProjectsGrid({ className }: ProjectsGridProps) {
  const [active, setActive] = useState<"all" | ProjectType>("all");
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const list = active === "all" ? allProjects : allProjects.filter((p) => p.type === active);
    return [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [active]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allProjects.length };
    for (const f of filters) {
      if (f.key === "all") continue;
      map[f.key] = allProjects.filter((p) => p.type === f.key).length;
    }
    return map;
  }, []);

  return (
    <div className={cn("mx-auto max-w-[var(--page-max-width)]", className)}>
      <div
        className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-slate)] pb-4"
        role="tablist"
        aria-label="Filter projects by type"
      >
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {filters.map((f) => {
            const isActive = active === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f.key)}
                className={cn(
                  "relative px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition sm:px-4",
                  isActive
                    ? "text-[var(--color-paper)]"
                    : "text-[var(--color-ash)] hover:text-[var(--color-pearl)]",
                )}
              >
                {f.label}
                <span className="ml-1.5 text-[var(--color-stone)]">{counts[f.key] ?? 0}</span>
                {isActive && (
                  <motion.span
                    layoutId={reduce ? undefined : "projects-filter-underline"}
                    className="absolute inset-x-3 -bottom-px h-px bg-[var(--color-electric-indigo)] sm:inset-x-4"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="mono-label text-[var(--color-stone)]">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-2"
        >
          {filtered.map((project, i) => {
            const featured = Boolean(project.featured) && active === "all" && i === 0;
            return (
              <SectionReveal
                key={project.id}
                delay={(i % 4) * 0.05}
                className={featured ? "md:col-span-2" : undefined}
              >
                <ArchiveProjectCard project={project} featured={featured} />
              </SectionReveal>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-[var(--color-pearl)]">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
