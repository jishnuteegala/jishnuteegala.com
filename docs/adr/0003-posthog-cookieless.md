# 0003. PostHog in cookieless anonymous mode, no consent banner

## Status

Accepted

## Context

Owner wants product analytics (custom events: PDF downloads, theme toggles, markdown copies, project clicks), not just traffic counts. Site owner is UK-based, so UK GDPR + PECR apply. Alternatives: Plausible (traffic-only, paid), Vercel Analytics (pageviews only), Umami (weaker events).

## Decision

PostHog (EU cloud, free tier) configured cookieless/anonymous. No cookie banner, because no consent-requiring storage is used (theme preference in localStorage is a functional, user-requested setting exempt under PECR). A `/privacy` page discloses processing (PostHog EU, Vercel hosting). No ToS — no accounts, sales, or UGC.

## Consequences

- Full event instrumentation within free tier (1M events/mo).
- No consent UI to build or maintain; revisit if session replay, cookies, or any UGC feature is ever added.
- Anonymous mode means no cross-session user identification — acceptable, it's a personal site.
