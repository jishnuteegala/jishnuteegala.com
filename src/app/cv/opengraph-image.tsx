import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "CV — Jishnu Teegala";

export default function Image() {
  return ogImage("CV", "Jishnu Teegala · DevOps Platforms Engineer");
}
