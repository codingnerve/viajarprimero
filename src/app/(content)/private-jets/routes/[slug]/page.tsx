import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Prose } from "@/components/content/prose";
import {
  aircraftCategories,
  getAircraftCategory,
  getJetRoute,
  jetRoutes,
} from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return jetRoutes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata(
  props: PageProps<"/private-jets/routes/[slug]">,
) {
  const { slug } = await props.params;
  const route = getJetRoute(slug);
  if (!route) return {};

  return buildMetadata({
    title: `Private jet charter ${route.originCity} to ${route.destinationCity}`,
    description: `Chartering ${route.originCity} (${route.originCode}) to ${route.destinationCity} (${route.destinationCode}): ${route.distanceNm.toLocaleString("en-US")} nm, ${route.blockTime}, which aircraft categories fly it nonstop and what constrains the leg.`,
    path: `/private-jets/routes/${route.slug}`,
  });
}

/**
 * A single charter route.
 *
 * These are the pages built to rank for "private jet <city> to <city>", which
 * is the highest-intent search in this vertical. What keeps them useful rather
 * than doorway pages is that each carries facts specific to the leg — the
 * airports, the distance, the directional block time, and the real constraint,
 * which on most of these is a slot or a duty limit rather than the aircraft.
 */
export default async function JetRoutePage(
  props: PageProps<"/private-jets/routes/[slug]">,
) {
  const { slug } = await props.params;
  const route = getJetRoute(slug);
  if (!route) notFound();

  const categories = route.suitableCategories
    .map((categorySlug) => getAircraftCategory(categorySlug))
    .filter((category) => category !== undefined);

  const otherRoutes = jetRoutes.filter((entry) => entry.slug !== route.slug);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Routes", path: "/private-jets/routes" },
          {
            name: `${route.originCity} to ${route.destinationCity}`,
            path: `/private-jets/routes/${route.slug}`,
          },
        ]}
        eyebrow={`${route.originCode} → ${route.destinationCode}`}
        title={`Private jet charter, ${route.originCity} to ${route.destinationCity}`}
        intro={route.intro}
      >
        <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-3">
          <div className="border-t border-border pt-4">
            <dt className="text-overline uppercase text-text-muted">
              Distance
            </dt>
            <dd className="mt-1.5 text-h5 tabular-nums text-text">
              {route.distanceNm.toLocaleString("en-US")} nm
            </dd>
          </div>
          <div className="border-t border-border pt-4">
            <dt className="text-overline uppercase text-text-muted">
              Block time
            </dt>
            <dd className="mt-1.5 text-h5 text-text">{route.blockTime}</dd>
          </div>
          <div className="border-t border-border pt-4">
            <dt className="text-overline uppercase text-text-muted">
              Airports
            </dt>
            <dd className="mt-1.5 text-h5 text-text">
              {route.originCode} → {route.destinationCode}
            </dd>
          </div>
        </dl>
      </PageIntro>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            <section>
              <h2 className="text-h2 text-text">The airports</h2>
              <Prose className="mt-4">
                <p>
                  This route is flown{" "}
                  <strong>
                    {route.originAirport} ({route.originCode})
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {route.destinationAirport} ({route.destinationCode})
                  </strong>
                  . Business-aviation fields are where most of the time saving
                  on a private flight actually comes from — the aircraft is a
                  smaller part of it than people expect. You arrive minutes
                  before departure, walk to the aircraft, and clear customs on
                  the ramp rather than in a hall.
                </p>
                <p>
                  Other fields serve both cities and may suit you better
                  depending on where you are starting and finishing. We check
                  that against your actual address rather than defaulting to the
                  best-known airport.
                </p>
              </Prose>
            </section>

            <section className="mt-14">
              <h2 className="text-h2 text-text">
                What actually constrains this leg
              </h2>
              <Prose className="mt-4">
                <ul>
                  {route.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </Prose>
            </section>

            {categories.length > 0 && (
              <section className="mt-14">
                <SectionHeading
                  as="h2"
                  eyebrow="Aircraft"
                  title="Categories that fly this nonstop"
                  description="In normal conditions and with a typical load. Winter headwinds and a full cabin can push a marginal category into a fuel stop, which we check before quoting rather than on the day."
                />
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/private-jets/aircraft/${category.slug}`}
                        className="flex h-full flex-col rounded-xl bg-surface-2 p-5 ring-1 ring-inset ring-border transition-[background-color,box-shadow] hover:bg-surface hover:shadow-md focus-ring"
                      >
                        <span className="text-h5 text-text">
                          {category.name}
                        </span>
                        <span className="mt-1 text-caption tabular-nums text-text-muted">
                          {category.seats} seats · {category.rangeNm} nm
                        </span>
                        <span className="mt-3 text-body-sm text-text-secondary">
                          {category.tradeOff}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-14">
              <h2 className="text-h2 text-text">What this costs</h2>
              <Prose className="mt-4">
                <p>
                  We do not publish a figure for this route, and we would treat
                  one on somebody else&apos;s site with suspicion. Charter is
                  priced per aircraft per leg, and the biggest variable is
                  whether a suitable aircraft is already near{" "}
                  {route.originCity} or has to be positioned in. That moves the
                  price by thousands and it changes day to day.
                </p>
                <p>
                  Send us the dates and you get the real number, itemised —
                  aircraft and crew time, positioning, landing and handling at
                  both ends, taxes, and our fee as its own line. The{" "}
                  <Link href="/private-jets/charter">charter page</Link> sets out
                  how it is built.
                </p>
              </Prose>
            </section>

            <nav
              aria-label="Other routes"
              className="mt-14 border-t border-border pt-8"
            >
              <h2 className="text-h4 text-text">Other routes</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {otherRoutes.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/private-jets/routes/${entry.slug}`}
                      className="rounded-sm text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-ring"
                    >
                      {entry.originCity} to {entry.destinationCity}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <EnquiryPanel
            vertical="jet"
            title={`Price ${route.originCode} to ${route.destinationCode}`}
            intro="Your dates and passengers on this leg. We come back with the operator, the aircraft and the all-in price."
            disclaimer="We are a charter broker, not an air carrier. Every flight is operated by a licensed operator under its own air carrier certificate, and that operator's conditions of carriage govern the flight."
            aircraftCategories={aircraftCategories.map((category) => ({
              slug: category.slug,
              name: category.name,
              seats: category.seats,
            }))}
            initial={{
              origin: `${route.originAirport} (${route.originCode}), ${route.originCity}`,
              destination: `${route.destinationAirport} (${route.destinationCode}), ${route.destinationCity}`,
            }}
          />
        </div>
      </Section>
    </>
  );
}
