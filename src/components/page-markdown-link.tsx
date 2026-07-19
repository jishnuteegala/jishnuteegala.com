"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "./analytics";
import { OpenAIIcon, ClaudeIcon } from "@/components/ui/icons";

const AI_PROMPT = (url: string) => `Read from ${url} so I can ask questions about its contents`;

export function PageMarkdownLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const prefetched = useRef<string | null>(null);

  useEffect(() => {
    setPageUrl(window.location.origin + window.location.pathname);
    fetch(path)
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => {
        prefetched.current = text;
      })
      .catch(() => {});
  }, [path]);

  async function copy() {
    try {
      const content = prefetched.current ?? (await (await fetch(path)).text());
      await navigator.clipboard.writeText(content);
      setCopied(true);
      track("markdown_copy", { path });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const prompt = pageUrl ? encodeURIComponent(AI_PROMPT(pageUrl)) : null;

  return (
    <p className="no-print mt-16 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      <button type="button" onClick={copy} className="hover:text-ink transition-colors">
        {copied ? "Copied" : "Copy as markdown"}
      </button>
      <a href={path} className="hover:text-ink transition-colors">
        View as markdown
      </a>
      {prompt ? (
        <>
          <a
            href={`https://chatgpt.com/?hint=search&q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_chatgpt", { path })}
            className="inline-flex items-center gap-1 hover:text-ink transition-colors"
          >
            <OpenAIIcon width={12} height={12} />
            Open in ChatGPT ↗
          </a>
          <a
            href={`https://claude.ai/new?q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_claude", { path })}
            className="inline-flex items-center gap-1 hover:text-ink transition-colors"
          >
            <ClaudeIcon width={12} height={12} />
            Open in Claude ↗
          </a>
        </>
      ) : null}
    </p>
  );
}
