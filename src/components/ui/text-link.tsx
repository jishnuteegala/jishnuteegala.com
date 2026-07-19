import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "accent" | "quiet" | "ink";

const STYLES: Record<Variant, string> = {
  accent: "text-accent underline underline-offset-4 hover:no-underline",
  quiet: "text-muted hover:text-ink transition-colors",
  ink: "text-ink hover:text-accent transition-colors",
};

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function TextLink({ href, variant = "accent", children, className, ...rest }: Props) {
  const cls = `${STYLES[variant]}${className ? ` ${className}` : ""}`;
  const isInternal = href.startsWith("/") && !/\.(md|txt|xml|pdf)$/.test(href);
  if (isInternal) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}
