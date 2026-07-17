"use client";

/** Canonical static resume served from `public/`. */
export const RESUME_PDF_HREF = "/Zach_Hutton_Resume.pdf";
export const PDF_FILENAME = "Zach_Hutton_Resume.pdf";

/**
 * Downloads the latest static resume PDF from public/.
 * Prefer this over @react-pdf generation so the site matches the curated PDF.
 */
export async function downloadResumePdf(filename = PDF_FILENAME): Promise<void> {
  const res = await fetch(RESUME_PDF_HREF);
  if (!res.ok) {
    throw new Error(`Resume PDF not found (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
