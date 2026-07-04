import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, "../brand");
const mdPath = path.join(brandDir, "MINDRIFT_COVER_LETTER.md");
const outputPath = path.join(brandDir, "MINDRIFT_COVER_LETTER.pdf");

function mdToHtml(markdown: string): string {
  const paragraphs = markdown
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (trimmed.startsWith("Dear ") || trimmed.startsWith("Best regards,")) {
        return `<p>${escapeHtml(trimmed)}</p>`;
      }

      if (trimmed.match(/^(July \d|Mindrift|Tendem|Remote|Zachary Hutton|Portmore|hzach|LinkedIn:)/)) {
        return `<p class="meta">${formatInline(trimmed)}</p>`;
      }

      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${formatInline(line.slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${formatInline(trimmed)}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Mindrift Cover Letter — Zachary Hutton</title>
  <style>
    @page { size: letter; margin: 0.85in; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #111;
      max-width: 6.5in;
      margin: 0 auto;
    }
    p { margin: 0 0 0.75em; }
    p.meta { margin-bottom: 0.35em; color: #333; }
    ul { margin: 0 0 0.75em 1.1em; padding: 0; }
    li { margin-bottom: 0.35em; }
    strong { font-weight: 700; }
    a { color: #111; text-decoration: underline; }
  </style>
</head>
<body>
${paragraphs}
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>',
  );
  return html;
}

async function main() {
  const markdown = fs.readFileSync(mdPath, "utf8");
  const html = mdToHtml(markdown);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: outputPath,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.85in", right: "0.85in", bottom: "0.85in", left: "0.85in" },
  });
  await browser.close();
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
