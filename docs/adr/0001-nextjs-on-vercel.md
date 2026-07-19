# 0001. Next.js App Router on Vercel

## Status

Accepted

## Context

The site is mostly static content (home, CV, projects, markdown blog) with light interactivity (theme toggle, design-system showcase, labs). Alternatives considered: TanStack Start on Cloudflare Workers, and a custom static generator with htmx on GitHub Pages. Owner's stack preferences: React, TypeScript, Tailwind, Vercel.

## Decision

Next.js (App Router) + TypeScript + Tailwind, deployed to Vercel (Hobby tier). Package manager: pnpm (owner preference; Vercel runtime is Node.js regardless, so the choice is local-tooling-only). Linting/formatting: oxlint + oxfmt. Design details borrowed from the reference sites (FOUC-free 3-way theme toggle, markdown page variants, llms.txt) rather than their infrastructure.

## Consequences

- Vercel Hobby limits (100GB bandwidth, 1M edge requests/mo) are far above expected traffic; Hobby is non-commercial only, which a personal site satisfies.
- MDX blog, route handlers for llms.txt / markdown variants, and OG image generation are all first-class in Next.js.
- Tied to Vercel conveniences (ISR, image optimization); acceptable for a personal site.
