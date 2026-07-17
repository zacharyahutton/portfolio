import { withReadingMeta } from "../types";

export const corsExplainedFrontendDevelopersPost = withReadingMeta({
  id: "cors-explained-frontend-developers",
  title: "CORS explained for frontend developers: origins, preflights, and fixes",
  blurb:
    "Understand CORS errors, origins, preflight requests, credentials, safe server configuration, and a practical debugging process for frontend API calls.",
  tag: "Web platform",
  date: "July 2026",
  publishedAt: "2026-07-11",
  href: "/blog/cors-explained-frontend-developers",
  image: "/blog/cors-explained-frontend-developers.png",
  primaryKeyword: "CORS explained for frontend developers",
  secondaryKeywords: [
    "fix CORS error",
    "CORS preflight request",
    "Access Control Allow Origin",
    "CORS credentials cookies",
  ],
  intro: [
    "A CORS error often appears when the API is healthy. You can open its URL in a tab, call it with curl, and see a valid response, but fetch in the browser reports that access was blocked. That difference is the clue: CORS is a browser rule governing whether JavaScript from one origin may read a response from another origin.",
    "The server must participate by returning the correct headers. The frontend cannot grant itself permission, and adding random request headers usually triggers more checks. Once you understand origins, simple requests, preflights, and credentials, CORS stops feeling mysterious. It becomes a short comparison between what the browser asked and what the server allowed.",
  ],
  sections: [
    {
      heading: "The same origin policy comes first",
      paragraphs: [
        "Browsers isolate web origins so a script on one site cannot freely read private data from another site where the user is signed in. An origin is the combination of scheme, host, and port. https://app.example.com and https://api.example.com have different hosts, so they are different origins. http and https also differ, as do localhost ports 3000 and 8000.",
        "The same origin policy is the default protection. Cross Origin Resource Sharing, or CORS, is the controlled exception. A server uses response headers to tell the browser which external origins may read selected responses. The browser enforces that decision for frontend JavaScript.",
      ],
      bullets: [
        "Scheme must match: http and https are different origins.",
        "Host must match: app.example.com and api.example.com differ.",
        "Port must match: localhost:3000 and localhost:8000 differ.",
        "Paths do not define origins: /dashboard and /settings share one origin.",
      ],
    },
    {
      heading: "What happens during a cross origin fetch",
      paragraphs: [
        "When frontend code calls another origin, the browser adds an Origin request header. The server may answer with Access-Control-Allow-Origin containing that exact origin or a wildcard where allowed. If the response does not grant permission, the browser prevents JavaScript from reading it.",
        "The network request may still reach the server and perform work even when the browser reports a CORS failure. This is why CORS is not authentication or CSRF protection. It controls response visibility in browsers. Your API must still authenticate callers, authorize resources, validate input, and protect state changing cookie requests.",
      ],
      code: {
        label: "A basic request and allowed response",
        language: "http",
        code: `GET /projects HTTP/1.1
Host: api.example.com
Origin: https://app.example.com

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Vary: Origin
Content-Type: application/json`,
      },
    },
    {
      heading: "Why browsers send preflight requests",
      paragraphs: [
        "Some cross origin requests require permission before the real request is sent. The browser sends an OPTIONS preflight containing the intended method and nonstandard headers. JSON POST requests, Authorization headers, and methods such as PATCH or DELETE commonly trigger preflight.",
        "The server must answer OPTIONS without demanding the application request body. It grants allowed origin, methods, and headers. Only then does the browser send the actual request. If middleware redirects OPTIONS, authentication rejects it, or a proxy omits headers from error responses, the browser reports a preflight failure.",
      ],
      code: {
        label: "A preflight exchange",
        language: "http",
        code: `OPTIONS /projects/p1 HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: authorization,content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET,POST,PATCH,DELETE
Access-Control-Allow-Headers: Authorization,Content-Type
Access-Control-Max-Age: 600
Vary: Origin`,
      },
    },
    {
      heading: "Credentials change the CORS rules",
      paragraphs: [
        "Cross origin cookies and HTTP authentication require credentials mode in the browser and Access-Control-Allow-Credentials: true on the response. The allowed origin must be explicit. A wildcard cannot be combined with credentialed access because that would allow any site to read a user's authenticated response.",
        "Cookies also follow SameSite and Secure rules. A correct CORS response cannot override a cookie blocked by its attributes, and a cookie appearing in storage does not prove it was attached to the request. Inspect the actual Cookie request header and the browser's issue panel. For token authentication, remember that an Authorization header usually causes a preflight.",
      ],
      code: {
        label: "Credentialed frontend request",
        language: "typescript",
        code: `const response = await fetch(
  "https://api.example.com/profile",
  {
    credentials: "include",
  },
);

if (!response.ok) {
  throw new Error(\`Request failed: \${response.status}\`);
}

const profile = await response.json();`,
      },
    },
    {
      heading: "Configure CORS on the server, not in fetch",
      paragraphs: [
        "Frontend code cannot set Access-Control-Allow-Origin because it is a response header controlled by the server. Setting mode: \"no-cors\" does not solve API access. It produces an opaque response that JavaScript cannot inspect, which is useful for a narrow class of resource requests but not normal JSON APIs.",
        "Keep an explicit allowlist for production frontends, add development origins separately, and return Vary: Origin when the response changes based on Origin. Middleware should run early enough to decorate successful and error responses. Avoid reflecting any received origin without validation, especially when credentials are enabled.",
      ],
      code: {
        label: "FastAPI CORS middleware",
        language: "python",
        code: `from fastapi.middleware.cors import CORSMiddleware

allowed_origins = [
    "https://app.example.com",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
)`,
      },
    },
    {
      heading: "A reliable CORS debugging checklist",
      paragraphs: [
        "Open the browser network panel and find the OPTIONS request if one exists. Check its status, redirects, request Origin, requested method, requested headers, and response headers. Then inspect the actual request. The console message summarizes the failure, but the network exchange identifies the mismatch.",
        "Compare exact strings. A trailing slash is not part of an origin, but scheme, subdomain, and port are. Check whether the deployed frontend uses a preview domain that is absent from the allowlist. Confirm that a gateway, CDN, or serverless platform is not handling OPTIONS differently from the application.",
      ],
      bullets: [
        "Confirm the frontend and API origins exactly.",
        "Inspect OPTIONS before inspecting the application request.",
        "Remove redirects from preflight endpoints.",
        "Verify every requested header is allowed.",
        "Check CORS headers on 401, 403, 404, and 500 responses too.",
        "Test through the same proxy and domain used in production.",
      ],
    },
    {
      heading: "Common CORS errors and what they mean",
      paragraphs: [
        "A missing Access-Control-Allow-Origin means the server or an upstream error response did not grant the requesting origin. A multiple values error means two layers added the header, often application middleware plus a proxy. A credential and wildcard error means the server returned * while the request included credentials.",
        "A method or header failure means the preflight requested something outside the allowlist. A redirect failure often means HTTP redirects to HTTPS or a route adds a slash during OPTIONS. Fix the server or gateway behavior. Browser extensions that disable CORS only hide the problem on one machine and should never be treated as a production solution.",
      ],
    },
    {
      heading: "CORS is not a complete security boundary",
      paragraphs: [
        "Nonbrowser clients do not enforce CORS. An attacker can call your public API from a script or server regardless of the allowlist. Protect data with authentication and authorization. Rate limit expensive operations. Validate request bodies. Use CSRF defenses for cookie authenticated state changes.",
        "CORS can reduce which websites read responses through a user's browser, but it cannot make an exposed secret safe. If a key is included in frontend JavaScript, users can retrieve it. Move privileged provider calls to server code and give browser clients only public identifiers or short lived scoped credentials.",
      ],
    },
    {
      heading: "When a same origin proxy is useful",
      paragraphs: [
        "A Next.js route handler or reverse proxy can expose /api on the same origin as the page, then call the backend server to server. This can simplify cookies, hide internal service addresses, and centralize response shaping. It also adds a network hop and another layer to monitor, so use it for architecture reasons rather than as a patch for misunderstood headers.",
        "Even with a proxy, keep backend authorization. The proxy is not proof that a request is trusted. Forward only necessary headers, set timeouts, preserve request IDs, and avoid turning it into an unrestricted URL fetcher. Same origin architecture removes browser CORS negotiation, but not the need for secure API design.",
        "Document which layer owns the public contract. If both the proxy and backend rewrite headers or errors, debugging becomes confusing. One clear boundary should normalize responses, while logs preserve the upstream status and request ID for investigation. Keep that ownership visible in documentation.",
      ],
    },
  ],
  faqs: [
    {
      question: "What causes a CORS error?",
      answer:
        "A CORS error occurs when browser JavaScript requests another origin and the response does not include headers granting that origin, method, headers, or credential mode. Redirects and failed preflights are also common causes.",
    },
    {
      question: "Can I fix CORS from the frontend?",
      answer:
        "Usually no. The API or gateway must return the permission headers. Frontend developers can correct the request URL and credential mode, but they cannot grant their own origin access to a server response.",
    },
    {
      question: "Why does the API work in Postman but fail in the browser?",
      answer:
        "Postman and curl do not enforce the browser same origin policy. The response can be valid while its CORS headers are missing or incorrect. Inspect the browser preflight and response headers.",
    },
    {
      question: "Is Access-Control-Allow-Origin wildcard safe?",
      answer:
        "It can be acceptable for intentionally public noncredentialed resources. Do not use it for responses containing private user data, and it cannot be combined with credentialed requests.",
    },
    {
      question: "Does CORS protect an API from attackers?",
      answer:
        "No. CORS is enforced by browsers and does not stop direct HTTP clients. Use authentication, authorization, validation, rate limiting, CSRF protection where needed, and server side secret handling.",
    },
  ],
  takeaway:
    "CORS is a server granted browser permission, not a frontend setting and not authentication. Compare exact origins, inspect the preflight, configure explicit production allowlists, handle credentials carefully, and keep real security controls in the API.",
});
