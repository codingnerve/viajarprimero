"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import {
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  JetIcon,
  MapPinIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { JetGallery } from "@/features/private-jets/components/jet-gallery";
import { JetPriceNote } from "@/features/private-jets/components/jet-price-note";
import { JetRouteMap } from "@/features/private-jets/components/jet-route-map";
import { airportLabel } from "@/lib/providers/skyaccess";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDuration } from "@/lib/utils/format-duration";
import { formatLongDate } from "@/lib/utils/format-date";
import type { JetFlight } from "@/types/private-jet";

/**
 * The full detail for one leg, in a dialog.
 *
 * ## Every field here is conditional, on purpose
 *
 * The supplier populates this payload unevenly — roughly a third of aircraft
 * carry no amenity list at all, half state no baggage volume, and `seatsCapacity`
 * and `luggageVolume` are independently nullable. So nothing in this component
 * has a default: a row renders when the supplier sent the value and vanishes
 * when it did not.
 *
 * That is not defensive coding, it is the product requirement. "Wi-Fi" on a
 * charter listing for an aircraft the operator never said had Wi-Fi is the
 * kind of detail discovered at 40,000 feet, and a baggage figure invented to
 * fill a grid cell is how somebody arrives at the FBO with skis that do not
 * fit. An empty section is the honest answer and it is what this renders.
 *
 * The fields deliberately absent are the ones we cannot substantiate rather
 * than the ones we lack: `retailPrice`, `dealTag` and `referencePrice` all
 * arrive populated and are all dropped in the provider, because a saving we
 * cannot show the basis for is a claim, not a fact.
 *
 * ## Why a native dialog
 *
 * `showModal()` gives the focus trap, Escape, the inert background and the top
 * layer for free — see the same reasoning on the early-bird modal. The page
 * scroll lock is the one thing it does not give, so that is handled here.
 */
export function JetFlightModal({
  flight,
  href,
}: {
  flight: JetFlight;
  /** Where "Request this jet" goes — a pre-filled quote request. */
  href: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  /*
    `showModal()` makes the page inert but does not stop it scrolling, so a
    wheel gesture over the backdrop still moves the page behind the dialog.
    The padding compensates for the scrollbar the lock removes, which would
    otherwise shift the whole layout sideways as the dialog opens.
  */
  useEffect(() => {
    if (!open) return;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const show = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
  };

  const dismiss = () => dialogRef.current?.close();

  const originLabel = airportLabel(flight.origin);
  const destinationLabel = airportLabel(flight.destination);
  const departsOn = flight.departure.earliest.slice(0, 10);

  const { aircraft } = flight;

  return (
    <>
      {/*
        The trigger covers the card. It replaced a link to the quote form:
        sending somebody straight to a form because they clicked a photograph
        skipped the step they were actually asking for, which was a closer
        look. The request is still one click away, from inside.
      */}
      <button
        type="button"
        onClick={show}
        className="absolute inset-0 z-0 cursor-pointer focus-ring"
      >
        <span className="sr-only">
          View details — {aircraft.model || "aircraft"}, {originLabel} to{" "}
          {destinationLabel} on {formatLongDate(departsOn)}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="modal-dialog modal-dialog-wide m-auto"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // The dialog element fills the backdrop area, so a click landing on
          // the element itself is a click on the backdrop.
          if (event.target === dialogRef.current) dismiss();
        }}
      >
        <div className="relative flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl bg-surface text-left shadow-xl">
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-ring-inverse"
          >
            <span className="sr-only">Close</span>
            <CloseIcon className="size-4" />
          </button>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <JetGallery
                images={flight.images}
                alt={`${aircraft.model} operated on this leg`}
                seed={aircraft.model || flight.id}
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]"
              />

              {/* ── The leg ──────────────────────────────────────────── */}
              <div className="flex flex-col gap-6 p-6 md:p-8">
                <div>
                  {aircraft.categoryName && (
                    <p className="text-overline uppercase text-text-muted">
                      {aircraft.categoryName}
                    </p>
                  )}
                  <h2 id={titleId} className="mt-1 text-h2 text-text">
                    {aircraft.model || "Aircraft to be confirmed"}
                  </h2>
                </div>

                <div className="flex items-start gap-4">
                  <Endpoint airport={flight.origin} label={originLabel} />
                  <div className="flex flex-1 flex-col items-center pt-5">
                    <span aria-hidden="true" className="text-text-disabled">
                      &rarr;
                    </span>
                    {flight.durationMinutes !== null && (
                      <span className="mt-1 whitespace-nowrap text-caption tabular-nums text-text-muted">
                        {formatDuration(flight.durationMinutes)}
                      </span>
                    )}
                  </div>
                  <Endpoint
                    airport={flight.destination}
                    label={destinationLabel}
                    align="right"
                  />
                </div>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
                  <Fact
                    icon={<CalendarIcon className="size-4" />}
                    term="Departure"
                  >
                    <time dateTime={flight.departure.earliest}>
                      {formatLongDate(departsOn)}
                    </time>
                    <span className="block text-caption text-text-muted">
                      {flight.departure.isWindow
                        ? "Window — time agreed with the operator"
                        : localTime(flight.departure.earliestLocal) ||
                          "Time agreed with the operator"}
                    </span>
                  </Fact>

                  {flight.availableSeats > 0 && (
                    <Fact
                      icon={<UsersIcon className="size-4" />}
                      term="Passengers"
                    >
                      Up to {flight.availableSeats}
                      {aircraft.seatsCapacity !== null &&
                        aircraft.seatsCapacity !== flight.availableSeats && (
                          <span className="block text-caption text-text-muted">
                            {aircraft.seatsCapacity} seats fitted
                          </span>
                        )}
                    </Fact>
                  )}

                  <Fact icon={<JetIcon className="size-4" />} term="Departs from">
                    {flight.origin.name || flight.origin.icao}
                    {flight.originDistanceMiles !== null &&
                      flight.originDistanceMiles > 25 && (
                        <span className="block text-caption text-text-muted">
                          {flight.originDistanceMiles} miles from your search
                        </span>
                      )}
                  </Fact>

                  {flight.distanceNm !== null && (
                    <Fact
                      icon={<MapPinIcon className="size-4" />}
                      term="Distance"
                    >
                      <span className="tabular-nums">
                        {flight.distanceNm.toLocaleString("en-US")} nm
                      </span>
                      {aircraft.luggageVolume !== null && (
                        <span className="block text-caption tabular-nums text-text-muted">
                          {aircraft.luggageVolume} m³ baggage
                        </span>
                      )}
                    </Fact>
                  )}
                </dl>

                {/*
                  Renders nothing unless the supplier gave coordinates for both
                  ends — see JetRouteMap.
                */}
                <JetRouteMap
                  origin={flight.origin}
                  destination={flight.destination}
                  distanceNm={flight.distanceNm}
                />
              </div>
            </div>

            {/* ── What the operator has stated ───────────────────────── */}
            <div className="border-t border-border px-6 pb-8 pt-6 md:px-8">
              {aircraft.amenities.length > 0 && (
                <section>
                  <h3 className="text-overline uppercase text-text-muted">
                    On board
                  </h3>
                  <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {aircraft.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2.5 text-body-sm text-text-secondary"
                      >
                        <CheckIcon className="size-4 shrink-0 text-primary" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-caption text-text-muted">
                    As stated by the operator for this aircraft.
                  </p>
                </section>
              )}

              {(flight.operatorAudits.length > 0 ||
                flight.operatorPricingConfirmed) && (
                <section
                  className={aircraft.amenities.length > 0 ? "mt-8" : undefined}
                >
                  <h3 className="text-overline uppercase text-text-muted">
                    Operator
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
                    {flight.operatorAudits.map((audit) => (
                      <li
                        key={audit}
                        className="flex items-center gap-2.5 text-body-sm text-text-secondary"
                      >
                        <ShieldIcon className="size-4 shrink-0 text-primary" />
                        {audit} audited
                      </li>
                    ))}
                    {flight.operatorPricingConfirmed && (
                      <li className="flex items-center gap-2.5 text-body-sm text-text-secondary">
                        <CheckIcon className="size-4 shrink-0 text-primary" />
                        Pricing confirmed with the operator
                      </li>
                    )}
                  </ul>
                  {/*
                    The operator is not named. The supplier sends safety audits
                    and an analytics id but no trading name, and inventing one
                    — or implying it is us — would misrepresent who flies you.
                  */}
                  <p className="mt-3 text-caption text-text-muted">
                    The flight is operated by a licensed air carrier. We name
                    them, and their conditions of carriage, in your quote.
                  </p>
                </section>
              )}

              <JetPriceNote variant="panel" className="mt-8" />
            </div>
          </div>

          {/* ── The ask ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-surface-2 px-6 py-5 md:px-8">
            <div>
              {flight.price ? (
                <>
                  <p className="text-h3 tabular-nums text-text">
                    {formatCurrency(
                      flight.price.amountMinorUnits,
                      flight.price.currency,
                      { showCents: false },
                    )}
                  </p>
                  <p className="text-caption text-text-muted">
                    {flight.price.verified
                      ? "Operator-confirmed"
                      : "Estimated"}{" "}
                    · whole aircraft
                    {flight.availableSeats > 0 && (
                      <> · up to {flight.availableSeats} passengers</>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-body font-semibold text-text">
                    Price on request
                  </p>
                  <p className="text-caption text-text-muted">
                    The operator has not published a figure for this leg.
                  </p>
                </>
              )}
            </div>

            <ButtonLink href={href} size="lg">
              Request this jet
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}

function Endpoint({
  airport,
  label,
  align = "left",
}: {
  airport: JetFlight["origin"];
  label: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "min-w-0 text-right" : "min-w-0"}>
      {airport.icao && (
        <p className="text-caption tabular-nums text-text-muted">
          {airport.icao}
        </p>
      )}
      <p className="text-h3 tabular-nums text-text">
        {airport.code || airport.icao}
      </p>
      <p className="text-body-sm text-text-secondary">{label}</p>
    </div>
  );
}

function Fact({
  icon,
  term,
  children,
}: {
  icon: React.ReactNode;
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 text-caption text-text-muted">
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
        {term}
      </dt>
      <dd className="mt-1 text-body-sm font-medium text-text">{children}</dd>
    </div>
  );
}

/**
 * The time out of the supplier's local-time string, which arrives as
 * "10/02/2026 09:00 AM (EDT)" with the date already shown above it.
 */
function localTime(value: string): string {
  return value.replace(/^\d{1,2}\/\d{1,2}\/\d{4}\s*/, "").trim();
}
