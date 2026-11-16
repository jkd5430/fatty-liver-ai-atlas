import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(projectRoot, "site/data/experiments.json");
const indexPath = resolve(projectRoot, "site/index.html");
const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "site/index.html",
  "site/404.html",
  "site/assets/styles.css",
  "site/assets/app.js",
  "site/data/experiments.json",
  ".github/workflows/pages.yml"
];

const errors = [];
const statuses = new Set(["confirmed", "provisional", "method"]);
const sensitivePatterns = [
  { label: "Windows 絕對路徑", pattern: /[A-Za-z]:\\/ },
  { label: "Linux 掛載路徑", pattern: /\/mnt\// },
  { label: "疑似病歷號欄位", pattern: /(?:病歷號|medical[_ -]?record|patient[_ -]?id)/i },
  { label: "疑似姓名欄位", pattern: /(?:姓名|patient[_ -]?name)/i }
];

function requireString(value, path) {
  if (typeof value !== "string" || value.trim() === "") errors.push(`${path} 必須是非空字串`);
}

for (const relative of requiredFiles) {
  try {
    await access(resolve(projectRoot, relative));
  } catch {
    errors.push(`缺少必要檔案：${relative}`);
  }
}

let data;
try {
  data = JSON.parse(await readFile(dataPath, "utf8"));
} catch (error) {
  errors.push(`experiments.json 無法解析：${error.message}`);
}

if (data) {
  if (!data.meta || typeof data.meta !== "object") errors.push("meta 必須是物件");
  if (!Array.isArray(data.experiments) || data.experiments.length === 0) {
    errors.push("experiments 必須是非空陣列");
  } else {
    const ids = new Set();
    const orders = new Set();

    data.experiments.forEach((item, index) => {
      const path = `experiments[${index}]`;
      requireString(item.id, `${path}.id`);
      requireString(item.title, `${path}.title`);
      requireString(item.eyebrow, `${path}.eyebrow`);
      requireString(item.summary, `${path}.summary`);
      requireString(item.finding, `${path}.finding`);
      requireString(item.source, `${path}.source`);

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id ?? "")) errors.push(`${path}.id 只可使用小寫英文、數字與連字號`);
      if (ids.has(item.id)) errors.push(`重複 id：${item.id}`);
      ids.add(item.id);

      if (!Number.isInteger(item.order) || item.order < 0) errors.push(`${path}.order 必須是非負整數`);
      if (orders.has(item.order)) errors.push(`重複 order：${item.order}`);
      orders.add(item.order);

      if (!statuses.has(item.status)) errors.push(`${path}.status 必須是 confirmed、provisional 或 method`);
      if (!Array.isArray(item.tags) || item.tags.length === 0) errors.push(`${path}.tags 至少要有一個標籤`);
      if (!Array.isArray(item.metrics) || item.metrics.length < 1 || item.metrics.length > 3) {
        errors.push(`${path}.metrics 必須包含 1–3 個項目`);
      } else {
        item.metrics.forEach((metric, metricIndex) => {
          requireString(metric.label, `${path}.metrics[${metricIndex}].label`);
          requireString(metric.value, `${path}.metrics[${metricIndex}].value`);
          requireString(metric.note, `${path}.metrics[${metricIndex}].note`);
        });
      }

      const serialized = JSON.stringify(item);
      sensitivePatterns.forEach(({ label, pattern }) => {
        if (pattern.test(serialized)) errors.push(`${path} 包含禁止的${label}`);
      });
    });
  }
}

try {
  const html = await readFile(indexPath, "utf8");
  const localLinks = [...html.matchAll(/(?:href|src)="(?!https?:|#|mailto:)([^"?]+)"/g)].map((match) => match[1]);
  for (const link of localLinks) {
    try {
      await access(resolve(dirname(indexPath), link));
    } catch {
      errors.push(`index.html 的相對資源不存在：${link}`);
    }
  }
} catch (error) {
  errors.push(`無法檢查 index.html：${error.message}`);
}

if (errors.length) {
  console.error("Validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validation passed: ${data.experiments.length} experiments, ${requiredFiles.length} required files.`);
