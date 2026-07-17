"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import ProjectCoverImage from "@/components/ui/ProjectCoverImage";
import { cn, getProjectAccent, projectImageFit, typeLabels } from "@/lib/utils";
import type { Project } from "@/content/types";

interface ArchiveProjectCardProps {
  project: Project;
  featured?: boolean;
  className?: string;
}

/**
 * Cover-forward archive card for /projects.
 * Matches laptop preview language: full-bleed cover, condensed title, indigo hover.
 */
export default function ArchiveProjectCard({
  project,
  featured = false,
  className,
}: ArchiveProjectCardProps) {
  const caseStudyHref = project.caseStudy ? `/projects/${project.slug}` : undefined;
  const primaryHref = caseStudyHref ?? project.live ?? project.github ?? "/projects";
  const external = primaryHref.startsWith("http");
  const accent = getProjectAccent(project.slug);
  const imageFit = projectImageFit[project.slug] ?? "cover";
  const stackPreview = project.stack.slice(0, featured ? 6 : 4);
  const ctaLabel = caseStudyHref ? "Case study" : project.live ? "Live site" : "Open";

  return (
    <article
      className={cn(
        "group surface-card relative flex h-full flex-col overflow-hidden transition duration-300",
        "hover:-translate-y-1 hover:border-[var(--color-electric-indigo)]/55",
        className,
      )}
    >
      {external ? (
        <a
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[1]"
          aria-label={`${project.title}, ${ctaLabel}`}
        />
      ) : (
        <Link
          href={primaryHref}
          className="absolute inset-0 z-[1]"
          aria-label={`${project.title}, ${ctaLabel}`}
        />
      )}

      <div
        className={cn(
          "relative w-full overflow-hidden bg-[var(--color-graphite)]",
          featured ? "aspect-[21/10] sm:aspect-[2.2/1]" : "aspect-[16/10]",
        )}
      >
        {project.image ? (
          <ProjectCoverImage
            src={project.image}
            alt={`${project.title} cover`}
            className={cn(
              "transition duration-500 group-hover:scale-[1.03]",
              imageFit === "contain" ? "object-contain p-6" : "object-cover object-top",
            )}
            sizes={featured ? "(max-width: 768px) 100vw, 90vw" : "(max-width: 768px) 100vw, 50vw"}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${accent}55, var(--color-graphite) 70%)`,
            }}
            aria-hidden
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)] via-[var(--color-obsidian)]/40 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <p className="mono-label text-[var(--color-electric-indigo)]">
              {typeLabels[project.type]}
            </p>
            <h2
              className={cn(
                "mt-1.5 font-condensed uppercase leading-none tracking-tight text-[var(--color-paper)]",
                featured ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl",
              )}
            >
              {project.title}
            </h2>
          </div>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-slate)] bg-[var(--color-obsidian)]/80 text-[var(--color-paper)] backdrop-blur-sm transition group-hover:border-[var(--color-electric-indigo)] group-hover:bg-[var(--color-electric-indigo)]"
            aria-hidden
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>

      <div className="pointer-events-none relative z-[2] flex flex-1 flex-col p-5 sm:p-6">
        {project.result && (
          <p className="text-sm font-medium" style={{ color: accent }}>
            {project.result}
          </p>
        )}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-pearl)]">
          {project.description}
        </p>
        <p className="mono-label mt-4 normal-case tracking-[0.06em] text-[var(--color-stone)]">
          {stackPreview.join(" · ")}
          {project.stack.length > stackPreview.length ? " · +" : ""}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--color-slate)] pt-4">
          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-ash)] transition group-hover:text-[var(--color-paper)]">
            {ctaLabel}
            <ArrowUpRight size={14} aria-hidden />
          </span>
          {caseStudyHref && project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 text-sm text-[var(--color-stone)] transition hover:text-[var(--color-paper)]"
            >
              <ExternalLink size={13} aria-hidden />
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 text-sm text-[var(--color-stone)] transition hover:text-[var(--color-paper)]"
            >
              <Code2 size={13} aria-hidden />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
