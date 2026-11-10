"use client";

import {
  useId,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SearchIcon, SwapIcon } from "@/components/ui/icons";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type TripType = "return" | "one-way";

const tripTypes: ReadonlyArray<{ value: TripType; label: string }> = [
  { value: "return", label: "Return" },
  { value: "one-way", label: "One-way" },
];

/** yyyy-mm-dd in the visitor's own time zone, as a date input expects. */
function localIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const subscribeNever = () => () => {};
const localToday = () => localIsoDate(new Date());
const serverToday = () => "";

/**
 * Rail journey search.
 *
 * There is no results page: rail is quote-only, so for now the form collects
 * the journey and nothing else happens on submit. When a rail enquiry endpoint
 * exists, send the form values from `handleSubmit` — do not add a fare grid.
 */
export function RailSearch({
  title = "Search rail journeys",
  subtitle = "Compare train routes, flexible dates and passenger options for city-to-city travel.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const id = useId();
  const [tripType, setTripType] = useState<TripType>("return");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // Empty during server render and hydration, then the visitor's local date —
  // a `min` computed during render would differ between the two.
  const today = useSyncExternalStore(subscribeNever, localToday, serverToday);
  const [departDate, setDepartDate] = useState("");

  const oneWay = tripType === "one-way";
  const ids = {
    from: `${id}-from`,
    to: `${id}-to`,
    depart: `${id}-depart`,
    return: `${id}-return`,
    travellers: `${id}-travellers`,
    title: `${id}-title`,
  };

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      aria-labelledby={ids.title}
      className="rounded-2xl bg-surface p-5 shadow-lg ring-1 ring-inset ring-border md:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id={ids.title} className="text-h3 text-text">
            {title}
          </h2>
          <p className="mt-1 max-w-xl text-body-sm text-text-secondary">
            {subtitle}
          </p>
        </div>

        <fieldset className="flex rounded-full bg-gray-100 p-1">
          <legend className="sr-only">Trip type</legend>
          {tripTypes.map((option) => (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-body-sm font-medium text-text-secondary",
                "transition-colors duration-[var(--duration-fast)]",
                "has-[:checked]:bg-primary has-[:checked]:text-text-inverse",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
              )}
            >
              <input
                type="radio"
                name={`${id}-trip`}
                value={option.value}
                checked={tripType === option.value}
                onChange={() => setTripType(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <Field htmlFor={ids.from} label="From" required>
            <Input
              id={ids.from}
              name="from"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder="City or station"
              autoComplete="off"
              required
            />
          </Field>

          <button
            type="button"
            onClick={swap}
            aria-label="Swap From and To"
            className="grid size-11 shrink-0 place-items-center justify-self-center rounded-full bg-primary-soft text-primary transition-colors hover:bg-primary/15 focus-ring md:mb-1"
          >
            <SwapIcon className="size-5 rotate-90 md:rotate-0" />
          </button>

          <Field htmlFor={ids.to} label="To" required>
            <Input
              id={ids.to}
              name="to"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="City or station"
              autoComplete="off"
              required
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-start">
          <Field htmlFor={ids.depart} label="Depart" required>
            <Input
              id={ids.depart}
              name="depart"
              type="date"
              min={today || undefined}
              value={departDate}
              onChange={(event) => setDepartDate(event.target.value)}
              required
            />
          </Field>

          <Field
            htmlFor={ids.return}
            label="Return"
            required={!oneWay}
            hint={oneWay ? "Not needed for one-way" : undefined}
          >
            <Input
              id={ids.return}
              name="return"
              type="date"
              min={departDate || today || undefined}
              disabled={oneWay}
              required={!oneWay}
              aria-describedby={oneWay ? `${ids.return}-hint` : undefined}
            />
          </Field>

          <Field htmlFor={ids.travellers} label="Travellers" required>
            <Select id={ids.travellers} name="travellers" defaultValue="1">
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </Select>
          </Field>

          <Button
            type="submit"
            variant="accent"
            size="md"
            icon={<SearchIcon className="size-5" />}
            className="w-full self-end lg:w-auto"
          >
            Search
          </Button>
        </div>
      </form>

      <p className="mt-5 text-caption text-text-muted">
        Rail searches are sent to our team as a request. Fares and schedules are
        confirmed with you before anything is booked, and no payment is taken on
        this website.
      </p>
    </section>
  );
}
