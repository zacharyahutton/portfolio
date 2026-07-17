import { withReadingMeta } from "../types";

export const railwayVercelSplitPost = withReadingMeta({
  id: "railway-vercel-split",
  title: "Deploy FastAPI on Railway with a Vercel Frontend: A Split Deploy Guide",
  blurb:
    "How to deploy FastAPI on Railway with a Vercel frontend: CORS origins, env contracts, health checks, and a release checklist you can reuse on every ship.",
  tag: "Deploy",
  date: "August 2025",
  publishedAt: "2025-08-22",
  href: "/blog/railway-vercel-split",
  image: "/blog/railway-vercel-split.png",
  primaryKeyword: "deploy FastAPI Railway",
  intro: [
    "Serving a frontend and API from different platforms is one of the most common deployment patterns for modern web applications. Vercel handles static assets and edge delivery for the React frontend. Railway runs the persistent Python process for the FastAPI backend with database connections and background tasks. This split makes sense architecturally, but it introduces a boundary between the two services that you have to manage deliberately.",
    "I used this pattern to deploy FastAPI on Railway alongside a Vercel frontend for the weROI agency platform. This post covers everything I learned about making the split work: CORS configuration, environment variable management, health checks, release checklists, and the debugging techniques that saved me when something broke between the two hosts.",
  ],
  sections: [
    {
      heading: "Why Split Deploys Work for Vercel Frontend Railway Backend",
      paragraphs: [
        "The fundamental reason for splitting is that each platform excels at a different job. Vercel's edge network serves static files (HTML, CSS, JavaScript, images) with near-instant response times from locations close to the user. It handles build optimization, asset hashing, cache headers, and preview deployments automatically. For a React SPA, this is ideal.",
        "Railway runs persistent processes. A FastAPI server needs to maintain database connections, process background tasks, respond to webhook callbacks, and handle server-side state. Railway gives you a container that starts your Python process, keeps it running, provides environment variable management, and exposes a public URL. It does not do the edge caching or asset optimization that Vercel does, and it does not need to.",
        "The tradeoff is that the connection between the two services is now infrastructure. The React app needs to know the API URL. The API needs to know which browser origins to trust. Environment variables, CORS headers, and health checks become part of the application design, not afterthoughts.",
      ],
    },
    {
      heading: "CORS Configuration for Split Deploys",
      paragraphs: [
        "CORS (Cross-Origin Resource Sharing) is the mechanism browsers use to determine whether a frontend on one origin (e.g., app.vercel.app) can make requests to an API on another origin (e.g., api.railway.app). Without proper CORS headers, the browser blocks the request entirely. This is a browser-only concern: curl and server-to-server requests are not affected.",
        "The common mistake is setting allowed origins to '*' (wildcard) in production. This allows any website to make requests to your API from a browser, which is a security risk for any endpoint that relies on cookies or session-based authentication. Instead, list your specific origins: the production URL, the preview URL pattern, and localhost for development.",
        "FastAPI has excellent CORS support through the CORSMiddleware. You configure allowed origins, methods, and headers once, and the middleware handles preflight OPTIONS requests and response headers automatically. I load the allowed origins from an environment variable so I can add preview URLs without code changes.",
      ],
      code: {
        label: "CORS configuration",
        language: "python",
        code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "").split(",")
# Example: "https://weroi.net,https://weroi-preview.vercel.app,http://localhost:3000"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)`,
      },
      bullets: [
        "Never use allow_origins=['*'] in production with authenticated endpoints.",
        "Include both production and preview URLs in the allowed origins list.",
        "Allow credentials only if you use cookies for authentication. For Bearer tokens, it is optional.",
        "Test CORS from the actual browser, not from curl or Postman, because only browsers enforce CORS.",
      ],
    },
    {
      heading: "Environment Variables as a Deployment Contract",
      paragraphs: [
        "In a split deployment, environment variables are the contract between services. The frontend needs the public API base URL (REACT_APP_API_URL or NEXT_PUBLIC_API_URL). The backend needs database credentials, JWT signing secrets, email API keys, and the allowed CORS origins. Each variable belongs to exactly one service, and leaking a backend variable to the frontend is a security incident.",
        "I document every environment variable in a .env.example file in the repository with descriptions and example values. On the backend, I validate required variables at startup and fail fast with a clear error message if any are missing. This prevents the confusing scenario where the service starts but fails silently on the first API call because a database URL is empty.",
        "Each environment (development, preview, production) has its own variable values. The database URL, API base URL, and allowed origins are all different in each environment. I never copy production values to development, and I never use development values in production. Vercel and Railway both support per-environment variable configuration, which makes this manageable.",
      ],
      code: {
        label: "Startup validation",
        language: "python",
        code: `import os
import sys

REQUIRED_VARS = [
    "MONGODB_URI",
    "JWT_SECRET",
    "ALLOWED_ORIGINS",
    "RESEND_API_KEY",
]

def validate_env():
    missing = [var for var in REQUIRED_VARS if not os.environ.get(var)]
    if missing:
        print(f"FATAL: Missing environment variables: {', '.join(missing)}")
        sys.exit(1)

# Call at module level so it runs before FastAPI starts
validate_env()`,
      },
    },
    {
      heading: "Railway Health Check API and Monitoring",
      paragraphs: [
        "Railway needs a way to verify that your service is alive. The simplest approach is a health check endpoint: a GET route that returns 200 when the service can handle requests. Railway pings this endpoint periodically, and if it fails, Railway can restart the container.",
        "A basic health check just returns 200. A more useful health check also verifies that the service can reach its dependencies: the database is connected, required environment variables are present, and any external APIs are reachable. I keep the health check fast (under 200ms) because it runs frequently, but I include a database ping to catch connection issues early.",
        "Beyond the health check, I configure Railway to log stdout and stderr. FastAPI's structured logging captures request paths, status codes, response times, and error details. When something breaks in production, these logs are the first place I look. I use structured JSON logging so log aggregation tools can parse and filter effectively.",
      ],
      code: {
        label: "Health check endpoint",
        language: "python",
        code: `from datetime import datetime, timezone

@app.get("/health")
async def health_check():
    checks = {"api": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

    try:
        await db.command("ping")
        checks["database"] = "ok"
    except Exception as exc:
        checks["database"] = f"error: {str(exc)}"

    status = 200 if checks["database"] == "ok" else 503
    return JSONResponse(content=checks, status_code=status)`,
      },
    },
    {
      heading: "The Release Checklist That Prevents Deploy Surprises",
      paragraphs: [
        "A split deployment has more moving parts than a single-host deploy. Forgetting to update an environment variable, deploying the frontend before the backend, or missing a CORS origin can all cause failures that look mysterious from the browser console. I keep a release checklist in the repository that I follow for every production deploy.",
        "The checklist is short and specific. It covers the backend deploy (push, verify health check, check logs), the frontend deploy (push, verify build, check preview URL), and the integration verify (submit one form from the live frontend, check the admin panel, confirm email delivery). Each step takes less than a minute, but skipping any step risks shipping a broken experience.",
        "For changes that affect the API contract (new endpoints, changed request formats, removed fields), I deploy the backend first with backward compatibility, verify it works with the current frontend, then deploy the frontend, then remove the old code in a follow-up deploy. This prevents any window where the frontend calls endpoints that do not exist yet.",
      ],
      bullets: [
        "Deploy backend first when API contract changes.",
        "Verify the health check endpoint after every backend deploy.",
        "Test at least one end-to-end flow from the live frontend (not just curl).",
        "Check CORS in the browser DevTools network tab, not from a non-browser client.",
        "Keep rollback steps documented. Knowing how to revert is as important as knowing how to deploy.",
      ],
    },
    {
      heading: "Debugging Split Deploy Issues",
      paragraphs: [
        "The most common issue is a CORS error in the browser console. This usually means one of three things: the backend's allowed origins list is missing the frontend URL, the backend is not running (so no CORS headers are sent at all), or the request includes credentials but the backend does not have allow_credentials set. The fix starts with checking the backend logs to see if the request even reached the server.",
        "The second most common issue is an environment variable mismatch. The frontend is hitting a stale API URL, or the backend has a missing or incorrect variable. I always check environment variables before looking at code when a deploy fails. A quick curl to the health check endpoint from the terminal confirms whether the backend is reachable and healthy.",
        "The third issue is deployment ordering. If the frontend deploys before the backend and references a new endpoint, users see errors until the backend catches up. This is why I deploy backend first for contract changes, and why the release checklist exists. It takes discipline, but it prevents the 'it works on my machine' class of deploy failures.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do you handle CORS for Vercel preview deployments?",
      answer:
        "Vercel creates unique preview URLs for each branch (e.g., my-app-git-feature.vercel.app). You can add a pattern or specific preview URLs to your backend's allowed origins list. Some teams use a wildcard subdomain pattern (*.vercel.app) for development only and strict specific origins for production. I add known preview URLs to the environment variable and update them when branches change.",
    },
    {
      question: "Can Railway handle production traffic for a FastAPI backend?",
      answer:
        "Yes. Railway runs your container with the resources you configure (CPU, memory), provides persistent storage, handles TLS termination, and gives you logs and monitoring. For a typical agency platform or SaaS backend, Railway handles the traffic comfortably. The main limitation is that Railway runs in specific regions, so if your users are globally distributed, response latency may be higher than edge-deployed alternatives. For most applications, this is not a problem.",
    },
    {
      question: "What happens if the Railway backend goes down but Vercel is still up?",
      answer:
        "The frontend loads normally because it is static files on Vercel's edge network. But API calls fail. Users see loading spinners or error messages on data-dependent features. The fix depends on your error handling: good error states in the UI (network error messages, retry buttons) keep the experience usable. The health check endpoint helps Railway detect the issue and restart the container automatically.",
    },
    {
      question: "How do you keep secrets out of the Vercel frontend?",
      answer:
        "Only use NEXT_PUBLIC_ or REACT_APP_ prefixed environment variables for values that are safe to expose in the browser (API base URLs, public keys, feature flags). Never prefix backend secrets (database URIs, JWT signing keys, API keys for third-party services) with the public prefix. Keep those in Railway's environment only. Audit your frontend build output periodically to confirm no secrets leaked into the JavaScript bundle.",
    },
    {
      question: "Should I use a monorepo or separate repos for frontend and backend?",
      answer:
        "Both work. A monorepo keeps everything in one place and makes it easier to coordinate API contract changes. Separate repos give cleaner deployment pipelines and independent versioning. For the weROI platform, I use a setup where both deploy independently but share a documented API contract. The key is that whichever structure you choose, the release process should be documented so deployments are not dependent on one person's memory.",
    },
  ],
  takeaway:
    "A split deployment is simple when the boundary is visible. Explicit CORS origins, validated environment variables, a health check endpoint, and a short release checklist remove most of the mystery. Deploy backend first for contract changes, test from the actual browser, and document everything that is not in the code.",
  relatedLink: {
    label: "See the weROI architecture",
    href: "/projects/weroi",
  },
});
