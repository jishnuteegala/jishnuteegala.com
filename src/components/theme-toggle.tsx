"use client";

import { useEffect, useState } from "react";
import { track } from "./analytics";

type Theme = "light" | "dark" | "system";

const ORDER: Theme[] = ["light", "system", "dark"];

function apply(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mounted, theme]);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setTheme(next);
    if (next === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", next);
    apply(next);
    track("theme_toggle", { theme: next });
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="font-mono text-sm text-muted hover:text-ink transition-colors"
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme} (click to change)`}
    >
      ◐ {mounted ? theme : "system"}
    </button>
  );
}
