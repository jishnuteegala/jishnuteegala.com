import { cacheLife } from "next/cache";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "jishnuteegala.com",
};

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  topics: string[];
};

export type RepoStats = {
  repos: number;
  stars: number;
  forks: number;
  active: number;
  languages: number;
};

export function computeStats(repos: Repo[]): RepoStats {
  const own = repos.filter((r) => !r.fork);
  return {
    repos: own.length,
    stars: own.reduce((s, r) => s + r.stargazers_count, 0),
    forks: own.reduce((s, r) => s + r.forks_count, 0),
    active: own.filter((r) => !r.archived).length,
    languages: new Set(own.map((r) => r.language).filter(Boolean)).size,
  };
}

export type RecentCommit = { sha: string; message: string; date: string };

export async function getReadme(name: string): Promise<string | null> {
  "use cache";
  cacheLife("days");
  const res = await fetch(`https://api.github.com/repos/jishnuteegala/${name}/readme`, {
    headers: { ...GITHUB_HEADERS, Accept: "application/vnd.github.raw+json" },
  });
  if (!res.ok) return null;
  return res.text();
}

export async function getRecentCommits(name: string): Promise<RecentCommit[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`https://api.github.com/repos/jishnuteegala/${name}/commits?per_page=5`, {
    headers: GITHUB_HEADERS,
  });
  if (!res.ok) return [];
  const body = (await res.json()) as {
    sha: string;
    commit: { message: string; author: { date: string } };
  }[];
  return body.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: (c.commit.message.split("\n")[0] ?? "").slice(0, 120),
    date: c.commit.author.date,
  }));
}

export async function getCommitCounts(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("hours");
  const repos = await getRepos();
  const own = repos.filter((r) => !r.fork);
  const entries = await Promise.all(
    own.map(async (r): Promise<[string, number] | null> => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/jishnuteegala/${r.name}/commits?per_page=1`,
          { headers: GITHUB_HEADERS },
        );
        if (!res.ok) return null;
        const link = res.headers.get("link");
        const last = link?.match(/&page=(\d+)>; rel="last"/)?.[1];
        return [r.name, last ? Number(last) : 1];
      } catch {
        return null;
      }
    }),
  );
  return Object.fromEntries(entries.filter((e) => e !== null));
}

let lastGoodRepos: Repo[] = [];

export async function getRepos(): Promise<Repo[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(
    "https://api.github.com/users/jishnuteegala/repos?per_page=100&sort=pushed",
    { headers: GITHUB_HEADERS },
  );
  if (!res.ok) return lastGoodRepos;
  const data = (await res.json()) as Repo[];
  lastGoodRepos = data.map((r) => ({
    name: r.name,
    description: r.description,
    html_url: r.html_url,
    homepage:
      r.homepage?.trim() && !r.homepage.startsWith("https://github.com/") ? r.homepage : null,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    fork: r.fork,
    archived: r.archived,
    pushed_at: r.pushed_at,
    topics: r.topics ?? [],
  }));
  return lastGoodRepos;
}
