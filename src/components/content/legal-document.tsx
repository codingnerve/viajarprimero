import type { ReactNode } from "react";

import { Prose } from "@/components/content/prose";
import { Section } from "@/components/layout/section";
import { policyEffectiveDate } from "@/lib/config/legal";
import { formatLongDate } from "@/lib/utils/format-date";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

/**
 * Shared shell for every policy page.
 *
 * The contents list is generated from the same `sections` array that renders
 * the body, so a section can never be added without appearing in the index —
 * the usual failure mode for hand-maintained policy pages.
 *
 * The redesign left the structure alone and changed how the two columns
 * relate. The contents list is now a rule-marked index rather than a list of
 * links, each section is separated by space instead of a heading crammed
 * against the paragraph before it, and the numbering runs from one array so
 * the index and the body cannot disagree.
 */
export function LegalDocument({
  title,
  summary,
  sections,
}: {
  title: string;
  summary: string;
  sections: readonly LegalSection[];
}) {
  const effectiveDate = policyEffectiveDate.startsWith("TODO_")
    ? null
    : formatLongDate(policyEffectiveDate);

  return (
    <>
      <Section tone="brand-soft" size="sm" bordered as="header">
        <div className="measure">
          <h1 className="text-balance text-display text-text">{title}</h1>
          <p className="mt-5 text-body-lg text-text-secondary">{summary}</p>
          <p className="mt-6 text-caption text-text-muted">
            {effectiveDate ? (
              <>Last updated {effectiveDate}.</>
            ) : (
              <>
                Effective date not yet set — configure{" "}
                <code className="rounded-sm bg-gray-100 px-1">
                  policyEffectiveDate
                </code>{" "}
                in <code>src/lib/config/legal.ts</code>{" "}
                before publishing.
              </>
            )}
          </p>
        </div>
      </Section>

      <Section as="article">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
          <nav
            aria-label="On this page"
            className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start"
          >
            <p className="text-overline uppercase text-text-muted">
              On this page
            </p>
            <ol className="mt-4 space-y-0.5 border-l border-border">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex gap-2 border-l border-transparent py-1.5 pl-4 text-body-sm text-text-secondary transition-colors hover:border-primary hover:text-primary focus-ring"
                  >
                    <span className="tabular-nums text-text-muted">
                      {index + 1}.
                    </span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 divide-y divide-border">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-[calc(var(--header-height)+2rem)] py-10 first:pt-0 last:pb-0"
              >
                <h2 className="flex gap-3 text-h2 text-text">
                  <span
                    aria-hidden="true"
                    className="tabular-nums text-text-disabled"
                  >
                    {index + 1}.
                  </span>
                  <span className="text-balance">{section.heading}</span>
                </h2>
                <Prose className="mt-4">{section.body}</Prose>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
