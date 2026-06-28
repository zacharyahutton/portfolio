import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, ExternalLink } from "lucide-react";
import { cn, typeBadgeColors, typeLabels } from "@/lib/utils";
import type { Project } from "@/content/types";

interface ProjectCardProps {
  project: Project;
  className?: string;
  large?: boolean;
  linkToCaseStudy?: boolean;
}

export default function ProjectCard({
  project,
  className,
  large = false,
  linkToCaseStudy = false,
}: ProjectCardProps) {
  const caseStudyHref = project.caseStudy ? `/projects/${project.slug}` : undefined;

  return (
    <article
      className={cn(
        "surface-card group flex h-full flex-col overflow-hidden transition hover:border-[var(--color-pearl)]",
        className,
      )}
    >
      {project.image && (
        <div className={cn("relative w-full overflow-hidden bg-[var(--color-graphite)]", large ? "h-56" : "h-44")}>
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-medium text-[var(--color-paper)]",
              large ? "text-2xl" : "text-xl",
            )}
          >
            {project.title}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-widest",
              typeBadgeColors[project.type],
            )}
          >
            {typeLabels[project.type]}
          </span>
        </div>

        {project.result && (
          <p className="mt-2 text-xs font-medium text-[var(--color-electric-indigo)]">{project.result}</p>
        )}

        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-pearl)]">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--color-slate)] bg-[var(--color-obsidian)] px-3 py-1 text-[11px] text-[var(--color-ash)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--color-slate)] pt-4">
          {linkToCaseStudy && caseStudyHref && (
            <Link href={caseStudyHref} className="btn-primary text-xs">
              <ArrowRight size={14} />
              Case study
            </Link>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs"
            >
              <ExternalLink size={14} />
              Live site
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs"
            >
              <Code2 size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
