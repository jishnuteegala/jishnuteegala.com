import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cv } from "@/data/cv";
import { PageTitle } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects, and what it doesn't.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-16">
        <PageTitle>Privacy</PageTitle>
        <div className="mt-10 max-w-prose space-y-5 text-sm leading-relaxed">
          <p>
            This is a personal website. It has no accounts, no comments, no sales, and sets no
            cookies.
          </p>
          <h2 className="font-serif text-xl text-ink">What is collected</h2>
          <p>
            Anonymous, cookieless usage analytics via PostHog (hosted in the EU): page views,
            interaction events (such as CV downloads and outbound link clicks), and anonymous page
            performance timings (how fast pages load and respond), plus anonymous error reports if
            something on the page breaks. No identifier is stored on your device and no cross-site
            or cross-session profile is built.
          </p>
          <p>
            The site is hosted on Vercel, whose infrastructure processes your IP address transiently
            to serve requests, as any web host does.
          </p>
          <h2 className="font-serif text-xl text-ink">What is stored on your device</h2>
          <p>
            One localStorage entry holding your theme preference (light or dark), only if you set
            one. This is a functional setting you request, not tracking.
          </p>
          <h2 className="font-serif text-xl text-ink">Your rights &amp; contact</h2>
          <p>
            Under UK GDPR you can ask what data relates to you, though for this site the honest
            answer is: effectively none that identifies you. Questions to{" "}
            <TextLink href={`mailto:${cv.email}`}>{cv.email}</TextLink>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
