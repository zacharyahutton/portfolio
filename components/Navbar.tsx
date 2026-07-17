"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, FileText, Menu, X } from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import ThemeToggle from "@/components/ThemeToggle";
import { useResume } from "@/components/ResumeProvider";
import { services } from "@/content/services";
import { profile } from "@/content/profile";
import { resumeLinks } from "@/content/resumeLinks";

const GITHUB_URL = profile.contact.github;

type NavChild = { label: string; href: string; desc?: string };
type NavLink = { id: string; label: string; href?: string; children?: NavChild[] };

const featuredWork: NavChild[] = [
  { label: "weROI platform", href: "/projects/weroi", desc: "Full-stack agency SaaS" },
  { label: "PNTCOG ministry", href: "/projects/pntcog", desc: "Live congregation site" },
  { label: "Tendem Demo Bot", href: "/projects/tendem-demo-bot", desc: "Telegram + LLM chat" },
  { label: "Titan Phone Store", href: "/projects/phone-store-api", desc: "E-commerce API" },
  { label: "View all projects", href: "/projects", desc: "Full archive with filters" },
];

const serviceNav: NavChild[] = services.map((s) => ({
  label: s.navLabel,
  href: `/services/${s.slug}`,
  desc: s.title,
}));

const navModel: NavLink[] = [
  { id: "home", label: "Home", href: "#top" },
  {
    id: "work",
    label: "Work",
    children: [
      { label: "Live preview", href: "#preview", desc: "Scroll the laptop showcase" },
      ...featuredWork,
    ],
  },
  {
    id: "services",
    label: "Services",
    children: [{ label: "All services", href: "/services", desc: "Browse every offering" }, ...serviceNav],
  },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "about", label: "About", href: "#about" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const scrollSpyIds = ["top", "preview", "services", "blog", "about", "contact"];

function resolveHref(href: string, isHome: boolean): string {
  if (href === "#top") return isHome ? "#top" : "/";
  if (href.startsWith("#") && !isHome) return `/${href}`;
  return href;
}

export default function Navbar({ variant = "home" }: { variant?: "home" | "standalone" }) {
  const pathname = usePathname();
  const isHome = variant === "home" && pathname === "/";
  const { openResume } = useResume();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observers: IntersectionObserver[] = [];
    scrollSpyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id === "top" ? "home" : id === "preview" ? "work" : id);
          }
        },
        { rootMargin: "-35% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openNow = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(id);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 140);
  };

  const isActive = (link: NavLink) => {
    if (link.id === "work") {
      if (pathname.startsWith("/projects")) return true;
      if (isHome && activeSection === "work") return true;
    }
    if (link.id === "services") {
      if (pathname.startsWith("/services")) return true;
      if (isHome && activeSection === "services") return true;
    }
    if (link.id === "blog" && pathname.startsWith("/blog")) return true;
    if (isHome && link.href?.startsWith("#")) {
      return activeSection === link.id || (link.id === "home" && activeSection === "home");
    }
    return false;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "border-b border-[var(--color-slate)] bg-[var(--color-obsidian)]/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[var(--page-max-width)] items-center justify-between gap-4 px-5 py-4 lg:px-6">
          <Link
            href="/"
            className="shrink-0 font-condensed text-2xl uppercase leading-none tracking-tight text-[var(--color-paper)]"
            onClick={closeMenu}
          >
            ZH<span className="text-[var(--color-electric-indigo)]">.</span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navModel.map((link) => {
              const active = isActive(link);
              const navItemClass = (isOn: boolean) =>
                `mono-label relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-colors ${
                  isOn
                    ? "bg-[var(--color-electric-indigo)]/15 text-[var(--color-paper)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-electric-indigo)_45%,transparent)]"
                    : "text-[var(--color-ash)] hover:text-[var(--color-paper)]"
                }`;

              if (!link.children) {
                return (
                  <Link
                    key={link.id}
                    href={resolveHref(link.href!, isHome)}
                    className={navItemClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              }
              const open = openDropdown === link.id;
              const wide = link.id === "services";
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => openNow(link.id)}
                  onMouseLeave={closeSoon}
                >
                  <button
                    type="button"
                    className={navItemClass(active || open)}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    onClick={() => setOpenDropdown(open ? null : link.id)}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={2.25}
                      className={`shrink-0 text-[var(--color-paper)] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      } ${active || open ? "opacity-100" : "opacity-80"}`}
                      aria-hidden
                    />
                  </button>
                  {open && (
                    <div
                      className={`dropdown-panel absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 border border-[var(--color-slate)] bg-[var(--color-charcoal)]/98 p-2 backdrop-blur-md ${
                        wide ? "w-[320px]" : "w-[300px]"
                      }`}
                      role="menu"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={resolveHref(child.href, isHome)}
                          role="menuitem"
                          className="group flex flex-col gap-0.5 px-3 py-2.5 transition-colors hover:bg-[var(--color-graphite)]"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="text-sm font-medium text-[var(--color-paper)]">
                            {child.label}
                          </span>
                          {child.desc && (
                            <span className="line-clamp-1 text-xs text-[var(--color-stone)]">
                              {child.desc}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex min-h-[44px] items-center gap-1.5 px-3 sm:px-4"
              aria-label="GitHub"
            >
              <GithubIcon size={14} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-slate)] text-[var(--color-paper)] transition hover:border-[var(--color-electric-indigo)] hover:bg-[var(--color-electric-indigo)]/10"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen premium menu overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-[opacity,visibility] duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-[var(--color-obsidian)]/90 backdrop-blur-xl"
          onClick={closeMenu}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-[var(--color-slate)] bg-[var(--color-charcoal)] shadow-[-24px_0_80px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 100% 0%, rgba(21,0,255,0.28), transparent 55%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 flex items-center justify-between border-b border-[var(--color-slate)] px-6 py-5">
            <div>
              <p className="font-condensed text-2xl uppercase tracking-tight text-[var(--color-paper)]">
                Menu
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-[var(--color-pearl)]">
                <span className="status-dot" />
                Available for work
              </p>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-slate)] text-[var(--color-paper)] transition hover:border-[var(--color-electric-indigo)]"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8">
            <nav className="space-y-1">
              {[
                { label: "Work", href: resolveHref("#preview", isHome) },
                { label: "Services", href: "/services" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: resolveHref("#about", isHome) },
                { label: "Contact", href: resolveHref("#contact", isHome) },
                { label: "Projects", href: "/projects" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="group flex items-center justify-between border-b border-[var(--color-slate)]/70 py-4"
                >
                  <span className="font-condensed text-3xl uppercase tracking-tight text-[var(--color-paper)] transition group-hover:text-[var(--color-electric-indigo)] sm:text-4xl">
                    {item.label}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-[var(--color-ash)] transition group-hover:text-[var(--color-electric-indigo)]"
                    aria-hidden
                  />
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <p className="mono-label mb-4 text-[var(--color-ash)]">Services</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      onClick={closeMenu}
                      className="block rounded-md border border-transparent px-3 py-2.5 text-sm text-[var(--color-pearl)] transition hover:border-[var(--color-slate)] hover:bg-[var(--color-graphite)] hover:text-[var(--color-paper)]"
                    >
                      <span className="mono-label mr-2 text-[var(--color-electric-indigo)]">
                        {s.number}
                      </span>
                      {s.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <p className="mono-label mb-4 text-[var(--color-ash)]">Featured projects</p>
              <ul className="space-y-2">
                {featuredWork.slice(0, 4).map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      onClick={closeMenu}
                      className="flex items-center justify-between py-2 text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                    >
                      <span>{p.label}</span>
                      <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 border-t border-[var(--color-slate)] px-6 py-5">
            <div className="flex flex-wrap gap-2">
              <a
                href={resumeLinks.pdf}
                download="Zach_Hutton_Resume.pdf"
                className="btn-primary min-h-[44px] flex-1 justify-center gap-1.5 sm:flex-none"
                onClick={closeMenu}
              >
                <FileText size={14} />
                Resume PDF
              </a>
              <button
                type="button"
                className="btn-ghost min-h-[44px] flex-1 justify-center sm:flex-none"
                onClick={() => {
                  closeMenu();
                  openResume();
                }}
              >
                View resume
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                aria-label="GitHub"
                onClick={closeMenu}
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                aria-label="LinkedIn"
                onClick={closeMenu}
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href={profile.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                aria-label="Instagram"
                onClick={closeMenu}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={`mailto:${profile.contact.email}`}
                className="ml-auto text-sm text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
                onClick={closeMenu}
              >
                {profile.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
