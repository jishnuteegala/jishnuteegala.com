import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { cv } from "@/data/cv";
import { pinnedProjects } from "@/data/projects";
import { getPosts } from "@/lib/posts";
import { getRepos } from "@/lib/github";
import { getGithubContributions, getGitlabContributions } from "@/lib/activity";
import { ContributionGraph } from "@/components/contribution-graph";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatsBar } from "@/components/stats-bar";
import { PageMarkdownLink } from "@/components/page-markdown-link";
import { PageTitle, SectionHeading, SectionHead, SourceNote } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";
import { DateStamp } from "@/components/ui/meta";
import { Flourish } from "@/components/flourish";
import { LangDot } from "@/components/ui/lang-dot";

export const metadata: Metadata = {
  alternates: { types: { "text/markdown": "/index.md" } },
};

export default function Home() {
  const posts = getPosts().slice(0, 3);
  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <StatsBar />
      </Suspense>
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>Jishnu Teegala</PageTitle>
        <p className="mt-3 font-serif text-xl italic text-muted">
          {cv.headline} in {cv.location}.
        </p>
        <Flourish />
        <p className="mt-8 max-w-prose leading-relaxed">
          I look after developer platforms at UBS: GitLab, SonarQube, GitHub Copilot, and GitLab
          Duo. Day to day that means helping engineers get agentic AI tooling working inside a bank,
          reporting bugs to the vendors, and chasing the fixes. Outside work I build small tools and
          analyses, which live on this site.
        </p>
        <p className="mt-4 max-w-prose leading-relaxed">
          Read my <TextLink href="/cv">CV</TextLink> or email{" "}
          <TextLink href={`mailto:${cv.email}`}>{cv.email}</TextLink>.
        </p>

        <section className="mt-16" aria-labelledby="pinned-heading">
          <SectionHead id="pinned-heading" meta={<SourceNote src="github" />}>
            Selected work
          </SectionHead>
          <ul className="mt-6 space-y-6">
            {pinnedProjects.map((p) => (
              <li key={p.repo}>
                <Suspense fallback={<PinnedEntry repo={p.repo} narrative={p.narrative} />}>
                  <PinnedWithMeta repo={p.repo} narrative={p.narrative} />
                </Suspense>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            <TextLink href="/projects" variant="quiet">
              All projects →
            </TextLink>
          </p>
        </section>

        <section className="mt-16" aria-labelledby="activity-heading">
          <SectionHead id="activity-heading" meta={<SourceNote src="github + gitlab" />}>
            Activity
          </SectionHead>
          <div className="mt-6 space-y-8">
            <Suspense fallback={null}>
              <GithubActivity />
            </Suspense>
            <Suspense fallback={null}>
              <GitlabActivity />
            </Suspense>
          </div>
        </section>

        {posts.length > 0 ? (
          <section className="mt-16" aria-labelledby="posts-heading">
            <SectionHeading id="posts-heading">Latest writing</SectionHeading>
            <ul className="mt-6 space-y-4">
              {posts.map((p) => (
                <li key={p.slug} className="flex items-baseline gap-3">
                  <TextLink href={`/blog/${p.slug}`} variant="ink">
                    {p.title}
                  </TextLink>
                  <DateStamp date={p.date} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <PageMarkdownLink path="/index.md" />
      </main>
      <SiteFooter
        sources={[
          {
            name: "GitHub heatmap",
            source: "github.com/users/jishnuteegala/contributions",
            refresh: "hourly",
          },
          {
            name: "GitLab heatmap",
            source: "gitlab.com/users/jishnuteegala/calendar.json",
            refresh: "hourly",
          },
          {
            name: "Selected work · launch links",
            source: "api.github.com/users/jishnuteegala/repos",
            refresh: "hourly",
          },
        ]}
      />
    </>
  );
}

function PinnedEntry({
  repo,
  narrative,
  href,
  meta,
}: {
  repo: string;
  narrative: string;
  href?: string;
  meta?: string;
}) {
  return (
    <article>
      <h3 className="text-ink">
        <Link
          href={`/projects/${repo}`}
          className="font-medium hover:text-accent transition-colors"
        >
          {repo}
        </Link>
        {meta ? (
          <span className="ml-3 inline-flex items-baseline gap-1.5 text-sm font-normal text-muted">
            <LangDot language={meta} />
            {meta}
          </span>
        ) : null}
      </h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted">{narrative}</p>
      <p className="mt-1 text-xs">
        {href ? (
          <>
            <a href={href} className="text-accent hover:text-ink transition-colors">
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

async function GithubActivity() {
  const calendar = await getGithubContributions();
  if (!calendar) return null;
  return (
    <ContributionGraph calendar={calendar} label="GitHub" href="https://github.com/jishnuteegala" />
  );
}

async function GitlabActivity() {
  const calendar = await getGitlabContributions();
  if (!calendar) return null;
  return (
    <ContributionGraph
      calendar={calendar}
      label="GitLab"
      href="https://gitlab.com/users/jishnuteegala/activity"
    />
  );
}

async function PinnedWithMeta({ repo, narrative }: { repo: string; narrative: string }) {
  const repos = await getRepos();
  const match = repos.find((r) => r.name === repo);
  return (
    <PinnedEntry
      repo={repo}
      narrative={narrative}
      href={match?.homepage ?? undefined}
      meta={match?.language ?? undefined}
    />
  );
}
