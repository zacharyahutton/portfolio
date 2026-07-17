import SectionReveal from "./SectionReveal";
import StatValue from "./ui/StatValue";
import { csecFootnote, profile } from "@/content/profile";

export default function About() {
  return (
    <section id="about" className="page-section border-t border-[var(--color-slate)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="grid gap-16 lg:grid-cols-2">
          <SectionReveal>
            <h2 className="font-condensed text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-[var(--color-paper)]">
              Strong fundamentals,
              <br />
              <span className="text-[var(--color-electric-indigo)]">shipped work.</span>
            </h2>
            <p className="mono-label mt-6 max-w-md normal-case tracking-[0.08em]">
              {profile.headline}
            </p>
          </SectionReveal>

          <div className="space-y-6">
            {profile.about.map((para, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <p className="border-l border-[var(--color-slate)] pl-5 text-base leading-relaxed text-[var(--color-pearl)] transition-colors hover:border-[var(--color-electric-indigo)]">
                  {para}
                </p>
              </SectionReveal>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px border border-[var(--color-slate)] bg-[var(--color-slate)] sm:grid-cols-3 lg:grid-cols-5">
          {profile.stats.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 0.05} className="h-full">
              <div className="group h-full bg-[var(--color-charcoal)] px-5 py-7 transition-colors hover:bg-[var(--color-graphite)]">
                <StatValue
                  value={stat.value}
                  className="font-condensed block text-3xl uppercase leading-none text-[var(--color-paper)] transition-colors group-hover:text-[var(--color-electric-indigo)] sm:text-4xl"
                />
                <div className="mono-label mt-3">{stat.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-[var(--color-stone)]">{csecFootnote}</p>
      </div>
    </section>
  );
}
