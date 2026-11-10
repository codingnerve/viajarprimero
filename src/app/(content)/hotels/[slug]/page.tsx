import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/content/prose";
import {
  destinations,
  getDestination,
  resolveDestination,
} from "@/lib/content/destinations";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Per-city hotel guide.
 *
 * Built from the same editorial record as the destination guide, because the
 * facts about a city do not change depending on which page they appear on.
 * What differs is the framing: this page answers "where should I stay and what
 * will it cost me", and it carries no rates, no star ratings we did not award,
 * and no named properties we have not actually placed guests in.
 */

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata(props: PageProps<"/hotels/[slug]">) {
  const { slug } = await props.params;
  const destination = getDestination(slug);
  if (!destination) return {};

  return buildMetadata({
    title: `Hotels in ${destination.city}`,
    description: `Hotels in ${destination.city}: when to go, how to get around, and what to know before you book. Request options and an agent finds rooms that fit.`,
    path: `/hotels/${destination.slug}`,
  });
}

export default async function CityHotelsPage(
  props: PageProps<"/hotels/[slug]">,
) {
  const { slug } = await props.params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const resolved = resolveDestination(destination);
  if (!resolved) notFound();

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Hotels", path: "/hotels" },
          { name: resolved.city, path: `/hotels/${resolved.slug}` },
        ]}
        eyebrow={`${resolved.country} · ${resolved.airport.code}`}
        title={`Hotels in ${resolved.city}`}
        intro={resolved.intro}
      />

      <Section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">
                When to go, and what that does to rates
              </h2>
              <Prose>
                <p>{resolved.bestTimeToVisit}</p>
                <p>
                  Room rates in {resolved.city} follow demand rather than a
                  published calendar, so the shoulder months are usually both
                  more comfortable and less contested. Tell us your dates and we
                  will find what is available.
                </p>
              </Prose>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">Getting around</h2>
              <Prose>
                <p>{resolved.gettingAround}</p>
                <p>
                  This matters more than it looks when choosing a hotel. A
                  cheaper room a long way from the network you will actually use
                  often costs more once transport and time are counted.
                </p>
              </Prose>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">
                Before you book in {resolved.city}
              </h2>
              <Prose>
                <ul>
                  {resolved.goodToKnow.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Prose>
            </section>

            <nav aria-label="Related pages" className="border-t border-border pt-6">
              <ul className="flex flex-wrap gap-3">
                <li>
                  <Link
                    href={`/destinations/${resolved.slug}`}
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    {resolved.city} travel guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hotels"
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    All hotel cities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/car-rentals"
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    Car rental
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <EnquiryPanel
            vertical="stay"
            title={`Request rooms in ${resolved.city}`}
            intro="An agent gets back to you with rooms that fit your dates. Nothing is held and nothing is charged."
            disclaimer="We are a travel agency, not a hotel. Rooms are supplied by the property, and its own booking conditions govern your stay."
            initial={{ destination: resolved.city }}
          />
        </div>
      </Section>
    </>
  );
}
