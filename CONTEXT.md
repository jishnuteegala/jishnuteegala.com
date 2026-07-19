# CONTEXT

Glossary of terms for jishnuteegala.com.

## Terms

### CV

The single structured source of truth for résumé content (typed data, not prose pages). All projections — the `/cv` route, its markdown variant, and the CV PDFs — derive from it and cannot drift. Every bullet is tagged **highlight** or **detail**; wording is concise but loses no nuance from the master CV. Contact: hi@jishnuteegala.com, LinkedIn, GitHub; location "London, UK"; no phone anywhere.

### CV PDF

Artifacts printed from the `/cv` route via headless browser: four variants (full/condensed × light/dark), committed to `public/cv/`. Never hand-exported. Generated locally with `pnpm generate:pdf` (the Vercel build image lacks Chromium, so the build only verifies they exist); whenever `cv.ts` changes they must be regenerated, ATS-checked (`scripts/ats-check.mjs`), and committed alongside. Print layout rules live only inside `@media print`: 11mm margins, 13px body, contact links in a right-aligned header column, visible "•" bullet markers, headings keep with their content and bullets never split across pages. Page-count targets: full ≤ 4pp, condensed ≤ 3pp — the lever is content, not tighter type. The generator rewrites relative hrefs to absolute https://jishnuteegala.com URLs so PDF links work standalone.

### Full / Condensed

The two CV projections: Full shows every bullet; Condensed shows highlight-tagged bullets only. The `/cv` page toggles between them (full by default); both exist as PDFs. The highlight/detail tags control only what Condensed hides — in Full view every bullet renders with equal visual weight, never muted or greyed.

### Lab

A self-contained interactive mini-project living _inside_ the site repo, under a `/labs/*` route. Distinct from a **Project**.

### Project

A repository surfaced on the projects page. Factual metadata (description, stars, language, last-pushed) always comes live from the GitHub API; only pinning and narrative are curated. Copyright-sensitive assets never enter the site repo.

### Deployment home

Where a Project lives on the web. Rule of thumb: analyses/experiments get a subdomain of jishnuteegala.com (e.g. gta-vi-global-pricing.jishnuteegala.com); full-fledged products get their own domain. GitHub orgs are out of scope for now.

### Pinned

The curated allowlist of Projects shown with owner narrative at the top of the projects page and on the home page. Only the repo name and narrative are curated; everything else (including the launch link) is derived. Everything else appears in the live all-repos table (forks excluded by default).

### Launch link

The "launch ↗" affordance on a Project, shown on home pinned entries, the projects page, the all-repos table, project detail pages, and projects.md. "Launch" means a hosted version exists somewhere on the web; it says nothing about whether the project is actively maintained (that is the active/archived status). Derived exclusively from the repo's GitHub `homepage` field via the cached repos fetch — never hardcoded in the site. Setting or clearing the homepage on GitHub (`gh repo edit --homepage`) is the single way to change it everywhere. Homepage values pointing at github.com are normalised to null (a repo linking to itself is not a hosted version).

### Source note

The small "src: {source} · {refresh}" label sitting opposite a section heading (`SectionHead` + `SourceNote` in `src/components/ui/heading.tsx`), naming the data source behind that section at the point of use. The footer Data sources block is the detailed map: each entry names the feature it powers alongside the endpoint and refresh cadence.

### Activity

The contribution heatmaps on the home page: one for GitHub, one for GitLab. Both are fetched server-side from public, token-free endpoints (GitHub's public contributions page fragment; GitLab's `calendar.json`), cached hourly, and rendered as a 53-week CSS grid with a five-step accent colour scale that adapts to theme. Each graph links to the corresponding profile/activity page. If a source is unreachable the graph is omitted rather than erroring.

### Project detail page

The `/projects/[name]` route for every non-fork repo: breadcrumb, CTA strip (Launch in accent, or "no hosted version"; Source), readme rendered in-page with relative URLs rewritten to blob/raw GitHub URLs and the leading H1 stripped, a Facts sidebar (language, stars, status, last push, topics), five recent commits linking to GitHub, and a "More in {language}" related list computed from the cached repos. Repo names across the site link to these pages (forks link to GitHub instead); the pages are in the sitemap with `pushed_at` as lastModified.

### Post

A blog entry: an MDX file in `content/blog/` with typed frontmatter (title, date, description, tags). Publishing = pushing to main. The blog is scaffolded but hidden from navigation until the first Post exists. URLs are dateless: slug = filename minus extension, kebab-case; the date lives in frontmatter. Frontmatter is zod-validated and failures fail the build. Deferred until posts exist: full-content RSS, per-tag feeds, copy-as-markdown affordances on posts, and an age note on old posts.

### Voice

All prose the site publishes as the owner's own words (CV, narratives, copy) follows the voice skill (`~/.agents/skills/voice/SKILL.md`): no em dashes, British spelling, conversational and direct, concrete specifics over adjectives, understatement over boast, no filler qualifiers, no hype, no emoji. The CV profile is first person.

### Theme

Three-way light/system/dark toggle: `data-theme` on the html element plus localStorage, applied by an inline script before paint so there is no flash. Tokens are OKLCH throughout with a green accent; anything that cannot parse `oklch()` (such as `next/og` image generation) must use hex equivalents.

### Flourish

The site's single decorative signature: a deterministic dotted SVG seeded from the domain name, used on the home page. No photos or avatars anywhere; no cards, shadows, rounded corners, or gradients (see DESIGN.md for the full rules).

### Design system

The site's primitives (`src/components/ui/`), tokens (`globals.css`), and their written spec (`DESIGN.md`). The `/design-system` route is its living showcase, rendering the actual components from code. Not a separate artifact (no Storybook); cannot drift from production.

### Primitive

A reusable UI component in `src/components/ui/` (TextLink, Button, TextInput, EntryGrid, headings, meta). Pages compose primitives; one-off styled elements are allowed only where no primitive fits yet.

### Canonical URL

The single real address for any page: https, apex (non-www), no trailing slash. All other variants (http, www) 308-redirect to it; the app emits per-page `<link rel="canonical">` via `alternates.canonical` resolving against `metadataBase`. DNS is Cloudflare (records DNS-only, never proxied) pointing at Vercel; the sitemap is submitted to Google Search Console under the canonical origin.

### Email

hi@jishnuteegala.com is the only published address, used for everything human (casual, formal, recruiters). Receiving: Cloudflare Email Routing forwards to a personal inbox (no mailbox exists on the domain). Sending: a Gmail "Send mail as" alias through smtp.gmail.com with an app password. mail@ is reserved for future service sign-ups; catch-all stays available for ad-hoc per-service addresses. No phone anywhere.

### Data sources

The footer attribution block listing every external endpoint a page fetches, with refresh cadence (name · endpoint · refresh). Passed per-page via the `sources` prop on SiteFooter; pages with no external data say so explicitly. Any new external fetch on a page must be reflected here.

### Colophon

The footer block naming how the site is made: stack (Next.js on Vercel), link to the site source, typefaces (serif Newsreader, sans Geist — both self-hosted via next/font), a live accent-colour swatch, and the copyright line. Sits opposite Data sources in the footer.

### Privacy notice

The `/privacy` page: a short UK-GDPR-compliant statement of what's processed (anonymous cookieless analytics via PostHog EU, hosting via Vercel) and contact details. No cookie banner exists because no consent-requiring storage is used; no ToS exists because there are no accounts, sales, or UGC. It is the single privacy notice for all subdomain deployments too — subdomain sites link to it rather than carrying their own.

### Markdown variant

An agent-friendly plain-markdown rendition of a content page, served at `<path>.md` and surfaced via view/copy-as-markdown affordances on the page. Generated from the same data as the HTML.

### AEO

Agentic Engine Optimization: the site must be fully legible to non-JS agents. All content server-rendered (including live projects data via ISR and both CV variants present in the DOM), semantic HTML, stable URLs, JSON-LD, llms.txt and markdown variants served with correct content types.

### llms.txt

Generated route (not hand-authored): site overview + section links + pointers to markdown variants. Accompanied by `/llms-full.txt`, which inlines the full content of every page.

### Resilience

External fetches must degrade, never break a page. The repos fetch serves the last good result when GitHub rate-limits or fails; activity graphs are omitted when their source is unreachable; GitHub API calls send proper headers (`X-GitHub-Api-Version`, `User-Agent`). No tokens are used anywhere: every external source is a public, unauthenticated endpoint by design.

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, …); history kept clean via amend + force-with-lease while the site is single-author.
- **Analytics**: the PostHog project key (`phc_…`) is public by design and ships in client JS; only private (`phx_…`) keys are secrets. Config is cookieless: memory persistence, no autocapture, no session recording, EU host, loaded deferred so analytics never costs paint. Named events: `cv_pdf_download`, `email_click`, `social_click`, `project_click`, `outbound_click`, `palette_open`, `palette_run`, `theme_toggle`, `markdown_copy`, `open_chatgpt`, `open_claude`. Link clicks are covered by global delegation in analytics.tsx — new links need no code; only non-link interactions need explicit `track()` calls. Real-user web vitals via `capture_performance: { web_vitals: true }`.
- **Prerender purity**: `cacheComponents` forbids uncached non-determinism during static render (e.g. `new Date()` in server components) — use static values or move behind cached fetches. `generateStaticParams` must return at least one entry; empty collections use a sentinel param (e.g. `__no-posts-yet__`).
- **Tooling**: pnpm (not npm/yarn/Bun); oxlint + oxfmt for lint/format; CI runs oxlint, `oxfmt --check`, and `tsc --noEmit` — a formatting diff fails the build.
- **Verification**: UI changes are screenshotted across viewports (`scripts/shots.mjs`) in both themes before committing; `pnpm lint` and `pnpm typecheck` must pass; the Playwright smoke suite (`scripts/smoke.mjs`) checks all routes return 200, markdown/llms routes parse, and the four PDFs exist; deployed changes are spot-checked with curl against the canonical origin. Target: ~100 Lighthouse across the board.
- **Accessibility baseline**: skip-to-content link, `id="main"` on every page, `:focus-visible` accent outlines, `rel="me"` on footer social links.
- **Repo hygiene**: the repo is deliberately public (view-source credibility; everything in it is already public on the site). Secrets live only in Vercel env vars.
- **Icons**: brand icons use official simple-icons paths (CC0); bespoke icons (mail) match the site's hairline style; sources are noted in `src/components/ui/icons.tsx`. The favicon is an italic serif "JT" (`icon.svg` + `favicon.ico` 16/32/48 + `apple-icon.png`).
- **Known failure mode**: pnpm on Windows occasionally loses native bindings (oxlint, `@tailwindcss/oxide`), producing fully unstyled pages (zero Tailwind utilities). Fix: kill node processes, `pnpm install --force`, verify `.text-accent` exists in the CSS bundle.
