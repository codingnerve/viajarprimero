import { JET_CATEGORY_ORDER } from "@/lib/providers/skyaccess";
import type {
  JetCategorySlug,
  JetFilters,
  JetSearchQuery,
  JetSort,
} from "@/types/private-jet";

/**
 * The private-jet search, as it lives in the URL.
 *
 * Everything the results page renders is derived from `searchParams` and
 * nothing is held in component state, so a search is a link: shareable,
 * bookmarkable, and correct on a hard refresh. The filters work the same way,
 * which is what lets the filter panel be a plain form with no client state at
 * all.
 */

export const MAX_JET_PASSENGERS = 19;

/** How far ahead the flexible-window search looks, in days. */
export const FLEX_WINDOW_DAYS = 7;

export interface ParsedJetSearch {
  query: JetSearchQuery | null;
  /** Why the URL did not describe a search. Shown rather than defaulted over. */
  errors: string[];
}

function first(
  raw: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = raw[key];
  return Array.isArray(value) ? value[0] : value;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Read a search out of `searchParams`.
 *
 * Returns the reasons a search is invalid rather than quietly substituting
 * defaults, for the same reason the hotel search does: searching different
 * dates than the ones in the link is worse than saying the link was
 * incomplete.
 *
 * A destination is deliberately *not* required. Empty legs are supply-led —
 * "get me out of New York in the next fortnight, I do not much mind where" is
 * a real way to buy one, and the supplier supports an empty destination.
 */
export function parseJetSearch(
  raw: Record<string, string | string[] | undefined>,
): ParsedJetSearch {
  const errors: string[] = [];

  const origin = (first(raw, "from") ?? "").trim();
  const destination = (first(raw, "to") ?? "").trim();
  const departOn = (first(raw, "depart") ?? "").trim();
  const passengers = Number(first(raw, "pax") ?? "");
  const flexible = first(raw, "flex") === "1";

  if (!origin) errors.push("Tell us where the flight should depart from.");
  if (!departOn || !isIsoDate(departOn)) {
    errors.push("Add a valid departure date.");
  }
  if (!Number.isInteger(passengers) || passengers < 1) {
    errors.push("Say how many people are travelling.");
  } else if (passengers > MAX_JET_PASSENGERS) {
    errors.push(
      `We handle up to ${MAX_JET_PASSENGERS} passengers here — for larger groups, ask us for a quote.`,
    );
  }

  if (errors.length > 0) return { query: null, errors };

  return {
    query: {
      origin,
      destination,
      departOn,
      departUntil: flexible ? addDays(departOn, FLEX_WINDOW_DAYS) : departOn,
      passengers,
    },
    errors: [],
  };
}

/** Whether the URL asked for the flexible window rather than one exact day. */
export function isFlexibleSearch(
  raw: Record<string, string | string[] | undefined>,
): boolean {
  return first(raw, "flex") === "1";
}

export function parseJetFilters(
  raw: Record<string, string | string[] | undefined>,
): JetFilters {
  const categoryValue = first(raw, "cat") ?? "";
  const categories = categoryValue
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug): slug is JetCategorySlug =>
      (JET_CATEGORY_ORDER as readonly string[]).includes(slug),
    );

  const min = Number(first(raw, "min") ?? "");
  const max = Number(first(raw, "max") ?? "");

  /*
    Both bounds or neither. The supplier ignores a half-open range silently,
    which reads to the traveller as a filter that did nothing — so a lone bound
    is discarded here, where it is visible, rather than there.
  */
  const bounded =
    Number.isFinite(min) && Number.isFinite(max) && min >= 0 && max > min;

  return {
    categories,
    minPrice: bounded ? Math.round(min) : null,
    maxPrice: bounded ? Math.round(max) : null,
  };
}

export function parseJetSort(
  raw: Record<string, string | string[] | undefined>,
): JetSort {
  const value = first(raw, "sort");
  return value === "price-asc" || value === "price-desc" || value === "departure"
    ? value
    : "departure";
}

/** The opaque supplier cursor, carried through the URL so paging is linkable. */
export function parseJetCursor(
  raw: Record<string, string | string[] | undefined>,
): string | null {
  const value = (first(raw, "cursor") ?? "").trim();
  return value.length > 0 ? value : null;
}

export interface JetSearchHrefInput {
  origin: string;
  destination: string;
  departOn: string;
  passengers: number;
  flexible?: boolean;
}

export function buildJetSearchParams(
  input: JetSearchHrefInput,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("from", input.origin);
  if (input.destination) params.set("to", input.destination);
  params.set("depart", input.departOn);
  params.set("pax", String(input.passengers));
  if (input.flexible) params.set("flex", "1");
  return params;
}

export function jetSearchHref(input: JetSearchHrefInput): string {
  return `/private-jets/search?${buildJetSearchParams(input).toString()}`;
}

/**
 * A link to the same search with some parameters changed.
 *
 * Used by every filter control and the sort select. Changing a filter always
 * drops the cursor — a cursor is a position in a result set that no longer
 * exists once the result set changes, and keeping it lands the traveller in
 * the middle of a list they have not seen the start of.
 */
export function jetSearchHrefWith(
  raw: Record<string, string | string[] | undefined>,
  changes: Record<string, string | null>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    params.set(key, Array.isArray(value) ? (value[0] ?? "") : value);
  }

  for (const [key, value] of Object.entries(changes)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }

  if (!("cursor" in changes)) params.delete("cursor");

  return `/private-jets/search?${params.toString()}`;
}
