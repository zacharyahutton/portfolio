"use client";

import ProjectCoverCard from "@/components/ui/ProjectCoverCard";
import { allProjects } from "@/content/projects";

/** Cover-only grid for the laptop iframe — featured first, then the rest. */
export default function ProjectsCoverBrowse() {
  const projects = [...allProjects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return (
    <div className="mx-auto grid max-w-[var(--page-max-width)] gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCoverCard key={project.id} project={project} />
      ))}
    </div>
  );
}
