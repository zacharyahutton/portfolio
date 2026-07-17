import { withReadingMeta } from "../types";

export const mongodbAtlasLeadsPost = withReadingMeta({
  id: "mongodb-atlas-leads",
  title: "MongoDB Atlas lead funnel: indexes, Pydantic, and an admin dashboard that scales",
  blurb:
    "How I designed a MongoDB Atlas lead funnel with compound indexes, Pydantic validation, pagination, and a FastAPI admin the agency team actually uses daily.",
  tag: "Data",
  date: "March 2025",
  publishedAt: "2025-03-21",
  href: "/blog/mongodb-atlas-leads",
  image: "/blog/mongodb-atlas-leads.png",
  primaryKeyword: "MongoDB Atlas lead funnel",
  intro: [
    "When I started building weROI's lead tracking system, the first question was not which database to use. It was what a lead actually means to the business. A lead is a person who submitted a contact form, a set of fields the sales team needs to act on, and a record that should be searchable, filterable, and auditable weeks after submission.",
    "MongoDB Atlas was the right fit because the schema needed to be flexible enough to evolve with the business while supporting the compound indexes and aggregation queries the admin dashboard required. This post covers how I designed the MongoDB Atlas lead funnel, validated data with Pydantic before it reached the database, built indexes around the queries the admin actually uses, and kept the FastAPI layer clean enough to maintain.",
  ],
  sections: [
    {
      heading: "Designing the lead document around the business event",
      paragraphs: [
        "The first mistake I see in lead tracking systems is storing too much UI state in the database. The document should represent the business event (someone expressed interest) with the fields the team needs to follow up, not a copy of every form field that happened to be on the page.",
        "For weROI, a lead document contains: the contact's name, email, phone (optional), the service they inquired about, a free text message, the source (which page or campaign), a status (new, contacted, converted, closed), timestamps for creation and last update, and an optional notes field for internal use. Every field has a purpose in the admin workflow.",
        "I avoided nesting deeply. The document is flat by design. Flat documents are easier to index, easier to query, and easier to evolve when the business adds a new status or a new field. If a lead needs related data in the future (like a list of follow up attempts), I will create a separate collection and link by lead ID rather than nesting arrays that grow unbounded.",
      ],
      code: {
        label: "Lead document schema in Pydantic",
        language: "python",
        code: `from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
from enum import Enum


class LeadStatus(str, Enum):
    new = "new"
    contacted = "contacted"
    converted = "converted"
    closed = "closed"


class LeadCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    service: str = Field(min_length=1, max_length=100)
    message: str = Field(max_length=2000)
    source: str = Field(default="website", max_length=100)


class LeadDocument(LeadCreate):
    status: LeadStatus = LeadStatus.new
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))`,
      },
    },
    {
      heading: "Why Pydantic validation belongs before MongoDB, not after",
      paragraphs: [
        "MongoDB accepts whatever JSON you insert. That flexibility is a feature, but it is also a risk. Without validation at the application layer, a missing field, an invalid email, or an oversized string silently becomes a permanent record that the admin dashboard has to handle as a special case.",
        "I validate every lead with Pydantic before the document reaches MongoDB. The LeadCreate model enforces required fields, string lengths, email format, and enum membership. If validation fails, FastAPI returns a 422 with a structured error body that the frontend can display inline. The database never receives malformed data.",
        "This separation also keeps the API honest. The frontend knows exactly what the backend expects because the Pydantic model is the contract. If I add a required field, the frontend learns about it immediately through a 422 error during development, not through a production bug where leads are missing data.",
      ],
      bullets: [
        "Trim whitespace and normalize email to lowercase before validation.",
        "Reject empty strings for required fields, not just missing fields.",
        "Return validation errors with field level detail so the form can highlight the problem.",
        "Separate the public creation model from the internal document model (status and notes are not user writable).",
      ],
    },
    {
      heading: "Building MongoDB indexes around the admin dashboard queries",
      paragraphs: [
        "The admin dashboard drives the index strategy. The team filters leads by status, sorts by creation date, and searches by email. Those three access patterns need three indexes. Without them, every filter and sort operation scans the entire collection, which feels fine at 50 leads and painful at 5,000.",
        "I created a compound index on { status: 1, created_at: -1 } because the most common dashboard view is \"show me new leads, newest first.\" I added a single field index on email (normalized to lowercase) for deduplication checks and direct lookups. And I added a text index on name and message for the search box.",
        "The key discipline is building indexes around queries you actually run, not indexing every field just in case. Each index consumes storage and slows writes. On a lead collection that grows by dozens of records per day, the cost is negligible. But the habit of justifying each index transfers to larger collections where the cost is real.",
      ],
      code: {
        label: "Index creation for the leads collection",
        language: "python",
        code: `from motor.motor_asyncio import AsyncIOMotorDatabase


async def ensure_indexes(db: AsyncIOMotorDatabase):
    leads = db["leads"]

    # Primary dashboard query: filter by status, sort by newest
    await leads.create_index(
        [("status", 1), ("created_at", -1)],
        name="status_created_desc",
    )

    # Email lookup for deduplication and search
    await leads.create_index(
        "email",
        name="email_lookup",
    )

    # Text search on name and message
    await leads.create_index(
        [("name", "text"), ("message", "text")],
        name="text_search",
    )`,
      },
    },
    {
      heading: "Keeping the FastAPI admin routes clean and paginated",
      paragraphs: [
        "The admin API serves a React dashboard. Every list endpoint is paginated with cursor based pagination (using the last document's created_at and _id) rather than skip/limit. Skip based pagination degrades on large collections because MongoDB still traverses the skipped documents. Cursor based pagination is consistently fast regardless of which page you are on.",
        "I separate the admin routes into their own router with a dependency that verifies the JWT and checks the admin role. This keeps the authorization logic in one place and prevents accidental exposure of admin data through a public route. The admin can filter by status, search by text, and sort by date, all within the same endpoint using optional query parameters.",
      ],
      code: {
        label: "Paginated admin leads endpoint",
        language: "python",
        code: `from fastapi import APIRouter, Depends, Query
from typing import Optional

router = APIRouter(prefix="/admin/leads", tags=["admin"])


@router.get("/", response_model=PaginatedLeads)
async def list_leads(
    status: Optional[LeadStatus] = None,
    search: Optional[str] = None,
    cursor: Optional[str] = None,
    limit: int = Query(default=25, le=100),
    admin: User = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    query_filter: dict = {}

    if status:
        query_filter["status"] = status.value

    if search:
        query_filter["$text"] = {"$search": search}

    if cursor:
        cursor_data = decode_cursor(cursor)
        query_filter["$or"] = [
            {"created_at": {"$lt": cursor_data["created_at"]}},
            {
                "created_at": cursor_data["created_at"],
                "_id": {"$lt": cursor_data["_id"]},
            },
        ]

    docs = await (
        db["leads"]
        .find(query_filter)
        .sort([("created_at", -1), ("_id", -1)])
        .limit(limit + 1)
        .to_list(length=limit + 1)
    )

    has_more = len(docs) > limit
    leads = docs[:limit]
    next_cursor = encode_cursor(leads[-1]) if has_more and leads else None

    return PaginatedLeads(leads=leads, next_cursor=next_cursor, has_more=has_more)`,
      },
    },
    {
      heading: "Protecting the database layer from the frontend",
      paragraphs: [
        "The React dashboard never talks to MongoDB directly. Every database operation goes through the FastAPI API, which validates input, checks authorization, and shapes the response. The MongoDB connection string, database name, and collection structure are server side details that the browser never sees.",
        "This is obvious in theory but easy to violate in practice. I have seen projects that embed MongoDB connection strings in frontend environment variables, expose raw aggregation pipelines through API parameters, or return internal document fields (_id as a raw ObjectId, internal notes, admin metadata) in public responses. Keeping a clean boundary between the API and the database prevents all of these leaks.",
      ],
      bullets: [
        "Never expose the MongoDB connection string to the frontend.",
        "Transform ObjectId to a string in API responses.",
        "Exclude internal fields (notes, admin metadata) from public endpoints.",
        "Rate limit the public lead creation endpoint to prevent spam.",
        "Log lead creation events with enough context for debugging but without logging sensitive data.",
      ],
    },
    {
      heading: "What I would add for a larger scale lead funnel",
      paragraphs: [
        "weROI's current scale is modest: dozens of leads per week. If the volume grew to thousands per day, I would add three things. First, a write concern of majority on insertions to prevent data loss during replica set failovers. Second, TTL indexes on stale closed leads to automatically archive old data. Third, a change stream that triggers notifications (Slack, email) when a new lead arrives, replacing the current polling approach on the dashboard.",
        "MongoDB Atlas makes these upgrades straightforward because the infrastructure (replica sets, automated backups, monitoring) is managed. The application code stays focused on business logic. That tradeoff, letting the managed service handle operations while I handle data modeling and API design, is why Atlas works well for a small team shipping a real product.",
      ],
    },
  ],
  faqs: [
    {
      question: "Should I use MongoDB or PostgreSQL for a lead tracking API?",
      answer:
        "Both work. MongoDB is a good fit when your lead schema is evolving, you want flexible document shapes, and you do not need complex joins. PostgreSQL is better when you need strong relational integrity, advanced aggregations, or your team already knows SQL well. For weROI, MongoDB made sense because the lead document is self contained and the admin queries are well served by compound indexes.",
    },
    {
      question: "How do I create efficient indexes for a MongoDB admin dashboard?",
      answer:
        "Start by listing the actual queries your dashboard runs. The most common pattern is filtering by status and sorting by date, which needs a compound index on { status: 1, created_at: -1 }. Add a text index if you have a search box and single field indexes for exact lookups like email. Avoid indexing every field. Build indexes around the queries you run and verify with explain() that they are being used.",
    },
    {
      question: "How do I validate data before inserting into MongoDB with FastAPI?",
      answer:
        "Use Pydantic models as your validation layer. Define a request model with field types, constraints (min/max length, email format, enum values), and defaults. FastAPI automatically validates incoming requests against the model and returns a 422 error with field level details if validation fails. The validated data is then safe to insert into MongoDB.",
    },
    {
      question: "What is cursor based pagination and why is it better than skip/limit?",
      answer:
        "Cursor based pagination uses the last document's sort key (like created_at and _id) to fetch the next page, rather than skipping a fixed number of documents. Skip/limit slows down on large collections because MongoDB still traverses the skipped documents. Cursor based pagination is consistently fast regardless of which page you are on because it uses an index to jump directly to the right position.",
    },
  ],
  takeaway:
    "A MongoDB Atlas lead funnel works well when the document represents a clear business event, Pydantic validates data before it reaches the database, indexes match the actual admin queries, and the API layer keeps database details away from the frontend. Start simple, index deliberately, and let the managed infrastructure handle the operations.",
  relatedLink: {
    label: "Read the weROI case study",
    href: "/projects/weroi",
  },
});
