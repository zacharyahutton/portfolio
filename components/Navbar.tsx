"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { FileText } from "lucide-react";

import GithubIcon from "@/components/ui/GithubIcon";

import GooeyNav from "@/components/ui/GooeyNav";

import ThemeToggle from "@/components/ThemeToggle";

import { useResume } from "@/components/ResumeProvider";



const GITHUB_URL = "https://github.com/zacharyahutton";



const homeNavItems = [

  { href: "#highlights", label: "Highlights" },

  { href: "/projects", label: "Projects" },

  { href: "#about", label: "About" },

  { href: "#experience", label: "Experience" },

  { href: "#contact", label: "Contact" },

];



const scrollSpyIds = ["highlights", "about", "experience", "contact"];



interface NavbarProps {

  variant?: "home" | "standalone";

}



export default function Navbar({ variant = "home" }: NavbarProps) {

  const pathname = usePathname();

  const isHome = variant === "home" && pathname === "/";

  const { openResume } = useResume();



  const [scrolled, setScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);



  const navItems = homeNavItems.map((item) => ({

    ...item,

    href: item.href.startsWith("#") && !isHome ? `/${item.href}` : item.href,

  }));



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

            const navIndex = homeNavItems.findIndex((item) => item.href === `#${id}`);

            if (navIndex >= 0) setActiveIndex(navIndex);

          }

        },

        { rootMargin: "-35% 0px -50% 0px", threshold: 0 },

      );



      observer.observe(el);

      observers.push(observer);

    });



    return () => observers.forEach((o) => o.disconnect());

  }, [isHome]);



  const logoHref = isHome ? "#" : "/";



  return (

    <header

      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${

        scrolled ? "border-b border-[var(--color-slate)] bg-[var(--color-obsidian)]/95 backdrop-blur-md" : "bg-transparent"

      }`}

    >

      <nav className="mx-auto flex max-w-[var(--page-max-width)] items-center justify-between gap-4 px-5 py-4 lg:px-6">

        <Link

          href={logoHref}

          className="shrink-0 text-lg font-semibold tracking-tight text-[var(--color-paper)]"

        >

          ZH<span className="text-[var(--color-electric-indigo)]">.</span>

        </Link>



        <div className="hidden flex-1 justify-center lg:flex">

          <GooeyNav

            items={navItems}

            activeIndex={isHome ? activeIndex : -1}

            onActiveChange={isHome ? setActiveIndex : undefined}

            particleCount={8}

          />

        </div>



        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          <ThemeToggle />

          <button

            type="button"

            onClick={openResume}

            className="btn-ghost hidden min-h-[44px] items-center gap-1.5 sm:inline-flex"

          >

            <FileText size={14} />

            Resume

          </button>

          <a

            href={GITHUB_URL}

            target="_blank"

            rel="noopener noreferrer"

            className="btn-primary hidden min-h-[44px] items-center gap-1.5 sm:inline-flex"

          >

            <GithubIcon size={14} />

            GitHub

          </a>



          <button

            type="button"

            className="min-h-[44px] rounded-full border border-[var(--color-slate)] px-3 py-1.5 text-xs text-[var(--color-pearl)] lg:hidden"

            onClick={() => setMenuOpen(!menuOpen)}

            aria-expanded={menuOpen}

            aria-label="Toggle menu"

          >

            {menuOpen ? "Close" : "Menu"}

          </button>

        </div>

      </nav>



      {menuOpen && (

        <div className="border-t border-[var(--color-slate)] bg-[var(--color-obsidian)] px-5 py-4 lg:hidden">

          <ul className="flex flex-col gap-1">

            {navItems.map((link, i) => (

              <li key={link.href}>

                <Link

                  href={link.href}

                  className={`block rounded-full px-4 py-3 text-sm ${

                    isHome && activeIndex === i

                      ? "bg-[var(--color-paper)] text-[var(--color-obsidian)]"

                      : "text-[var(--color-pearl)]"

                  }`}

                  onClick={() => setMenuOpen(false)}

                >

                  {link.label}

                </Link>

              </li>

            ))}

          </ul>

          <div className="mt-4 flex gap-2 border-t border-[var(--color-slate)] pt-4">

            <button

              type="button"

              onClick={() => {

                setMenuOpen(false);

                openResume();

              }}

              className="btn-ghost min-h-[44px] flex-1 justify-center gap-1.5"

            >

              <FileText size={14} /> Resume

            </button>

            <a

              href={GITHUB_URL}

              target="_blank"

              rel="noopener noreferrer"

              className="btn-primary min-h-[44px] flex-1 justify-center gap-1.5"

              onClick={() => setMenuOpen(false)}

            >

              <GithubIcon size={14} /> GitHub

            </a>

          </div>

        </div>

      )}

    </header>

  );

}


