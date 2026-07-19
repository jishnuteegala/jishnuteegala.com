# 0004. Projects page: pinned allowlist + live GitHub data, public site repo

## Status

Accepted

## Context

A purely static projects list goes stale; a raw live feed buries good work under forks and course exercises (~20 of the owner's repos are forks/noise). A pinned section over a live, filterable all-repos table gives curation without staleness. Owner's GitLab contains only forks, no original work.

## Decision

- **Pinned**: curated allowlist with owner narrative, in repo data.
- **All repos**: fetched live from the GitHub API (public only, forks excluded by default with a filter toggle), sortable/searchable, ISR-cached.
- No private repos (publicly listing them defeats their privacy); no PAT needed for v1.
- No GitLab integration for v1.
- Site repo is **public** (reverses the earlier private decision): all repo content is already published on the site, secrets live only in Vercel env vars, the unredacted master CV PDF never enters the repo, and a public repo doubles as a portfolio piece.

## Consequences

- Factual repo metadata stays fresh automatically; only pins/narrative need human edits.
- GitHub API rate limits are ample for unauthenticated ISR fetches; add a token only if it ever throttles.
- Revisit GitLab integration if original work lands there.
