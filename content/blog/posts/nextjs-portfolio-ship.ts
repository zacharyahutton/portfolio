import { withReadingMeta } from "../types";

export const nextjsPortfolioShipPost = withReadingMeta({
  id: "nextjs-portfolio-ship",
  title: "Next.js Portfolio SEO: How I Built This Site with the App Router and Vercel",
  blurb:
    "How I built Next.js portfolio SEO with App Router static pages, generateMetadata, typed content modules, JSON-LD, and a lean production deploy on Vercel.",
  tag: "Frontend",
  date: "October 2025",
  publishedAt: "2025-10-19",
  href: "/blog/nextjs-portfolio-ship",
  image: "/blog/nextjs-portfolio-ship.png",
  primaryKeyword: "Next.js portfolio SEO",
  intro: [
    "A portfolio site has a simple job: help visitors understand what you build and how you think. That simplicity is deceptive. A portfolio can become a technology playground that is harder to maintain than the work it presents. I chose Next.js because this site benefits from static pages, image optimization, typed React components, and route-level metadata. Every feature had to answer one question: does this help someone understand my work?",
    "This post covers how I structured the site's Next.js portfolio SEO strategy: typed content modules, the App Router's static generation, generateMetadata for per-page search and social previews, performance decisions, and the deployment pipeline on Vercel. If you are building a portfolio with Next.js or trying to improve your Vercel portfolio's search visibility, these are the patterns I use.",
  ],
  sections: [
    {
      heading: "Typed Content Modules: One Source of Truth",
      paragraphs: [
        "Every project, service, and blog post on this site lives in a TypeScript content module under the content/ directory. Each module exports a typed array of objects that describe the content: titles, descriptions, slugs, images, tags, and structured body content. This is the single source of truth for everything that appears on the site.",
        "The benefit of typed content is that TypeScript catches missing or mistyped fields before the site builds. If I add a new blog post and forget the blurb field, the compiler tells me. If I rename a tag value, every reference to the old value lights up as an error. This is much more reliable than catching content bugs in production or during visual review.",
        "Each content object includes a stable slug (the URL path segment). I do not derive slugs from display titles because titles can change while URLs should stay permanent. Stable slugs mean links shared on social media, in messages, or bookmarked by visitors continue to work even when I update a post title.",
      ],
      code: {
        label: "Content module structure",
        language: "typescript",
        code: `// content/blog/types.ts
export type BlogPost = {
  id: string;
  title: string;
  blurb: string;
  tag: string;
  date: string;
  publishedAt: string;
  readingTime: string;
  wordCount: number;
  href: string;
  image: string;
  primaryKeyword: string;
  intro: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
  takeaway: string;
  relatedLink?: { label: string; href: string; external?: boolean };
};

// Each post is exported from its own file
export const telegramFastapiPost = withReadingMeta({
  id: "telegram-fastapi",
  title: "How I Built a FastAPI Telegram Bot Webhook...",
  // ... all fields typed and validated at compile time
});`,
      },
    },
    {
      heading: "Static Generation with the Next.js App Router",
      paragraphs: [
        "Most pages on this portfolio do not need request-time data. The content is known at build time, and it only changes when I update the code. This makes static generation the natural fit. Server Components render the content during the build, generateStaticParams declares all known routes, and the output is static HTML and JSON that Vercel serves from its edge network.",
        "For the blog, generateStaticParams returns the slug for every post in the content collection. At build time, Next.js generates a static page for each slug. The result is fast page loads, zero runtime server costs, and pages that are immediately crawlable by search engines because the content is in the HTML, not loaded by client-side JavaScript.",
        "I use Server Components for all content pages. Client components are reserved for interactive features: the theme toggle, the mobile navigation menu, scroll animations, and the contact form. This keeps the JavaScript bundle small because most pages send zero or minimal client-side JavaScript to the browser.",
      ],
      bullets: [
        "generateStaticParams produces all blog and project routes at build time.",
        "Server Components render content as HTML, making it immediately crawlable.",
        "Client components are used only for interactivity, keeping JS bundles minimal.",
        "Static pages on Vercel's edge network load faster than server-rendered pages.",
      ],
    },
    {
      heading: "generateMetadata for Next.js Portfolio SEO",
      paragraphs: [
        "Every page on this site has its own metadata: a unique title, description, Open Graph image, Twitter card, and canonical URL. This is critical for Next.js portfolio SEO because search engines and social platforms use this metadata to decide how to display your page in results and previews.",
        "The App Router's generateMetadata function makes this straightforward. For a blog post page, the function receives the slug parameter, looks up the post in the content collection, and returns a metadata object with the title, description (the post's blurb), Open Graph image, published time, and canonical URL. Each page gets unique metadata without manual HTML manipulation.",
        "I also added JSON-LD structured data (BlogPosting schema) to article pages. This gives search engines additional context about the content: author, date published, word count, and description. Structured data does not guarantee rich results, but it makes your content eligible for enhanced search features like article cards and breadcrumb display.",
      ],
      code: {
        label: "generateMetadata for blog posts",
        language: "typescript",
        code: `// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/content/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.blurb,
    alternates: { canonical: \`https://zachary-hutton-portfolio.vercel.app/blog/\${slug}\` },
    openGraph: {
      title: post.title,
      description: post.blurb,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.blurb,
    },
  };
}`,
      },
    },
    {
      heading: "Performance: What I Kept and What I Cut",
      paragraphs: [
        "A portfolio should load fast. Visitors will judge your technical ability by the performance of your own site. I started with a minimal approach and added complexity only where it improved the experience.",
        "Images use the Next.js Image component for automatic optimization: responsive sizes, modern formats (WebP/AVIF), and lazy loading below the fold. Hero images load with priority. Blog cover images use a consistent aspect ratio so the layout does not shift as they load.",
        "I use a small set of animations (GSAP ScrollTrigger for scroll reveals, Framer Motion for page transitions and interactive components). All animations respect the prefers-reduced-motion media query. If a visitor has reduced motion enabled, animations are either disabled or simplified. Motion should enhance the content hierarchy, not compete with it.",
        "I removed several experimental features during development because they added complexity without improving the story. Every client component is justified by a specific interactive need. Semantic HTML provides the structure before any JavaScript enhancement. The design system carries the visual identity through typography, contrast, and a small set of tokens that work in both light and dark modes.",
      ],
      bullets: [
        "Measure the cost of every client component. If it does not need interactivity, keep it as a Server Component.",
        "Use the Image component for all significant images. Never load unoptimized full-resolution photos.",
        "Test the site with JavaScript disabled. Core content should still be visible and navigable.",
        "Keep the font stack lean. One display font and one body font are enough for most portfolios.",
      ],
    },
    {
      heading: "Sitemap and Search Indexing",
      paragraphs: [
        "A sitemap tells search engines which pages exist and when they were last updated. Next.js can generate a sitemap from your route structure. I generate entries for all static pages (home, about, projects, blog, services) and all dynamic pages (each blog post, each project page, each service page).",
        "The sitemap includes the canonical URL, last modified date, and change frequency for each page. Blog posts use their publishedAt date. Project pages use a reasonable estimate. The sitemap is submitted to Google Search Console, which speeds up initial indexing.",
        "Beyond the sitemap, good indexing comes from good content. Each page has a unique title and description. Internal links connect related content (blog posts link to project case studies, project pages link to related blog posts). Headings use a logical hierarchy. These fundamentals matter more than any technical SEO trick.",
      ],
    },
    {
      heading: "Deploying a Next.js Portfolio on Vercel",
      paragraphs: [
        "Vercel is the natural deployment target for Next.js. Push to the main branch, Vercel builds the site, and the static output is distributed to edge nodes globally. Preview deployments are created for every branch, which makes it easy to review changes before they go live.",
        "The deployment pipeline is simple: push triggers build, build runs TypeScript compilation and Next.js static generation, and the output is deployed. If the build fails (a type error in a content module, a missing import, a component error), the deployment does not proceed. This is a safety net that catches content and code errors before they reach production.",
        "Environment variables on Vercel are minimal for a portfolio: the site URL for canonical links and Open Graph images. There are no API keys, database credentials, or secrets. The site is entirely static, which means there is nothing to exploit at runtime. This simplicity is a feature.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is Next.js good for a developer portfolio?",
      answer:
        "Yes. Next.js gives you static generation for fast page loads, built-in image optimization, the App Router for clean metadata, and React components for interactive features. For a portfolio, most content is static and benefits from being pre-rendered. TypeScript support catches content errors at build time. Vercel deployment is seamless. The main alternative is Astro, which is also excellent for content-heavy static sites.",
    },
    {
      question: "How do you improve SEO on a Next.js portfolio?",
      answer:
        "Use generateMetadata to give every page a unique title, description, and Open Graph image. Add structured data (JSON-LD) for article pages. Generate a sitemap from your route structure. Use semantic HTML with a logical heading hierarchy. Keep content in Server Components so it is in the HTML when search engines crawl. Internal links between related content help search engines understand your site structure.",
    },
    {
      question: "Should a portfolio use the Next.js App Router or Pages Router?",
      answer:
        "The App Router is the current recommended approach. It supports Server Components (smaller JS bundles), generateMetadata (clean per-page SEO), and generateStaticParams (static route generation). The Pages Router still works, but new features and documentation focus on the App Router. For a new portfolio, start with the App Router.",
    },
    {
      question: "How many pages should a developer portfolio have?",
      answer:
        "Enough to showcase your work without diluting the signal. At minimum: a homepage, an about section, a projects archive with individual project pages, and a contact method. Blog posts and service pages add depth and improve SEO by creating more indexable content. Each page should have a clear purpose. If you cannot describe what a page helps a visitor understand, you probably do not need it.",
    },
  ],
  takeaway:
    "The best portfolio stack is the one that makes publishing easy and keeps the work legible. Next.js helps here because static content, metadata, and reusable presentation can live in one typed system. Focus on unique metadata per page, fast load times, and content that genuinely represents your work.",
  relatedLink: {
    label: "Browse the project archive",
    href: "/projects",
  },
});
