import Image from "next/image";
import Link from "next/link";

import { CallToBookPanel } from "@/components/layout/call-to-book-panel";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import { CalendarIcon, MapPinIcon, UsersIcon } from "@/components/ui/icons";
import { enquiryHref } from "@/features/enquiries/lib/enquiry-link";
import { JetFiltersPanel } from "@/features/private-jets/components/jet-filters-panel";
import { JetFlightCard } from "@/features/private-jets/components/jet-flight-card";
import { JetPriceNote } from "@/features/private-jets/components/jet-price-note";
import { JetSearchForm } from "@/features/private-jets/components/jet-search-form";
import { WorldLandDefs } from "@/features/private-jets/components/world-land-defs";
import { jetEnquiryHref } from "@/features/private-jets/lib/jet-enquiry-link";
import {
  isFlexibleSearch,
  jetSearchHrefWith,
  parseJetCursor,
  parseJetFilters,
  parseJetSearch,
  parseJetSort,
} from "@/features/private-jets/lib/jet-search-params";
import { bookingConfig } from "@/lib/config/booking";
import { siteConfig } from "@/lib/config/site";
import { publicFileExists } from "@/lib/content/images";
import { privateJetHeroImages } from "@/lib/content/private-jet-hero";
import { jetHubs } from "@/lib/content/private-jets";
import { JETS_PER_PAGE, searchJetFlights } from "@/lib/providers/skyaccess";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatLongDate } from "@/lib/utils/format-date";
import type { JetCategorySlug } from "@/types/private-jet";

/**
 * Private-jet search results.
 *
 * noIndex, per the project guide — a results page has no stable content to
 * rank and would spray near-duplicate URLs across the index. The pages built
 * to rank are `/private-jets`, `/private-jets/empty-legs` and the route and
 * aircraft guides.
 *
 * This sits at a static segment beside no dynamic sibling, so there is no
 * route collision to worry about — but it is dynamic in the rendering sense:
 * results come from a live supplier on every request, within the provider's
 * own short cache window.
 *
 * Four outcomes are kept strictly apart, as on the flight and hotel results
 * pages: the URL did not describe a search, the supplier failed, the supplier
 * answered with nothing, and filters excluded everything. Collapsing any two
 * of them tells the traveller something untrue about availability.
 */
export const metadata = buildMetadata({
  title: "Private jet search results",
  description: "Available private jets and empty legs matching your route and date.",
  path: "/private-jets/search",
  noIndex: true,
});

const hubs = jetHubs.map((hub) => ({
  query: hub.query,
  label: hub.label,
  detail: hub.detail,
}));

/*
  A frame whose file is missing renders the brand plate rather than breaking
  the page: `next/image` throws on a src it cannot resolve, and in a Server
  Component that throw is a 500 on the whole route.

  No caption — see the header comment in lib/content/private-jet-hero for
  why aircraft photography carries the credit and nothing else.
*/
/*
  The band is given a floor rather than left to be as tall as its text.

  A photograph needs room to be a photograph: at the height the summary
  alone produced, the frame was a letterbox strip and the aircraft in it was
  unreadable. The content is centred in the taller band so a one-line
  headline and a three-line one both sit properly rather than riding the top
  edge, and the extra bottom padding keeps the credit chip clear of the
  search panel below.
*/
const HERO_CONTAINER =
  "flex min-h-96 flex-col justify-center pb-20 md:min-h-[30rem] md:pb-24";

const heroSlides: HeroSlide[] = privateJetHeroImages.map((image) => ({
  id: image.src,
  src: publicFileExists(image.src) ? image.src : null,
  alt: image.alt,
  detail: `Photo: ${image.credit}`,
}));

export default async function PrivateJetSearchPage(
  props: PageProps<"/private-jets/search">,
) {
  const rawParams = await props.searchParams;
  const { query, errors } = parseJetSearch(rawParams);

  // ── The URL did not describe a search ───────────────────────────────────
  if (!query) {
    return (
      <>
        <Section
          tone="brand"
          size="lg"
          containerClassName={HERO_CONTAINER}
          backdrop={<HeroCarousel slides={heroSlides} />}
        >
          <h1 className="text-display text-text-inverse">
            Search private jets
          </h1>
          <p className="measure mt-3 text-body-lg text-text-on-dark">
            {bookingConfig.callToBook
              ? "Tell us where you are flying from and when, and an agent will source aircraft for you by phone, including repositioning flights."
              : "Tell us where you are flying from and when. We will show you what is actually available on the day, including repositioning flights."}
          </p>
        </Section>

        <Section size="sm" className="z-20">
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
          <JetSearchForm tone="flat" hubs={hubs} />
        </Section>
      </>
    );
  }

  const filters = parseJetFilters(rawParams);
  const sort = parseJetSort(rawParams);
  const cursor = parseJetCursor(rawParams);
  const flexible = isFlexibleSearch(rawParams);

  // While bookings are taken by phone the marketplace is not called at all.
  const result = bookingConfig.callToBook
    ? null
    : await searchJetFlights(query, { filters, sort, cursor });

  const presentCategories = [
    ...new Set(
      (result?.flights ?? [])
        .map((flight) => flight.aircraft.categorySlug)
        .filter((slug): slug is JetCategorySlug => slug !== null),
    ),
  ];

  const filtered = filters.categories.length > 0 || filters.minPrice !== null;

  return (
    <>
      {/* ── The search, restated ───────────────────────────────────────── */}
      {/*
        Photography behind the summary rather than a flat navy band. The
        carousel is the same component as the home page and cruises heroes,
        so the crossfade, the Ken Burns drift, the pause control and the
        reduced-motion opt-out are identical — and WCAG 2.2.2 is satisfied
        without a second implementation of it.

        The extra bottom padding leaves room for the credit chip the carousel
        draws along its own bottom edge.
      */}
      <Section
        tone="brand"
        size="lg"
        containerClassName={HERO_CONTAINER}
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <h1 className="text-balance text-display text-text-inverse">
          {query.destination
            ? `Private jets to ${shortPlace(query.destination)}`
            : `Private jets from ${shortPlace(query.origin)}`}
        </h1>

        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-2 text-body-sm text-text-on-dark">
            <MapPinIcon className="size-4 shrink-0 text-gray-400" />
            {query.origin} &rarr; {query.destination || "anywhere"}
          </li>
          <li className="flex items-center gap-2 text-body-sm text-text-on-dark">
            <CalendarIcon className="size-4 shrink-0 text-gray-400" />
            {formatLongDate(query.departOn)}
            {flexible && (
              <> &ndash; {formatLongDate(query.departUntil)}</>
            )}
          </li>
          <li>
            <Badge tone="inverse" size="sm">
              {query.passengers}{" "}
              {query.passengers === 1 ? "passenger" : "passengers"}
            </Badge>
          </li>
        </ul>

        {/*
          Which airports the marketplace decided the place name meant. A
          "Los Angeles" search is really seven fields, and a traveller who
          assumes LAX and finds Van Nuys on the card has been misled by the
          page rather than by the operator.
        */}
        {result && result.resolvedOriginCodes.length > 0 && (
          <p className="mt-4 text-caption text-gray-400">
            Searching {result.resolvedOriginCodes.join(", ")}
            {result.resolvedDestinationCodes.length > 0 &&
              ` to ${result.resolvedDestinationCodes.join(", ")}`}
            , within 60 miles.
          </p>
        )}
      </Section>

      {/* ── Amend the search ───────────────────────────────────────────── */}
      {/* z-20 so the picklists hang over the results band below rather than
          being painted over by it — Section sets `isolate`. */}
      <Section size="sm" tone="muted" bordered className="z-20">
        <JetSearchForm
          tone="flat"
          hubs={hubs}
          initial={{
            origin: query.origin,
            destination: query.destination,
            departOn: query.departOn,
            passengers: query.passengers,
            flexible,
          }}
        />
      </Section>

      {/* ── Outcome ────────────────────────────────────────────────────── */}
      <Section size="sm">
        {!result ? (
          <CallToBookPanel
            title="Book this charter with a travel agent"
            intro="Charter prices for this search are not shown online. Call us and an agent will source aircraft for your route and book the flight with you on the phone."
            facts={[
              {
                icon: MapPinIcon,
                label: "Route",
                value: `${query.origin} → ${query.destination || "anywhere"}`,
              },
              {
                icon: CalendarIcon,
                label: "Date",
                value: flexible
                  ? `${formatLongDate(query.departOn)} – ${formatLongDate(query.departUntil)}`
                  : formatLongDate(query.departOn),
              },
              {
                icon: UsersIcon,
                label: "Passengers",
                value: `${query.passengers} ${query.passengers === 1 ? "passenger" : "passengers"}`,
              },
            ]}
            quoteHref={enquiryHref("jet", {
              origin: query.origin,
              destination: query.destination,
              startDate: query.departOn,
              adults: query.passengers,
            })}
            disclaimer={`${siteConfig.name} is a travel agency, not an aircraft operator, and does not operate the flights it arranges.`}
          />
        ) : result.error ? (
          <div className="measure-wide mx-auto">
            <Alert tone="error" title="We could not reach the charter marketplace">
              <p>{result.error}</p>
              <p className="mt-2">
                Nothing is wrong with your search — this is our supplier, not
                you. Try again in a moment, or tell us the route and we will
                price it by hand.
              </p>
            </Alert>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href={jetSearchHrefWith(rawParams, {})}>
                Try again
              </ButtonLink>
              <ButtonLink href="/private-jets/request-a-quote" variant="outline">
                Request a quote instead
              </ButtonLink>
            </div>
          </div>
        ) : result.flights.length === 0 ? (
          <div className="measure-wide mx-auto">
            {/*
              An illustration, not a photograph. A blank result set is the one
              moment on this page where a picture of a beautiful aircraft would
              be actively misleading — there is no aircraft. A drawing says
              "nothing here" without implying anything about availability.

              `unoptimized` because it is already an SVG: Next's optimiser
              refuses SVG without `dangerouslyAllowSVG`, and turning that on
              globally to serve one local illustration is the wrong trade.
              aria-hidden because the Alert beside it already says this in
              words.
            */}
            <Image
              src="/svg/no-data.svg"
              alt=""
              aria-hidden="true"
              width={260}
              height={260}
              unoptimized
              className="mx-auto mb-8 h-auto w-56 max-w-full sm:w-64"
            />

            <Alert
              tone="warning"
              title={
                filtered
                  ? "Nothing matches those filters"
                  : "No aircraft available on that search"
              }
            >
              {filtered ? (
                <p>
                  There are flights on this route and date — the filters you
                  have applied exclude all of them. Clearing one usually brings
                  results back.
                </p>
              ) : (
                <p>
                  No operator has published availability for{" "}
                  {query.origin}
                  {query.destination ? ` to ${query.destination}` : ""} on{" "}
                  {formatLongDate(query.departOn)}
                  {flexible ? " or the week that follows" : ""}. Charter
                  availability is thin and moves hourly, so this is normal
                  rather than final.
                </p>
              )}
            </Alert>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {filtered ? (
                <ButtonLink
                  href={jetSearchHrefWith(rawParams, {
                    cat: null,
                    min: null,
                    max: null,
                  })}
                >
                  Clear filters
                </ButtonLink>
              ) : null}
              {!flexible && (
                <ButtonLink
                  href={jetSearchHrefWith(rawParams, { flex: "1" })}
                  variant={filtered ? "outline" : "primary"}
                >
                  Search the following week too
                </ButtonLink>
              )}
              <ButtonLink href="/private-jets/request-a-quote" variant="outline">
                Ask us to source it
              </ButtonLink>
            </div>

            <JetPriceNote variant="panel" className="mt-10" />
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12">
            <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
              <JetFiltersPanel
                params={rawParams}
                filters={filters}
                sort={sort}
                presentCategories={presentCategories}
                priceRange={result.priceRange}
              />
            </aside>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="text-h3 text-text">
                  {result.total !== null ? (
                    <>
                      {result.total}{" "}
                      {result.total === 1 ? "aircraft" : "aircraft"} available
                    </>
                  ) : (
                    <>
                      {result.flights.length} more{" "}
                      {result.flights.length === 1 ? "aircraft" : "aircraft"}
                    </>
                  )}
                </h2>
                <p className="flex items-center gap-2 text-caption text-text-muted">
                  <UsersIcon className="size-3.5 shrink-0" />
                  Priced for the whole aircraft, not per seat
                </p>
              </div>

              {/* The basemap geometry, once for every route panel below. */}
              <WorldLandDefs />

              <ul className="mt-6 space-y-5">
                {result.flights.map((flight) => (
                  <li key={flight.id}>
                    <JetFlightCard
                      flight={flight}
                      href={jetEnquiryHref(flight, {
                        passengers: query.passengers,
                      })}
                    />
                  </li>
                ))}
              </ul>

              {/*
                Forward-only paging. The supplier's cursor is opaque and it
                only reports a total on the first page, so numbered pages
                cannot be built honestly — a "Page 4 of 9" we cannot compute is
                worse than a "Show more" we can.

                The nav also has to survive the *last* page, which has no next
                cursor. Keying it on the next link alone stranded anyone who
                paged to the end with no way back to the start.
              */}
              {(result.nextCursor || cursor) && (
                <nav
                  aria-label="More results"
                  className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
                >
                  {cursor ? (
                    <Link
                      href={jetSearchHrefWith(rawParams, { cursor: null })}
                      className="rounded-full px-4 py-2 text-body-sm font-semibold text-primary hover:bg-primary-soft focus-ring"
                    >
                      ← Back to the first page
                    </Link>
                  ) : (
                    <span />
                  )}

                  {result.nextCursor ? (
                    <ButtonLink
                      href={jetSearchHrefWith(rawParams, {
                        cursor: result.nextCursor,
                      })}
                      variant="outline"
                    >
                      Show {JETS_PER_PAGE} more
                    </ButtonLink>
                  ) : (
                    <p className="text-caption text-text-muted">
                      That is everything currently published for this search.
                    </p>
                  )}
                </nav>
              )}

              <JetPriceNote variant="panel" className="mt-10" />
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

/** "Los Angeles, CA, United States" reads as "Los Angeles" in a headline. */
function shortPlace(value: string): string {
  return value.split(",")[0]?.trim() || value;
}
