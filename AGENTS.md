<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design system

This site maintains a living design system at `/design-system` (src/app/design-system/page.tsx). When adding or changing visual tokens or UI primitives (colors, type scale, spacing, components in src/components/ui/), document them there in the same pass.

# Docs stay in sync

Before finishing any change, check whether it invalidates CONTEXT.md (conventions, event names, tokens), PRODUCT.md, or DESIGN.md — update them in the same pass. Never edit an ADR to match new reality: if a decision changed, write a new ADR that supersedes the old one and mark the old one "Superseded by NNNN".

# Analytics

PostHog (EU, cookieless, autocapture off, disabled on localhost) via `track()` in src/components/analytics.tsx. Placement boundary: generic link _categories_ (PDF, mailto, social, project, outbound) live in the analytics.tsx click delegation — new links need no code; named _feature_ interactions (a toggle, a palette, a copy button) get a co-located `track()` call in their component. `track()` auto-attaches `page` and `theme` to every event. Names are static snake_case with variables as properties, never interpolated into the name. Event registry lives in CONTEXT.md — update it when adding events.

# Web vitals

`pnpm vitals [url]` runs the PageSpeed Insights API (mobile + desktop) against production and exits 1 if any lab Core Web Vital leaves the "good" range. Feedback loop after perf-relevant changes: deploy → `pnpm vitals` → fix the top opportunity it prints → repeat. PostHog also captures real-user web vitals (`capture_performance: { web_vitals: true }`). Expect the numbers to differ: PSI lab data is a throttled synthetic Moto G / desktop run, PostHog is your actual visitors' devices and networks. Treat PSI as the reproducible gate, PostHog field data as the truth over time. Budgets: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (lab proxy: TBT ≤ 200ms).
