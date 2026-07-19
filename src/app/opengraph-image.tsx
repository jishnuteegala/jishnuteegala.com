import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Jishnu Teegala";

export default function Image() {
  return ogImage("Jishnu Teegala", "DevOps Platforms Engineer · London, UK");
}
