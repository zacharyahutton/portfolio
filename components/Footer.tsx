import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { resumeLinks } from "@/content/resumeLinks";

const navLinks = [
  { label: "Work", href: "/#preview" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const projectLinks = [
  { label: "weROI", href: "/projects/weroi" },
  { label: "PNTCOG", href: "/projects/pntcog" },
  { label: "Tendem Bot", href: "/projects/tendem-demo-bot" },
  { label: "Phone Store API", href: "/projects/phone-store-api" },
  { label: "All projects", href: "/projects" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-slate)] bg-[var(--color-charcoal)]">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,0.7fr)] lg:gap-12">
          <div>
            <Link
              href="/"
              className="font-condensed text-3xl uppercase tracking-tight text-[var(--color-paper)]"
            >
              ZH<span className="text-[var(--color-electric-indigo)]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-pearl)]">
              Full stack developer in Portmore, Jamaica, shipping web platforms, APIs, and Telegram bots
              with electric indigo precision.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-pearl)]">
              <span className="status-dot" />
              Available for internships &amp; freelance
            </p>
            <a
              href={`mailto:${profile.contact.email}`}
              className="btn-primary mt-6 inline-flex min-h-[44px] items-center gap-1.5"
            >
              Start a conversation
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>

          <div>
            <p className="mono-label mb-4 text-[var(--color-ash)]">Navigate</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={resumeLinks.pdf}
                  download="Zach_Hutton_Resume.pdf"
                  className="text-sm text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                >
                  Resume PDF
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mono-label mb-4 text-[var(--color-ash)]">Services</p>
            <ul className="space-y-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                  >
                    {s.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-[var(--color-electric-indigo)] transition hover:text-[var(--color-paper)]"
                >
                  All services →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mono-label mb-4 text-[var(--color-ash)]">Projects</p>
            <ul className="space-y-2.5">
              {projectLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href={profile.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-slate)] pt-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-[var(--color-stone)]">
              © {year} {profile.name} · Portmore, Jamaica
            </p>
            <p className="mt-1 text-xs tracking-wide text-[var(--color-ash)]">
              Made by Zachary Hutton
            </p>
          </div>
          <p className="text-xs text-[var(--color-stone)]">
            Built with Next.js ·{" "}
            <a
              href="/OPEN_SOURCE.md"
              className="underline underline-offset-2 hover:text-[var(--color-pearl)]"
            >
              View source
            </a>
            {" · "}
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-pearl)]"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
