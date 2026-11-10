"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { Checkbox } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/format-currency";
import { SORT_LABELS } from "@/features/hotels/lib/hotel-search-params";
import { cn } from "@/lib/utils/cn";
import type { HotelFilters, HotelSort } from "@/types/hotel";

/**
 * Filters and sort for the results page.
 *
 * Every control writes to the URL rather than to local state. That is what
 * makes a filtered view shareable and the back button meaningful, and it is
 * why filtering costs no supplier request: the page re-renders on the server
 * from the same cached content, and `applyHotelFilters` does the work.
 *
 * `useTransition` keeps the current results on screen and readable while the
 * new ones load, instead of blanking the list on every checkbox.
 */
export function HotelFiltersPanel({
  filters,
  sort,
  facets,
  currency,
  priceCeiling,
}: {
  filters: HotelFilters;
  sort: HotelSort;
  /** Facilities actually present in this result set, with counts. */
  facets: ReadonlyArray<{ id: number; name: string; count: number }>;
  currency: string;
  /** Highest price in the unfiltered set, in minor units. */
  priceCeiling: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useId();
  const [pending, startTransition] = useTransition();

  // Mirrors the slider while dragging so it stays responsive; the URL is only
  // written on release.
  const [priceDraft, setPriceDraft] = useState(filters.maxPrice ?? priceCeiling);

  const commit = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    // Any filter change invalidates the page cursor — page 3 of the old
    // result set is not page 3 of the new one.
    params.delete("page");
    startTransition(() => {
      router.replace(`/hotels/search?${params.toString()}`, { scroll: false });
    });
  };

  const toggleInList = (key: string, value: number) => {
    commit((params) => {
      const current = (params.get(key) ?? "")
        .split(",")
        .filter(Boolean)
        .map(Number);
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];

      if (next.length > 0) params.set(key, next.join(","));
      else params.delete(key);
    });
  };

  const activeCount =
    filters.stars.length +
    filters.facilities.length +
    (filters.minRating ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.freeCancellation ? 1 : 0);

  return (
    <div
      className={cn(
        "space-y-8 transition-opacity",
        pending && "pointer-events-none opacity-60",
      )}
      aria-busy={pending}
    >
      {/* Sort. A select rather than a row of pills: five options do not fit a
          sidebar, and this is a single choice from a known list. */}
      <section>
        <label
          htmlFor={`${id}-sort`}
          className="text-overline uppercase text-text-muted"
        >
          Sort by
        </label>
        <select
          id={`${id}-sort`}
          value={sort}
          onChange={(event) =>
            commit((params) => {
              if (event.target.value === "recommended") params.delete("sort");
              else params.set("sort", event.target.value);
            })
          }
          className={cn(
            "mt-2 h-11 w-full cursor-pointer appearance-none rounded-lg bg-surface px-3 pr-9",
            "text-body-sm font-medium text-text ring-1 ring-inset ring-border-strong",
            "bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat focus-ring",
            "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23626e80%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')]",
          )}
        >
          {(Object.keys(SORT_LABELS) as HotelSort[]).map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
      </section>

      <section className="border-t border-border pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-overline uppercase text-text-muted">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() =>
                commit((params) => {
                  for (const key of [
                    "stars",
                    "facilities",
                    "minRating",
                    "maxPrice",
                    "refundable",
                  ]) {
                    params.delete(key);
                  }
                  setPriceDraft(priceCeiling);
                })
              }
              className="rounded-sm text-caption font-semibold text-primary underline-offset-4 hover:underline focus-ring"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>
      </section>

      {/* Price ceiling. Committed on release rather than on every input event,
          which would push a history entry per pixel dragged. */}
      {priceCeiling > 0 && (
        <section>
          <label
            htmlFor={`${id}-price`}
            className="flex items-baseline justify-between gap-2"
          >
            <span className="text-h6 text-text">Max price</span>
            <span className="text-caption tabular-nums text-text-secondary">
              {formatCurrency(priceDraft, currency)}
            </span>
          </label>
          <input
            id={`${id}-price`}
            type="range"
            min={0}
            max={priceCeiling}
            step={Math.max(1000, Math.round(priceCeiling / 50))}
            value={priceDraft}
            onChange={(event) => setPriceDraft(Number(event.target.value))}
            onPointerUp={() =>
              commit((params) => {
                if (priceDraft >= priceCeiling) params.delete("maxPrice");
                else params.set("maxPrice", String(priceDraft));
              })
            }
            onKeyUp={() =>
              commit((params) => {
                if (priceDraft >= priceCeiling) params.delete("maxPrice");
                else params.set("maxPrice", String(priceDraft));
              })
            }
            className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-primary)] focus-ring"
          />
          <p className="mt-1.5 text-caption text-text-muted">
            Total for the whole stay.
          </p>
        </section>
      )}

      <FilterGroup title="Star rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <Option
            key={star}
            id={`${id}-star-${star}`}
            checked={filters.stars.includes(star)}
            onChange={() => toggleInList("stars", star)}
            label={
              <span className="text-accent" aria-label={`${star} star`}>
                {"★".repeat(star)}
              </span>
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Guest rating">
        {[9, 8, 7, 6].map((score) => (
          <Option
            key={score}
            id={`${id}-rating-${score}`}
            checked={filters.minRating === score}
            onChange={() =>
              commit((params) => {
                if (filters.minRating === score) params.delete("minRating");
                else params.set("minRating", String(score));
              })
            }
            label={`${score}+ ${ratingWord(score)}`}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Booking options">
        <Option
          id={`${id}-refundable`}
          checked={filters.freeCancellation}
          onChange={() =>
            commit((params) => {
              if (filters.freeCancellation) params.delete("refundable");
              else params.set("refundable", "1");
            })
          }
          label="Free cancellation"
        />
      </FilterGroup>

      {facets.length > 0 && (
        <FilterGroup title="Amenities">
          {facets.map((facet) => (
            <Option
              key={facet.id}
              id={`${id}-facility-${facet.id}`}
              checked={filters.facilities.includes(facet.id)}
              onChange={() => toggleInList("facilities", facet.id)}
              label={facet.name}
              count={facet.count}
            />
          ))}
        </FilterGroup>
      )}
    </div>
  );
}

function ratingWord(score: number): string {
  if (score >= 9) return "exceptional";
  if (score >= 8) return "very good";
  if (score >= 7) return "good";
  return "pleasant";
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6">
      <h3 className="text-h6 text-text">{title}</h3>
      <div className="mt-3 space-y-1">{children}</div>
    </section>
  );
}

function Option({
  id,
  checked,
  onChange,
  label,
  count,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  count?: number;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-9 cursor-pointer items-center gap-3 rounded-md px-1 text-body-sm text-text-secondary hover:text-text"
    >
      <Checkbox id={id} checked={checked} onChange={onChange} className="mt-0" />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-caption tabular-nums text-text-muted">{count}</span>
      )}
    </label>
  );
}
