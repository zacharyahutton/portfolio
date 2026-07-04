import type { TimelineEntry } from "./types";

export const experience: TimelineEntry[] = [
  {
    id: "weroi",
    title: "Software Developer (Contract)",
    org: "weROI",
    period: "2024 – Present",
    type: "work",
    bullets: [
      "Production web apps with React, Next.js, FastAPI, and MongoDB — REST APIs, JWT auth, Resend email automation, and Vercel/Railway deployment.",
      "Shipped GrowthIQ, a production LLM chat assistant with FAQ fallbacks, conversation routing, and resilient error handling on the weROI platform.",
      "Built webhook endpoints and async Python integrations for lead capture, audit flows, and admin tooling.",
    ],
  },
  {
    id: "freelance",
    title: "Freelance Web Developer",
    org: "Independent",
    period: "2023 – Present",
    type: "work",
    bullets: [
      "Backend integrations, REST APIs, webhooks, and automation for local businesses.",
      "Developed Telegram bots with multi-step conversation flows, LLM chat, SQLite persistence, and Railway deployment.",
      "Responsive React/TypeScript sites with component architecture and SEO.",
    ],
  },
  {
    id: "utech",
    title: "BSc Computer Science",
    org: "University of Technology, Jamaica",
    period: "2024 – 2029 (expected)",
    type: "education",
    bullets: ["GPA 3.7, Dean's List. Data structures, databases, networking, OOP, software engineering."],
  },
];
