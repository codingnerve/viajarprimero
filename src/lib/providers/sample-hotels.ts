import data from "@/lib/providers/sample-hotels.json";
import { nightsBetween } from "@/features/hotels/lib/hotel-search-params";
import type {
  Hotel,
  HotelDetail,
  HotelRoom,
  HotelSearchQuery,
  PlaceKind,
  PlaceSuggestion,
} from "@/types/hotel";

/**
 * Generated hotel data, for building and demonstrating the search flow.
 *
 * ⚠️ NOTHING IN HERE IS REAL ⚠️
 *
 * Every property, price, rating and review count is invented. No hotel has
 * quoted these rates and none of them can be booked. The names are built from
 * a street or district plus a generic suffix specifically so they cannot be
 * mistaken for trading businesses — inventing a review score for a *real*
 * hotel would be defamatory rather than merely fake.
 *
 * The safeguards are the same three the sample fares carry, for the same
 * reasons:
 *
 *  1. OFF in production unless `HOTEL_SAMPLE_DATA=1` is set explicitly. See
 *     `sampleHotelsEnabled()` in ./liteapi.
 *  2. Everything is tagged `source: "sample"`, and the results and detail
 *     pages render a prominent notice whenever they see that tag.
 *  3. Every id is prefixed `sample-`, so one cannot be mistaken for a supplier
 *     reference in a log or a support conversation.
 *
 * When `LITEAPI_KEY` is set this module is never consulted. It does not need
 * deleting — but the `sample` tag must keep flowing to the UI, because that is
 * what stops a development aid becoming a misrepresentation.
 *
 * Prices are derived from a per-property nightly figure times the nights and
 * rooms requested, so they respond to the search rather than being constants —
 * which is what makes the sort, the price filter and the totals demonstrable.
 */

interface RawSampleHotel {
  id: string;
  placeIds: string[];
  name: string;
  address: string;
  city: string;
  country: string;
  stars: number;
  rating: number | null;
  reviewCount: number;
  images: string[];
  description: string;
  facilityIds: number[];
  latitude: number;
  longitude: number;
  nightlyFrom: number;
  refundable: boolean;
  /** Exercises the "no availability for these dates" state. */
  soldOut?: boolean;
}

const hotels = data.hotels as RawSampleHotel[];
const places = data.places as Array<{
  id: string;
  name: string;
  detail: string;
  kind: string;
  aliases: string[];
}>;

/** The facility dictionary, in the shape `fetchFacilities` returns. */
export function sampleFacilities(): Map<number, string> {
  return new Map(data.facilities.map((facility) => [facility.id, facility.name]));
}

/** Autocomplete over the sample place list. */
export function samplePlaces(textQuery: string): PlaceSuggestion[] {
  const needle = textQuery.trim().toLowerCase();
  if (needle.length < 3) return [];

  return places
    .filter(
      (place) =>
        place.name.toLowerCase().includes(needle) ||
        place.detail.toLowerCase().includes(needle) ||
        place.aliases.some((alias) => alias.includes(needle)),
    )
    .map((place) => ({
      id: place.id,
      name: place.name,
      detail: place.detail,
      kind: place.kind as PlaceKind,
    }));
}

/** Best-guess place for free text, mirroring `resolvePlace`. */
export function sampleResolvePlace(text: string): PlaceSuggestion | null {
  const matches = samplePlaces(text);
  if (matches.length === 0) return null;
  return (
    matches.find((place) => place.kind === "city") ??
    matches.find((place) => place.kind === "area") ??
    matches[0]
  );
}

/**
 * Total for the stay, in minor units.
 *
 * Nightly rate times nights times rooms. Children do not add to the price —
 * on most real rates they do not either, below an age threshold — which keeps
 * the arithmetic something a reader can check rather than a magic number.
 */
function totalFor(
  hotel: RawSampleHotel,
  query: HotelSearchQuery,
  factor = 1,
): number {
  const nights = nightsBetween(query.checkIn, query.checkOut);
  return Math.round(hotel.nightlyFrom * nights * Math.max(1, query.rooms) * factor);
}

function toHotel(raw: RawSampleHotel, query: HotelSearchQuery): Hotel {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    city: raw.city,
    country: raw.country,
    stars: raw.stars,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    image: raw.images[0] ?? null,
    summary: raw.description.length > 190
      ? `${raw.description.slice(0, 187).trimEnd()}…`
      : raw.description,
    facilityIds: raw.facilityIds,
    coordinates: { latitude: raw.latitude, longitude: raw.longitude },
    price: raw.soldOut
      ? null
      : {
          total: totalFor(raw, query),
          currency: "USD",
          offerId: `${raw.id}-offer`,
          refundable: raw.refundable,
        },
  };
}

/**
 * The display name for a place id, for rebuilding a generated property from
 * its id alone — a shared detail link carries no place name of its own.
 */
function placeNameFor(placeId: string): string {
  const place = places.find((entry) => entry.id === placeId);
  return place ? `${place.name}, ${place.detail}` : "";
}

/** Cheap deterministic hash, so a place always generates the same properties. */
function hash(seed: string): number {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) | 0;
  }
  return Math.abs(value);
}

const PHOTO_POOL = [
  "/images/home/hotel.jpg",
  "/images/home/groupimage.jpg",
  "/images/home/tokyo.jpg",
  "/images/home/why-us-road.jpg",
];

/**
 * Properties for a place with no hand-written entries.
 *
 * Barcelona, London and Tokyo have properties written out in the JSON, with
 * real districts and descriptions that actually say something. Writing that
 * for every city a traveller might type is not practical, and an autocomplete
 * that offers twenty-six cities but returns results for three is worse than
 * one that offers three.
 *
 * So the rest are generated from the place id — deterministically, so a city
 * shows the same properties on every reload and between builds, and so the
 * back button returns to the list it left.
 *
 * The names are a city plus a generic accommodation phrase ("Riverside
 * Hotel", "Station Inn") rather than anything brand-shaped. Combined with the
 * sample notice on every page, that is what keeps this from reading as a claim
 * about a real business.
 */
function generateHotels(placeId: string, placeName: string): RawSampleHotel[] {
  const city = placeName.split(",")[0].trim();
  const seed = hash(placeId);
  const count = 8 + (seed % 5);

  return Array.from({ length: count }, (_, index) => {
    const local = hash(`${placeId}#${index}`);
    const stars = 2 + (local % 4);

    // Rating tracks stars loosely, the way it does in reality, with enough
    // spread that the rating filter is not just the star filter again.
    const rating = Math.round((5.8 + stars * 0.7 + ((local >> 3) % 12) / 10) * 10) / 10;

    return {
      id: `${placeId}-gen-${index}`,
      placeIds: [placeId],
      name: `${city} ${data.generatedNames[local % data.generatedNames.length]}`,
      address: `${100 + (local % 180)} ${["High Street", "Station Road", "Market Street", "Riverside Way", "Park Avenue"][local % 5]}`,
      city,
      country: placeName.split(",").slice(-1)[0]?.trim() ?? "",
      stars,
      rating: index === count - 1 ? null : Math.min(9.7, rating),
      reviewCount: index === count - 1 ? 0 : 120 + ((local >> 5) % 4200),
      images: [
        PHOTO_POOL[local % PHOTO_POOL.length],
        PHOTO_POOL[(local + 1) % PHOTO_POOL.length],
      ],
      description: `A ${stars >= 4 ? "well-appointed" : "straightforward"} property in ${city}, ${
        stars >= 4
          ? "within walking distance of the centre and quiet enough to sleep through."
          : "close to transport and priced for it rather than for the address."
      } This is sample data and the property is not a real business.`,
      facilityIds: [1, 9, 13, ...(stars >= 3 ? [5, 12] : []), ...(stars >= 4 ? [3, 6, 14] : []), ...(stars >= 5 ? [2, 4, 16] : []), ...(local % 3 === 0 ? [7, 11] : []), ...(local % 4 === 0 ? [10] : [])],
      latitude: 0,
      longitude: 0,
      nightlyFrom: 5200 + stars * 4100 + ((local >> 7) % 60) * 110,
      refundable: local % 3 !== 0,
      // One property per city has nothing available, so that state is always
      // reachable in a demo rather than only in Barcelona.
      soldOut: index === 2,
    } satisfies RawSampleHotel;
  });
}

/** Properties for a place, paged the way the supplier pages them. */
export function sampleSearchHotels(
  query: HotelSearchQuery,
  options: { offset?: number; limit?: number } = {},
): { hotels: Hotel[]; total: number } {
  const written = hotels.filter((hotel) =>
    hotel.placeIds.includes(query.placeId),
  );

  const matching =
    written.length > 0
      ? written
      : generateHotels(query.placeId, query.placeName);

  const offset = options.offset ?? 0;
  const limit = options.limit ?? matching.length;

  return {
    hotels: matching
      .slice(offset, offset + limit)
      .map((hotel) => toHotel(hotel, query)),
    total: matching.length,
  };
}

/**
 * One property in full.
 *
 * Rooms are built from the shared templates times the property's nightly
 * rate, so a five-star returns the same room types at a higher price — which
 * is roughly how real inventory behaves and keeps the detail page exercised
 * without fourteen hand-written room lists.
 */
export function sampleHotelDetail(
  hotelId: string,
  query: HotelSearchQuery | null,
): HotelDetail | null {
  /*
    Generated ids carry their own place — `sample-paris-gen-3` — so a detail
    page can be rebuilt from the id alone. That matters because the details
    page has to work from a shared link, with no result list behind it to look
    the property up in.
  */
  const generated = hotelId.match(/^(.*)-gen-(\d+)$/);
  const raw = generated
    ? generateHotels(generated[1], query?.placeName ?? placeNameFor(generated[1]))[
        Number(generated[2])
      ]
    : hotels.find((hotel) => hotel.id === hotelId);

  if (!raw) return null;

  const rooms: HotelRoom[] = [];

  if (query && !raw.soldOut) {
    const nights = nightsBetween(query.checkIn, query.checkOut);

    for (const [index, template] of data.roomTemplates.entries()) {
      // A room that cannot hold the party is not offered, which is what the
      // supplier does and what makes the occupancy selector meaningful.
      if (template.maxOccupancy * Math.max(1, query.rooms) < query.adults) {
        continue;
      }

      const refundable = raw.refundable && index !== 0;

      rooms.push({
        offerId: `${raw.id}-offer-${index}`,
        rateId: `${raw.id}-rate-${index}`,
        name: template.name,
        board: template.board,
        total: totalFor(raw, query, template.priceFactor),
        currency: "USD",
        refundable,
        // Free cancellation until a week before arrival — stated as a real
        // date so the detail page's deadline copy has something to render.
        cancellationDeadline: refundable
          ? new Date(
              new Date(`${query.checkIn}T00:00:00Z`).getTime() -
                7 * 86_400_000,
            ).toISOString()
          : null,
        maxOccupancy: template.maxOccupancy,
        photos: raw.images,
        amenities: template.amenities,
      });

      void nights;
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    city: raw.city,
    country: raw.country,
    stars: raw.stars,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    image: raw.images[0] ?? null,
    images: raw.images,
    description: raw.description,
    facilities: raw.facilityIds
      .map((facilityId) => sampleFacilities().get(facilityId))
      .filter((name): name is string => Boolean(name)),
    facilityIds: raw.facilityIds,
    coordinates: { latitude: raw.latitude, longitude: raw.longitude },
    checkIn: "15:00",
    checkOut: "11:00",
    importantInformation:
      "This is sample data. The property, the rates and the policies shown are generated for demonstration and cannot be booked.",
    phone: null,
    rooms: rooms.sort((a, b) => a.total - b.total),
  };
}
