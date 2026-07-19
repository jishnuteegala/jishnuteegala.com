import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTitle } from "@/components/ui/heading";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing by Jishnu Teegala.",
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>Blog</PageTitle>
        {posts.length === 0 ? (
          <p className="mt-12 max-w-prose text-sm leading-relaxed text-muted">
            Nothing published yet.
          </p>
        ) : (
          <ul className="mt-12 space-y-6">
            {posts.map((p) => (
              <li key={p.slug}>
                <article>
                  <h2 className="font-medium text-ink">
                    <Link href={`/blog/${p.slug}`} className="hover:text-accent transition-colors">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-prose text-sm text-muted">{p.description}</p>
                  <time dateTime={p.date.toISOString()} className="mt-1 block text-xs text-muted">
                    {p.date.toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
