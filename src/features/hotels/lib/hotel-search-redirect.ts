import { hotelSearchHref } from "@/features/hotels/lib/hotel-search-params";
import { resolvePlace } from "@/lib/providers/liteapi";

/**
 * Turns a legacy enquiry-seed URL into a hotel search.
 *
 * `/hotels?where=Barcelona&start=2026-09-12&end=2026-09-19` is the shape the
 * old hero form wrote and the shape `enquiryHref` still writes for the quote
 * panel. Those parameters describe a search — a destination and two dates —
 * so landing on a page that shows an empty search form instead of results is
 * a dead end the traveller has to climb out of.
 *
 * Returns the results URL, or null to leave the page as it is. Null is the
 * answer for every uncertain case: no parameters, malformed dates, no
 * supplier configured, or free text that resolves to nothing. Guessing a
 * destination would be worse than showing the landing page — the traveller
 * asked for "sad" and would silently get San Diego.
 *
 * `adults`, `children` and `rooms` are carried through when present, and
 * otherwise left to the results page's own defaults rather than invented here.
 */
/**
 * What can be salvaged from a URL the redirect declined.
 *
 * Reaching the landing page with `where`/`start`/`end` on it means the place
 * could not be resolved — no supplier key, or free text matching nothing. The
 * dates and party size are still perfectly good answers, so they seed the
 * form rather than being thrown away.
 *
 * The destination is deliberately not carried. It is the value that failed to
 * resolve; putting it back in the box would make an unusable entry look
 * accepted, and the form would then refuse to submit it with no visible
 * reason why.
 */
export function carriedFromUrl(
  raw: Record<string, string | string[] | undefined>,
): { checkIn?: string; checkOut?: string; adults?: number; children?: number; rooms?: number } {
  const first = (key: string): string | undefined => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const isIsoDate = (value: string | undefined): value is string =>
    Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

  const number = (key: string): number | undefined => {
    const parsed = Number.parseInt(first(key) ?? "", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  };

  const start = first("start");
  const end = first("end");

  return {
    ...(isIsoDate(start) ? { checkIn: start } : {}),
    ...(isIsoDate(end) && (!isIsoDate(start) || end > start)
      ? { checkOut: end }
      : {}),
    ...(number("adults") !== undefined ? { adults: number("adults") } : {}),
    ...(number("children") !== undefined ? { children: number("children") } : {}),
    ...(number("rooms") !== undefined ? { rooms: number("rooms") } : {}),
  };
}

export async function hotelSearchRedirect(
  raw: Record<string, string | string[] | undefined>,
): Promise<string | null> {
  const first = (key: string): string | undefined => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const where = first("where")?.trim();
  const start = first("start");
  const end = first("end");

  // All three are required. A destination with no dates cannot be priced, and
  // dates with no destination cannot be searched.
  if (!where || !start || !end) return null;

  const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (!isIsoDate(start) || !isIsoDate(end) || end <= start) return null;

  const place = await resolvePlace(where);
  if (!place) return null;

  const count = (key: string, fallback: number): number => {
    const parsed = Number.parseInt(first(key) ?? "", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  };

  const rooms = Math.max(1, count("rooms", 1));

  return hotelSearchHref({
    placeId: place.id,
    placeName: place.detail ? `${place.name}, ${place.detail}` : place.name,
    checkIn: start,
    checkOut: end,
    // Every room needs at least one adult, so the guest count cannot be
    // lower than the room count — see `parseHotelSearch`, which rejects it.
    adults: Math.max(rooms, count("adults", 2)),
    children: count("children", 0),
    rooms,
  });
}
