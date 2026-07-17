"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectCoverImage from "@/components/ui/ProjectCoverImage";
import SectionReveal from "./SectionReveal";
import { cn } from "@/lib/utils";

type WorkItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  image?: string;
  imageFit?: "cover" | "contain";
  href: string;
  external?: boolean;
  live?: string;
  size: "large" | "small";
};

const workItems: WorkItem[] = [
  {
    id: "weroi",
    title: "weROI Agency Platform",
    category: "Full stack platform",
    year: "2024 to 25",
    description:
      "React SPA + FastAPI + MongoDB Atlas. Lead funnels, JWT admin dashboard, Resend automation, split Vercel/Railway deploys.",
    stack: ["React", "FastAPI", "MongoDB"],
    image: "/case-studies/weroi.png",
    href: "/projects/weroi",
    live: "https://weroi.net",
    size: "large",
  },
  {
    id: "pntcog",
    title: "PNTCOG Ministry Platform",
    category: "Client delivery",
    year: "2025",
    description:
      "Multi-section ministry site: events, giving, prayer requests, media, Jubilee hub. Live for a real congregation.",
    stack: ["React", "React Router", "Vercel"],
    image: "/case-studies/pntcog.png",
    imageFit: "contain",
    href: "/projects/pntcog",
    live: "https://portmorentcog.org",
    size: "large",
  },
  {
    id: "tendem",
    title: "Tendem Demo Bot",
    category: "Bots & automation",
    year: "2025",
    description:
      "Live Telegram bot: multi step booking, support tickets, LLM chat with FAQ fallbacks, webhooks on Railway.",
    stack: ["Python", "FastAPI", "Telegram"],
    image: "/case-studies/tendem-demo-bot-cover.png",
    href: "/projects/tendem-demo-bot",
    size: "small",
  },
  {
    id: "titan",
    title: "Titan Phone Store",
    category: "E-commerce API",
    year: "2025",
    description:
      "Phone retail backend: JWT auth with refresh tokens, atomic inventory reservation, HMAC order webhooks.",
    stack: ["TypeScript", "Express", "MongoDB"],
    image: "/case-studies/phone-store-cover.png",
    href: "/projects/phone-store-api",
    size: "small",
  },
  {
    id: "webhook-relay",
    title: "Webhook Relay API",
    category: "Developer tooling",
    year: "2025",
    description:
      "Webhook sandbox with API keys, HMAC signing, exponential backoff retries, and token-bucket rate limiting.",
    stack: ["Python", "FastAPI", "Redis"],
    image: "/case-studies/webhook-relay-cover.png",
    href: "/projects/webhook-relay-api",
    size: "small",
  },
];

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <SectionReveal delay={index * 0.06} className="h-full">
      <Link
        href={item.href}
        className="group flex h-full flex-col border border-[var(--color-slate)] bg-[var(--color-charcoal)] transition-colors hover:border-[var(--color-electric-indigo)]/60"
      >
        {/* Preview */}
        <div
          className={cn(
            "relative w-full overflow-hidden",
            item.size === "large" ? "aspect-[16/9]" : "aspect-[16/10]",
            item.imageFit === "contain" ? "bg-black" : "bg-[var(--color-graphite)]",
          )}
        >
          {item.image ? (
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]">
              <ProjectCoverImage
                src={item.image}
                alt={item.title}
                className={cn(
                  item.imageFit === "contain" ? "object-contain p-6" : "object-cover object-top",
                )}
                sizes={item.size === "large" ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"}
                priority={index === 0}
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[var(--color-graphite)]" />
          )}
          {/* hover veil + view label */}
          <div className="pointer-events-none absolute inset-0 bg-[var(--color-obsidian)]/0 transition-colors duration-300 group-hover:bg-[var(--color-obsidian)]/35" />
          <span className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[var(--color-electric-indigo)] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="mono-label">{item.category}</span>
            <span className="mono-label text-[var(--color-stone)]">{item.year}</span>
          </div>
          <h3 className="text-lg font-medium leading-snug text-[var(--color-paper)] transition-colors group-hover:text-[var(--color-electric-indigo)] sm:text-xl">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-pearl)]">{item.description}</p>
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2">
            {item.stack.map((tag) => (
              <span key={tag} className="mono-label text-[var(--color-stone)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}

export default function Spotlight() {
  const large = workItems.filter((w) => w.size === "large");
  const small = workItems.filter((w) => w.size === "small");

  return (
    <section id="highlights" className="page-section px-6">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SectionReveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-condensed text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-[var(--color-paper)]">
                Selected work
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[var(--color-pearl)] sm:text-right">
              Production platforms, client sites, bots, and APIs, each with a full case study.
            </p>
          </div>
        </SectionReveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {large.map((item, i) => (
            <WorkCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {small.map((item, i) => (
            <WorkCard key={item.id} item={item} index={i + 2} />
          ))}
        </div>

        <SectionReveal delay={0.15}>
          <div className="mt-12 text-center">
            <Link href="/projects" className="btn-primary inline-flex min-h-[44px] gap-2">
              View all projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
