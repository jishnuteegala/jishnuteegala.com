import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "C:/msys64/tmp/opencode/shots";
mkdirSync(OUT, { recursive: true });

const routes = ["/", "/cv", "/projects", "/labs", "/design-system", "/privacy", "/blog"];
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const themes = ["light", "dark"];

const only = process.argv[2];

const browser = await chromium.launch();
for (const vp of viewports) {
  for (const theme of themes) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const route of routes) {
      if (only && route !== only) continue;
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        localStorage.setItem("theme", t);
        document.documentElement.dataset.theme = t;
      }, theme);
      await page.waitForTimeout(150);
      const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      await page.screenshot({
        path: `${OUT}/${slug}-${vp.name}-${theme}.png`,
        fullPage: true,
      });
      console.log(`${slug}-${vp.name}-${theme}.png`);
    }
    await page.close();
  }
}
await browser.close();
