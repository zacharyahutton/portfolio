"use client";

import type { IconType } from "react-icons";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiOpenjdk,
  SiMysql,
  SiHtml5,
  SiReact,
  SiNextdotjs,
  SiFastapi,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiSqlalchemy,
  SiPydantic,
  SiTelegram,
  SiGithub,
  SiVercel,
  SiRailway,
  SiMongodb,
  SiDocker,
  SiPostman,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import {
  FaShieldAlt,
  FaExchangeAlt,
  FaComments,
  FaCode,
  FaLock,
  FaCogs,
  FaMobileAlt,
  FaCheckDouble,
  FaProjectDiagram,
  FaBookOpen,
  FaKey,
  FaBolt,
  FaRobot,
} from "react-icons/fa";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { skillCategories } from "@/content/skills";

const ICON_MAP: Record<string, IconType> = {
  Python: SiPython,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Java: SiOpenjdk,
  SQL: SiMysql,
  "HTML5 / CSS3": SiHtml5,
  React: SiReact,
  "Next.js": SiNextdotjs,
  FastAPI: SiFastapi,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  SQLAlchemy: SiSqlalchemy,
  Pydantic: SiPydantic,
  "python-telegram-bot": SiTelegram,
  "Telegram Bot API": SiTelegram,
  "Messaging platforms": FaComments,
  Webhooks: FaExchangeAlt,
  "Conversation flows": FaProjectDiagram,
  "Async Python": FaBolt,
  "LLM integration": FaRobot,
  "LLM APIs (Groq / OpenAI)": FaRobot,
  aiosqlite: SiMysql,
  "OAuth & JWT": FaKey,
  "HMAC signing": FaLock,
  "Rate limiting": FaShieldAlt,
  "Git & GitHub": SiGithub,
  Vercel: SiVercel,
  Railway: SiRailway,
  "MongoDB Atlas": SiMongodb,
  "Docker basics": SiDocker,
  Postman: SiPostman,
  "VS Code / Cursor": VscVscode,
  "REST API design": FaCode,
  "Responsive UI": FaMobileAlt,
  "Secure coding": FaShieldAlt,
  "CI/CD pipelines": FaCogs,
  "Component architecture": FaProjectDiagram,
  "Code review & documentation": FaBookOpen,
};

function SkillIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? FaCheckDouble;
  return (
    <span
      className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[var(--color-electric-indigo)]"
      aria-hidden
    >
      <Icon size={16} />
    </span>
  );
}

export default function SkillsToolkit() {
  return (
    <section id="toolkit" className="page-section border-t border-[var(--color-slate)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)] text-center">
        <SectionReveal>
          <span className="section-kicker">Skills</span>
          <BlurText
            text="Stack & practices"
            className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
            delay={80}
          />
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-pearl)]">
            Languages, frameworks, messaging bots, and tooling I reach for when building APIs, webhooks, frontends,
            and production deployments.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {skillCategories.map((category, i) => (
            <SectionReveal key={category.name} delay={i * 0.06}>
              <article className="surface-card flex h-full flex-col p-5 text-left sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-paper)]">
                  {category.name}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-pearl)]"
                    >
                      <SkillIcon name={item} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
