"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";

import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { MapPinIcon } from "@/components/ui/icons";
import {
  panelInputClasses,
  QuietSelect,
  SearchCell,
  SearchErrors,
  SearchPanel,
  SearchQualifiers,
  SearchRow,
  type SearchPanelTone,
} from "@/components/ui/search-panel";
import { bookingConfig } from "@/lib/config/booking";
import { cn } from "@/lib/utils/cn";
import {
  MAX_PASSENGERS,
  searchHref,
} from "@/features/search/lib/search-params";
import { flightSearchCopy } from "@/features/search/lib/flight-search-copy";
import { CABIN_LABELS } from "@/types/flight";
import type { Airport, CabinClass, TripType } from "@/types/flight";
import type { Locale } from "@/types/locale";

const TRIP_VALUES: readonly TripType[] = ["round-trip", "one-way"];

interface FieldErrors {
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * The primary search form.
 *
 * Airports come in as a prop from the server rather than being fetched here —
 * the catalogue is small, static and already on the server, so there is no
 * reason to spend a round trip on it.
 *
 * Validation runs on submit and writes errors next to the field that caused
 * them. Multi-city is deliberately absent from the toggle: the funnel behind
 * it does not exist yet, and an option that leads nowhere is worse than one
 * that is not offered.
 *
 * The four fields that describe the journey sit in one connected control with
 * hairline dividers between them rather than as four separately-bordered
 * inputs in a grid — the shape every traveller already knows from an airline
 * or a flight search engine. The things that only qualify the search (trip
 * type, who is travelling, which cabin) sit above it as small controls, where
 * they do not compete with the route for the eye. See components/ui/search-
 * panel for the parts; the enquiry form uses the same ones so the four hero
 * tabs do not change shape under the traveller.
 */
export function FlightSearchForm({
  airports,
  defaultOrigin,
  defaultDestination,
  className,
  tone = "panel",
  locale = "en",
}: {
  airports: readonly Airport[];
  defaultOrigin?: string;
  defaultDestination?: string;
  className?: string;
  tone?: SearchPanelTone;
  locale?: Locale;
}) {
  const copy = flightSearchCopy[locale];
  const router = useRouter();
  const id = useId();

  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [origin, setOrigin] = useState(defaultOrigin ?? "");
  const [destination, setDestination] = useState(defaultDestination ?? "");

  /*
    One open-state per field, so opening "To" closes "From" rather than
    stacking two lists over each other. The active index lives beside it
    because arrow-key position is meaningless once the list is closed.
  */
  const [openField, setOpenField] = useState<"origin" | "destination" | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [errors, setErrors] = useState<FieldErrors>({});
  /*
    Pending state belongs to the navigation, not to us.

    Setting a boolean before `router.push` leaves nothing to clear it: this
    form is rendered again on the results page so the traveller can amend the
    search, and there it stays mounted across the navigation — the results
    arrived and the button went on spinning. `useTransition` hands the flag to
    React, which clears it when the navigation settles.
  */
  const [submitting, startNavigation] = useTransition();

  const departRef = useRef<HTMLInputElement>(null);

  // `min` is applied after mount rather than rendered into the HTML. The
  // server and the browser can disagree about what "today" is across a
  // timezone boundary, and baking a date into prerendered markup would either
  // mismatch on hydration or go stale in a statically generated page.
  useEffect(() => {
    departRef.current?.setAttribute("min", today());
  }, []);

  /**
   * Airports to offer for what is currently typed.
   *
   * The whole catalogue is already on the client — it arrives as a prop from
   * the server — so this is a local filter rather than a request, and an empty
   * box gets the first ten as a picklist rather than nothing at all.
   *
   * Matching is on code, city and airport name together, so "JFK", "new york"
   * and "kennedy" all find the same row.
   */
  const optionsFor = (value: string): ComboboxOption[] => {
    const needle = value.trim().toLowerCase();

    const matches = needle
      ? airports.filter(
          (airport) =>
            airport.code.toLowerCase().startsWith(needle) ||
            airport.city.toLowerCase().includes(needle) ||
            airport.name.toLowerCase().includes(needle),
        )
      : airports.slice(0, 10);

    return matches.slice(0, 8).map((airport) => ({
      id: airport.code,
      label: `${airport.code} — ${airport.city}`,
      detail: `${airport.name}, ${airport.country}`,
    }));
  };

  const codeFor = (value: string): string | null => {
    const trimmed = value.trim().toUpperCase();
    const direct = airports.find((airport) => airport.code === trimmed);
    if (direct) return direct.code;

    // The combobox writes "JFK — New York" into the field when an option is
    // chosen, and a traveller may have typed a bare code instead. Pull the
    // code back out of whichever form the field ended up holding.
    const match = airports.find(
      (airport) =>
        trimmed.startsWith(`${airport.code} `) ||
        trimmed === `${airport.city.toUpperCase()} (${airport.code})`,
    );
    return match ? match.code : null;
  };

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const originCode = codeFor(origin);
    const destinationCode = codeFor(destination);
    const next: FieldErrors = {};

    if (!originCode) {
      next.origin = copy.errors.origin;
    }
    if (!destinationCode) {
      next.destination = copy.errors.destination;
    }
    if (originCode && originCode === destinationCode) {
      next.destination = copy.errors.sameAirport;
    }
    if (!departDate) {
      next.departDate = copy.errors.departMissing;
    } else if (departDate < today()) {
      next.departDate = copy.errors.datePassed;
    }
    if (tripType === "round-trip") {
      if (!returnDate) {
        next.returnDate = copy.errors.returnMissing;
      } else if (departDate && returnDate < departDate) {
        next.returnDate = copy.errors.returnBeforeDepart;
      }
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      const firstInvalid = document.getElementById(
        `${id}-${Object.keys(next)[0]}`,
      );
      firstInvalid?.focus();
      return;
    }

    startNavigation(() => {
      router.push(
        searchHref({
          tripType,
          origin: originCode as string,
          destination: destinationCode as string,
          departDate,
          returnDate: tripType === "round-trip" ? returnDate : undefined,
          passengers: { adults, children, infants: 0 },
          cabin,
        }),
      );
    });
  };

  const errorList = Object.entries(errors).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  return (
    <SearchPanel
      onSubmit={handleSubmit}
      aria-label={copy.formLabel}
      tone={tone}
      className={className}
    >
      <SearchQualifiers>
        <div
          role="radiogroup"
          aria-label={copy.tripTypeLabel}
          className="inline-flex rounded-xs bg-gray-100 p-0.5"
        >
          {TRIP_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={tripType === value}
              onClick={() => setTripType(value)}
              className={cn(
                "min-h-9 rounded-xs px-3.5 text-body-sm font-semibold",
                "transition-[background-color,color,box-shadow] duration-[var(--duration-fast)] focus-ring",
                tripType === value
                  ? "bg-surface text-primary shadow-xs"
                  : "text-gray-600 hover:text-text",
              )}
            >
              {value === "round-trip" ? copy.roundTrip : copy.oneWay}
            </button>
          ))}
        </div>

        {/*
          Who and which cabin, grouped and pushed to the trailing edge.

          These three read as one set — they describe the party rather than the
          journey — and sitting them against the trip toggle rather than
          trailing from it stops the row reading as five unrelated controls.
          `ms-auto` rather than `justify-between` on the parent, because the
          parent wraps: on a narrow screen this group drops to its own line and
          aligns left, where a `justify-between` would strand it against the
          right edge on a line of its own.
        */}
        {/*
          Who and which cabin, grouped and pushed to the trailing edge.

          These three read as one set — they describe the party rather than the
          journey — so they sit together against the trip toggle rather than
          trailing from it.

          `ms-auto` rather than `justify-between` on the parent, because the
          parent wraps: on a narrow screen this group drops to its own line and
          aligns left, where `justify-between` would strand it against the
          right edge on a line of its own.
        */}
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:ms-auto">
          <QuietSelect
            id={`${id}-adults`}
            label={copy.adultsLabel}
            value={adults}
            onChange={(value) => setAdults(Number(value))}
          >
            {Array.from({ length: MAX_PASSENGERS }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {copy.adults(count)}
                </option>
              ),
            )}
          </QuietSelect>

          <QuietSelect
            id={`${id}-children`}
            label={copy.childrenLabel}
            value={children}
            onChange={(value) => setChildren(Number(value))}
          >
            {Array.from({ length: MAX_PASSENGERS }, (_, index) => index).map(
              (count) => (
                <option key={count} value={count}>
                  {copy.children(count)}
                </option>
              ),
            )}
          </QuietSelect>

          <QuietSelect
            id={`${id}-cabin`}
            label={copy.cabinLabel}
            value={cabin}
            onChange={(value) => setCabin(value as CabinClass)}
          >
            {(Object.keys(CABIN_LABELS) as CabinClass[]).map((value) => (
              <option key={value} value={value}>
                {copy.cabins[value]}
              </option>
            ))}
          </QuietSelect>
        </div>
      </SearchQualifiers>

      {/*
        The row stops clipping while a list is open. Its `overflow-hidden`
        keeps the cells' hover backgrounds inside the rounded corners, but it
        also clips an absolutely-positioned dropdown regardless of z-index.
      */}
      <SearchRow
        columns="lg:grid-cols-[1.35fr_1.35fr_1fr_1fr_auto]"
        overflow={openField ? "visible" : "clip"}
      >
        <SearchCell
          htmlFor={`${id}-origin`}
          label={copy.from}
          invalid={Boolean(errors.origin)}
        >
          <Combobox
            id={`${id}-origin`}
            listboxId={`${id}-origin-list`}
            value={origin}
            onValueChange={setOrigin}
            onSelect={(option) => {
              setOrigin(option.label);
              setOpenField(null);
              setActiveIndex(-1);
            }}
            options={optionsFor(origin)}
            open={openField === "origin"}
            onOpenChange={(next) => setOpenField(next ? "origin" : null)}
            activeIndex={openField === "origin" ? activeIndex : -1}
            onActiveIndexChange={setActiveIndex}
            placeholder={copy.placeholder}
            invalid={Boolean(errors.origin)}
            heading={origin.trim() ? undefined : copy.popularDepartures}
            icon={<MapPinIcon className="size-4" />}
            describedBy={errors.origin ? `${id}-origin-error` : undefined}
            emptyState={
              <p className="text-body-sm text-text">
                {copy.noAirportMatch(origin.trim())}
              </p>
            }
          />
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-destination`}
          label={copy.to}
          invalid={Boolean(errors.destination)}
          // The swap control overhangs this cell's leading edge by half its
          // width. Without the extra inset it sits on top of the label and the
          // placeholder rather than beside them.
          className="lg:pl-9"
        >
          <Combobox
            id={`${id}-destination`}
            listboxId={`${id}-destination-list`}
            value={destination}
            onValueChange={setDestination}
            onSelect={(option) => {
              setDestination(option.label);
              setOpenField(null);
              setActiveIndex(-1);
            }}
            options={optionsFor(destination)}
            open={openField === "destination"}
            onOpenChange={(next) => setOpenField(next ? "destination" : null)}
            activeIndex={openField === "destination" ? activeIndex : -1}
            onActiveIndexChange={setActiveIndex}
            placeholder={copy.placeholder}
            invalid={Boolean(errors.destination)}
            heading={destination.trim() ? undefined : copy.popularArrivals}
            icon={<MapPinIcon className="size-4" />}
            describedBy={
              errors.destination ? `${id}-destination-error` : undefined
            }
            emptyState={
              <p className="text-body-sm text-text">
                {copy.noAirportMatch(destination.trim())}
              </p>
            }
          />

          {/*
            The swap sits on the divider between the two cells, which is where
            it means something. It is positioned against this cell rather than
            against the row so it follows the reflow: on a phone the cells
            stack and it lands on the horizontal divider above.
          */}
          <button
            type="button"
            onClick={swap}
            aria-label={copy.swapLabel}
            className={cn(
              "absolute -top-5 right-4 grid size-10 place-items-center rounded-xs",
              "bg-surface text-gray-600 shadow-sm ring-1 ring-border",
              "transition-[color,transform] duration-[var(--duration-normal)] ease-out",
              "hover:rotate-180 hover:text-primary motion-reduce:hover:rotate-0",
              "focus-ring",
              "lg:-left-5 lg:right-auto lg:top-1/2 lg:-translate-y-1/2",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 8h13l-3-3M17 16H4l3 3" />
            </svg>
          </button>
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-departDate`}
          label={copy.depart}
          invalid={Boolean(errors.departDate)}
        >
          <input
            id={`${id}-departDate`}
            ref={departRef}
            type="date"
            value={departDate}
            onChange={(event) => setDepartDate(event.target.value)}
            aria-invalid={Boolean(errors.departDate) || undefined}
            aria-describedby={
              errors.departDate ? `${id}-departDate-error` : undefined
            }
            className={panelInputClasses}
          />
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-returnDate`}
          label={copy.return}
          invalid={Boolean(errors.returnDate)}
          disabled={tripType !== "round-trip"}
        >
          <input
            id={`${id}-returnDate`}
            type="date"
            min={departDate || undefined}
            value={tripType === "round-trip" ? returnDate : ""}
            onChange={(event) => setReturnDate(event.target.value)}
            disabled={tripType !== "round-trip"}
            aria-invalid={Boolean(errors.returnDate) || undefined}
            aria-describedby={
              errors.returnDate ? `${id}-returnDate-error` : undefined
            }
            className={panelInputClasses}
          />
        </SearchCell>

        <div className="p-2 lg:p-2.5">
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            fullWidth
            className="rounded-xs! lg:h-full lg:min-w-36"
            icon={
              <svg
                viewBox="0 0 20 20"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m17 17-3.6-3.6M15.3 8.7a6.6 6.6 0 1 1-13.2 0 6.6 6.6 0 0 1 13.2 0Z" />
              </svg>
            }
          >
            {bookingConfig.callToBook ? copy.getQuote : copy.search}
          </Button>
        </div>
      </SearchRow>

      <SearchErrors idPrefix={id} errors={errorList} />
    </SearchPanel>
  );
}
