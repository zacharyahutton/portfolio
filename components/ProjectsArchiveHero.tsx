"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DecryptedText from "@/components/fx/DecryptedText";
import { allProjects } from "@/content/projects";

export default function ProjectsArchiveHero() {
  const withCaseStudies = allProjects.filter((p) => p.caseStudy).length;
  const featured = allProjects.filter((p) => p.featured).length;

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-slate)] px-6 pb-14 pt-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 0%, rgba(21,0,255,0.18), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-[var(--page-max-width)]">
        <Link
          href="/#preview"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
        >
          <ArrowLeft size={14} aria-hidden />
          Home
        </Link>
        <h1 className="mt-6 font-condensed text-[clamp(2.75rem,8vw,5.5rem)] uppercase leading-[0.88] tracking-tight text-[var(--color-paper)]">
          <DecryptedText
            text="All projects"
            animateOn="view"
            sequential
            speed={32}
            encryptedClassName="text-[var(--color-electric-indigo)]/55"
          />
        </h1>
        <p className="mt-5 max-w-xl text-base text-[var(--color-pearl)] sm:text-lg">
          Contract delivery, personal APIs, and coursework labs. Browse covers, stack, and case
          studies for everything shipped and running.
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <dt className="mono-label text-[var(--color-stone)]">Projects</dt>
            <dd className="mt-1 font-condensed text-2xl uppercase tracking-tight text-[var(--color-paper)]">
              {allProjects.length}
            </dd>
          </div>
          <div>
            <dt className="mono-label text-[var(--color-stone)]">Case studies</dt>
            <dd className="mt-1 font-condensed text-2xl uppercase tracking-tight text-[var(--color-paper)]">
              {withCaseStudies}
            </dd>
          </div>
          <div>
            <dt className="mono-label text-[var(--color-stone)]">Featured</dt>
            <dd className="mt-1 font-condensed text-2xl uppercase tracking-tight text-[var(--color-paper)]">
              {featured}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
