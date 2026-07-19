import { projectsMarkdown, markdownResponse } from "@/lib/markdown";

export async function GET() {
  return markdownResponse(await projectsMarkdown());
}
