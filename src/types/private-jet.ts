/**
 * Our own shape for a private-jet flight.
 *
 * Nothing here is a supplier payload. `lib/providers/skyaccess` maps into
 * these types and nothing outside that folder has ever seen the vendor's
 * field names — which is the whole point: a second charter marketplace is a
 * change to one file, not to every card and filter on the site.
 *
 * The flights behind this are overwhelmingly *empty legs* — aircraft
 * repositioning without passengers — so the type carries the things that make
 * that product honest to sell: a departure window rather than a departure
 * time, whether the price has actually been confirmed with the operator, and
 * how far the aircraft's real airport is from the city that was searched.
 */

/** The aircraft classes we publish, keyed to `lib/content/private-jets`. */
export type JetCategorySlug =
  | "turboprop"
  | "very-light-jet"
  | "light-jet"
  | "midsize-jet"
  | "super-midsize-jet"
  | "heavy-jet"
  | "ultra-long-range-jet"
  | "vip-airliner";

export interface JetAirport {
  /** IATA where the field has one — many private fields do not. */
  code: string;
  /** ICAO. Every field has one, so this is the reliable identifier. */
  icao: string;
  name: string;
  city: string;
  /** State or region, where the supplier gave one. */
  region: string;
  country: string;
  /**
   * Position, for the route map. Null where the supplier omitted it, which
   * the map treats as "do not draw" rather than as zero — 0,0 is the Gulf of
   * Guinea, and an airport plotted there is worse than no map.
   */
  lat: number | null;
  lng: number | null;
}

/**
 * When the aircraft can leave.
 *
 * An empty leg rarely has a fixed departure time — the operator holds a window
 * and the exact slot is agreed afterwards. Publishing the window's start as
 * though it were a scheduled departure is the single most misleading thing a
 * charter listing can do, so the window is modelled explicitly and the card
 * renders it as a window.
 */
export interface JetDeparture {
  /** ISO timestamp of the earliest legal departure. */
  earliest: string;
  /** ISO timestamp of the latest legal departure. */
  latest: string;
  /** The supplier's own local-time rendering, already in the airport's zone. */
  earliestLocal: string;
  latestLocal: string;
  /** IANA zone of the departure airport, for our own formatting. */
  timezone: string;
  /** True when earliest and latest are far enough apart to matter. */
  isWindow: boolean;
}

export interface JetPrice {
  /** Minor units, to match `formatCurrency` everywhere else on the site. */
  amountMinorUnits: number;
  currency: string;
  /**
   * The supplier modelled this rather than reading it from the operator.
   * Surfaced on the card — an estimate presented as a quote is the complaint
   * this whole vertical attracts.
   */
  estimated: boolean;
  /** The operator has confirmed this figure. Rare, and worth saying when true. */
  verified: boolean;
}

export interface JetAircraft {
  /** Specific type: "Bombardier Challenger 300". Never a category. */
  model: string;
  categorySlug: JetCategorySlug | null;
  /** Our display name for the category, or the supplier's raw value. */
  categoryName: string;
  /** Maximum passengers the type carries, where the supplier stated it. */
  seatsCapacity: number | null;
  /** Baggage hold in cubic metres, where stated. */
  luggageVolume: number | null;
  /**
   * What is fitted in this cabin — Wi-Fi, lavatory, galley, pets allowed.
   *
   * Comes from the operator via the supplier, one entry per item. Empty
   * for the aircraft where no list was supplied, which is a real and
   * common state: roughly a third of results carry nothing here, and the
   * detail view must say nothing rather than assume a standard fit.
   */
  amenities: readonly string[];
}

export interface JetFlight {
  id: string;
  origin: JetAirport;
  destination: JetAirport;
  departure: JetDeparture;
  aircraft: JetAircraft;
  /** Seats the operator is actually selling on this leg. */
  availableSeats: number;
  /** Block time in minutes, where the supplier calculated it. */
  durationMinutes: number | null;
  /** Great-circle distance in nautical miles. */
  distanceNm: number | null;
  /** Aircraft photography, already absolute HTTPS URLs. */
  images: readonly string[];
  /** Null when the supplier would not put a number on it. */
  price: JetPrice | null;
  /**
   * How far the departure field is from the city that was searched, in miles.
   * A "Los Angeles" search legitimately returns Van Nuys; the traveller has to
   * be told that before they plan a journey to LAX.
   */
  originDistanceMiles: number | null;
  destinationDistanceMiles: number | null;
  /** Third-party safety audits the operator holds. */
  operatorAudits: readonly string[];
  /** The supplier will take a booking without a broker in the loop. */
  instantBookable: boolean;
  /**
   * The operator has confirmed its pricing with the supplier.
   *
   * Not the same as `price.verified`, which is about this specific figure.
   * This is about the operator keeping its rates current at all, and it is
   * the difference between an estimate built on fresh numbers and one
   * built on stale ones.
   */
  operatorPricingConfirmed: boolean;
}

/** A departure or arrival place the traveller can pick. */
export interface JetHub {
  /** The string handed to the supplier, e.g. "New York, NY, United States". */
  query: string;
  label: string;
  detail: string;
}

/** A search, as parsed from the URL. */
export interface JetSearchQuery {
  /** Free text. The supplier resolves it to a set of airports. */
  origin: string;
  /** Free text, or empty for "anywhere". */
  destination: string;
  /** ISO date. */
  departOn: string;
  /** ISO date. Equal to `departOn` for a single day, later for a window. */
  departUntil: string;
  passengers: number;
}

/** Filters applied on top of a search. All are passed to the supplier. */
export interface JetFilters {
  categories: readonly JetCategorySlug[];
  /** Whole units of currency, not minor units — these come from the URL. */
  minPrice: number | null;
  maxPrice: number | null;
}

export type JetSort = "departure" | "price-asc" | "price-desc";

/**
 * What a search came back with.
 *
 * The three failure modes are kept apart deliberately, as on the hotel and
 * flight results pages: not configured, the supplier failed, and the supplier
 * answered with nothing. Collapsing them tells the traveller something untrue
 * about availability.
 */
export interface JetSearchResult {
  flights: readonly JetFlight[];
  /**
   * Total matching the search. The supplier only reports this on the first
   * page of a cursor walk, so it is null on subsequent pages rather than 0.
   */
  total: number | null;
  /** Opaque. Pass it back to get the next page; null when there is none. */
  nextCursor: string | null;
  /** The full price span before filtering, for the price filter's bounds. */
  priceRange: { min: number; max: number } | null;
  /** Aircraft types present in this search, for the model filter. */
  availableModels: readonly string[];
  /** Airports the supplier resolved the origin text to. */
  resolvedOriginCodes: readonly string[];
  resolvedDestinationCodes: readonly string[];
  /** Set when the request itself failed. The page says so rather than "none". */
  error: string | null;
}
