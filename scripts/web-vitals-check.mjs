// Web vitals feedback loop: queries the PageSpeed Insights API (same engine as
// https://pagespeed.web.dev/) for mobile + desktop and prints lab metrics plus
// field data (CrUX) when available. Exits 1 if any lab Core Web Vital fails the
// "good" threshold so it can gate CI or an agent fix loop.
//
// Usage: node scripts/web-vitals-check.mjs [url]
// Optional: PSI_API_KEY env var raises the unauthenticated rate limit.

try {
  process.loadEnvFile(".env");
} catch {}

const url = process.argv[2] ?? "https://jishnuteegala.com";
const key = process.env.PSI_API_KEY;

const GOOD = { lcp: 2500, cls: 0.1, tbt: 200, fcp: 1800, si: 3400 };

const AUDITS = [
  ["largest-contentful-paint", "LCP", "ms", GOOD.lcp],
  ["cumulative-layout-shift", "CLS", "", GOOD.cls],
  ["total-blocking-time", "TBT (INP proxy)", "ms", GOOD.tbt],
  ["first-contentful-paint", "FCP", "ms", GOOD.fcp],
  ["speed-index", "Speed Index", "ms", GOOD.si],
];

async function run(strategy) {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", strategy);
  api.searchParams.set("category", "performance");
  if (key) api.searchParams.set("key", key);

  const res = await fetch(api);
  if (!res.ok) throw new Error(`${strategy}: PSI ${res.status} ${await res.text()}`);
  const data = await res.json();

  const lh = data.lighthouseResult;
  const score = Math.round(lh.categories.performance.score * 100);
  console.log(`\n=== ${strategy.toUpperCase()} · performance ${score}/100 ===`);

  let failures = 0;
  console.log("Lab (Lighthouse):");
  for (const [id, label, unit, good] of AUDITS) {
    const a = lh.audits[id];
    if (!a) continue;
    const value = a.numericValue;
    const pass = value <= good;
    if (!pass) failures++;
    const shown = unit === "ms" ? `${Math.round(value)}ms` : value.toFixed(3);
    console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}: ${shown} (good ≤ ${good}${unit})`);
  }

  const field = data.loadingExperience?.metrics;
  if (field && data.loadingExperience.id?.includes(new URL(url).hostname)) {
    console.log("Field (CrUX, 28-day real users):");
    for (const [k, m] of Object.entries(field)) {
      console.log(`  ${m.category}  ${k}: p75 ${m.percentile}`);
    }
  } else {
    console.log("Field (CrUX): no data yet (needs sustained real-user traffic)");
  }

  const opportunities = Object.values(lh.audits)
    .filter((a) => a.details?.type === "opportunity" && a.numericValue > 100)
    .sort((a, b) => b.numericValue - a.numericValue)
    .slice(0, 5);
  if (opportunities.length) {
    console.log("Top opportunities:");
    for (const o of opportunities) {
      console.log(`  - ${o.title} (~${Math.round(o.numericValue)}ms)`);
    }
  }

  return failures;
}

const failures = (await run("mobile")) + (await run("desktop"));
if (failures > 0) {
  console.log(`\n${failures} lab metric(s) above the "good" threshold.`);
  process.exit(1);
}
console.log("\nAll lab metrics in the good range.");
