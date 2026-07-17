import type { Metadata } from "next";
import { DM_Sans, Syne, Anton, IBM_Plex_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ResumeProvider from "@/components/ResumeProvider";
import SiteChrome from "@/components/fx/SiteChrome";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const anton = Anton({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["400"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zachary-hutton-portfolio.vercel.app"),
  title: "Zachary Hutton · Full-Stack Developer · Web · Bots",
  description:
    "Full-stack web developer and messaging-bot engineer in Jamaica. Production platforms, APIs, and Telegram bots. Open to internships, co-ops, and freelance.",
  openGraph: {
    title: "Zachary Hutton · Portfolio",
    description:
      "Full-stack web developer · messaging bots · security-aware engineer. Based in Jamaica.",
    type: "website",
    url: "https://zachary-hutton-portfolio.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zachary Hutton · Portfolio",
    description: "Full-stack web developer · messaging bots · security-aware engineer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${syne.variable} ${anton.variable} ${plexMono.variable} antialiased`}>
        <ThemeProvider>
          <ResumeProvider>
            <SiteChrome />
            <div className="relative z-[1]">{children}</div>
          </ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
