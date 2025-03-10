import fs from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(process.cwd(), "src/templates");

export function getTemplate(templateName, data) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  const template = fs.readFileSync(templatePath, { encoding: "utf8" });
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key]);
}
