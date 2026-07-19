import type { Metadata } from "next";
import Link from "next/link";
import { labs } from "@/data/labs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMarkdownLink } from "@/components/page-markdown-link";
import { PageTitle } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";

export const metadata: Metadata = {
  title: "Labs",
  description: "Small self-contained experiments living inside this site.",
  alternates: { types: { "text/markdown": "/labs.md" } },
};

export default function LabsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>Labs</PageTitle>
        <p className="mt-3 max-w-prose text-muted">
          Small self-contained experiments that live inside this site. Bigger things get their own
          home, see <TextLink href="/projects">projects</TextLink>.
        </p>
        {labs.length === 0 ? (
          <p className="mt-12 max-w-prose text-sm leading-relaxed text-muted">
            Nothing here yet. The first experiment will appear when it&apos;s worth showing.
          </p>
        ) : (
          <ul className="mt-12 space-y-6">
            {labs.map((lab) => (
              <li key={lab.slug}>
                <article>
                  <h2 className="font-medium text-ink">
                    <Link
                      href={`/labs/${lab.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {lab.name}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-prose text-sm text-muted">{lab.description}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
        <PageMarkdownLink path="/labs.md" />
      </main>
      <SiteFooter />
    </>
  );
}
