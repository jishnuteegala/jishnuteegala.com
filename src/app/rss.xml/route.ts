import { getPosts } from "@/lib/posts";

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function GET() {
  const posts = getPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://jishnuteegala.com/blog/${p.slug}</link>
      <guid>https://jishnuteegala.com/blog/${p.slug}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${p.date.toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Jishnu Teegala</title>
    <link>https://jishnuteegala.com</link>
    <description>Writing by Jishnu Teegala.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
