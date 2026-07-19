import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type Post = {
  slug: string;
  title: string;
  date: Date;
  description: string;
  tags: string[];
  content: string;
};

export function getPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/blog/${file}: ${parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ")}`,
        );
      }
      return {
        slug: file.replace(/\.mdx?$/, ""),
        ...parsed.data,
        content,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ draft: _draft, ...post }) => post);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function hasPosts(): boolean {
  return getPosts().length > 0;
}

const EMPTY_SENTINEL = "__no-posts-yet__";

export function postSlugsForStaticParams(): { slug: string }[] {
  const posts = getPosts();
  if (posts.length === 0) return [{ slug: EMPTY_SENTINEL }];
  return posts.map((p) => ({ slug: p.slug }));
}
