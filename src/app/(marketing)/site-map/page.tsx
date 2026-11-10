import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { airlines } from "@/lib/content/airlines";
import { airports } from "@/lib/content/airports";
import { articles } from "@/lib/content/articles";
import { cruiseLines } from "@/lib/content/cruise-lines";
import { destinations } from "@/lib/content/destinations";
import { guides } from "@/lib/content/guides";
import { aircraftCategories, jetRoutes } from "@/lib/content/private-jets";
import { getResolvedRoutes } from "@/lib/content/routes";
import { footerNav } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Site map",
  description:
    "Every page on this site in one place — flight routes, destinations, hotels, car rental, cruises, private jet charter, airlines, airports, the travel blog and our policies.",
  path: "/site-map",
});

/**
 * Human-readable site map.
 *
 * Generated from the same content modules that build the pages themselves, so
 * it cannot list a page that does not exist or miss one that does. That is the
 * only kind of site map worth having — a hand-maintained one is wrong within
 * two deploys.
 */

function LinkSection({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  const id = title.replace(/[^a-zA-Z]+/g, "-").toLowerCase();

  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-h4 text-text">
        {title}
      </h2>
      <ul className="mt-3 space-y-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body text-primary underline-offset-2 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SiteMapPage() {
  const routes = getResolvedRoutes();

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Site map", path: "/site-map" },
        ]}
        title="Site map"
        intro={
          <>
            Everything on this site, in one place. The machine-readable version
            is at{" "}
            <a
              href="/sitemap.xml"
              className="text-primary underline underline-offset-2"
            >
              /sitemap.xml
            </a>
            .
          </>
        }
      />

      <Section>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <LinkSection title="Book" links={footerNav.book} />
          <LinkSection title="Traveller tools" links={footerNav.travellerTools} />
          <LinkSection title="Company" links={footerNav.company} />
          <LinkSection title="Legal" links={footerNav.legal} />

          <LinkSection
            title="Flight routes"
            links={routes.map((route) => ({
              href: `/flights/${route.slug}`,
              label: `${route.origin.city} to ${route.destination.city}`,
            }))}
          />

          <LinkSection
            title="Private aviation"
            links={footerNav.privateAviation}
          />

          <LinkSection
            title="Jet aircraft"
            links={aircraftCategories.map((category) => ({
              href: `/private-jets/aircraft/${category.slug}`,
              label: category.name,
            }))}
          />

          <LinkSection
            title="Jet routes"
            links={jetRoutes.map((route) => ({
              href: `/private-jets/routes/${route.slug}`,
              label: `${route.originCity} to ${route.destinationCity}`,
            }))}
          />

          <LinkSection
            title="Destination guides"
            links={destinations.map((destination) => ({
              href: `/destinations/${destination.slug}`,
              label: destination.city,
            }))}
          />

          <LinkSection
            title="Hotels by city"
            links={destinations.map((destination) => ({
              href: `/hotels/${destination.slug}`,
              label: `Hotels in ${destination.city}`,
            }))}
          />

          <LinkSection
            title="Car rental by airport"
            links={airports.map((airport) => ({
              href: `/car-rentals/${airport.code.toLowerCase()}`,
              label: `${airport.city} (${airport.code})`,
            }))}
          />

          <LinkSection
            title="Cruise lines"
            links={cruiseLines.map((line) => ({
              href: `/cruises/${line.slug}`,
              label: line.name,
            }))}
          />

          <LinkSection
            title="Airlines"
            links={airlines.map((airline) => ({
              href: `/airlines/${airline.slug}`,
              label: airline.name,
            }))}
          />

          <LinkSection
            title="Airports"
            links={airports.map((airport) => ({
              href: `/airports/${airport.code.toLowerCase()}`,
              label: `${airport.name} (${airport.code})`,
            }))}
          />

          <LinkSection
            title="Travel guides"
            links={guides.map((guide) => ({
              href: `/guides/${guide.slug}`,
              label: guide.title,
            }))}
          />

          <LinkSection
            title="Travel blog"
            links={articles.map((article) => ({
              href: `/travel-blog/${article.slug}`,
              label: article.title,
            }))}
          />
        </div>
      </Section>
    </>
  );
}
