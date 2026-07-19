import type { ReactNode } from "react";

export function EntryGrid({ children }: { children: ReactNode }) {
  return <div className="entry-grid">{children}</div>;
}

export function EntryWhen({ children }: { children: ReactNode }) {
  return <div className="entry-when text-sm tabular-nums text-muted">{children}</div>;
}

export function EntryBody({ children }: { children: ReactNode }) {
  return <div className="entry-body">{children}</div>;
}
