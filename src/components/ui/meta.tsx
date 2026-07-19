import type { ReactNode } from "react";

export function MetaText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm text-muted${className ? ` ${className}` : ""}`}>{children}</p>;
}

export function DateStamp({ date, format }: { date: Date; format?: Intl.DateTimeFormatOptions }) {
  return (
    <time dateTime={date.toISOString()} className="text-sm tabular-nums text-muted">
      {date.toLocaleDateString("en-GB", format ?? { year: "numeric", month: "short" })}
    </time>
  );
}
