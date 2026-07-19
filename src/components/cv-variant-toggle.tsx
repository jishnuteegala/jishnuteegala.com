"use client";

import { useState } from "react";
import { TextLink } from "@/components/ui/text-link";

type Variant = "full" | "condensed";

const PDF_HREFS: Record<Variant, Record<"light" | "dark", string>> = {
  full: {
    light: "/cv/jishnu-teegala-cv-light.pdf",
    dark: "/cv/jishnu-teegala-cv-dark.pdf",
  },
  condensed: {
    light: "/cv/jishnu-teegala-cv-condensed-light.pdf",
    dark: "/cv/jishnu-teegala-cv-condensed-dark.pdf",
  },
};

export function CvVariantToggle() {
  const [variant, setVariant] = useState<Variant>("full");

  function set(v: Variant) {
    setVariant(v);
    document.querySelector(".cv-root")?.setAttribute("data-variant", v);
  }

  return (
    <>
      <div role="group" aria-label="CV detail level" className="flex gap-1 text-sm">
        {(["full", "condensed"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => set(v)}
            aria-pressed={variant === v}
            className={
              variant === v
                ? "border-b border-ink px-1 text-ink"
                : "px-1 text-muted hover:text-ink transition-colors"
            }
          >
            {v === "full" ? "Full" : "Condensed"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-x-2 text-sm">
        <span className="text-muted">Download PDF</span>
        <TextLink href={PDF_HREFS[variant].light} download>
          light
        </TextLink>
        <span className="text-muted" aria-hidden>
          /
        </span>
        <TextLink href={PDF_HREFS[variant].dark} download>
          dark
        </TextLink>
      </div>
    </>
  );
}
