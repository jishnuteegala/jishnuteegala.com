"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let initialised = false;

function ensureInit() {
  if (initialised || !KEY) return;
  posthog.init(KEY, {
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
  if (!KEY) return;
  ensureInit();
  posthog.capture(event, properties);
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!KEY) return;
    ensureInit();
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);

  useEffect(() => {
    if (!KEY) return;
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.endsWith(".pdf")) {
        track("cv_pdf_download", { file: href });
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

  return null;
}
