"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionReveal from "./SectionReveal";
import MagneticButton from "./fx/MagneticButton";
import { downloadResumePdf, RESUME_PDF_HREF } from "@/lib/resumePdf";
import { profile } from "@/content/profile";

export default function HireCTA() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadResumePdf();
    } catch {
      window.open(RESUME_PDF_HREF, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="border-t border-[var(--color-slate)] px-6 py-20">
      <SectionReveal>
        <div className="relative mx-auto max-w-[var(--page-max-width)] overflow-hidden rounded-[var(--radius-cards)] border border-[var(--color-slate)] bg-[var(--color-charcoal)] px-8 py-14 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(21,0,255,0.22), transparent 65%)",
            }}
            aria-hidden
          />
          <p className="section-kicker relative z-10">Ready when you are</p>
          <h2 className="font-display relative z-10 mt-4 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] sm:text-4xl">
            Let&apos;s build something that ships
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-lg text-[var(--color-pearl)]">
            Freelance build, contract sprint, or internship seat. I show up with clear updates,
            production habits, and work you can put in front of a client without flinching.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
            <MagneticButton>
              <a href={`mailto:${profile.contact.email}`} className="btn-primary min-h-[44px]">
                Start a conversation
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </MagneticButton>
            <MagneticButton>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="btn-ghost min-h-[44px]"
              >
                {downloading ? "Saving..." : "Download resume"}
              </button>
            </MagneticButton>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
