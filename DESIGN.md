# Design

The visual system for jishnuteegala.com. The living, rendered version is at `/design-system`; this file is the written spec. If they disagree, the code wins and this file gets fixed.

## Direction

Quiet, typography-led. Hierarchy comes from type size, weight, and space, not from boxes, cards, or colour fields. Near-monochrome with one accent. The register is a well-set essay page, content-dense where it matters (CV, projects) and generous with whitespace everywhere else.

## Tokens

Defined in `src/app/globals.css` as CSS custom properties, exposed to Tailwind via `@theme inline`. All colours are OKLCH with a 140° green hue thread.

| Token             | Light                    | Dark                     | Role                        |
| ----------------- | ------------------------ | ------------------------ | --------------------------- |
| `--bg`            | `oklch(1 0 0)`           | `oklch(0.145 0.004 140)` | Page background             |
| `--surface`       | `oklch(0.972 0.002 140)` | `oklch(0.19 0.005 140)`  | Code blocks, subtle panels  |
| `--ink`           | `oklch(0.21 0.012 140)`  | `oklch(0.93 0.006 140)`  | Body text, primary buttons  |
| `--muted`         | `oklch(0.45 0.012 140)`  | `oklch(0.7 0.012 140)`   | Secondary text, quiet links |
| `--accent`        | `oklch(0.46 0.09 140)`   | `oklch(0.74 0.1 140)`    | Links, selection            |
| `--border`        | `oklch(0.9 0.005 140)`   | `oklch(0.3 0.008 140)`   | Hairlines, dividers         |
| `--border-strong` | `oklch(0.78 0.008 140)`  | `oklch(0.42 0.01 140)`   | Interactive borders         |

Theming: `data-theme="light|dark"` on `<html>`, set by an inline head script before paint (no FOUC). Three-way preference (light / system / dark) cycles via the header toggle; "system" removes the localStorage entry and follows `prefers-color-scheme`.

## Type

- **Newsreader** (serif, with italics): page titles and section headings.
- **Geist** (sans): body and UI.
- **Geist Mono**: code, tokens, tabular data.

Scale: page title `text-4xl sm:text-5xl` serif · section `text-2xl` serif · entry `text-base font-semibold` · body `text-base` · dense body `text-[0.9375rem]` · meta `text-sm text-muted` · fine print `text-xs text-muted`. Body measure caps at `max-w-prose`. `text-wrap: balance` on h1–h3, `pretty` on paragraphs.

## Layout

One column, `max-w-5xl`, `px-6`, `py-16` — header, stats bar, main, and footer all share the wide shell so desktop space is used. The one exception is `/cv`, which stays `max-w-3xl` for a document-like reading measure (mirrors luna's cv-only narrow exception). Prose blocks cap at `max-w-prose` regardless of shell width so text stays readable. Dated entries use the `entry-grid` two-column pattern: an `8.5rem` left gutter for dates (tabular figures, muted), content right; collapses to stacked on mobile. Sections separated by `mt-16` on pages, `mt-14` equivalents on the CV (`--cv-section`).

## Spacing rhythm

`mt-3` heading→subtitle · `mt-6` heading→content · `space-y-10` between entries · `mt-16` between sections · `py-16` page padding.

## Primitives

Live in `src/components/ui/`, showcased at `/design-system`:

- **TextLink** (`accent` / `quiet` / `ink`): the only link styles on the site. Accent = underlined, offset 4; quiet = muted→ink on hover; ink = ink→accent on hover. Internal hrefs render `next/link`.
- **Button** (`primary` / `secondary` / `ghost`): square corners, `px-3 py-1 text-sm`. Primary is ink-filled; secondary a `border-strong` outline; ghost is text-only.
- **TextInput / Select / Checkbox**: TextInput and Select are underline-only fields (`border-b`) with native chrome suppressed (`appearance: none`, including the search cancel button); Select draws a custom muted SVG chevron (1.25 stroke, matching the hairline register). In Chromium the Select opts into the customizable select (`appearance: base-select` + `::picker(select)`), so the open option list matches the site: bg surface, hairline `border-strong` edge, square corners, no shadow, inherited type, accent-coloured checked option; other browsers fall back to the native popup (`color-scheme` keeps it theme-correct). Checkbox is a custom 16px hairline square (`.checkbox-quiet`) that fills ink with a bg-coloured tick when checked.
- **PageTitle / SectionHeading / EntryHeading**: the three heading levels.
- **EntryGrid / EntryWhen / EntryBody**: the dated-entry layout.
- **MetaText / DateStamp**: secondary text and `en-GB` formatted `<time>`.
- **prose-quiet** (CSS class): long-form MDX styling — accent links, surface code blocks, serif subheadings.

## Rules

- No cards, no shadows, no rounded corners, no gradients, no badges.
- Hairline (`--border`) dividers are the only separators.
- The accent appears only on links, selection, and focused/hovered states.
- Detail-level CV bullets render muted; highlights render ink.
- Print/PDF: chrome hidden via `.no-print` and `@media print`; A4 with `14mm/12mm` margins; entries avoid page breaks.
- Motion: colour/opacity transitions only, 100–200ms; everything honours `prefers-reduced-motion`.
