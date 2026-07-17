import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionReveal from "./SectionReveal";
import MagneticButton from "./fx/MagneticButton";
import { getHomepagePosts } from "@/content/blog";

export default function Blog() {
  const posts = getHomepagePosts();

  return (
    <section
      id="blog"
      className="relative border-t border-[var(--color-slate)] bg-[var(--color-charcoal)] px-6 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SectionReveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-condensed text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-[var(--color-paper)]">
                Articles &amp; field notes
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[var(--color-pearl)] sm:text-right">
              Practical lessons from shipping bots, agency platforms, and security labs, explained
              from the decisions through the fixes.
            </p>
          </div>
        </SectionReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const card = (
              <>
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-graphite)]">
                  <Image
                    src={post.image}
                    alt={`Cover artwork for ${post.title}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)]/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-paper)]">
                    {post.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-stone)]">
                      {post.date}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-stone)]">
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-medium leading-snug text-[var(--color-paper)] transition-colors group-hover:text-[var(--color-electric-indigo)] sm:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-pearl)]">
                    {post.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-ash)] transition group-hover:text-[var(--color-paper)]">
                    Read article
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </>
            );

            const className =
              "group surface-card flex h-full flex-col overflow-hidden transition hover:border-[var(--color-electric-indigo)]/50";

            return (
              <SectionReveal key={post.id} delay={i * 0.05}>
                <Link href={post.href} className={className}>
                  {card}
                </Link>
              </SectionReveal>
            );
          })}
        </div>

        <SectionReveal delay={0.15}>
          <div className="mt-12 flex justify-center">
            <MagneticButton>
              <Link href="/blog" className="btn-primary min-h-[44px] gap-1.5">
                View all blogs
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
