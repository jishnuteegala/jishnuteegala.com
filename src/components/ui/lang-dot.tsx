import { langColor } from "@/lib/lang-colors";

export function LangDot({ language }: { language: string | null }) {
  if (!language) return null;
  const color = langColor(language);
  return (
    <span
      aria-hidden
      className="inline-block size-2 rounded-full"
      style={color ? { background: color } : { background: "var(--border-strong)" }}
    />
  );
}
