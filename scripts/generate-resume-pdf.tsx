import React from "react";
import { renderToFile } from "@react-pdf/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import ResumePdfDocument from "../components/ResumePdfDocument";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "../public/resume.pdf");
const mindriftCopyPath = path.join(__dirname, "../brand/MINDRIFT_RESUME.pdf");

async function main() {
  await renderToFile(React.createElement(ResumePdfDocument), outputPath);
  fs.copyFileSync(outputPath, mindriftCopyPath);
  console.log(`Wrote ${outputPath}`);
  console.log(`Copied to ${mindriftCopyPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
