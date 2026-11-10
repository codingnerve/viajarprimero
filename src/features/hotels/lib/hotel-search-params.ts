import { bookingConfig } from "@/lib/config/booking";
import type {
  Hotel,
  HotelFilters,
  HotelSearchQuery,
  HotelSort,
} from "@/types/hotel";

/**
 * The URL is the search state.
 *
 * The form (client) and the results page (server) both go through this module,
 * so a hotel search is always shareable, bookmarkable and reloadable, and the
 * back button restores exactly what the traveller had — the same contract the
 * flight search keeps in `features/search/lib/search-params`.
 */

export const MAX_GUESTS = 16;
export const MAX_ROOMS = 8;

const SORTS: readonly HotelSort[] = [
  "recommended",
  "price-low",
  "price-high",
  "rating",
  "stars",
];

export const SORT_LABELS: Record<HotelSort, string> = {
  recommended: "Recommended",
  "price-low": "Price — lowest first",
  "price-high": "Price — highest first",
  rating: "Guest rating",
  stars: "Star rating",
};

export interface ParsedHotelSearch {
  query: HotelSearchQuery | null;
  /** Human-readable reasons the URL did not describe a valid search. */
  errors: string[];
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function first(
  raw: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = raw[key];
  return Array.isArray(value) ? value[0] : value;
}

function count(value: string | undefined, fallback: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
}

export function buildHotelSearchParams(
  query: HotelSearchQuery,
): URLSearchParams {
  const params = new URLSearchParams({
    placeId: query.placeId,
    place: query.placeName,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    adults: String(query.adults),
    rooms: String(query.rooms),
  });

  if (query.children > 0) params.set("children", String(query.children));
  return params;
}

export function hotelSearchHref(query: HotelSearchQuery): string {
  return `/hotels/search?${buildHotelSearchParams(query).toString()}`;
}

/**
 * Reads a search out of `searchParams`.
 *
 * Returns the reasons a search is invalid rather than silently substituting
 * defaults: quietly searching different dates than the ones in the URL is
 * worse than telling the traveller the link was incomplete.
 */
export function parseHotelSearch(
  raw: Record<string, string | string[] | undefined>,
): ParsedHotelSearch {
  const errors: string[] = [];

  const placeId = first(raw, "placeId") ?? "";
  const placeName = first(raw, "place") ?? "";
  const checkIn = first(raw, "checkIn") ?? "";
  const checkOut = first(raw, "checkOut") ?? "";

  // Booking by phone needs only the place as typed; a supplier search needs its id.
  if (!placeId && !(bookingConfig.callToBook && placeName.trim())) {
    errors.push("Choose a city or area to search.");
  }
  if (!checkIn || !isIsoDate(checkIn)) errors.push("Add a valid check-in date.");
  if (!checkOut || !isIsoDate(checkOut)) {
    errors.push("Add a valid check-out date.");
  } else if (checkIn && checkOut <= checkIn) {
    errors.push("The check-out date must be after the check-in date.");
  }

  const rooms = Math.max(1, count(first(raw, "rooms"), 1, MAX_ROOMS));
  const adults = Math.max(1, count(first(raw, "adults"), 2, MAX_GUESTS));
  const children = count(first(raw, "children"), 0, MAX_GUESTS);

  if (adults < rooms) {
    errors.push("Each room needs at least one adult.");
  }

  if (errors.length > 0) return { query: null, errors };

  return {
    query: { placeId, placeName, checkIn, checkOut, adults, children, rooms },
    errors: [],
  };
}

/** Filters and sort live in the URL too, so a filtered view is shareable. */
export function parseHotelFilters(
  raw: Record<string, string | string[] | undefined>,
): HotelFilters {
  const numbers = (key: string): number[] =>
    (first(raw, key) ?? "")
      .split(",")
      .map((entry) => Number.parseInt(entry, 10))
      .filter((entry) => Number.isFinite(entry));

  const maxPrice = Number.parseInt(first(raw, "maxPrice") ?? "", 10);
  const minRating = Number.parseFloat(first(raw, "minRating") ?? "");

  return {
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    minRating: Number.isFinite(minRating) && minRating > 0 ? minRating : undefined,
    stars: numbers("stars").filter((star) => star >= 1 && star <= 5),
    facilities: numbers("facilities"),
    freeCancellation: first(raw, "refundable") === "1",
  };
}

export function parseHotelSort(
  raw: Record<string, string | string[] | undefined>,
): HotelSort {
  const value = first(raw, "sort");
  return SORTS.includes(value as HotelSort) ? (value as HotelSort) : "recommended";
}

export function parseHotelPage(
  raw: Record<string, string | string[] | undefined>,
): number {
  const page = Number.parseInt(first(raw, "page") ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

/**
 * Filtering and sorting happen here rather than at the supplier.
 *
 * The supplier can filter by star and rating but not by "refundable" or by a
 * price ceiling, because price is only known after the separate rates call —
 * so applying the whole filter set locally is the only way it can be
 * consistent. It also means toggling a filter does not spend an API request,
 * which matters on a sandbox allowance.
 */
export function applyHotelFilters(
  hotels: readonly Hotel[],
  filters: HotelFilters,
): Hotel[] {
  return hotels.filter((hotel) => {
    if (filters.stars.length > 0 && !filters.stars.includes(Math.round(hotel.stars))) {
      return false;
    }
    if (filters.minRating !== undefined) {
      if (hotel.rating === null || hotel.rating < filters.minRating) return false;
    }
    if (filters.maxPrice !== undefined) {
      // A hotel with no price has no availability for these dates; a price
      // ceiling is a statement about price, so it cannot judge one.
      if (!hotel.price || hotel.price.total > filters.maxPrice) return false;
    }
    if (filters.freeCancellation && !hotel.price?.refundable) return false;
    if (filters.facilities.length > 0) {
      const owned = new Set(hotel.facilityIds);
      if (!filters.facilities.every((facility) => owned.has(facility))) return false;
    }
    return true;
  });
}

export function sortHotels(hotels: readonly Hotel[], sort: HotelSort): Hotel[] {
  const sorted = [...hotels];

  switch (sort) {
    case "price-low":
      // Unpriced hotels sink rather than sorting as zero — they are not the
      // cheapest thing on the page, they are unavailable.
      return sorted.sort(
        (a, b) => (a.price?.total ?? Infinity) - (b.price?.total ?? Infinity),
      );
    case "price-high":
      return sorted.sort(
        (a, b) => (b.price?.total ?? -1) - (a.price?.total ?? -1),
      );
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    case "stars":
      return sorted.sort((a, b) => b.stars - a.stars);
    case "recommended":
    default:
      /*
        "Recommended" is rating weighted by how many reviews stand behind it,
        with available properties ahead of unavailable ones. It is not a paid
        placement and nothing here is sponsored — if that ever changes, this
        sort has to be labelled as advertising rather than as a recommendation.
      */
      return sorted.sort((a, b) => {
        const available = Number(Boolean(b.price)) - Number(Boolean(a.price));
        if (available !== 0) return available;
        return recommendationScore(b) - recommendationScore(a);
      });
  }
}

function recommendationScore(hotel: Hotel): number {
  if (hotel.rating === null) return 0;
  // log10 so a hotel with 2,000 reviews outranks one with 20 at the same
  // score, without a chain of 50,000 reviews burying everything else.
  return hotel.rating * Math.log10(Math.max(10, hotel.reviewCount));
}

/** Nights between the two dates, for "total for N nights" copy. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const from = new Date(`${checkIn}T00:00:00Z`).getTime();
  const to = new Date(`${checkOut}T00:00:00Z`).getTime();
  const nights = Math.round((to - from) / 86_400_000);
  return nights > 0 ? nights : 1;
}
