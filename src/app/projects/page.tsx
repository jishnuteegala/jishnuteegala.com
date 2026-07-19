import type { Metadata } from "next";
import { Suspense } from "react";
import { pinnedProjects } from "@/data/projects";
import { getRepos, computeStats, getCommitCounts } from "@/lib/github";
import { getGithubContributions, getGitlabContributions, getCommitCount } from "@/lib/activity";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMarkdownLink } from "@/components/page-markdown-link";
import { RepoTable } from "@/components/repo-table";
import { PageTitle, SectionHead, SourceNote } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";

export const metadata: Metadata = {
  title: "Projects",
  description: "Pinned work and everything public on GitHub, refreshed hourly.",
  alternates: { types: { "text/markdown": "/projects.md" } },
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>Projects</PageTitle>
        <p className="mt-3 max-w-prose text-muted">
          Pinned work first; below it, everything public on GitHub, refreshed hourly.
        </p>
        <Suspense fallback={null}>
          <RepoStatsRow />
        </Suspense>

        <section className="mt-12" aria-labelledby="pinned">
          <SectionHead
            id="pinned"
            meta={
              <>
                hand-picked · launch links from <span className="font-mono">github</span>
              </>
            }
          >
            Pinned
          </SectionHead>
          <ul className="mt-6 space-y-6">
            {pinnedProjects.map((p) => (
              <li key={p.repo}>
                <Suspense fallback={<PinnedProject repo={p.repo} narrative={p.narrative} />}>
                  <PinnedProjectWithLaunch repo={p.repo} narrative={p.narrative} />
                </Suspense>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="all-repos">
          <SectionHead id="all-repos" meta={<SourceNote src="github" />}>
            All repositories
          </SectionHead>
          <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading repositories…</p>}>
            <AllRepos />
          </Suspense>
        </section>

        <PageMarkdownLink path="/projects.md" />
      </main>
      <SiteFooter
        sources={[
          {
            name: "Repo table · stats · launch links",
            source: "api.github.com/users/jishnuteegala/repos",
            refresh: "hourly",
          },
          {
            name: "github · past year stat",
            source: "github.com/users/jishnuteegala/contributions",
            refresh: "hourly",
          },
          {
            name: "commits · all time stat",
            source: "api.github.com/search/commits · author:jishnuteegala",
            refresh: "hourly",
          },
          {
            name: "gitlab · past year stat",
            source: "gitlab.com/users/jishnuteegala/calendar.json",
            refresh: "hourly",
          },
        ]}
      />
    </>
  );
}

function PinnedProject({
  repo,
  narrative,
  launchHref,
}: {
  repo: string;
  narrative: string;
  launchHref?: string;
}) {
  return (
    <article>
      <h3 className="font-medium text-ink">
        <TextLink href={`/projects/${repo}`} variant="ink">
          {repo}
        </TextLink>
      </h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted">{narrative}</p>
      <p className="mt-1 text-xs">
        {launchHref ? (
          <>
            <a href={launchHref} className="text-accent hover:text-ink transition-colors">
              launch ↗
            </a>
            {" · "}
          </>
        ) : null}
        <a
          href={`https://github.com/jishnuteegala/${repo}`}
          className="text-muted hover:text-ink transition-colors"
        >
          source
        </a>
      </p>
    </article>
  );
}

async function PinnedProjectWithLaunch({ repo, narrative }: { repo: string; narrative: string }) {
  const repos = await getRepos();
  const match = repos.find((r) => r.name === repo);
  return (
    <PinnedProject repo={repo} narrative={narrative} launchHref={match?.homepage ?? undefined} />
  );
}

async function RepoStatsRow() {
  const repos = await getRepos();
  if (repos.length === 0) return null;
  const stats = computeStats(repos);
  const [github, gitlab, commits] = await Promise.all([
    getGithubContributions(),
    getGitlabContributions(),
    getCommitCount(),
  ]);
  const items = [
    ["repos", stats.repos],
    ["stars", stats.stars],
    ["forked by others", stats.forks],
    ["active", stats.active],
    ["languages", stats.languages],
    ...(commits !== null ? ([["commits · all time", commits]] as const) : []),
    ...(github ? ([["github · past year", github.total]] as const) : []),
    ...(gitlab ? ([["gitlab · past year", gitlab.total]] as const) : []),
  ] as const;
  return (
    <>
      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="font-serif text-2xl text-ink tabular-nums">{value.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
      {github || gitlab ? (
        <p className="mt-2 text-xs text-muted">
          Past-year figures are contributions over the trailing 12 months: commits alongside pull
          requests, issues, and reviews.
        </p>
      ) : null}
    </>
  );
}

async function AllRepos() {
  const repos = await getRepos();
  if (repos.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted">
        Could not reach GitHub just now, so{" "}
        <TextLink href="https://github.com/jishnuteegala">see everything on GitHub</TextLink>.
      </p>
    );
  }
  const commitCounts = await getCommitCounts();
  return <RepoTable repos={repos} commitCounts={commitCounts} />;
}
