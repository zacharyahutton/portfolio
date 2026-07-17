import { withReadingMeta } from "../types";

export const securityFundamentalsPost = withReadingMeta({
  id: "security-fundamentals",
  title: "My OWASP PortSwigger learning path: turning labs into shipping habits",
  blurb:
    "How I turned the OWASP PortSwigger learning path into daily secure coding habits: trust boundaries, ownership checks, validation, and real abuse cases.",
  tag: "Dev note",
  date: "May 2025",
  publishedAt: "2025-05-28",
  href: "/blog/security-fundamentals",
  image: "/blog/security-fundamentals.png",
  primaryKeyword: "OWASP PortSwigger learning path",
  intro: [
    "Security content online falls into two traps. Either it is a list of vulnerability names that sounds alarming but never connects to the code you actually write, or it is a penetration testing tutorial that assumes you want to break things for a living. I wanted something in between: a structured OWASP PortSwigger learning path that teaches me to recognize vulnerabilities while I am building APIs, forms, and admin panels.",
    "I have been working through PortSwigger's Web Security Academy alongside my university coursework and real projects like the Tendem Demo Bot and weROI. This post covers how I organize the learning, the habits it has changed, and the specific patterns I now apply to every backend I ship.",
  ],
  sections: [
    {
      heading: "Why developers should study web security fundamentals",
      paragraphs: [
        "The OWASP Top 10 exists because the same vulnerabilities keep appearing in production software built by experienced teams. Broken access control, injection, and security misconfiguration are not exotic attacks. They are common mistakes that happen when developers trust inputs they should validate, skip authorization on an endpoint, or leave default credentials in place.",
        "Studying security as a developer is not about becoming a penetration tester. It is about building the instinct to ask \"what happens if this value is not what I expect\" at the moment you write the code, instead of after someone exploits it. PortSwigger gives you a structured environment to develop that instinct through real, hands on labs.",
      ],
    },
    {
      heading: "How I structure my PortSwigger lab sessions",
      paragraphs: [
        "I work through one topic at a time: access control, then SQL injection, then authentication, then XSS. Within each topic, I start with the conceptual explanation, attempt every lab before reading the solution, and then write a short note in my own words. The note records three things: the trust assumption the application made incorrectly, the minimum fix, and one way I can test for the same issue in my own projects.",
        "This note taking habit is the most valuable part of the process. Without it, I was finishing labs and forgetting the lesson within a week. With it, I have a growing checklist that I reference during code review and feature planning. The checklist is not a payload database. It is a set of questions: does this endpoint check ownership? Does this query use parameterized values? Does this redirect validate the destination?",
      ],
      bullets: [
        "Attempt each lab before reading the solution, even if you get stuck.",
        "Write one sentence describing the incorrect trust assumption.",
        "Add a concrete test you can run against your own project.",
        "Revisit the same vulnerability category in a different framework or language.",
      ],
    },
    {
      heading: "Broken access control: the lesson that changed how I write routes",
      paragraphs: [
        "Access control labs had the biggest impact on my daily work. The pattern is always the same: the application checks authentication (who are you?) but skips authorization (are you allowed to do this?). A user changes a URL parameter, a hidden form field, or a JSON body value and accesses data belonging to someone else.",
        "After these labs, I added ownership checks to every protected route in StudySync and weROI. The check is a small function that compares the authenticated user's ID against the resource's owner field. If they do not match, the API returns 403. It takes five lines to implement and prevents the most common web vulnerability in the OWASP Top 10.",
      ],
      code: {
        label: "Ownership check pattern from StudySync",
        language: "python",
        code: `def verify_ownership(resource, current_user: User):
    if resource.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this resource",
        )

# Every protected route calls this before modifying data
@router.delete("/{record_id}")
async def delete_record(
    record_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(StudyRecord).filter(StudyRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404)
    verify_ownership(record.course, user)
    db.delete(record)
    db.commit()`,
      },
    },
    {
      heading: "SQL injection and why parameterized queries are non-negotiable",
      paragraphs: [
        "The SQL injection labs are humbling. You watch a carefully crafted string bypass login, extract database contents, or delete tables entirely. The fix is straightforward: never concatenate user input into a query string. Use parameterized queries or an ORM that handles parameterization for you.",
        "I use SQLAlchemy for most Python projects and Pydantic for input validation before data reaches the ORM. The combination means user input is validated against a schema, typed, and then passed to parameterized queries. Even when I write raw SQL for performance reasons, the values are always parameters, never string concatenations. PortSwigger made this a reflex, not a rule I have to remember.",
      ],
    },
    {
      heading: "Authentication labs and what they taught me about session management",
      paragraphs: [
        "PortSwigger's authentication labs cover brute force, credential stuffing, token predictability, and session fixation. The takeaway is that authentication is not just \"check the password and return a token.\" It is a system with multiple failure modes that need deliberate handling.",
        "After working through these labs, I changed how I handle JWT authentication. I set shorter expiration times, validate every claim (issuer, audience, algorithm, expiration), reject none algorithm tokens, and hash passwords with bcrypt using a sufficient work factor. I also added rate limiting to login endpoints on weROI to slow brute force attempts. None of these are exotic techniques. They are basic hygiene that the labs made visceral.",
      ],
      bullets: [
        "Reject tokens with the none algorithm explicitly.",
        "Hash passwords with bcrypt or argon2, never MD5 or SHA256 alone.",
        "Rate limit login and registration endpoints.",
        "Return generic error messages (\"invalid credentials\") rather than revealing which field was wrong.",
        "Set HttpOnly and Secure flags on session cookies.",
      ],
    },
    {
      heading: "XSS and input handling: thinking about output context",
      paragraphs: [
        "Cross site scripting labs teach you that the vulnerability is not in the input, it is in the output. User supplied data becomes dangerous when it is rendered in an HTML context without escaping, injected into a JavaScript string, or placed in an attribute value. The same input can be safe in one context and dangerous in another.",
        "For my React frontends, JSX handles most HTML escaping automatically. The risk comes from dangerouslySetInnerHTML, from rendering user input in href or src attributes, and from server side templates that do not auto-escape. I now audit every place where user data appears in the rendered output, not just where it enters the system.",
      ],
    },
    {
      heading: "Turning lab results into a project security checklist",
      paragraphs: [
        "I maintain a short checklist that I reference when starting a new feature or reviewing a pull request. It is not a comprehensive security audit. It is a set of practical questions that catch the most common issues early in development, before they become embedded in the architecture.",
      ],
      bullets: [
        "Does every endpoint that reads or writes user data verify ownership?",
        "Are all database queries parameterized?",
        "Does the login endpoint rate limit failed attempts?",
        "Are JWT tokens validated for algorithm, expiration, and issuer?",
        "Is user input escaped in the context where it is rendered?",
        "Do forms validate on the server, not only in the browser?",
        "Are error messages generic enough to avoid leaking internal details?",
        "Is the session invalidated on logout?",
      ],
    },
    {
      heading: "Making security practice sustainable alongside real work",
      paragraphs: [
        "I do not treat security study as a separate activity that competes with shipping. I work through two or three labs per week, spend ten minutes writing notes, and then look for the same pattern in whatever I am building that week. When I was adding admin routes to weROI, I ran through the access control checklist. When I built the Telegram bot's webhook endpoint, I thought about request validation and HMAC verification because of what I had learned in the authentication and SSRF labs.",
        "This integration is what makes the OWASP PortSwigger learning path practical. The labs give you controlled experience with real vulnerabilities. The notes give you a reference for future projects. And the habit of asking \"what could go wrong here\" becomes automatic over time.",
      ],
    },
  ],
  faqs: [
    {
      question: "How long does it take to complete the PortSwigger Web Security Academy?",
      answer:
        "The full academy has hundreds of labs across 30+ topics. At two to three labs per week, expect the core topics (access control, injection, XSS, authentication, SSRF) to take about three months. You do not need to complete everything before benefiting. The first access control lab changed how I write routes. Start with the OWASP Top 10 topics and expand from there.",
    },
    {
      question: "Is PortSwigger Web Security Academy free?",
      answer:
        "Yes. The community edition is completely free and includes all the learning materials and labs. The labs run in PortSwigger's cloud, so you do not need to set up a local environment. The paid Burp Suite Professional adds advanced scanning features, but the free community edition plus the free academy is enough for developer security education.",
    },
    {
      question: "Should developers learn penetration testing or just secure coding?",
      answer:
        "Both, but with different depth. Developers benefit most from understanding how vulnerabilities work (which is what PortSwigger labs teach) so they can prevent them during development. You do not need to become a full time penetration tester. The goal is to recognize insecure patterns in your own code and ask the right questions during design and review.",
    },
    {
      question: "What are the most important OWASP Top 10 items for API developers?",
      answer:
        "Broken Access Control (A01), Injection (A03), and Security Misconfiguration (A05) are the three I encounter most in API work. Broken access control means missing ownership checks on endpoints. Injection means unsanitized input in queries. Misconfiguration means default credentials, verbose error messages, or permissive CORS. Fixing these three covers the majority of real world API vulnerabilities.",
    },
    {
      question: "How do I practise web security without breaking real systems?",
      answer:
        "Use authorized lab environments only. PortSwigger Web Security Academy, OWASP WebGoat, and Damn Vulnerable Web Application (DVWA) are all designed for safe practice. Never test techniques against systems you do not own or have explicit written permission to test. The legal and ethical boundaries are simple: practice only in environments built for practice.",
    },
  ],
  takeaway:
    "The deliberate approach to security is converting each PortSwigger lab into a question you ask during normal development. Ownership checks, parameterized queries, session validation, and output escaping are not advanced techniques. They are basic habits that the OWASP PortSwigger learning path makes instinctive.",
  relatedLink: {
    label: "Explore PortSwigger Web Security Academy",
    href: "https://portswigger.net/web-security",
    external: true,
  },
});
