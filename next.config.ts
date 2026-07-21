import type { NextConfig } from "next";

const mirror = "/revox-mirror/revox.baseecom.com";

const pageRewrites = [
  "web-developer",
  "graphic-designer",
  "fashion-model",
  "about-me",
  "services",
  "portfolio-page",
  "portfolio-grid",
  "blog",
  "contact-us",
  "our-faq",
  "works/weroi",
].flatMap((slug) => [
  {
    source: `/${slug}`,
    destination: `${mirror}/${slug}/index.html`,
  },
  {
    source: `/${slug}/`,
    destination: `${mirror}/${slug}/index.html`,
  },
  {
    source: `/${slug}/index.html`,
    destination: `${mirror}/${slug}/index.html`,
  },
]);

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: `${mirror}/index.html`,
        },
        {
          source: "/index.html",
          destination: `${mirror}/index.html`,
        },
        {
          source: "/wp-content/:path*",
          destination: `${mirror}/wp-content/:path*`,
        },
        {
          source: "/wp-includes/:path*",
          destination: `${mirror}/wp-includes/:path*`,
        },
        {
          source: "/fonts.googleapis.com/:path*",
          destination: "/revox-mirror/fonts.googleapis.com/:path*",
        },
        {
          source: "/fonts.gstatic.com/:path*",
          destination: "/revox-mirror/fonts.gstatic.com/:path*",
        },
        ...pageRewrites,
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/revox-mirror/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
