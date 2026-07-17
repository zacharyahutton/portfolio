import { withReadingMeta } from "../types";

export const coreWebVitalsGuidePost = withReadingMeta({
  id: "core-web-vitals-guide",
  title: "Core Web Vitals guide: improve LCP, INP, and CLS",
  blurb:
    "Improve Core Web Vitals with a practical guide to LCP, INP, and CLS, real user measurement, image and JavaScript fixes, and a repeatable workflow today.",
  tag: "Performance",
  date: "July 2026",
  publishedAt: "2026-07-12",
  href: "/blog/core-web-vitals-guide",
  image: "/blog/core-web-vitals-guide.png",
  primaryKeyword: "Core Web Vitals guide",
  secondaryKeywords: [
    "improve Largest Contentful Paint",
    "Interaction to Next Paint optimization",
    "fix Cumulative Layout Shift",
    "Next.js web performance",
  ],
  intro: [
    "Core Web Vitals turn three parts of user experience into measurable signals: how quickly the main content appears, how promptly the page responds to interaction, and how visually stable the layout remains. The current metrics are Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.",
    "I use these metrics as diagnostic tools, not as a score chasing game. A fast lab result does not help if real users on Jamaican mobile networks still wait for the hero image. A green homepage does not excuse a slow project detail route. This guide explains what each metric measures, how to find the responsible element or task, and which fixes usually produce real improvements.",
  ],
  sections: [
    {
      heading: "Understand field data before changing code",
      paragraphs: [
        "Field data comes from real visits across devices, networks, locations, and page states. Lab data comes from a controlled test such as Lighthouse. Field data tells you whether users have a problem. Lab tools help reproduce and diagnose that problem. Use both, but do not treat one simulated run as the complete truth.",
        "Core Web Vitals are evaluated near the seventy fifth percentile, which means the experience should be good for most visits, not only a fast developer laptop. Segment results by route, device class, connection, and release. An average can hide a severe mobile problem or a single template that affects thousands of pages.",
      ],
      bullets: [
        "Use Search Console and Chrome user data for broad field trends.",
        "Collect route level vitals in your own analytics when possible.",
        "Use Lighthouse and browser performance tools for diagnosis.",
        "Compare the same route and test conditions before and after a change.",
      ],
    },
    {
      heading: "Largest Contentful Paint measures the main loading moment",
      paragraphs: [
        "LCP reports when the largest visible content element in the initial viewport finishes rendering. It is often a hero image, large heading, poster, or background image. A good target is 2.5 seconds or less for at least seventy five percent of visits. To improve it, first identify the actual LCP element in the performance trace.",
        "LCP time includes server response, resource discovery, download, and rendering delay. Optimizing image compression alone will not fix an image discovered late through client JavaScript. A fast CDN will not fix a hero hidden behind a loading state. Break the timing into phases and address the largest one.",
      ],
      subheadings: [
        {
          heading: "Common LCP fixes",
          paragraphs: [
            "The best fix depends on the trace, but the recurring goal is to make the main element discoverable and ready early. Server render important content, avoid lazy loading the LCP image, preload only truly critical resources, and reduce render blocking work.",
          ],
          bullets: [
            "Use a properly sized modern image format.",
            "Give the LCP image high priority and an accurate sizes value.",
            "Render hero text and image references in initial HTML.",
            "Improve server response with caching and nearby hosting.",
            "Load critical fonts efficiently and use a sensible fallback.",
          ],
        },
      ],
      code: {
        label: "A prioritized responsive Next.js image",
        language: "tsx",
        code: `<Image
  src="/projects/portfolio-cover.png"
  alt="Portfolio project interface"
  fill
  priority
  sizes="(max-width: 768px) 100vw, 70vw"
  className="object-cover"
/>`,
      },
    },
    {
      heading: "Interaction to Next Paint measures responsiveness",
      paragraphs: [
        "INP observes click, tap, and keyboard interactions across the page visit, then reports a representative slow interaction. It includes input delay, event handler work, and the time until the browser presents the next frame. A good target is 200 milliseconds or less. A page can load quickly and still have poor INP if large JavaScript tasks block the main thread.",
        "Start with the slow interaction in a performance trace. Look for long tasks, repeated renders, synchronous storage access, large array transformations, and third party scripts. The goal is not merely to make the handler function short. The browser also needs time to recalculate style, lay out elements, paint, and present feedback.",
      ],
      subheadings: [
        {
          heading: "Ways to improve INP",
          paragraphs: [
            "Give immediate visual feedback, keep urgent state updates small, and move expensive work away from the interaction path. Break long tasks so the browser can paint between them. Reduce client JavaScript at the architecture level before applying small memoization everywhere.",
          ],
          bullets: [
            "Remove unnecessary client components and third party scripts.",
            "Virtualize or paginate very large lists.",
            "Defer nonurgent updates with React transitions when appropriate.",
            "Move heavy calculations to a worker or the server.",
            "Avoid forced layout by mixing repeated reads and writes.",
          ],
        },
      ],
    },
    {
      heading: "Cumulative Layout Shift measures visual stability",
      paragraphs: [
        "CLS measures unexpected movement while a page is visible. A good score is 0.1 or less. Images without reserved dimensions, ads that appear above content, late font swaps, banners inserted at the top, and animations that change layout properties are common causes. Movement caused immediately by a user's action is usually treated differently from unexpected shifting.",
        "Reserve space before content arrives. Images need width and height or an aspect ratio. Embedded media needs a stable container. Skeletons should match the final dimensions. Cookie notices and alerts should overlay content or occupy reserved space instead of pushing the entire page after load.",
      ],
      code: {
        label: "Reserving media space",
        language: "css",
        code: `.project-cover {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #17171d;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.animated-item {
  /* transforms do not trigger document layout */
  transform: translateY(0);
}`,
      },
    },
    {
      heading: "JavaScript budget is an architecture decision",
      paragraphs: [
        "Large bundles affect loading and responsiveness through download, parsing, compilation, execution, and memory. Tree shaking cannot rescue an application that marks broad layouts as client code or loads an animation library for content that could be CSS. Review what runs in the browser and why.",
        "Code splitting helps when it follows user journeys. A heavy editor can load when a user opens edit mode. An analytics dashboard can load after authentication. Avoid splitting tiny modules into dozens of requests without evidence. In Next.js, keep content in Server Components and isolate interaction so the client graph stays intentional.",
      ],
      bullets: [
        "Inspect route bundles after adding a large dependency.",
        "Load third party widgets after core content when possible.",
        "Prefer platform APIs for simple interactions.",
        "Do not ship data processing code that can run on the server.",
        "Test on a slower phone, not only desktop development hardware.",
      ],
    },
    {
      heading: "Fonts can affect all three metrics",
      paragraphs: [
        "A font request can delay text that becomes the LCP element, consume main thread work, and shift lines when the final face replaces a fallback. Use a small number of families and weights, subset characters where appropriate, host reliably, and preload only the face needed above the fold.",
        "Choose a fallback with similar metrics and use font-display based on the experience you want. Framework font tooling can self host and reserve metrics, but it cannot make ten font weights free. Typography is part of the design system and the performance budget, so choose expressive faces deliberately rather than loading every available style.",
      ],
    },
    {
      heading: "Build a repeatable performance workflow",
      paragraphs: [
        "Measure a representative set of routes, not only the homepage. Record field baselines, identify the failing metric and element, reproduce it in a trace, make one focused change, and compare under the same conditions. Add performance checks to review for templates that affect many pages.",
        "After deployment, watch field data because lab improvements do not always transfer to users. A priority image may improve desktop and waste bandwidth on small screens. A delayed script may improve LCP while breaking analytics. Performance work is complete when real user experience improves without sacrificing correctness or accessibility.",
      ],
    },
    {
      heading: "Avoid optimizations that hurt the product",
      paragraphs: [
        "Do not remove useful images, feedback, or accessibility features solely to reach a perfect score. Optimize how they are delivered. Do not preload every resource, since excessive priority makes critical resources compete. Do not lazy load visible content. Do not hide layout shifts by making the page blank until everything is ready.",
        "Core Web Vitals are important, including for search, but relevance and content quality remain essential. Treat the metrics as user centered constraints. The strongest optimization makes the page faster and clearer while preserving the reason someone visited.",
        "Set a performance budget that the team can review before a regression ships. Track image weight, route JavaScript, font files, and key field percentiles. Budgets turn performance from an occasional cleanup into a normal product constraint.",
      ],
    },
  ],
  faqs: [
    {
      question: "What are the three Core Web Vitals?",
      answer:
        "They are Largest Contentful Paint for loading, Interaction to Next Paint for responsiveness, and Cumulative Layout Shift for visual stability.",
    },
    {
      question: "What is a good Core Web Vitals score?",
      answer:
        "Aim for LCP at 2.5 seconds or less, INP at 200 milliseconds or less, and CLS at 0.1 or less at the seventy fifth percentile of real visits.",
    },
    {
      question: "Do Core Web Vitals affect Google rankings?",
      answer:
        "They are part of Google's page experience signals, but they do not replace relevance, helpful content, links, or technical crawlability. Improve them for users first and treat search benefit as one outcome.",
    },
    {
      question: "Why are Lighthouse and Search Console scores different?",
      answer:
        "Lighthouse is a lab test under simulated conditions. Search Console uses aggregated real user field data over time. Differences in devices, networks, routes, geography, and time windows can produce different results.",
    },
  ],
  takeaway:
    "A useful Core Web Vitals guide begins with field evidence. Diagnose the real LCP element, slow interaction, or layout shift, fix the largest cause, verify under consistent conditions, and confirm the improvement with real users after deployment.",
});
