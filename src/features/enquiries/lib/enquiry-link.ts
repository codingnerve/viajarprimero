import type { Enquiry, EnquiryVertical } from "@/features/enquiries/types";

/**
 * The URL carries a part-filled quote request between pages.
 *
 * The home page asks for the three things every vertical needs — where, when
 * and how many — and hands the traveller to the vertical's own page with the
 * full form already holding those answers. Encoding and decoding both live
 * here so the two ends cannot drift into disagreeing about a parameter name.
 *
 * Only the trip fields travel this way. Name, email and consent never appear
 * in a URL: those are typed once, on the form that submits them.
 */

/** Where each vertical's quote form lives. */
export const enquiryPath: Record<EnquiryVertical, string> = {
  stay: "/hotels",
  car: "/car-rentals",
  cruise: "/cruises",
  // Jets get a dedicated quote page rather than an anchor on the landing
  // page: the charter request is longer than the other three, and it is the
  // page paid traffic lands on.
  jet: "/private-jets/request-a-quote",
  vacation: "/vacations",
};

/** Anchor on each vertical page that the quote form sits under. */
export const ENQUIRY_ANCHOR = "request";

/**
 * Trip fields a link can pass along.
 *
 * `origin`, `notes`, `jetTripType` and `aircraftCategorySlug` were added for
 * the private-jet results page, where the traveller has already chosen a
 * specific aircraft on a specific leg. Arriving at an empty quote form after
 * picking one out of a list of forty is the kind of dead end that loses the
 * request — so the leg, the aircraft and the reference travel with them.
 */
export type EnquirySeed = Pick<
  Enquiry,
  | "origin"
  | "destination"
  | "startDate"
  | "endDate"
  | "adults"
  | "children"
  | "notes"
  | "jetTripType"
  | "aircraftCategorySlug"
  | "carType"
>;

const PARAM = {
  origin: "from",
  destination: "where",
  startDate: "start",
  endDate: "end",
  adults: "adults",
  children: "children",
  notes: "notes",
  jetTripType: "trip",
  aircraftCategorySlug: "cabin",
  carType: "car",
} as const;

/**
 * Passengers a link may carry.
 *
 * Nine on a hotel booking, nineteen on a charter — a twelve-seat Challenger
 * search that arrives at a form saying "2 passengers" has silently discarded
 * the thing the traveller searched for.
 */
const MAX_SEEDED_PASSENGERS = 19;

export function enquiryHref(
  vertical: EnquiryVertical,
  seed: Partial<EnquirySeed>,
): string {
  const params = new URLSearchParams();

  if (seed.origin?.trim()) params.set(PARAM.origin, seed.origin.trim());
  if (seed.destination?.trim()) {
    params.set(PARAM.destination, seed.destination.trim());
  }
  if (seed.startDate) params.set(PARAM.startDate, seed.startDate);
  if (seed.endDate) params.set(PARAM.endDate, seed.endDate);
  if (seed.adults) params.set(PARAM.adults, String(seed.adults));
  if (seed.children) params.set(PARAM.children, String(seed.children));
  if (seed.notes?.trim()) params.set(PARAM.notes, seed.notes.trim());
  if (seed.jetTripType) params.set(PARAM.jetTripType, seed.jetTripType);
  if (seed.aircraftCategorySlug) {
    params.set(PARAM.aircraftCategorySlug, seed.aircraftCategorySlug);
  }
  if (seed.carType?.trim()) params.set(PARAM.carType, seed.carType.trim());

  const query = params.toString();
  return `${enquiryPath[vertical]}${query ? `?${query}` : ""}#${ENQUIRY_ANCHOR}`;
}

function isIsoDate(value: string | null): value is string {
  return value !== null && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseCount(value: string | null, max: number): number | undefined {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > max) return undefined;
  return parsed;
}

/**
 * Reads a seed back out of a query string.
 *
 * Anything malformed is dropped rather than defaulted, so a mangled link
 * yields an empty form the traveller can fill in, never a request quietly
 * carrying dates nobody chose.
 */
export function parseEnquirySeed(search: string): Partial<EnquirySeed> {
  const params = new URLSearchParams(search);
  const seed: Partial<EnquirySeed> = {};

  const origin = params.get(PARAM.origin)?.trim();
  if (origin) seed.origin = origin.slice(0, 120);

  const destination = params.get(PARAM.destination)?.trim();
  if (destination) seed.destination = destination.slice(0, 120);

  const startDate = params.get(PARAM.startDate);
  if (isIsoDate(startDate)) seed.startDate = startDate;

  const endDate = params.get(PARAM.endDate);
  if (isIsoDate(endDate)) seed.endDate = endDate;

  const adults = parseCount(params.get(PARAM.adults), MAX_SEEDED_PASSENGERS);
  if (adults && adults >= 1) seed.adults = adults;

  const children = parseCount(params.get(PARAM.children), 9);
  if (children !== undefined) seed.children = children;

  /*
    Notes are the one free-text field a link can fill, so it is the one that
    has to be bounded. A quote request is read by a person and emailed on;
    an unbounded query parameter landing in it is how a link becomes a way to
    put arbitrary text in front of our team.
  */
  const notes = params.get(PARAM.notes)?.trim();
  if (notes) seed.notes = notes.slice(0, 500);

  const tripType = params.get(PARAM.jetTripType);
  if (tripType === "one-way" || tripType === "return") {
    seed.jetTripType = tripType;
  }

  const cabin = params.get(PARAM.aircraftCategorySlug)?.trim();
  if (cabin && /^[a-z0-9-]{1,40}$/.test(cabin)) {
    seed.aircraftCategorySlug = cabin;
  }

  const carType = params.get(PARAM.carType)?.trim();
  if (carType) seed.carType = carType.slice(0, 60);

  return seed;
}
