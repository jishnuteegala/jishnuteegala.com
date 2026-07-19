import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const STYLES: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:opacity-90 transition-opacity",
  secondary: "border border-border-strong text-ink hover:border-ink transition-colors",
  ghost: "text-muted hover:text-ink transition-colors",
};

type Props = {
  variant?: Variant;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "secondary", children, className, type, ...rest }: Props) {
  return (
    <button
      type={type ?? "button"}
      className={`px-3 py-1 text-sm ${STYLES[variant]}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
