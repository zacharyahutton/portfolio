import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectCoverImage from "@/components/ui/ProjectCoverImage";
import { cn, getProjectAccent, projectImageFit } from "@/lib/utils";
import type { Project } from "@/content/types";

interface ProjectCoverCardProps {
  project: Project;
  className?: string;
}

/**
 * Cover-first card for the laptop preview embed.
 * Full-bleed image + corner arrow to the case study — no blurbs or button chrome.
 */
export default function ProjectCoverCard({ project, className }: ProjectCoverCardProps) {
  const href = project.caseStudy ? `/projects/${project.slug}` : project.live || project.github || "/projects";
  const accent = getProjectAccent(project.slug);
  const imageFit = projectImageFit[project.slug] ?? "cover";
  const external = href.startsWith("http");

  const body = (
    <>
      {project.image ? (
        <ProjectCoverImage
          src={project.image}
          alt={`${project.title} cover`}
          className={cn(
            "transition duration-500 group-hover:scale-[1.03]",
            imageFit === "contain" ? "object-contain p-6" : "object-cover object-top",
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${accent}55, var(--color-graphite) 70%)`,
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)]/85 via-transparent to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-5">
        <h3 className="font-condensed text-xl uppercase leading-none tracking-tight text-[var(--color-paper)] sm:text-2xl">
          {project.title}
        </h3>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-slate)] bg-[var(--color-obsidian)]/80 text-[var(--color-paper)] backdrop-blur-sm transition group-hover:border-[var(--color-electric-indigo)] group-hover:bg-[var(--color-electric-indigo)]"
          aria-hidden
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
    </>
  );

  const shell = cn(
    "group relative block aspect-[16/10] w-full overflow-hidden border border-[var(--color-slate)] bg-[var(--color-graphite)] transition hover:border-[var(--color-electric-indigo)]/60",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={shell} aria-label={`${project.title}, open`}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={shell} aria-label={`${project.title} case study`}>
      {body}
    </Link>
  );
}
