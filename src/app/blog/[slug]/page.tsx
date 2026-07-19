import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { getPost, postSlugsForStaticParams } from "@/lib/posts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMarkdownLink } from "@/components/page-markdown-link";
import { PageTitle } from "@/components/ui/heading";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return postSlugsForStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { types: { "text/markdown": `/blog-md/${post.slug}` } },
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <article>
          <header>
            <PageTitle>{post.title}</PageTitle>
            <time dateTime={post.date.toISOString()} className="mt-3 block text-sm text-muted">
              {post.date.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>
          <div className="prose-quiet mt-10">
            <MDXRemote source={post.content} />
          </div>
        </article>
        <PageMarkdownLink path={`/blog/${post.slug}.md`} />
      </main>
      <SiteFooter />
    </>
  );
}
