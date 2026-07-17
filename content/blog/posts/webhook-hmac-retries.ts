import { withReadingMeta } from "../types";

export const webhookHmacRetriesPost = withReadingMeta({
  id: "webhook-hmac-retries",
  title: "HMAC Webhook Verification, Retries, and Rate Limits: A Practical Guide",
  blurb:
    "Implement HMAC webhook verification with raw body signatures, idempotent handlers, bounded retries, and rate limits for a dependable production webhook API.",
  tag: "API",
  date: "December 2025",
  publishedAt: "2025-12-16",
  href: "/blog/webhook-hmac-retries",
  image: "/blog/webhook-hmac-retries.png",
  primaryKeyword: "HMAC webhook verification",
  intro: [
    "A webhook is a promise between two systems that cannot see each other. The sender promises to report an event, and the receiver promises to handle it. Networks break that promise regularly, which means security and reliability have to be engineered into the protocol you build around the request. HMAC webhook verification is the first line of defense, followed by idempotent handlers, bounded retries, and rate limits.",
    "I built a webhook relay API as a portfolio project to work through these problems hands-on. This post covers the full implementation: how to verify HMAC signatures correctly, how to handle duplicate deliveries, how to retry failures without creating chaos, and how to rate limit incoming traffic. Every pattern here applies to any webhook receiver, whether you are integrating with Stripe, GitHub, Telegram, or a custom provider.",
  ],
  sections: [
    {
      heading: "How HMAC Webhook Verification Works",
      paragraphs: [
        "HMAC (Hash-based Message Authentication Code) verification proves two things: the request came from a party that knows the shared secret, and the payload was not modified in transit. The sender computes a hash of the request body using the shared secret and includes the hash in a header. The receiver computes the same hash from the raw request body and compares the two values.",
        "The critical detail is 'raw request body.' You must compute the HMAC from the exact bytes the sender hashed. If you parse the JSON first and then re-serialize it, whitespace or key ordering can change, producing a different hash that fails verification even though the payload is semantically identical. Read the raw body once, use it for HMAC verification, and then parse it for your application logic.",
        "The comparison must use a constant-time function. A naive string comparison leaks information about which characters matched through timing differences. Python's hmac.compare_digest and Node's crypto.timingSafeEqual both provide constant-time comparison. This is not theoretical. Timing attacks on webhook signatures have been demonstrated in practice.",
      ],
      code: {
        label: "HMAC verification in FastAPI",
        language: "python",
        code: `import hmac
import hashlib
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
WEBHOOK_SECRET = b"your-shared-secret"

async def verify_hmac(request: Request) -> bytes:
    """Verify HMAC-SHA256 signature and return raw body."""
    raw_body = await request.body()
    signature_header = request.headers.get("X-Signature-256", "")

    if signature_header.startswith("sha256="):
        signature_header = signature_header[7:]

    expected = hmac.new(WEBHOOK_SECRET, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, signature_header):
        raise HTTPException(status_code=401, detail="Invalid signature")

    return raw_body

@app.post("/webhook")
async def receive_webhook(request: Request):
    raw_body = await verify_hmac(request)
    payload = json.loads(raw_body)
    await process_event(payload)
    return {"status": "accepted"}`,
      },
    },
    {
      heading: "Rejecting Stale and Replayed Requests",
      paragraphs: [
        "HMAC verification alone does not prevent replay attacks. An attacker who intercepts a valid signed request can resend it later. To mitigate this, many webhook providers include a timestamp in the signed payload or in a separate header. The receiver checks that the timestamp is within an acceptable window (typically five minutes) and rejects anything older.",
        "Combining HMAC verification with timestamp validation gives you two guarantees: the payload is authentic (from the expected sender) and recent (not a captured replay). Some providers also include a unique event ID that you can store and check against to catch exact duplicates within the time window.",
      ],
      code: {
        label: "Timestamp validation",
        language: "python",
        code: `import time

MAX_AGE_SECONDS = 300  # 5 minutes

def validate_timestamp(request_timestamp: str):
    try:
        ts = int(request_timestamp)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid timestamp")

    age = abs(time.time() - ts)
    if age > MAX_AGE_SECONDS:
        raise HTTPException(status_code=401, detail="Request too old")`,
      },
    },
    {
      heading: "Idempotent Handlers: Assume Every Event Arrives Twice",
      paragraphs: [
        "Webhook retries are a feature, not a bug. When the sender does not receive a timely response (because your server was slow, the network dropped the response, or your process restarted mid-request), it will retry the delivery. This means your handler must be idempotent: processing the same event twice should produce the same result as processing it once.",
        "The simplest approach is to store a provider event ID before performing side effects. When an event arrives, check if that ID already exists in your database. If it does, return success without running the handler again. If it does not, store it and proceed. This works for most webhook integrations.",
        "For events that do not include a provider ID, you can derive an idempotency key from the payload content (event type, resource ID, and timestamp hashed together). The key should be deterministic so the same event always produces the same key.",
      ],
      code: {
        label: "Idempotency check",
        language: "python",
        code: `async def process_event(payload: dict):
    event_id = payload.get("id")
    if not event_id:
        event_id = derive_idempotency_key(payload)

    if await db.event_exists(event_id):
        return  # Already processed, skip

    await db.record_event(event_id)

    # Now safe to run side effects
    event_type = payload.get("type")
    if event_type == "payment.completed":
        await handle_payment_completed(payload)
    elif event_type == "subscription.cancelled":
        await handle_subscription_cancelled(payload)`,
      },
      bullets: [
        "Store event IDs before running side effects, not after.",
        "Use a unique constraint or upsert to prevent race conditions with concurrent retries.",
        "Return 200 for duplicate events so the sender stops retrying.",
        "Keep the event log for auditing and debugging, not just deduplication.",
      ],
    },
    {
      heading: "Bounded Retries with Exponential Backoff",
      paragraphs: [
        "When your webhook relay delivers events to a downstream service, that service can fail. A retry strategy ensures temporary failures do not cause permanent data loss. But unbounded retries will overwhelm a struggling service and waste resources on permanently broken payloads.",
        "I use exponential backoff with a maximum retry count. The first retry happens after 1 second, the second after 4 seconds, the third after 16 seconds, and so on. After a configurable number of attempts (typically 5), the event moves to a dead letter queue for manual review. Each attempt records the timestamp, HTTP status code, and a short error description.",
        "The retry logic distinguishes between retryable and non-retryable failures. Server errors (5xx) and timeouts are retryable. Client errors (4xx) except 429 (rate limited) are not retryable because the payload is likely invalid and resending it will produce the same error. A 429 response is retryable but should respect the Retry-After header if provided.",
      ],
      code: {
        label: "Retry logic",
        language: "python",
        code: `import asyncio
import httpx

MAX_RETRIES = 5

async def deliver_with_retries(url: str, payload: dict, event_id: str):
    for attempt in range(MAX_RETRIES):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10)

            await log_attempt(event_id, attempt, response.status_code)

            if response.status_code < 300:
                return True
            if 400 <= response.status_code < 500 and response.status_code != 429:
                await mark_permanent_failure(event_id, response.status_code)
                return False

        except (httpx.TimeoutException, httpx.ConnectError) as exc:
            await log_attempt(event_id, attempt, error=str(exc))

        delay = (2 ** attempt) * 1  # 1, 2, 4, 8, 16 seconds
        await asyncio.sleep(delay)

    await move_to_dead_letter(event_id)
    return False`,
      },
    },
    {
      heading: "Rate Limiting Incoming Webhooks",
      paragraphs: [
        "A webhook endpoint can receive bursts of traffic. A popular e-commerce platform might fire hundreds of order events in a minute during a sale. A misbehaving integration might send the same event in a loop. Without rate limiting, your server processes every request immediately, potentially overwhelming your database or downstream services.",
        "I implement rate limiting at two levels. The first is a global rate limit that caps total requests per time window (for example, 100 requests per minute). The second is a per-source rate limit that caps requests from a specific sender or API key. When either limit is exceeded, the endpoint returns 429 Too Many Requests with a Retry-After header.",
        "The rate limit state lives in a fast store (Redis in production, or an in-memory counter for simpler deployments). The important thing is that rate limiting protects your downstream processing. Even if you accept and queue events beyond the rate limit, the processing pipeline should have its own concurrency control to avoid overwhelming external services.",
      ],
      bullets: [
        "Return 429 with a Retry-After header so well-behaved senders know when to retry.",
        "Log rate-limited requests for monitoring and abuse detection.",
        "Apply limits before signature verification to protect against CPU-intensive hash flooding.",
        "Alert on sustained rate limit hits because they may indicate a misconfigured integration or an attack.",
      ],
    },
    {
      heading: "Putting It All Together: A Secure Webhook API",
      paragraphs: [
        "The complete flow for a secure webhook receiver looks like this: (1) rate limit check, (2) HMAC signature verification against the raw body, (3) timestamp validation to reject stale requests, (4) idempotency check against the event ID, (5) process the event and run side effects, (6) return 200 to acknowledge receipt.",
        "Each step serves a distinct purpose. Rate limiting protects resources. HMAC verification ensures authenticity and integrity. Timestamp validation prevents replays. Idempotency prevents duplicate processing. The ordering matters because you want to reject invalid requests as cheaply as possible. Rate limiting is a simple counter check. HMAC computation is more expensive. Processing the event is the most expensive step and should only happen for verified, deduplicated events.",
        "In production, wrap the entire flow in structured logging. Record the event ID, source, verification result, processing outcome, and any errors. When something goes wrong (and it will), logs are your primary debugging tool. Include enough context to reconstruct what happened without logging sensitive payload data like personal information or credentials.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why use HMAC instead of API keys for webhook verification?",
      answer:
        "An API key proves the identity of the sender but does not prove that the payload was not modified in transit. HMAC verification proves both: only someone with the shared secret could produce the signature, and any change to the payload invalidates it. This is especially important for webhooks because the request travels over the public internet and could be intercepted or tampered with by a proxy or CDN.",
    },
    {
      question: "What happens if you parse JSON before computing the HMAC?",
      answer:
        "The HMAC hash will likely not match. JSON serialization is not deterministic. Different serializers may order keys differently or handle whitespace, Unicode escaping, or floating point precision differently. The sender computed the HMAC from specific bytes. You must compute your HMAC from the same bytes by reading the raw request body before any parsing or transformation.",
    },
    {
      question: "How many times should you retry a failed webhook delivery?",
      answer:
        "A common pattern is 5 retries with exponential backoff, giving a total retry window of about 30 seconds to a few minutes. After the maximum retries, move the event to a dead letter queue for manual review. The exact numbers depend on your SLA and downstream tolerance. The key principle is that retries should be bounded, and permanent failures (4xx client errors) should not be retried at all.",
    },
    {
      question: "Should webhook handlers be synchronous or asynchronous?",
      answer:
        "Return 200 quickly and process the event asynchronously. Most webhook senders have short timeout windows (5 to 30 seconds). If your handler performs slow work like database writes, email sends, or API calls before responding, the sender may time out and retry, creating duplicate deliveries. Accept the event, queue it for processing, and return immediately. This also makes your endpoint more resilient to traffic bursts.",
    },
  ],
  takeaway:
    "Secure webhook verification gets a request through the front door. Idempotency, bounded retries, and rate limits are what make it dependable after that. Build each layer separately, test failure paths deliberately, and log enough context to debug production issues without exposing sensitive data.",
  relatedLink: {
    label: "View the webhook relay project",
    href: "/projects/webhook-relay-api",
  },
});
