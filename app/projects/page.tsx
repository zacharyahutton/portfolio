import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsArchiveHero from "@/components/ProjectsArchiveHero";
import ProjectsGrid from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects · Zachary Hutton",
  description:
    "Contract delivery, personal APIs, and coursework labs. Full project archive with case studies for weROI, PNTCOG, StudySync, and more.",
};

export default function ProjectsPage() {
  return (
    <div>
      <Navbar variant="standalone" />
      <main className="min-h-screen pt-24">
        <ProjectsArchiveHero />
        <section className="px-6 py-14 sm:py-16">
          <ProjectsGrid linkToCaseStudy />
        </section>
      </main>
      <Footer />
    </div>
  );
}
