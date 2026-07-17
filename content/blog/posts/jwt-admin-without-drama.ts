import { withReadingMeta } from "../types";

export const jwtAdminWithoutDramaPost = withReadingMeta({
  id: "jwt-admin-without-drama",
  title: "JWT Authentication in FastAPI: Refresh Tokens, Roles, and Admin Panels That Work",
  blurb:
    "Practical JWT authentication FastAPI patterns: short lived access tokens, refresh rotation, role based guards, and admin APIs that stay boringly secure.",
  tag: "Auth",
  date: "November 2025",
  publishedAt: "2025-11-20",
  href: "/blog/jwt-admin-without-drama",
  image: "/blog/jwt-admin-without-drama.png",
  primaryKeyword: "JWT authentication FastAPI",
  intro: [
    "JWT authentication becomes confusing when developers treat the token as the entire security system. A token only carries signed claims. The application still needs a login policy, expiration rules, refresh behavior, server-side authorization, and a safe place to store credentials. I have implemented JWT authentication in FastAPI for the weROI admin panel and several smaller projects, and the pattern I keep returning to separates these concerns cleanly.",
    "This post walks through the complete JWT authentication flow I use in FastAPI: issuing access and refresh tokens, rotating refresh tokens on use, building role-based access control as a reusable dependency, and connecting it all to a React admin panel. If you are building a FastAPI admin JWT setup or trying to add role-based access to FastAPI, these patterns will save you time.",
  ],
  sections: [
    {
      heading: "How JWT Authentication in FastAPI Works",
      paragraphs: [
        "A JWT (JSON Web Token) is a signed payload that contains claims about a user: their identity, roles, and when the token expires. The server creates the token after verifying credentials, signs it with a secret key, and returns it to the client. On subsequent requests, the client sends the token in the Authorization header. The server verifies the signature, checks expiration, and extracts the user identity without querying a session store.",
        "FastAPI makes this clean because you can define token verification as a dependency. Every protected route declares a dependency on a function that extracts and validates the token. If the token is missing, expired, or invalid, the dependency raises an HTTP exception before the route handler runs. This means you write the auth logic once and inject it everywhere.",
        "The key design decision is what goes into the token payload. Keep it minimal: a subject (user ID), expiration time, issued-at time, and optionally a role or scope claim. Do not put secrets, passwords, or large data structures in the payload. The token is signed, not encrypted, so anyone who intercepts it can read the claims. The signature only guarantees that the claims were not tampered with.",
      ],
      code: {
        label: "Token creation",
        language: "python",
        code: `from datetime import datetime, timedelta, timezone
from jose import jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = timedelta(minutes=15)
REFRESH_TOKEN_EXPIRE = timedelta(days=7)

def create_access_token(user_id: str, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "role": role,
        "exp": now + ACCESS_TOKEN_EXPIRE,
        "iat": now,
        "type": "access",
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "exp": now + REFRESH_TOKEN_EXPIRE,
        "iat": now,
        "type": "refresh",
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)`,
      },
    },
    {
      heading: "Why Refresh Token Rotation Matters",
      paragraphs: [
        "A common question is why you need two tokens. The access token is used on every API request, so it should be short-lived (15 minutes is a reasonable default). If it is stolen, the window of misuse is small. The refresh token is used only to obtain a new access token, so it can live longer (days or weeks), but it should be stored more securely and rotated on every use.",
        "Rotation means that when the client uses a refresh token, the server issues a new refresh token and invalidates the old one. If someone copies a refresh token and tries to use it after the legitimate client has already rotated it, the server detects the reuse of an invalidated token. This is a strong signal that the session may have been compromised, and the server can revoke all tokens for that user.",
        "This requires server-side storage. You need a table of active refresh tokens (or a token family ID) to track which tokens are valid. Some developers resist this because they chose JWT specifically to avoid server-side sessions. But authentication state is inherently stateful. Refresh token rotation is where that reality shows up. You can keep access token verification stateless (just check the signature and expiration) while managing refresh tokens with server-side records.",
      ],
      code: {
        label: "Refresh token rotation",
        language: "python",
        code: `@app.post("/auth/refresh")
async def refresh_token(request: RefreshRequest):
    try:
        payload = jwt.decode(request.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Wrong token type")

    user_id = payload["sub"]
    token_record = await db.refresh_tokens.find_one({
        "token": request.refresh_token,
        "revoked": False,
    })

    if not token_record:
        # Possible token reuse: revoke all tokens for this user
        await db.refresh_tokens.update_many(
            {"user_id": user_id}, {"$set": {"revoked": True}}
        )
        raise HTTPException(status_code=401, detail="Token reuse detected")

    # Revoke the used token
    await db.refresh_tokens.update_one(
        {"_id": token_record["_id"]}, {"$set": {"revoked": True}}
    )

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    new_access = create_access_token(user_id, user["role"])
    new_refresh = create_refresh_token(user_id)

    await db.refresh_tokens.insert_one({
        "user_id": user_id,
        "token": new_refresh,
        "revoked": False,
        "created_at": datetime.now(timezone.utc),
    })

    return {"access_token": new_access, "refresh_token": new_refresh}`,
      },
    },
    {
      heading: "Role-Based Access Control as a FastAPI Dependency",
      paragraphs: [
        "Hiding an admin button in React is interface behavior, not access control. Every protected endpoint must check the authenticated identity and required role on the server. In FastAPI, I implement this as a chain of dependencies: one that extracts and verifies the token, one that loads the user, and one that checks the role.",
        "The base dependency (get_current_user) verifies the access token and returns the user document. A second dependency (require_admin) depends on get_current_user and checks that the user's role is 'admin'. If it is not, it raises a 403 Forbidden error. Routes that need admin access declare require_admin as a dependency. Routes that only need authentication declare get_current_user.",
        "This pattern scales cleanly. If you add more roles (editor, viewer, moderator), you create new dependencies that check for those roles. Each route declares exactly what level of access it requires, and the dependency chain handles the rest. You never write inline role checks in route handlers.",
      ],
      code: {
        label: "Role-based dependencies",
        language: "python",
        code: `from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
):
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Wrong token type")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Usage in routes
@app.get("/admin/leads")
async def list_leads(user=Depends(require_admin)):
    return await db.leads.find().sort("created_at", -1).to_list(100)

@app.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    return {"name": user["name"], "email": user["email"], "role": user["role"]}`,
      },
    },
    {
      heading: "Connecting JWT to a React Admin Panel",
      paragraphs: [
        "On the React side, the login form sends credentials to the FastAPI login endpoint. On success, the client stores the access token in memory (a state variable or React context) and the refresh token either in memory or in an HTTP-only cookie. I prefer memory for the access token because it is cleared when the tab closes, reducing the risk of token leakage from browser storage.",
        "Every API request includes the access token in the Authorization header. When a request returns 401, the client attempts a silent refresh by sending the refresh token to the refresh endpoint. If the refresh succeeds, the original request is retried with the new access token. If the refresh fails (token expired or revoked), the client redirects to the login page.",
        "The admin panel UI hides navigation links and controls based on the user's role, but this is purely cosmetic. A user who tampers with the frontend to show hidden admin buttons will still get a 403 from the API because the server enforces role checks independently. The UI role check improves the user experience by showing only relevant features, not by providing security.",
      ],
      bullets: [
        "Never store access tokens in localStorage. Memory is safer because it does not persist across sessions.",
        "Use an Axios interceptor or fetch wrapper to automatically attach the token and handle refresh on 401.",
        "Clear all tokens and redirect on refresh failure. Do not retry indefinitely.",
        "Test that regular user tokens cannot access admin endpoints, even when the request is crafted manually.",
      ],
    },
    {
      heading: "Common JWT Mistakes I Learned to Avoid",
      paragraphs: [
        "The most common mistake is putting sensitive data in the JWT payload. The payload is base64url encoded, not encrypted. Anyone with the token can decode it and read the claims. Keep the payload minimal: user ID, role, and timestamps.",
        "Another mistake is not validating the token type. If your system uses both access and refresh tokens, check the 'type' claim in each endpoint. A refresh token should never be accepted as an access token, and vice versa. Without this check, a stolen refresh token could be used to call API endpoints directly.",
        "A third mistake is using the same secret key for signing and for other purposes (like password hashing). JWT signing keys should be dedicated, stored securely in environment variables, and rotated periodically. If the signing key is compromised, an attacker can forge valid tokens for any user.",
        "Finally, avoid extremely long token lifetimes for access tokens. A 30-day access token means that a stolen token is valid for a month. Fifteen minutes is a reasonable default. The inconvenience of short-lived tokens is offset by the refresh token flow, which renews them transparently.",
      ],
    },
  ],
  faqs: [
    {
      question: "How long should a JWT access token last?",
      answer:
        "Fifteen minutes is a widely used default. This is short enough that a stolen token has limited value, but long enough that users are not constantly interrupted by re-authentication. The refresh token (typically 7 to 30 days) handles seamless renewal. Adjust based on your security requirements: higher-risk applications (financial, admin panels) may use shorter access token lifetimes.",
    },
    {
      question: "Should I store JWT tokens in localStorage or cookies?",
      answer:
        "Neither localStorage nor sessionStorage is ideal for access tokens because they are accessible to JavaScript and vulnerable to XSS attacks. The safest approach is to keep the access token in memory (a JavaScript variable) and use HTTP-only, secure cookies for the refresh token. HTTP-only cookies are not accessible to JavaScript, which mitigates XSS risk. Memory-stored tokens are cleared when the page is closed.",
    },
    {
      question: "Can JWT work without any server-side state?",
      answer:
        "Access token verification can be stateless: check the signature, expiration, and claims. But refresh token rotation requires server-side records to track valid tokens and detect reuse. Logout also requires server-side state (a revocation list or token family tracking) unless you are willing to wait for the access token to expire naturally. Purely stateless JWT is a simplification that does not hold up in production authentication systems.",
    },
    {
      question: "How do you handle JWT in FastAPI with multiple user roles?",
      answer:
        "Create a chain of FastAPI dependencies. The base dependency verifies the token and loads the user. Higher-level dependencies check the user's role. For example, require_admin depends on get_current_user and raises 403 if the role is not 'admin'. Each route declares the appropriate dependency. This keeps role logic centralized, testable, and consistent across all endpoints.",
    },
    {
      question: "Is JWT better than session-based authentication?",
      answer:
        "Neither is universally better. JWT works well for API-first architectures where the client is a SPA or mobile app, because the token travels in the Authorization header and does not require cookie configuration across domains. Session-based auth works well for traditional server-rendered applications. For a FastAPI backend serving a React SPA, JWT is a natural fit. The important thing is implementing whichever you choose correctly: proper expiration, secure storage, and server-side authorization.",
    },
  ],
  takeaway:
    "JWT stays manageable when token purpose, session renewal, and authorization are separate concerns. Short-lived access tokens limit damage from theft. Refresh token rotation detects compromise. Server-side role checks enforce access control. The browser improves the experience, but the API makes the security decision.",
  relatedLink: {
    label: "See authentication in the weROI case study",
    href: "/projects/weroi",
  },
});
