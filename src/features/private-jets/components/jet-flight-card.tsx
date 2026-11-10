import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CalendarIcon, JetIcon, UsersIcon } from "@/components/ui/icons";
import { JetGallery } from "@/features/private-jets/components/jet-gallery";
import { JetFlightModal } from "@/features/private-jets/components/jet-flight-modal";
import { airportLabel } from "@/lib/providers/skyaccess";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDuration } from "@/lib/utils/format-duration";
import { formatLongDate } from "@/lib/utils/format-date";
import type { JetFlight } from "@/types/private-jet";

/*
  Mirrors the grid tracks below. The breakpoints are this project's own —
  sm 576, lg 992, xl 1200, 2xl 1440 — not Tailwind's defaults, so these numbers
  are not the ones a stock config would use.
*/
const IMAGE_SIZES =
  "(min-width: 1440px) 24rem, (min-width: 1200px) 20rem, (min-width: 992px) 17rem, (min-width: 576px) 15rem, 100vw";

/**
 * One available leg.
 *
 * The card is photograph-led and wide rather than a tile in a grid, because
 * the aircraft is the product. On a charter search the traveller is choosing
 * between a Citation and a Challenger far more than between two prices, and a
 * thumbnail cannot carry that decision — hence the gallery rather than a
 * single frame.
 *
 * ## Filling the card rather than stretching it
 *
 * Three columns only fit once the results column clears roughly 800px, which
 * is `xl` and up. Below that the price sits under the detail as its own row —
 * as a row, not a stack, so the figure and the button sit side by side and use
 * the width rather than adding height.
 *
 * The price block is centred in its rail rather than pinned to the top with
 * the button pushed to the bottom. That arrangement left a band of empty card
 * between them on every row, and the gap grew to match the tallest card on
 * the page.
 *
 * The gallery grows with the card rather than taking a fixed share, because
 * every pixel it takes comes out of the detail column — which is the thing
 * that was wrapping before the container was widened.
 *
 * ## What it refuses to say
 *
 * - **No departure time unless there is one.** These are repositioning
 *   flights; the operator holds a window and agrees the slot afterwards. The
 *   card shows the window when the payload has one and says so.
 * - **No struck-through "was" price.** The supplier sends a `retailPrice` we
 *   cannot substantiate, so it is dropped in the provider and never reaches
 *   here.
 * - **No price at all when the supplier did not give one.** The card says the
 *   operator has not published a figure rather than showing "from $0" or
 *   quietly hiding the flight.
 * - **No implied airport.** A "Los Angeles" search returns Van Nuys. The
 *   distance from the city that was searched is on the card, because a
 *   traveller who drives to LAX for a Van Nuys departure has been misled by
 *   the page, not by the operator.
 */
export function JetFlightCard({
  flight,
  href,
}: {
  flight: JetFlight;
  href: string;
}) {
  const originLabel = airportLabel(flight.origin);
  const destinationLabel = airportLabel(flight.destination);

  const specs = [
    flight.durationMinutes !== null
      ? `${formatDuration(flight.durationMinutes)} block time`
      : null,
    flight.distanceNm !== null ? `${flight.distanceNm} nm` : null,
    flight.aircraft.luggageVolume !== null
      ? `${flight.aircraft.luggageVolume} m³ baggage`
      : null,
    ...flight.operatorAudits.map((audit) => `${audit} audited`),
  ].filter((entry): entry is string => entry !== null);

  return (
    <article className="relative isolate grid overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-inset ring-border transition-shadow duration-[var(--duration-base)] hover:shadow-lg sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      {/*
        z-10 puts the gallery above the card-wide link below, which is what
        lets its arrows be clicked. The photograph is therefore not itself a
        link — see the note in JetGallery for why that is the right way round.
      */}
      <JetGallery
        images={flight.images}
        alt={`${flight.aircraft.model} operated on this leg`}
        seed={flight.aircraft.model || flight.id}
        sizes={IMAGE_SIZES}
        className="z-10 aspect-[16/10] sm:aspect-auto sm:min-h-60"
      />

      {flight.aircraft.categoryName && (
        <div className="absolute left-3 top-3 z-20">
          <Badge tone="inverse" size="sm">
            {flight.aircraft.categoryName}
          </Badge>
        </div>
      )}

      {/*
        Clicking the card opens the detail view rather than jumping to the
        quote form. Somebody clicking a photograph is asking for a closer look,
        not for a form — and the amenity list, the full airport names and the
        second half of the gallery have nowhere else to live on a card this
        size. The request is still one click away, from inside the dialog.
      */}
      <JetFlightModal flight={flight} href={href} />

      {/* ── The leg ──────────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-stretch xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-h3 text-text">
            <span className="tabular-nums">
              {flight.origin.code || flight.origin.icao}
            </span>
            <span aria-hidden="true" className="text-text-disabled">
              &rarr;
            </span>
            <span className="tabular-nums">
              {flight.destination.code || flight.destination.icao}
            </span>
          </h3>

          <p className="mt-1 text-body-sm text-text-secondary">
            {originLabel} to {destinationLabel}
          </p>

          <ul className="mt-4 space-y-2 text-caption text-text-muted">
            <li className="flex items-start gap-2">
              <JetIcon className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Departs {flight.origin.name || flight.origin.icao}
                {/*
                  Only past a threshold. A note on every card that the airport
                  is four miles out is noise that trains people to ignore the
                  one that says forty.
                */}
                {flight.originDistanceMiles !== null &&
                  flight.originDistanceMiles > 25 &&
                  `, ${flight.originDistanceMiles} miles from your search`}
              </span>
            </li>

            <li className="flex items-start gap-2">
              <CalendarIcon className="mt-0.5 size-3.5 shrink-0" />
              <span>
                <time dateTime={flight.departure.earliest}>
                  {formatLongDate(flight.departure.earliest.slice(0, 10))}
                </time>
                {flight.departure.isWindow ? (
                  <> · departure window, time agreed with the operator</>
                ) : (
                  localTime(flight.departure.earliestLocal) && (
                    <> · {localTime(flight.departure.earliestLocal)}</>
                  )
                )}
              </span>
            </li>

            <li className="flex items-start gap-2">
              <UsersIcon className="mt-0.5 size-3.5 shrink-0" />
              <span>
                {flight.aircraft.model}
                {flight.availableSeats > 0 && (
                  <>
                    {" · "}
                    {flight.aircraft.seatsCapacity !== null &&
                    flight.aircraft.seatsCapacity !== flight.availableSeats
                      ? `${flight.availableSeats} of ${flight.aircraft.seatsCapacity} seats available`
                      : `${flight.availableSeats} ${flight.availableSeats === 1 ? "seat" : "seats"} available`}
                  </>
                )}
              </span>
            </li>
          </ul>

          {/*
            The specification strip is pushed to the foot of the column rather
            than left sitting under the list. On a card whose height is set by
            the photograph beside it, that is the difference between a filled
            card and one with a band of nothing across the bottom.
          */}
          {specs.length > 0 && (
            <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border pt-4 text-caption text-text-muted xl:mt-auto">
              {specs.map((spec, position) => (
                <li key={spec} className="flex items-center gap-3">
                  {position > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden h-3 w-px bg-border sm:block"
                    />
                  )}
                  <span className="tabular-nums">{spec}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Price and the ask ──────────────────────────────────────────── */}
        <div className="flex shrink-0 flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 xl:w-44 xl:flex-col xl:items-stretch xl:justify-center xl:gap-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0 2xl:w-52 2xl:pl-8">
          <div className="min-w-0">
            {flight.price ? (
              <>
                <p className="text-caption text-text-muted">
                  {flight.price.verified
                    ? "Operator-confirmed"
                    : "Estimated from"}
                </p>
                <p className="text-h2 tabular-nums text-text">
                  {formatCurrency(
                    flight.price.amountMinorUnits,
                    flight.price.currency,
                    { showCents: false },
                  )}
                </p>
                <p className="mt-1 text-caption text-text-muted">
                  Whole aircraft, before final confirmation
                </p>
              </>
            ) : (
              <>
                <p className="text-body font-semibold text-text">
                  Price on request
                </p>
                <p className="mt-1 text-caption text-text-muted">
                  The operator has not published a figure for this leg.
                </p>
              </>
            )}
          </div>

          {/*
            The button is the accessible name and the only thing in the tab
            order. `relative` lifts it over the card-wide overlay above.
          */}
          <div className="relative w-full shrink-0 sm:w-auto xl:w-full">
            <ButtonLink href={href} fullWidth className="sm:px-6 xl:px-4">
              Request this jet
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The time out of the supplier's local-time string.
 *
 * It arrives as "10/02/2026 09:00 AM (EDT)", and the card has already printed
 * the date in long form immediately before it — so rendering the whole string
 * put the same date on the line twice.
 */
function localTime(value: string): string {
  return value.replace(/^\d{1,2}\/\d{1,2}\/\d{4}\s*/, "").trim();
}
