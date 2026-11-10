import Link from "next/link";

import { jetSearchHrefWith } from "@/features/private-jets/lib/jet-search-params";
import { JET_CATEGORY_ORDER, jetCategoryName } from "@/lib/providers/skyaccess";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { JetCategorySlug, JetFilters, JetSort } from "@/types/private-jet";

/**
 * Filters and sort for the jet results page.
 *
 * Every control is a link, and the whole panel is a Server Component with no
 * state and no JavaScript. That is possible because the filters are applied by
 * the supplier rather than by us — changing one is a new search, so it has to
 * be a new URL anyway, and a URL is something a link already is.
 *
 * It also means the filters work before hydration, survive a refresh, and can
 * be shared. The trade-off is a round trip per change, which on a supplier
 * that filters server-side was never avoidable.
 *
 * Only categories that are actually present in the current results are
 * offered. A filter that can only ever return nothing is worse than no filter.
 */
export function JetFiltersPanel({
  params,
  filters,
  sort,
  presentCategories,
  priceRange,
}: {
  /** The current URL's params, so each link can be built as a delta. */
  params: Record<string, string | string[] | undefined>;
  filters: JetFilters;
  sort: JetSort;
  /** Categories the supplier returned for this search. */
  presentCategories: readonly JetCategorySlug[];
  /** Full price span of the unfiltered search, in whole units of currency. */
  priceRange: { min: number; max: number } | null;
}) {
  const categories = JET_CATEGORY_ORDER.filter(
    (slug) => presentCategories.includes(slug) || filters.categories.includes(slug),
  );

  const toggleCategoryHref = (slug: JetCategorySlug) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((entry) => entry !== slug)
      : [...filters.categories, slug];

    return jetSearchHrefWith(params, {
      cat: next.length > 0 ? next.join(",") : null,
    });
  };

  /*
    Three bands rather than a slider. The supplier takes a min and a max and
    nothing in between, a slider needs JavaScript to be anything but a pair of
    number inputs, and on a spread this wide — often $900 to $84,000 — bands
    are the question a traveller is actually asking.
  */
  const priceBands = priceRange
    ? buildPriceBands(priceRange.min, priceRange.max)
    : [];

  const hasFilters =
    filters.categories.length > 0 || filters.minPrice !== null;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-overline uppercase text-text-muted">Refine</h2>
          {hasFilters && (
            <Link
              href={jetSearchHrefWith(params, { cat: null, min: null, max: null })}
              className="rounded text-caption font-semibold text-primary hover:underline focus-ring"
            >
              Clear all
            </Link>
          )}
        </div>
      </div>

      {/* ── Sort ───────────────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-body-sm font-semibold text-text">Sort by</legend>
        <ul className="mt-3 space-y-1">
          {(
            [
              ["departure", "Soonest departure"],
              ["price-asc", "Lowest price"],
              ["price-desc", "Highest price"],
            ] as ReadonlyArray<[JetSort, string]>
          ).map(([value, label]) => (
            <li key={value}>
              <Link
                href={jetSearchHrefWith(params, {
                  sort: value === "departure" ? null : value,
                })}
                aria-current={sort === value ? "true" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2 text-body-sm focus-ring",
                  sort === value
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-text-secondary hover:bg-gray-50",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* ── Aircraft category ──────────────────────────────────────────── */}
      {categories.length > 0 && (
        <fieldset>
          <legend className="text-body-sm font-semibold text-text">
            Aircraft category
          </legend>
          <ul className="mt-3 space-y-1">
            {categories.map((slug) => {
              const active = filters.categories.includes(slug);

              return (
                <li key={slug}>
                  <Link
                    href={toggleCategoryHref(slug)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm focus-ring",
                      active
                        ? "bg-primary-soft font-semibold text-primary"
                        : "text-text-secondary hover:bg-gray-50",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded border",
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-border",
                      )}
                    >
                      {active && (
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-2.5"
                        >
                          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
                        </svg>
                      )}
                    </span>
                    {jetCategoryName(slug)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      {/* ── Price ──────────────────────────────────────────────────────── */}
      {priceBands.length > 0 && (
        <fieldset>
          <legend className="text-body-sm font-semibold text-text">
            Price for the whole aircraft
          </legend>
          <ul className="mt-3 space-y-1">
            {priceBands.map((band) => {
              const active =
                filters.minPrice === band.min && filters.maxPrice === band.max;

              return (
                <li key={band.label}>
                  <Link
                    href={jetSearchHrefWith(
                      params,
                      active
                        ? { min: null, max: null }
                        : { min: String(band.min), max: String(band.max) },
                    )}
                    aria-pressed={active}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-body-sm tabular-nums focus-ring",
                      active
                        ? "bg-primary-soft font-semibold text-primary"
                        : "text-text-secondary hover:bg-gray-50",
                    )}
                  >
                    {band.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 px-3 text-caption text-text-muted">
            Estimates, not quotes. See the note under the results.
          </p>
        </fieldset>
      )}
    </div>
  );
}

/**
 * Split the search's own price span into three bands.
 *
 * Derived from the result set rather than hardcoded, because the sensible
 * bands for a light-jet search out of Dallas and a transatlantic heavy-jet
 * search share no numbers at all. Rounded to something a person would say.
 */
function buildPriceBands(
  min: number,
  max: number,
): Array<{ label: string; min: number; max: number }> {
  if (!(max > min)) return [];

  const round = (value: number) => {
    const step = value >= 50_000 ? 10_000 : value >= 10_000 ? 5_000 : 1_000;
    return Math.max(step, Math.round(value / step) * step);
  };

  const first = round(min + (max - min) / 3);
  const second = round(min + (2 * (max - min)) / 3);

  // Rounding can collapse two boundaries onto the same number on a narrow
  // spread, which would render two identical bands.
  if (first >= second) {
    return [
      { label: `Under ${money(first)}`, min: 0, max: first },
      { label: `${money(first)} and above`, min: first, max: Math.ceil(max) },
    ];
  }

  return [
    { label: `Under ${money(first)}`, min: 0, max: first },
    { label: `${money(first)} – ${money(second)}`, min: first, max: second },
    { label: `${money(second)} and above`, min: second, max: Math.ceil(max) },
  ];
}

function money(whole: number): string {
  return formatCurrency(whole * 100, "USD", { showCents: false });
}
