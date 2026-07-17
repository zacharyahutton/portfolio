"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionReveal from "./SectionReveal";
import MagneticButton from "./fx/MagneticButton";
import { useResume } from "@/components/ResumeProvider";
import DecryptedText from "./fx/DecryptedText";
import ServicesAmbient from "./fx/ServicesAmbient";
import { services } from "@/content/services";
import { profile } from "@/content/profile";

export default function Services() {
  const { openResume } = useResume();

  return (
    <section id="services" className="page-section relative overflow-hidden border-t border-[var(--color-slate)] px-6">
      <ServicesAmbient scrollTarget="#services" />
      <div className="relative z-10 mx-auto max-w-[var(--page-max-width)]">
        <SectionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-condensed text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-[var(--color-paper)]">
              <DecryptedText
                text="What I build for you"
                animateOn="view"
                sequential
                speed={35}
                encryptedClassName="text-[var(--color-electric-indigo)]/60"
              />
            </h2>
            <p className="mt-5 text-base text-[var(--color-pearl)]">
              Eight ways I show up: platforms that convert, APIs that hold, bots that answer at 2 a.m., and
              security habits that stick. Pick a lane, or hire the whole stack.
            </p>
          </div>
        </SectionReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {services.map((service, i) => (
            <SectionReveal key={service.id} delay={(i % 4) * 0.06}>
              <Link
                href={`/services/${service.slug}`}
                id={`service-${service.id}`}
                className="group surface-card relative block h-full scroll-mt-28 overflow-hidden p-6 transition hover:border-[var(--color-electric-indigo)]/50 sm:p-8"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 text-[5rem] font-semibold leading-none text-[var(--color-slate)] transition group-hover:text-[var(--color-electric-indigo)]/25"
                  aria-hidden
                >
                  {service.number}
                </div>
                <p className="section-kicker relative z-10">{service.number}</p>
                <h3 className="relative z-10 mt-3 font-display text-xl font-semibold text-[var(--color-paper)] sm:text-2xl">
                  <DecryptedText
                    text={service.title}
                    animateOn="view"
                    sequential
                    speed={22}
                    encryptedClassName="text-[var(--color-ash)]"
                  />
                </h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-[var(--color-pearl)]">
                  {service.outcome}
                </p>
                <ul className="relative z-10 mt-5 space-y-2">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm text-[var(--color-ash)] before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-[var(--color-electric-indigo)] before:content-['']"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                <span className="relative z-10 mt-6 inline-flex items-center gap-1 text-sm text-[var(--color-ash)] transition group-hover:text-[var(--color-paper)]">
                  Open service
                  <ArrowUpRight size={14} aria-hidden />
                </span>
              </Link>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <a href={`mailto:${profile.contact.email}`} className="btn-primary min-h-[44px]">
                Email me
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost min-h-[44px]"
              >
                LinkedIn
              </a>
            </MagneticButton>
            <MagneticButton>
              <button type="button" onClick={openResume} className="btn-ghost min-h-[44px]">
                View resume
              </button>
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
