export type ServiceItem = {
  id: string;
  slug: string;
  number: string;
  title: string;
  outcome: string;
  /** Longer narrative for the detail page */
  story: string;
  bullets: string[];
  navLabel: string;
};

export const services: ServiceItem[] = [
  {
    id: "web-platforms",
    slug: "web-platforms",
    number: "01",
    navLabel: "Web platforms",
    title: "Web platforms & product sites",
    outcome:
      "Ship a fast, responsive site or SPA that looks premium and turns visitors into leads or bookings.",
    story:
      "You need more than a brochure. You need a product surface that loads fast, reads clearly on a phone in Portmore traffic, and still feels intentional on a desktop monitor. I build Next.js and React platforms with real information architecture: routes that make sense, images that don't choke the wire, and CTAs that actually convert. Vercel deploys, typed content, and a design system you can extend without starting over.",
    bullets: [
      "Next.js / React frontends with clear information architecture",
      "Mobile first layouts and accessibility minded navigation",
      "Vercel deploys with performance conscious images and routing",
    ],
  },
  {
    id: "landing-pages",
    slug: "landing-pages",
    number: "02",
    navLabel: "Landing pages",
    title: "Landing pages & marketing sites",
    outcome:
      "Focused one-pagers and marketing surfaces that capture leads without a bloated CMS.",
    story:
      "One job. One page. One path to the inbox. I design hero-led marketing surfaces that capture attention without drowning the visitor in chrome: clear CTAs, lead funnels, multi step forms, and Resend notifications when someone actually cares enough to write. Brand aligned type and restrained motion, built so you can update copy without praying to a page builder.",
    bullets: [
      "Hero led compositions with clear CTAs and contact paths",
      "Lead funnels, multi step forms, and email notifications (Resend)",
      "Brand aligned typography and motion that stay maintainable",
    ],
  },
  {
    id: "client-sites",
    slug: "client-sites",
    number: "03",
    navLabel: "Client sites",
    title: "Client & ministry sites",
    outcome:
      "Production sites for businesses and congregations, events, giving, and content that stay editable in code.",
    story:
      "Congregations and small businesses don't need a fragile drag and drop stack. They need something that survives Sunday traffic and a volunteer updating the calendar. I've shipped ministry platforms with events, giving, and prayer flows in version controlled React. Custom domains, hosting, and handoff that non-developers can actually live with.",
    bullets: [
      "Component driven React sites (version controlled, not drag and drop fragile)",
      "Event listings, contact flows, and mobile first congregation UX",
      "Custom domains, hosting, and handoff that clients can actually use",
    ],
  },
  {
    id: "apis",
    slug: "apis",
    number: "04",
    navLabel: "API development",
    title: "API development & integrations",
    outcome:
      "Typed REST APIs with auth, validation, and docs so frontends and bots can plug in cleanly.",
    story:
      "Frontends and bots only feel smart when the API underneath is boringly reliable. I write FastAPI and Express services with schema validation, JWT auth, OpenAPI docs, and environment based secrets, the kind of glue that lets a React SPA, a Telegram webhook, and a health check all talk to the same contract without surprises.",
    bullets: [
      "FastAPI / Express with Pydantic or schema validation",
      "JWT auth, OpenAPI docs, and environment based secrets",
      "Webhooks, health checks, and Railway / Vercel ready deploys",
    ],
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    number: "05",
    navLabel: "E-commerce backends",
    title: "E-commerce backends",
    outcome:
      "Catalog, cart, inventory, and checkout APIs with stock guards and order webhooks.",
    story:
      "Carts lie. Stock races. Orders disappear into the void without webhooks. I've built e-commerce backends with MongoDB catalogs, atomic stock reservation, and outbound status hooks, the boring, critical bits that keep a phone store API from selling the same unit twice.",
    bullets: [
      "MongoDB product catalogs, carts, and order flows",
      "Atomic stock reservation and conflict aware checkout",
      "Outbound webhooks for order status (Stripe style patterns)",
    ],
  },
  {
    id: "bots",
    slug: "bots",
    number: "06",
    navLabel: "Bots & automation",
    title: "Telegram bots & LLM chat",
    outcome:
      "Automate booking, FAQ, and support on Telegram with reliable webhooks and fallbacks.",
    story:
      "People already live in messaging apps. Meet them there. I ship Telegram bots with multi step booking flows, FAQ coverage, Groq/OpenAI chat, and FAQ fallbacks when the model blinks. FastAPI webhook servers on Railway, rate limits per user, admin stats, secret token validation. Live demo: the Tendem bot that's actually online.",
    bullets: [
      "Multi-step conversation flows, rate limiting, and admin stats",
      "Groq / OpenAI chat with FAQ fallbacks when models fail",
      "FastAPI webhook servers on Railway with secret token validation",
    ],
  },
  {
    id: "fullstack",
    slug: "fullstack",
    number: "07",
    navLabel: "Full stack apps",
    title: "Full stack apps & admin tools",
    outcome:
      "Connect UI to real APIs, auth, and data so your team can operate, not just demo.",
    story:
      "A pretty SPA without an admin panel is a brochure with ambitions. I connect React frontends to FastAPI/Node backends with JWT sessions, MongoDB or SQLite models, lead funnels, and dashboards your team can operate. Split deploys: Vercel up front, Railway in the back, with CORS and health checks that don't leave you guessing at 2 a.m.",
    bullets: [
      "React SPAs + FastAPI / Node backends with JWT admin sessions",
      "MongoDB / SQLite models, dashboards, and lead funnels",
      "Split deploys (Vercel frontend + Railway API) with CORS and health checks",
    ],
  },
  {
    id: "security",
    slug: "security",
    number: "08",
    navLabel: "Security aware build",
    title: "Security aware engineering",
    outcome:
      "Build with OWASP minded habits: safer auth, signed webhooks, and cleaner failure modes.",
    story:
      "Security isn't a sticker you slap on after launch. I work through OWASP and PortSwigger labs on purpose, then bring those habits into shipping code: HMAC signed webhooks, input validation, auth that doesn't leak secrets to the client, and failure modes you can actually debug. Safer defaults, not fear theater.",
    bullets: [
      "HMAC signed webhooks, API keys, and input validation",
      "Auth patterns (JWT / session) without leaking secrets to the client",
      "Practical labs background (OWASP / PortSwigger) applied to shipping code",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
