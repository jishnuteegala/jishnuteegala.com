import type { HTMLAttributes, ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

export function PageTitle({ children, className, ...rest }: HeadingProps) {
  return (
    <h1
      className={`font-serif text-4xl text-ink sm:text-5xl${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({ children, className, ...rest }: HeadingProps) {
  return (
    <h2 className={`font-serif text-2xl text-ink${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </h2>
  );
}

export function SectionHead({ meta, children, ...rest }: HeadingProps & { meta?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <SectionHeading {...rest}>{children}</SectionHeading>
      {meta ? <span className="text-xs text-muted">{meta}</span> : null}
    </div>
  );
}

export function SourceNote({ src, refresh = "hourly" }: { src: string; refresh?: string }) {
  return (
    <>
      src: <span className="font-mono">{src}</span> · {refresh}
    </>
  );
}

export function EntryHeading({ children, className, ...rest }: HeadingProps) {
  return (
    <h3 className={`text-base font-semibold text-ink${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </h3>
  );
}
