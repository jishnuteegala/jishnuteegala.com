import { chromium } from "playwright";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const BASE = process.env.PDF_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "public", "cv");

const VARIANTS = [
  { file: "jishnu-teegala-cv-light.pdf", theme: "light", variant: "full" },
  { file: "jishnu-teegala-cv-dark.pdf", theme: "dark", variant: "full" },
  { file: "jishnu-teegala-cv-condensed-light.pdf", theme: "light", variant: "condensed" },
  { file: "jishnu-teegala-cv-condensed-dark.pdf", theme: "dark", variant: "condensed" },
];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
try {
  for (const { file, theme, variant } of VARIANTS) {
    const page = await browser.newPage();
    await page.goto(`${BASE}/cv`, { waitUntil: "networkidle" });
    await page.evaluate(
      ([t, v]) => {
        document.documentElement.dataset.theme = t;
        document.querySelector(".cv-root")?.setAttribute("data-variant", v);
        for (const a of document.querySelectorAll("a[href^='/']")) {
          a.setAttribute("href", `https://jishnuteegala.com${a.getAttribute("href")}`);
        }
      },
      [theme, variant],
    );
    await page.emulateMedia({ media: "print" });
    const out = path.join(OUT_DIR, file);
    await page.pdf({
      path: out,
      format: "A4",
      printBackground: true,
      margin: { top: "11mm", bottom: "11mm", left: "11mm", right: "11mm" },
    });
    const size = statSync(out).size;
    if (size < 10_000) {
      throw new Error(`${file} looks broken (${size} bytes)`);
    }
    console.log(`${file} — ${(size / 1024).toFixed(0)} KB`);
    await page.close();
  }
} finally {
  await browser.close();
}
