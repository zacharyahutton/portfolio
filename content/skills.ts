import type { SkillCategory } from "./types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Java",
      "SQL",
      "HTML5 / CSS3",
    ],
  },
  {
    name: "Frameworks & libraries",
    items: [
      "React",
      "Next.js",
      "FastAPI",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "SQLAlchemy",
      "Pydantic",
      "Telegram Bot API",
    ],
  },
  {
    name: "Messaging & integrations",
    items: [
      "Webhooks",
      "Async Python",
      "LLM APIs (Groq / OpenAI)",
      "Conversation flows",
      "OAuth & JWT",
      "HMAC signing",
      "Rate limiting",
    ],
  },
  {
    name: "Tools & infrastructure",
    items: [
      "Git & GitHub",
      "Vercel",
      "Railway",
      "MongoDB Atlas",
      "Docker basics",
      "Postman",
      "VS Code / Cursor",
    ],
  },
  {
    name: "Practices",
    items: [
      "REST API design",
      "Responsive UI",
      "Secure coding",
      "CI/CD pipelines",
      "Component architecture",
      "Code review & documentation",
    ],
  },
];
