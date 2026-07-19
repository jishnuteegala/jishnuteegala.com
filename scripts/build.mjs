import { spawn, execSync } from "node:child_process";

const PORT = 4321;

function waitForServer(url, timeoutMs = 90_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve(undefined);
      } catch {
        /* not up yet */
      }
      if (Date.now() - start > timeoutMs) return reject(new Error("server never came up"));
      setTimeout(tick, 1000);
    };
    tick();
  });
}

console.log("[build] running next build…");
execSync("pnpm exec next build", { stdio: "inherit" });

if (process.env.VERCEL) {
  console.log(
    "[build] Vercel build machine can't run Chromium — using committed PDFs from public/cv/",
  );
  const { readdirSync } = await import("node:fs");
  const pdfs = readdirSync("public/cv").filter((f) => f.endsWith(".pdf"));
  if (pdfs.length < 4) {
    throw new Error(
      `expected 4 committed PDFs in public/cv/, found ${pdfs.length} — run pnpm generate:pdf locally and commit`,
    );
  }
  console.log(`[build] found ${pdfs.length} PDFs: ${pdfs.join(", ")}`);
  process.exit(0);
}

console.log("[build] ensuring chromium is installed…");
execSync("pnpm exec playwright install chromium", { stdio: "inherit" });

console.log("[build] starting production server for PDF generation…");
const server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  shell: true,
});

try {
  await waitForServer(`http://localhost:${PORT}/cv`);
  console.log("[build] generating CV PDFs…");
  execSync("node scripts/generate-pdfs.mjs", {
    stdio: "inherit",
    env: { ...process.env, PDF_BASE_URL: `http://localhost:${PORT}` },
  });
} finally {
  if (process.platform === "win32") {
    try {
      execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
    } catch {
      /* already dead */
    }
  } else {
    server.kill("SIGTERM");
  }
}

console.log("[build] done — PDFs are in public/cv/");
