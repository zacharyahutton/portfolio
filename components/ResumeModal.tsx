"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { downloadResumePdf, RESUME_PDF_HREF } from "@/lib/resumePdf";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleDownloadPdf = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadResumePdf();
    } catch {
      window.open(RESUME_PDF_HREF, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  const handleOpenPdf = useCallback(() => {
    window.open(RESUME_PDF_HREF, "_blank", "noopener,noreferrer");
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-slate)] bg-[var(--color-charcoal)] px-4 py-3 sm:px-6">
        <h2 className="text-sm font-medium text-[var(--color-paper)]">Resume</h2>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleOpenPdf}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-[var(--color-slate)] px-3 text-xs text-[var(--color-pearl)] transition hover:border-[var(--color-paper)] sm:inline-flex"
          >
            <ExternalLink size={14} />
            Open PDF
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-slate)] px-3 text-xs text-[var(--color-pearl)] transition hover:border-[var(--color-paper)] disabled:opacity-60"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{downloading ? "Saving..." : "Download PDF"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-slate)] text-[var(--color-pearl)] transition hover:border-[var(--color-paper)]"
            aria-label="Close resume"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-4">
        <iframe
          src={`${RESUME_PDF_HREF}#view=FitH`}
          title="Zachary Hutton Resume"
          className="h-full min-h-[70vh] w-full flex-1 rounded-sm border border-[var(--color-slate)] bg-white"
        />
      </div>
    </div>
  );
}
