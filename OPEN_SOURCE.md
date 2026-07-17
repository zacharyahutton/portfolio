# Zachary Hutton Portfolio � Open Source

Personal portfolio site � **Next.js 15**, typed content modules, case studies, and project showcases. Deployed on Vercel.

## Tech stack

| Layer | Tools |
|-------|-------|
| Framework | **Next.js 15** (App Router, Turbopack) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4**, obsidian design tokens |
| Animation | **Framer Motion**, **GSAP** (GooeyNav) |
| Icons | **lucide-react** |
| UI | shadcn-style components in `components/ui/` |
| Theming | **next-themes** (light/dark, localStorage) |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Folder structure

```
app/                  # Next.js App Router (layout, page, globals.css)
components/           # Page sections and layout
content/              # Typed content modules (projects, profile, experience)
lib/utils.ts          # cn() helper and shared constants
public/               # Static assets (resume, case-study images)
brand/instagram/      # Social creative assets (not served by the site)
scripts/              # Resume PDF, cover PNGs, Instagram generators
OPEN_SOURCE.md        # This file
```

## Deploy (Vercel)

1. Import [github.com/zacharyahutton/portfolio](https://github.com/zacharyahutton/portfolio) � repo root is the Next.js app.
2. Build command: `npm run build`. Framework preset: **Next.js**.
3. No environment variables required for the static content site.
4. Optional: add `public/Zach_Hutton_Resume.pdf` and `public/og-image.png`.

## License

MIT