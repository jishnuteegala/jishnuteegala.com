import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { PaletteHint } from "./palette-hint";
import { TextLink } from "@/components/ui/text-link";
import { hasPosts } from "@/lib/posts";

const NAV = [
  { href: "/cv", label: "CV" },
  { href: "/projects", label: "Projects" },
  { href: "/labs", label: "Labs" },
];

export function SiteHeader() {
  const showBlog = hasPosts();
  return (
    <header className="site-header sticky top-0 z-40 border-b border-border bg-bg">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-5">
        <Link href="/" className="font-serif text-lg text-ink hover:text-accent transition-colors">
          Jishnu Teegala
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-baseline gap-5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <TextLink href={item.href} variant="quiet">
                  {item.label}
                </TextLink>
              </li>
            ))}
            {showBlog ? (
              <li>
                <TextLink href="/blog" variant="quiet">
                  Blog
                </TextLink>
              </li>
            ) : null}
            <li>
              <PaletteHint />
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
