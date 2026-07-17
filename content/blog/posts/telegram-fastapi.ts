import { withReadingMeta } from "../types";

export const telegramFastapiPost = withReadingMeta({
  id: "telegram-fastapi",
  title: "How I Built a FastAPI Telegram Bot Webhook for Production Bookings",
  blurb:
    "Build a FastAPI Telegram bot webhook for production: multi step bookings, LLM chat, FAQ fallbacks, rate limits, and a Railway deploy that stays honest.",
  tag: "Case study",
  date: "March 2026",
  publishedAt: "2026-03-18",
  href: "/blog/telegram-fastapi",
  image: "/blog/telegram-fastapi.png",
  primaryKeyword: "FastAPI Telegram bot webhook",
  intro: [
    "When I set out to build the Tendem Demo Bot, I wanted something that worked the way a real production service works. Not a toy that replies to /start, but a FastAPI Telegram bot webhook that could walk a user through a multi-step booking, answer questions using an LLM with FAQ fallbacks, limit abuse with per-user rate controls, and persist everything to SQLite. All running on Railway behind a single public HTTPS endpoint.",
    "This post covers the full architecture of that bot: how the webhook receives updates, how the state machine manages booking conversations, how the LLM layer integrates with curated FAQ content, and how I handled rate limits and retries in production. If you are building a Python Telegram bot for anything beyond a demo, you will run into most of these problems. I am sharing how I solved them from Portmore, Jamaica.",
  ],
  sections: [
    {
      heading: "Why a FastAPI Telegram Bot Webhook Instead of Polling",
      paragraphs: [
        "Telegram supports two modes for receiving updates: long polling and webhooks. Polling is simpler to start with because the bot process pulls updates in a loop. Webhooks flip the model: Telegram pushes updates to your HTTPS endpoint as they arrive. For a production deployment on Railway, webhooks are the better fit because the bot process does not need to maintain a persistent outbound connection. It just waits for incoming requests like any API.",
        "FastAPI is a natural choice for the webhook server. It gives you async request handling, automatic request validation via Pydantic, OpenAPI docs for debugging, and easy integration with Python libraries for Telegram, LLMs, and SQLite. The webhook route itself is a single POST endpoint. Telegram sends a JSON payload representing the update (a message, a callback query from a button press, or an edited message), and the route processes it and returns a 200 response.",
        "One critical rule: respond fast. Telegram will retry the update if your endpoint takes too long, and retries with duplicate updates cause real problems in a booking flow. The webhook handler should accept the update, dispatch it to the appropriate handler, and return. Any slow work (like calling an LLM) should happen in a way that does not block the response.",
      ],
      code: {
        label: "Webhook route",
        language: "python",
        code: `from fastapi import FastAPI, Request
from telegram import Update
from telegram.ext import Application

app = FastAPI()
bot_app: Application = None  # initialized at startup

@app.post("/webhook")
async def telegram_webhook(request: Request):
    body = await request.json()
    update = Update.de_json(body, bot_app.bot)
    await bot_app.process_update(update)
    return {"ok": True}

@app.on_event("startup")
async def on_startup():
    global bot_app
    bot_app = Application.builder().token(BOT_TOKEN).build()
    await bot_app.initialize()
    await bot_app.bot.set_webhook(url=WEBHOOK_URL)`,
      },
    },
    {
      heading: "State Machine Booking Flow",
      paragraphs: [
        "The booking feature was the most demanding part of the bot. A user needs to select a service, choose a date, enter contact details, and confirm the booking. Each of those steps depends on the previous one, and the user can go back, cancel, or restart at any point. Free-form text input will not work here. The bot needs explicit state for each user.",
        "I implemented this as a finite state machine. Each user has a current state stored in SQLite: IDLE, SELECT_SERVICE, SELECT_DATE, ENTER_CONTACT, CONFIRM, or COMPLETE. When a message or callback arrives, the handler checks the user's current state, validates the input for that step, updates the stored data, and transitions to the next state. If validation fails, the user stays on the same step with a helpful error message.",
        "This approach makes the booking flow predictable. Going back means moving to the previous state and clearing the relevant field. Canceling resets to IDLE. Restarting a stale session is safe because the state record describes exactly where the user was. And because every transition is explicit, the bot never guesses what the user meant.",
      ],
      bullets: [
        "Store each user's booking state and collected fields in a SQLite row keyed by chat ID.",
        "Validate input at the step where it enters: date format, phone number pattern, required fields.",
        "Keep callback data short and deterministic so inline buttons work reliably across retries.",
        "Write transitions so they are idempotent. If Telegram retries an update, the same transition running twice should not create a duplicate booking.",
      ],
      code: {
        label: "State transitions",
        language: "python",
        code: `from enum import Enum

class BookingState(str, Enum):
    IDLE = "idle"
    SELECT_SERVICE = "select_service"
    SELECT_DATE = "select_date"
    ENTER_CONTACT = "enter_contact"
    CONFIRM = "confirm"
    COMPLETE = "complete"

async def handle_booking_update(chat_id: int, text: str, callback: str | None):
    session = db.get_session(chat_id)
    state = BookingState(session["state"]) if session else BookingState.IDLE

    if state == BookingState.SELECT_SERVICE:
        if callback and callback.startswith("service:"):
            service = callback.split(":")[1]
            db.update_session(chat_id, service=service, state=BookingState.SELECT_DATE)
            await send_date_picker(chat_id)
            return
        await send_service_menu(chat_id, error="Please select a service from the buttons.")
        return

    if state == BookingState.SELECT_DATE:
        parsed = parse_date(text)
        if not parsed:
            await reply(chat_id, "I need a date in YYYY-MM-DD format.")
            return
        db.update_session(chat_id, date=parsed, state=BookingState.ENTER_CONTACT)
        await reply(chat_id, "Great. Please send your phone number.")
        return`,
      },
    },
    {
      heading: "LLM Chat Layer with FAQ Fallbacks",
      paragraphs: [
        "Outside the booking flow, the bot supports open-ended conversation powered by an LLM (Groq or OpenAI, depending on configuration). But I learned early that you should never let the LLM be the only path to an answer. Model calls are slow relative to a chat reply, they cost money, they can time out, and the model can hallucinate details about your business.",
        "My approach: FAQ matching runs first. I maintain a curated set of question/answer pairs covering the most common inquiries (hours, location, pricing, how to book). When a message arrives, the bot normalizes it and checks for a confident match. If one is found, the curated answer goes back instantly. No LLM call, no latency, no cost, no risk of a wrong answer.",
        "If the FAQ check does not match, the message goes to the LLM with a focused system prompt and a short context window from recent conversation history. I cap the history to control cost and reduce contradictions. The LLM response is useful for flexible, open-ended questions where the FAQ set does not cover the topic.",
        "If the LLM times out or the provider returns an error, the bot does not hang. It catches the exception, sends a friendly fallback message explaining that it could not process the question, and offers the user a help menu or a link to contact support. This is a planned behavior, not an afterthought.",
      ],
      bullets: [
        "Normalize incoming text (lowercase, strip punctuation) before FAQ matching for more reliable hits.",
        "Log unmatched questions so you can expand the FAQ set based on real user behavior.",
        "Set a strict timeout on every LLM call. Five seconds is generous for a chat response.",
        "Track provider latency and error rates so you notice degradation before users report it.",
      ],
    },
    {
      heading: "Per-User Rate Limits and Abuse Protection",
      paragraphs: [
        "A public Telegram bot will get abused. Users (or other bots) will spam messages, and without limits, each message triggers an LLM call that costs money. I implemented per-user rate limiting using a simple sliding window counter stored in SQLite.",
        "Each user gets a maximum number of LLM requests per time window (for example, 10 requests per hour). When the limit is hit, the bot responds with a polite message explaining the limit and when it resets. FAQ responses are not rate limited because they do not cost anything externally.",
        "This approach is simple and effective. It protects the LLM budget, prevents one user from degrading the experience for others, and gives the bot a natural way to educate users about limits. The rate limit state is stored alongside the user's conversation data in SQLite, so there is no extra infrastructure.",
      ],
      code: {
        label: "Rate limit check",
        language: "python",
        code: `import time

RATE_LIMIT = 10
RATE_WINDOW = 3600  # 1 hour in seconds

def check_rate_limit(chat_id: int) -> bool:
    now = time.time()
    cutoff = now - RATE_WINDOW
    db.execute("DELETE FROM rate_limits WHERE chat_id = ? AND ts < ?", (chat_id, cutoff))
    count = db.execute(
        "SELECT COUNT(*) FROM rate_limits WHERE chat_id = ?", (chat_id,)
    ).fetchone()[0]
    if count >= RATE_LIMIT:
        return False
    db.execute("INSERT INTO rate_limits (chat_id, ts) VALUES (?, ?)", (chat_id, now))
    db.commit()
    return True`,
      },
    },
    {
      heading: "SQLite as the Single Persistence Layer",
      paragraphs: [
        "I chose SQLite deliberately. For a bot running on a single Railway container, SQLite is the simplest persistence option that still gives you relational queries, ACID transactions, and zero external dependencies. No managed database, no connection pooling, no credentials to rotate.",
        "The database stores booking sessions, conversation history for the LLM context window, FAQ content, and rate limit counters. Each table is small and focused. I use WAL mode for better concurrent read performance and set a busy timeout so writes do not fail immediately if two requests overlap.",
        "The tradeoff is clear: SQLite does not scale horizontally. If the bot needed multiple replicas, I would move to PostgreSQL. But for a single-instance service handling hundreds of concurrent users, SQLite is more than capable and dramatically simpler to operate.",
      ],
      bullets: [
        "Enable WAL mode at startup for better read concurrency.",
        "Use parameterized queries everywhere to prevent SQL injection.",
        "Run migrations on startup so the schema stays in sync with the application code.",
        "Back up the database file regularly since Railway containers can restart.",
      ],
    },
    {
      heading: "Deploying the Webhook on Railway",
      paragraphs: [
        "Railway makes deploying a Python service straightforward. Push to the repo, Railway builds the container, and the service runs. For a Telegram webhook, the deployment needs a few specific things: a publicly accessible HTTPS URL, environment variables for the bot token and webhook secret, and a health check endpoint so Railway knows the service is alive.",
        "On startup, the bot registers its webhook URL with Telegram. I store the base URL in an environment variable so the same code works in development (with ngrok or a local tunnel) and production. The health check endpoint is a simple GET route that returns 200. Railway pings it periodically to verify the container is running.",
        "One production concern: Railway containers restart. When that happens, the bot re-registers the webhook and SQLite recreates from the file on the persistent volume. Booking sessions in progress may need to prompt the user to continue, but the data is not lost.",
      ],
      code: {
        label: "Health check and startup",
        language: "python",
        code: `import os

WEBHOOK_URL = os.environ["WEBHOOK_URL"]
BOT_TOKEN = os.environ["BOT_TOKEN"]

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def startup():
    global bot_app
    bot_app = Application.builder().token(BOT_TOKEN).build()
    await bot_app.initialize()
    await bot_app.bot.set_webhook(
        url=f"{WEBHOOK_URL}/webhook",
        secret_token=os.environ.get("WEBHOOK_SECRET"),
    )`,
      },
    },
  ],
  faqs: [
    {
      question: "Is polling or webhook better for a production Telegram bot?",
      answer:
        "Webhooks are better for production. They let Telegram push updates to your server as they arrive, which eliminates the need for a persistent outbound connection and works naturally with containerized deployments on platforms like Railway. Polling is fine for local development and testing, but in production you want the reliability and lower latency of a proper webhook endpoint behind HTTPS.",
    },
    {
      question: "How do you handle duplicate Telegram updates from webhook retries?",
      answer:
        "Telegram retries when your endpoint is slow or returns an error. The key is making your handlers idempotent. I store an update ID or derive a deterministic key from the booking step and user, so if the same update arrives twice, the second processing does not create a duplicate booking or send a duplicate message. Fast response times from the webhook route also reduce the chance of retries in the first place.",
    },
    {
      question: "Can SQLite handle a production Telegram bot?",
      answer:
        "Yes, for a single-instance deployment. SQLite with WAL mode can handle hundreds of concurrent reads and sequential writes without issue. The bot's workload is mostly small reads and writes (session lookups, rate limit checks, conversation history). The limitation is horizontal scaling: if you need multiple bot instances behind a load balancer, move to PostgreSQL. For a single Railway container, SQLite is simpler and more than capable.",
    },
    {
      question: "How do you prevent LLM costs from running away on a public bot?",
      answer:
        "Three layers. First, FAQ matching intercepts common questions before they reach the LLM, so most messages cost nothing. Second, per-user rate limits cap how many LLM requests any single user can trigger per hour. Third, I set strict timeouts on every LLM call so a slow response does not hold resources. Together these controls keep the monthly cost predictable even with public access.",
    },
    {
      question: "What Python library works best with FastAPI for Telegram bots?",
      answer:
        "I use python-telegram-bot. It has strong async support, handles Telegram types cleanly, and integrates well with FastAPI's async request handlers. The library provides an Application class that processes updates, and you wire it to your FastAPI webhook route. It supports callback queries, inline keyboards, and conversation handlers out of the box, which covers most bot interactions.",
    },
  ],
  takeaway:
    "A production Telegram bot is an API service that happens to speak chat. Treat the webhook like a proper endpoint, make conversation state explicit, give every external dependency a fallback, and limit abuse at the user level. That is what turns a demo into a service people can rely on.",
  relatedLink: {
    label: "Explore the Tendem Demo Bot case study",
    href: "/projects/tendem-demo-bot",
  },
});
