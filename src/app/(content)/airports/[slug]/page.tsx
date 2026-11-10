import Link from "next/link";
import { notFound } from "next/navigation";

import { RouteCard } from "@/features/search/components/route-card";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/content/prose";
import { airports, getAirport } from "@/lib/content/airports";
import { getDestination } from "@/lib/content/destinations";
import { getResolvedRoutes } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { slugify } from "@/lib/utils/slugify";

/**
 * Airport guide.
 *
 * Kept to what we can state without a data feed: the code, the city it serves,
 * and the routes in our own catalogue that touch it. Terminal maps, lounge
 * lists and walking times are not published here because we would be copying
 * them from the airport and they would silently go stale.
 */

export function generateStaticParams() {
  return airports.map((airport) => ({ slug: airport.code.toLowerCase() }));
}

export async function generateMetadata(props: PageProps<"/airports/[slug]">) {
  const { slug } = await props.params;
  const airport = getAirport(slug);
  if (!airport) return {};

  return buildMetadata({
    title: `${airport.name} (${airport.code})`,
    description: `${airport.name} serves ${airport.city}, ${airport.country}. Routes we cover through ${airport.code} and what to check when connecting.`,
    path: `/airports/${airport.code.toLowerCase()}`,
  });
}

export default async function AirportPage(
  props: PageProps<"/airports/[slug]">,
) {
  const { slug } = await props.params;
  const airport = getAirport(slug);
  if (!airport) notFound();

  const relatedRoutes = getResolvedRoutes().filter(
    (route) =>
      route.origin.code === airport.code ||
      route.destination.code === airport.code,
  );

  const destination = getDestination(slugify(airport.city));

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Airports", path: "/airports" },
          {
            name: `${airport.city} (${airport.code})`,
            path: `/airports/${airport.code.toLowerCase()}`,
          },
        ]}
        eyebrow={`${airport.city} · ${airport.country}`}
        title={`${airport.name} (${airport.code})`}
        intro={
          <>
            {airport.name} serves {airport.city}, {airport.country}, under the
            IATA code {airport.code}.
          </>
        }
      />

      <Section>
        <section className="measure">
          <h2 className="mb-3 text-h3 text-text">
            Connecting through {airport.code}
          </h2>
          <Prose>
            <p>
              A published minimum connection time is the point below which a
              connection is impossible, not the point above which it is
              comfortable. It assumes both flights run on time, that you do not
              clear immigration, and that your gates are not at opposite ends of
              the airport.
            </p>
            <p>Before accepting a connection here, check:</p>
            <ul>
              <li>Whether you change terminal, and how the transfer works.</li>
              <li>
                Whether you clear immigration and re-check bags — connecting
                through a country you are entering means queueing twice.
              </li>
              <li>
                Whether it is one ticket or two. On two separate tickets a missed
                connection is your cost, not the airline&apos;s.
              </li>
              <li>
                Whether it is the last departure of the day, which turns a delay
                into an overnight.
              </li>
            </ul>
            <p>
              More on this in{" "}
              <Link href="/travel-blog/what-to-check-before-you-book-a-connection">
                what to check before you book a connection
              </Link>
              .
            </p>
          </Prose>
        </section>

        {relatedRoutes.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-h3 text-text">
              Routes we cover through {airport.code}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRoutes.map((route) => (
                <li key={route.slug}>
                  <RouteCard route={route} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="Related pages" className="mt-10 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-3">
            {destination && (
              <li>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  {destination.city} travel guide
                </Link>
              </li>
            )}
            <li>
              <Link
                href={`/car-rentals/${airport.code.toLowerCase()}`}
                className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
              >
                Car rental at {airport.code}
              </Link>
            </li>
            <li>
              <Link
                href="/airports"
                className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
              >
                All airports
              </Link>
            </li>
          </ul>
        </nav>
      </Section>
    </>
  );
}
