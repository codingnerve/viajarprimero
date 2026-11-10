import Link from "next/link";
import { notFound } from "next/navigation";

import { FlightSearchForm } from "@/features/search/components/flight-search-form";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { airports } from "@/lib/content/airports";
import { destinations } from "@/lib/content/destinations";
import { getRoute, resolveRoute, routes } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";
import { formatDuration } from "@/lib/utils/format-duration";

/**
 * Route landing page — the SEO surface of the site.
 *
 * Prerendered from the local route catalogue. The page answers the query
 * ("flights from A to B") with real, checkable route information and a search
 * box, rather than a fabricated "from $199" headline that we could not honour.
 */

export function generateStaticParams() {
  return routes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata(
  props: PageProps<"/flights/[slug]">,
) {
  const { slug } = await props.params;
  const route = getRoute(slug);
  if (!route) return {};

  const resolved = resolveRoute(route);
  if (!resolved) return {};

  return buildMetadata({
    title: `Flights from ${resolved.origin.city} to ${resolved.destination.city}`,
    description: `Planning a flight from ${resolved.origin.city} (${resolved.origin.code}) to ${resolved.destination.city} (${resolved.destination.code}): approximate nonstop time, which airports to use, and the best months to travel.`,
    path: `/flights/${route.slug}`,
  });
}

export default async function RoutePage(props: PageProps<"/flights/[slug]">) {
  const { slug } = await props.params;
  const route = getRoute(slug);
  if (!route) notFound();

  const resolved = resolveRoute(route);
  if (!resolved) notFound();

  const relatedDestination = destinations.find(
    (destination) => destination.airportCode === resolved.destination.code,
  );

  const faqs = [
    {
      question: `How long is the flight from ${resolved.origin.city} to ${resolved.destination.city}?`,
      answer: resolved.nonstopAvailable
        ? `A nonstop flight takes approximately ${formatDuration(resolved.nonstopDurationMinutes)}. Itineraries with a connection take longer, and the total depends on the connection time.`
        : `There is no nonstop service on this route, so the total journey time depends on where you connect.`,
    },
    {
      question: `Which airports serve this route?`,
      answer: `This page covers ${resolved.origin.name} (${resolved.origin.code}) in ${resolved.origin.city} and ${resolved.destination.name} (${resolved.destination.code}) in ${resolved.destination.city}. Other airports may serve either city — check which one your itinerary actually uses before arranging ground transport.`,
    },
    {
      question: `When is the best time to fly to ${resolved.destination.city}?`,
      answer: `${resolved.bestMonths} generally offers the best balance of weather and crowds. Airline schedules on this route can also thin outside the peak season.`,
    },
    {
      question: `Why is there no price on this page?`,
      answer: `Because we do not hold a fare of our own to quote. Airfares change daily with availability, and a figure printed on a landing page would be out of date almost immediately. Run a search or send us the trip and you will get a current price with the fare, taxes and our service fee itemised.`,
    },
  ];

  return (
    <>
      <JsonLd schema={faqSchema(faqs)} />

      <Section>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Flights", path: "/flights" },
            {
              name: `${resolved.origin.city} to ${resolved.destination.city}`,
              path: `/flights/${resolved.slug}`,
            },
          ]}
        />

        <header className="mt-6 measure">
          <h1 className="text-display text-text">
            Flights from {resolved.origin.city} to {resolved.destination.city}
          </h1>
          <p className="mt-4 text-body-lg text-gray-700">
            {resolved.intro}
          </p>
        </header>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          <div className="bg-surface p-4">
            <dt className="text-caption text-text-secondary">
              Approximate nonstop time
            </dt>
            <dd className="mt-1 text-h3 text-text tabular-nums">
              {resolved.nonstopAvailable
                ? formatDuration(resolved.nonstopDurationMinutes)
                : "Connection required"}
            </dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-caption text-text-secondary">Distance</dt>
            <dd className="mt-1 text-h3 text-text tabular-nums">
              {resolved.distanceKm.toLocaleString("en-US")} km
            </dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-caption text-text-secondary">Best months</dt>
            <dd className="mt-1 text-h5 text-text">{resolved.bestMonths}</dd>
          </div>
        </dl>

        <section className="mt-10">
          <h2 className="text-h2 text-text">Search this route</h2>
          <p className="mt-2 measure text-body-lg text-text-secondary">
            Pick your dates and we will price the itinerary in full — fare,
            taxes and carrier charges, and our service fee.
          </p>
          <FlightSearchForm
            airports={airports}
            defaultOrigin={`${resolved.origin.code} — ${resolved.origin.city}`}
            defaultDestination={`${resolved.destination.code} — ${resolved.destination.city}`}
            className="mt-5 border border-border"
          />
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <section>
              <h2 className="text-h2 text-text">
                What to know before you book
              </h2>
              <ul className="mt-4 measure space-y-3">
                {resolved.planningNotes.map((note) => (
                  <li
                    key={note}
                    className="flex gap-3 text-body-lg text-gray-700"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-1.5 size-4 shrink-0 text-primary"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="10" cy="10" r="4" />
                    </svg>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <h2 className="text-h2 text-text">Common questions</h2>
              <Accordion items={faqs} className="mt-4" />
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-5">
              <h2 className="text-h4 text-text">Airports on this route</h2>
              <dl className="mt-3 space-y-3 text-body">
                <div>
                  <dt className="text-text-secondary">
                    From — {resolved.origin.code}
                  </dt>
                  <dd className="text-text">
                    {resolved.origin.name}, {resolved.origin.city},{" "}
                    {resolved.origin.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary">
                    To — {resolved.destination.code}
                  </dt>
                  <dd className="text-text">
                    {resolved.destination.name}, {resolved.destination.city},{" "}
                    {resolved.destination.country}
                  </dd>
                </div>
              </dl>
            </div>

            {relatedDestination && (
              <div className="rounded-xl bg-surface-2 ring-1 ring-inset ring-border p-5">
                <h2 className="text-h4 text-text">
                  Guide to {relatedDestination.city}
                </h2>
                <p className="mt-2 text-body text-gray-700">
                  {relatedDestination.summary}
                </p>
                <Link
                  href={`/destinations/${relatedDestination.slug}`}
                  className="mt-3 inline-block text-body font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Read the {relatedDestination.city} guide
                </Link>
              </div>
            )}

            <div className="rounded-xl bg-primary-softer p-5">
              <h2 className="text-h4 text-text">Rather we did the work?</h2>
              <p className="mt-2 text-body text-gray-700">
                Send us the trip and an agent will get back to you with
                prices. Nothing is charged until you confirm.
              </p>
              <ButtonLink href="/checkout" className="mt-4" fullWidth>
                Request a quote
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
