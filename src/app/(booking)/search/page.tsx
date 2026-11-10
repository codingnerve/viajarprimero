import { FlightOfferCard } from "@/features/search/components/flight-offer-card";
import { FlightSearchForm } from "@/features/search/components/flight-search-form";
import {
  describePassengers,
  parseSearchParams,
} from "@/features/search/lib/search-params";
import { CallToBookPanel } from "@/components/layout/call-to-book-panel";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import {
  CalendarIcon,
  MapPinIcon,
  PlaneIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/lib/config/site";
import { airports, getAirport } from "@/lib/content/airports";
import { flightHeroImages } from "@/lib/content/flight-hero";
import { publicFileExists } from "@/lib/content/images";
import { searchFlights } from "@/lib/providers/flight-search";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatTripDate } from "@/lib/utils/format-date";
import { CABIN_LABELS } from "@/types/flight";

/**
 * Fare search results.
 *
 * noIndex, per the project guide — a search result page has no stable content
 * to rank and would spray near-duplicate URLs across the index.
 *
 * The three outcomes are kept strictly distinct: no supplier connected, a
 * supplier that returned nothing, and a supplier that failed. Collapsing them
 * into one empty state would tell the traveller something untrue about
 * availability on their route.
 */
export const metadata = buildMetadata({
  title: "Flight search results",
  description: "Your flight search results.",
  path: "/search",
  noIndex: true,
});

/*
  A frame whose file is missing renders the brand plate rather than breaking
  the page: `next/image` throws on a src it cannot resolve, and in a Server
  Component that throw is a 500 on the whole route.

  No captions — see the header comment in lib/content/flight-hero for why
  airliner photography carries the credit and nothing else.
*/
const heroSlides: HeroSlide[] = flightHeroImages.map((image) => ({
  id: image.src,
  src: publicFileExists(image.src) ? image.src : null,
  alt: image.alt,
  detail: `Photo: ${image.credit}`,
}));

/*
  The band is given a floor rather than left as tall as its text: at the
  height the summary alone produced, the photograph was a letterbox strip.
  The content is centred in it, and the extra bottom padding keeps the
  credit chip clear of the search panel below.
*/
const HERO_CONTAINER =
  "flex min-h-96 flex-col justify-center pb-20 md:min-h-[30rem] md:pb-24";

export default async function SearchPage(props: PageProps<"/search">) {
  const rawParams = await props.searchParams;
  const { query, errors } = parseSearchParams(rawParams);

  // ── The URL did not describe a search ─────────────────────────────────
  if (!query) {
    return (
      <>
        <Section
          tone="brand"
          size="lg"
          containerClassName={HERO_CONTAINER}
          backdrop={<HeroCarousel slides={heroSlides} />}
        >
          <h1 className="text-display text-text-inverse">Flight search</h1>
          <p className="measure mt-3 text-body-lg text-text-on-dark">
            Tell us the route and the dates and we will take it from there.
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
          <FlightSearchForm airports={airports} tone="flat" />
        </Section>
      </>
    );
  }

  const origin = getAirport(query.origin);
  const destination = getAirport(query.destination);

  let result: Awaited<ReturnType<typeof searchFlights>> | null = null;
  let searchFailed = false;

  // While bookings are taken by phone (bookingConfig.callToBook) the provider
  // returns `configured: false` without calling the fare feed.
  try {
    result = await searchFlights(query);
  } catch (error) {
    console.error("Fare search failed", error);
    searchFailed = true;
  }

  /**
   * The search, restated as facts rather than as one run-on sentence.
   *
   * A traveller arriving on this page from a shared link needs to confirm at a
   * glance that the URL describes the trip they meant. Five chips they can
   * check individually do that; a single grey line of text separated by
   * middots does not.
   */
  const facts = [
    {
      icon: MapPinIcon,
      value: `${origin?.city ?? query.origin} (${query.origin}) → ${destination?.city ?? query.destination} (${query.destination})`,
    },
    {
      icon: CalendarIcon,
      value: query.returnDate
        ? `${formatTripDate(query.departDate)} – ${formatTripDate(query.returnDate)}`
        : `${formatTripDate(query.departDate)} · one way`,
    },
    { icon: PlaneIcon, value: CABIN_LABELS[query.cabin] },
  ];

  /*
    The quote request with this search already in it, so a traveller who
    reaches the end of the results does not retype the trip. `/checkout` reads
    these parameters the same way the search form writes them.
  */
  const quoteHref = `/checkout?${new URLSearchParams({
    trip: query.tripType,
    from: query.origin,
    to: query.destination,
    depart: query.departDate,
    ...(query.returnDate ? { return: query.returnDate } : {}),
    adults: String(query.passengers.adults),
    ...(query.passengers.children > 0
      ? { children: String(query.passengers.children) }
      : {}),
    cabin: query.cabin,
  }).toString()}`;

  /* What every call-to-book panel on this page shares. */
  const panel = {
    facts: [
      { icon: MapPinIcon, label: "Route", value: facts[0].value },
      { icon: CalendarIcon, label: "Dates", value: facts[1].value },
      {
        icon: UsersIcon,
        label: "Travellers",
        value: describePassengers(query.passengers),
      },
      { icon: PlaneIcon, label: "Cabin", value: CABIN_LABELS[query.cabin] },
    ],
    quoteHref,
    disclaimer: `${siteConfig.name} is an independent travel agency, not an airline, and is not affiliated with any carrier.`,
    showFee: true,
  };

  return (
    <>
      {/* ── The search, restated ───────────────────────────────────────── */}
      {/*
        Photography behind the summary rather than a flat navy band. Same
        component as the home page, cruises, car rental and private-jet
        heroes, so the crossfade, the Ken Burns drift, the pause control and
        the reduced-motion opt-out are identical — and WCAG 2.2.2 is
        satisfied without a second implementation of it.
      */}
      <Section
        tone="brand"
        size="lg"
        containerClassName={HERO_CONTAINER}
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <h1 className="text-balance text-display text-text-inverse">
          {origin?.city ?? query.origin} to{" "}
          {destination?.city ?? query.destination}
        </h1>

        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {facts.map((fact) => (
            <li
              key={fact.value}
              className="flex items-center gap-2 text-body-sm text-text-on-dark"
            >
              <fact.icon className="size-4 shrink-0 text-gray-400" />
              {fact.value}
            </li>
          ))}
          <li>
            <Badge tone="inverse" size="sm">
              {describePassengers(query.passengers)}
            </Badge>
          </li>
        </ul>
      </Section>

      {/* ── Amend the search ───────────────────────────────────────────── */}
      {/* z-20 because Section sets `isolate`, so each band is its own
          stacking context and the results would otherwise paint over an
          open airport picklist. */}
      <Section size="sm" tone="muted" bordered className="z-20">
        <FlightSearchForm
          airports={airports}
          defaultOrigin={origin ? `${origin.code} — ${origin.city}` : query.origin}
          defaultDestination={
            destination
              ? `${destination.code} — ${destination.city}`
              : query.destination
          }
          tone="flat"
        />
      </Section>

      {/* ── Outcome ────────────────────────────────────────────────────── */}
      <Section size="sm">
        {/*
          No fare feed, or the feed failed. Either way there is nothing to
          price online, so calling is the path. A failure is a problem at our
          end, and the copy says so rather than implying the route is full.
        */}
        {(searchFailed || (result && !result.configured)) && (
          <CallToBookPanel
            {...panel}
            title="Book this flight with a travel agent"
            intro={
              searchFailed
                ? "We could not load fares just now — that is a problem at our end, not a sign the route is full. Call and an agent will price this trip for you."
                : "We do not show fares or sell tickets online. Call and an agent will check fares for your dates and book the trip with you on the phone."
            }
          />
        )}

        {!searchFailed && result?.configured && result.offers.length === 0 && (
          <CallToBookPanel
            {...panel}
            title="Book this flight with a travel agent"
            intro="No fares came back online for these exact dates and airports. Call and an agent will check nearby dates and alternative airports with you."
          />
        )}

        {/*
          Live market fares: real prices at the moment of search, but not held
          by us. The price disclosure sits above the list where nobody can
          scroll past it, and every card books by phone.
        */}
        {!searchFailed && result?.configured && result.offers.length > 0 && (
          <section aria-labelledby="results-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 id="results-heading" className="text-h2 text-text">
                {result.offers.length}{" "}
                {result.offers.length === 1 ? "flight" : "flights"}
              </h2>
              <p className="measure text-caption text-text-muted">
                Live fares for all travellers, including taxes and carrier
                charges. Book by phone — an agent confirms the fare and quotes
                our service fee before you pay. Fares are not held and can
                change until the ticket is issued.
              </p>
            </div>

            <ul className="mt-6 space-y-4">
              {result.offers.map((offer) => (
                <li key={offer.id}>
                  <FlightOfferCard
                    offer={offer}
                    booking={{
                      originCity: origin?.city ?? query.origin,
                      originCode: query.origin,
                      destinationCity: destination?.city ?? query.destination,
                      destinationCode: query.destination,
                      departDate: formatTripDate(query.departDate),
                      returnDate: query.returnDate
                        ? formatTripDate(query.returnDate)
                        : undefined,
                      passengers: describePassengers(query.passengers),
                      cabin: CABIN_LABELS[query.cabin],
                      quoteHref,
                    }}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <CallToBookPanel
                {...panel}
                title="Want help choosing?"
                intro="Call and an agent will compare these flights with you, check the fare is still available and book the one that suits."
              />
            </div>
          </section>
        )}
      </Section>
    </>
  );
}
