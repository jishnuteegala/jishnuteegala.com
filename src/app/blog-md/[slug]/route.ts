import { getPost, postSlugsForStaticParams } from "@/lib/posts";
import { markdownResponse } from "@/lib/markdown";

export function generateStaticParams() {
  return postSlugsForStaticParams();
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });
  const md = `# ${post.title}\n\n${post.date.toISOString().slice(0, 10)}\n\n${post.content}`;
  return markdownResponse(md);
}
