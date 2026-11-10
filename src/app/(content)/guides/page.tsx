import { GuideCard } from "@/features/guides/components/guide-card";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getGuidesByCategory } from "@/lib/content/guides";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Travel guides",
  description:
    "Practical guides to the parts of booking that catch people out — flying with children, disrupted flights, hotel cancellation deadlines, driving abroad, boarding a cruise and reading an insurance policy.",
  path: "/guides",
});

export default function GuidesPage() {
  const groups = getGuidesByCategory();

  return (
    <>
      <Section tone="brand-soft" size="sm" bordered>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Reference"
          title="Travel guides"
          intro="Reference pages for the specific things travellers have to get right before they pay — who sets which rule, what has to be requested in advance, and what to check rather than assume. Where a rule belongs to an airline, a hotel, a rental company, a cruise line or a government, we say so and tell you where to confirm it."
        />
      </Section>

      <Section>
        {/*
          Grouped by category with the heading set against the cards rather
          than above them. On a wide screen that gives the reader a fixed
          left-hand index they can scan while the cards scroll past, instead of
          six identical headings interrupting one long grid.
        */}
        <div className="space-y-16">
          {groups.map((group) => {
            const id = group.category.replace(/\s+/g, "-").toLowerCase();

            return (
              <section
                key={group.category}
                aria-labelledby={id}
                className="grid gap-6 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-12"
              >
                <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
                  <h2 id={id} className="text-h3 text-balance text-text">
                    {group.category}
                  </h2>
                  <p className="mt-1 text-caption text-text-muted">
                    {group.guides.length}{" "}
                    {group.guides.length === 1 ? "guide" : "guides"}
                  </p>
                </div>

                <ul className="grid gap-4 sm:grid-cols-2">
                  {group.guides.map((guide) => (
                    <li key={guide.slug}>
                      <GuideCard guide={guide} headingLevel="h3" />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
