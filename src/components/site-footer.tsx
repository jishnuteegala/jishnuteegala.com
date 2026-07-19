import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cv } from "@/data/cv";
import { TextLink } from "@/components/ui/text-link";
import {
  MailIcon,
  GitHubIcon,
  GitLabIcon,
  LinkedInIcon,
  XIcon,
  RssIcon,
} from "@/components/ui/icons";

const SOCIAL_ICONS: Record<string, typeof GitHubIcon> = {
  GitHub: GitHubIcon,
  GitLab: GitLabIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
};

function accentValues(): { light: string; dark: string } | null {
  try {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    const matches = [...css.matchAll(/--accent:\s*([^;]+);/g)].map((m) => m[1].trim());
    if (matches.length < 2) return null;
    return { light: matches[0], dark: matches[1] };
  } catch {
    return null;
  }
}

export type DataSource = {
  name: string;
  source: string;
  refresh: string;
};

export function SiteFooter({ sources }: { sources?: DataSource[] }) {
  const accent = accentValues();
  return (
    <footer className="site-footer mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 pt-6 pb-4 text-sm">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li>
            <a
              href={`mailto:${cv.email}`}
              title={cv.email}
              className="inline-flex text-muted transition-colors hover:text-ink"
            >
              <MailIcon />
              <span className="sr-only">Email {cv.email}</span>
            </a>
          </li>
          {cv.links
            .filter((l) => l.href !== "https://jishnuteegala.com")
            .map((l) => {
              const Icon = SOCIAL_ICONS[l.label];
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    rel="me noopener"
                    title={l.label}
                    className="inline-flex text-muted transition-colors hover:text-ink"
                  >
                    {Icon ? <Icon /> : l.label}
                    <span className="sr-only">{l.label}</span>
                  </a>
                </li>
              );
            })}
          <li>
            <TextLink href="/rss.xml" variant="quiet" title="RSS" className="inline-flex">
              <RssIcon />
              <span className="sr-only">RSS feed</span>
            </TextLink>
          </li>
        </ul>
        <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <li>
            <TextLink href="/design-system" variant="quiet">
              Design system
            </TextLink>
          </li>
          <li>
            <TextLink href="/privacy" variant="quiet">
              Privacy
            </TextLink>
          </li>
          <li>
            <TextLink href="/llms.txt" variant="quiet">
              llms.txt
            </TextLink>
          </li>
        </ul>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-6 text-xs text-muted sm:flex-row sm:justify-between">
        {sources && sources.length > 0 ? (
          <dl className="min-w-0">
            <dt className="font-medium text-ink">Data sources</dt>
            {sources.map((s) => (
              <div key={s.name} className="mt-1">
                <dd className="break-words">
                  {s.name} · <span className="font-mono">{s.source}</span> · {s.refresh}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="sm:self-end">No external data on this page.</p>
        )}
        <div className="shrink-0 leading-relaxed sm:text-right">
          <p className="font-medium text-ink">Colophon</p>
          <p className="mt-1">
            Next.js on Vercel ·{" "}
            <TextLink
              href="https://github.com/jishnuteegala/jishnuteegala.com"
              variant="quiet"
              className="underline underline-offset-4"
            >
              site source
            </TextLink>
          </p>
          <p>serif by Newsreader · sans by Geist</p>
          <p className="flex items-baseline gap-1.5 sm:justify-end">
            accent:{" "}
            <span
              aria-hidden
              className="inline-block size-2.5 self-center rounded-[2px]"
              style={{ background: "var(--accent)" }}
            />
            {accent ? (
              <>
                <span className="theme-light-only font-mono text-accent">{accent.light}</span>
                <span className="theme-dark-only font-mono text-accent">{accent.dark}</span>
              </>
            ) : (
              <span className="font-mono text-accent">var(--accent)</span>
            )}
          </p>
          <p className="mt-3">© 2026 Jishnu Teegala</p>
        </div>
      </div>
    </footer>
  );
}
