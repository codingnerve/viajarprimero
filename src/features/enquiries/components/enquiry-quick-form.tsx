"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { CarIcon, MapPinIcon } from "@/components/ui/icons";
import {
  panelInputClasses,
  SearchCell,
  SearchErrors,
  SearchPanel,
  SearchRow,
  type SearchPanelTone,
} from "@/components/ui/search-panel";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import {
  filterPicklist,
  picklistOptions,
} from "@/features/enquiries/lib/picklist";
import {
  enquiryHref,
  type EnquirySeed,
} from "@/features/enquiries/lib/enquiry-link";
import { verticalCopy } from "@/features/enquiries/lib/enquiry";
import { quickFormCopy } from "@/features/enquiries/lib/quick-form-copy";
import type { EnquiryVertical } from "@/features/enquiries/types";
import type { Locale } from "@/types/locale";

type Errors = Partial<Record<keyof EnquirySeed, string>>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * The short front end of a quote request.
 *
 * It asks only where and when, then hands those answers to the vertical's own
 * page where the full form finishes the job. A hotel or cruise request needs a
 * name, an email and a consent checkbox, and none of those belong in a hero
 * next to a three-field flight search — but neither should hotels, cars,
 * cruises and jets be reduced to a link while flights get a form.
 *
 * It used to ask for travellers too. That row is gone: a party size is not
 * what a traveller comes to a hero to choose, the full form asks for it
 * anyway, and carrying a count nobody consciously picked into the next form's
 * URL made it look chosen. Only the flight tab keeps its qualifiers, because
 * cabin and passenger count genuinely change what a flight *search* returns —
 * these start a written quote, where they do not.
 *
 * Which cells appear is driven entirely by `verticalCopy`, so the panel and
 * the full form cannot disagree about what a vertical asks. Cruises get a
 * departure port and a region, both as picklists and neither of them free
 * text; car rental gets a state, two dates and a vehicle class.
 *
 * Nothing here is validated as though it were the real submission. The full
 * form on the landing page holds the rules that actually gate a request.
 *
 * It is still built from the same panel parts as the flight search, so the
 * journey row keeps its shape across all five hero tabs.
 */
export function EnquiryQuickForm({
  vertical,
  className,
  tone = "panel",
  locale = "en",
}: {
  vertical: EnquiryVertical;
  className?: string;
  tone?: SearchPanelTone;
  locale?: Locale;
}) {
  const router = useRouter();
  const id = useId();
  /* `spec` decides which cells exist; `copy` and `text` supply the words. */
  const spec = verticalCopy[vertical];
  const copy = quickFormCopy[locale];
  const text = copy.verticals[vertical];

  /* Only the verticals whose copy declares a picklist ask for a second place. */
  const originPicklist = spec.origin?.options;

  /*
    Built once per render from the copy, not held in state: they are
    constants, and the filter below is what actually varies.
  */
  const originOptions: ComboboxOption[] = originPicklist
    ? picklistOptions(originPicklist)
    : [];
  const destinationOptions: ComboboxOption[] = spec.destinationOptions
    ? picklistOptions(spec.destinationOptions)
    : [];
  const vehicleOptions: ComboboxOption[] = spec.vehicle
    ? picklistOptions(spec.vehicle.options)
    : [];

  const [origin, setOrigin] = useState("");
  const [carType, setCarType] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  /*
    One open-state across both place fields, so opening one closes the
    other rather than stacking two lists over each other.
  */
  const [openField, setOpenField] = useState<
    "origin" | "destination" | "vehicle" | null
  >(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(-1);

  /*
    Pending state belongs to the navigation. A boolean set before `router.push`
    has nothing to clear it — see the same note on the three search forms.
  */
  const [submitting, startNavigation] = useTransition();

  const startRef = useRef<HTMLInputElement>(null);

  // Set after mount for the same reason the flight form does: a date baked
  // into prerendered markup either mismatches on hydration across a timezone
  // boundary or goes stale in a statically generated page.
  useEffect(() => {
    startRef.current?.setAttribute("min", today());
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: Errors = {};

    if (originPicklist && spec.origin?.required && !origin.trim()) {
      next.origin = text.origin?.missing;
    }
    if (spec.vehicle && !carType.trim()) {
      next.carType = text.vehicle?.missing;
    }
    if (!destination.trim()) {
      next.destination = text.destinationMissing;
    }
    if (!startDate) {
      next.startDate = text.startMissing;
    } else if (startDate < today()) {
      next.startDate = copy.datePassed;
    }
    // Verticals with no second date have no second date to validate.
    if (spec.end && text.end) {
      if (!endDate) {
        next.endDate = text.end.missing;
      } else if (startDate && endDate < startDate) {
        next.endDate = text.end.beforeStart;
      }
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    startNavigation(() => {
      router.push(
        enquiryHref(vertical, {
          origin,
          destination,
          startDate,
          endDate,
          carType,
        }),
      );
    });
  };

  const errorList = Object.entries(errors).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  /*
    The track has to match the cells that actually render, or the row leaves a
    gap where a field the vertical does not ask for used to be.
  */
  const columns = originPicklist
    ? spec.end
      ? "lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]"
      : "lg:grid-cols-[1.4fr_1.4fr_1fr_auto]"
    : spec.vehicle
      ? "lg:grid-cols-[1.3fr_1fr_1fr_1.2fr_auto]"
      : spec.end
        ? "lg:grid-cols-[1.9fr_1fr_1fr_auto]"
        : "lg:grid-cols-[2.2fr_1fr_auto]";

  return (
    <SearchPanel
      onSubmit={handleSubmit}
      aria-label={text.ariaLabel}
      tone={tone}
      className={className}
    >
      {/*
        The row stops clipping while a picklist is open. Its `overflow-hidden`
        keeps the cells' hover backgrounds inside the rounded corners but also
        clips an absolutely-positioned dropdown regardless of z-index.
      */}
      <SearchRow
        columns={columns}
        overflow={openField ? "visible" : "clip"}
      >
        {originPicklist && spec.origin && text.origin && (
          <SearchCell
            htmlFor={`${id}-origin`}
            label={text.origin.question}
            invalid={Boolean(errors.origin)}
            className="relative"
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
              options={filterPicklist(originOptions, origin)}
              open={openField === "origin"}
              onOpenChange={(next) => setOpenField(next ? "origin" : null)}
              activeIndex={openField === "origin" ? activeIndex : -1}
              onActiveIndexChange={setActiveIndex}
              placeholder={text.origin.placeholder}
              invalid={Boolean(errors.origin)}
              describedBy={errors.origin ? `${id}-origin-error` : undefined}
              icon={<MapPinIcon className="size-4" />}
              emptyState={
                <p className="text-body-sm text-text">
                  {copy.noPortMatch(origin.trim())}
                </p>
              }
            />
          </SearchCell>
        )}

        <SearchCell
          htmlFor={`${id}-destination`}
          label={text.destinationLabel}
          invalid={Boolean(errors.destination)}
          className="relative"
        >
          {spec.destinationOptions ? (
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
              options={filterPicklist(destinationOptions, destination)}
              open={openField === "destination"}
              onOpenChange={(next) =>
                setOpenField(next ? "destination" : null)
              }
              activeIndex={openField === "destination" ? activeIndex : -1}
              onActiveIndexChange={setActiveIndex}
              placeholder={text.destinationPlaceholder}
              invalid={Boolean(errors.destination)}
              describedBy={
                errors.destination ? `${id}-destination-error` : undefined
              }
              icon={<MapPinIcon className="size-4" />}
              emptyState={
                <p className="text-body-sm text-text">
                  {copy.noRegionMatch(destination.trim())}
                </p>
              }
            />
          ) : (
            <input
              id={`${id}-destination`}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder={text.destinationPlaceholder}
              autoComplete="off"
              aria-invalid={Boolean(errors.destination) || undefined}
              aria-describedby={
                errors.destination ? `${id}-destination-error` : undefined
              }
              className={panelInputClasses}
            />
          )}
        </SearchCell>

        <SearchCell
          htmlFor={`${id}-startDate`}
          label={text.startLabel}
          invalid={Boolean(errors.startDate)}
        >
          <input
            id={`${id}-startDate`}
            ref={startRef}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            aria-invalid={Boolean(errors.startDate) || undefined}
            aria-describedby={
              errors.startDate ? `${id}-startDate-error` : undefined
            }
            className={panelInputClasses}
          />
        </SearchCell>

        {spec.end && text.end && (
          <SearchCell
            htmlFor={`${id}-endDate`}
            label={text.end.label}
            invalid={Boolean(errors.endDate)}
          >
            <input
              id={`${id}-endDate`}
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              aria-invalid={Boolean(errors.endDate) || undefined}
              aria-describedby={
                errors.endDate ? `${id}-endDate-error` : undefined
              }
              className={panelInputClasses}
            />
          </SearchCell>
        )}

        {spec.vehicle && text.vehicle && (
          <SearchCell
            htmlFor={`${id}-carType`}
            label={text.vehicle.label}
            invalid={Boolean(errors.carType)}
            className="relative"
          >
            <Combobox
              id={`${id}-carType`}
              listboxId={`${id}-carType-list`}
              value={carType}
              onValueChange={setCarType}
              onSelect={(option) => {
                setCarType(option.label);
                setOpenField(null);
                setActiveIndex(-1);
              }}
              options={filterPicklist(vehicleOptions, carType)}
              open={openField === "vehicle"}
              onOpenChange={(next) => setOpenField(next ? "vehicle" : null)}
              activeIndex={openField === "vehicle" ? activeIndex : -1}
              onActiveIndexChange={setActiveIndex}
              placeholder={text.vehicle.placeholder}
              invalid={Boolean(errors.carType)}
              describedBy={
                errors.carType ? `${id}-carType-error` : undefined
              }
              icon={<CarIcon className="size-4" />}
              emptyState={
                <p className="text-body-sm text-text">
                  {copy.noClassMatch(carType.trim())}
                </p>
              }
            />
          </SearchCell>
        )}

        <div className="p-2 lg:p-2.5">
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            fullWidth
            className="rounded-xs! lg:h-full lg:min-w-36"
          >
            {copy.submit}
          </Button>
        </div>
      </SearchRow>

      <SearchErrors idPrefix={id} errors={errorList} />

      <p className="mt-3 px-1 text-caption text-text-muted">
        {copy.disclaimer}
      </p>
    </SearchPanel>
  );
}
