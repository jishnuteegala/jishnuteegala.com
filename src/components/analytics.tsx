"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let initialised = false;

function enabled() {
  return Boolean(KEY) && typeof window !== "undefined" && window.location.hostname !== "localhost";
}

function ensureInit() {
  if (initialised || !enabled()) return;
  posthog.init(KEY!, {
    api_host: "https://eu.i.posthog.com",
    persistence: "memory",
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    capture_performance: { web_vitals: true },
    capture_exceptions: true,
    person_profiles: "never",
  });
  initialised = true;
}

export function track(event: string, properties?: Record<string, string>) {
  if (!enabled()) return;
  ensureInit();
  posthog.capture(event, {
    page: window.location.pathname,
    theme: document.documentElement.dataset.theme ?? "light",
    ...properties,
  });
}

const SCROLL_TRACKED = /^\/(cv$|blog\/)/;

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled()) return;
    ensureInit();
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);

  useEffect(() => {
    if (!enabled()) return;
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.endsWith(".pdf")) {
        const m = href.match(/cv(-condensed)?-(light|dark)\.pdf$/);
        track("cv_pdf_download", {
          file: href,
          variant: m?.[1] ? "condensed" : "full",
          pdf_theme: m?.[2] ?? "unknown",
        });
      } else if (href.startsWith("mailto:")) {
        track("email_click");
      } else if (/^https:\/\/(www\.)?linkedin\.com\//.test(href)) {
        track("social_click", { network: "linkedin" });
      } else if (/^https:\/\/(www\.)?(x|twitter)\.com\//.test(href)) {
        track("social_click", { network: "x" });
      } else if (href.startsWith("https://gitlab.com/")) {
        track("social_click", { network: "gitlab", url: href });
      } else if (href.startsWith("https://github.com/")) {
        const isProfile = /^https:\/\/github\.com\/[^/]+\/?$/.test(href);
        if (isProfile) {
          track("social_click", { network: "github" });
        } else {
          track("project_click", { url: href });
        }
      } else if (href.startsWith("https://")) {
        track("outbound_click", { url: href });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!enabled() || !SCROLL_TRACKED.test(pathname)) return;
    const reached = new Set<number>();
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const depth of [25, 50, 75, 100]) {
        if (pct >= depth && !reached.has(depth)) {
          reached.add(depth);
          track("scroll_depth", { depth: String(depth) });
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
