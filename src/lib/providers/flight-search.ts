import { bookingConfig } from "@/lib/config/booking";
import {
  isSerpApiConfigured,
  searchGoogleFlights,
} from "@/lib/providers/serpapi-flights";
import type { FlightSearchQuery, FlightSearchResult } from "@/types/flight";

/**
 * The fare search the rest of the site calls.
 *
 * Fares come from SerpApi's Google Flights feed (see ./serpapi-flights): live
 * prices that are booked by phone with an agent. Without `SERPAPI_API_KEY` the
 * result is `configured: false`, and the results page shows the call-to-book
 * panel instead of fares — never invented ones.
 *
 * While bookings are taken by phone (`bookingConfig.callToBook`) the feed is
 * not called at all: a fare we have not quoted, shown to prompt a call, is the
 * pattern Google Ads treats as bait.
 *
 * Connecting a bookable supplier later means returning `source: "supplier"`
 * from here. Nothing above this file names a vendor.
 *
 * Throws when the feed fails, so the page can say "we could not load fares"
 * rather than "no flights found" — which would be untrue about availability.
 */
export async function searchFlights(
  query: FlightSearchQuery,
): Promise<FlightSearchResult> {
  const searchedAt = new Date().toISOString();

  if (bookingConfig.callToBook || !isSerpApiConfigured()) {
    return { configured: false, offers: [], searchedAt };
  }

  const offers = await searchGoogleFlights(query);
  return { configured: true, source: "market", offers, searchedAt };
}
