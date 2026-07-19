import { getRepos } from "@/lib/github";
import { hasPosts } from "@/lib/posts";
import { CommandPalette, type PaletteItem } from "./command-palette";

export async function CommandPaletteHost() {
  const repos = await getRepos();
  const items: PaletteItem[] = [
    { id: "page:/", label: "home", href: "/", group: "pages" },
    { id: "page:/cv", label: "cv", href: "/cv", group: "pages" },
    { id: "page:/projects", label: "projects", href: "/projects", group: "pages" },
    { id: "page:/labs", label: "labs", href: "/labs", group: "pages" },
    ...(hasPosts()
      ? [{ id: "page:/blog", label: "blog", href: "/blog", group: "pages" as const }]
      : []),
    ...repos
      .filter((r) => !r.fork)
      .map(
        (r): PaletteItem => ({
          id: `repo:${r.name}`,
          label: r.name,
          hint: r.description ?? undefined,
          href: `/projects/${r.name}`,
          group: "projects",
        }),
      ),
  ];
  return <CommandPalette items={items} />;
}
