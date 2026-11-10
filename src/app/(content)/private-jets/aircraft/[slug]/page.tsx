import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Prose } from "@/components/content/prose";
import {
  aircraftCategories,
  getAircraftCategory,
  jetRoutes,
} from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return aircraftCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/private-jets/aircraft/[slug]">,
) {
  const { slug } = await props.params;
  const category = getAircraftCategory(slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.name} charter`,
    description: `${category.name} private jet charter: ${category.seats} seats, ${category.rangeNm} nm range, ${category.cabinHeight} cabin. What this category is for, what it is not, and the aircraft types commonly operated in it.`,
    path: `/private-jets/aircraft/${category.slug}`,
  });
}

/**
 * A single aircraft category.
 *
 * The specification block is the reason this page exists — a table row cannot
 * carry the trade-off, and the trade-off is the honest part. Every category
 * has one, and stating it is what separates a guide from a brochure.
 */
export default async function AircraftCategoryPage(
  props: PageProps<"/private-jets/aircraft/[slug]">,
) {
  const { slug } = await props.params;
  const category = getAircraftCategory(slug);
  if (!category) notFound();

  /** Routes this category can genuinely fly nonstop, per the route data. */
  const suitableRoutes = jetRoutes.filter((route) =>
    route.suitableCategories.includes(category.slug),
  );

  const specs = [
    { label: "Typical seats", value: category.seats },
    { label: "Range", value: `${category.rangeNm} nm` },
    { label: "Cruise speed", value: `${category.cruiseKts} kts` },
    { label: "Cabin height", value: category.cabinHeight },
    { label: "Baggage", value: category.baggage },
    { label: "Crew and cabin", value: category.cabin },
  ];

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Aircraft", path: "/private-jets/aircraft" },
          {
            name: category.name,
            path: `/private-jets/aircraft/${category.slug}`,
          },
        ]}
        eyebrow="Aircraft category"
        title={`${category.name} charter`}
        intro={category.bestFor}
      >
        <p className="mt-6 text-caption tabular-nums text-text-muted">
          {category.reach}
        </p>
      </PageIntro>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            {/* Specifications as a definition grid rather than a table: six
                pairs do not need column headers, and a grid reflows to one
                column on a phone where a table would scroll. */}
            <h2 className="text-h2 text-text">Specifications</h2>
            <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {specs.map((spec) => (
                <div key={spec.label} className="border-t border-border pt-4">
                  <dt className="text-overline uppercase text-text-muted">
                    {spec.label}
                  </dt>
                  <dd className="mt-1.5 text-h5 text-text">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className="measure mt-6 text-caption text-text-muted">
              Typical figures for representative types in this category, given
              as ranges because they vary by aircraft and configuration.
              Published range assumes favourable conditions and a light load;
              we confirm the specific aircraft against your actual routing
              before quoting it.
            </p>

            <section className="mt-14">
              <h2 className="text-h2 text-text">The trade-off</h2>
              <Prose className="mt-4">
                <p>{category.tradeOff}</p>
              </Prose>
            </section>

            <section className="mt-14">
              <h2 className="text-h2 text-text">
                Types commonly operated in this category
              </h2>
              <p className="measure mt-3 text-body-sm text-text-secondary">
                These describe the category. They are not aircraft we own or
                operate — we are a broker, and the specific aircraft offered to
                you depends on which licensed operator has one available for
                your dates.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {category.examples.map((example) => (
                  <li key={example}>
                    <Badge tone="neutral">{example}</Badge>
                  </li>
                ))}
              </ul>
            </section>

            {suitableRoutes.length > 0 && (
              <section className="mt-14">
                <SectionHeading
                  as="h2"
                  eyebrow="Nonstop"
                  title={`Routes a ${category.name.toLowerCase()} can fly`}
                  description="Legs from our route guide that this category covers without a fuel stop in normal conditions."
                />
                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {suitableRoutes.map((route) => (
                    <li key={route.slug}>
                      <Link
                        href={`/private-jets/routes/${route.slug}`}
                        className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4 focus-ring"
                      >
                        <span className="text-body font-medium text-text">
                          {route.originCity} ({route.originCode}) to{" "}
                          {route.destinationCity} ({route.destinationCode})
                        </span>
                        <span className="text-caption tabular-nums text-text-muted">
                          {route.distanceNm.toLocaleString("en-US")} nm
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <nav
              aria-label="Other categories"
              className="mt-14 border-t border-border pt-8"
            >
              <h2 className="text-h4 text-text">Other categories</h2>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {aircraftCategories
                  .filter((entry) => entry.slug !== category.slug)
                  .map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/private-jets/aircraft/${entry.slug}`}
                        className="rounded-sm text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-ring"
                      >
                        {entry.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>

          <EnquiryPanel
            vertical="jet"
            title={`Request a ${category.name.toLowerCase()}`}
            intro="Tell us the leg and the bags. If this category is the wrong size for what you are carrying, we will say so and price the one that fits."
            disclaimer="We are a charter broker, not an air carrier. Every flight is operated by a licensed operator under its own air carrier certificate, and that operator's conditions of carriage govern the flight."
            aircraftCategories={aircraftCategories.map((entry) => ({
              slug: entry.slug,
              name: entry.name,
              seats: entry.seats,
            }))}
            initial={{ aircraftCategorySlug: category.slug }}
          />
        </div>
      </Section>
    </>
  );
}
