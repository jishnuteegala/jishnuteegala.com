import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = "C:/msys64/tmp/opencode/shots/preflight";
mkdirSync(OUT, { recursive: true });
const routes = ["/prjets", "/projects/glasspick", "/projects/gta-vi-global-pricing"];
const viewports = [
  { name: "m360", width: 360, height: 780 },
  { name: "t768", width: 768, height: 1024 },
  { name: "d1280", width: 1280, height: 900 },
];
const themes = ["light", "dark"];
const browser = await chromium.launch();
for (const vp of viewports) {
  for (const theme of themes) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const route of routes) {
      await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        localStorage.setItem("theme", t);
        document.documentElement.dataset.theme = t;
      }, theme);
      await page.waitForTimeout(150);
      const slug = route.replace(/\//g, "-").replace(/^-/, "");
      await page.screenshot({ path: `${OUT}/${slug}-${vp.name}-${theme}.png`, fullPage: true });
      console.log(`${slug}-${vp.name}-${theme}`);
    }
    await page.close();
  }
}
await browser.close();
