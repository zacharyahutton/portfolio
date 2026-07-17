import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/content/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = "https://zachary-hutton-portfolio.vercel.app";

function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found · Zachary Hutton",
    };
  }

  return {
    title: `${post.title} · Zachary Hutton`,
    description: post.blurb,
    alternates: {
      canonical: post.href,
    },
    authors: [{ name: "Zachary Hutton", url: siteUrl }],
    openGraph: {
      title: post.title,
      description: post.blurb,
      type: "article",
      url: post.href,
      publishedTime: post.publishedAt,
      authors: ["Zachary Hutton"],
      images: [
        {
          url: post.image,
          alt: `Cover artwork for ${post.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.blurb,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.blurb,
    image: `${siteUrl}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    wordCount: post.wordCount,
    mainEntityOfPage: `${siteUrl}${post.href}`,
    author: {
      "@type": "Person",
      name: "Zachary Hutton",
      url: siteUrl,
      homeLocation: {
        "@type": "Place",
        name: "Portmore, Jamaica",
      },
    },
    publisher: {
      "@type": "Person",
      name: "Zachary Hutton",
      url: siteUrl,
    },
  };

  const faqStructuredData =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const tocHeadings = [
    ...post.sections.map((section) => section.heading),
    ...(post.faqs.length > 0 ? ["Frequently asked questions"] : []),
  ];

  return (
    <div>
      <Navbar variant="standalone" />
      <main className="min-h-screen pb-24 pt-24">
        <article>
          <header className="relative overflow-hidden border-b border-[var(--color-slate)] px-6 pb-10 pt-10 sm:pb-14">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 80% 0%, rgba(21,0,255,0.2), transparent 62%)",
              }}
              aria-hidden
            />
            <div className="relative z-10 mx-auto max-w-[var(--page-max-width)]">
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
              >
                <ArrowLeft size={14} aria-hidden />
                All articles
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-label text-[11px] uppercase tracking-[0.12em] text-[var(--color-ash)]">
                <span className="text-[var(--color-electric-indigo)]">{post.tag}</span>
                <time dateTime={post.publishedAt}>{post.date}</time>
                <span>{post.readingTime} read</span>
                <span>{post.wordCount.toLocaleString()} words</span>
              </div>

              <h1 className="mt-5 max-w-5xl font-condensed text-[clamp(3rem,8vw,6.7rem)] uppercase leading-[0.88] tracking-tight text-[var(--color-paper)]">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-pearl)] sm:text-xl">
                {post.blurb}
              </p>
              <p className="mt-6 text-sm text-[var(--color-ash)]">
                Written by Zachary Hutton in Portmore, Jamaica
              </p>

              <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-[var(--color-slate)] bg-[var(--color-graphite)] sm:mt-12">
                <Image
                  src={post.image}
                  alt={`Cover artwork for ${post.title}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1120px"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)]/35 to-transparent"
                  aria-hidden
                />
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[var(--page-max-width)] gap-12 px-6 py-14 lg:grid-cols-[220px_minmax(0,720px)] lg:justify-center lg:gap-20 lg:py-20">
            <nav aria-label="Article contents" className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono-label text-[11px] uppercase tracking-[0.12em] text-[var(--color-stone)]">
                In this article
              </p>
              <ol className="mt-4 space-y-3 border-l border-[var(--color-slate)] pl-4">
                {tocHeadings.map((heading, index) => (
                  <li key={heading}>
                    <a
                      href={`#${headingId(heading)}`}
                      className="group flex gap-3 text-sm leading-snug text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
                    >
                      <span className="font-mono-label text-[10px] text-[var(--color-stone)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="min-w-0">
              <div className="space-y-5 text-[1.05rem] leading-[1.85] text-[var(--color-pearl)] sm:text-lg">
                {post.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-14 space-y-16">
                {post.sections.map((section, index) => (
                  <section
                    key={section.heading}
                    id={headingId(section.heading)}
                    className="scroll-mt-28 border-t border-[var(--color-slate)] pt-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="pt-1 font-mono-label text-[11px] text-[var(--color-electric-indigo)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-2xl font-semibold leading-tight text-[var(--color-paper)] sm:text-3xl">
                        {section.heading}
                      </h2>
                    </div>
                    <div className="mt-6 space-y-5 text-base leading-[1.85] text-[var(--color-pearl)] sm:text-lg">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.bullets && (
                        <ul className="space-y-3 pl-1">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3">
                              <span
                                className="mt-[0.78em] h-1.5 w-1.5 shrink-0 bg-[var(--color-electric-indigo)]"
                                aria-hidden
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.code && (
                        <figure className="overflow-hidden border border-[var(--color-slate)] bg-[var(--color-graphite)]">
                          {section.code.label && (
                            <figcaption className="border-b border-[var(--color-slate)] px-4 py-2 font-mono-label text-[10px] uppercase tracking-[0.12em] text-[var(--color-ash)]">
                              {section.code.label}
                            </figcaption>
                          )}
                          <pre className="overflow-x-auto p-4 text-[0.85rem] leading-relaxed text-[var(--color-pearl)]">
                            <code>{section.code.code}</code>
                          </pre>
                        </figure>
                      )}
                      {section.subheadings?.map((sub) => (
                        <div key={sub.heading} className="space-y-4 pt-2">
                          <h3 className="font-display text-xl font-semibold text-[var(--color-paper)] sm:text-2xl">
                            {sub.heading}
                          </h3>
                          {sub.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                          {sub.bullets && (
                            <ul className="space-y-3 pl-1">
                              {sub.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-3">
                                  <span
                                    className="mt-[0.78em] h-1.5 w-1.5 shrink-0 bg-[var(--color-electric-indigo)]"
                                    aria-hidden
                                  />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {sub.code && (
                            <figure className="overflow-hidden border border-[var(--color-slate)] bg-[var(--color-graphite)]">
                              {sub.code.label && (
                                <figcaption className="border-b border-[var(--color-slate)] px-4 py-2 font-mono-label text-[10px] uppercase tracking-[0.12em] text-[var(--color-ash)]">
                                  {sub.code.label}
                                </figcaption>
                              )}
                              <pre className="overflow-x-auto p-4 text-[0.85rem] leading-relaxed text-[var(--color-pearl)]">
                                <code>{sub.code.code}</code>
                              </pre>
                            </figure>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {post.faqs.length > 0 && (
                <section
                  id={headingId("Frequently asked questions")}
                  className="mt-16 scroll-mt-28 border-t border-[var(--color-slate)] pt-8"
                >
                  <h2 className="font-display text-2xl font-semibold leading-tight text-[var(--color-paper)] sm:text-3xl">
                    Frequently asked questions
                  </h2>
                  <div className="mt-8 space-y-8">
                    {post.faqs.map((faq) => (
                      <div key={faq.question}>
                        <h3 className="font-display text-lg font-semibold text-[var(--color-paper)] sm:text-xl">
                          {faq.question}
                        </h3>
                        <p className="mt-3 text-base leading-[1.85] text-[var(--color-pearl)] sm:text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-16 border-y border-[var(--color-slate)] py-9">
                <p className="font-mono-label text-[11px] uppercase tracking-[0.12em] text-[var(--color-electric-indigo)]">
                  Closing takeaway
                </p>
                <p className="mt-4 font-display text-xl font-medium leading-relaxed text-[var(--color-paper)] sm:text-2xl">
                  {post.takeaway}
                </p>
              </section>

              {post.relatedLink && (
                <div className="mt-10">
                  {post.relatedLink.external ? (
                    <a
                      href={post.relatedLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--color-paper)] transition hover:text-[var(--color-electric-indigo)]"
                    >
                      {post.relatedLink.label}
                      <ArrowUpRight size={16} aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href={post.relatedLink.href}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--color-paper)] transition hover:text-[var(--color-electric-indigo)]"
                    >
                      {post.relatedLink.label}
                      <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </div>
  );
}
