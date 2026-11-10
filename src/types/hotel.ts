/**
 * Hotel domain types shared by the `hotels` feature and the provider layer.
 *
 * These are OUR shapes, not a vendor's. Everything in `lib/providers/` is
 * responsible for mapping a supplier payload onto these types, so swapping a
 * hotel supplier never reaches a component — the same rule the flight types
 * follow.
 *
 * That matters more here than usual. The chosen supplier (LiteAPI) returns
 * `main_photo`, `facilityIds`, `retailRate.total[0].amount` and a
 * `refundableTag` string; none of those names appear outside
 * `lib/providers/liteapi.ts`.
 */

/** A place a traveller can search in — a city, a neighbourhood, a landmark. */
export interface PlaceSuggestion {
  /** Supplier place id, opaque to us. Carried in the URL. */
  id: string;
  /** "Barcelona" */
  name: string;
  /** "Barcelona, Spain" — the disambiguating line under the name. */
  detail: string;
  /** `locality`, `airport`, `hotel`… Used to pick an icon and to group. */
  kind: PlaceKind;
}

export type PlaceKind = "city" | "area" | "airport" | "hotel" | "place";

/** What a traveller is asking for. The URL is the source of truth for this. */
export interface HotelSearchQuery {
  /** Supplier place id. */
  placeId: string;
  /** Human label, carried so the results page can render before any fetch. */
  placeName: string;
  /** ISO date, YYYY-MM-DD. */
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

/** Sort orders the results page offers. */
export type HotelSort = "recommended" | "price-low" | "price-high" | "rating" | "stars";

/** Filters applied on top of a result set. */
export interface HotelFilters {
  /** Minor units, inclusive. Undefined means unbounded. */
  maxPrice?: number;
  /** Minimum guest rating, 0–10. */
  minRating?: number;
  /** Star ratings to include. Empty means all. */
  stars: number[];
  /** Facility ids to require. Empty means all. */
  facilities: number[];
  freeCancellation: boolean;
}

/**
 * A hotel as it appears in a result list.
 *
 * `price` is optional because content and availability are two separate
 * supplier calls: a property always has a name and a photograph, but only has
 * a price once it has been priced for specific dates and occupancy. A card
 * rendering a hotel with no price says "no availability for these dates"
 * rather than showing a blank where a number should be.
 */
export interface Hotel {
  id: string;
  name: string;
  /** Free-text address line. */
  address: string;
  city: string;
  country: string;
  /** Star rating, 0 when the supplier does not publish one. */
  stars: number;
  /** Guest review score out of 10, or null when unrated. */
  rating: number | null;
  reviewCount: number;
  /** Card image. Null renders the brand plate, as elsewhere on the site. */
  image: string | null;
  /** Short marketing description, already trimmed for a card. */
  summary: string;
  /** Supplier facility ids; resolved to names via `HOTEL_FACILITIES`. */
  facilityIds: number[];
  coordinates: { latitude: number; longitude: number } | null;
  /** Set only when the hotel was priced for the traveller's dates. */
  price: HotelPrice | null;
}

/** The total for the whole stay, for the requested occupancy. */
export interface HotelPrice {
  /** Minor units — cents. Every money value in this codebase is minor units. */
  total: number;
  currency: string;
  /** Cheapest offer id, used to deep-link a specific room. */
  offerId: string;
  /** Whether the cheapest rate can be cancelled without charge. */
  refundable: boolean;
}

/** A bookable room on the details page. */
export interface HotelRoom {
  offerId: string;
  rateId: string;
  name: string;
  /** "Room Only", "Breakfast included"… */
  board: string;
  total: number;
  currency: string;
  refundable: boolean;
  /** Plain-language deadline, or null when the supplier gives none. */
  cancellationDeadline: string | null;
  maxOccupancy: number | null;
  /** Room photographs, largest first. */
  photos: string[];
  amenities: string[];
}

/** Everything the details page renders. */
export interface HotelDetail extends Omit<Hotel, "price" | "summary"> {
  /** Full description, paragraphs preserved. */
  description: string;
  /** Gallery, largest first. */
  images: string[];
  /** Resolved facility names rather than ids — the detail call returns both. */
  facilities: string[];
  checkIn: string | null;
  checkOut: string | null;
  /** Supplier's "important information" block, when present. */
  importantInformation: string | null;
  phone: string | null;
  rooms: HotelRoom[];
}

/**
 * The result of a hotel search.
 *
 * Mirrors `FlightSearchResult` deliberately: `configured: false` means no
 * supplier is wired up in this environment, which is a distinct state from
 * "searched and found nothing". The UI must never present one as the other.
 */
export type HotelSearchResult =
  | { configured: false; hotels: []; total: 0; searchedAt: string }
  | {
      configured: true;
      /**
       * Where these properties came from.
       *
       * `supplier` is real inventory. `sample` is generated data used to build
       * and demonstrate the flow before a key is added — nothing is bookable
       * and no hotel has quoted the prices. Any page rendering `sample` MUST
       * say so prominently; see lib/providers/sample-hotels.
       */
      source: "supplier" | "sample";
      hotels: Hotel[];
      /** Total matching the query at the supplier, for pagination. */
      total: number;
      searchedAt: string;
    };
