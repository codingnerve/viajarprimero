import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo/schema";

/**
 * How every interior page opens.
 *
 * Twenty-six pages each wrote out the same three things — a `Section`, a
 * `Breadcrumbs`, and a `PageHeader className="mt-8"` — and then continued
 * their body inside that same section. Two problems came out of that. The gap
 * between the trail and the heading was a class each page could get wrong, and
 * because the header shared a band with the body, no page had an opening: the
 * first screen was heading, paragraph, and then immediately a grid of cards.
 *
 * This is the band. It is tinted, it ends in a rule, and the page's body
 * starts in its own `Section` after it — so an interior page opens the way the
 * home page does, and it opens the same way on all twenty-six.
 */
export function PageIntro({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  actions,
  children,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  /** Trailing metadata — a published date, a badge row, a set of facts. */
  children?: ReactNode;
}) {
  return (
    <Section tone="brand-soft" size="sm" bordered as="div">
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        className="mt-8"
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        actions={actions}
      >
        {children}
      </PageHeader>
    </Section>
  );
}
