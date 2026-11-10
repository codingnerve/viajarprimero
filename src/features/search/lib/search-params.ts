import { getAirport } from "@/lib/content/airports";
import type {
  CabinClass,
  FlightSearchQuery,
  PassengerCounts,
  TripType,
} from "@/types/flight";

/**
 * The URL is the search state.
 *
 * Both the form (client) and the results page (server) go through this module,
 * so a search is always shareable, bookmarkable and reloadable — and the back
 * button restores exactly what the traveller had.
 */

const TRIP_TYPES: readonly TripType[] = ["round-trip", "one-way", "multi-city"];
const CABINS: readonly CabinClass[] = [
  "economy",
  "premium-economy",
  "business",
  "first",
];

export const MAX_PASSENGERS = 9;

export interface ParsedSearch {
  query: FlightSearchQuery | null;
  /** Human-readable reasons the URL did not describe a valid search. */
  errors: string[];
}

function parseCount(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

export function buildSearchParams(query: FlightSearchQuery): URLSearchParams {
  const params = new URLSearchParams({
    trip: query.tripType,
    from: query.origin,
    to: query.destination,
    depart: query.departDate,
    adults: String(query.passengers.adults),
    cabin: query.cabin,
  });

  if (query.returnDate) params.set("return", query.returnDate);
  if (query.passengers.children > 0) {
    params.set("children", String(query.passengers.children));
  }
  if (query.passengers.infants > 0) {
    params.set("infants", String(query.passengers.infants));
  }

  return params;
}

export function searchHref(query: FlightSearchQuery): string {
  return `/search?${buildSearchParams(query).toString()}`;
}

/**
 * Reads a search out of `searchParams`.
 *
 * Returns the reasons a search is invalid rather than silently substituting
 * defaults: quietly searching a different route than the one in the URL is
 * worse than telling the traveller the link was incomplete.
 */
export function parseSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedSearch {
  const first = (key: string): string | undefined => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const errors: string[] = [];

  const tripTypeRaw = first("trip") ?? "round-trip";
  const tripType = TRIP_TYPES.includes(tripTypeRaw as TripType)
    ? (tripTypeRaw as TripType)
    : "round-trip";

  const origin = (first("from") ?? "").toUpperCase();
  const destination = (first("to") ?? "").toUpperCase();
  const departDate = first("depart") ?? "";
  const returnDate = first("return");

  if (!origin || !destination) {
    errors.push("Add both a departure and a destination airport.");
  } else {
    if (!getAirport(origin)) {
      errors.push(`We do not recognise the airport code "${origin}".`);
    }
    if (!getAirport(destination)) {
      errors.push(`We do not recognise the airport code "${destination}".`);
    }
    if (origin === destination) {
      errors.push("Departure and destination must be different airports.");
    }
  }

  if (!departDate || !isIsoDate(departDate)) {
    errors.push("Add a valid departure date.");
  }

  if (tripType === "round-trip") {
    if (!returnDate || !isIsoDate(returnDate)) {
      errors.push("A return trip needs a valid return date.");
    } else if (departDate && returnDate < departDate) {
      errors.push("The return date cannot be before the departure date.");
    }
  }

  const cabinRaw = first("cabin") ?? "economy";
  const cabin = CABINS.includes(cabinRaw as CabinClass)
    ? (cabinRaw as CabinClass)
    : "economy";

  const passengers: PassengerCounts = {
    adults: Math.min(Math.max(parseCount(first("adults"), 1), 1), MAX_PASSENGERS),
    children: Math.min(parseCount(first("children"), 0), MAX_PASSENGERS),
    infants: Math.min(parseCount(first("infants"), 0), MAX_PASSENGERS),
  };

  if (passengers.adults + passengers.children > MAX_PASSENGERS) {
    errors.push(
      `We can search for up to ${MAX_PASSENGERS} passengers at a time. For larger groups, contact us directly.`,
    );
  }

  if (passengers.infants > passengers.adults) {
    errors.push(
      "Each infant travelling on a lap must be accompanied by an adult.",
    );
  }

  if (errors.length > 0) return { query: null, errors };

  return {
    query: {
      tripType,
      origin,
      destination,
      departDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers,
      cabin,
    },
    errors: [],
  };
}

/** "2 adults, 1 child" — for headings and summaries. */
export function describePassengers(passengers: PassengerCounts): string {
  const parts: string[] = [
    `${passengers.adults} ${passengers.adults === 1 ? "adult" : "adults"}`,
  ];

  if (passengers.children > 0) {
    parts.push(
      `${passengers.children} ${passengers.children === 1 ? "child" : "children"}`,
    );
  }
  if (passengers.infants > 0) {
    parts.push(
      `${passengers.infants} ${passengers.infants === 1 ? "infant" : "infants"}`,
    );
  }

  return parts.join(", ");
}
