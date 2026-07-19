import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cv, type Role } from "@/data/cv";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMarkdownLink } from "@/components/page-markdown-link";
import { CvVariantToggle } from "@/components/cv-variant-toggle";
import { PageTitle, EntryHeading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/text-link";
import { EntryGrid, EntryWhen, EntryBody } from "@/components/ui/entry";
import "./cv.css";

export const metadata: Metadata = {
  title: "CV",
  description: `CV of ${cv.name}, ${cv.headline} in ${cv.location}.`,
  alternates: { types: { "text/markdown": "/cv.md" } },
};

export default function CvPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="cv-root mx-auto w-full max-w-3xl px-6 py-16" data-variant="full">
        <header className="cv-header">
          <div>
            <PageTitle>{cv.name}</PageTitle>
            <p className="mt-3 text-lg text-muted">
              {cv.headline} · {cv.location}
            </p>
            <p className="mt-1 text-sm text-muted">{cv.workEligibility}</p>
          </div>
          <ul className="cv-contact mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <li>
              <TextLink href={`mailto:${cv.email}`}>{cv.email}</TextLink>
            </li>
            {cv.links.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href} rel="me noopener">
                  {l.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </header>

        <div className="no-print mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-y border-border py-3">
          <CvVariantToggle />
          <span className="text-sm text-muted">
            or print: <kbd className="font-mono text-xs">Ctrl+P</kbd> /{" "}
            <kbd className="font-mono text-xs">⌘P</kbd>
          </span>
        </div>

        <section className="cv-section" aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="cv-section-heading">
            Profile
          </h2>
          <div className="cv-section-body">
            <p className="max-w-prose leading-relaxed">{cv.profile}</p>
          </div>
        </section>

        <section className="cv-section" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="cv-section-heading">
            Experience
          </h2>
          <div className="cv-section-body space-y-10">
            {cv.experience.map((role) => {
              const hasHighlights = role.bullets.some((b) => b.emphasis === "highlight");
              return (
                <article
                  key={`${role.title}-${role.start}`}
                  data-role-empty-when-condensed={hasHighlights ? undefined : ""}
                >
                  <EntryGrid>
                    <EntryWhen>
                      {role.start} –<br className="cv-date-break" /> {role.end}
                    </EntryWhen>
                    <EntryBody>
                      <EntryHeading>{role.title}</EntryHeading>
                      <p className="mt-0.5 text-sm text-muted">
                        <OrgLine role={role} />
                        {role.orgNote ? ` · ${role.orgNote}` : ""}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {role.bullets.map((b, i) => (
                          <li
                            key={i}
                            data-emphasis={b.emphasis}
                            className="cv-bullet max-w-prose text-[0.9375rem] leading-relaxed"
                          >
                            {b.text}
                          </li>
                        ))}
                      </ul>
                    </EntryBody>
                  </EntryGrid>
                </article>
              );
            })}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="education-heading">
          <h2 id="education-heading" className="cv-section-heading">
            Education
          </h2>
          <div className="cv-section-body space-y-8">
            {cv.education.map((e) => (
              <article key={e.institution}>
                <EntryGrid>
                  <EntryWhen>
                    {e.start} –<br className="cv-date-break" /> {e.end}
                  </EntryWhen>
                  <EntryBody>
                    <EntryHeading>{e.institution}</EntryHeading>
                    <p className="mt-0.5 text-sm text-muted">{e.location}</p>
                    <ul className="mt-2 space-y-1.5">
                      {e.details.map((d, i) => (
                        <li
                          key={i}
                          className="cv-list-item max-w-prose text-[0.9375rem] leading-relaxed"
                        >
                          {d.text}
                        </li>
                      ))}
                    </ul>
                  </EntryBody>
                </EntryGrid>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="cv-section-heading">
            Skills &amp; Interests
          </h2>
          <div className="cv-section-body">
            <dl className="space-y-5">
              {cv.skills.map((s) => (
                <div key={s.label} className="entry-grid">
                  <dt className="entry-when text-sm font-medium text-ink">{s.label}</dt>
                  <dd className="entry-body max-w-prose text-[0.9375rem] leading-relaxed text-muted">
                    {s.items}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="cv-section" aria-labelledby="certs-heading">
          <h2 id="certs-heading" className="cv-section-heading">
            Certifications
          </h2>
          <div className="cv-section-body">
            <ul className="max-w-prose space-y-1.5">
              {cv.certifications.split("; ").map((c) => (
                <li key={c} className="cv-list-item text-[0.9375rem] leading-relaxed">
                  {c.replace(/\.$/, "")}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-projects-heading">
          <h2 id="cv-projects-heading" className="cv-section-heading">
            Selected projects
          </h2>
          <div className="cv-section-body">
            <ul className="space-y-3">
              {cv.selectedProjects.map((p) => (
                <li
                  key={p.name}
                  className="cv-list-item max-w-prose text-[0.9375rem] leading-relaxed"
                >
                  <TextLink href={p.href} variant="ink" className="font-medium">
                    {p.name}
                  </TextLink>{" "}
                  <span className="text-muted">· {p.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="no-print mt-12 text-sm">
          <TextLink href="/" variant="quiet">
            ← Home
          </TextLink>
        </p>

        <PageMarkdownLink path="/cv.md" />
      </main>
      <SiteFooter />
    </>
  );
}

function OrgLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      rel="noopener"
      className="underline decoration-border underline-offset-4 hover:text-ink hover:decoration-border-strong transition-colors"
    >
      {children}
    </a>
  );
}

function OrgLine({ role }: { role: Role }) {
  return <OrgLink href={role.orgHref}>{role.org}</OrgLink>;
}
