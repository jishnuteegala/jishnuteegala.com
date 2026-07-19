import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageTitle, SectionHeading, EntryHeading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";
import { Button } from "@/components/ui/button";
import { TextInput, Select, Checkbox } from "@/components/ui/input";
import { EntryGrid, EntryWhen, EntryBody } from "@/components/ui/entry";
import { MetaText, DateStamp } from "@/components/ui/meta";
import {
  MailIcon,
  GitHubIcon,
  GitLabIcon,
  LinkedInIcon,
  XIcon,
  OpenAIIcon,
  ClaudeIcon,
  RssIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Design system",
  description: "The tokens and primitives this site is built from.",
};

const COLORS = [
  { name: "bg", varName: "--bg", role: "Page background" },
  { name: "surface", varName: "--surface", role: "Code blocks, subtle panels" },
  { name: "ink", varName: "--ink", role: "Body text, primary buttons" },
  { name: "muted", varName: "--muted", role: "Secondary text, quiet links" },
  { name: "accent", varName: "--accent", role: "Links, selection, the one colour" },
  { name: "border", varName: "--border", role: "Hairlines, dividers" },
  { name: "border-strong", varName: "--border-strong", role: "Interactive borders" },
];

const TYPE_SCALE = [
  { label: "Page title", cls: "font-serif text-4xl sm:text-5xl", sample: "Page title" },
  { label: "Section heading", cls: "font-serif text-2xl", sample: "Section heading" },
  { label: "Entry heading", cls: "text-base font-semibold", sample: "Entry heading" },
  { label: "Body", cls: "text-base", sample: "Body text at a comfortable measure." },
  { label: "Small body", cls: "text-[0.9375rem]", sample: "CV bullets and dense content." },
  { label: "Meta", cls: "text-sm text-muted", sample: "Secondary information" },
  { label: "Fine print", cls: "text-xs text-muted", sample: "Timestamps, utility links" },
];

const ICONS = [
  { name: "MailIcon", Icon: MailIcon },
  { name: "GitHubIcon", Icon: GitHubIcon },
  { name: "GitLabIcon", Icon: GitLabIcon },
  { name: "LinkedInIcon", Icon: LinkedInIcon },
  { name: "XIcon", Icon: XIcon },
  { name: "OpenAIIcon", Icon: OpenAIIcon },
  { name: "ClaudeIcon", Icon: ClaudeIcon },
  { name: "RssIcon", Icon: RssIcon },
];

const SPACING = [
  { token: "gap-x-4 / 1rem", use: "Between inline links" },
  { token: "mt-3 / 0.75rem", use: "Heading to its subtitle" },
  { token: "mt-6 / 1.5rem", use: "Heading to section content" },
  { token: "space-y-10 / 2.5rem", use: "Between entries in a list" },
  { token: "mt-16 / 4rem", use: "Between page sections" },
  { token: "py-16 / 4rem", use: "Page top and bottom padding" },
];

function Swatch({ name, varName, role }: { name: string; varName: string; role: string }) {
  return (
    <li className="flex items-center gap-4 text-sm">
      <span
        aria-hidden
        className="inline-block h-8 w-16 shrink-0 border border-border"
        style={{ background: `var(${varName})` }}
      />
      <code className="w-36 shrink-0 font-mono text-xs text-muted">{varName}</code>
      <span className="w-24 shrink-0 text-ink">{name}</span>
      <span className="text-muted">{role}</span>
    </li>
  );
}

function Example({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>Design system</PageTitle>
        <p className="mt-3 max-w-prose text-muted">
          The actual tokens and primitives this site renders with, imported from the same code the
          pages use, so this page cannot drift from reality. Quiet, typography-led, near-monochrome
          with one accent.
        </p>

        <section className="mt-16" aria-labelledby="ds-principles">
          <SectionHeading id="ds-principles">Principles</SectionHeading>
          <ol className="mt-6 max-w-prose list-decimal space-y-2 pl-5 text-[0.9375rem] leading-relaxed">
            <li>Typography does the design: hierarchy from size, weight, and space, not boxes.</li>
            <li>One accent colour, spent sparingly on links and selection.</li>
            <li>Hairline borders separate; backgrounds stay out of the way.</li>
            <li>Every element earns its place. If it doesn&apos;t inform, it goes.</li>
            <li>Server-rendered and semantic first; scripts only enhance.</li>
          </ol>
        </section>

        <section className="mt-16" aria-labelledby="ds-color">
          <SectionHeading id="ds-color">Colour</SectionHeading>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Tokens are OKLCH with a 140° green hue thread. Toggle the theme to see both modes:{" "}
            <ThemeToggle />
          </p>
          <ul className="mt-6 space-y-2">
            {COLORS.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="ds-type">
          <SectionHeading id="ds-type">Type</SectionHeading>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Newsreader (serif) for display, Geist for body and UI, Geist Mono for code and data.
            Body measure caps at 65ch via <code className="font-mono text-xs">max-w-prose</code>.
          </p>
          <div className="mt-6 divide-y divide-border">
            {TYPE_SCALE.map((t) => (
              <div key={t.label} className="flex items-baseline gap-6 py-3">
                <span className="w-36 shrink-0 text-xs text-muted">{t.label}</span>
                <span className={`${t.cls} text-ink`}>{t.sample}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="ds-layout">
          <SectionHeading id="ds-layout">Layout</SectionHeading>
          <p className="mt-2 max-w-prose text-sm text-muted">
            One column. The page shell (header, stats bar, main, footer) is{" "}
            <code className="font-mono text-xs">max-w-5xl</code> so desktop space is used; the CV
            alone stays <code className="font-mono text-xs">max-w-3xl</code> for a document-like
            measure. Prose always caps at <code className="font-mono text-xs">max-w-prose</code>{" "}
            regardless of shell width. Dated entries use the two-column{" "}
            <code className="font-mono text-xs">entry-grid</code> pattern with an 8.5rem date
            gutter, stacking on mobile.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="ds-spacing">
          <SectionHeading id="ds-spacing">Spacing rhythm</SectionHeading>
          <ul className="mt-6 space-y-2">
            {SPACING.map((s) => (
              <li key={s.token} className="flex items-baseline gap-6 text-sm">
                <code className="w-44 shrink-0 font-mono text-xs text-muted">{s.token}</code>
                <span>{s.use}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="ds-elements">
          <SectionHeading id="ds-elements">Primitives</SectionHeading>
          <div className="mt-6 space-y-10">
            <Example label="TextLink · accent / quiet / ink">
              <p className="flex gap-6 text-sm">
                <TextLink href="#ds-elements">Accent link</TextLink>
                <TextLink href="#ds-elements" variant="quiet">
                  Quiet link
                </TextLink>
                <TextLink href="#ds-elements" variant="ink">
                  Ink link
                </TextLink>
              </p>
            </Example>

            <Example label="Button · primary / secondary / ghost">
              <p className="flex items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button>Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </p>
            </Example>

            <Example label="TextInput · Select · Checkbox">
              <div className="flex flex-wrap items-baseline gap-4 text-sm">
                <TextInput placeholder="Filter by name" aria-label="Example input" />
                <Select aria-label="Example select" defaultValue="one">
                  <option value="one">Recently pushed</option>
                  <option value="two">Stars</option>
                </Select>
                <label className="flex items-center gap-2 text-muted">
                  <Checkbox defaultChecked /> Include forks
                </label>
              </div>
            </Example>

            <Example label="EntryGrid · dated entries (CV, education, lists)">
              <EntryGrid>
                <EntryWhen>Aug 2023 – Jul 2026</EntryWhen>
                <EntryBody>
                  <EntryHeading>Entry heading</EntryHeading>
                  <MetaText>Organisation · context note</MetaText>
                  <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed">
                    Body content sits in the right column; the left gutter carries the date in
                    tabular figures.
                  </p>
                </EntryBody>
              </EntryGrid>
            </Example>

            <Example label="MetaText · DateStamp">
              <div className="flex items-baseline gap-4">
                <MetaText>Secondary information</MetaText>
                <DateStamp date={new Date("2026-07-19")} />
              </div>
            </Example>

            <Example label="Divided list (repo table rows)">
              <ul className="divide-y divide-border">
                {["first item", "second item"].map((item) => (
                  <li key={item} className="flex items-baseline justify-between py-3 text-sm">
                    <span className="font-medium text-ink">{item}</span>
                    <span className="text-xs tabular-nums text-muted">TypeScript · Jul 2026</span>
                  </li>
                ))}
              </ul>
            </Example>

            <Example label="Prose (blog posts)">
              <div className="prose-quiet text-[0.9375rem]">
                <p>
                  Long-form content uses <code>prose-quiet</code>: comfortable line height, accent
                  links, and surface-tinted code blocks.
                </p>
                <pre>
                  <code>pnpm build</code>
                </pre>
              </div>
            </Example>

            <Example label="Selection">
              <p className="max-w-prose text-sm">
                Select this sentence to see the accent selection colour.
              </p>
            </Example>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="ds-icons">
          <SectionHeading id="ds-icons">Iconography</SectionHeading>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Brand icons use official simple-icons paths; the mail icon is custom to match the
            hairline style. All render at 16px (12px inline), take{" "}
            <code className="font-mono text-xs">currentColor</code>, and are{" "}
            <code className="font-mono text-xs">aria-hidden</code> with an accessible label on the
            surrounding link.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {ICONS.map(({ name, Icon }) => (
              <li key={name} className="flex items-center gap-2 text-muted">
                <Icon />
                <code className="font-mono text-xs">{name}</code>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="ds-focus">
          <SectionHeading id="ds-focus">Focus</SectionHeading>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Keyboard focus gets a 2px accent ring with 2px offset via a global{" "}
            <code className="font-mono text-xs">:focus-visible</code> rule; pointer clicks
            don&apos;t. The palette input is the exception: it fills its dialog edge-to-edge, so
            instead of a ring its bottom hairline turns accent on focus. Tab to the button to see
            the ring:
          </p>
          <p className="mt-6">
            <Button>Tab to me</Button>
          </p>
        </section>

        <section className="mt-16" aria-labelledby="ds-motion">
          <SectionHeading id="ds-motion">Motion</SectionHeading>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Motion is limited to colour and opacity transitions on hover — no movement, no
            entrances. Everything is disabled under{" "}
            <code className="font-mono text-xs">prefers-reduced-motion</code>.
          </p>
          <p className="mt-6 flex items-center gap-6 text-sm">
            <Button variant="ghost">Hover: colour</Button>
            <Button variant="primary">Hover: opacity</Button>
            <TextLink href="#ds-motion" variant="quiet">
              Hover: muted → ink
            </TextLink>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
