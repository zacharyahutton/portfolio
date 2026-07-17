import { withReadingMeta } from "../types";

export const weroiPlatformPost = withReadingMeta({
  id: "weroi-platform",
  title: "Building a Full Stack Agency Platform with React, FastAPI, and MongoDB",
  blurb:
    "How I shipped a full stack agency platform with React, FastAPI, MongoDB Atlas, JWT admin, Resend email, and split Vercel plus Railway hosting that ships.",
  tag: "Case study",
  date: "February 2026",
  publishedAt: "2026-02-21",
  href: "/blog/weroi-platform",
  image: "/blog/weroi-platform.png",
  primaryKeyword: "full stack agency platform",
  intro: [
    "weROI started as a client project with a clear goal: build a full stack agency platform that could capture leads, let the team manage them through an admin panel, automate email responses, and look credible to potential clients visiting the site. The stack ended up being React for the frontend, FastAPI for the backend, MongoDB Atlas for persistence, Resend for transactional email, JWT for authentication, and a split deployment across Vercel and Railway.",
    "This post covers the architecture decisions, the problems I solved, and the patterns I would reuse. If you are building a React FastAPI MongoDB application or shipping a JWT admin panel on FastAPI, most of these lessons will apply directly.",
  ],
  sections: [
    {
      heading: "Choosing the Stack for a Full Stack Agency Platform",
      paragraphs: [
        "The requirements shaped the stack. The agency needed a public marketing site with a lead capture form, a protected admin dashboard for reviewing and managing leads, automated email notifications when leads arrive, and deployment that the team could maintain without DevOps overhead.",
        "React gave me component composition for the marketing pages and the admin panel in one codebase. FastAPI gave me typed request models (via Pydantic), automatic OpenAPI documentation, and clean async support for database and email operations. MongoDB Atlas removed the need to manage a database server and scaled reads naturally for an admin panel with filtering and pagination. Resend handled transactional email with a clean API and domain verification.",
        "I could have used Next.js for the frontend, but at the time the admin panel's client-side interactivity (form states, optimistic updates, JWT token management) fit better as a React SPA. The tradeoff was managing CORS and environment configuration across two hosts, which I will cover in the deployment section.",
      ],
    },
    {
      heading: "The Lead Funnel: From Form Submission to MongoDB",
      paragraphs: [
        "The public-facing lead form is the core revenue feature. A visitor fills out their name, email, company, and a message describing what they need. The form validates on the client, then sends a POST request to the FastAPI backend. The backend validates again with Pydantic (never trust client validation alone), normalizes fields like email to lowercase, adds server-generated timestamps, sets the initial status to 'new', and inserts the document into MongoDB.",
        "After the insert succeeds, the backend fires off a transactional email through Resend: a confirmation to the visitor and a notification to the agency team. Email delivery is handled as a best-effort side effect. If Resend fails, the lead is still stored. The API returns a success response to the form regardless of email status, because losing a lead record because an email provider timed out would be unacceptable.",
        "On the MongoDB side, I indexed the fields the admin panel actually queries: creation date (for sorting newest first), status (for filtering), and normalized email (for duplicate checking). Over-indexing wastes resources. Under-indexing makes the admin panel sluggish as the collection grows. I matched indexes to real queries.",
      ],
      code: {
        label: "Lead creation endpoint",
        language: "python",
        code: `from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    message: str

@app.post("/api/leads", status_code=201)
async def create_lead(payload: LeadCreate):
    doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "company": payload.company,
        "message": payload.message.strip(),
        "status": "new",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.leads.insert_one(doc)
    # Fire email notification (best-effort, does not block response)
    background_tasks.add_task(send_lead_notification, doc)
    return {"id": str(result.inserted_id)}`,
      },
    },
    {
      heading: "JWT Admin Panel on FastAPI",
      paragraphs: [
        "The admin panel lets the agency team view, filter, update, and export leads. It is protected by JWT authentication. I implemented a login endpoint that verifies credentials against hashed passwords stored in MongoDB, issues a short-lived access token and a longer-lived refresh token, and returns both to the client.",
        "On the React side, the access token is stored in memory (not localStorage) and sent as a Bearer header on every API request. When the access token expires, the client silently calls the refresh endpoint to get a new one. If the refresh token is also expired or invalid, the user is redirected to the login page.",
        "Every protected endpoint on the backend extracts the token from the Authorization header, verifies the signature and expiration, looks up the user, and checks their role. I wrote this as a FastAPI dependency so I never repeat the auth logic. Admin routes require the 'admin' role. If a valid token belongs to a non-admin user, the endpoint returns 403.",
      ],
      bullets: [
        "Hash passwords with bcrypt. Never store plaintext credentials.",
        "Keep access tokens short-lived (15 minutes) and refresh tokens longer (7 days).",
        "Validate issuer, audience, and expiration on every request.",
        "Return 401 for missing or invalid tokens, 403 for insufficient permissions.",
      ],
      code: {
        label: "JWT dependency",
        language: "python",
        code: `from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token verification failed")

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user`,
      },
    },
    {
      heading: "Resend Email Automation",
      paragraphs: [
        "Email is a small part of the codebase but a big part of the user experience. When a lead submits the form, they should receive a confirmation that their message was received. The agency team should receive a notification with the lead details so they can follow up promptly.",
        "I set up Resend with the agency's domain (growth@weroi.net), verified SPF and DKIM records, and built two email templates: one for the visitor confirmation and one for the team notification. The templates receive validated data from the lead document, so there is no risk of rendering arbitrary HTML from user input.",
        "Delivery failures are logged but do not block the lead creation response. I record the Resend message ID and delivery status in the lead document so the admin panel can show whether the confirmation was sent successfully. If delivery fails, the team can see the gap and follow up manually.",
      ],
    },
    {
      heading: "Deploying Across Vercel and Railway",
      paragraphs: [
        "The frontend deploys to Vercel. The backend deploys to Railway. This split makes sense because Vercel optimizes static asset delivery and edge caching for a React SPA, while Railway runs a persistent Python process for the FastAPI backend with MongoDB connections and background tasks.",
        "The split introduces a boundary that you have to manage deliberately. The React app needs the public API base URL as an environment variable (REACT_APP_API_URL). The FastAPI backend needs CORS configuration that lists the exact production and preview origins. I also need to keep secrets (MongoDB URI, JWT secret, Resend API key) in Railway's environment and never expose them through the frontend.",
        "After each deploy, I check three things: the health endpoint responds, one end-to-end form submission works from the live frontend, and CORS headers are correct in the browser (not just from curl, because curl does not enforce CORS). I keep a short release checklist in the repo so deploy steps are not dependent on memory.",
      ],
      bullets: [
        "Set CORS allowed origins explicitly. Never use a wildcard in production.",
        "Validate required environment variables at FastAPI startup and fail fast if any are missing.",
        "Use separate environment values for development, preview, and production.",
        "Confirm the full user journey (form submit, email delivery, admin login) after every production deploy.",
      ],
    },
    {
      heading: "What I Would Do Differently",
      paragraphs: [
        "If I were starting weROI today, I would consider Next.js with server actions for the marketing pages to get static rendering and metadata without a separate SPA build. The admin panel might still live as a client-heavy section, but the marketing pages do not need a full React SPA.",
        "I would also move the email delivery into a background job queue with retry logic instead of a fire-and-forget background task. Right now, if Resend is down when a lead arrives, the email is lost. A queue with retries would make delivery more reliable.",
        "The MongoDB schema has held up well. The JWT implementation works cleanly. The split deploy pattern is solid when you manage the boundary explicitly. These are the parts I would reuse directly.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why use FastAPI instead of Django or Express for an agency platform?",
      answer:
        "FastAPI gives you typed request validation with Pydantic, automatic API documentation, native async support, and excellent Python ecosystem access. For an agency platform that needs clean API contracts, JWT auth, and integration with services like Resend and MongoDB, FastAPI is lean and productive. Django is a great choice if you want an ORM and admin panel included, but for this project the API-first approach with a React frontend made FastAPI the better fit.",
    },
    {
      question: "How do you handle JWT token refresh in a React SPA?",
      answer:
        "Store the access token in memory (a React state variable or context), not in localStorage. When the access token expires and an API call returns 401, the client automatically calls the refresh endpoint with the refresh token (stored in an HTTP-only cookie or memory). If the refresh succeeds, retry the original request with the new token. If it fails, redirect to the login page. This gives you short-lived access tokens with seamless renewal.",
    },
    {
      question: "Is MongoDB a good choice for a lead management system?",
      answer:
        "Yes. A lead document maps naturally to MongoDB's document model. You do not need complex relational joins, and the schema can evolve as the agency adds fields. MongoDB Atlas handles backups, monitoring, and scaling. The key is to add indexes for the queries your admin panel actually uses (creation date, status, email) and validate data at the API layer with Pydantic before it reaches the database.",
    },
    {
      question: "How do you keep Vercel and Railway deploys in sync?",
      answer:
        "The frontend and backend deploy independently from the same repository (or linked repos). The connection point is the API base URL configured in the frontend's environment variables. I use a release checklist: deploy backend first, verify the health endpoint, deploy frontend, test one end-to-end flow. If the API contract changes, I deploy the backend with backward compatibility first, update the frontend, then remove the old endpoints.",
    },
  ],
  takeaway:
    "A full stack agency platform feels complete when every handoff is intentional. Reliable forms, understandable API errors, searchable leads, and observable email delivery matter more than adding another framework. The stack works when the boundaries are visible and each layer does its job.",
  relatedLink: {
    label: "Read the weROI case study",
    href: "/projects/weroi",
  },
});
