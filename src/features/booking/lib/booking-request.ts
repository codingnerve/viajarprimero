import { getAirport } from "@/lib/content/airports";
import type { CabinClass, TripType } from "@/types/flight";

/**
 * A traveller's request for a quoted itinerary.
 *
 * This is not a booking and must never be described as one: no seat is held,
 * no fare is guaranteed and no payment is taken. Overstating what a form
 * submission achieves is a misrepresentation, so the wording around this type
 * — in the UI and in the confirmation — stays deliberately plain.
 */
export interface BookingRequest {
  tripType: TripType;
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  cabin: CabinClass;
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
  /** Explicit opt-in. Never pre-checked, never bundled with the Terms. */
  marketingOptIn: boolean;
  /** Acceptance of the Terms and Privacy Policy. Required to submit. */
  termsAccepted: boolean;
}

export type BookingRequestErrors = Partial<
  Record<keyof BookingRequest, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

const TRIP_TYPES: readonly TripType[] = ["round-trip", "one-way", "multi-city"];
const CABINS: readonly CabinClass[] = [
  "economy",
  "premium-economy",
  "business",
  "first",
];

/** Matches MAX_PASSENGERS in features/search/lib/search-params. */
const MAX_PASSENGERS = 9;

/**
 * Reads a part-filled request out of a query string.
 *
 * `/checkout` is linked to from the search results and from the flight route
 * pages with the trip already in the URL, so the traveller should not have to
 * retype what they just told us. This turns those parameters into the form's
 * initial state.
 *
 * It is deliberately LENIENT, which is what separates it from
 * `parseSearchParams` in features/search. That function is parsing a search it
 * has to execute, so an unrecognised airport is an error it must report. This
 * one is pre-filling a form the traveller is about to check and correct
 * anyway: anything malformed is simply dropped, leaving that one field empty
 * rather than rejecting the whole link or — worse — seeding a value nobody
 * chose.
 *
 * The parameter names are the ones `buildSearchParams` writes, so the two ends
 * cannot drift into disagreeing about what "depart" is called.
 */
export function parseBookingSeed(
  raw: Record<string, string | string[] | undefined>,
): Partial<BookingRequest> {
  const first = (key: string): string | undefined => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const seed: Partial<BookingRequest> = {};

  const trip = first("trip");
  if (trip && TRIP_TYPES.includes(trip as TripType)) {
    seed.tripType = trip as TripType;
  }

  // Airport codes are validated against the catalogue because the form renders
  // them as <select> options. A code with no matching option would leave the
  // control showing its placeholder while the URL claimed otherwise, which is
  // exactly the "filled with the wrong value" case.
  const origin = first("from")?.toUpperCase();
  if (origin && getAirport(origin)) seed.origin = origin;

  const destination = first("to")?.toUpperCase();
  if (destination && getAirport(destination)) seed.destination = destination;

  const depart = first("depart");
  if (depart && isIsoDate(depart)) seed.departDate = depart;

  const returnDate = first("return");
  // A return date on a one-way is contradictory; the trip type wins because it
  // is the control the traveller can see.
  if (
    returnDate &&
    isIsoDate(returnDate) &&
    seed.tripType !== "one-way" &&
    (!seed.departDate || returnDate >= seed.departDate)
  ) {
    seed.returnDate = returnDate;
  }

  const adults = Number.parseInt(first("adults") ?? "", 10);
  if (Number.isFinite(adults) && adults >= 1 && adults <= MAX_PASSENGERS) {
    seed.adults = adults;
  }

  const children = Number.parseInt(first("children") ?? "", 10);
  if (Number.isFinite(children) && children >= 0 && children <= MAX_PASSENGERS) {
    seed.children = children;
  }

  const cabin = first("cabin");
  if (cabin && CABINS.includes(cabin as CabinClass)) {
    seed.cabin = cabin as CabinClass;
  }

  return seed;
}

/**
 * Validates a request.
 *
 * Shared by the form and the route handler on purpose — client-side validation
 * is a convenience for the traveller, not a control, and the same rules have
 * to hold on the server where they cannot be bypassed.
 */
export function validateBookingRequest(
  input: Partial<BookingRequest>,
): BookingRequestErrors {
  const errors: BookingRequestErrors = {};

  if (!input.fullName?.trim()) {
    errors.fullName = "Tell us who the booking is for.";
  }

  if (!input.email?.trim()) {
    errors.email = "We need an email address to send the quote to.";
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "That email address does not look right.";
  }

  if (!input.origin || !getAirport(input.origin)) {
    errors.origin = "Choose a departure airport.";
  }
  if (!input.destination || !getAirport(input.destination)) {
    errors.destination = "Choose a destination airport.";
  }
  if (
    input.origin &&
    input.destination &&
    input.origin.toUpperCase() === input.destination.toUpperCase()
  ) {
    errors.destination = "Departure and destination must be different.";
  }

  if (!input.departDate || !isIsoDate(input.departDate)) {
    errors.departDate = "Add a departure date.";
  }

  if (input.tripType === "round-trip") {
    if (!input.returnDate || !isIsoDate(input.returnDate)) {
      errors.returnDate = "Add a return date.";
    } else if (input.departDate && input.returnDate < input.departDate) {
      errors.returnDate = "The return cannot be before the departure.";
    }
  }

  if (!input.adults || input.adults < 1) {
    errors.adults = "At least one adult must travel.";
  }

  if (!input.termsAccepted) {
    errors.termsAccepted =
      "Please confirm you have read the terms and privacy policy.";
  }

  return errors;
}

export function hasErrors(errors: BookingRequestErrors): boolean {
  return Object.keys(errors).length > 0;
}
