import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services · Zachary Hutton",
  description:
    "Web platforms, APIs, Telegram bots, e-commerce backends, and security-aware engineering from Jamaica.",
};

export default function ServicesIndexPage() {
  return (
    <div>
      <Navbar variant="standalone" />
      <main className="min-h-screen px-6 pb-20 pt-28">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <h1 className="font-condensed text-[clamp(2.75rem,8vw,5rem)] uppercase leading-[0.88] tracking-tight text-[var(--color-paper)]">
            Services
          </h1>
          <p className="mt-5 max-w-xl text-base text-[var(--color-pearl)]">
            Outcome-first capabilities for businesses, ministries, and product teams, plus internship-ready
            engineering on collaborative squads.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group surface-card flex flex-col p-6 transition hover:border-[var(--color-electric-indigo)]/50 sm:p-8"
              >
                <span className="mono-label text-[var(--color-electric-indigo)]">{service.number}</span>
                <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-paper)] group-hover:text-[var(--color-electric-indigo)] sm:text-2xl">
                  {service.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-pearl)]">
                  {service.outcome}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-[var(--color-ash)] transition group-hover:text-[var(--color-paper)]">
                  View service
                  <ArrowUpRight size={14} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
