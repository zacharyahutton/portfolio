"use client";

import { usePathname } from "next/navigation";
import CustomCursor from "./CustomCursor";
import ScrollProgress from "./ScrollProgress";
import PaperMeshBackground from "./PaperMeshBackground";

export default function SiteChrome() {
  const pathname = usePathname();
  // Hide chrome inside laptop iframe / embed preview
  if (pathname?.startsWith("/projects/preview") || pathname?.startsWith("/embed")) {
    return null;
  }

  return (
    <>
      <PaperMeshBackground />
      <ScrollProgress />
      <CustomCursor />
    </>
  );
}
