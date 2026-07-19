const LINGUIST_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f1e05a",
  python: "#3572a5",
  go: "#00add8",
  ruby: "#701516",
  shell: "#89e051",
  html: "#e34c26",
  css: "#663399",
  rust: "#dea584",
  c: "#555555",
  "c++": "#f34b7d",
  "c#": "#178600",
  java: "#b07219",
  kotlin: "#a97bff",
  swift: "#f05138",
  php: "#4f5d95",
  dockerfile: "#384d54",
  vue: "#41b883",
  svelte: "#ff3e00",
  mdx: "#fcb32c",
};

export function langColor(language: string | null): string | null {
  if (!language) return null;
  return LINGUIST_COLORS[language.toLowerCase()] ?? null;
}
