import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getRepos, getReadme, getRecentCommits, type Repo } from "@/lib/github";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTitle, SectionHeading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";
import { LangDot } from "@/components/ui/lang-dot";

type Params = { name: string };

export async function generateStaticParams(): Promise<Params[]> {
  const repos = await getRepos();
  if (repos.length === 0) return [{ name: "__no-repos__" }];
  return repos.filter((r) => !r.fork).map((r) => ({ name: r.name }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { name } = await params;
  const repos = await getRepos();
  const repo = repos.find((r) => r.name === name);
  if (!repo) return {};
  return { title: repo.name, description: repo.description ?? `${repo.name} on GitHub` };
}

const IMG_EXT = /\.(png|jpe?g|gif|svg|webp|avif|bmp|ico)(\?.*)?$/i;

function rewriteReadmeUrl(name: string) {
  const blob = `https://github.com/jishnuteegala/${name}/blob/HEAD/`;
  const raw = `https://raw.githubusercontent.com/jishnuteegala/${name}/HEAD/`;
  return (url: string): string => {
    if (!url || /^(https?:|mailto:|data:|#)/i.test(url)) return url;
    const cleaned = url.replace(/^\.\//, "").replace(/^\/+/, "");
    return (IMG_EXT.test(cleaned) ? raw : blob) + cleaned;
  };
}

function stripLeadingH1(md: string): string {
  return md.replace(/^\s*#\s+[^\n]+\n*/, "");
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { name } = await params;
  const repos = await getRepos();
  const repo = repos.find((r) => r.name === name && !r.fork);
  if (!repo) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <TextLink href="/projects" variant="quiet">
            Projects
          </TextLink>{" "}
          / <span className="text-ink">{repo.name}</span>
        </nav>

        <header className="mt-6">
          <PageTitle>{repo.name}</PageTitle>
          {repo.description ? (
            <p className="mt-3 max-w-prose text-muted">{repo.description}</p>
          ) : null}
        </header>

        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          {repo.homepage ? (
            <a
              href={repo.homepage}
              className="cta-launch group flex min-w-0 items-baseline justify-between gap-x-4 px-4 py-3 transition-colors"
            >
              <span className="text-sm text-muted">Launch</span>
              <span className="min-w-0 truncate text-sm text-accent group-hover:text-ink transition-colors">
                {repo.homepage.replace(/^https?:\/\//, "")} ↗
              </span>
            </a>
          ) : (
            <div className="flex items-baseline justify-between gap-x-4 bg-bg px-4 py-3 opacity-60">
              <span className="text-sm text-muted">Launch</span>
              <span className="text-sm text-muted">no hosted version</span>
            </div>
          )}
          <a
            href={repo.html_url}
            className="group flex min-w-0 items-baseline justify-between gap-x-4 bg-bg px-4 py-3 transition-colors hover:bg-surface"
          >
            <span className="text-sm text-muted">Source</span>
            <span className="min-w-0 truncate text-sm text-ink group-hover:text-accent transition-colors">
              github.com/jishnuteegala/{repo.name} ↗
            </span>
          </a>
        </div>

        <div className="mt-12 grid gap-y-12 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-x-10">
          <section aria-labelledby="readme" className="min-w-0">
            <SectionHeading id="readme">Readme</SectionHeading>
            <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading readme…</p>}>
              <ReadmeSection repo={repo} />
            </Suspense>
          </section>

          <aside className="sm:pt-1">
            <h2 className="text-sm font-semibold text-ink">Facts</h2>
            <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
              {repo.language ? (
                <div className="flex justify-between gap-x-4">
                  <dt className="text-muted">language</dt>
                  <dd className="flex items-baseline gap-1.5 text-ink">
                    <LangDot language={repo.language} />
                    {repo.language}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-x-4">
                <dt className="text-muted">stars</dt>
                <dd className="text-ink tabular-nums">{repo.stargazers_count}</dd>
              </div>
              <div className="flex justify-between gap-x-4">
                <dt className="text-muted">status</dt>
                <dd className={repo.archived ? "text-muted" : "text-accent"}>
                  {repo.archived ? "archived" : "active"}
                </dd>
              </div>
              <div className="flex justify-between gap-x-4">
                <dt className="text-muted">last push</dt>
                <dd className="text-ink tabular-nums">
                  <time dateTime={repo.pushed_at}>
                    {new Date(repo.pushed_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                    })}
                  </time>
                </dd>
              </div>
              {repo.topics.length > 0 ? (
                <div>
                  <dt className="text-muted">topics</dt>
                  <dd className="mt-1 text-ink">{repo.topics.join(", ")}</dd>
                </div>
              ) : null}
            </dl>

            <h2 className="mt-10 text-sm font-semibold text-ink">Recent commits</h2>
            <Suspense fallback={<p className="mt-4 text-sm text-muted">Loading…</p>}>
              <CommitsSection name={repo.name} />
            </Suspense>

            <RelatedSection repo={repo} repos={repos} />
          </aside>
        </div>
      </main>
      <SiteFooter
        sources={[
          {
            name: "Repository, readme, commits",
            source: `api.github.com/repos/jishnuteegala/${repo.name}`,
            refresh: "hourly",
          },
        ]}
      />
    </>
  );
}

async function ReadmeSection({ repo }: { repo: Repo }) {
  const readme = await getReadme(repo.name);
  if (!readme) {
    return (
      <p className="mt-6 text-sm text-muted">
        No readme in this repo; <TextLink href={repo.html_url}>the GitHub page</TextLink> is the
        canonical view.
      </p>
    );
  }
  return (
    <div className="prose-quiet mt-6">
      <Markdown remarkPlugins={[remarkGfm]} urlTransform={rewriteReadmeUrl(repo.name)}>
        {stripLeadingH1(readme)}
      </Markdown>
    </div>
  );
}

function RelatedSection({ repo, repos }: { repo: Repo; repos: Repo[] }) {
  if (!repo.language) return null;
  const related = repos
    .filter((r) => !r.fork && r.name !== repo.name && r.language === repo.language)
    .slice(0, 3);
  if (related.length === 0) return null;
  return (
    <>
      <h2 className="mt-10 text-sm font-semibold text-ink">
        More in {repo.language.toLowerCase()}
      </h2>
      <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        {related.map((r) => (
          <li key={r.name}>
            <TextLink href={`/projects/${r.name}`} variant="quiet">
              {r.name}
            </TextLink>
          </li>
        ))}
      </ul>
    </>
  );
}

async function CommitsSection({ name }: { name: string }) {
  const commits = await getRecentCommits(name);
  if (commits.length === 0) {
    return <p className="mt-4 text-sm text-muted">Could not load commits just now.</p>;
  }
  return (
    <ul className="mt-4 space-y-3 border-t border-border pt-4">
      {commits.map((c) => (
        <li key={c.sha} className="text-sm">
          <a
            href={`https://github.com/jishnuteegala/${name}/commit/${c.sha}`}
            className="group block"
          >
            <span className="font-mono text-xs text-muted group-hover:text-accent transition-colors">
              {c.sha}
            </span>
            <span className="ml-2 text-xs tabular-nums text-muted">
              <time dateTime={c.date}>
                {new Date(c.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
              </time>
            </span>
            <span className="mt-0.5 block leading-snug text-ink group-hover:text-accent transition-colors">
              {c.message}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
