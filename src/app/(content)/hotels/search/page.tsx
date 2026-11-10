import Link from "next/link";

import { enquiryHref } from "@/features/enquiries/lib/enquiry-link";
import { HotelCard } from "@/features/hotels/components/hotel-card";
import { HotelFiltersPanel } from "@/features/hotels/components/hotel-filters-panel";
import { HotelSearchForm } from "@/features/hotels/components/hotel-search-form";
import {
  applyHotelFilters,
  buildHotelSearchParams,
  nightsBetween,
  parseHotelFilters,
  parseHotelPage,
  parseHotelSearch,
  parseHotelSort,
  sortHotels,
} from "@/features/hotels/lib/hotel-search-params";
import { CallToBookPanel } from "@/components/layout/call-to-book-panel";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon } from "@/components/ui/icons";
import { bookingConfig } from "@/lib/config/booking";
import { siteConfig } from "@/lib/config/site";
import {
  fetchFacilities,
  popularPlaces,
  HOTELS_PER_PAGE,
  searchHotels,
} from "@/lib/providers/liteapi";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatTripDate } from "@/lib/utils/format-date";
import type { HotelSearchResult } from "@/types/hotel";

/**
 * Hotel search results.
 *
 * noIndex, per the project guide — a search result page has no stable content
 * to rank and would spray near-duplicate URLs across the index. The pages
 * built to rank are `/hotels` and the per-city guides at `/hotels/[slug]`.
 *
 * This sits at a static segment, which takes precedence over the `[slug]`
 * city-guide route beside it, so `/hotels/search` cannot be read as a city
 * called "search".
 *
 * The outcomes are kept strictly distinct, as on the flight results page: no
 * supplier connected, a supplier that returned nothing, and a filter set that
 * excluded everything. Collapsing them would tell the traveller something
 * untrue about availability.
 */
export const metadata = buildMetadata({
  title: "Hotel search results",
  description: "Hotels matching your dates and destination.",
  path: "/hotels/search",
  noIndex: true,
});

export default async function HotelSearchPage(
  props: PageProps<"/hotels/search">,
) {
  const rawParams = await props.searchParams;
  const { query, errors } = parseHotelSearch(rawParams);
  const popular = await popularPlaces();

  // ── The URL did not describe a search ─────────────────────────────────
  if (!query) {
    return (
      <>
        <Section tone="brand" size="sm">
          <h1 className="text-display text-text-inverse">Find a hotel</h1>
          <p className="measure mt-3 text-body-lg text-text-on-dark">
            {bookingConfig.callToBook
              ? "Tell us where and when, and an agent will find rooms for you by phone."
              : "Tell us where and when, and we will show you what is available."}
          </p>
        </Section>

        <Section size="sm">
          {errors.length > 0 && (
            <Alert
              tone="warning"
              title="That search was incomplete"
              className="measure mb-6"
            >
              <ul className="list-disc space-y-1 pl-5">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          <HotelSearchForm tone="flat" popular={popular} />
        </Section>
      </>
    );
  }

  const filters = parseHotelFilters(rawParams);
  const sort = parseHotelSort(rawParams);
  const page = parseHotelPage(rawParams);
  const nights = nightsBetween(query.checkIn, query.checkOut);

  /*
    Content and the facility dictionary are fetched together — the dictionary
    is a cached reference table, so this costs one request per day rather than
    one per search, and without it the amenity chips and filters would show
    raw supplier ids.
  */
  // While bookings are taken by phone the supplier is not called at all.
  const unsearched: HotelSearchResult = {
    configured: false,
    hotels: [],
    total: 0,
    searchedAt: new Date().toISOString(),
  };
  const [result, facilityNames] = bookingConfig.callToBook
    ? ([unsearched, new Map<number, string>()] as const)
    : await Promise.all([
        searchHotels(query, { offset: (page - 1) * HOTELS_PER_PAGE }),
        fetchFacilities(),
      ]);

  const visible = sortHotels(
    applyHotelFilters(result.hotels, filters),
    sort,
  );

  /* Amenity facets, counted from the page actually returned. */
  const facetCounts = new Map<number, number>();
  for (const hotel of result.hotels) {
    for (const facilityId of hotel.facilityIds) {
      facetCounts.set(facilityId, (facetCounts.get(facilityId) ?? 0) + 1);
    }
  }
  const facets = [...facetCounts.entries()]
    .map(([facilityId, count]) => ({
      id: facilityId,
      name: facilityNames.get(facilityId) ?? "",
      count,
    }))
    .filter((facet) => facet.name)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const priced = result.hotels
    .map((hotel) => hotel.price?.total)
    .filter((total): total is number => typeof total === "number");
  const priceCeiling = priced.length > 0 ? Math.max(...priced) : 0;
  const currency = result.hotels.find((hotel) => hotel.price)?.price?.currency ?? "USD";

  const detailHref = (hotelId: string) =>
    `/hotels/stay/${hotelId}?${buildHotelSearchParams(query).toString()}`;

  const pageHref = (next: number) => {
    const params = new URLSearchParams(
      Object.entries(rawParams).flatMap(([key, value]) =>
        value === undefined
          ? []
          : [[key, Array.isArray(value) ? (value[0] ?? "") : value] as [string, string]],
      ),
    );
    params.set("page", String(next));
    return `/hotels/search?${params.toString()}`;
  };

  const totalPages = Math.max(1, Math.ceil(result.total / HOTELS_PER_PAGE));

  return (
    <>
      {/* ── The search, restated ───────────────────────────────────────── */}
      <Section tone="brand" size="sm">
        <h1 className="text-balance text-display text-text-inverse">
          Hotels in {query.placeName.split(",")[0]}
        </h1>

        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-2 text-body-sm text-text-on-dark">
            <MapPinIcon className="size-4 shrink-0 text-gray-400" />
            {query.placeName}
          </li>
          <li className="flex items-center gap-2 text-body-sm text-text-on-dark">
            <CalendarIcon className="size-4 shrink-0 text-gray-400" />
            {formatTripDate(query.checkIn)} – {formatTripDate(query.checkOut)} ·{" "}
            {nights} {nights === 1 ? "night" : "nights"}
          </li>
          <li>
            <Badge tone="inverse" size="sm">
              {query.rooms} {query.rooms === 1 ? "room" : "rooms"} ·{" "}
              {query.adults} {query.adults === 1 ? "adult" : "adults"}
              {query.children > 0 ? `, ${query.children} children` : ""}
            </Badge>
          </li>
        </ul>
      </Section>

      {/* ── Amend the search ───────────────────────────────────────────── */}
      {/* z-20 so the destination combobox hangs over the results below
          rather than being painted over by them. */}
      <Section size="sm" tone="muted" bordered className="z-20">
        <HotelSearchForm
          tone="flat"
          popular={popular}
          initial={{
            placeId: query.placeId,
            placeName: query.placeName,
            checkIn: query.checkIn,
            checkOut: query.checkOut,
            adults: query.adults,
            children: query.children,
            rooms: query.rooms,
          }}
        />
      </Section>

      {/* ── Outcome ────────────────────────────────────────────────────── */}
      <Section size="sm">
        {/*
          The properties exist but were generated, not supplied. The notice is
          not dismissible and sits above the list rather than beside it: a
          traveller must not be able to scroll past it and read the results as
          real availability. See lib/providers/sample-hotels.
        */}
        {result.configured && result.source === "sample" && (
          <Alert
            tone="warning"
            title="Sample results — not bookable"
            className="mb-8"
          >
            <p>
              No hotel supplier is connected yet, so the properties below are
              generated to demonstrate the search. The hotels, prices and
              ratings are invented, no property has quoted these rates, and
              none of them can be booked.
            </p>
            <p className="mt-2">
              Tell us the city and dates and an agent will get back to you with real,
              priced options — the nightly rate with taxes and any resort fee already
              in it, and the cancellation deadline stated up front.
            </p>
          </Alert>
        )}

        {bookingConfig.callToBook ? (
          <CallToBookPanel
            title="Book this stay with a travel agent"
            intro="Hotel prices for this search are not shown online. Call us and an agent will find rooms for your dates and book them with you on the phone."
            facts={[
              { icon: MapPinIcon, label: "Destination", value: query.placeName },
              {
                icon: CalendarIcon,
                label: "Dates",
                value: `${formatTripDate(query.checkIn)} – ${formatTripDate(query.checkOut)} · ${nights} ${nights === 1 ? "night" : "nights"}`,
              },
              {
                icon: UsersIcon,
                label: "Guests",
                value: `${query.rooms} ${query.rooms === 1 ? "room" : "rooms"} · ${query.adults} ${query.adults === 1 ? "adult" : "adults"}${query.children > 0 ? `, ${query.children} children` : ""}`,
              },
            ]}
            quoteHref={enquiryHref("stay", {
              destination: query.placeName,
              startDate: query.checkIn,
              endDate: query.checkOut,
              adults: query.adults,
              children: query.children,
            })}
            disclaimer={`${siteConfig.name} is a travel agency, not a hotel. Rooms are supplied by the property and its own booking conditions govern your stay.`}
          />
        ) : !result.configured ? (
          <div className="measure-wide">
            <Alert tone="info" title="Hotel search is not connected yet">
              <p>
                No hotel supplier is connected to this environment, so there are
                no live results to show. Rather than display properties nobody
                could actually book, we would rather an agent priced the stay
                properly for you.
              </p>
            </Alert>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/hotels#request">Request hotel options</ButtonLink>
              <ButtonLink href="/hotels" variant="outline">
                Browse cities
              </ButtonLink>
            </div>
          </div>
        ) : result.hotels.length === 0 ? (
          <div className="measure-wide">
            <Alert tone="warning" title="No properties found there">
              <p>
                The supplier returned nothing for {query.placeName}. A broader
                area — the city rather than a single neighbourhood — usually
                changes that.
              </p>
            </Alert>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/hotels#request">Ask us to look</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12">
            <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
              <HotelFiltersPanel
                filters={filters}
                sort={sort}
                facets={facets}
                currency={currency}
                priceCeiling={priceCeiling}
              />
            </aside>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="text-h3 text-text">
                  {visible.length}{" "}
                  {visible.length === 1 ? "property" : "properties"}
                  {visible.length !== result.hotels.length && (
                    <span className="text-text-muted">
                      {" "}
                      of {result.hotels.length}
                    </span>
                  )}
                </h2>
                <p className="text-caption text-text-muted">
                  Totals are for {nights} {nights === 1 ? "night" : "nights"},{" "}
                  {query.rooms} {query.rooms === 1 ? "room" : "rooms"}, taxes as
                  quoted by the property.
                </p>
              </div>

              {visible.length === 0 ? (
                <Alert
                  tone="info"
                  title="No properties match those filters"
                  className="mt-6"
                >
                  <p>
                    {result.hotels.length}{" "}
                    {result.hotels.length === 1 ? "property is" : "properties are"}{" "}
                    available here — the filters you have applied exclude all of
                    them. Clearing one usually brings results back.
                  </p>
                </Alert>
              ) : (
                <ul className="mt-6 space-y-4">
                  {visible.map((hotel) => (
                    <li key={hotel.id}>
                      <HotelCard
                        hotel={hotel}
                        href={detailHref(hotel.id)}
                        nights={nights}
                        facilityNames={facilityNames}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {/*
                Numbered paging rather than infinite scroll. The supplier is
                paged and rate limited, a results page has to be linkable to be
                shareable, and infinite scroll makes the footer — which carries
                the compliance disclosures — unreachable.
              */}
              {totalPages > 1 && (
                <nav
                  aria-label="Search result pages"
                  className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6"
                >
                  {page > 1 ? (
                    <Link
                      href={pageHref(page - 1)}
                      className="rounded-full px-4 py-2 text-body-sm font-semibold text-primary hover:bg-primary-soft focus-ring"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span />
                  )}

                  <p className="text-caption tabular-nums text-text-muted">
                    Page {page} of {totalPages}
                  </p>

                  {page < totalPages ? (
                    <Link
                      href={pageHref(page + 1)}
                      className="rounded-full px-4 py-2 text-body-sm font-semibold text-primary hover:bg-primary-soft focus-ring"
                    >
                      Next →
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}

              <p className="measure mt-10 text-caption text-text-muted">
                We are a travel agency, not a hotel. Rooms are supplied by the
                property and its own booking conditions govern your stay. Prices
                and availability come from the property and change until a
                booking is confirmed.
              </p>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
