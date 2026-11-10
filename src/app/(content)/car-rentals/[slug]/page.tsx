import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/content/prose";
import { airports, getAirport } from "@/lib/content/airports";
import { getDestination } from "@/lib/content/destinations";
import { slugify } from "@/lib/utils/slugify";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Car rental at a given airport.
 *
 * The slug is the IATA code lowercased, which keeps the URL short and stable
 * and means the page cannot exist for an airport the catalogue does not know.
 * No rates and no named suppliers: which companies hold a desk at a terminal
 * changes with their concession contracts, and publishing a stale list reads
 * as a promise we cannot keep.
 */

export function generateStaticParams() {
  return airports.map((airport) => ({ slug: airport.code.toLowerCase() }));
}

export async function generateMetadata(
  props: PageProps<"/car-rentals/[slug]">,
) {
  const { slug } = await props.params;
  const airport = getAirport(slug);
  if (!airport) return {};

  return buildMetadata({
    title: `Car rental at ${airport.city} (${airport.code})`,
    description: `Renting a car at ${airport.name}, ${airport.city}. Tell us your dates and a travel agent finds the right car and books it with you.`,
    path: `/car-rentals/${airport.code.toLowerCase()}`,
  });
}

export default async function AirportCarHirePage(
  props: PageProps<"/car-rentals/[slug]">,
) {
  const { slug } = await props.params;
  const airport = getAirport(slug);
  if (!airport) notFound();

  // Only some airports have a city guide behind them; link it when it exists
  // rather than rendering a dead cross-reference.
  const destination = getDestination(slugify(airport.city));

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Car rental", path: "/car-rentals" },
          {
            name: `${airport.city} (${airport.code})`,
            path: `/car-rentals/${airport.code.toLowerCase()}`,
          },
        ]}
        eyebrow={`${airport.country} · ${airport.code}`}
        title={`Car rental at ${airport.city} (${airport.code})`}
        intro={
          <>
            Picking a car up at {airport.name}? Tell us your dates and the
            kind of car you need, and an agent finds the right option and
            books it with you.
          </>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">
                Collecting a car at an airport
              </h2>
              <Prose>
                <p>
                  Collecting at the airport means the car is ready as soon as
                  you land. If you are not driving for the first day or two, a
                  city pick-up later in the trip can suit you better.
                </p>
                <p>
                  Check whether the desks at {airport.code} are in the terminal
                  or at an off-site facility reached by shuttle. It changes your
                  arrival timing, and it matters most on a late arrival when the
                  shuttle may be running on a reduced schedule.
                </p>
              </Prose>
            </section>

            <nav aria-label="Related pages" className="border-t border-border pt-6">
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
                    href={`/airports/${airport.code.toLowerCase()}`}
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    {airport.code} airport guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/car-rentals"
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    All pick-up points
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <EnquiryPanel
            vertical="car"
            title={`Request a car at ${airport.code}`}
            intro="An agent gets back to you with the cars available for your dates. Nothing is held and nothing is charged."
            disclaimer="We are a travel agency, not a rental company. The car is supplied by the rental firm and its own rental agreement governs the hire."
            initial={{
              destination: `${airport.name} (${airport.code}), ${airport.city}`,
            }}
          />
        </div>
      </Section>
    </>
  );
}
