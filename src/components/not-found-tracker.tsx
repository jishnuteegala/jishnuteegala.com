"use client";

import { useEffect } from "react";
import { track } from "@/components/analytics";

export function NotFoundTracker() {
  useEffect(() => {
    track("not_found", {
      path: window.location.pathname,
      referrer: document.referrer || "direct",
    });
  }, []);

  return null;
}
