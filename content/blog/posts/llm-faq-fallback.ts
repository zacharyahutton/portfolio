import { withReadingMeta } from "../types";

export const llmFaqFallbackPost = withReadingMeta({
  id: "llm-faq-fallback",
  title: "Building an LLM FAQ fallback chatbot that stays useful when the model stalls",
  blurb:
    "How I built an LLM FAQ fallback chatbot with curated answers first, Groq and OpenAI failover, rate limits, and timeouts that still help waiting users.",
  tag: "Bots",
  date: "April 2025",
  publishedAt: "2025-04-24",
  href: "/blog/llm-faq-fallback",
  image: "/blog/llm-faq-fallback.png",
  primaryKeyword: "LLM FAQ fallback chatbot",
  intro: [
    "The Tendem Demo Bot uses an LLM to answer open ended questions, but I designed it so the language model is the last resort, not the first. Most chatbots I see do the opposite: they route every message to a model, cross their fingers, and show a spinner. When the model is slow, down, or rate limited, the user gets nothing. That is not a good experience.",
    "This post covers how I built an LLM FAQ fallback chatbot that checks curated answers first, calls Groq as the primary model provider, fails over to OpenAI when Groq is unavailable, and handles timeouts gracefully so the user always gets a useful response. These patterns apply to any Telegram bot, Slack bot, or web chat that combines deterministic content with generative AI.",
  ],
  sections: [
    {
      heading: "Why you should route FAQ questions before calling an LLM",
      paragraphs: [
        "The most common questions users ask a business bot are predictable. What are your hours? How do I book? What do you charge? How do I contact support? These questions have stable, verified answers that should not depend on a model generating them correctly each time.",
        "I maintain a curated FAQ set as a simple data structure: a list of entries with a canonical question, keyword variants, and the approved answer. When a message arrives, the bot normalizes the text (lowercase, strip punctuation, remove filler words) and checks for confident matches against the FAQ set. If the match score is above a threshold, the bot returns the curated answer immediately. No model call, no latency, no cost, no hallucination risk.",
        "This approach has a second benefit: it gives you analytics. By logging unmatched questions, you discover the questions users are actually asking that your FAQ set does not cover. That log becomes the roadmap for expanding curated content and improving the bot over time.",
      ],
      code: {
        label: "Simple FAQ matching before LLM call",
        language: "python",
        code: `from difflib import SequenceMatcher

FAQ_ENTRIES = [
    {
        "keywords": ["hours", "open", "when", "schedule", "time"],
        "answer": "We are open Monday to Friday, 9 AM to 5 PM EST.",
    },
    {
        "keywords": ["book", "appointment", "reserve", "schedule visit"],
        "answer": "To book an appointment, use the /book command or visit our website.",
    },
    {
        "keywords": ["price", "cost", "charge", "rate", "fee"],
        "answer": "Pricing depends on the service. Use /services to see our current rates.",
    },
]


def normalize(text: str) -> str:
    return text.lower().strip()


def check_faq(user_message: str) -> str | None:
    normalized = normalize(user_message)
    for entry in FAQ_ENTRIES:
        for keyword in entry["keywords"]:
            if keyword in normalized:
                return entry["answer"]
    return None`,
      },
    },
    {
      heading: "Structuring the Groq and OpenAI fallback chain",
      paragraphs: [
        "When the FAQ path returns no match, the bot needs a generative response. I use Groq as the primary provider because it is fast (often under 500ms for short responses) and cost effective for conversational workloads. But Groq is not always available. Rate limits, maintenance windows, and occasional timeouts are normal operating conditions for any API dependency.",
        "The fallback chain works like this: try Groq with a 10 second timeout. If Groq returns a valid response, use it. If Groq times out, returns a rate limit error (429), or throws a server error (5xx), try OpenAI with the same prompt and a 15 second timeout. If both providers fail, return a deterministic fallback message that offers the user a help menu or contact path.",
        "This three layer approach (curated FAQ, primary LLM, secondary LLM, deterministic fallback) means the bot always returns something useful. The user never sees a spinner that hangs indefinitely or an error message that says \"something went wrong.\"",
      ],
      code: {
        label: "Provider fallback chain",
        language: "python",
        code: `import asyncio
import httpx

GROQ_TIMEOUT = 10.0
OPENAI_TIMEOUT = 15.0

FALLBACK_MESSAGE = (
    "I'm having trouble reaching my AI assistant right now. "
    "Try /help for common questions, or /contact to reach the team directly."
)


async def get_llm_response(prompt: str, context: str) -> str:
    messages = [
        {"role": "system", "content": context},
        {"role": "user", "content": prompt},
    ]

    # Try Groq first
    try:
        response = await call_groq(messages, timeout=GROQ_TIMEOUT)
        return response
    except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
        logger.warning(f"Groq failed: {e}")

    # Fall back to OpenAI
    try:
        response = await call_openai(messages, timeout=OPENAI_TIMEOUT)
        return response
    except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
        logger.warning(f"OpenAI failed: {e}")

    # Both providers failed
    return FALLBACK_MESSAGE`,
      },
    },
    {
      heading: "Chatbot timeout handling that respects the user's patience",
      paragraphs: [
        "A user in a Telegram chat expects a response within a few seconds. If the bot takes 30 seconds because the model is thinking, the user assumes it is broken and sends the message again, creating duplicate requests and a worse experience. Timeout handling is not an edge case. It is a core part of the product design.",
        "I handle timeouts at two levels. First, each provider call has an explicit timeout (10 seconds for Groq, 15 for OpenAI) enforced by the HTTP client. Second, the bot sends a typing indicator immediately when a message arrives, so the user knows the bot received their input even before the model responds. If the total response time exceeds a reasonable threshold, the bot sends the fallback message rather than making the user wait indefinitely.",
        "I also debounce rapid repeated messages. If a user sends the same text three times in five seconds (usually because they think the bot is stuck), the bot processes it once and ignores the duplicates. This prevents wasted model calls and keeps the conversation clean.",
      ],
    },
    {
      heading: "Giving the LLM bounded context, not unlimited history",
      paragraphs: [
        "Sending the entire conversation history to the model on every turn is expensive, slow, and counterproductive. Long context windows increase latency, cost more tokens, and can cause the model to contradict earlier statements when the history contains conflicting information.",
        "I keep a sliding window of the last five exchanges per user, stored in SQLite. The system prompt is static and focused: it describes the business, the bot's personality, and the boundaries of what it should and should not answer. User context is limited to recent messages and any data collected during the current booking flow.",
        "This bounded approach keeps model calls fast and predictable. It also reduces privacy exposure because old conversation data is not sent to external providers repeatedly. When the conversation ends or the user starts a new session, the window resets.",
      ],
      code: {
        label: "Bounded conversation context",
        language: "python",
        code: `MAX_HISTORY_TURNS = 5

SYSTEM_PROMPT = """You are the Tendem Demo Bot assistant.
Answer questions about services, hours, and booking.
If you are unsure, say so and suggest using /help.
Do not make up information about pricing or availability."""


def build_messages(user_id: int, new_message: str, db: Session) -> list[dict]:
    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(MAX_HISTORY_TURNS * 2)
        .all()
    )
    history.reverse()

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": new_message})
    return messages`,
      },
    },
    {
      heading: "Per user rate limits to control cost and abuse",
      paragraphs: [
        "LLM API calls cost money. Without rate limiting, a single user (or a bot spamming your bot) can burn through your monthly budget in an afternoon. I enforce per user rate limits at the application level: each user gets a fixed number of LLM calls per hour. FAQ responses do not count against the limit because they cost nothing.",
        "When a user hits the limit, the bot explains what happened and offers the help menu. The message is honest and not punitive: \"I have reached my AI response limit for this hour. Try /help for common answers, or check back in a bit.\" I store rate limit counters in SQLite with a TTL, so the data cleans itself up without a separate cron job.",
        "This pattern also provides a natural defense against prompt injection and abuse. If someone tries to manipulate the model through creative prompts, they are limited to a small number of attempts per hour. Combined with the system prompt boundaries, this makes the bot resilient to casual abuse without requiring a dedicated content moderation layer.",
      ],
    },
    {
      heading: "Testing the bot with the model provider disabled",
      paragraphs: [
        "One of the most valuable tests I run is the entire conversation flow with the LLM provider disabled. I set the provider URL to an invalid endpoint and verify that the bot still responds to every message: FAQ questions return curated answers, open ended questions return the fallback message, booking flows work because they use state machines instead of model calls, and commands like /help and /contact work regardless of provider status.",
        "This test proves that the bot is a product, not just an LLM wrapper. The model adds flexibility and personality, but the core experience (booking, FAQ, contact, error handling) works without it. That resilience is what separates a demo from a service.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I add FAQ fallback to an existing LLM chatbot?",
      answer:
        "Start by logging the most common questions your bot receives. Write curated answers for the top 10 to 20 and implement a keyword matching or embedding similarity check before the LLM call. Route confident matches to the curated answer and only call the model for unmatched queries. This immediately reduces latency, cost, and hallucination risk for your highest traffic questions.",
    },
    {
      question: "What is the best timeout for LLM API calls in a chatbot?",
      answer:
        "For real time chat (Telegram, Slack, web chat), I recommend 8 to 15 seconds per provider. Users expect responses within a few seconds, so anything longer feels broken. Set the timeout at the HTTP client level and have a fallback message ready. Sending a typing indicator immediately buys you some patience, but do not exceed 20 seconds total for the full fallback chain.",
    },
    {
      question: "Should I use Groq or OpenAI for a Telegram bot?",
      answer:
        "I use both. Groq is faster (often under 500ms) and cheaper for conversational workloads, so it is my primary provider. OpenAI is more reliable under high load and has broader model selection, so it is my fallback. Using both in a chain gives you the speed of Groq with the reliability of OpenAI as a safety net. The added complexity is minimal compared to the resilience gain.",
    },
    {
      question: "How do I prevent LLM chatbot abuse and prompt injection?",
      answer:
        "Combine per user rate limits (a fixed number of LLM calls per hour), a focused system prompt that defines boundaries, and input length limits. Rate limiting is the most effective single measure because it caps the damage any one user can do. For content moderation, keep the system prompt narrow (\"do not make up pricing, do not answer off topic questions\") and log flagged responses for review.",
    },
    {
      question: "How do I handle duplicate messages in a Telegram bot?",
      answer:
        "Track the last message timestamp and content per user. If the same text arrives within a short window (3 to 5 seconds), process it once and silently ignore duplicates. You can also use Telegram's update_id to detect redeliveries from the Telegram server. Debouncing prevents wasted model calls and duplicate booking attempts.",
    },
  ],
  takeaway:
    "An LLM FAQ fallback chatbot checks curated answers first, calls the model second, fails over to a backup provider third, and always has a deterministic message when everything else fails. This layered approach keeps the bot fast, affordable, and useful even when the model stalls. The model adds flexibility. The architecture provides reliability.",
  relatedLink: {
    label: "Explore the Tendem Demo Bot",
    href: "/projects/tendem-demo-bot",
  },
});
