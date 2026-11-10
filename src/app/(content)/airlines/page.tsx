import Link from "next/link";

import { AirlineLogo } from "@/components/content/airline-logo";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { airlines } from "@/lib/content/airlines";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Airlines",
  description:
    "The airlines we book most often, with check-in and baggage links for each one.",
  path: "/airlines",
});

export default function AirlinesPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Airlines", path: "/airlines" },
        ]}
        title="Airlines"
        intro="The airlines we book most often. Each page takes you to the airline's own check-in, baggage and travel policies."
      />

      <Section>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {airlines.map((airline) => (
            <li key={airline.slug}>
              <Link
                href={`/airlines/${airline.slug}`}
                className="flex h-full items-center gap-4 rounded-xs border border-border bg-surface px-4 py-3 transition-colors hover:border-primary hover:bg-primary-soft focus-ring"
              >
                <AirlineLogo code={airline.code} name={airline.name} className="h-12 w-24" />
                <span className="min-w-0 flex-1">
                  <span className="block text-body-lg font-medium text-text">
                    {airline.name}
                  </span>
                  <span className="block text-caption text-text-secondary">
                    {airline.code} · {airline.country}
                  </span>
                </span>
                {airline.alliance !== "None" && (
                  <Badge tone="neutral">{airline.alliance}</Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <Alert tone="info" className="measure mt-10">
          We are a travel agency and book seats on these airlines as an agent.
          We are not affiliated with or endorsed by any of them, and the names
          and logos belong to the airlines.
        </Alert>
      </Section>
    </>
  );
}
