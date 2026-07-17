"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import SectionReveal from "./SectionReveal";
import TextType from "./ui/TextType";
import FloatingIconField from "./fx/FloatingIconField";
import MagneticButton from "./fx/MagneticButton";
import TiltPhoto from "./fx/TiltPhoto";
import { useResume } from "@/components/ResumeProvider";
import { resumeLinks } from "@/content/resumeLinks";
import { profile } from "@/content/profile";

const roles = [
  "Full Stack Engineer",
  "Web Developer",
  "Web Designer",
  "Builder",
];

const socialLinkClass =
  "inline-flex items-center gap-1 text-sm text-[var(--color-stone)] transition-colors hover:text-[var(--color-paper)]";

export default function Hero() {
  const { openResume } = useResume();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-16 pt-24"
    >
      <div className="pointer-events-none absolute inset-0 hero-atmosphere" aria-hidden />
      <FloatingIconField className="z-[1] opacity-40 md:opacity-50" />

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <div className="relative mx-auto grid w-full max-w-[var(--page-max-width)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <SectionReveal>
              <p className="section-kicker mb-3 tracking-[0.28em] text-[var(--color-electric-indigo)]">
                Hello
              </p>
              <p className="text-lg font-medium text-[var(--color-pearl)] sm:text-xl">i&apos;m</p>
              <h1 className="mt-1 font-condensed text-[clamp(3.25rem,9vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.01em] text-[var(--color-paper)]">
                Zachary
                <br />
                <span className="monument monument-fade">Hutton</span>
              </h1>
              <p className="mt-4 text-base text-[var(--color-pearl)] sm:text-lg">a</p>
              <div className="mt-1 min-h-[3.25rem] text-[clamp(1.85rem,4.5vw,2.85rem)] font-semibold leading-tight text-[var(--color-electric-indigo)] lg:min-h-[3.5rem]">
                <TextType
                  text={roles}
                  typingSpeed={48}
                  deletingSpeed={28}
                  pauseDuration={2200}
                  showCursor
                  cursorCharacter="|"
                  cursorClassName="text-[var(--color-electric-indigo)]"
                  className="font-display font-semibold"
                />
              </div>
            </SectionReveal>

            <SectionReveal delay={0.14}>
              <p className="mx-auto mt-6 max-w-md text-base leading-[1.55] text-[var(--color-pearl)] lg:mx-0 lg:text-lg">
                {profile.oneLiner}
              </p>
            </SectionReveal>

            <SectionReveal delay={0.24}>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <MagneticButton>
                  <a href="#preview" className="btn-primary min-h-[44px]">
                    View my work
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a href="#contact" className="btn-ghost min-h-[44px]">
                    Hire me
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <button type="button" onClick={openResume} className="btn-ghost min-h-[44px]">
                    Resume
                  </button>
                </MagneticButton>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.32}>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                >
                  GitHub
                  <ArrowUpRight size={14} aria-hidden />
                </a>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                >
                  LinkedIn
                  <ArrowUpRight size={14} aria-hidden />
                </a>
                <a
                  href={profile.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                >
                  Instagram
                  <ArrowUpRight size={14} aria-hidden />
                </a>
                <a
                  href={resumeLinks.pdf}
                  download="Zach_Hutton_Resume.pdf"
                  className={socialLinkClass}
                >
                  Resume PDF
                  <ArrowDown size={14} aria-hidden />
                </a>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.16} className="relative w-full">
            <TiltPhoto />
          </SectionReveal>
        </div>
      </div>

      <a
        href="#skills"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs text-[var(--color-stone)] transition hover:text-[var(--color-pearl)]"
        aria-label="Scroll to skills"
      >
        scroll ↓
      </a>
    </section>
  );
}
