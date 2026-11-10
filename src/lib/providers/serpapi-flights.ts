import { siteConfig } from "@/lib/config/site";
import type {
  CabinClass,
  FlightOffer,
  FlightSearchQuery,
  FlightSegment,
} from "@/types/flight";

/**
 * SerpApi Google Flights — the only module permitted to talk to it.
 *
 * ── What this API is ──────────────────────────────────────────────────────
 * SerpApi runs a Google Flights search and returns it as JSON: real
 * itineraries — carriers, flight numbers, times, stops — with the fare Google
 * Flights shows for them, taxes and carrier charges included, for every
 * traveller on the search.
 *
 * Those fares are live at the moment of search but are not held by us and
 * cannot be ticketed through this API. So they are tagged `source: "market"`
 * and every one of them books by phone, where an agent confirms availability
 * and the exact total before anything is charged.
 *
 * ── The free plan ─────────────────────────────────────────────────────────
 * 250 searches a month. SerpApi caches identical searches for an hour and
 * does not count cached hits, and Next caches the response for CACHE_SECONDS
 * on top — so a popular route costs roughly one search an hour however many
 * people run it. A spent quota comes back as an error, which the results page
 * turns into the call-to-book panel rather than a broken page.
 *
 * ── Round trips ───────────────────────────────────────────────────────────
 * A round-trip search returns outbound options priced as the whole trip; the
 * return legs need a second, separately counted request per outbound option.
 * Rather than spend the quota ten times over, the outbound itinerary is shown
 * with the round-trip fare and the return is chosen with the agent — which
 * the card states beside the price.
 */

const API_KEY = process.env.SERPAPI_API_KEY;
const BASE_URL = "https://serpapi.com/search.json";

/** Fifteen minutes — well inside SerpApi's own free one-hour cache. */
const CACHE_SECONDS = 60 * 15;

/** A Google Flights search regularly takes several seconds. */
const TIMEOUT_MS = 20_000;

/** Enough to compare; more is a longer page nobody reads to the end of. */
const MAX_OFFERS = 10;

const TRAVEL_CLASS: Record<CabinClass, string> = {
  economy: "1",
  "premium-economy": "2",
  business: "3",
  first: "4",
};

/** SerpApi's wording when Google Flights found nothing — not a failure. */
const NO_RESULTS = /hasn't returned any results/i;

/** Notes worth showing beside a fare. Legroom and emissions are not. */
const FARE_NOTE = /bag|carry-on|refund|change/i;

export function isSerpApiConfigured(): boolean {
  return Boolean(API_KEY);
}

/** The subset of the SerpApi payload this module reads. */
interface SerpApiFlight {
  departure_airport?: { id?: string; time?: string };
  arrival_airport?: { id?: string; time?: string };
  duration?: number;
  airline?: string;
  flight_number?: string;
  extensions?: string[];
}

interface SerpApiItinerary {
  flights?: SerpApiFlight[];
  total_duration?: number;
  price?: number;
  extensions?: string[];
}

interface SerpApiResponse {
  error?: string;
  best_flights?: SerpApiItinerary[];
  other_flights?: SerpApiItinerary[];
}

/**
 * "2026-03-03 10:10" → "2026-03-03T10:10". Kept without an offset: a
 * departure is local to its airport, and that is the time the traveller and
 * the airline both mean.
 */
function toLocalIso(time: string): string {
  return time.replace(" ", "T");
}

/** Short, stable reference (FNV-1a) a traveller can read out on the phone. */
function referenceFor(key: string): string {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash = Math.imul(hash ^ key.charCodeAt(index), 16777619);
  }
  return `VP-${(hash >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(-6)}`;
}

function toSegment(flight: SerpApiFlight): FlightSegment | null {
  const origin = flight.departure_airport?.id;
  const destination = flight.arrival_airport?.id;
  const departs = flight.departure_airport?.time;
  const arrives = flight.arrival_airport?.time;

  if (!origin || !destination || !departs || !arrives || !flight.airline) {
    return null;
  }

  const flightNumber = flight.flight_number?.trim() ?? "";

  return {
    marketingCarrier:
      flightNumber.split(/\s+/)[0] || flight.airline.slice(0, 2).toUpperCase(),
    carrierName: flight.airline,
    flightNumber,
    origin,
    destination,
    departsAt: toLocalIso(departs),
    arrivesAt: toLocalIso(arrives),
    durationMinutes: flight.duration ?? 0,
  };
}

function toOffer(
  itinerary: SerpApiItinerary,
  roundTrip: boolean,
): FlightOffer | null {
  // An itinerary without a price is one we cannot show honestly.
  if (typeof itinerary.price !== "number" || itinerary.price <= 0) return null;

  const flights = itinerary.flights ?? [];
  const segments = flights
    .map(toSegment)
    .filter((segment): segment is FlightSegment => segment !== null);

  // A leg we could not read means the itinerary on screen would be incomplete.
  if (segments.length === 0 || segments.length !== flights.length) return null;

  const notes = new Set(
    [
      ...(itinerary.extensions ?? []),
      ...flights.flatMap((flight) => flight.extensions ?? []),
    ].filter((note) => FARE_NOTE.test(note)),
  );

  return {
    id: referenceFor(
      `${segments.map((s) => `${s.flightNumber}@${s.departsAt}`).join("|")}#${itinerary.price}`,
    ),
    slices: [
      {
        origin: segments[0].origin,
        destination: segments[segments.length - 1].destination,
        durationMinutes:
          itinerary.total_duration ??
          segments.reduce((sum, segment) => sum + segment.durationMinutes, 0),
        segments,
        stops: segments.length - 1,
      },
    ],
    currency: siteConfig.currency,
    fare: Math.round(itinerary.price * 100),
    returnArrangedWithAgent: roundTrip,
    notes: [...notes],
  };
}

/**
 * Live fares for a search, best-ranked first.
 *
 * Throws on anything other than "no results" — a missing key, a spent quota,
 * a timeout — so the page can tell "nothing matched" from "we could not look".
 */
export async function searchGoogleFlights(
  query: FlightSearchQuery,
): Promise<FlightOffer[]> {
  if (!API_KEY) throw new Error("SERPAPI_API_KEY is not set.");

  const roundTrip = Boolean(query.returnDate);

  const url = new URL(BASE_URL);
  url.searchParams.set("engine", "google_flights");
  url.searchParams.set("departure_id", query.origin);
  url.searchParams.set("arrival_id", query.destination);
  url.searchParams.set("outbound_date", query.departDate);
  if (query.returnDate) url.searchParams.set("return_date", query.returnDate);
  url.searchParams.set("type", roundTrip ? "1" : "2");
  url.searchParams.set("travel_class", TRAVEL_CLASS[query.cabin]);
  url.searchParams.set("adults", String(query.passengers.adults));
  url.searchParams.set("children", String(query.passengers.children));
  url.searchParams.set("infants_on_lap", String(query.passengers.infants));
  url.searchParams.set("currency", siteConfig.currency);
  url.searchParams.set("hl", "en");
  url.searchParams.set("gl", "us");
  url.searchParams.set("api_key", API_KEY);

  const response = await fetch(url, {
    // Cached by Next per resolved URL, which includes the whole search.
    next: { revalidate: CACHE_SECONDS },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const payload = (await response
    .json()
    .catch(() => ({}))) as SerpApiResponse;

  if (payload.error) {
    if (NO_RESULTS.test(payload.error)) return [];
    throw new Error(`SerpApi: ${payload.error}`);
  }

  if (!response.ok) {
    throw new Error(`SerpApi returned ${response.status}`);
  }

  const seen = new Set<string>();
  const offers: FlightOffer[] = [];

  for (const itinerary of [
    ...(payload.best_flights ?? []),
    ...(payload.other_flights ?? []),
  ]) {
    const offer = toOffer(itinerary, roundTrip);
    if (!offer || seen.has(offer.id)) continue;

    seen.add(offer.id);
    offers.push(offer);
    if (offers.length === MAX_OFFERS) break;
  }

  return offers;
}
