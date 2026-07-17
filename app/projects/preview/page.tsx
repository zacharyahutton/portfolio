import type { Metadata } from "next";
import ProjectsCoverBrowse from "@/components/ProjectsCoverBrowse";

export const metadata: Metadata = {
  title: "Projects preview · Zachary Hutton",
  robots: { index: false, follow: false },
};

/**
 * Chrome-free cover browse for the homepage LaptopScroll iframe.
 * Covers + arrow CTAs only — no descriptions or button chrome.
 */
export default function ProjectsPreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] px-4 py-6 sm:px-5 sm:py-8">
      <ProjectsCoverBrowse />
    </main>
  );
}
