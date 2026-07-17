import { withReadingMeta } from "../types";

export const debuggingProductionBugsPost = withReadingMeta({
  id: "debugging-production-bugs",
  title: "How to debug production bugs without guessing",
  blurb:
    "Learn a calm production debugging process using evidence, logs, traces, reproduction, safe mitigation, root cause analysis, and fixes that prevent repeats.",
  tag: "Engineering",
  date: "July 2026",
  publishedAt: "2026-07-13",
  href: "/blog/debugging-production-bugs",
  image: "/blog/debugging-production-bugs.png",
  primaryKeyword: "how to debug production bugs",
  secondaryKeywords: [
    "production debugging process",
    "root cause analysis software",
    "debugging with logs",
    "incident response for developers",
  ],
  intro: [
    "Production bugs create urgency, and urgency encourages guessing. A report arrives that checkout is broken, a dashboard is blank, or an API is slow. The tempting response is to change the first suspicious line and deploy. That can hide evidence, create a second failure, and make the original problem harder to understand.",
    "My production debugging process is evidence first. I define the impact, preserve the current state, find a failing request, compare it with a successful one, form one testable hypothesis, and choose the safest mitigation. The process works whether the system is a Next.js site on Vercel, a FastAPI service on Railway, or a small bot with SQLite.",
  ],
  sections: [
    {
      heading: "Start with impact, not the suspected cause",
      paragraphs: [
        "Before opening code, write down what is broken, who is affected, when it started, and whether it is still happening. Separate facts from reports. \"Users cannot sign in\" is too broad. \"Password sign in returns 500 for accounts created after 14:05 UTC, while existing sessions still work\" is a useful incident statement.",
        "Impact determines priority and response. A typo can wait for the normal release. Data corruption, unauthorized access, failed payments, or a total outage needs immediate containment. Also identify what remains healthy. A working region, browser, account type, or old deployment provides a comparison that can narrow the search quickly.",
      ],
      bullets: [
        "Record the first known failure time and current time window.",
        "Estimate affected users, routes, regions, and data.",
        "Identify the last known successful request.",
        "Note recent deployments, migrations, flags, and provider incidents.",
        "Choose one person to coordinate changes during a serious incident.",
      ],
    },
    {
      heading: "Preserve evidence before changing the system",
      paragraphs: [
        "Capture request IDs, timestamps, error messages, deployment IDs, relevant logs, screenshots, and the exact user path. Logs rotate and ephemeral instances disappear. If you redeploy first, you may erase the state that explains the failure. Never copy tokens, passwords, or personal data into a public issue while collecting evidence.",
        "For data bugs, take a safe snapshot or record affected row identifiers before running repair scripts. For frontend bugs, save the network response and console stack trace. For performance incidents, capture latency percentiles and traces rather than relying on how slow one page felt. Evidence should let another developer inspect the same event.",
      ],
    },
    {
      heading: "Correlate logs around one failing request",
      paragraphs: [
        "A wall of console output is not observability. Structured logs should include a timestamp, severity, service, environment, request ID, route, status, duration, and safe domain context. The request ID is the thread connecting a browser report, gateway log, API handler, database query, and external provider call.",
        "Start with one confirmed failure and move outward in time. Read the first unexpected event, not only the final stack trace. A database timeout may be the visible exception, while the earlier clue is a query returning ten times more rows after a filter changed. Compare the failing trace with a successful request using the same route.",
      ],
      code: {
        label: "A structured application log",
        language: "json",
        code: `{
  "timestamp": "2026-07-17T07:18:42.311Z",
  "level": "error",
  "service": "api",
  "environment": "production",
  "requestId": "req_01JZ...",
  "route": "POST /bookings",
  "status": 500,
  "durationMs": 1843,
  "errorCode": "DATABASE_TIMEOUT",
  "userIdHash": "usr_9f2..."
}`,
      },
    },
    {
      heading: "Reproduce the smallest failing case",
      paragraphs: [
        "Reproduction turns an incident into an experiment. Begin with the exact production inputs after removing sensitive values. Try the same request in a safe environment with matching code, schema, configuration, and feature flags. If it does not fail, list every meaningful difference instead of declaring the bug impossible to reproduce.",
        "Reduce the case one variable at a time. Does it fail for every account or one role? Every record or records with a missing field? Every browser or only cached clients? Remove optional fields, shorten the sequence, and isolate the first action that changes the outcome. The smallest failing case often points directly to the broken assumption.",
      ],
    },
    {
      heading: "Form hypotheses that can be disproved",
      paragraphs: [
        "A useful hypothesis connects evidence to a prediction. \"The deployment is bad\" is vague. \"The new serializer omits null phone numbers, so records without a phone fail the response schema\" predicts that only those records fail and that the logs contain a validation error. You can test both claims quickly.",
        "Write down the hypothesis before changing code, then choose the cheapest discriminating test. Inspect a row, run one query, compare one environment variable name, or replay one request. If the prediction is wrong, discard the hypothesis. Do not keep modifying it until it can explain every result.",
      ],
      bullets: [
        "State what changed or differs.",
        "Predict the exact observable result.",
        "Run one test that could prove the idea wrong.",
        "Record the result so the team does not repeat failed paths.",
        "Change one variable at a time whenever possible.",
      ],
    },
    {
      heading: "Mitigate safely before pursuing the perfect fix",
      paragraphs: [
        "During an active incident, restoring service can be more important than completing root cause analysis. Safe mitigations include disabling a feature flag, rolling back a known deployment, reducing traffic to a failing dependency, switching to a cached response, or temporarily rejecting a narrow invalid input with a clear message.",
        "A rollback is not automatically safe. A code rollback after a destructive database migration can make the old application incompatible with the new schema. Check migration direction, queued jobs, cache formats, and external side effects first. Make the smallest reversible change, monitor the expected metric, and define a point when you will reverse the mitigation if it does not help.",
      ],
    },
    {
      heading: "Fix the cause and add a regression test",
      paragraphs: [
        "Once the system is stable, reproduce the bug in an automated test before applying the permanent fix. The test proves that you understand the failure and protects the exact boundary that broke. A frontend rendering bug may need a component test with missing data. A race condition may need an integration test that runs concurrent updates.",
        "Review adjacent paths that share the same assumption. If one endpoint forgot an ownership check, search for every route loading the same resource. If one parser failed on null, inspect related schemas. This is not permission for a broad refactor during an incident. It is a focused search for the same defect pattern.",
      ],
      code: {
        label: "A regression test for missing optional data",
        language: "typescript",
        code: `it("renders a customer without a phone number", () => {
  render(
    <CustomerSummary
      customer={{
        id: "c1",
        name: "Alicia",
        phone: null,
      }}
    />,
  );

  expect(screen.getByText("Alicia")).toBeVisible();
  expect(screen.getByText("No phone provided")).toBeVisible();
});`,
      },
    },
    {
      heading: "Verify the fix in stages",
      paragraphs: [
        "Passing tests are necessary but not enough. Verify in a preview or staging environment with the production shaped case. Deploy gradually when the platform supports it. Watch error rate, latency, resource use, and the business metric that represented the incident. A lower exception count means little if successful bookings remain at zero.",
        "Keep the incident open through a meaningful observation window. Check old and new clients, retries, background jobs, and caches. Confirm that temporary flags or elevated logging are removed when safe. Verification should demonstrate that the original impact is gone and that the fix did not move it elsewhere.",
      ],
    },
    {
      heading: "Write a blameless root cause analysis",
      paragraphs: [
        "A useful root cause analysis explains the timeline, impact, detection gap, technical cause, contributing conditions, mitigation, fix, and prevention work. It does not stop at \"developer forgot validation.\" Ask why tests, types, review, monitoring, and deployment controls allowed the mistake to reach users.",
        "Action items should change the system. \"Be more careful\" is not measurable. Add the missing contract test, alert on the business failure, validate configuration at startup, document rollback constraints, or add a database index. Assign an owner and completion date. The incident is only fully resolved when the most valuable prevention work is tracked.",
      ],
    },
    {
      heading: "Build observability before the next incident",
      paragraphs: [
        "You cannot add yesterday's missing trace after an outage. Instrument critical user journeys now. Track request errors and latency, but also track outcomes such as completed contact forms, successful logins, and delivered messages. Technical metrics can look healthy while a business workflow silently fails.",
        "Use logs for discrete events, metrics for trends and alerts, and traces for work crossing services. Add release markers so graphs show when code changed. Redact secrets and minimize personal data at collection time. Good observability shortens debugging because it replaces arguments about possibilities with evidence about what actually happened.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the first step when debugging a production bug?",
      answer:
        "Define the impact precisely: what failed, who is affected, when it began, and what still works. Then preserve request IDs, logs, timestamps, and deployment information before changing the system.",
    },
    {
      question: "Should I roll back immediately after a production error?",
      answer:
        "Rollback is appropriate when a known deployment caused serious impact and rollback is compatible with current data and infrastructure. Check migrations, queued jobs, cache formats, and external side effects before acting.",
    },
    {
      question: "How do I debug a bug that only happens in production?",
      answer:
        "Compare production with your safe environment across data shape, configuration, schema, traffic, timing, third party services, browser cache, and feature flags. Use structured logs and traces from one failing request to identify the smallest meaningful difference.",
    },
    {
      question: "What should a root cause analysis include?",
      answer:
        "Include impact, timeline, detection, technical cause, contributing conditions, mitigation, permanent fix, verification, and owned prevention actions. Keep it blameless and focus on system improvements.",
    },
  ],
  takeaway:
    "The fastest reliable way to debug production bugs is disciplined evidence, not rapid guessing. Define impact, preserve the event, trace one failure, test one hypothesis, mitigate reversibly, add a regression test, and improve the system that allowed the defect through.",
});
