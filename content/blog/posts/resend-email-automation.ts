import { withReadingMeta } from "../types";

export const resendEmailAutomationPost = withReadingMeta({
  id: "resend-email-automation",
  title: "Resend transactional email: templates, delivery logging, and not landing in spam",
  blurb:
    "How I integrated Resend transactional email into weROI's FastAPI backend with SPF, DKIM, branded templates, and delivery logging that surfaces failures.",
  tag: "Integrations",
  date: "February 2025",
  publishedAt: "2025-02-20",
  href: "/blog/resend-email-automation",
  image: "/blog/resend-email-automation.png",
  primaryKeyword: "Resend transactional email",
  intro: [
    "Sending an email through an API takes five lines of code. Getting that email to arrive in the inbox, look intentional, and be diagnosable when it fails takes considerably more thought. When I integrated Resend transactional email into weROI's FastAPI backend, the code was the easy part. The real work was domain authentication, template design, error handling, and the logging infrastructure that lets the team know whether emails are actually being delivered.",
    "This post covers the full integration: setting up SPF and DKIM for domain authentication, building templates that render well across clients, handling delivery failures gracefully, and logging enough to diagnose problems without exposing sensitive data. If you are adding transactional email to a FastAPI or any Python backend, these patterns will save you from the most common mistakes.",
  ],
  sections: [
    {
      heading: "Setting up SPF and DKIM: the foundation of inbox delivery",
      paragraphs: [
        "Before writing any code, you need to prove to email providers that your service is allowed to send email from your domain. SPF (Sender Policy Framework) tells receiving servers which IP addresses can send email on behalf of your domain. DKIM (DomainKeys Identified Mail) adds a cryptographic signature to each email that proves the message was not tampered with in transit.",
        "Resend makes this straightforward. When you add a domain in the Resend dashboard, it generates the DNS records you need to add: an SPF TXT record and DKIM CNAME records. You add these to your domain's DNS configuration and wait for verification. Once verified, emails sent through Resend from that domain pass SPF and DKIM checks, which dramatically improves inbox placement.",
        "I also set up a DMARC record, which tells receiving servers what to do when an email fails SPF or DKIM checks. For weROI, I started with a monitoring policy (p=none) to collect reports, then tightened it to quarantine after confirming everything was passing. Skipping DMARC is technically optional, but it leaves you vulnerable to spoofing and reduces trust with email providers.",
      ],
      bullets: [
        "Add SPF, DKIM, and DMARC records before sending your first email.",
        "Use Resend's domain verification to generate the exact records you need.",
        "Start DMARC in monitoring mode (p=none) and tighten after reviewing reports.",
        "Verify records with tools like MXToolbox or dmarcian before going live.",
        "Use a real branded sender address (growth@weroi.net), not a no-reply generic.",
      ],
    },
    {
      heading: "Why a branded sender matters more than you think",
      paragraphs: [
        "The sender address and display name are the first things a recipient sees. Using a generic no-reply address or a default Resend subdomain tells the recipient (and spam filters) that you did not invest in the email experience. I configured weROI to send from growth@weroi.net with the display name \"weROI\" so every email reinforces the brand.",
        "A branded sender also means the reply address is monitored. If someone replies to a transactional email with a question, someone on the team sees it and can respond. That feedback loop is valuable. It tells you when a template is confusing, when a call to action is unclear, or when a customer has an urgent need. No-reply addresses cut off that signal entirely.",
      ],
    },
    {
      heading: "Building transactional email templates that survive inbox rendering",
      paragraphs: [
        "Email clients render HTML differently. Gmail strips certain CSS properties, Outlook ignores others, and Apple Mail has its own quirks. A transactional email template needs to be simple enough to render correctly everywhere while still looking intentional and branded.",
        "I use a single column layout with inline styles. The email has four parts: a branded header (logo or text wordmark), the body content explaining what happened and what the recipient should do next, a single clear call to action button, and a footer with contact information and an unsubscribe mention. The template receives validated data from the application and inserts it safely. User input is escaped to prevent HTML injection.",
      ],
      code: {
        label: "Resend email sending with template",
        language: "python",
        code: `import resend
from html import escape

resend.api_key = os.environ["RESEND_API_KEY"]


def build_lead_notification_html(lead: LeadDocument) -> str:
    return f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; font-size: 20px;">New Lead from {escape(lead.source)}</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #666;">Name</td>
                <td style="padding: 8px 0;">{escape(lead.name)}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Email</td>
                <td style="padding: 8px 0;">{escape(lead.email)}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Service</td>
                <td style="padding: 8px 0;">{escape(lead.service)}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Message</td>
                <td style="padding: 8px 0;">{escape(lead.message)}</td>
            </tr>
        </table>
        <a href="https://weroi.net/admin/leads"
           style="display: inline-block; margin-top: 16px; padding: 10px 24px;
                  background: #1a1a1a; color: #fff; text-decoration: none;
                  border-radius: 4px;">
            View in Dashboard
        </a>
    </div>
    """


async def send_lead_notification(lead: LeadDocument) -> dict:
    html = build_lead_notification_html(lead)
    result = resend.Emails.send({
        "from": "weROI <growth@weroi.net>",
        "to": ["team@weroi.net"],
        "subject": f"New lead: {lead.name} ({lead.service})",
        "html": html,
    })
    return result`,
      },
    },
    {
      heading: "Delivery logging that surfaces failures without exposing secrets",
      paragraphs: [
        "Every email send should produce a log entry. The log needs to contain enough information to diagnose failures (recipient address, subject, Resend message ID, timestamp, HTTP status) without containing sensitive data (API keys, full email bodies, personal details beyond what is necessary).",
        "I log at two levels. On success, I record the Resend message ID, recipient, subject line, and timestamp. On failure, I record the error type, status code, a sanitized error message, and the same metadata. This lets the team search logs by message ID, recipient, or time range to answer the question \"did this email actually go out?\"",
        "Critically, a failed email send should never prevent a successful lead from being saved. The lead submission and the email notification are separate operations. If the email fails, the lead still exists in the database, the admin can see it in the dashboard, and the log shows the delivery failure. The team can then manually follow up or the system can retry.",
      ],
      code: {
        label: "Email delivery logging with error isolation",
        language: "python",
        code: `import logging
from datetime import datetime, timezone

logger = logging.getLogger("email")


async def send_and_log(lead: LeadDocument) -> None:
    try:
        result = await send_lead_notification(lead)
        logger.info(
            "Email sent",
            extra={
                "resend_id": result.get("id"),
                "to": "team@weroi.net",
                "subject": f"New lead: {lead.name}",
                "sent_at": datetime.now(timezone.utc).isoformat(),
            },
        )
    except Exception as e:
        logger.error(
            "Email delivery failed",
            extra={
                "error_type": type(e).__name__,
                "error_message": str(e)[:200],
                "to": "team@weroi.net",
                "lead_email": lead.email,
                "attempted_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        # Do not re-raise. The lead is already saved.`,
      },
    },
    {
      heading: "Handling Resend API errors and timeouts in FastAPI",
      paragraphs: [
        "The Resend API can return errors for several reasons: invalid API key, unverified domain, rate limit exceeded, payload too large, or a server side issue. Each of these needs a different response from the application.",
        "I wrap the Resend call in a try/except that catches HTTP errors and timeouts separately. Rate limit errors (429) are retried once after a short delay. Authentication errors (401, 403) are logged as critical because they indicate a configuration problem. Server errors (5xx) are logged and the send is marked for retry. Timeouts are treated like server errors.",
        "For weROI, I kept the retry logic simple: one immediate retry for transient failures, no retry for permanent failures, and a structured log entry either way. For a higher volume system, I would move email sending to a background task queue with configurable retry policies, but for the current scale the inline approach with a single retry is sufficient and much simpler to operate.",
      ],
    },
    {
      heading: "Testing email integration without sending real emails",
      paragraphs: [
        "During development, I do not want to send real emails every time I test the lead submission flow. Resend provides a test mode that accepts API calls without delivering messages, which is useful for verifying the integration without spamming inboxes. I also have a development flag that routes email sends to a mock function that logs the payload and returns a success response.",
        "The important thing to test is not whether Resend can send an email (that is their job). It is whether your application builds the correct payload, handles errors gracefully, and logs the right information. My tests verify that the template renders with escaped user input, that a send failure does not prevent lead creation, and that the log entry contains the expected fields.",
      ],
      bullets: [
        "Use Resend's test mode or a mock function during development.",
        "Test that user input is HTML escaped in the template.",
        "Verify that a send failure does not prevent the primary database operation.",
        "Check that log entries contain the message ID on success and the error details on failure.",
        "Send a real test email to multiple clients (Gmail, Outlook, Apple Mail) before launch.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I set up Resend with a custom domain?",
      answer:
        "Add your domain in the Resend dashboard. Resend generates SPF TXT and DKIM CNAME records. Add those records to your domain's DNS configuration (through your registrar or DNS provider). Wait for Resend to verify the records, which usually takes a few minutes to a few hours. Once verified, you can send from any address at that domain.",
    },
    {
      question: "What is the difference between SPF, DKIM, and DMARC?",
      answer:
        "SPF tells receiving servers which IP addresses are authorized to send email from your domain. DKIM adds a cryptographic signature proving the email was not altered in transit. DMARC tells receiving servers what to do when SPF or DKIM checks fail (nothing, quarantine, or reject). Together, they authenticate your email and protect against spoofing. All three are recommended for transactional email.",
    },
    {
      question: "How do I prevent transactional emails from landing in spam?",
      answer:
        "Set up SPF, DKIM, and DMARC on your sending domain. Use a branded sender address with a monitored reply address. Keep your email content clean and relevant with a single clear purpose. Avoid spam trigger words in subject lines. Include a plain text version alongside HTML. Start with a small volume and warm up the domain gradually if sending at scale.",
    },
    {
      question: "Should I use Resend or SendGrid for transactional email?",
      answer:
        "Resend has a simpler API and developer experience, which made it the right choice for weROI's scale. SendGrid offers more advanced features like marketing campaigns, suppression management, and higher volume pricing tiers. If you are sending transactional emails from a small to medium application and want the simplest integration, Resend is excellent. If you need marketing email features or send millions per month, evaluate SendGrid.",
    },
  ],
  takeaway:
    "Resend transactional email works well when you invest in the foundation: domain authentication with SPF and DKIM, branded sender addresses, simple templates that render everywhere, delivery logging that surfaces failures, and error handling that never blocks the primary user action. The API call is five lines. The trust infrastructure around it is what makes email actually arrive.",
  relatedLink: {
    label: "See the email integration in weROI",
    href: "/projects/weroi",
  },
});
