import { withReadingMeta } from "../types";

export const studysyncJwtSqlitePost = withReadingMeta({
  id: "studysync-jwt-sqlite",
  title: "FastAPI JWT SQLite tutorial: building StudySync from a student API to a real service",
  blurb:
    "A FastAPI JWT SQLite tutorial for student APIs: SQLAlchemy models, ownership checks, auth dependencies, and tests that feel production adjacent from day one.",
  tag: "CS notes",
  date: "June 2025",
  publishedAt: "2025-06-20",
  href: "/blog/studysync-jwt-sqlite",
  image: "/blog/studysync-jwt-sqlite.png",
  primaryKeyword: "FastAPI JWT SQLite tutorial",
  intro: [
    "StudySync started as a university assignment: build a REST API that manages study records for students. The spec was simple enough to finish in a weekend. I decided to keep going because the project was small enough to understand completely, but rich enough to practise the same FastAPI JWT SQLite patterns I would use on a real service.",
    "This post walks through the architecture I chose, how I wired SQLAlchemy models to FastAPI routes, why JWT authentication matters even for coursework, and the ownership checks that prevent one user from reading another user's data. If you are building a student API with FastAPI and want production adjacent habits from day one, this is the approach I recommend.",
  ],
  sections: [
    {
      heading: "Why SQLite is a legitimate choice for small APIs",
      paragraphs: [
        "SQLite gets dismissed as a toy database, but for a single server API with moderate traffic it performs well and removes the operational overhead of running a separate database process. StudySync stores user accounts, courses, and study records. The dataset fits comfortably in a single file, backups are a file copy, and the SQLAlchemy ORM code looks identical to what you would write for PostgreSQL.",
        "The tradeoff is concurrency. SQLite uses file level locking, so heavy parallel writes will queue. For a student API, a personal project, or an internal tool that handles dozens of concurrent users, that is perfectly fine. If the project outgrows SQLite, swapping the connection string to PostgreSQL requires changing one line and running a migration.",
      ],
    },
    {
      heading: "Designing the SQLAlchemy models before writing routes",
      paragraphs: [
        "I started with three tables: users, courses, and study_records. Each user owns courses, and each course owns study records. The foreign keys enforce those relationships at the database level, not just in application logic. This means a study record cannot reference a course that does not exist, and deleting a user cascades through their data predictably.",
        "Writing the models first forced me to think about the data contract before I thought about HTTP verbs. That order matters. When you start with routes, you tend to shape the database around what the frontend wants right now. When you start with models, the routes become a thin translation layer over a stable schema.",
      ],
      code: {
        label: "SQLAlchemy models for StudySync",
        language: "python",
        code: `from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, DeclarativeBase
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    courses = relationship("Course", back_populates="owner", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="courses")
    records = relationship("StudyRecord", back_populates="course", cascade="all, delete-orphan")


class StudyRecord(Base):
    __tablename__ = "study_records"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    hours = Column(Float, nullable=False)
    notes = Column(String, default="")
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    course = relationship("Course", back_populates="records")`,
      },
    },
    {
      heading: "Wiring FastAPI JWT authentication step by step",
      paragraphs: [
        "The authentication flow has three parts: registration, login, and token verification. Registration hashes the password with bcrypt and stores the user. Login verifies the password and returns a signed JWT. Every protected route extracts and validates that token to identify the caller.",
        "I use python-jose for JWT encoding and passlib with bcrypt for hashing. The access token carries the user's ID in the sub claim and expires after 30 minutes. A short expiration limits the damage if a token leaks. For StudySync I kept things simple with a single access token, but the same pattern extends to refresh rotation when the project grows.",
      ],
      code: {
        label: "JWT creation and verification",
        language: "python",
        code: `from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, ValueError, KeyError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user`,
      },
    },
    {
      heading: "Ownership checks: the security layer students skip",
      paragraphs: [
        "Authentication tells you who is making the request. Authorization tells you whether that person is allowed to do what they are asking. Most student APIs I have reviewed stop at authentication. They verify the token, extract the user, and then let that user read or modify any record in the database by ID. That is a broken access control vulnerability, and it is number one on the OWASP Top 10.",
        "In StudySync, every route that touches a course or study record verifies that the authenticated user owns the parent resource. If user A sends a request to update a course belonging to user B, the API returns 403. The check is a single helper function that I call from every protected route. It is small, testable, and impossible to forget once it is part of the pattern.",
      ],
      code: {
        label: "Ownership verification helper",
        language: "python",
        code: `from fastapi import HTTPException, status


def verify_ownership(resource, current_user: User, field: str = "owner_id"):
    owner_id = getattr(resource, field)
    if owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )


@router.put("/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: int,
    body: CourseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    verify_ownership(course, current_user)
    course.name = body.name
    db.commit()
    db.refresh(course)
    return course`,
      },
    },
    {
      heading: "Testing the contract, not the implementation",
      paragraphs: [
        "The tests I find most valuable exercise the public HTTP contract. They create a user, log in, perform an action, and assert the status code and response body. They also cover the negative paths: accessing another user's course, submitting invalid data, making a request without a token.",
        "I use a temporary SQLite database for each test run so every test starts with a clean state. FastAPI's TestClient makes this straightforward. The test file reads like a specification of what the API promises, which is exactly the document I want when I return to the project after a break.",
      ],
      code: {
        label: "Test for ownership enforcement",
        language: "python",
        code: `def test_user_cannot_access_other_users_course(client, db):
    # Create two users
    client.post("/auth/register", json={"email": "alice@test.com", "password": "secret123"})
    client.post("/auth/register", json={"email": "bob@test.com", "password": "secret456"})

    # Alice logs in and creates a course
    alice_token = client.post(
        "/auth/login", data={"username": "alice@test.com", "password": "secret123"}
    ).json()["access_token"]
    course = client.post(
        "/courses/",
        json={"name": "Data Structures"},
        headers={"Authorization": f"Bearer {alice_token}"},
    ).json()

    # Bob logs in and tries to read Alice's course
    bob_token = client.post(
        "/auth/login", data={"username": "bob@test.com", "password": "secret456"}
    ).json()["access_token"]
    response = client.get(
        f"/courses/{course['id']}",
        headers={"Authorization": f"Bearer {bob_token}"},
    )
    assert response.status_code == 403`,
      },
    },
    {
      heading: "What I would change if I rebuilt StudySync today",
      paragraphs: [
        "Looking back, there are three things I would improve. First, I would add refresh token rotation so the user does not have to log in every 30 minutes. Second, I would use Alembic for database migrations from the start instead of relying on create_all. Third, I would add rate limiting to the auth endpoints to slow down brute force attempts. None of these gaps made StudySync a failure, but they represent the difference between a working project and a hardened service.",
        "The broader lesson is that coursework does not have to stay at coursework quality. Every student API is an opportunity to practise the patterns that production code demands: explicit data models, real authentication, ownership enforcement, and tests that cover the security paths. The scale is smaller, but the habits transfer directly.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is SQLite good enough for a FastAPI production API?",
      answer:
        "For low to moderate traffic on a single server, yes. SQLite handles thousands of reads per second and hundreds of writes per second easily. It struggles with heavy concurrent writes because of file level locking. If your API serves a small team, an internal tool, or a personal project, SQLite is a legitimate and low maintenance choice. When you outgrow it, swapping the SQLAlchemy connection string to PostgreSQL is a one line change.",
    },
    {
      question: "How do I add JWT refresh tokens to a FastAPI app?",
      answer:
        "Issue a short lived access token (15 to 30 minutes) and a longer lived refresh token (7 to 30 days) at login. Store refresh tokens server side with an expiration and a used flag. When the client sends the refresh token, verify it, issue a new pair, and invalidate the old refresh token. If someone reuses an invalidated token, treat it as a session compromise and revoke all tokens for that user.",
    },
    {
      question: "Why are ownership checks important in a student API?",
      answer:
        "Without ownership checks, any authenticated user can read, update, or delete any other user's data by guessing or enumerating record IDs. This is Broken Access Control, the number one vulnerability on the OWASP Top 10. Adding a simple ownership verification function to every protected route prevents the entire class of bug and builds a habit you will need on every real project.",
    },
    {
      question: "What is the best way to test FastAPI endpoints with SQLite?",
      answer:
        "Create a separate SQLite database (in memory or a temporary file) for your test suite. Override the get_db dependency to use the test database. Use FastAPI's TestClient to send real HTTP requests against the app. Each test should set up its own data, run the request, and assert the response. This pattern keeps tests isolated, fast, and reproducible.",
    },
  ],
  takeaway:
    "A student API becomes production adjacent when you model data before routes, enforce ownership on every protected endpoint, and test the security paths as deliberately as the happy paths. FastAPI, JWT, and SQLite are simple tools that teach serious habits when you push past the assignment requirements.",
  relatedLink: {
    label: "Explore the StudySync API project",
    href: "/projects/studysync-api",
  },
});
