import type { Profile } from "./types";

export const profile: Profile = {
  name: "Zachary Hutton",
  headline: "Full stack web developer · messaging bots · security aware engineer",
  tags: ["Computer Science", "Full Stack Development", "Messaging Bots", "Cybersecurity", "UTech"],
  oneLiner:
    "Portmore based builder: production web platforms, APIs that stay up, and Telegram bots that actually reply. UTech CS (GPA 3.7), open to internships, co ops, and freelance that ships.",
  about: [
    "I'm a Computer Science student at the University of Technology, Jamaica. Dean's List, GPA 3.7. I treat coursework like raw material. Data structures, databases, networking: I don't leave them in lecture slides. They show up in the APIs I write and the bots I deploy.",
    "Day to day I ship full stack web apps and messaging bots: Telegram Bot API, FastAPI webhooks, async Python, LLM chat with Groq and OpenAI. On personal time I keep open source demos alive, grind OWASP and PortSwigger labs, and tighten the habits that keep production code from embarrassing you.",
    "Contract and freelance taught me the unglamorous skills: scope tightly, talk clearly, deliver on time. Whether you need a ministry site that survives Sunday traffic, an agency platform with real admin, or a bot that books appointments without ghosting users, I build for the handoff, not just the demo.",
  ],
  stats: [
    { value: "GPA 3.7", label: "UTech BSc CS" },
    { value: "Dean's List", label: "Academic honour" },
    { value: "3+", label: "Live products" },
    { value: "Open", label: "Internships & freelance" },
    { value: "Jamaica", label: "Kingston · remote OK" },
  ],
  contact: {
    email: "hzach577@gmail.com",
    github: "https://github.com/zacharyahutton",
    linkedin: "https://www.linkedin.com/in/zachary-hutton-a2ab81415/",
    instagram: "https://www.instagram.com/zachahutton/",
    location: "Portmore, Jamaica",
  },
};

export const csecFootnote =
  "CSEC, Grade I in all subjects: Information Technology, English A, Mathematics, Additional Mathematics, Physics, Principles of Accounts, Principles of Business, Industrial Technology (Electrical), and Social Studies. Ardenne High School.";
