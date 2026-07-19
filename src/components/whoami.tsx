"use client";

import { useEffect, useState } from "react";

export function Whoami() {
  const [referrer, setReferrer] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    try {
      setReferrer(document.referrer ? new URL(document.referrer).host : "nowhere in particular");
    } catch {
      setReferrer("nowhere in particular");
    }
    setPath(window.location.pathname);
  }, []);

  return (
    <dl className="mt-6 space-y-1 border-l-2 border-border pl-4 text-sm">
      <div className="flex gap-x-3">
        <dt className="w-20 shrink-0 font-mono text-xs leading-6 text-muted">whoami</dt>
        <dd className="text-ink">a visitor, arriving from {referrer ?? "…"}</dd>
      </div>
      <div className="flex gap-x-3">
        <dt className="w-20 shrink-0 font-mono text-xs leading-6 text-muted">looking for</dt>
        <dd className="min-w-0 break-all font-mono text-xs leading-6 text-ink">{path ?? "…"}</dd>
      </div>
      <div className="flex gap-x-3">
        <dt className="w-20 shrink-0 font-mono text-xs leading-6 text-muted">found</dt>
        <dd className="text-muted">nothing at all</dd>
      </div>
    </dl>
  );
}
