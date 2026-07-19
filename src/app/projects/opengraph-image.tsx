import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Projects — Jishnu Teegala";

export default function Image() {
  return ogImage("Projects", "Pinned work and live GitHub repositories");
}
