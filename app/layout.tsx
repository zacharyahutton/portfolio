import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zachary Hutton – Full Stack Developer",
  description:
    "Building premium websites, scalable business platforms, AI-powered automation, and custom software. Portmore, Jamaica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
