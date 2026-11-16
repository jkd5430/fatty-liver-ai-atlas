import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "SUBMISSION.md",
  ".github/workflows/pages.yml",
  "site/index.html",
  "site/404.html",
  "site/assets/styles.css",
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) {
  throw new Error(`Missing required files: ${missing.join(", ")}`);
}

const indexPath = resolve(root, "site/index.html");
const html = readFileSync(indexPath, "utf8");

for (const id of ["purpose", "topics", "rules", "add-content"]) {
  if (!html.includes(`id="${id}"`)) {
    throw new Error(`Homepage is missing required section: #${id}`);
  }
}

const topicCount = (html.match(/class="topic-card"/g) ?? []).length;
if (topicCount < 1) {
  throw new Error("Homepage must contain at least one topic card.");
}

const forbidden = [/\/mnt\//i, /patient_id/i, /medical_record/i, /病歷號/i, /病患姓名/i];
for (const pattern of forbidden) {
  if (pattern.test(html)) {
    throw new Error(`Potential sensitive or private content found: ${pattern}`);
  }
}

const localLinks = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((link) => !/^(?:https?:|#|mailto:|tel:)/.test(link));

for (const link of localLinks) {
  const file = link.split("#")[0].split("?")[0];
  if (file && !existsSync(resolve(dirname(indexPath), file))) {
    throw new Error(`Broken local link: ${link}`);
  }
}

console.log(`Validation passed: ${topicCount} topic cards, ${requiredFiles.length} required files.`);
