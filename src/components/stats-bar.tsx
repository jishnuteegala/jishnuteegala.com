import { getRepos, computeStats } from "@/lib/github";
import { getCommitCount } from "@/lib/activity";

export async function StatsBar() {
  const repos = await getRepos();
  if (repos.length === 0) return null;
  const stats = computeStats(repos);
  const commits = await getCommitCount();
  const lastPush = repos
    .filter((r) => !r.fork)
    .map((r) => r.pushed_at)
    .sort()
    .at(-1);
  const items: [string, string][] = [
    ["repos", String(stats.repos)],
    ["stars", String(stats.stars)],
    ...(commits !== null ? ([["commits", commits.toLocaleString()]] as [string, string][]) : []),
    ["langs", String(stats.languages)],
    ...(lastPush
      ? ([
          [
            "last push",
            new Date(lastPush).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          ],
        ] as [string, string][])
      : []),
  ];
  return (
    <div className="border-b border-border">
      <dl className="scrollbar-none mx-auto flex max-w-5xl items-baseline gap-x-6 overflow-x-auto px-6 py-2 text-xs whitespace-nowrap">
        <div className="flex shrink-0 items-baseline gap-1.5">
          <span aria-hidden className="text-accent">
            ●
          </span>
          <span className="text-muted">online</span>
        </div>
        {items.map(([label, value]) => (
          <div key={label} className="flex shrink-0 items-baseline gap-1.5">
            <dt className="text-muted">{label}</dt>
            <dd className="text-ink tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
