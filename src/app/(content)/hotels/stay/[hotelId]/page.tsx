import Link from "next/link";
import { notFound } from "next/navigation";

import { HotelGallery } from "@/features/hotels/components/hotel-gallery";
import { HotelRoomList } from "@/features/hotels/components/hotel-room-list";
import {
  buildHotelSearchParams,
  nightsBetween,
  parseHotelSearch,
} from "@/features/hotels/lib/hotel-search-params";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon, MapPinIcon } from "@/components/ui/icons";
import {
  getHotelDetail,
  isHotelSearchConfigured,
  sampleHotelsEnabled,
} from "@/lib/providers/liteapi";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatTripDate } from "@/lib/utils/format-date";

/**
 * A single property.
 *
 * The hotel is whichever one the traveller clicked, fetched live — nothing on
 * this page is hardcoded. The search that brought them here travels in the
 * query string, which is what lets the room list be priced for their actual
 * dates and occupancy rather than showing a generic rate card.
 *
 * Indexable, unlike the results page: a property page has stable content
 * worth ranking. The dates in the URL are stripped from the canonical, so
 * every date combination collapses to one canonical URL rather than spraying
 * near-duplicates across the index.
 */
export async function generateMetadata(
  props: PageProps<"/hotels/stay/[hotelId]">,
) {
  const { hotelId } = await props.params;
  const hotel = await getHotelDetail(hotelId, null);

  if (!hotel) {
    return buildMetadata({
      title: "Hotel",
      description: "Hotel details.",
      path: `/hotels/stay/${hotelId}`,
      noIndex: true,
    });
  }

  const where = [hotel.city, hotel.country].filter(Boolean).join(", ");

  return buildMetadata({
    title: `${hotel.name}${where ? `, ${where}` : ""}`,
    description:
      hotel.description.slice(0, 155) ||
      `${hotel.name} in ${where}. Rooms, amenities and what the rate includes, quoted as a total before you book.`,
    // No search parameters: one canonical per property, not one per date pair.
    path: `/hotels/stay/${hotel.id}`,
    ogImage: hotel.image ?? undefined,
  });
}

export default async function HotelDetailPage(
  props: PageProps<"/hotels/stay/[hotelId]">,
) {
  const { hotelId } = await props.params;
  const rawParams = await props.searchParams;

  // The search is optional — the page has to work from a shared link with no
  // dates on it. Without one there are no priced rooms, and the page says so.
  const { query } = parseHotelSearch(rawParams);

  if (!isHotelSearchConfigured()) {
    return (
      <Section size="lg">
        <div className="measure">
          <h1 className="text-display text-text">Hotel details</h1>
          <Alert tone="info" title="Hotel search is not connected yet" className="mt-6">
            <p>
              No hotel supplier is connected to this environment, so this
              property cannot be loaded. Tell us the city and dates and an agent
              will price the stay for you.
            </p>
          </Alert>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/hotels#request">Request hotel options</ButtonLink>
          </div>
        </div>
      </Section>
    );
  }

  const hotel = await getHotelDetail(hotelId, query);
  if (!hotel) notFound();

  const nights = query ? nightsBetween(query.checkIn, query.checkOut) : 0;
  const searchQs = query ? buildHotelSearchParams(query).toString() : "";
  const where = [hotel.address, hotel.city, hotel.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {/*
        Hotel structured data. `aggregateRating` is emitted only when the
        supplier actually returned a score and a review count behind it —
        marking up a rating nobody gave is a fabricated claim and is exactly
        what gets rich results withdrawn.
      */}
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: hotel.name,
          description: hotel.description || undefined,
          image: hotel.images.slice(0, 6),
          address: {
            "@type": "PostalAddress",
            streetAddress: hotel.address || undefined,
            addressLocality: hotel.city || undefined,
            addressCountry: hotel.country || undefined,
          },
          ...(hotel.coordinates
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: hotel.coordinates.latitude,
                  longitude: hotel.coordinates.longitude,
                },
              }
            : {}),
          ...(hotel.stars > 0
            ? {
                starRating: { "@type": "Rating", ratingValue: hotel.stars },
              }
            : {}),
          ...(hotel.rating !== null && hotel.reviewCount > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: hotel.rating,
                  bestRating: 10,
                  reviewCount: hotel.reviewCount,
                },
              }
            : {}),
          url: new URL(`/hotels/stay/${hotel.id}`, siteConfig.url).toString(),
        }}
      />

      <Section tone="muted" size="sm">
        {/*
          Generated property, not a supplied one. Stated at the top of the
          page rather than near the booking control: somebody who reads only
          the heading and the gallery still has to pass this first.
        */}
        {sampleHotelsEnabled() && !process.env.LITEAPI_KEY && (
          <Alert
            tone="warning"
            title="Sample property — not bookable"
            className="mb-6"
          >
            <p>
              No hotel supplier is connected yet. This property, its rooms and
              its prices are generated to demonstrate the page — the hotel is
              not a real business and none of these rates can be booked.
            </p>
          </Alert>
        )}

        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Hotels", path: "/hotels" },
            { name: hotel.name, path: `/hotels/stay/${hotel.id}` },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            {hotel.stars > 0 && (
              <p className="text-accent" aria-label={`${hotel.stars} star hotel`}>
                <span aria-hidden="true">{"★".repeat(Math.round(hotel.stars))}</span>
              </p>
            )}
            <h1 className="mt-1 text-balance text-display text-text">
              {hotel.name}
            </h1>
            {where && (
              <p className="mt-3 flex items-start gap-2 text-body-sm text-text-secondary">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-text-muted" />
                {where}
              </p>
            )}
          </div>

          {hotel.rating !== null && (
            <div className="flex items-center gap-3">
              <span className="rounded-xl rounded-bl-sm bg-primary px-3 py-2 text-h4 tabular-nums text-text-inverse">
                {hotel.rating.toFixed(1)}
              </span>
              <span className="text-caption text-text-muted">
                {hotel.reviewCount > 0
                  ? `${hotel.reviewCount.toLocaleString("en-US")} guest reviews`
                  : "Guest rated"}
              </span>
            </div>
          )}
        </div>
      </Section>

      <Section>
        <HotelGallery images={hotel.images} alt={hotel.name} seed={hotel.id} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
          <div className="min-w-0">
            {hotel.description && (
              <section>
                <h2 className="text-h2 text-text">About this property</h2>
                <p className="measure mt-4 whitespace-pre-line text-body text-text-secondary">
                  {hotel.description}
                </p>
              </section>
            )}

            {hotel.facilities.length > 0 && (
              <section className="mt-14">
                <h2 className="text-h2 text-text">Amenities</h2>
                <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  {hotel.facilities.map((facility) => (
                    <li key={facility} className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-body-sm text-text-secondary">
                        {facility}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section id="rooms" className="mt-14 scroll-mt-[calc(var(--header-height)+2rem)]">
              <h2 className="text-h2 text-text">Available rooms</h2>
              {query ? (
                <p className="mt-2 text-body-sm text-text-secondary">
                  Priced for {formatTripDate(query.checkIn)} –{" "}
                  {formatTripDate(query.checkOut)}, {nights}{" "}
                  {nights === 1 ? "night" : "nights"}, {query.rooms}{" "}
                  {query.rooms === 1 ? "room" : "rooms"} for {query.adults}{" "}
                  {query.adults === 1 ? "adult" : "adults"}
                  {query.children > 0 ? ` and ${query.children} children` : ""}.
                </p>
              ) : (
                <p className="mt-2 text-body-sm text-text-secondary">
                  Add dates to see rooms and prices for your stay.
                </p>
              )}

              <HotelRoomList
                rooms={hotel.rooms}
                hasQuery={Boolean(query)}
                nights={nights}
                searchQs={searchQs}
                hotelName={hotel.name}
              />
            </section>

            {hotel.importantInformation && (
              <section className="mt-14">
                <h2 className="text-h2 text-text">Good to know</h2>
                <p className="measure mt-4 whitespace-pre-line text-body-sm text-text-secondary">
                  {hotel.importantInformation}
                </p>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <div className="rounded-2xl bg-surface-2 p-6 ring-1 ring-inset ring-border">
              <h2 className="text-h4 text-text">Your stay</h2>

              {query ? (
                <dl className="mt-4 space-y-3 text-body-sm">
                  <Row term="Check-in" value={formatTripDate(query.checkIn)} />
                  <Row term="Check-out" value={formatTripDate(query.checkOut)} />
                  <Row
                    term="Nights"
                    value={String(nights)}
                  />
                  <Row
                    term="Guests"
                    value={`${query.adults} ${query.adults === 1 ? "adult" : "adults"}${
                      query.children > 0 ? `, ${query.children} children` : ""
                    }`}
                  />
                  <Row
                    term="Rooms"
                    value={String(query.rooms)}
                  />
                </dl>
              ) : (
                <p className="mt-3 text-body-sm text-text-secondary">
                  No dates selected. Search to see live prices for this
                  property.
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2">
                <ButtonLink href="#rooms" fullWidth>
                  {hotel.rooms.length > 0 ? "Select a room" : "See options"}
                </ButtonLink>
                {searchQs && (
                  <ButtonLink
                    href={`/hotels/search?${searchQs}`}
                    variant="outline"
                    fullWidth
                  >
                    Back to results
                  </ButtonLink>
                )}
              </div>
            </div>

            {(hotel.checkIn || hotel.checkOut) && (
              <div className="rounded-2xl bg-surface p-6 ring-1 ring-inset ring-border">
                <h2 className="text-h4 text-text">Check-in and check-out</h2>
                <dl className="mt-4 space-y-3 text-body-sm">
                  {hotel.checkIn && <Row term="Check-in from" value={hotel.checkIn} />}
                  {hotel.checkOut && <Row term="Check-out by" value={hotel.checkOut} />}
                </dl>
              </div>
            )}

            {hotel.coordinates && (
              <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-border">
                <div className="p-6 pb-4">
                  <h2 className="text-h4 text-text">Location</h2>
                  <p className="mt-1 text-caption text-text-muted">{where}</p>
                </div>
                {/*
                  A link to a map rather than an embedded one. An embed would
                  mean a third-party script and an API key on every property
                  page, for a panel most travellers open once — and the
                  coordinates here are the supplier's, so the link is exact.
                */}
                <a
                  href={`https://www.openstreetmap.org/?mlat=${hotel.coordinates.latitude}&mlon=${hotel.coordinates.longitude}#map=16/${hotel.coordinates.latitude}/${hotel.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 text-body-sm font-semibold text-primary hover:bg-primary-softer focus-ring"
                >
                  Open in maps
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}

            <p className="px-1 text-caption text-text-muted">
              We are a travel agency, not a hotel. Rooms are supplied by the
              property and its own booking conditions govern your stay.{" "}
              <Link
                href="/terms-and-conditions"
                className="text-primary underline underline-offset-2"
              >
                Terms
              </Link>
              .
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-border pt-3 first:border-0 first:pt-0">
      <dt className="text-text-muted">{term}</dt>
      <dd className="text-right font-medium text-text">{value}</dd>
    </div>
  );
}
