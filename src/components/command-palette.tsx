"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "./analytics";

export type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  group: "pages" | "projects" | "actions";
  href?: string;
};

const GROUP_LABELS: Record<PaletteItem["group"], string> = {
  pages: "pages",
  projects: "projects",
  actions: "actions",
};

const GROUP_ORDER: PaletteItem["group"][] = ["pages", "projects", "actions"];

function cycleTheme() {
  const stored = localStorage.getItem("theme");
  const current = stored === "light" || stored === "dark" ? stored : "system";
  const order = ["light", "system", "dark"] as const;
  const next = order[(order.indexOf(current) + 1) % order.length];
  if (next === "system") localStorage.removeItem("theme");
  else localStorage.setItem("theme", next);
  const dark =
    next === "dark" || (next === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const all = useMemo<PaletteItem[]>(
    () => [
      ...items,
      { id: "action:theme", label: "toggle theme", group: "actions" },
      { id: "action:copy-url", label: "copy page url", group: "actions" },
      { id: "action:cv-pdf", label: "download cv pdf", hint: "light", group: "actions" },
    ],
    [items],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? all.filter((i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q))
      : all;
    return GROUP_ORDER.flatMap((g) => matched.filter((i) => i.group === g));
  }, [all, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const inField =
        e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !inField) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      track("palette_open");
    }
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  function run(item: PaletteItem) {
    setOpen(false);
    if (item.id === "action:theme") {
      cycleTheme();
    } else if (item.id === "action:copy-url") {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    } else if (item.id === "action:cv-pdf") {
      window.location.href = "/cv/jishnu-teegala-cv-light.pdf";
    } else if (item.href) {
      if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener");
      else router.push(item.href);
    }
    track("palette_run", { item: item.id });
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = visible[index];
      if (item) run(item);
    }
  }

  if (!open) return null;

  let flat = -1;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        onClick={(e) => e.stopPropagation()}
        className="mx-auto mt-[18vh] w-[min(34rem,calc(100vw-2rem))] border border-border-strong bg-bg shadow-lg"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Search pages, projects, actions…"
          aria-label="Search"
          className="palette-input w-full border-b border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-border-strong focus:outline-none"
        />
        <ul ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto py-1">
          {visible.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">No matches.</li>
          ) : (
            GROUP_ORDER.map((g) => {
              const group = visible.filter((i) => i.group === g);
              if (group.length === 0) return null;
              return (
                <li key={g}>
                  <div className="px-4 pt-2 pb-1 font-mono text-xs text-muted">
                    {GROUP_LABELS[g]}
                  </div>
                  <ul>
                    {group.map((item) => {
                      flat += 1;
                      const i = flat;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            data-index={i}
                            role="option"
                            aria-selected={i === index}
                            onClick={() => run(item)}
                            onMouseMove={() => setIndex(i)}
                            className={`flex w-full items-baseline justify-between gap-4 px-4 py-1.5 text-left text-sm transition-colors ${
                              i === index ? "bg-surface text-accent" : "text-ink"
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            {item.hint ? (
                              <span className="truncate font-mono text-xs text-muted">
                                {item.hint}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-xs text-muted">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="ml-auto">ctrl k / ⌘k</span>
        </div>
      </div>
    </div>
  );
}
