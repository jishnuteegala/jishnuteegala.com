import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "public/cv/jishnu-teegala-cv-light.pdf";
const data = new Uint8Array(readFileSync(file));
const doc = await getDocument({ data }).promise;

let full = "";
for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  const items = content.items
    .filter((i) => i.str.trim())
    .map((i) => ({ str: i.str, x: i.transform[4], y: i.transform[5] }))
    .sort((a, b) => (Math.abs(b.y - a.y) > 2 ? b.y - a.y : a.x - b.x));
  const lines = [];
  let lastY = null;
  let line = "";
  for (const item of items) {
    if (lastY !== null && Math.abs(item.y - lastY) > 2) {
      if (line.trim()) lines.push(line.trim());
      line = "";
    }
    line += item.str + " ";
    lastY = item.y;
  }
  if (line.trim()) lines.push(line.trim());
  full += `\n=== PAGE ${p} ===\n` + lines.join("\n");

  const annots = await page.getAnnotations();
  const urls = annots.filter((a) => a.url).map((a) => a.url);
  if (urls.length) full += "\n[links] " + urls.join(" ");
}
console.log(full);
console.log("\n=== STATS ===");
console.log("pages:", doc.numPages);
console.log("chars:", full.length);
const checks = [
  ["name", /Jishnu Teegala/],
  ["email", /hi@jishnuteegala\.com/],
  ["section: Profile", /Profile/],
  ["section: Experience", /Experience/],
  ["section: Education", /Education/],
  ["section: Skills", /Skills/],
  ["section: Certifications", /Certifications/],
  ["dates present", /20\d\d/],
  ["no ligature junk", /^[^\uFFFD]*$/],
];
for (const [label, re] of checks) {
  console.log(re.test(full) ? "PASS" : "FAIL", "-", label);
}
