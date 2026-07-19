# jishnuteegala.com

Personal site of Jishnu Teegala — CV, projects, labs, and a scaffolded blog.

Next.js (App Router) · TypeScript · Tailwind v4 · pnpm · deployed on Vercel.

## Principles

- **One source of truth, many projections.** CV content lives in `src/data/cv.ts`; the `/cv` page, its markdown variant, and all four PDFs (full/condensed × light/dark) are generated from it and cannot drift.
- **Agents are readers too.** Everything is server-rendered and semantic. Every content page has a `.md` variant; `/llms.txt` and `/llms-full.txt` are generated from the same data.
- **The site is the portfolio.** Quiet, typography-led design; near-monochrome with one accent; light/dark/system themes.

## Commands

```bash
pnpm dev            # dev server
pnpm build          # generate CV PDFs (headless Chromium), then next build
pnpm generate:pdf   # regenerate PDFs against a running dev server
pnpm smoke          # smoke checks against a running server
pnpm lint           # oxlint
pnpm format         # oxfmt --check
pnpm typecheck      # tsc --noEmit
```

## Content

- **CV** — edit `src/data/cv.ts`. Each bullet is tagged `highlight` or `detail`; condensed views show highlights only.
- **Blog** — drop an `.mdx` file in `content/blog/` with `title`, `date`, `description` frontmatter and push. Invalid frontmatter fails the build. The blog stays hidden from navigation until a post exists.
- **Projects** — pins and narrative in `src/data/projects.ts`; everything else comes live from the GitHub API (hourly cache).
- **Labs** — register entries in `src/data/labs.ts` and add routes under `src/app/labs/`.

## Docs

- `CONTEXT.md` — glossary of domain terms
- `docs/adr/` — architecture decision records
- `.env.example` — every variable is optional; the site degrades gracefully
