import { withReadingMeta } from "../types";

export const restApiDesignBestPracticesPost = withReadingMeta({
  id: "rest-api-design-best-practices",
  title: "REST API design best practices for predictable production APIs",
  blurb:
    "Build predictable REST APIs with clear resources, HTTP methods, status codes, validation, pagination, errors, security, versioning, and practical examples.",
  tag: "Backend",
  date: "July 2026",
  publishedAt: "2026-07-14",
  href: "/blog/rest-api-design-best-practices",
  image: "/blog/rest-api-design-best-practices.png",
  primaryKeyword: "REST API design best practices",
  secondaryKeywords: [
    "REST API naming conventions",
    "HTTP status codes API",
    "REST API error response",
    "API pagination best practices",
  ],
  intro: [
    "A good REST API feels unsurprising. A frontend developer can guess how to list resources, retrieve one record, create it, update it, and delete it. Errors have one shape. Pagination behaves consistently. Authentication does not change from route to route. That predictability matters more than designing the most theoretically pure interface.",
    "I have built APIs with FastAPI, Express, MongoDB, and SQL databases. The failures that cost the most time were rarely complicated algorithms. They were inconsistent field names, vague errors, missing ownership checks, unbounded list endpoints, and undocumented assumptions. These REST API design best practices focus on preventing that daily friction.",
  ],
  sections: [
    {
      heading: "Design resources before designing endpoints",
      paragraphs: [
        "REST begins with resources, the nouns in your domain. Projects, users, invoices, messages, and bookings are resources. URLs should identify them, while HTTP methods describe the operation. Prefer /projects and /projects/{projectId} over routes such as /getProjects or /createNewProject. The second style repeats the method in the URL and becomes inconsistent quickly.",
        "Use plural resource names and stable identifiers. Nest a route when the relationship provides necessary scope, such as /projects/{projectId}/comments. Avoid deep nesting that forces clients to know an entire hierarchy just to retrieve one record. If a comment has a globally unique ID, /comments/{commentId} may be the clearer detail route.",
      ],
      bullets: [
        "Use nouns for resources and HTTP methods for actions.",
        "Keep naming consistent across every endpoint.",
        "Use identifiers that do not expose sensitive sequential information when risk matters.",
        "Limit nesting to relationships that clarify scope or authorization.",
      ],
    },
    {
      heading: "Use HTTP methods and status codes intentionally",
      paragraphs: [
        "GET reads without changing state. POST creates a resource or starts a nonidempotent operation. PUT replaces a resource, while PATCH changes selected fields. DELETE removes it. Clients, caches, logs, and monitoring tools understand these semantics, so matching them improves more than aesthetics.",
        "Status codes should distinguish outcomes that clients handle differently. Return 201 after creation, 204 when a successful operation has no body, 400 for a malformed request, 401 when authentication is missing or invalid, 403 when identity is known but permission is missing, 404 when a resource is unavailable, 409 for a state conflict, and 422 for valid JSON that fails domain validation.",
      ],
      code: {
        label: "A predictable FastAPI create route",
        language: "python",
        code: `@router.post(
    "/projects",
    response_model=ProjectOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    payload: ProjectCreate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    project = Project(owner_id=user.id, **payload.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project`,
      },
    },
    {
      heading: "Validate at the boundary and protect invariants",
      paragraphs: [
        "Every request is untrusted, even if it comes from your own frontend. Validate types, formats, lengths, allowed values, and required combinations at the API boundary. Then enforce business invariants in the service layer. Schema validation can prove that startDate is a date, while domain logic must prove that it comes before endDate and that the user is allowed to book that period.",
        "Do not rely on client validation. Browser checks improve experience, but anyone can call the API directly. Database constraints form the final layer for uniqueness, references, and required values. A robust system validates in the interface for guidance, in the API for trust, and in the database for integrity.",
      ],
    },
    {
      heading: "Return one useful error format",
      paragraphs: [
        "Clients should not parse a different error shape for every endpoint. Define a standard envelope with a stable machine code, a safe message, a request ID, and optional field details. The code drives application behavior, while the message can be shown or translated. The request ID connects a user report to server logs without exposing a stack trace.",
        "Keep internal details out of public responses. SQL errors, file paths, environment values, and exception traces help attackers and confuse users. Log detailed context on the server with the request ID, then return a concise response. A production API can be transparent about what the client should fix without revealing implementation details.",
      ],
      code: {
        label: "A standard validation error",
        language: "json",
        code: `{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more fields need attention.",
    "requestId": "req_01J...",
    "fields": [
      {
        "field": "email",
        "message": "Enter a valid email address."
      }
    ]
  }
}`,
      },
    },
    {
      heading: "Build pagination, filtering, and sorting for growth",
      paragraphs: [
        "Never let a list endpoint return an unbounded table. It may work with twenty records and fail after a marketing campaign creates twenty thousand. Choose a default page size and a maximum. Cursor pagination works well for feeds and frequently changing data because it does not shift when earlier rows are inserted. Offset pagination is simpler for small administrative tables that need page numbers.",
        "Filtering and sorting parameters should be documented and allowlisted. Do not pass arbitrary client field names into database queries. Define supported filters, validate sort directions, and use indexes for common combinations. Return pagination metadata consistently so clients know whether another page exists.",
      ],
      code: {
        label: "A cursor based response shape",
        language: "json",
        code: `{
  "items": [
    { "id": "p_123", "title": "Portfolio" }
  ],
  "page": {
    "nextCursor": "eyJpZCI6InBfMTIzIn0",
    "hasMore": true,
    "limit": 20
  }
}`,
      },
    },
    {
      heading: "Make retries safe with idempotency",
      paragraphs: [
        "Networks fail after a server completes work but before the client receives the response. If the client retries a payment or booking POST, it may create a duplicate. For operations where duplication is costly, accept an idempotency key. Store the key with the first result and return that result when the same request is repeated.",
        "PUT and DELETE should normally be idempotent by their semantics. Repeating the same request leads to the same resource state. PATCH can be idempotent when it sets values, but an operation such as incrementing a counter may not be. Document retry behavior and test it under timeouts, not only successful local requests.",
      ],
    },
    {
      heading: "Treat authentication and authorization as separate checks",
      paragraphs: [
        "Authentication establishes who made the request. Authorization decides what that identity can do. A valid token is not permission to access any resource ID in a URL. Every endpoint that reads or changes private data must verify ownership, organization membership, or a specific capability on the server.",
        "Use short lived credentials, validate issuer and audience, rate limit sensitive routes, and apply CORS as a browser policy rather than treating it as access control. CORS does not stop scripts, mobile clients, or direct HTTP requests. Real protection lives in authentication, authorization, validation, and careful secret management.",
      ],
      bullets: [
        "Verify ownership after loading the target resource.",
        "Use 401 for invalid identity and 403 for insufficient permission.",
        "Apply least privilege to service accounts and database roles.",
        "Record security relevant actions in an audit log.",
        "Never place privileged API secrets in frontend code.",
      ],
    },
    {
      heading: "Version contracts and document real behavior",
      paragraphs: [
        "Version when you need to introduce a breaking contract, not for every field addition. Adding an optional response field is usually compatible. Renaming a field, changing its meaning, or removing a status requires a migration plan. URL versions such as /v1 are explicit, while header versions keep URLs clean but can be harder to inspect. Consistency matters more than the choice.",
        "Generate an OpenAPI specification from code where possible, but review it as a product. Include examples, error responses, auth requirements, pagination rules, and deprecation notices. Contract tests should verify that implementation and documentation agree. A beautiful documentation page is not useful if production returns a different shape.",
      ],
    },
    {
      heading: "A review checklist before an API ships",
      paragraphs: [
        "I review a new endpoint from the caller's perspective and the attacker's perspective. The caller needs predictable naming, success data, and actionable errors. The attacker looks for identifiers they can change, fields they can overpost, expensive queries they can repeat, and details leaked through failures.",
        "I then test duplicate requests, empty results, maximum field lengths, invalid tokens, valid users without ownership, database timeouts, and concurrent updates. Happy path tests prove that a feature exists. Edge and abuse tests prove that the API can survive production.",
        "Finally, I call the endpoint from a real client rather than only the documentation console. That catches browser concerns, serialization differences, stale generated types, and error handling assumptions. A contract is successful when an independent client can use it without private knowledge of the implementation.",
      ],
    },
  ],
  faqs: [
    {
      question: "What makes a REST API well designed?",
      answer:
        "A well designed REST API is predictable, consistent, secure, documented, and bounded. Resource names, methods, status codes, errors, pagination, and authentication behave the same way across endpoints.",
    },
    {
      question: "Should REST API URLs use verbs?",
      answer:
        "Usually no. Use resource nouns in URLs and HTTP methods for common operations. A domain action that does not map cleanly to CRUD can be modeled as a subresource, such as POST /invoices/{id}/refunds.",
    },
    {
      question: "What is the best pagination method for a REST API?",
      answer:
        "Cursor pagination is usually best for large or frequently changing feeds. Offset pagination is easier when users need numbered pages and the dataset changes slowly. Both need enforced limits and stable sorting.",
    },
    {
      question: "When should I version a REST API?",
      answer:
        "Introduce a new version when clients cannot adopt a contract change without modifying their code. Prefer compatible additions when possible, announce deprecations, measure old version usage, and provide a migration window.",
    },
  ],
  takeaway:
    "REST API design best practices are mostly consistency plus defensive engineering. Model clear resources, use HTTP semantics, validate every boundary, standardize errors, bound collections, verify authorization, and test retries and failures before users discover them.",
});
