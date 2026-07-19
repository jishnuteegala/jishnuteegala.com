import { cv } from "@/data/cv";
import { pinnedProjects } from "@/data/projects";
import { getPosts } from "@/lib/posts";
import { labs } from "@/data/labs";
import { getRepos } from "@/lib/github";

const AGENT_POINTER =
  "<!-- Full site index for agents: https://jishnuteegala.com/llms.txt — every content page is available as markdown by appending .md -->\n\n";

export function markdownResponse(body: string): Response {
  return new Response(AGENT_POINTER + body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export function homeMarkdown(): string {
  const lines = [
    `# ${cv.name}`,
    "",
    `${cv.headline} in ${cv.location}.`,
    "",
    cv.profile,
    "",
    `- Email: [${cv.email}](mailto:${cv.email})`,
    ...cv.links.map((l) => `- [${l.label}](${l.href})`),
    "",
    "## Sections",
    "",
    "- [CV](https://jishnuteegala.com/cv) · full CV with downloadable PDFs",
    "- [Projects](https://jishnuteegala.com/projects) · pinned and live from GitHub",
    "- [Labs](https://jishnuteegala.com/labs) · small in-site experiments",
  ];
  return lines.join("\n");
}

export function cvMarkdown(variant: "full" | "condensed" = "full"): string {
  const lines: string[] = [
    `# ${cv.name} · CV`,
    "",
    `${cv.headline} · ${cv.location} · ${cv.workEligibility}`,
    "",
    `Email: [${cv.email}](mailto:${cv.email})`,
    ...cv.links.map((l) => `${l.label}: [${l.href.replace(/^https:\/\//, "")}](${l.href})`),
    "",
    "## Profile",
    "",
    cv.profile,
    "",
    "## Experience",
  ];
  for (const role of cv.experience) {
    const bullets =
      variant === "condensed"
        ? role.bullets.filter((b) => b.emphasis === "highlight")
        : role.bullets;
    if (variant === "condensed" && bullets.length === 0) continue;
    const org = role.orgHref ? `[${role.org}](${role.orgHref})` : role.org;
    lines.push("", `### ${role.title} · ${org} (${role.start} – ${role.end})`);
    if (role.orgNote) lines.push("", `*${role.orgNote}*`);
    lines.push("", ...bullets.map((b) => `- ${b.text}`));
  }
  lines.push("", "## Education");
  for (const e of cv.education) {
    lines.push(
      "",
      `### ${e.institution}, ${e.location} (${e.start} – ${e.end})`,
      "",
      ...e.details.map((d) => `- ${d.text}`),
    );
  }
  lines.push("", "## Skills & Interests", "");
  for (const s of cv.skills) lines.push(`- **${s.label}:** ${s.items}`);
  lines.push("", "## Certifications", "", cv.certifications);
  lines.push("", "## Selected Projects", "");
  for (const p of cv.selectedProjects) {
    const url = p.href.startsWith("/") ? `https://jishnuteegala.com${p.href}` : p.href;
    lines.push(`- [${p.name}](${url}): ${p.summary}`);
  }
  return lines.join("\n");
}

export async function projectsMarkdown(): Promise<string> {
  const repos = await getRepos();
  const lines = [
    "# Projects",
    "",
    "Pinned work, plus everything public on GitHub (live at https://jishnuteegala.com/projects).",
    "",
    "## Pinned",
    "",
    ...pinnedProjects.map((p) => {
      const source = `[source](https://github.com/jishnuteegala/${p.repo})`;
      const homepage = repos.find((r) => r.name === p.repo)?.homepage;
      const launch = homepage ? ` · [launch](${homepage})` : "";
      return `- **${p.repo}**: ${p.narrative} (${source}${launch})`;
    }),
  ];
  return lines.join("\n");
}

export function labsMarkdown(): string {
  const lines = ["# Labs", "", "Small self-contained experiments living inside this site."];
  if (labs.length === 0) {
    lines.push("", "Nothing here yet.");
  } else {
    lines.push("", ...labs.map((l) => `- **${l.name}**: ${l.description} (/labs/${l.slug})`));
  }
  return lines.join("\n");
}

export function llmsTxt(): string {
  const posts = getPosts();
  const lines = [
    `# ${cv.name}`,
    "",
    `> Personal site of ${cv.name}, ${cv.headline} in ${cv.location}. ${cv.profile}`,
    "",
    "All content pages have markdown variants · append `.md` or use the links below.",
    "",
    "## Pages",
    "",
    "- [Home](https://jishnuteegala.com/index.md): introduction and contact",
    "- [CV](https://jishnuteegala.com/cv.md): full CV; PDFs at /cv (full/condensed × light/dark)",
    "- [Projects](https://jishnuteegala.com/projects.md): pinned projects and live GitHub repos",
    "- [Labs](https://jishnuteegala.com/labs.md): in-site experiments",
  ];
  if (posts.length > 0) {
    lines.push("", "## Blog", "");
    for (const p of posts) {
      lines.push(`- [${p.title}](https://jishnuteegala.com/blog/${p.slug}.md): ${p.description}`);
    }
  }
  lines.push(
    "",
    "## Contact",
    "",
    `- Email: [${cv.email}](mailto:${cv.email})`,
    ...cv.links.map((l) => `- [${l.label}](${l.href})`),
    "",
    "## Full content",
    "",
    "- [llms-full.txt](https://jishnuteegala.com/llms-full.txt): every page inlined in one file",
  );
  return lines.join("\n");
}

export function llmsFullTxt(): string {
  const posts = getPosts();
  const parts = [homeMarkdown(), cvMarkdown("full"), projectsMarkdown(), labsMarkdown()];
  for (const p of posts) {
    parts.push(`# ${p.title}\n\n${p.description}\n\n${p.content}`);
  }
  return parts.join("\n\n---\n\n");
}
