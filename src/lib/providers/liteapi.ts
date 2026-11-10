import { destinations } from "@/lib/content/destinations";
import {
  sampleFacilities,
  sampleHotelDetail,
  samplePlaces,
  sampleResolvePlace,
  sampleSearchHotels,
} from "@/lib/providers/sample-hotels";
import type {
  Hotel,
  HotelDetail,
  HotelPrice,
  HotelRoom,
  HotelSearchQuery,
  HotelSearchResult,
  PlaceKind,
  PlaceSuggestion,
} from "@/types/hotel";

/**
 * LiteAPI (Nuitée) — the only module permitted to talk to it.
 *
 * ── Why this supplier ─────────────────────────────────────────────────────
 * It was chosen over Amadeus Self-Service, which is the obvious alternative,
 * for one disqualifying reason: Amadeus no longer distributes hotel images or
 * amenities through its Self-Service APIs (a legal constraint on their side,
 * not an oversight), and both are load-bearing for a results page. LiteAPI
 * returns property content, live rates and cancellation terms from one key,
 * on a sandbox that needs no credit card.
 *
 * ── What it gives us ──────────────────────────────────────────────────────
 *   GET  /data/places   place and city autocomplete
 *   GET  /data/hotels   property content — photo, stars, rating, facilities
 *   GET  /data/hotel    full detail — gallery, rooms, policies, check-in times
 *   POST /hotels/rates  live availability and pricing for dates + occupancy
 *
 * Content and price are deliberately two calls. A property always has a name
 * and a photograph; it only has a price once it has been priced for specific
 * dates. Keeping them separate is what lets the results page show a hotel with
 * "no availability for these dates" rather than a blank where a number should
 * be.
 *
 * ── Limits worth knowing ──────────────────────────────────────────────────
 * 1. The sandbox is rate limited to ~5 requests per second. Content responses
 *    are cached hard (see CONTENT_TTL); rates are not, because a cached price
 *    is a wrong price.
 * 2. Sandbox rates mirror production but must not be presented as bookable —
 *    nothing here completes a booking, and the UI routes to the existing
 *    written-quote funnel instead.
 * 3. `/data/places` is billed per request in production. It is debounced at
 *    the input and cached per query here.
 *
 * ── Swapping supplier ─────────────────────────────────────────────────────
 * Everything below maps a vendor payload onto the types in `types/hotel`. No
 * LiteAPI field name — `main_photo`, `facilityIds`, `refundableTag` — appears
 * anywhere else in the codebase. A replacement supplier needs to satisfy that
 * module and nothing else.
 */

const API_KEY = process.env.LITEAPI_KEY;
const BASE_URL = "https://api.liteapi.travel/v3.0";

/**
 * Property content changes rarely — a hotel does not rename itself or
 * repaint its lobby hourly — and the sandbox allowance is small, so a day is
 * both accurate and the difference between this working and being throttled.
 */
const CONTENT_TTL = 60 * 60 * 24;

/** Autocomplete results are stable enough to hold for an hour. */
const PLACES_TTL = 60 * 60;

/** Default page size for a result list. */
export const HOTELS_PER_PAGE = 18;

export function isHotelSearchConfigured(): boolean {
  return Boolean(API_KEY) || sampleHotelsEnabled();
}

/**
 * Whether to fall back to the generated dataset when no key is set.
 *
 * On in development, because the search, the filters, the sort, the paging and
 * the detail page cannot be built or demonstrated against an empty list — and
 * a UI first seen with real data in it is a UI nobody has actually looked at.
 *
 * Off in production unless `HOTEL_SAMPLE_DATA=1` is set deliberately. That
 * default is the safeguard: a deploy cannot start showing invented hotels and
 * invented prices to real travellers because a flag was left on. Everything it
 * returns is tagged `source: "sample"` and the pages say so — see
 * ./sample-hotels.
 */
export function sampleHotelsEnabled(): boolean {
  if (process.env.HOTEL_SAMPLE_DATA === "1") return true;
  if (process.env.HOTEL_SAMPLE_DATA === "0") return false;
  return process.env.NODE_ENV !== "production";
}

/** Shared request helper. Never throws for an expected failure. */
async function request<T>(
  path: string,
  options: {
    query?: Record<string, string | number | undefined>;
    body?: unknown;
    revalidate?: number;
  } = {},
): Promise<T | null> {
  if (!API_KEY) return null;

  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  try {
    const response = await fetch(url, {
      method: options.body ? "POST" : "GET",
      headers: {
        "X-API-Key": API_KEY,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      // A POST is never cached by Next; a GET is cached for the TTL given.
      ...(options.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } }
        : { cache: "no-store" as const }),
    });

    if (!response.ok) {
      console.warn(`LiteAPI ${path} returned ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`LiteAPI ${path} request failed`, error);
    return null;
  }
}

/* ── Places ──────────────────────────────────────────────────────────────── */

interface RawPlace {
  placeId?: string;
  displayName?: string;
  formattedAddress?: string;
  types?: string[];
}

/** LiteAPI's Google-derived type strings, reduced to the four we render. */
function placeKind(types: readonly string[] = []): PlaceKind {
  if (types.includes("airport")) return "airport";
  if (types.includes("lodging") || types.includes("hotel")) return "hotel";
  if (types.includes("locality") || types.includes("political")) return "city";
  if (types.includes("sublocality") || types.includes("neighborhood")) return "area";
  return "place";
}

export async function searchPlaces(
  textQuery: string,
): Promise<PlaceSuggestion[]> {
  const trimmed = textQuery.trim();
  // Below three characters the supplier returns noise and it is a billed call.
  if (trimmed.length < 3) return [];

  if (!API_KEY) return sampleHotelsEnabled() ? samplePlaces(trimmed) : [];

  const payload = await request<{ data?: RawPlace[] }>("/data/places", {
    query: { textQuery: trimmed, language: "en" },
    revalidate: PLACES_TTL,
  });

  return (payload?.data ?? [])
    .filter((place): place is RawPlace & { placeId: string } =>
      Boolean(place.placeId && place.displayName),
    )
    .map((place) => ({
      id: place.placeId,
      name: place.displayName ?? "",
      // The formatted address repeats the name as its first component; drop it
      // so the suggestion reads "Barcelona / Spain" not "Barcelona / Barcelona,
      // Spain".
      detail: (place.formattedAddress ?? "")
        .replace(new RegExp(`^${escapeRegExp(place.displayName ?? "")},\\s*`), "")
        .trim(),
      kind: placeKind(place.types),
    }))
    .slice(0, 8);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Best-guess place for a free-text string.
 *
 * The search flow normally carries a real place id, because the form makes the
 * traveller pick one. This is for the links that cannot: the older
 * `/hotels?where=Barcelona` shape, and anything inbound that names a city in
 * words rather than by id.
 *
 * It prefers a city or area over a single property — somebody who typed
 * "Barcelona" wants the city, not a hotel that happens to be called Barcelona
 * — and returns null rather than guessing when nothing sensible matches, so
 * the caller can fall back instead of searching somewhere arbitrary.
 */
export async function resolvePlace(
  text: string,
): Promise<PlaceSuggestion | null> {
  if (!API_KEY) {
    return sampleHotelsEnabled() ? sampleResolvePlace(text) : null;
  }

  const places = await searchPlaces(text);
  if (places.length === 0) return null;

  const byKind = (kind: PlaceKind) => places.find((place) => place.kind === kind);

  return byKind("city") ?? byKind("area") ?? byKind("place") ?? places[0];
}

/* ── Hotel content ───────────────────────────────────────────────────────── */

interface RawHotel {
  id?: string;
  name?: string;
  hotelDescription?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  main_photo?: string;
  thumbnail?: string;
  stars?: number;
  rating?: number;
  reviewCount?: number;
  facilityIds?: number[];
}

/**
 * Strips the HTML the supplier embeds in descriptions and trims to a card.
 *
 * The field arrives with `<p>` and `<br>` in it. Rendering that raw would
 * either show the tags or need `dangerouslySetInnerHTML` on third-party text,
 * which is not a trade worth making for a card summary.
 */
function toPlainText(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toHotel(raw: RawHotel): Hotel | null {
  if (!raw.id || !raw.name) return null;

  const summary = toPlainText(raw.hotelDescription);

  return {
    id: raw.id,
    name: raw.name,
    address: raw.address ?? "",
    city: raw.city ?? "",
    country: raw.country ?? "",
    stars: typeof raw.stars === "number" ? raw.stars : 0,
    // A zero from the supplier means "unrated", not "rated zero" — and a
    // hotel card showing 0.0/10 is a libel rather than a data point.
    rating: typeof raw.rating === "number" && raw.rating > 0 ? raw.rating : null,
    reviewCount: raw.reviewCount ?? 0,
    image: raw.main_photo ?? raw.thumbnail ?? null,
    summary: summary.length > 190 ? `${summary.slice(0, 187).trimEnd()}…` : summary,
    facilityIds: raw.facilityIds ?? [],
    coordinates:
      typeof raw.latitude === "number" && typeof raw.longitude === "number"
        ? { latitude: raw.latitude, longitude: raw.longitude }
        : null,
    price: null,
  };
}

/**
 * The destinations offered before anybody types.
 *
 * A combobox that shows nothing until the third keystroke asks the traveller
 * to already know where they are going and how it is spelled. Opening with a
 * short list is both faster for the common case and an answer to "what do you
 * actually cover?".
 *
 * The list is the cities this site already writes destination guides for, so
 * the picklist and the editorial cannot drift apart — and a city added to
 * `lib/content/destinations` appears here without anyone remembering to.
 *
 * Each one is resolved to a real supplier place id, because the results page
 * is keyed on ids rather than on words. Those lookups are cached for an hour
 * by `searchPlaces`, so this costs a handful of requests a day rather than one
 * per page view. Anything that fails to resolve is dropped rather than
 * guessed.
 */
export async function popularPlaces(): Promise<PlaceSuggestion[]> {
  const cities = destinations.slice(0, 6);

  if (!API_KEY) {
    if (!sampleHotelsEnabled()) return [];
    return cities
      .map((city) => sampleResolvePlace(city.city))
      .filter((place): place is PlaceSuggestion => place !== null);
  }

  const resolved = await Promise.all(
    cities.map((city) => resolvePlace(`${city.city}, ${city.country}`)),
  );

  return resolved.filter((place): place is PlaceSuggestion => place !== null);
}

/* ── Facilities ──────────────────────────────────────────────────────────── */

/**
 * The supplier's facility id → name dictionary.
 *
 * Fetched rather than hardcoded. A hotel in a result list carries
 * `facilityIds: [3, 47, 91]` and nothing else, so something has to turn those
 * into "Free WiFi" and "Airport shuttle" — and writing that table by hand
 * would mean inventing the mapping, which is exactly the kind of fabricated
 * data this codebase refuses everywhere else. If the supplier renumbers a
 * facility, a hand-written table silently mislabels it; this cannot.
 *
 * Cached for a day: it is a reference table, not inventory.
 */
export async function fetchFacilities(): Promise<Map<number, string>> {
  if (!API_KEY) {
    return sampleHotelsEnabled() ? sampleFacilities() : new Map();
  }

  const payload = await request<{
    data?: Array<{ facility_id?: number; facility?: string }>;
  }>("/data/facilities", { query: { language: "en" }, revalidate: CONTENT_TTL });

  const map = new Map<number, string>();
  for (const entry of payload?.data ?? []) {
    if (typeof entry.facility_id === "number" && entry.facility) {
      map.set(entry.facility_id, entry.facility);
    }
  }
  return map;
}

/* ── Rates ───────────────────────────────────────────────────────────────── */

interface RawRate {
  rateId?: string;
  name?: string;
  boardName?: string;
  maxOccupancy?: number;
  retailRate?: {
    total?: Array<{ amount?: number; currency?: string }>;
  };
  cancellationPolicies?: {
    refundableTag?: string;
    cancelPolicyInfos?: Array<{ cancelTime?: string; amount?: number }>;
  };
}

interface RawRoomType {
  offerId?: string;
  rates?: RawRate[];
  offerRetailRate?: { amount?: number; currency?: string };
}

interface RawRatesEntry {
  hotelId?: string;
  roomTypes?: RawRoomType[];
}

/** `RFN` is LiteAPI's refundable marker; anything else is non-refundable. */
function isRefundable(rate: RawRate): boolean {
  return rate.cancellationPolicies?.refundableTag === "RFN";
}

/** Money arrives as a major-unit float; this codebase stores minor units. */
function toMinorUnits(amount: number | undefined): number | null {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  return Math.round(amount * 100);
}

async function fetchRates(
  hotelIds: string[],
  query: HotelSearchQuery,
): Promise<RawRatesEntry[]> {
  if (hotelIds.length === 0) return [];

  const payload = await request<{ data?: RawRatesEntry[] }>("/hotels/rates", {
    body: {
      hotelIds,
      // One occupancy object per room, so a two-room request is priced as two
      // rooms rather than as one room with twice the guests.
      occupancies: Array.from({ length: Math.max(1, query.rooms) }, () => ({
        adults: Math.max(1, Math.ceil(query.adults / Math.max(1, query.rooms))),
        ...(query.children > 0
          ? { children: Array.from({ length: query.children }, () => 10) }
          : {}),
      })),
      checkin: query.checkIn,
      checkout: query.checkOut,
      currency: "USD",
      guestNationality: "US",
    },
  });

  return payload?.data ?? [];
}

/** The cheapest offer across a hotel's room types. */
function cheapestPrice(entry: RawRatesEntry): HotelPrice | null {
  let best: HotelPrice | null = null;

  for (const roomType of entry.roomTypes ?? []) {
    for (const rate of roomType.rates ?? []) {
      const money = rate.retailRate?.total?.[0];
      const total = toMinorUnits(money?.amount);
      if (total === null || !roomType.offerId) continue;

      if (!best || total < best.total) {
        best = {
          total,
          currency: money?.currency ?? "USD",
          offerId: roomType.offerId,
          refundable: isRefundable(rate),
        };
      }
    }
  }

  return best;
}

/* ── Public search ───────────────────────────────────────────────────────── */

/**
 * Content plus prices for a place.
 *
 * Two calls, in order: the property list for the place, then one rates call
 * for the page of hotels actually being shown. Pricing only what is on screen
 * is what keeps this inside the sandbox rate limit — pricing 200 properties to
 * display 18 of them would spend the allowance on rows nobody sees.
 */
export async function searchHotels(
  query: HotelSearchQuery,
  options: { offset?: number; limit?: number } = {},
): Promise<HotelSearchResult> {
  const searchedAt = new Date().toISOString();

  const limit = options.limit ?? HOTELS_PER_PAGE;

  if (!API_KEY) {
    if (!sampleHotelsEnabled()) {
      return { configured: false, hotels: [], total: 0, searchedAt };
    }

    const sample = sampleSearchHotels(query, {
      offset: options.offset ?? 0,
      limit,
    });
    return {
      configured: true,
      source: "sample",
      hotels: sample.hotels,
      total: sample.total,
      searchedAt,
    };
  }

  const offset = options.offset ?? 0;

  const payload = await request<{ data?: RawHotel[]; total?: number }>(
    "/data/hotels",
    {
      query: { placeId: query.placeId, limit, offset },
      revalidate: CONTENT_TTL,
    },
  );

  const hotels = (payload?.data ?? [])
    .map(toHotel)
    .filter((hotel): hotel is Hotel => hotel !== null);

  if (hotels.length === 0) {
    return {
      configured: true,
      source: "supplier",
      hotels: [],
      total: payload?.total ?? 0,
      searchedAt,
    };
  }

  const rates = await fetchRates(
    hotels.map((hotel) => hotel.id),
    query,
  );
  const priceByHotel = new Map<string, HotelPrice>();
  for (const entry of rates) {
    const price = cheapestPrice(entry);
    if (entry.hotelId && price) priceByHotel.set(entry.hotelId, price);
  }

  return {
    configured: true,
    source: "supplier",
    hotels: hotels.map((hotel) => ({
      ...hotel,
      price: priceByHotel.get(hotel.id) ?? null,
    })),
    total: payload?.total ?? hotels.length,
    searchedAt,
  };
}

/* ── Detail ──────────────────────────────────────────────────────────────── */

interface RawHotelDetail extends RawHotel {
  starRating?: number;
  hotelImages?: Array<{ url?: string; urlHd?: string; defaultImage?: boolean }>;
  hotelFacilities?: string[];
  hotelImportantInformation?: string;
  phone?: string;
  location?: { latitude?: number; longitude?: number };
  checkinCheckoutTimes?: {
    checkin_start?: string;
    checkin?: string;
    checkout?: string;
  };
  rooms?: Array<{
    roomName?: string;
    maxOccupancy?: number;
    photos?: Array<{ url?: string; hd_url?: string }>;
    roomAmenities?: Array<{ name?: string }>;
  }>;
}

/**
 * Full detail for one property, priced for the traveller's dates.
 *
 * The rooms a traveller can actually book come from the rates call, not from
 * the content call: content lists every room type the hotel has ever had,
 * while rates lists the ones available and priced for these dates. Rendering
 * the former as bookable would offer rooms that do not exist tonight.
 */
export async function getHotelDetail(
  hotelId: string,
  query: HotelSearchQuery | null,
): Promise<HotelDetail | null> {
  if (!API_KEY) {
    return sampleHotelsEnabled() ? sampleHotelDetail(hotelId, query) : null;
  }

  const payload = await request<{ data?: RawHotelDetail }>("/data/hotel", {
    query: { hotelId, language: "en" },
    revalidate: CONTENT_TTL,
  });

  const raw = payload?.data;
  if (!raw?.id || !raw.name) return null;

  const images = (raw.hotelImages ?? [])
    .map((image) => image.urlHd ?? image.url)
    .filter((url): url is string => Boolean(url));

  const rooms = query ? await fetchAvailableRooms(hotelId, query, raw) : [];

  return {
    id: raw.id,
    name: raw.name,
    address: raw.address ?? "",
    city: raw.city ?? "",
    country: raw.country ?? "",
    stars:
      typeof raw.starRating === "number"
        ? raw.starRating
        : typeof raw.stars === "number"
          ? raw.stars
          : 0,
    rating: typeof raw.rating === "number" && raw.rating > 0 ? raw.rating : null,
    reviewCount: raw.reviewCount ?? 0,
    image: images[0] ?? raw.main_photo ?? null,
    images,
    description: toPlainText(raw.hotelDescription),
    facilities: raw.hotelFacilities ?? [],
    facilityIds: raw.facilityIds ?? [],
    coordinates:
      typeof raw.location?.latitude === "number" &&
      typeof raw.location?.longitude === "number"
        ? { latitude: raw.location.latitude, longitude: raw.location.longitude }
        : null,
    checkIn: raw.checkinCheckoutTimes?.checkin_start ?? raw.checkinCheckoutTimes?.checkin ?? null,
    checkOut: raw.checkinCheckoutTimes?.checkout ?? null,
    importantInformation: toPlainText(raw.hotelImportantInformation) || null,
    phone: raw.phone ?? null,
    rooms,
  };
}

/** Priced, available rooms — joined to the content call for photos. */
async function fetchAvailableRooms(
  hotelId: string,
  query: HotelSearchQuery,
  content: RawHotelDetail,
): Promise<HotelRoom[]> {
  const entries = await fetchRates([hotelId], query);
  const entry = entries[0];
  if (!entry) return [];

  // Room photographs live on the content payload, keyed loosely by name.
  const photosByName = new Map<string, string[]>();
  for (const room of content.rooms ?? []) {
    if (!room.roomName) continue;
    photosByName.set(
      room.roomName.toLowerCase(),
      (room.photos ?? [])
        .map((photo) => photo.hd_url ?? photo.url)
        .filter((url): url is string => Boolean(url)),
    );
  }

  const amenitiesByName = new Map<string, string[]>();
  for (const room of content.rooms ?? []) {
    if (!room.roomName) continue;
    amenitiesByName.set(
      room.roomName.toLowerCase(),
      (room.roomAmenities ?? [])
        .map((amenity) => amenity.name)
        .filter((name): name is string => Boolean(name))
        .slice(0, 8),
    );
  }

  const rooms: HotelRoom[] = [];

  for (const roomType of entry.roomTypes ?? []) {
    for (const rate of roomType.rates ?? []) {
      const money = rate.retailRate?.total?.[0];
      const total = toMinorUnits(money?.amount);
      if (total === null || !roomType.offerId || !rate.rateId) continue;

      const key = (rate.name ?? "").toLowerCase();
      const deadline =
        rate.cancellationPolicies?.cancelPolicyInfos?.[0]?.cancelTime ?? null;

      rooms.push({
        offerId: roomType.offerId,
        rateId: rate.rateId,
        name: rate.name ?? "Room",
        board: rate.boardName ?? "Room only",
        total,
        currency: money?.currency ?? "USD",
        refundable: isRefundable(rate),
        cancellationDeadline: deadline,
        maxOccupancy: rate.maxOccupancy ?? null,
        photos: photosByName.get(key) ?? [],
        amenities: amenitiesByName.get(key) ?? [],
      });
    }
  }

  return rooms.sort((a, b) => a.total - b.total);
}
