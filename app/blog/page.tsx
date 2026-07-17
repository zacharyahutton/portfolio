import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog · Zachary Hutton",
  description:
    "Practical articles from Zachary Hutton on Telegram bots, FastAPI, Next.js, webhooks, JWT, deployment, and building software from Jamaica.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog · Zachary Hutton",
    description:
      "Practical articles on bots, APIs, frontend systems, security habits, and shipping dependable software from Portmore.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <div>
      <Navbar variant="standalone" />
      <main className="min-h-screen pt-24">
        <section className="relative overflow-hidden border-b border-[var(--color-slate)] px-6 pb-14 pt-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(21,0,255,0.2), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-[var(--page-max-width)]">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
            >
              <ArrowLeft size={14} aria-hidden />
              Home
            </Link>
            <h1 className="mt-6 font-condensed text-[clamp(2.75rem,8vw,5.5rem)] uppercase leading-[0.88] tracking-tight text-[var(--color-paper)]">
              Articles &amp; field notes
            </h1>
            <p className="mt-5 max-w-xl text-base text-[var(--color-pearl)] sm:text-lg">
              {blogPosts.length} practical articles on bots, APIs, platforms, security habits, and
              shipping dependable software from Portmore.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 sm:py-16">
          <div className="mx-auto grid max-w-[var(--page-max-width)] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => {
              const className =
                "group surface-card flex h-full flex-col overflow-hidden transition hover:border-[var(--color-electric-indigo)]/50";
              const body = (
                <>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-graphite)]">
                    <Image
                      src={post.image}
                      alt={`Cover artwork for ${post.title}`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)]/75 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-paper)]">
                      {post.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-stone)]">
                        {post.date}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-stone)]">
                        {post.readingTime}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-medium leading-snug text-[var(--color-paper)] transition-colors group-hover:text-[var(--color-electric-indigo)] sm:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-pearl)]">
                      {post.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-ash)] transition group-hover:text-[var(--color-paper)]">
                      Read article
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </div>
                </>
              );

              return (
                <Link key={post.id} href={post.href} className={className}>
                  {body}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
