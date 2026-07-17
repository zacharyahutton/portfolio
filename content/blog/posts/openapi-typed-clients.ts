import { withReadingMeta } from "../types";

export const openapiTypedClientsPost = withReadingMeta({
  id: "openapi-typed-clients",
  title: "Typed clients from OpenAPI specs: why Zod and codegen changed how I ship",
  blurb:
    "Generate an OpenAPI typed client in TypeScript, validate responses with Zod at runtime, and stop hand written fetch wrappers drifting from your FastAPI spec.",
  tag: "Tooling",
  date: "July 2025",
  publishedAt: "2025-07-18",
  href: "/blog/openapi-typed-clients",
  image: "/blog/openapi-typed-clients.png",
  primaryKeyword: "OpenAPI typed client TypeScript",
  intro: [
    "Every full stack project I have shipped eventually hits the same friction point: the frontend assumes one response shape, the backend returns another, and nobody notices until a user reports a blank screen. An OpenAPI typed client in TypeScript eliminates that entire category of bug by generating request functions and response types from the spec your server already publishes.",
    "I built the OpenAPI DevKit as a small experiment to formalize this workflow. FastAPI gives you an OpenAPI document for free, codegen tools turn that document into a typed client, and Zod adds the runtime validation layer that TypeScript alone cannot provide. This post walks through the full pipeline, the decisions I made, and the patterns I reuse across projects.",
  ],
  sections: [
    {
      heading: "Why hand-written API clients drift",
      paragraphs: [
        "On weROI I started with a simple pattern: a fetch wrapper per endpoint, a TypeScript interface describing the expected body, and a prayer that both sides stayed in sync. For the first few weeks it worked. Then the backend added a nullable field, the frontend did not update, and the admin dashboard silently swallowed leads that had the new shape. The interface file said one thing, the network said another, and TypeScript had no way to know at build time.",
        "The root cause is that a hand-maintained interface is a promise with no enforcement. It compiles even when the server disagrees. An OpenAPI spec is different. It is a machine readable contract published by the server itself. If you generate client code from that contract, the types track the API by definition. Change a response model in FastAPI, regenerate, and the compiler tells you every callsite that needs attention.",
      ],
    },
    {
      heading: "How FastAPI publishes the contract for free",
      paragraphs: [
        "FastAPI produces an OpenAPI 3.x JSON document at /openapi.json from your route decorators and Pydantic models. Every response_model, every Query parameter, every status code you declare ends up in that document. The trick is treating that output as a build artifact rather than documentation nobody reads.",
        "A few habits make the generated spec more useful for codegen. Give your routes explicit operation IDs so the generated method names are readable. Define shared error models so the client knows the shape of a 422 or 401 body. Avoid using plain dict returns because they produce an any-shaped hole in the spec.",
      ],
      code: {
        label: "FastAPI route with explicit operation ID and response model",
        language: "python",
        code: `from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/leads", tags=["leads"])

class LeadOut(BaseModel):
    id: str
    email: str
    status: str
    created_at: str

@router.get(
    "/{lead_id}",
    response_model=LeadOut,
    operation_id="get_lead",
    summary="Retrieve a single lead by ID",
)
async def get_lead(lead_id: str, user=Depends(get_current_admin)):
    lead = await leads_collection.find_one({"_id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadOut(**lead)`,
      },
    },
    {
      heading: "Generating the TypeScript client with OpenAPI codegen",
      paragraphs: [
        "Several tools can consume an OpenAPI document and produce TypeScript. I have used openapi-typescript-codegen, openapi-fetch, and the newer openapi-ts. The choice depends on whether you want a class based client, a fetch wrapper with path inference, or plain type exports. For the OpenAPI DevKit I went with openapi-ts because it outputs clean type definitions that I can pair with my own fetch layer.",
        "The generation step belongs in a script, not a manual copy paste. I keep a small shell command in the project that downloads the live spec from the dev server, runs the generator, and writes the output to a known directory. The generated files are committed so the CI build can type check against them, but they are never edited by hand.",
      ],
      code: {
        label: "Generation script example",
        language: "bash",
        code: `#!/usr/bin/env bash
set -euo pipefail

SPEC_URL="http://localhost:8000/openapi.json"
OUT_DIR="src/api/generated"

echo "Fetching spec from $SPEC_URL"
curl -sf "$SPEC_URL" -o openapi.json

echo "Generating TypeScript types"
npx openapi-ts openapi.json --output "$OUT_DIR"

echo "Done. Review the diff before committing."`,
      },
    },
    {
      heading: "Where TypeScript types stop and Zod starts",
      paragraphs: [
        "TypeScript erases types at compile time. Once the code is running and a response arrives over the network, there is no guarantee that the JSON matches the interface. A stale server deployment, a proxy injecting an error page, or a field that became nullable on the backend can all produce valid JSON that violates the generated type. The code compiles, the app crashes.",
        "Zod solves this by validating data at runtime. You define a schema that describes the expected shape, parse the incoming response through it, and get either a typed result or a structured error. I create Zod schemas that mirror the generated types and use them at the boundary where network data enters the application. This makes mismatches loud and specific instead of silent and confusing.",
      ],
      code: {
        label: "Zod schema matching the generated LeadOut type",
        language: "typescript",
        code: `import { z } from "zod";

export const LeadOutSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  status: z.enum(["new", "contacted", "converted", "closed"]),
  created_at: z.string().datetime(),
});

export type LeadOut = z.infer<typeof LeadOutSchema>;

export async function fetchLead(leadId: string): Promise<LeadOut> {
  const res = await fetch(\`/api/leads/\${leadId}\`, {
    headers: { Authorization: \`Bearer \${getToken()}\` },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const data = await res.json();
  return LeadOutSchema.parse(data);
}`,
      },
    },
    {
      heading: "How I structure the client boundary in a real project",
      paragraphs: [
        "I wrap the generated or Zod validated functions in a thin service layer that the rest of the application imports. This boundary owns authentication injection (attaching the token), error normalization (turning HTTP status codes into domain errors), and retry decisions. Components never call fetch directly and never import from the generated directory.",
        "This separation matters because codegen tools change. I have already switched generators once on the OpenAPI DevKit without touching a single component file. The service layer also makes testing straightforward: mock the service, not the network.",
      ],
      bullets: [
        "Keep one module responsible for attaching auth headers.",
        "Normalize errors into a small set the UI understands (unauthorized, not found, validation, server).",
        "Never import generated files outside the service boundary.",
        "Write integration tests that hit the real spec and verify the Zod schemas still parse.",
      ],
    },
    {
      heading: "OpenAPI codegen pitfalls I have hit",
      paragraphs: [
        "Codegen is not magic, and I have run into real friction. Some generators struggle with discriminated unions, producing a union of every possible shape instead of a clean tagged type. Others flatten nested models into long names that make the generated code hard to navigate. And if your FastAPI app returns responses without a declared model, the generator fills in Record<string, unknown>, which defeats the purpose.",
        "The fix for most of these issues is upstream: make your OpenAPI spec precise. Declare every response model. Use Literal types in Pydantic for discriminators. Avoid returning raw dicts. The cleaner the spec, the better every downstream tool works, including documentation viewers, mock servers, and test generators.",
      ],
      bullets: [
        "Always review the generated diff before committing.",
        "Pin the generator version so upgrades are deliberate.",
        "If a generated type looks wrong, fix the spec first.",
        "Test the full loop: change a backend model, regenerate, verify the compiler catches the callsite.",
      ],
    },
    {
      heading: "The workflow I recommend for new projects",
      paragraphs: [
        "Start by making your FastAPI (or Express, or any framework with OpenAPI support) emit a complete spec. Add explicit operation IDs and response models from day one. Set up a generation script that fetches the spec and writes types to a known directory. Create a service boundary that wraps those types with auth, error handling, and Zod validation. Commit the generated files so CI can type check them. Run the generation script in CI to catch drift between the spec and the committed types.",
        "This entire loop adds maybe 30 minutes of setup and saves hours of debugging mysterious shape mismatches. On the OpenAPI DevKit I measured the before and after: the number of runtime type errors in the frontend dropped to zero after introducing codegen plus Zod validation. The frontend and backend stopped arguing about shapes because the contract was automated.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the best OpenAPI codegen tool for TypeScript in 2025?",
      answer:
        "It depends on what you need. openapi-ts produces clean type exports you can pair with any fetch layer. openapi-fetch gives you a typed fetch wrapper with path inference. openapi-typescript-codegen generates a class based client. I prefer openapi-ts for flexibility, but all three are mature enough for production. Pick the one that matches how your team writes API calls.",
    },
    {
      question: "Do I need Zod if I already generate TypeScript types from OpenAPI?",
      answer:
        "Yes, if you want runtime safety. TypeScript types disappear after compilation. A generated interface cannot catch a backend returning null where the type says string. Zod validates the actual data at the boundary where it enters your app. The two layers complement each other: codegen for build time correctness, Zod for runtime correctness.",
    },
    {
      question: "Can I use OpenAPI codegen with FastAPI and a React frontend?",
      answer:
        "Absolutely. FastAPI auto-generates the OpenAPI spec from your Pydantic models and route decorators. You fetch that spec, run a codegen tool, and get TypeScript types or a full client for your React app. I use this exact setup on weROI and the OpenAPI DevKit. The key is treating the spec as a build artifact and regenerating on every backend change.",
    },
    {
      question: "How do I keep generated types in sync when the backend changes?",
      answer:
        "Add the generation script to your CI pipeline. After the backend builds, fetch the spec, regenerate types, and run the TypeScript compiler. If the generated types changed and the frontend has not been updated, the build fails. Locally, I run the script before opening a PR so I catch drift early.",
    },
    {
      question: "Is OpenAPI codegen worth it for a small project?",
      answer:
        "Even on a two person project, yes. The setup cost is low (one script, one boundary module) and the payoff starts the first time a backend field changes. I introduced codegen on StudySync, which was a student API, and it caught three type mismatches in the first week. Small projects benefit most because they usually lack the test coverage to catch shape errors another way.",
    },
  ],
  takeaway:
    "An OpenAPI typed client in TypeScript replaces hand-maintained interfaces with automated contracts. Codegen handles build time types, Zod handles runtime validation, and a clean service boundary keeps the rest of your app decoupled from generator details. The setup takes 30 minutes. The debugging it prevents is worth days.",
  relatedLink: {
    label: "View the OpenAPI DevKit project",
    href: "/projects/openapi-devkit",
  },
});
