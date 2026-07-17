import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServiceBySlug, getServiceSlugs, services } from "@/content/services";
import { profile } from "@/content/profile";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: `${service.title} · Zachary Hutton`,
    description: service.outcome,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div>
      <Navbar variant="standalone" />
      <main className="min-h-screen pt-24">
        <section className="relative overflow-hidden border-b border-[var(--color-slate)] px-6 pb-16 pt-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(21,0,255,0.22), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-[var(--page-max-width)]">
            <Link
              href="/#services"
              className="mono-label inline-flex items-center gap-2 text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
            >
              <ArrowLeft size={14} aria-hidden />
              All services
            </Link>
            <p className="mono-label mt-8 text-[var(--color-electric-indigo)]">{service.number}</p>
            <h1 className="mt-3 font-condensed text-[clamp(2.75rem,8vw,5.5rem)] uppercase leading-[0.88] tracking-tight text-[var(--color-paper)]">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-pearl)]">
              {service.outcome}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${profile.contact.email}`} className="btn-primary min-h-[44px]">
                Start a project
                <ArrowUpRight size={14} aria-hidden />
              </a>
              <Link href="/#contact" className="btn-ghost min-h-[44px]">
                Contact
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-[var(--page-max-width)] gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="font-condensed text-3xl uppercase tracking-tight text-[var(--color-paper)] sm:text-4xl">
                How it lands
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[var(--color-pearl)] sm:text-lg">
                {service.story}
              </p>
              <ul className="mt-8 space-y-4">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 border-l-2 border-[var(--color-electric-indigo)] pl-4 text-[var(--color-pearl)]"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="surface-card h-fit p-6 sm:p-8">
              <p className="mono-label text-[var(--color-ash)]">Also available</p>
              <ul className="mt-5 space-y-3">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-3 text-[var(--color-paper)] transition hover:text-[var(--color-electric-indigo)]"
                    >
                      <span className="text-sm font-medium">{s.navLabel}</span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-40 transition group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/#services"
                className="mono-label mt-8 inline-block text-[var(--color-ash)] underline-offset-4 hover:text-[var(--color-paper)] hover:underline"
              >
                View all eight
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
