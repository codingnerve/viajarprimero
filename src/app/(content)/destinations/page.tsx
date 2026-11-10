import { DestinationCard } from "@/features/destinations/components/destination-card";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getResolvedDestinations } from "@/lib/content/destinations";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Destination guides",
  description:
    "What these cities are actually like, when to visit, how to get around, and what to know before you commit to dates.",
  path: "/destinations",
});

export default function DestinationsPage() {
  const destinations = getResolvedDestinations();

  return (
    <>
      <Section tone="brand-soft" size="sm" bordered>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow={`${destinations.length} cities`}
          title="Destination guides"
          intro="Short, practical guides to the cities at the end of the routes we cover — the things that change how you plan, not a list of attractions you could find anywhere."
        />
      </Section>

      <Section>
        <ul className="reveal grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((destination) => (
            <li key={destination.slug}>
              <DestinationCard destination={destination} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
