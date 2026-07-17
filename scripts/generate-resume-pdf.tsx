import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Curated resume lives at public/Zach_Hutton_Resume.pdf (copied from Downloads).
 * Build must not overwrite it with a generated React-PDF stub.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const canonicalPath = path.join(__dirname, "../public/Zach_Hutton_Resume.pdf");

async function main() {
  if (!fs.existsSync(canonicalPath)) {
    console.error(
      `Missing curated resume at ${canonicalPath}. Copy Zach_Hutton_Resume.pdf into public/ before building.`,
    );
    process.exit(1);
  }
  const { size } = fs.statSync(canonicalPath);
  console.log(`Using curated resume ${canonicalPath} (${size} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
