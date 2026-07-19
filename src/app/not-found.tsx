import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTitle, SectionHeading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";
import { Whoami } from "@/components/whoami";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const SUGGESTIONS = [
  { href: "/", label: "Home", desc: "who I am, pinned work, activity" },
  { href: "/cv", label: "CV", desc: "full and condensed, with PDFs" },
  { href: "/projects", label: "Projects", desc: "pinned work and every public repo" },
  { href: "/labs", label: "Labs", desc: "small in-site experiments" },
  { href: "/blog", label: "Blog", desc: "writing, when there is some" },
] as const;

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>404</PageTitle>
        <p className="mt-3 font-serif text-xl italic text-muted">
          There is no page at this address.
        </p>
        <p className="mt-8 max-w-prose leading-relaxed">
          Either the link that brought you here is wrong, or the page has moved. Nothing on this
          site gets deleted without a redirect, so a dead end usually means a typo.
        </p>

        <Whoami />

        <section className="mt-16" aria-labelledby="suggestions-heading">
          <SectionHeading id="suggestions-heading">Perhaps you wanted</SectionHeading>
          <ul className="mt-6 space-y-4">
            {SUGGESTIONS.map((s) => (
              <li key={s.href} className="flex items-baseline gap-x-3">
                <TextLink href={s.href} variant="ink">
                  {s.label}
                </TextLink>
                <span className="text-sm text-muted">{s.desc}</span>
                <span className="ml-auto shrink-0 font-mono text-xs text-muted">{s.href}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 text-sm text-muted">
          Convinced something should be here? Email{" "}
          <TextLink href="mailto:hi@jishnuteegala.com">hi@jishnuteegala.com</TextLink>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
