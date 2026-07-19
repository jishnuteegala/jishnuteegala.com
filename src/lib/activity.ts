import { cacheLife } from "next/cache";

export type ContributionDay = { date: string; count: number; level: number };

export type ContributionCalendar = {
  days: ContributionDay[];
  total: number;
  longestStreak: number;
};

function longestStreak(days: ContributionDay[]): number {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    if (run > best) best = run;
  }
  return best;
}

export async function getGithubContributions(): Promise<ContributionCalendar | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch("https://github.com/users/jishnuteegala/contributions");
  if (!res.ok) return null;
  const html = await res.text();

  const counts = new Map<string, number>();
  const tooltipRe = /for="([^"]+)"[^>]*>\s*(No|\d+) contributions? /g;
  for (const m of html.matchAll(tooltipRe)) {
    counts.set(m[1] as string, m[2] === "No" ? 0 : Number(m[2]));
  }

  const days: ContributionDay[] = [];
  let total = 0;
  const cellRe = /data-date="(\d{4}-\d{2}-\d{2})" id="([^"]+)" data-level="(\d)"/g;
  for (const m of html.matchAll(cellRe)) {
    const count = counts.get(m[2] as string) ?? 0;
    total += count;
    days.push({ date: m[1] as string, count, level: Number(m[3]) });
  }
  if (days.length === 0) return null;
  days.sort((a, b) => (a.date < b.date ? -1 : 1));
  return { days, total, longestStreak: longestStreak(days) };
}

function gitlabLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 10) return 1;
  if (count < 20) return 2;
  if (count < 30) return 3;
  return 4;
}

export async function getGitlabContributions(): Promise<ContributionCalendar | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch("https://gitlab.com/users/jishnuteegala/calendar.json");
  if (!res.ok) return null;
  const body = (await res.json()) as Record<string, number>;
  const days: ContributionDay[] = [];
  let total = 0;
  const start = new Date();
  start.setDate(start.getDate() - 364);
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    const count = body[date] ?? 0;
    total += count;
    days.push({ date, count, level: gitlabLevel(count) });
  }
  return { days, total, longestStreak: longestStreak(days) };
}

export async function getCommitCount(): Promise<number | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(
    "https://api.github.com/search/commits?q=author:jishnuteegala&per_page=1",
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "jishnuteegala.com",
      },
    },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as { total_count?: number };
  return body.total_count ?? null;
}
