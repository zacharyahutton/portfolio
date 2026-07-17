import { withReadingMeta } from "../types";

export const fastapiAsyncTelegramPost = withReadingMeta({
  id: "fastapi-async-telegram",
  title: "Async FastAPI Telegram Bot: Event Loop, Background Tasks, and LLM Timeout Fallbacks",
  blurb:
    "Keep an async FastAPI Telegram bot responsive when LLM calls stall: timeouts, background tasks, FAQ fallbacks, and an event loop that stays free for users.",
  tag: "Backend",
  date: "September 2025",
  publishedAt: "2025-09-17",
  href: "/blog/fastapi-async-telegram",
  image: "/blog/fastapi-async-telegram.png",
  primaryKeyword: "async FastAPI Telegram bot",
  intro: [
    "Async Python can handle many concurrent I/O operations efficiently, but only when the code actually gives control back to the event loop. One blocking SDK call inside a Telegram webhook handler can delay every other user waiting for a reply. I learned this the hard way while building the Tendem Demo Bot, where a slow LLM response would make the entire bot feel frozen.",
    "This post covers the async patterns I use in my async FastAPI Telegram bot: understanding what async actually improves, identifying hidden blocking calls, using background tasks for slow work, implementing LLM timeout fallbacks, and keeping a deterministic answer path when the model provider is unavailable. These patterns apply to any FastAPI service that calls external APIs, not just Telegram bots.",
  ],
  sections: [
    {
      heading: "What Async Actually Improves (and What It Does Not)",
      paragraphs: [
        "Async Python helps when your program spends time waiting. Waiting for a database query to return. Waiting for an HTTP response from an external API. Waiting for a file read to complete. During that wait time, the event loop can process other requests. This is why async FastAPI can handle hundreds of concurrent webhook deliveries on a single process.",
        "Async does not help with CPU-bound work. If your handler spends 2 seconds computing something (parsing a large document, running a complex algorithm, processing an image), the event loop is blocked during that computation. No other requests can be processed. CPU-bound work needs a thread pool or a separate worker process.",
        "The problem with LLM calls is subtle. The SDK you are using might look async (it accepts await), but internally it might be doing blocking network I/O on the event loop thread. Or the call might be truly async but takes 10 seconds to return because the model is slow. Both scenarios degrade the experience for every other user whose request is waiting for the event loop.",
      ],
      code: {
        label: "Blocking vs async",
        language: "python",
        code: `import asyncio
import httpx

# BAD: Blocks the event loop for ALL users
import requests
def get_llm_response_blocking(prompt: str) -> str:
    response = requests.post(LLM_URL, json={"prompt": prompt}, timeout=30)
    return response.json()["text"]

# GOOD: Releases the event loop during the wait
async def get_llm_response_async(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            LLM_URL, json={"prompt": prompt}, timeout=10
        )
        return response.json()["text"]

# ACCEPTABLE: Moves blocking work to a thread pool
async def get_llm_response_threaded(prompt: str) -> str:
    return await asyncio.to_thread(get_llm_response_blocking, prompt)`,
      },
    },
    {
      heading: "Finding Hidden Blocking Calls in Your Bot",
      paragraphs: [
        "Not every library that supports await is truly non-blocking. Some libraries use synchronous HTTP clients internally and wrap the call in a thread. Others may use an async HTTP client but block on DNS resolution or TLS handshake. The only way to know is to check the library's implementation or measure event loop latency during calls.",
        "I trace each dependency in my bot's call chain. The Telegram library (python-telegram-bot) is truly async: it uses httpx under the hood. The LLM SDK depends on the provider. Groq's Python client supports async natively. OpenAI's client also has async methods. But if you are using a provider SDK that only offers synchronous methods, you need to wrap it with asyncio.to_thread.",
        "A practical test: log the time before and after your webhook handler runs. If a single handler takes 5+ seconds and you see other users' responses delayed by the same amount, you have a blocking call somewhere in the chain. Profile the handler, identify which call is slow, and either use an async alternative or move it to a thread.",
      ],
      bullets: [
        "Use httpx instead of requests for async HTTP calls.",
        "Check if your LLM SDK's async methods are truly non-blocking or just thread wrappers.",
        "asyncio.to_thread is the escape hatch for unavoidable blocking calls.",
        "Set explicit timeouts on every external call to bound the maximum blocking time.",
      ],
    },
    {
      heading: "FastAPI Background Tasks for Slow Work",
      paragraphs: [
        "Some work triggered by a webhook does not determine the immediate reply. Analytics logging, notification delivery, cache updates, and follow-up messages can happen after the webhook response is sent. FastAPI's BackgroundTasks lets you schedule functions to run after the response is returned to the client.",
        "For a Telegram bot, the most useful application of background tasks is deferred processing. The webhook handler receives the update, sends an immediate acknowledgment (like a typing indicator or a short 'processing' message), and schedules the slow LLM call as a background task. The background task runs after the 200 response is returned to Telegram, so Telegram does not retry the update due to a slow response.",
        "The limitation of background tasks is that they run in the same process and event loop. If the background task is itself blocking, it will still degrade performance. Background tasks work best for truly async operations (sending an HTTP request, writing to a database) that you simply do not need to wait for before responding.",
      ],
      code: {
        label: "Background task pattern",
        language: "python",
        code: `from fastapi import BackgroundTasks

@app.post("/webhook")
async def telegram_webhook(request: Request, bg: BackgroundTasks):
    body = await request.json()
    update = Update.de_json(body, bot_app.bot)
    chat_id = update.effective_chat.id

    if requires_llm_response(update):
        # Send immediate typing indicator
        await bot_app.bot.send_chat_action(chat_id, "typing")
        # Schedule slow LLM work as background task
        bg.add_task(process_llm_and_reply, chat_id, update.message.text)
    else:
        await handle_quick_response(update)

    return {"ok": True}

async def process_llm_and_reply(chat_id: int, text: str):
    try:
        response = await get_llm_response_async(text)
        await bot_app.bot.send_message(chat_id, response)
    except Exception:
        await bot_app.bot.send_message(
            chat_id, "I could not process that. Try /help for options."
        )`,
      },
    },
    {
      heading: "LLM Timeout Fallback: Never Leave the User Hanging",
      paragraphs: [
        "The worst user experience in a bot is silence. The user sends a message and nothing happens. No response, no error, no indication that anything is working. This happens when an LLM call times out or the provider has an outage, and the bot has no fallback path.",
        "I wrap every LLM call in a timeout. If the provider does not respond within a configurable window (I use 8 seconds for chat, 15 seconds for longer generation tasks), the call is cancelled and the bot falls back to a deterministic response. The fallback might be a curated FAQ answer, a help menu, or a simple message explaining that the bot is experiencing delays.",
        "The timeout is not just about user experience. It also protects the event loop. A single LLM call that hangs for 60 seconds ties up an asyncio task for that entire duration. With a bounded timeout, the task completes or cancels within a known window, freeing resources for other users.",
      ],
      code: {
        label: "Timeout with fallback",
        language: "python",
        code: `import asyncio

LLM_TIMEOUT = 8  # seconds

async def get_response_with_fallback(user_text: str) -> str:
    # First: check FAQ for instant answers
    faq_answer = match_faq(user_text)
    if faq_answer:
        return faq_answer

    # Second: try LLM with strict timeout
    try:
        response = await asyncio.wait_for(
            get_llm_response_async(user_text),
            timeout=LLM_TIMEOUT,
        )
        return response
    except asyncio.TimeoutError:
        return (
            "I am taking longer than usual to respond. "
            "Try /help to see what I can help with, "
            "or ask your question again in a moment."
        )
    except Exception as exc:
        logger.error("LLM call failed", exc_info=exc)
        return (
            "Something went wrong on my end. "
            "You can try /faq for common questions or /contact to reach us."
        )`,
      },
    },
    {
      heading: "The Deterministic Answer Path: FAQ Before LLM",
      paragraphs: [
        "I route every incoming message through a FAQ matching layer before reaching the LLM. This is the deterministic answer path: for high-value questions (business hours, location, how to book, pricing), the bot always returns a curated, verified answer. No model latency, no generation cost, no risk of hallucinated details.",
        "The FAQ matcher normalizes the incoming text (lowercase, strip punctuation, remove common stop words) and checks for keyword or phrase matches against the curated set. If a match scores above a confidence threshold, the curated answer is returned immediately. If no match is found, the message continues to the LLM path.",
        "This design means the bot stays useful even when the LLM provider is completely down. The most important questions are answered from curated content. The LLM adds flexibility for open-ended questions, but it is not the foundation. I log unmatched questions to identify gaps in the FAQ set and expand it over time based on real user behavior.",
      ],
      bullets: [
        "Curated FAQ answers are instant, free, and always accurate.",
        "Log unmatched questions to identify content gaps.",
        "The LLM enhances the experience but is not required for core functionality.",
        "Test the bot with the LLM provider disabled to verify the FAQ path works independently.",
      ],
    },
    {
      heading: "Monitoring and Debugging Async Bot Performance",
      paragraphs: [
        "Async bugs are harder to reproduce than synchronous bugs because they depend on timing and concurrency. I instrument the bot with structured logging that records the event type, user ID, handler duration, and whether the response came from FAQ, LLM, or fallback. This gives me a clear picture of how the bot performs under real load.",
        "I track three key metrics: average handler response time (how long before the user gets a reply), LLM call success rate (percentage of LLM calls that complete within the timeout), and FAQ hit rate (percentage of messages answered from curated content). A drop in LLM success rate or a spike in handler time tells me something is degrading before users start complaining.",
        "For debugging, I test the bot under simulated load using a script that sends rapid messages from multiple users. This exposes event loop blocking that is invisible with a single user. If response times degrade linearly with concurrent users, there is a blocking call somewhere. If they stay flat, the async architecture is working correctly.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do you prevent an LLM call from blocking the FastAPI event loop?",
      answer:
        "Use an async HTTP client (like httpx) for the LLM API call, and wrap it with asyncio.wait_for to enforce a timeout. If the SDK only provides synchronous methods, use asyncio.to_thread to move the blocking call to a thread pool. Never call a synchronous HTTP library (like requests) directly in an async handler, because it blocks the event loop and delays all other concurrent requests.",
    },
    {
      question: "What is the best timeout for LLM calls in a Telegram bot?",
      answer:
        "For conversational responses, 8 to 10 seconds is a reasonable maximum. Telegram users expect quick replies, and most LLM providers can return a short response within that window. For longer generation tasks, you can extend to 15 seconds, but send a typing indicator or interim message so the user knows the bot is working. Beyond 15 seconds, most users will assume the bot is broken.",
    },
    {
      question: "Should I use FastAPI BackgroundTasks or Celery for a Telegram bot?",
      answer:
        "For a single-instance bot on Railway, FastAPI BackgroundTasks are simpler and sufficient. They run in the same process and event loop, which means no extra infrastructure. Celery is appropriate when you need distributed task processing, persistent job queues, scheduled tasks, or multiple worker processes. For most Telegram bots, background tasks cover the use case without the operational overhead of Celery and a message broker.",
    },
    {
      question: "How do you test async handlers for race conditions?",
      answer:
        "Write a script that sends concurrent requests to your webhook endpoint using asyncio.gather or a load testing tool like locust. Monitor response times and check for data corruption (duplicate bookings, missing state updates, garbled responses). Use SQLite WAL mode or proper database transactions to prevent write conflicts. Log enough context to trace which request caused which state change.",
    },
  ],
  takeaway:
    "Async reliability comes from understanding where the program waits. Bound every external call with a timeout, keep blocking work away from the event loop, route common questions through curated FAQ content before reaching the LLM, and always preserve a useful answer path when the model provider is unavailable.",
  relatedLink: {
    label: "Explore the bot case study",
    href: "/projects/tendem-demo-bot",
  },
});
