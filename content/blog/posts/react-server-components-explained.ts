import { withReadingMeta } from "../types";

export const reactServerComponentsExplainedPost = withReadingMeta({
  id: "react-server-components-explained",
  title: "React Server Components explained simply for Next.js developers",
  blurb:
    "Learn how React Server Components work in Next.js, what runs on the server, when to use client components, and how to avoid common architecture mistakes.",
  tag: "React",
  date: "July 2026",
  publishedAt: "2026-07-15",
  href: "/blog/react-server-components-explained",
  image: "/blog/react-server-components-explained.png",
  primaryKeyword: "React Server Components explained",
  secondaryKeywords: [
    "Next.js Server Components",
    "use client explained",
    "Server vs Client Components",
    "React Server Components data fetching",
  ],
  intro: [
    "React Server Components are easier to understand when you stop thinking of them as a faster version of server side rendering. A Server Component is a component whose code executes on the server and whose rendered result is sent to React. Its JavaScript does not become part of the browser bundle. A Client Component is the familiar interactive React component that can use state, effects, event handlers, and browser APIs.",
    "In the Next.js App Router, components are Server Components by default. That single default changes where data fetching happens, how much JavaScript reaches the browser, and where you draw interactive boundaries. I use Server Components for content and data access, then add small Client Components where interaction begins. This guide explains that model without treating the server and browser as opposing camps.",
  ],
  sections: [
    {
      heading: "What React Server Components actually send to the browser",
      paragraphs: [
        "A traditional client rendered React application sends component JavaScript to the browser, then React runs it to produce the interface. A Server Component runs before that step on the server. React serializes its result into a special stream that describes elements, props, and references to Client Components. The browser uses that stream to update the React tree.",
        "This means a Server Component can import a database library, read a file, or call an internal service without shipping those dependencies or credentials to users. The browser receives the output, not the implementation. It also means a Server Component cannot keep browser state or respond directly to clicks because its code is not running in the browser.",
      ],
      bullets: [
        "Server Component code stays on the server.",
        "Client Component code is included in the browser bundle.",
        "The server sends a React representation, not only finished HTML.",
        "Secrets can be used on the server, but must never be passed to client props.",
      ],
    },
    {
      heading: "Server Components are not the same as server side rendering",
      paragraphs: [
        "Server side rendering, usually shortened to SSR, produces HTML for an initial request so users see content before client JavaScript loads. The browser then hydrates the same component code to make it interactive. That component still exists on both sides. React Server Components have a different boundary because their implementation never hydrates in the browser.",
        "Next.js can combine both ideas. It may render Server and Client Components into HTML on the server for the first visit. The Client Components later hydrate, while Server Components remain server only. On navigation, the router can request a new Server Component payload and merge it into the current tree without reloading the whole document.",
      ],
    },
    {
      heading: "What belongs in a Server Component",
      paragraphs: [
        "Server Components are a strong default for pages, layouts, article content, product details, and data driven lists. They can await data directly, keep access tokens and database clients out of the browser, and reduce client JavaScript. If a component only turns data into markup, it probably does not need to be a Client Component.",
        "I also keep expensive formatting and content assembly on the server. A blog page can load a typed post, create structured data, and render the article without sending the complete content system to the browser. The result is a smaller bundle and a clearer security boundary.",
      ],
      code: {
        label: "A Server Component that loads data directly",
        language: "tsx",
        code: `import { notFound } from "next/navigation";
import { getProject } from "@/data/projects";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <article>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
    </article>
  );
}`,
      },
    },
    {
      heading: "When to add use client",
      paragraphs: [
        "The use client directive marks a boundary. The file and the modules it imports become part of the client graph. Add it when a component needs useState, useEffect, event handlers, context that changes in the browser, or APIs such as localStorage and IntersectionObserver. You do not add it merely because a Server Component renders a Client Component.",
        "Place the boundary as low as practical. If a navigation bar has one mobile menu button, the entire page does not need to become client code. Keep the layout and links on the server, then isolate menu state in a small Client Component. This pattern preserves server rendering while still providing rich interaction.",
      ],
      code: {
        label: "A small interactive client boundary",
        language: "tsx",
        code: `"use client";

import { useState } from "react";

export function MenuToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      {open && <nav aria-label="Mobile">...</nav>}
    </div>
  );
}`,
      },
    },
    {
      heading: "How data crosses the server and client boundary",
      paragraphs: [
        "Server Components can pass serializable props to Client Components. Strings, numbers, booleans, arrays, plain objects, and supported React values work well. Database connections, class instances, and arbitrary functions do not. Event handlers must be defined in client code, while server actions use a specific framework protocol.",
        "I shape data before it crosses the boundary. Instead of passing a complete database record, I select the fields the interface needs. This reduces payload size and prevents accidental exposure of internal fields. The prop type becomes a public contract between the server feature and the interactive component.",
      ],
      code: {
        label: "Passing a small serializable view model",
        language: "tsx",
        code: `export default async function SearchPage() {
  const records = await loadProjects();
  const options = records.map((project) => ({
    id: project.id,
    label: project.title,
    category: project.category,
  }));

  return <ProjectFilter options={options} />;
}

// ProjectFilter.tsx begins with "use client"
// and receives only the fields needed for filtering.`,
      },
    },
    {
      heading: "Fetching, caching, streaming, and Suspense",
      paragraphs: [
        "Because Server Components can be async, data fetching can live beside the markup that needs it. Next.js decides whether output is static, cached, revalidated, or dynamic based on the APIs and configuration you use. The important design question is how fresh the data must be, not whether every request should use the same rendering mode.",
        "Suspense lets the server stream useful parts of a page while slower regions continue loading. Put a boundary around a meaningful independent section, such as recommendations or analytics, and provide a stable fallback. Do not wrap every small component in Suspense. Too many loading transitions make the page feel fragmented and can cause layout movement.",
      ],
      bullets: [
        "Fetch data in the component closest to the server rendered feature.",
        "Choose caching from business freshness requirements.",
        "Use parallel requests when data sources are independent.",
        "Place Suspense around meaningful regions with stable dimensions.",
        "Measure the result instead of assuming server rendering is automatically faster.",
      ],
    },
    {
      heading: "Common mistakes in Server Component architecture",
      paragraphs: [
        "The largest mistake is adding use client to a page or layout because one descendant needs state. That pulls a broad import tree into the client bundle and removes the ability to use server only modules there. Extract the interactive part instead. Another mistake is importing a Server Component into a Client Component. Pass server rendered content through children rather than making client code own the server module.",
        "Developers also create request waterfalls by awaiting data in a parent before starting unrelated child work. Start independent promises together or let separate server branches load in parallel. Finally, never assume a hidden prop is secret. Anything passed to a Client Component can reach the browser and should be safe for a user to inspect.",
      ],
    },
    {
      heading: "A practical way to plan a Next.js page",
      paragraphs: [
        "I begin with the page as a Server Component. I mark data sources, content regions, and SEO metadata. Then I circle the interactions: filter controls, modal state, form feedback, animation triggers, and browser storage. Each interactive island becomes a Client Component with the smallest useful prop contract.",
        "After implementation I inspect the bundle and test navigation with JavaScript slowed down. The goal is not to eliminate client code. The goal is to spend browser JavaScript where it creates user value. A form that validates immediately deserves client logic. A heading that only displays database text does not.",
      ],
    },
  ],
  faqs: [
    {
      question: "Are React Server Components rendered on every request?",
      answer:
        "Not necessarily. In Next.js they may be prerendered, cached, revalidated, or rendered dynamically depending on the route and data APIs. Server Component describes where code runs, while caching describes when its result is produced.",
    },
    {
      question: "Can a Server Component use useState or useEffect?",
      answer:
        "No. Those hooks depend on a persistent browser runtime. Move the interactive region into a Client Component and pass it serializable data from the Server Component.",
    },
    {
      question: "Can a Server Component render a Client Component?",
      answer:
        "Yes, and this is the normal architecture. A Server Component can import and render a Client Component. The client boundary begins at the file with use client and includes its imported dependency graph.",
    },
    {
      question: "Do React Server Components improve SEO?",
      answer:
        "They can support strong SEO because content can be rendered on the server and included in initial HTML, but SEO depends on metadata, crawlable content, links, performance, and quality. Server Components are an implementation tool, not an automatic ranking boost.",
    },
    {
      question: "Should every Next.js component be a Server Component?",
      answer:
        "No. Use Server Components as the default for content and server data, then use Client Components for interaction and browser behavior. A useful application deliberately contains both.",
    },
  ],
  takeaway:
    "React Server Components keep noninteractive rendering and data access on the server, while Client Components own browser interaction. Start server first, add small client boundaries, pass minimal serializable data, and choose caching from real freshness needs.",
});
