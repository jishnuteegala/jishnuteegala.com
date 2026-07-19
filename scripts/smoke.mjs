const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const CHECKS = [
  { path: "/", contains: "Jishnu Teegala" },
  { path: "/cv", contains: "DevOps Platforms Engineer" },
  { path: "/projects", contains: "Pinned" },
  { path: "/labs", contains: "Labs" },
  { path: "/blog", contains: "Blog" },
  { path: "/design-system", contains: "Design system" },
  { path: "/privacy", contains: "cookieless" },
  { path: "/llms.txt", contains: "# Jishnu Teegala", type: "text/plain" },
  { path: "/llms-full.txt", contains: "## Experience", type: "text/plain" },
  { path: "/index.md", contains: "# Jishnu Teegala", type: "text/markdown" },
  { path: "/cv.md", contains: "## Experience", type: "text/markdown" },
  { path: "/projects.md", contains: "## Pinned", type: "text/markdown" },
  { path: "/labs.md", contains: "# Labs", type: "text/markdown" },
  { path: "/rss.xml", contains: "<rss" },
  { path: "/sitemap.xml", contains: "<urlset" },
  { path: "/robots.txt", contains: "Sitemap" },
];

let failures = 0;

for (const check of CHECKS) {
  try {
    const res = await fetch(`${BASE}${check.path}`);
    const body = await res.text();
    const problems = [];
    if (res.status !== 200) problems.push(`status ${res.status}`);
    if (!body.includes(check.contains)) problems.push(`missing "${check.contains}"`);
    if (check.type && !(res.headers.get("content-type") ?? "").includes(check.type)) {
      problems.push(`content-type ${res.headers.get("content-type")}`);
    }
    if (problems.length > 0) {
      failures++;
      console.error(`FAIL ${check.path}: ${problems.join(", ")}`);
    } else {
      console.log(`ok   ${check.path}`);
    }
  } catch (err) {
    failures++;
    console.error(`FAIL ${check.path}: ${err.message}`);
  }
}

const PDFS = [
  "jishnu-teegala-cv-light.pdf",
  "jishnu-teegala-cv-dark.pdf",
  "jishnu-teegala-cv-condensed-light.pdf",
  "jishnu-teegala-cv-condensed-dark.pdf",
];
for (const pdf of PDFS) {
  try {
    const res = await fetch(`${BASE}/cv/${pdf}`);
    const buf = await res.arrayBuffer();
    if (res.status !== 200 || buf.byteLength < 10_000) {
      failures++;
      console.error(`FAIL /cv/${pdf}: status ${res.status}, ${buf.byteLength} bytes`);
    } else {
      console.log(`ok   /cv/${pdf} (${(buf.byteLength / 1024).toFixed(0)} KB)`);
    }
  } catch (err) {
    failures++;
    console.error(`FAIL /cv/${pdf}: ${err.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed`);
  process.exit(1);
}
console.log("\nAll smoke checks passed");
