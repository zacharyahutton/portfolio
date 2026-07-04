# Mindrift / Tendem — Freelance Chatbot Developer (AI Pilot)

**Role:** Bot Developer (WhatsApp / Telegram / Discord) — Tendem project  
**Apply with:** This cover letter + resume + **live Telegram bot demo**

---

## Cover letter (full — attach as PDF)

```
July 3, 2026

Mindrift Hiring Team
Tendem Project — AI Pilot (Bot Developer)
Remote | Part-time

Dear Mindrift Hiring Team,

I am applying for the Freelance Chatbot Developer (AI Pilot) role on the Tendem project. I build messaging bots and integration backends in Python: webhooks, conversational state, LLM routing, fallbacks, and production hardening. I am based in Jamaica, work remotely, and I am genuinely excited about Mindrift's hybrid model where human specialists refine AI-generated bot code into experiences real users can trust.

I did not apply with slides. I applied with a bot.

Tendem Demo Bot is a Telegram bot I built specifically for this application. It is open source in my repository under telegram-bot-demo/ and demonstrates the exact patterns your posting describes:

• Multi-platform-ready architecture: Telegram Bot API today, with webhook delivery, secret-token validation, and conversation patterns that map to WhatsApp Cloud API and Discord bots
• Conversational flows: multi-step appointment booking, support ticket creation with priority, FAQ with 30+ curated answers across eight categories, and mode switching (menu / AI / FAQ / tools)
• LLM integration: Groq and OpenAI via async Python, per-user conversation memory in SQLite, graceful degradation when the model fails, and FAQ keyword fallbacks so users never hit a dead end
• Backend integration mindset: persistent state (users, bookings, tickets, analytics events), per-user rate limiting, admin /stats and /health commands, structured logging hooks
• Production deployment path: FastAPI webhook server (run_webhook.py) for Railway/Render/VPS, plus polling mode for local development

This sits on top of work I have already shipped:

weROI (weroi.net) — Production FastAPI backend with MongoDB, background jobs, Resend email automation, and GrowthIQ, an LLM-powered chat assistant with quick-reply routing, token limits, and local FAQ fallbacks before calling the model.

Webhook Relay API — FastAPI sandbox for outbound webhooks with API-key auth, HMAC-SHA256 signing, exponential backoff retries, and per-key rate limiting. This is the same infrastructure thinking required when bots emit events to CRMs, payment systems, or internal queues.

Phone Store API — MongoDB commerce API with signed order webhooks and async checkout flows.

I am strongest in Python (FastAPI, Pydantic, async I/O), REST APIs, webhooks, and LLM conversational design. I read AI-generated code critically, refactor for edge cases, and ship integrations that fail loudly instead of silently. That is the AI Pilot workflow: collaborate with agents, own quality, deliver bots users can rely on.

I am transparent: my deepest live bot is on Telegram. I have not yet shipped a production WhatsApp Business API deployment for a paying client, but I understand template approval flows, interactive messages, webhook verification, and platform rate limits, and I learn SDKs by building against real endpoints, which is what Tendem Demo Bot represents.

Why Mindrift and Tendem fit me:

• Part-time remote (10–20 hrs/week) matches how I already work on contract projects
• Jamaica-based, fluent English, self-directed, detail-oriented
• I want to grow in messaging + AI at the exact intersection your posting describes
• Performance-based work rewards the quality bar I already hold on client delivery

Live demo: https://t.me/zachtedem_bot
Source: github.com/zacharyahutton/telegram-bot-demo
Health: https://telegram-bot-demo-production-51ba.up.railway.app/health
Portfolio: https://zachary-hutton-portfolio.vercel.app/
GitHub: https://github.com/zacharyahutton

I would welcome a 20-minute technical conversation or a small paid trial task. I can walk through the bot's conversation handlers, webhook server, and how I would extend the same patterns to WhatsApp and Discord on Tendem.

Thank you for your consideration.

Best regards,

Zachary Hutton
Portmore, Jamaica
hzach577@gmail.com | (876) 781-0400
LinkedIn: https://www.linkedin.com/in/zacharyahutton-a2ab81415/
```

---

## Application pitch (short — LinkedIn / Mindrift text box)

```
I built Tendem Demo Bot (Telegram): multi-step booking + support tickets, 30+ FAQ 
topics, LLM chat with SQLite memory, rate limits, admin stats, FastAPI webhooks. 
Plus production webhook infra (Webhook Relay API) and LLM chat on weROI. 
Python/FastAPI specialist, Jamaica, remote, 10–20 hrs/week. 
Demo: t.me/zachtedem_bot — Repo: github.com/zacharyahutton/telegram-bot-demo
Health: telegram-bot-demo-production-51ba.up.railway.app/health
```

---

## Portfolio link line (paste in "examples of bots")

```
Telegram — Tendem Demo Bot (portfolio build for Mindrift/Tendem)
• Multi-step flows: booking, support tickets, FAQ (30+ answers), AI chat
• Python, python-telegram-bot, FastAPI webhooks, SQLite, Groq/OpenAI
• Live: t.me/zachtedem_bot
• Health: telegram-bot-demo-production-51ba.up.railway.app/health
• Code: github.com/zacharyahutton/telegram-bot-demo
```

---

## Before you apply (15 minutes)

1. Message [@BotFather](https://t.me/BotFather) → `/newbot` → name it e.g. `Tendem Demo by Zachary`
2. Copy token into `telegram-bot-demo/.env`
3. `pip install -r requirements.txt` && `python run_polling.py`
4. Test `/start`, `/book`, `/support`, `/ai`, `/faq`
5. Export cover letter to PDF (`npm run generate:cover-letter-pdf`) and apply on LinkedIn

**Bot is live:** [t.me/zachtedem_bot](https://t.me/zachtedem_bot) · [health check](https://telegram-bot-demo-production-51ba.up.railway.app/health)

---

## Honest experience framing (if asked)

| Requirement | Your answer |
|-------------|-------------|
| 3 years backend/integration | ~3 years freelance/contract (2023–present) + CS degree in progress |
| 1 year messaging bots | Telegram bot (this demo) + LLM web chat (weROI GrowthIQ) + webhook infrastructure |
| Portfolio required | Live Telegram bot + GitHub + portfolio case study |
| LLM APIs | Groq/OpenAI in bot + weROI production |
| Webhooks | Webhook Relay API, Phone Store, Telegram webhook server |

No one can guarantee an interview, but a **live bot + this letter + webhook/LLM proof** puts you ahead of applicants who only claim experience.
