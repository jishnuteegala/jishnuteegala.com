import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`input-quiet border-b border-border bg-transparent px-1 py-0.5 text-sm text-ink placeholder:text-muted focus:border-border-strong focus:outline-none${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <span className={`relative inline-flex items-center${className ? ` ${className}` : ""}`}>
      <select
        className="input-quiet appearance-none border-b border-border bg-transparent py-0.5 pr-6 pl-1 text-sm text-ink focus:border-border-strong focus:outline-none"
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-1.5 h-3 w-3 text-muted"
      >
        <path d="M4 6.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </span>
  );
}

export function Checkbox({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`checkbox-quiet${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}
