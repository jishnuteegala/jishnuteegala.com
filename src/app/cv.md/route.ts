import { cvMarkdown, markdownResponse } from "@/lib/markdown";

export function GET() {
  return markdownResponse(cvMarkdown("full"));
}
