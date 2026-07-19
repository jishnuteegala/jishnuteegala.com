# 0002. CV PDF generated at build time from structured data

## Status

Accepted

## Context

Hand-exported static PDFs drift from the page over time. Alternatives: (a) build-time headless-browser print of the /cv route, (b) a separate PDF-only layout via react-pdf/typst, (c) static asset.

## Decision

CV content lives as typed structured data (single source of truth). The `/cv` route renders it; a build step prints that route to PDF via Playwright with a dedicated print stylesheet (A4, margins, no chrome). The PDF is served as a download from the CV page.

## Consequences

- Site and PDF cannot drift.
- CI needs headless Chromium (~30s per build).
- If ATS-parseable output is ever needed, the same data can feed a dedicated PDF layout later without restructuring.
