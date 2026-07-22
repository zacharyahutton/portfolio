import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://zacharyhutton.online";
const title = "Zachary Hutton, Full Stack Developer";
const description =
  "Zachary Hutton builds premium websites, scalable business platforms, AI-powered automation, and custom software from Portmore, Jamaica.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s, Zachary Hutton",
  },
  description,
  applicationName: "Zachary Hutton",
  authors: [{ name: "Zachary Hutton", url: siteUrl }],
  creator: "Zachary Hutton",
  keywords: [
    "Zachary Hutton",
    "Full Stack Developer",
    "Portmore Jamaica",
    "premium websites",
    "custom software",
    "AI integrations",
    "business platforms",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Zachary Hutton",
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Zachary Hutton, Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/og.png", type: "image/png" }],
    apple: [{ url: "/og.png" }],
  },
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
