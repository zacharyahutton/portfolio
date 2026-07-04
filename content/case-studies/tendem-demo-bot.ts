import type { CaseStudy } from "../types";

export const tendemDemoBotCaseStudy: CaseStudy = {
  overview:
    "Live Telegram bot with multi-step booking and support flows, 30+ FAQ topics, LLM chat, SQLite persistence, rate limiting, and a FastAPI webhook server deployed on Railway.",
  problem:
    "Businesses need messaging bots that combine structured workflows with AI—not slide decks. I built a **live Telegram demo** showing webhooks, conversational state, LLM routing, graceful fallbacks, and deployment patterns that extend to other chat platforms.",
  solution:
    "The bot implements **Telegram Bot API** handlers for booking, support tickets, FAQ, and AI chat modes. A **FastAPI** webhook server validates secret tokens, persists user state in **SQLite**, routes **Groq/OpenAI** calls with per-user memory, and degrades to keyword FAQ when models fail. Admin commands expose stats and health for ops visibility.",
  architecture: [
    {
      title: "Conversation Layer",
      items: [
        "Multi-step appointment booking with date/time validation and confirmation",
        "Support ticket creation with priority selection and structured intake",
        "FAQ mode with 30+ curated answers across eight categories",
        "Mode switching between menu, AI chat, FAQ, and utility commands",
      ],
    },
    {
      title: "Backend & State",
      items: [
        "SQLite persistence for users, bookings, tickets, and analytics events",
        "Per-user rate limiting to prevent abuse of LLM endpoints",
        "Async Python handlers with python-telegram-bot and aiosqlite",
        "Structured logging hooks for delivery debugging",
      ],
    },
    {
      title: "Deployment",
      items: [
        "FastAPI webhook server (run_webhook.py) on Railway with public /health endpoint",
        "Secret-token validation on incoming Telegram updates",
        "Polling mode for local development without tunnel setup",
        "Environment-based configuration for Groq, OpenAI, and bot tokens",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "Webhook-first with polling fallback",
      description:
        "Production bots run on **webhooks** for low latency and predictable scaling. I ship both modes so developers can test locally while the live demo stays 24/7 on Railway.",
    },
    {
      title: "FAQ fallbacks before and after LLM calls",
      description:
        "Users should never hit a dead end. Keyword-matched FAQ answers handle common questions instantly; when the model fails or times out, the bot routes back to curated responses instead of silent errors.",
    },
    {
      title: "SQLite for demo-grade persistence",
      description:
        "For a portfolio bot, **SQLite** keeps deployment simple on Railway while still demonstrating real state â€” bookings, tickets, and conversation memory survive restarts.",
    },
  ],
  screenshots: [
    {
      src: "/case-studies/tendem-demo-bot-cover.png",
      alt: "Telegram demo bot profile and branding",
    },
  ],
};
