"use client";

export function PaletteHint() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("palette:open"))}
      className="text-muted hover:text-ink transition-colors"
      aria-label="Search (Ctrl+K)"
      title="Search (Ctrl+K / ⌘K)"
    >
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden
        className="translate-y-px"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5.5 5.5" />
      </svg>
    </button>
  );
}
