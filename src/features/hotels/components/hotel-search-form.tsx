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
import { MapPinIcon } from "@/components/ui/icons";
import {
  hotelSearchHref,
  MAX_GUESTS,
  MAX_ROOMS,
} from "@/features/hotels/lib/hotel-search-params";
import { hotelSearchCopy } from "@/features/hotels/lib/hotel-search-copy";
import { bookingConfig } from "@/lib/config/booking";
import type { PlaceSuggestion } from "@/types/hotel";
import type { Locale } from "@/types/locale";

interface FieldErrors {
  place?: string;
  checkIn?: string;
  checkOut?: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Hotel search, built on the same panel parts as the flight search.
 *
 * A hotel search needs a *place*, and a place is not something a traveller can
 * type accurately — "Barcelona" is a city, a province and a dozen hotels. So
 * the destination field is a combobox over the supplier's own place index
 * rather than a free-text input: the traveller picks a real place and we carry
 * its id, which is what the rest of the flow is keyed on.
 *
 * That is also why the submit button will not proceed on typed text alone. A
 * search with a name but no id cannot be executed, and silently searching
 * something adjacent is worse than saying "pick one from the list".
 *
 * The widget itself is `components/ui/combobox`, shared with the flight
 * search. This form owns only the data behind it: the debounced lookup, the
 * picklist fallback, and what a selection means.
 */
export function HotelSearchForm({
  initial,
  popular = [],
  className,
  tone = "panel",
  locale = "en",
}: {
  initial?: Partial<{
    placeId: string;
    placeName: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
  }>;
  /**
   * Destinations offered before anything is typed.
   *
   * Resolved on the server — looking a place up is a supplier call — and
   * passed in, so opening the field costs nothing and the list is already
   * there on the first click rather than after a round trip.
   */
  popular?: readonly PlaceSuggestion[];
  className?: string;
  tone?: SearchPanelTone;
  locale?: Locale;
}) {
  const copy = hotelSearchCopy[locale];
  const router = useRouter();
  const id = useId();

  const [placeQuery, setPlaceQuery] = useState(initial?.placeName ?? "");
  const [placeId, setPlaceId] = useState(initial?.placeId ?? "");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  /** The query `suggestions` answer, so stale or pending results never show. */
  const [resultsFor, setResultsFor] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? "");
  const [adults, setAdults] = useState(initial?.adults ?? 2);
  const [children, setChildren] = useState(initial?.children ?? 0);
  const [rooms, setRooms] = useState(initial?.rooms ?? 1);

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

  const checkInRef = useRef<HTMLInputElement>(null);

  // `min` is set after mount rather than rendered into the HTML: the server
  // and the browser can disagree about what "today" is across a timezone
  // boundary, and a date baked into prerendered markup goes stale.
  useEffect(() => {
    checkInRef.current?.setAttribute("min", today());
  }, []);

  /*
    Debounced lookup. 250ms is long enough that typing "barcelona" costs one
    request rather than nine, and short enough that the list feels live. The
    abort controller means an in-flight response for "barc" cannot land after
    the one for "barcelona" and overwrite it.
  */
  useEffect(() => {
    const trimmed = placeQuery.trim();

    // A query echoing the already-chosen place is the result of a selection,
    // not a new search — re-querying it would reopen the list under the user.
    if (placeId) return;

    const controller = new AbortController();

    /*
      Everything, including clearing the list, happens inside the timer.

      Clearing synchronously in the effect body would be a setState during the
      effect, which React flags as a cascading render — and it is genuinely
      wrong here as well: it would blank the list on the keystroke that takes
      the query below three characters, a frame before the timer would.
    */
    const timer = window.setTimeout(async () => {
      // Below three characters the popular picklist (filtered) takes over;
      // the list stays open rather than vanishing under the traveller.
      if (trimmed.length < 3) {
        setSuggestions([]);
        setResultsFor("");
        return;
      }

      setLoadingPlaces(true);
      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        const body = (await response.json()) as { places?: PlaceSuggestion[] };
        setSuggestions(body.places ?? []);
        setResultsFor(trimmed);
        setActiveIndex(-1);
        /*
          Opened even when nothing came back, so the panel can say so. Closing
          on an empty result is what produced the dead end this fixes: you
          typed three characters, nothing appeared, and the only feedback was
          the submit button refusing with "pick one from the list" — a list
          that was never shown.
        */
        setOpen(true);
      } catch {
        // An aborted request is the normal case here, not a failure worth
        // showing. A genuine outage surfaces when the search is submitted.
      } finally {
        setLoadingPlaces(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [placeQuery, placeId]);

  const choose = (place: PlaceSuggestion) => {
    setPlaceId(place.id);
    setPlaceQuery(place.detail ? `${place.name}, ${place.detail}` : place.name);
    setOpen(false);
    setActiveIndex(-1);
    setErrors((current) => ({ ...current, place: undefined }));
  };

  /*
    What the panel is showing.

    Typed queries win; an empty or too-short box falls back to the picklist.
    Deriving this rather than holding a second piece of state is what stops the
    panel showing results for a query the traveller has since cleared — and it
    means the keyboard handler below navigates whichever list is on screen
    without needing to know which one that is.
  */
  const trimmedQuery = placeQuery.trim();
  const needle = placeId ? "" : trimmedQuery.toLowerCase();
  const matchingPopular = needle
    ? popular.filter(
        (place) =>
          place.name.toLowerCase().includes(needle) ||
          (place.detail?.toLowerCase().includes(needle) ?? false),
      )
    : popular;
  const searching =
    trimmedQuery.length >= 3 && !placeId && resultsFor === trimmedQuery;
  const options = searching
    ? suggestions
    : matchingPopular.length > 0
      ? matchingPopular
      : popular;
  const showEmptyState = searching && suggestions.length === 0;

  /*
    A place is ours; a combobox option is the widget's. Projecting here rather
    than handing `PlaceSuggestion` to the component keeps the shared widget
    ignorant of hotels — which is what lets the flight form feed it airports.
  */
  const comboOptions: ComboboxOption[] = options.map((place) => ({
    id: place.id,
    label: place.name,
    detail: place.detail,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: FieldErrors = {};

    /*
      Three different failures, three different messages.

      "Pick one from the list" is only true when a list exists. Saying it to
      somebody whose search matched nothing blames them for ignoring options
      they were never shown — which is exactly what the empty-results panel
      above was added to stop.
    */
    if (!placeId && !(bookingConfig.callToBook && placeQuery.trim())) {
      if (!placeQuery.trim()) {
        next.place = copy.errors.placeEmpty;
      } else if (suggestions.length === 0) {
        next.place = copy.errors.placeNotFound(placeQuery.trim());
      } else {
        next.place = copy.errors.placePick;
      }
    }
    if (!checkIn) {
      next.checkIn = copy.errors.checkInMissing;
    } else if (checkIn < today()) {
      next.checkIn = copy.errors.datePassed;
    }
    if (!checkOut) {
      next.checkOut = copy.errors.checkOutMissing;
    } else if (checkIn && checkOut <= checkIn) {
      next.checkOut = copy.errors.checkOutOrder;
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    startNavigation(() => {
      router.push(
        hotelSearchHref({
          placeId,
          placeName: placeQuery,
          checkIn,
          checkOut,
          adults,
          children,
          rooms,
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
      aria-label={copy.ariaLabel}
      tone={tone}
      className={className}
    >
      <SearchQualifiers>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:ms-auto">
          <QuietSelect
            id={`${id}-rooms`}
            label={copy.roomsLabel}
            value={rooms}
            onChange={(value) => {
              const next = Number(value);
              setRooms(next);
              // Every room needs an adult; bumping rooms past the guest count
              // would otherwise fail validation the traveller cannot see.
              setAdults((current) => Math.max(current, next));
            }}
          >
            {Array.from({ length: MAX_ROOMS }, (_, index) => index + 1).map(
              (value) => (
                <option key={value} value={value}>
                  {copy.rooms(value)}
                </option>
              ),
            )}
          </QuietSelect>

          <QuietSelect
            id={`${id}-adults`}
            label={copy.adultsLabel}
            value={adults}
            onChange={(value) => setAdults(Number(value))}
          >
            {Array.from({ length: MAX_GUESTS }, (_, index) => index + 1).map(
              (value) => (
                <option key={value} value={value}>
                  {copy.adults(value)}
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
            {Array.from({ length: MAX_GUESTS }, (_, index) => index).map(
              (value) => (
                <option key={value} value={value}>
                  {copy.children(value)}
                </option>
              ),
            )}
          </QuietSelect>
        </div>
      </SearchQualifiers>

      {/*
        The row stops clipping while the destination listbox is open. Its
        `overflow-hidden` — which normally keeps the cells' hover backgrounds
        inside the rounded corners — also clips this dropdown, which is an
        absolutely-positioned descendant and therefore subject to an
        ancestor's overflow regardless of z-index.
      */}
      <SearchRow
        columns="lg:grid-cols-[1.9fr_1fr_1fr_auto]"
        overflow={open ? "visible" : "clip"}
      >
        <SearchCell
          htmlFor={`${id}-place`}
          label={copy.whereTo}
          invalid={Boolean(errors.place)}
          className="relative"
        >
          <Combobox
            id={`${id}-place`}
            listboxId={`${id}-places`}
            value={placeQuery}
            onValueChange={(next) => {
              setPlaceQuery(next);
              // Typing after a selection invalidates it — the id no longer
              // describes what is in the box.
              setPlaceId("");
            }}
            onSelect={(option) => {
              const place = options.find((entry) => entry.id === option.id);
              if (place) choose(place);
            }}
            options={comboOptions}
            open={open}
            onOpenChange={setOpen}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            placeholder={copy.placePlaceholder}
            invalid={Boolean(errors.place)}
            describedBy={errors.place ? `${id}-place-error` : undefined}
            icon={<MapPinIcon className="size-4" />}
            /*
              A heading only over the picklist. Search results do not need one
              — the box above says what was searched — but a list that appears
              on an empty field has to explain why it is there, or it reads as
              a stale dropdown.
            */
            heading={searching ? undefined : copy.popularHeading}
            /*
              The empty panel is the point. A combobox that simply shows
              nothing leaves the traveller unable to tell whether it is still
              loading, whether their spelling is wrong, or whether the
              destination is not covered — and the submit error ("pick one from
              the list") reads as nonsense when no list ever appeared.
            */
            emptyState={
              showEmptyState ? (
                <>
                  <p className="text-body-sm font-medium text-text">
                    {copy.emptyTitle(placeQuery.trim())}
                  </p>
                  <p className="mt-1 text-caption text-text-muted">
                    {bookingConfig.callToBook ? (
                      copy.emptyCallToBook
                    ) : (
                      <>
                        {copy.emptyHintBefore}
                        <a
                          href="#request"
                          className="font-medium text-primary underline underline-offset-2"
                        >
                          {copy.emptyHintLink}
                        </a>
                        {copy.emptyHintAfter}
                      </>
                    )}
                  </p>
                </>
              ) : undefined
            }
          />

          {loadingPlaces && (
            <span className="sr-only" role="status">
              {copy.searchingStatus}
            </span>
          )}
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-checkIn`}
          label={copy.checkIn}
          invalid={Boolean(errors.checkIn)}
        >
          <input
            id={`${id}-checkIn`}
            ref={checkInRef}
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            aria-invalid={Boolean(errors.checkIn) || undefined}
            className={panelInputClasses}
          />
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-checkOut`}
          label={copy.checkOut}
          invalid={Boolean(errors.checkOut)}
        >
          <input
            id={`${id}-checkOut`}
            type="date"
            min={checkIn || undefined}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            aria-invalid={Boolean(errors.checkOut) || undefined}
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
          >
            {bookingConfig.callToBook ? copy.submitQuote : copy.submitSearch}
          </Button>
        </div>
      </SearchRow>

      <SearchErrors idPrefix={id} errors={errorList} />
    </SearchPanel>
  );
}
