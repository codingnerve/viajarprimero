import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { PlateFill } from "@/components/ui/plate";
import { getAirlineLogo } from "@/lib/content/airline-logos";
import {
  BookingConfirmButton,
  type BookingSummary,
} from "@/features/search/components/booking-confirm-button";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDuration } from "@/lib/utils/format-duration";
import { cn } from "@/lib/utils/cn";
import type { FlightOffer, FlightSlice } from "@/types/flight";

function timeOf(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) return "--:--";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

/**
 * The carrier, as a tile.
 *
 * The airline's own mark where `lib/content/airline-logos` can match one to
 * the carrier name, and the IATA designator on a brand gradient where it
 * cannot. The fallback is the normal case rather than an error state — the
 * logo archive covers a fraction of the world's carriers, and most searches
 * turn up one it has never heard of.
 *
 * A square box, 72px, with the mark taking almost all of it. The first attempt
 * was a 44×64 landscape tile on the theory that wordmarks want width, and it
 * read as a small logo lost in a large rectangle — the tile was the thing you
 * noticed rather than the airline. A square with tight padding gives the mark
 * more room in both directions and stops the box competing with its contents.
 *
 * Both variants use the same box, so a column of six results lines up
 * whichever way each row resolved.
 *
 * The marks are `unoptimized`. They are already small files at their display
 * size, and pushing a 500px wordmark through the optimiser to render it at 72
 * costs a transform per logo per width for no visible gain.
 *
 * It exists because a results list of six rows of small grey type has nothing
 * for the eye to land on. This is the anchor each row was missing.
 */
function CarrierPlate({ code, name }: { code: string; name: string }) {
  const logo = getAirlineLogo(name, code);

  if (logo) {
    return (
      <span className="relative grid size-18 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ring-1 ring-inset ring-border">
        <Image
          src={logo}
          alt=""
          width={72}
          height={72}
          unoptimized
          className="max-h-14 w-auto max-w-16 object-contain"
        />
      </span>
    );
  }

  return (
    <span className="relative grid size-18 shrink-0 place-items-center overflow-hidden rounded-xl">
      <PlateFill seed={code} />
      <span className="relative text-h4 font-bold tracking-wide text-white">
        {code}
      </span>
    </span>
  );
}

/**
 * The trip context the booking dialog needs, which the itinerary alone does
 * not carry — city names, traveller count and cabin all live on the search
 * query. Formatted by the caller so date formatting stays on the server and
 * the locale cannot drift between the card and the dialog.
 */
export type OfferBookingContext = Pick<
  BookingSummary,
  | "originCity"
  | "originCode"
  | "destinationCity"
  | "destinationCode"
  | "departDate"
  | "returnDate"
  | "passengers"
  | "cabin"
> & {
  /** Quote request for this exact trip, pre-filled. */
  quoteHref: string;
};

/**
 * A single priced itinerary.
 *
 * The fare already includes taxes and carrier charges, and our service fee is
 * disclosed directly under it rather than in a tooltip, so nobody discovers a
 * component of the price for the first time on the phone.
 *
 * The itinerary is drawn as a flight path between the two times rather than as
 * four columns of small text. Departure and arrival are the two facts a
 * traveller compares across a list of results, so they are the two things set
 * at heading size; everything else is subordinate to them.
 */
export function FlightOfferCard({
  offer,
  booking,
}: {
  offer: FlightOffer;
  /**
   * Omit to render the card without a booking control — which is what a route
   * landing page wants, where the card is illustrative rather than actionable.
   */
  booking?: OfferBookingContext;
}) {
  const firstSlice = offer.slices[0];

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-surface",
        "ring-1 ring-inset ring-border",
        "transition-[box-shadow,transform] duration-[var(--duration-normal)]",
        "hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none",
        "md:flex-row",
      )}
    >
      <div className="flex-1 divide-y divide-border">
        {offer.slices.map((slice, index) => (
          <SliceRow
            key={`${slice.origin}-${slice.destination}-${index}`}
            slice={slice}
            label={index === 0 ? "Outbound" : "Return"}
            multiple={offer.slices.length > 1}
          />
        ))}

        {/* Only what the fare source actually said. Where it said nothing
            about bags or fare rules, the card says who will tell you rather
            than guessing. */}
        <div className="flex flex-wrap gap-1.5 bg-surface-2/60 px-5 py-3.5">
          {offer.notes.length > 0 ? (
            offer.notes.map((note) => (
              <Badge key={note} tone="neutral" size="sm">
                {note}
              </Badge>
            ))
          ) : (
            <Badge tone="neutral" size="sm">
              Baggage and fare rules confirmed when you book
            </Badge>
          )}
        </div>
      </div>

      {/* The price rail. Its own tinted ground rather than a border, so the
          eye separates "what you get" from "what it costs" without another
          line drawn across the card. */}
      <div className="flex shrink-0 flex-col justify-center bg-gradient-to-b from-surface-2 to-primary-softer px-5 py-5 md:w-64 md:border-l md:border-border">
        <p className="text-h1 tabular-nums text-text">
          {formatCurrency(offer.fare, offer.currency)}
        </p>
        <p className="text-caption text-text-muted">
          {offer.returnArrangedWithAgent ? "Round-trip" : "One-way"} fare for
          all travellers, incl. taxes &amp; carrier charges
        </p>

        <p className="mt-3 border-t border-border pt-3 text-caption text-text-muted">
          {offer.returnArrangedWithAgent &&
            "Return flight chosen with your agent. "}
          Our service fee is quoted before you pay. Fares can change until
          ticketed.
        </p>

        {booking && (
          <div className="mt-5">
            <BookingConfirmButton
              quoteHref={booking.quoteHref}
              summary={{
                offerId: offer.id,
                originCity: booking.originCity,
                originCode: booking.originCode,
                destinationCity: booking.destinationCity,
                destinationCode: booking.destinationCode,
                departDate: booking.departDate,
                returnDate: booking.returnDate,
                passengers: booking.passengers,
                cabin: booking.cabin,
                carrier: firstSlice.segments[0].carrierName,
                flights: firstSlice.segments
                  .map((segment) => segment.flightNumber)
                  .filter(Boolean)
                  .join(", "),
                fare: formatCurrency(offer.fare, offer.currency),
              }}
            />
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * One direction of the journey.
 *
 * `label` only renders when the offer has more than one slice — on a one-way
 * there is nothing to distinguish, and an "Outbound" tag above a single row is
 * noise.
 */
function SliceRow({
  slice,
  label,
  multiple,
}: {
  slice: FlightSlice;
  label: string;
  multiple: boolean;
}) {
  const first = slice.segments[0];
  const last = slice.segments[slice.segments.length - 1];
  const nonstop = slice.stops === 0;

  return (
    <div className="px-5 py-5">
      {multiple && (
        <p className="mb-3 text-overline uppercase text-text-muted">{label}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        {/*
          Carrier and flight number together — the number is the detail that
          lets a traveller check the flight against the airline's own site.
          On a connection it names the first leg, which is the one you board.
        */}
        <div className="flex min-w-0 items-center gap-3.5 sm:w-60">
          <CarrierPlate code={first.marketingCarrier} name={first.carrierName} />
          <span className="min-w-0">
            <span className="block truncate text-body-sm font-semibold text-text">
              {first.carrierName}
            </span>
            <span className="block text-caption tabular-nums text-text-muted">
              {first.flightNumber}
            </span>
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="text-right">
            <p className="text-h2 tabular-nums text-text">
              {timeOf(first.departsAt)}
            </p>
            <p className="text-caption tabular-nums text-text-muted">
              {slice.origin}
            </p>
          </div>

          {/* The path. The stop count sits on the line where it belongs —
              between the two ends — rather than as a badge off to one side. */}
          <div className="flex min-w-24 flex-1 flex-col items-center gap-1">
            <p className="text-caption tabular-nums text-text-muted">
              {formatDuration(slice.durationMinutes)}
            </p>
            <div
              aria-hidden="true"
              className="relative flex w-full items-center"
            >
              <span className="size-2 shrink-0 rounded-full bg-primary/70" />
              <span
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  nonstop ? "bg-success/45" : "bg-border-strong",
                )}
              />
              {!nonstop && (
                <span className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-warning ring-2 ring-surface" />
              )}
              <span className="size-2 shrink-0 rounded-full bg-primary/70" />
            </div>
            <p
              className={cn(
                "text-caption font-medium",
                nonstop ? "text-success" : "text-text-secondary",
              )}
            >
              {nonstop
                ? "Nonstop"
                : `${slice.stops} ${slice.stops === 1 ? "stop" : "stops"}`}
            </p>
          </div>

          <div>
            <p className="text-h2 tabular-nums text-text">
              {timeOf(last.arrivesAt)}
            </p>
            <p className="text-caption tabular-nums text-text-muted">
              {slice.destination}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
