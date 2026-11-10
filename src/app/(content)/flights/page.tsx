import Link from "next/link";

import { AirlineLogo } from "@/components/content/airline-logo";
import { CustomerReviews } from "@/components/content/customer-reviews";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "@/features/destinations/components/destination-card";
import { FlightSearchForm } from "@/features/search/components/flight-search-form";
import { RouteCard } from "@/features/search/components/route-card";
import { airlines } from "@/lib/content/airlines";
import { airports } from "@/lib/content/airports";
import { getResolvedDestinations } from "@/lib/content/destinations";
import { flightHeroImages } from "@/lib/content/flight-hero";
import { publicFileExists } from "@/lib/content/images";
import { getResolvedRoutes } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Flights",
  description:
    "Search flights across airlines, compare fares for your dates, and book online or with a real travel agent.",
  path: "/flights",
});

export default function FlightsPage() {
  const heroSlides: HeroSlide[] = flightHeroImages.map((image) => ({
    id: image.src,
    src: publicFileExists(image.src) ? image.src : null,
    alt: image.alt,
    detail: `Photo: ${image.credit}`,
  }));
  const routes = getResolvedRoutes();
  const destinations = getResolvedDestinations().slice(0, 4);

  return (
    <>
      {/* z-20 so the airport picker can hang below this band. */}
      <Section
        tone="brand"
        size="lg"
        className="z-20"
        containerClassName="pb-20 md:pb-24"
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <Breadcrumbs
          tone="inverse"
          items={[
            { name: "Home", path: "/" },
            { name: "Flights", path: "/flights" },
          ]}
        />
        <PageHeader
          className="mt-8"
          tone="inverse"
          eyebrow="Flights"
          title="Search flights to anywhere"
          intro="Compare fares across airlines for your dates, then book online — or call and a real travel agent books it with you."
        />
        <div className="mt-10 rounded-xs bg-surface p-3 shadow-panel md:p-4">
          <FlightSearchForm airports={airports} tone="bare" />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Popular routes"
          title="Flights travellers search most"
          description="Flight time, airports and the best months to go, route by route."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.slice(0, 3).map((route) => (
            <li key={route.slug}>
              <RouteCard route={route} />
            </li>
          ))}
        </ul>
        {routes.length > 3 ? (
          <details className="group mt-4">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-xs px-4 py-2 text-body font-semibold text-primary ring-1 ring-inset ring-border transition-shadow hover:shadow-md focus-ring">
              <span className="group-open:hidden">
                Show all {routes.length} routes
              </span>
              <span className="hidden group-open:inline">Show fewer routes</span>
            </summary>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {routes.slice(3).map((route) => (
                <li key={route.slug}>
                  <RouteCard route={route} />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Destinations"
          title="Where to fly next"
          action={
            <ButtonLink href="/destinations" variant="outline" size="sm">
              All destinations
            </ButtonLink>
          }
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <li key={destination.slug}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Airlines"
          title="Airlines we book"
          action={
            <ButtonLink href="/airlines" variant="outline" size="sm">
              All airlines
            </ButtonLink>
          }
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {airlines.slice(0, 12).map((airline) => (
            <li key={airline.slug}>
              <Link
                href={`/airlines/${airline.slug}`}
                className="group flex h-full flex-col items-center gap-2 rounded-xs bg-surface p-4 text-center ring-1 ring-inset ring-border transition-shadow hover:shadow-md focus-ring"
              >
                <AirlineLogo code={airline.code} name={airline.name} className="h-12 w-28" />
                <span className="text-caption font-semibold text-text group-hover:text-primary">
                  {airline.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Deals" title="Flight deals" />
        <div className="mt-10">
          <DealCategoryGrid
            variant="compact"
            featured={[
              "last-minute-flight-deals",
              "coupon-deals",
              "business-class-flights",
              "top-airline-deals",
            ]}
          />
        </div>
      </Section>

      <Section>
        <CustomerReviews vertical="flight" />
      </Section>
    </>
  );
}
