import { labsMarkdown, markdownResponse } from "@/lib/markdown";

export function GET() {
  return markdownResponse(labsMarkdown());
}
