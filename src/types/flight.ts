/**
 * Flight domain types shared by the `search` and `booking` features.
 *
 * These are OUR shapes, not a vendor's. Anything in `lib/providers/` is
 * responsible for mapping a supplier payload onto these types, so swapping a
 * fare supplier never reaches a component.
 */

export type TripType = "round-trip" | "one-way" | "multi-city";

export type CabinClass = "economy" | "premium-economy" | "business" | "first";

export const CABIN_LABELS: Record<CabinClass, string> = {
  economy: "Economy",
  "premium-economy": "Premium economy",
  business: "Business",
  first: "First",
};

export interface Airport {
  /** IATA code, uppercase. */
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchQuery {
  tripType: TripType;
  origin: string;
  destination: string;
  /** ISO date, YYYY-MM-DD. */
  departDate: string;
  /** ISO date. Absent for one-way. */
  returnDate?: string;
  passengers: PassengerCounts;
  cabin: CabinClass;
}

export interface FlightSegment {
  marketingCarrier: string;
  carrierName: string;
  flightNumber: string;
  origin: string;
  destination: string;
  /** ISO 8601 local departure/arrival timestamps. */
  departsAt: string;
  arrivesAt: string;
  durationMinutes: number;
}

export interface FlightSlice {
  origin: string;
  destination: string;
  durationMinutes: number;
  segments: FlightSegment[];
  /** Derived: segments.length - 1. */
  stops: number;
}

/**
 * A priced itinerary.
 *
 * `fare` is in minor units (cents) and covers every traveller on the search
 * with taxes and carrier-imposed charges already in it. A headline price that
 * leaves out a mandatory component is the most common reason a travel
 * advertiser fails Ads review.
 *
 * Our service fee is not in `fare`. It is a published range until an agent
 * quotes the booking (see `serviceFees` in lib/config/legal), so the UI
 * discloses it beside the price rather than folding it into a number we could
 * not honour.
 */
export interface FlightOffer {
  /** Short reference a traveller can read out on the phone. */
  id: string;
  slices: FlightSlice[];
  currency: string;
  fare: number;
  /**
   * True when `fare` prices a round trip but only the outbound slice is shown;
   * the return flight is chosen with the agent.
   */
  returnArrangedWithAgent: boolean;
  /** Baggage and fare-rule notes from the source, verbatim. */
  notes: string[];
}

/**
 * Where the offers on screen came from.
 *
 * - `supplier` — bookable inventory from a connected fare supplier. Prices are
 *                quoted and held.
 *
 * - `market`   — live fares from a fare-comparison feed. Real prices at the
 *                moment of search, but not held by us: an agent confirms
 *                availability and the exact total before anything is charged,
 *                and the page must say so. See lib/providers/serpapi-flights.
 */
export type FareSource = "supplier" | "market";

/**
 * The result of a fare search.
 *
 * `configured: false` means no fare feed is wired up in this environment. It
 * is a distinct state from "searched and found nothing", and the UI must not
 * present one as the other — an empty grid implying we searched when we did
 * not would be a fabricated claim.
 */
export type FlightSearchResult =
  | { configured: false; offers: []; searchedAt: string }
  | {
      configured: true;
      source: FareSource;
      offers: FlightOffer[];
      searchedAt: string;
    };
