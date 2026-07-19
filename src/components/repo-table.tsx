"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Repo } from "@/lib/github";
import { TextInput, Checkbox } from "@/components/ui/input";
import { LangDot } from "@/components/ui/lang-dot";

type SortKey = "name" | "language" | "stars" | "forks" | "commits" | "pushed" | "status";
type Filter = "all" | "active" | "archived" | string;

const DEFAULT_DIR: Record<SortKey, 1 | -1> = {
  name: 1,
  language: 1,
  status: 1,
  pushed: -1,
  stars: -1,
  forks: -1,
  commits: -1,
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" });

function relativePushed(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
  if (days <= 0) return "today";
  if (days < 7) return rtf.format(-days, "day");
  if (days < 30) return rtf.format(-Math.floor(days / 7), "week");
  if (days < 365) return rtf.format(-Math.floor(days / 30), "month");
  return rtf.format(-Math.floor(days / 365), "year");
}

export function RepoTable({
  repos,
  commitCounts,
}: {
  repos: Repo[];
  commitCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [showForks, setShowForks] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("pushed");
  const [sortDir, setSortDir] = useState<1 | -1>(DEFAULT_DIR.pushed);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(DEFAULT_DIR[key]);
    }
  };

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) {
      if (r.fork || !r.language) continue;
      const lang = r.language.toLowerCase();
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([lang]) => lang);
  }, [repos]);

  const filters: Filter[] = ["all", "active", "archived", ...languages];

  const visible = useMemo(() => {
    let list = repos;
    if (!showForks) list = list.filter((r) => !r.fork);
    if (filter === "active") list = list.filter((r) => !r.archived);
    else if (filter === "archived") list = list.filter((r) => r.archived);
    else if (filter !== "all") list = list.filter((r) => r.language?.toLowerCase() === filter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "language") cmp = (a.language ?? "~").localeCompare(b.language ?? "~");
      else if (sortKey === "stars") cmp = a.stargazers_count - b.stargazers_count;
      else if (sortKey === "forks") cmp = a.forks_count - b.forks_count;
      else if (sortKey === "commits")
        cmp = (commitCounts[a.name] ?? 0) - (commitCounts[b.name] ?? 0);
      else if (sortKey === "status") cmp = Number(a.archived) - Number(b.archived);
      else cmp = a.pushed_at.localeCompare(b.pushed_at);
      return sortDir * cmp;
    });
  }, [repos, showForks, query, filter, sortKey, sortDir, commitCounts]);

  const headers: [SortKey, string][] = [
    ["name", "repo"],
    ["language", "lang"],
    ["stars", "stars"],
    ["forks", "forks"],
    ["commits", "commits"],
    ["pushed", "updated"],
    ["status", "status"],
  ];

  return (
    <div className="mt-6">
      <div className="no-print flex flex-wrap items-center gap-2 text-sm">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`border px-2.5 py-0.5 text-xs transition-colors ${
              filter === f
                ? "border-border-strong text-accent"
                : "border-border text-muted hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
        <TextInput
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or description"
          aria-label="Filter repositories"
          className="min-w-56 sm:ml-auto"
        />
        <label className="flex items-center gap-2 text-xs text-muted">
          <Checkbox checked={showForks} onChange={(e) => setShowForks(e.target.checked)} />
          Include forks
        </label>
      </div>

      <div className="scrollbar-none -mx-6 mt-6 overflow-x-auto px-3">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead>
            <tr>
              {headers.map(([key, label]) => (
                <th
                  key={key}
                  className="border-b border-border-strong p-0 text-left"
                  aria-sort={
                    sortKey === key ? (sortDir === 1 ? "ascending" : "descending") : undefined
                  }
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className="w-full cursor-pointer px-3 py-2 text-left text-xs font-normal text-muted select-none transition-colors hover:text-accent"
                  >
                    {label}
                    {sortKey === key ? (
                      <span className="ml-1 text-accent" aria-hidden>
                        {sortDir === 1 ? "▲" : "▼"}
                      </span>
                    ) : null}
                  </button>
                </th>
              ))}
              <th className="border-b border-border-strong" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const href = r.fork ? r.html_url : `/projects/${r.name}`;
              return (
                <tr
                  key={r.name}
                  onClick={() => {
                    if (r.fork) window.open(r.html_url, "_blank", "noopener");
                    else router.push(href);
                  }}
                  className="group cursor-pointer border-b border-border transition-colors hover:bg-surface"
                >
                  <td className="max-w-64 px-3 py-2.5">
                    <div className="truncate font-medium text-ink group-hover:text-accent transition-colors">
                      {r.name}
                    </div>
                    {r.description ? (
                      <div className="truncate text-xs text-muted" title={r.description}>
                        {r.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap text-muted">
                    {r.language ? (
                      <span className="inline-flex items-baseline gap-1.5">
                        <LangDot language={r.language} />
                        {r.language}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs tabular-nums text-muted">
                    {r.stargazers_count}
                  </td>
                  <td className="px-3 py-2.5 text-xs tabular-nums text-muted">{r.forks_count}</td>
                  <td className="px-3 py-2.5 text-xs tabular-nums text-muted">
                    {commitCounts[r.name] ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap tabular-nums text-muted">
                    <time dateTime={r.pushed_at}>{relativePushed(r.pushed_at)}</time>
                  </td>
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap">
                    <span className={r.archived ? "text-muted" : "text-accent"}>
                      {r.archived ? "archived" : "active"}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2.5 text-right text-xs whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.homepage ? (
                      <a
                        href={r.homepage}
                        className="text-accent hover:text-ink transition-colors"
                        title="launch"
                      >
                        launch ↗
                      </a>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No repositories match.</p>
      ) : null}
    </div>
  );
}
