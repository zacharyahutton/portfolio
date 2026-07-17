"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import GithubIcon from "@/components/ui/GithubIcon";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import MagneticButton from "./fx/MagneticButton";
import { profile } from "@/content/profile";

const channelClass =
  "group flex cursor-pointer items-center gap-4 surface-card p-5 transition hover:border-[var(--color-electric-indigo)] hover:bg-[var(--color-graphite)]";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "visitor"}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  return (
    <section id="contact" className="page-section border-t border-[var(--color-slate)] bg-[var(--color-charcoal)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="grid gap-16 lg:grid-cols-2">
          <SectionReveal>
            <div className="text-center lg:text-left">
              <span className="section-kicker">Contact</span>
              <BlurText
                text="Let's build."
                className="font-display mt-4 text-5xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] sm:text-6xl"
                delay={100}
              />
              <p className="mt-6 max-w-md text-[var(--color-pearl)] lg:mx-0 mx-auto">
                Open to internships, co-ops, freelance web builds, and junior full-stack roles. Prefer email or
                LinkedIn for the fastest reply.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md space-y-3 text-left lg:mx-0">
              <label className="block text-xs uppercase tracking-wider text-[var(--color-stone)]">
                Name
                <input
                  name="name"
                  required
                  className="mt-1.5 w-full rounded-[10px] border border-[var(--color-slate)] bg-[var(--color-graphite)] px-4 py-3 text-sm text-[var(--color-paper)] outline-none focus:border-[var(--color-electric-indigo)]"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-xs uppercase tracking-wider text-[var(--color-stone)]">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 w-full rounded-[10px] border border-[var(--color-slate)] bg-[var(--color-graphite)] px-4 py-3 text-sm text-[var(--color-paper)] outline-none focus:border-[var(--color-electric-indigo)]"
                  placeholder="you@company.com"
                />
              </label>
              <label className="block text-xs uppercase tracking-wider text-[var(--color-stone)]">
                Message
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="mt-1.5 w-full resize-y rounded-[10px] border border-[var(--color-slate)] bg-[var(--color-graphite)] px-4 py-3 text-sm text-[var(--color-paper)] outline-none focus:border-[var(--color-electric-indigo)]"
                  placeholder="What do you need built?"
                />
              </label>
              <MagneticButton className="w-full sm:w-auto">
                <button type="submit" className="btn-primary min-h-[44px] w-full justify-center sm:w-auto">
                  <Send size={14} aria-hidden />
                  Send message
                </button>
              </MagneticButton>
              {status === "sent" && (
                <p className="text-xs text-[var(--color-ash)]">Opening your email client…</p>
              )}
            </form>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <div className="mx-auto max-w-md space-y-3 text-left lg:mx-0 lg:ml-auto">
              <p className="mb-4 text-sm text-[var(--color-ash)]">Or reach me directly:</p>
              <a href={`mailto:${profile.contact.email}`} className={channelClass}>
                <Mail className="text-[var(--color-electric-indigo)]" size={22} aria-hidden />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">Email</div>
                  <div className="text-[var(--color-paper)]">{profile.contact.email}</div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--color-stone)]" aria-hidden />
              </a>

              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className={channelClass}>
                <GithubIcon className="text-[var(--color-electric-indigo)]" size={22} />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">GitHub</div>
                  <div className="text-[var(--color-paper)]">@zacharyahutton</div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--color-stone)]" aria-hidden />
              </a>

              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className={channelClass}>
                <LinkedinIcon className="text-[var(--color-electric-indigo)]" size={22} />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">LinkedIn</div>
                  <div className="text-[var(--color-paper)]">Zachary Hutton</div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--color-stone)]" aria-hidden />
              </a>

              <a href={profile.contact.instagram} target="_blank" rel="noopener noreferrer" className={channelClass}>
                <InstagramIcon className="text-[var(--color-electric-indigo)]" size={22} />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">Instagram</div>
                  <div className="text-[var(--color-paper)]">@zachahutton</div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--color-stone)]" aria-hidden />
              </a>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
