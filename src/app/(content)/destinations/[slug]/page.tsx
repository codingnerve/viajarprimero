import Link from "next/link";
import { notFound } from "next/navigation";

import { RouteCard } from "@/features/search/components/route-card";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Prose } from "@/components/content/prose";
import { ArrowRightIcon, BedIcon, CarIcon, PlaneIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import { ENQUIRY_ANCHOR } from "@/features/enquiries/lib/enquiry-link";
import {
  destinations,
  getDestination,
  resolveDestination,
} from "@/lib/content/destinations";
import { getRoute, resolveRoute } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]">,
) {
  const { slug } = await props.params;
  const destination = getDestination(slug);
  if (!destination) return {};

  return buildMetadata({
    title: `${destination.city} travel guide`,
    description: `${destination.summary} When to go, how to get around, and what to know before booking a flight, a room or a car in ${destination.city}.`,
    path: `/destinations/${destination.slug}`,
  });
}

export default async function DestinationPage(
  props: PageProps<"/destinations/[slug]">,
) {
  const { slug } = await props.params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const resolved = resolveDestination(destination);
  if (!resolved) notFound();

  const relatedRoutes = resolved.relatedRouteSlugs
    .map((routeSlug) => getRoute(routeSlug))
    .filter((route) => route !== undefined)
    .map((route) => resolveRoute(route))
    .filter((route) => route !== undefined);

  /*
    A destination guide is read by someone planning a whole trip, not only a
    flight, so the calls to action cover the parts of it we can actually price
    for this city.
  */
  const planLinks = [
    {
      icon: PlaneIcon,
      label: `Flights to ${resolved.city}`,
      href: "/checkout",
    },
    {
      icon: BedIcon,
      label: `Hotels in ${resolved.city}`,
      href: `/hotels/${resolved.slug}#${ENQUIRY_ANCHOR}`,
    },
    {
      icon: CarIcon,
      label: `Car rental at ${resolved.airport.code}`,
      href: `/car-rentals/${resolved.airport.code.toLowerCase()}#${ENQUIRY_ANCHOR}`,
    },
  ];

  return (
    <>
      {/*
        A photograph-led header, with the title set over the bottom of the
        frame. Where no photograph has been added for this city, the same frame
        fills with the brand plate — so the page opens the same way either way
        and adding `public/images/destinations/<slug>.jpg` upgrades it with no
        code change.
      */}
      <header className="relative">
        <Photo
          collection="destinations"
          slug={resolved.slug}
          alt={`${resolved.city}, ${resolved.country}`}
          label={resolved.airport.code}
          sizes="100vw"
          priority
          overlay
          className="h-[24rem] w-full md:h-[30rem]"
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-page px-gutter pb-10 md:pb-14">
            <Breadcrumbs
              tone="inverse"
              items={[
                { name: "Home", path: "/" },
                { name: "Destinations", path: "/destinations" },
                { name: resolved.city, path: `/destinations/${resolved.slug}` },
              ]}
            />

            <p className="mt-6 text-overline uppercase text-white/70">
              {resolved.country} · {resolved.airport.code}
            </p>
            <h1 className="mt-2 text-balance text-display text-text-inverse md:text-display-lg">
              {resolved.city} travel guide
            </h1>
          </div>
        </div>
      </header>

      <Section>
        <p className="measure-wide text-body-lg text-text-secondary">
          {resolved.intro}
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
          <Prose>
            <h2>When to visit</h2>
            <p>{resolved.bestTimeToVisit}</p>

            <h2>Getting around</h2>
            <p>{resolved.gettingAround}</p>

            <h2>Good to know</h2>
            <ul>
              {resolved.goodToKnow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Prose>

          <aside className="space-y-8 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <div className="rounded-2xl bg-primary-softer p-6">
              <h2 className="text-h4 text-text">Planning this trip?</h2>
              <p className="mt-2 text-body-sm text-text-secondary">
                Tell us your dates and an agent will price the options for you —
                whichever parts of it you want us to handle.
              </p>
              <ul className="mt-5 space-y-2">
                {planLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-12 items-center gap-3 rounded-lg bg-surface px-4 text-body-sm font-semibold text-text shadow-xs transition-shadow hover:shadow-md focus-ring"
                    >
                      <link.icon className="size-5 shrink-0 text-primary" />
                      <span className="flex-1">{link.label}</span>
                      <ArrowRightIcon className="size-4 shrink-0 text-text-muted transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-h4 text-text">Main airport</h2>
              <p className="mt-2 text-body-sm text-gray-700">
                {resolved.airport.name} ({resolved.airport.code})
              </p>
              <p className="mt-1 text-caption text-text-muted">
                Other airports may also serve {resolved.city}. Check which one
                your itinerary uses.
              </p>
            </div>

            {relatedRoutes.length > 0 && (
              <div>
                <h2 className="text-h4 text-text">
                  Routes to {resolved.city}
                </h2>
                <ul className="mt-4 space-y-3">
                  {relatedRoutes.map((route) => (
                    <li key={route.slug}>
                      <RouteCard route={route} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
