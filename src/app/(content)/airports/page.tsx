import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { airports } from "@/lib/content/airports";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Airports",
  description:
    "The airports on the routes we cover, with what to know about connecting through each one and which city it actually serves.",
  path: "/airports",
});

/** Airport index, grouped by country so a long flat list stays scannable. */
export default function AirportsPage() {
  const byCountry = new Map<string, typeof airports>();
  for (const airport of airports) {
    const existing = byCountry.get(airport.country) ?? [];
    byCountry.set(airport.country, [...existing, airport]);
  }

  const countries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Airports", path: "/airports" },
        ]}
        title="Airports"
        intro="Which city an airport actually serves, and how far it is from it, is the detail that most often turns a good itinerary into an awkward one. These are the airports on the routes we cover."
      />

      <Section>

        <div className="space-y-8">
          {countries.map((country) => (
            <section key={country}>
              <h2 className="text-h4 text-text">{country}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(byCountry.get(country) ?? []).map((airport) => (
                  <li key={airport.code}>
                    <Link
                      href={`/airports/${airport.code.toLowerCase()}`}
                      className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3 transition-colors hover:border-primary hover:bg-primary-soft focus-ring"
                    >
                      <span>
                        <span className="block text-body-lg font-medium text-text">
                          {airport.city} ({airport.code})
                        </span>
                        <span className="block text-caption text-text-secondary">
                          {airport.name}
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-text-muted">
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
