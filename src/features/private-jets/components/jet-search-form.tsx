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
import {
  FLEX_WINDOW_DAYS,
  jetSearchHref,
  MAX_JET_PASSENGERS,
} from "@/features/private-jets/lib/jet-search-params";
import type { JetHub } from "@/types/private-jet";

interface FieldErrors {
  from?: string;
  depart?: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Private-jet search.
 *
 * Built on the same panel parts as the flight and hotel searches, and
 * deliberately shorter than either: from, to, one date, how many people. A
 * charter search has no cabin class, no return leg and no room count, and
 * padding it out to match the other tabs would be inventing decisions the
 * traveller does not have to make.
 *
 * **There is no return date, by design.** Private charter is priced and sold
 * one leg at a time — the aircraft does not wait for you unless you pay for it
 * to, and a round trip is two searches with two separate prices. A return
 * field here would imply a product that does not exist at this price.
 *
 * The destination is optional. Most of what comes back is empty legs, which
 * are supply-led: "out of New York some time next week, I do not much mind
 * where" is a real and often much cheaper way to buy one, so leaving the field
 * blank searches everywhere rather than refusing.
 *
 * Both place fields are free text over a picklist rather than a closed list.
 * The marketplace resolves place names generously and has no autocomplete
 * endpoint, so the suggestions are a shortcut to the hubs with the most
 * traffic — never a limit on what can be searched.
 */
export function JetSearchForm({
  hubs,
  initial,
  className,
  tone = "panel",
}: {
  hubs: readonly JetHub[];
  initial?: Partial<{
    origin: string;
    destination: string;
    departOn: string;
    passengers: number;
    flexible: boolean;
  }>;
  className?: string;
  tone?: SearchPanelTone;
}) {
  const router = useRouter();
  const id = useId();

  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [destination, setDestination] = useState(initial?.destination ?? "");
  const [departOn, setDepartOn] = useState(initial?.departOn ?? "");
  const [passengers, setPassengers] = useState(initial?.passengers ?? 4);
  const [flexible, setFlexible] = useState(initial?.flexible ?? true);

  /*
    One open-state across both place fields, so opening "To" closes "From"
    rather than stacking two panels over each other.
  */
  const [openField, setOpenField] = useState<"origin" | "destination" | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(-1);

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

  // Set after mount rather than rendered into the HTML: the server and the
  // browser can disagree about what "today" is across a timezone boundary,
  // and a date baked into prerendered markup goes stale.
  useEffect(() => {
    departRef.current?.setAttribute("min", today());
  }, []);

  const optionsFor = (value: string): ComboboxOption[] => {
    const needle = value.trim().toLowerCase();

    const matches = needle
      ? hubs.filter(
          (hub) =>
            hub.label.toLowerCase().includes(needle) ||
            hub.detail.toLowerCase().includes(needle) ||
            hub.query.toLowerCase().includes(needle),
        )
      : hubs;

    return matches.slice(0, 8).map((hub) => ({
      id: hub.query,
      label: hub.label,
      detail: hub.detail,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: FieldErrors = {};

    if (!origin.trim()) next.from = "Where does the flight depart from?";
    if (!departOn) {
      next.depart = "Add a departure date.";
    } else if (departOn < today()) {
      next.depart = "That date has passed.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    startNavigation(() => {
      router.push(
        jetSearchHref({
          origin: origin.trim(),
          destination: destination.trim(),
          departOn,
          passengers,
          flexible,
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
      aria-label="Private jet search"
      tone={tone}
      className={className}
    >
      <SearchQualifiers>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:ms-auto">
          {/*
            Flexibility is a qualifier rather than a second date field because
            it is how this product is actually bought. An empty leg on one
            named day is a lottery; the same search across a week is the
            difference between nothing and a page of options — so it defaults
            on, and says plainly what it does.
          */}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-body-sm font-medium text-text-secondary hover:bg-gray-50">
            <input
              type="checkbox"
              checked={flexible}
              onChange={(event) => setFlexible(event.target.checked)}
              className="size-4 rounded border-border text-primary focus-ring"
            />
            Flexible by {FLEX_WINDOW_DAYS} days
          </label>

          <QuietSelect
            id={`${id}-passengers`}
            label="Passengers"
            value={passengers}
            onChange={(value) => setPassengers(Number(value))}
          >
            {Array.from({ length: MAX_JET_PASSENGERS }, (_, i) => i + 1).map(
              (value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "passenger" : "passengers"}
                </option>
              ),
            )}
          </QuietSelect>
        </div>
      </SearchQualifiers>

      {/*
        The row stops clipping while a picklist is open — its `overflow-hidden`
        keeps the cells' hover backgrounds inside the rounded corners but also
        clips an absolutely-positioned dropdown regardless of z-index.
      */}
      <SearchRow
        columns="lg:grid-cols-[1.3fr_1.3fr_1fr_auto]"
        overflow={openField ? "visible" : "clip"}
      >
        <SearchCell
          htmlFor={`${id}-from`}
          label="From"
          invalid={Boolean(errors.from)}
          className="relative"
        >
          <Combobox
            id={`${id}-from`}
            listboxId={`${id}-from-list`}
            value={origin}
            onValueChange={setOrigin}
            onSelect={(option) => {
              setOrigin(option.id);
              setOpenField(null);
              setActiveIndex(-1);
              setErrors((current) => ({ ...current, from: undefined }));
            }}
            options={optionsFor(origin)}
            open={openField === "origin"}
            onOpenChange={(next) => setOpenField(next ? "origin" : null)}
            activeIndex={openField === "origin" ? activeIndex : -1}
            onActiveIndexChange={setActiveIndex}
            placeholder="City or airport"
            invalid={Boolean(errors.from)}
            describedBy={errors.from ? `${id}-from-error` : undefined}
            icon={<MapPinIcon className="size-4" />}
            heading={origin.trim() ? undefined : "Private aviation hubs"}
            emptyState={
              <p className="text-body-sm text-text">
                No hub matches “{origin.trim()}” — we will search it anyway.
              </p>
            }
          />
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-to`}
          label="To (optional)"
          className="relative"
        >
          <Combobox
            id={`${id}-to`}
            listboxId={`${id}-to-list`}
            value={destination}
            onValueChange={setDestination}
            onSelect={(option) => {
              setDestination(option.id);
              setOpenField(null);
              setActiveIndex(-1);
            }}
            options={optionsFor(destination)}
            open={openField === "destination"}
            onOpenChange={(next) => setOpenField(next ? "destination" : null)}
            activeIndex={openField === "destination" ? activeIndex : -1}
            onActiveIndexChange={setActiveIndex}
            placeholder="Anywhere"
            icon={<MapPinIcon className="size-4" />}
            heading={destination.trim() ? undefined : "Popular arrivals"}
            emptyState={
              <p className="text-body-sm text-text">
                No hub matches “{destination.trim()}” — we will search it anyway.
              </p>
            }
          />
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-depart`}
          label="Departure"
          invalid={Boolean(errors.depart)}
        >
          <input
            id={`${id}-depart`}
            ref={departRef}
            type="date"
            value={departOn}
            onChange={(event) => setDepartOn(event.target.value)}
            aria-invalid={Boolean(errors.depart) || undefined}
            className={panelInputClasses}
          />
        </SearchCell>

        <div className="p-2 lg:p-2.5">
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            fullWidth
            className="rounded-xs! lg:h-full lg:min-w-48"
          >
            {bookingConfig.callToBook
              ? "Get a charter quote"
              : "Search private jets"}
          </Button>
        </div>
      </SearchRow>

      <SearchErrors idPrefix={id} errors={errorList} />
    </SearchPanel>
  );
}
