import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { getRepos } from "@/lib/github";
import { labs } from "@/data/labs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://jishnuteegala.com";
  const staticPages = ["", "/cv", "/projects", "/labs", "/design-system", "/privacy"].map((p) => ({
    url: `${base}${p}`,
  }));
  const posts = getPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date,
  }));
  const labPages = labs.map((l) => ({ url: `${base}/labs/${l.slug}` }));
  const repos = await getRepos();
  const projectPages = repos
    .filter((r) => !r.fork)
    .map((r) => ({ url: `${base}/projects/${r.name}`, lastModified: new Date(r.pushed_at) }));
  return [...staticPages, ...posts, ...projectPages, ...labPages];
}
