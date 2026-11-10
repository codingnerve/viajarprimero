import type {
  JetAirport,
  JetCategorySlug,
  JetFilters,
  JetFlight,
  JetSearchQuery,
  JetSearchResult,
  JetSort,
} from "@/types/private-jet";

/**
 * SkyAccess — private-jet charter and empty-leg availability.
 *
 * The only module on the site that talks to this API. Everything above it
 * depends on `types/private-jet`, so swapping marketplaces is a change to this
 * file and nothing else.
 *
 * ## What the API is
 *
 * One POST endpoint, `/api/flight/search`, which takes a route, a date range
 * and a passenger count and returns available legs. It needs no key, which is
 * convenient and also the reason for the defensive handling below: an
 * unauthenticated public endpoint carries no contract with us, can rate-limit
 * or change shape without notice, and must never be able to take a page down.
 * Every failure here resolves to a result carrying `error`, never a throw.
 *
 * ## What it returns, and what we do with it
 *
 * Almost everything is an *empty leg* — an aircraft repositioning without
 * passengers, sold cheaply because the flight is happening regardless. That
 * shapes the mapping:
 *
 * - **Departure is a window, not a time.** The payload carries
 *   `earliestDepartureTime` and `latestDepartureTime`, often eleven hours
 *   apart. Rendering the first as "departs 09:06" would be a lie, so the
 *   window survives into our type intact.
 * - **Price is frequently modelled rather than quoted.** `isPriceEstimated`
 *   and `isPriceVerified` are carried through so the UI can say which it is.
 * - **`retailPrice` and `dealTag` are dropped.** We cannot substantiate what
 *   the "retail" figure is a retail price *of*, and a struck-through number we
 *   cannot verify is the exact fabrication this project forbids.
 * - **The airport is rarely the one searched.** A "Los Angeles" search returns
 *   Van Nuys, Burbank and Long Beach. `distanceFromRequestedOrigin` is kept so
 *   the card can say how far out it is.
 *
 * ## Limitations worth knowing
 *
 * - Paging is cursor-based and opaque, and `total` only arrives on the first
 *   page — so results can go forward but not to an arbitrary page number.
 * - There is no autocomplete endpoint. Origin and destination are free text,
 *   which the API resolves generously ("New York" finds nine fields); the
 *   picklist in the search form is a convenience, not a constraint.
 * - Sort by price returns an integer offset as the cursor rather than a
 *   timestamp. Both are opaque to us, which is why the type says so.
 */

const API_URL =
  process.env.SKYACCESS_API_URL ?? "https://api.skyaccess.com/api/flight/search";

/**
 * Availability is live and legs are withdrawn without notice, but a results
 * page must not hammer a public endpoint on every reload either. Three
 * minutes is short enough that a sold leg disappears quickly and long enough
 * that a traveller adjusting filters is not re-querying from scratch.
 */
const SEARCH_TTL = 180;

/** A slow supplier must not hold a page open indefinitely. */
const TIMEOUT_MS = 12_000;

/** How far around a city the supplier looks for airports, in miles. */
const SEARCH_RADIUS_MILES = 60;

export const JETS_PER_PAGE = 24;

/**
 * The supplier's aircraft classes, mapped to the ones we already publish at
 * `/private-jets/aircraft`. Keeping one vocabulary means the filter, the card
 * and the editorial pages all say the same word for the same aeroplane.
 */
const CATEGORY_BY_VENDOR: Record<string, JetCategorySlug> = {
  TURBOPROP: "turboprop",
  VERY_LIGHT_JET: "very-light-jet",
  LIGHT_JET: "light-jet",
  MID_SIZE_JET: "midsize-jet",
  SUPER_MID_SIZE_JET: "super-midsize-jet",
  HEAVY_JET: "heavy-jet",
  ULTRA_LONG_RANGE: "ultra-long-range-jet",
  VIP_AIRLINER: "vip-airliner",
};

const VENDOR_BY_CATEGORY: Record<JetCategorySlug, string> = Object.fromEntries(
  Object.entries(CATEGORY_BY_VENDOR).map(([vendor, slug]) => [slug, vendor]),
) as Record<JetCategorySlug, string>;

/** Readable names for categories, including any the supplier adds later. */
const CATEGORY_NAMES: Record<JetCategorySlug, string> = {
  turboprop: "Turboprop",
  "very-light-jet": "Very light jet",
  "light-jet": "Light jet",
  "midsize-jet": "Midsize jet",
  "super-midsize-jet": "Super-midsize jet",
  "heavy-jet": "Heavy jet",
  "ultra-long-range-jet": "Ultra long range",
  "vip-airliner": "VIP airliner",
};

export function jetCategoryName(slug: JetCategorySlug): string {
  return CATEGORY_NAMES[slug];
}

export const JET_CATEGORY_ORDER: readonly JetCategorySlug[] = [
  "turboprop",
  "very-light-jet",
  "light-jet",
  "midsize-jet",
  "super-midsize-jet",
  "heavy-jet",
  "ultra-long-range-jet",
  "vip-airliner",
];

/* ── Vendor payload, described only as far as we read it ─────────────────── */

interface VendorAirport {
  code?: string | null;
  iataCode?: string | null;
  icaoCode?: string | null;
  name?: string | null;
  city?: string | null;
  municipality?: string | null;
  state?: string | null;
  isoRegion?: string | null;
  country?: string | null;
  isoCountry?: string | null;
  timezone?: string | null;
  lat?: number | null;
  lng?: number | null;
  latitudeDeg?: number | null;
  longitudeDeg?: number | null;
}

interface VendorFlight {
  id?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  earliestDepartureTime?: string;
  latestDepartureTime?: string;
  earliestDepartureTimeLocal?: string;
  latestDepartureTimeLocal?: string;
  departureTimeLocal?: string;
  originTimezone?: string;
  availableSeats?: number;
  finalPrice?: number | null;
  flightDuration?: number | null;
  distance?: number | null;
  images?: unknown;
  isPriceEstimated?: boolean;
  isPriceVerified?: boolean;
  isInstantBookable?: boolean;
  distanceFromRequestedOrigin?: number | null;
  distanceFromRequestedDest?: number | null;
  jetModel?: string | null;
  aircraftModel?: {
    name?: string | null;
    category?: string | null;
    seatsCapacity?: number | null;
    luggageVolume?: number | null;
  } | null;
  aircraft?: {
    notes?: string | null;
    images?: unknown;
  } | null;
  originAirport?: VendorAirport | null;
  destinationAirport?: VendorAirport | null;
  destAirport?: VendorAirport | null;
  operator?: {
    hasArgus?: boolean;
    argusLevel?: string | null;
    hasWyvern?: boolean;
    hasIsBao?: boolean;
    pricingConfirmed?: boolean;
  } | null;
}

interface VendorResponse {
  results?: VendorFlight[];
  total?: number | null;
  cursor?: string | number | null;
  priceRange?: { min?: number; max?: number } | null;
  availableAircraftModels?: unknown;
  searchCriteria?: {
    routes?: Array<{
      originLocation?: { codes?: string[]; idents?: string[] } | null;
      destinationLocation?: { codes?: string[]; idents?: string[] } | null;
    }>;
  } | null;
}

/* ── Mapping ─────────────────────────────────────────────────────────────── */

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** The first of two candidate fields that is actually a finite number. */
function numberOr(...candidates: unknown[]): number | null {
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

/**
 * The supplier describes the same airport with two different field sets
 * depending on which join produced it — `city`/`state`/`country` in one,
 * `municipality`/`isoRegion`/`isoCountry` in the other, sometimes both on the
 * same flight. Reading both is cheaper than guessing which one we got.
 */
function mapAirport(raw: VendorAirport | null | undefined): JetAirport {
  const region = text(raw?.state) || text(raw?.isoRegion).replace(/^[A-Z]{2}-/, "");

  const lat = numberOr(raw?.lat, raw?.latitudeDeg);
  const lng = numberOr(raw?.lng, raw?.longitudeDeg);

  return {
    code: text(raw?.code) || text(raw?.iataCode),
    icao: text(raw?.icaoCode),
    name: text(raw?.name),
    city: text(raw?.city) || text(raw?.municipality),
    region,
    country: text(raw?.country) || text(raw?.isoCountry),
    lat,
    lng,
  };
}

/**
 * A label for an airport that never renders as an empty string or a stray
 * comma, however sparse the supplier's record is.
 */
export function airportLabel(airport: JetAirport): string {
  const place = [airport.city, airport.region, airport.country]
    .filter(Boolean)
    .join(", ");
  return place || airport.name || airport.icao || airport.code;
}

/**
 * Aircraft photography.
 *
 * The supplier sends as many as fifteen frames per aircraft, in two shapes:
 * a flat list of URLs at the top level and a richer list of objects under
 * `aircraft.images`. Both are read, the flat one first, and duplicates are
 * dropped — the two overlap on most flights but not all.
 *
 * Twelve is the cap. The card shows the first few and the detail view walks
 * the rest, and past a dozen a traveller is looking at the same cabin from
 * the same angle again.
 */
function mapImages(top: unknown, nested: unknown): readonly string[] {
  const urls: string[] = [];

  const push = (value: unknown) => {
    const url =
      typeof value === "string"
        ? value
        : typeof value === "object" && value !== null && "url" in value
          ? (value as { url?: unknown }).url
          : null;

    if (typeof url !== "string" || !url.startsWith("https://")) return;
    if (!urls.includes(url)) urls.push(url);
  };

  if (Array.isArray(top)) top.forEach(push);
  if (Array.isArray(nested)) nested.forEach(push);

  return urls.slice(0, 12);
}

/**
 * What is fitted in the cabin.
 *
 * Arrives as one comma-separated string — "Wi-Fi, Entertainment, Lavatory,
 * Power, Audio System" — and is genuinely absent on roughly a third of
 * flights. An empty list is returned for those rather than a default fit,
 * because telling somebody a jet has a lavatory when the operator did not
 * say so is exactly the kind of detail that gets discovered at 40,000 feet.
 */
function mapAmenities(raw: unknown): readonly string[] {
  if (typeof raw !== "string") return [];

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function mapFlight(raw: VendorFlight): JetFlight | null {
  const id = text(raw.id);
  if (!id) return null;

  const earliest =
    text(raw.earliestDepartureTime) || text(raw.departureTime);
  if (!earliest) return null;

  const latest = text(raw.latestDepartureTime) || earliest;

  const vendorCategory = text(raw.aircraftModel?.category);
  const categorySlug = CATEGORY_BY_VENDOR[vendorCategory] ?? null;

  /*
    The price arrives in whole units of currency; everything that formats money
    on this site takes minor units. Converting here rather than at the call
    site is what stops one card rendering $13,400 as $134.
  */
  const amount =
    typeof raw.finalPrice === "number" && raw.finalPrice > 0
      ? Math.round(raw.finalPrice * 100)
      : null;

  const audits: string[] = [];
  if (raw.operator?.hasArgus) {
    audits.push(
      raw.operator.argusLevel ? `ARGUS ${raw.operator.argusLevel}` : "ARGUS",
    );
  }
  if (raw.operator?.hasWyvern) audits.push("Wyvern");
  if (raw.operator?.hasIsBao) audits.push("IS-BAO");

  return {
    id,
    origin: mapAirport(raw.originAirport),
    destination: mapAirport(raw.destinationAirport ?? raw.destAirport),
    departure: {
      earliest,
      latest,
      earliestLocal:
        text(raw.earliestDepartureTimeLocal) || text(raw.departureTimeLocal),
      latestLocal: text(raw.latestDepartureTimeLocal),
      timezone: text(raw.originTimezone),
      /*
        Under an hour of slack is scheduling noise, not a window the traveller
        has to plan around. Above it, the distinction is the product.
      */
      isWindow:
        latest !== earliest &&
        Date.parse(latest) - Date.parse(earliest) > 60 * 60 * 1000,
    },
    aircraft: {
      model: text(raw.aircraftModel?.name) || text(raw.jetModel),
      categorySlug,
      categoryName: categorySlug
        ? CATEGORY_NAMES[categorySlug]
        : vendorCategory.toLowerCase().replace(/_/g, " "),
      seatsCapacity:
        typeof raw.aircraftModel?.seatsCapacity === "number"
          ? raw.aircraftModel.seatsCapacity
          : null,
      luggageVolume:
        typeof raw.aircraftModel?.luggageVolume === "number"
          ? raw.aircraftModel.luggageVolume
          : null,
      amenities: mapAmenities(raw.aircraft?.notes),
    },
    availableSeats:
      typeof raw.availableSeats === "number" ? raw.availableSeats : 0,
    durationMinutes:
      typeof raw.flightDuration === "number" && raw.flightDuration > 0
        ? Math.round(raw.flightDuration)
        : null,
    distanceNm:
      typeof raw.distance === "number" && raw.distance > 0
        ? Math.round(raw.distance)
        : null,
    images: mapImages(raw.images, raw.aircraft?.images),
    price:
      amount === null
        ? null
        : {
            amountMinorUnits: amount,
            currency: "USD",
            estimated: raw.isPriceEstimated !== false,
            verified: raw.isPriceVerified === true,
          },
    originDistanceMiles:
      typeof raw.distanceFromRequestedOrigin === "number"
        ? Math.round(raw.distanceFromRequestedOrigin)
        : null,
    destinationDistanceMiles:
      typeof raw.distanceFromRequestedDest === "number"
        ? Math.round(raw.distanceFromRequestedDest)
        : null,
    operatorAudits: audits,
    instantBookable: raw.isInstantBookable === true,
    operatorPricingConfirmed: raw.operator?.pricingConfirmed === true,
  };
}

/* ── The request ─────────────────────────────────────────────────────────── */

const SORT_KEYS: Record<JetSort, { sortKey: string; sortDirection: string }> = {
  departure: { sortKey: "departureTime", sortDirection: "asc" },
  "price-asc": { sortKey: "price", sortDirection: "asc" },
  "price-desc": { sortKey: "price", sortDirection: "desc" },
};

/**
 * Which airports the supplier decided a place name meant.
 *
 * It answers with IATA codes when it resolved to airports and only ICAO
 * idents when it resolved to a city — a `{ kind: "city" }` match carries no
 * `codes` at all — so reading one field alone silently drops the list for
 * every European search. Stripping the leading K off a US ident keeps the
 * fallback readable.
 */
function resolvedCodes(
  location: { codes?: string[]; idents?: string[] } | null | undefined,
): readonly string[] {
  const codes = location?.codes?.filter(Boolean) ?? [];
  if (codes.length > 0) return codes.slice(0, 8);

  return (location?.idents ?? [])
    .filter(Boolean)
    .map((ident) => (/^K[A-Z]{3}$/.test(ident) ? ident.slice(1) : ident))
    .slice(0, 8);
}

function emptyResult(error: string | null): JetSearchResult {
  return {
    flights: [],
    total: error ? null : 0,
    nextCursor: null,
    priceRange: null,
    availableModels: [],
    resolvedOriginCodes: [],
    resolvedDestinationCodes: [],
    error,
  };
}

/**
 * Run a search.
 *
 * Never throws. A timeout, a rate limit, a 500 or a body that is not the shape
 * we expect all come back as a result carrying `error`, because the results
 * page has a specific thing to say for each outcome and none of them is a
 * stack trace.
 */
export async function searchJetFlights(
  query: JetSearchQuery,
  options: {
    filters?: JetFilters;
    sort?: JetSort;
    cursor?: string | null;
    pageSize?: number;
  } = {},
): Promise<JetSearchResult> {
  const { filters, sort = "departure", cursor = null } = options;

  const body = {
    routes: [
      {
        origin: query.origin,
        destination: query.destination,
      },
    ],
    passengers: query.passengers,
    date_from: query.departOn,
    date_to: query.departUntil,
    isDateAnytime: false,
    aircraftModels: [],
    aircraftCategories: (filters?.categories ?? []).map(
      (slug) => VENDOR_BY_CATEGORY[slug],
    ),
    status: "PUBLISHED",
    /*
      The supplier wants either both bounds or null. Sending one half of a
      range returns everything, silently — which reads to the traveller as a
      filter that does nothing.
    */
    priceRange:
      filters?.minPrice !== null &&
      filters?.minPrice !== undefined &&
      filters?.maxPrice !== null &&
      filters?.maxPrice !== undefined
        ? { min: filters.minPrice, max: filters.maxPrice }
        : null,
    showHiddenReroutes: false,
    searchRadius: SEARCH_RADIUS_MILES,
    forceRadiusSearch: false,
    includeOperatorCerts: true,
    cursor,
    pageSize: options.pageSize ?? JETS_PER_PAGE,
    ...SORT_KEYS[sort],
    "x-search-source": "filter-change",
  };

  let payload: VendorResponse;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: SEARCH_TTL },
    });

    if (!response.ok) {
      return emptyResult(
        response.status === 429
          ? "The charter marketplace is rate limiting us at the moment."
          : `The charter marketplace returned an error (${response.status}).`,
      );
    }

    payload = (await response.json()) as VendorResponse;
  } catch (error) {
    return emptyResult(
      error instanceof Error && error.name === "TimeoutError"
        ? "The charter marketplace did not respond in time."
        : "We could not reach the charter marketplace.",
    );
  }

  if (!Array.isArray(payload.results)) {
    return emptyResult("The charter marketplace sent a response we could not read.");
  }

  const flights = payload.results
    .map(mapFlight)
    .filter((flight): flight is JetFlight => flight !== null);

  const route = payload.searchCriteria?.routes?.[0];

  /*
    `total` is only reported on the first page of a cursor walk; later pages
    carry 0, which is not the same thing as "no results" and must not render
    as one. Null means "not stated".
  */
  const total =
    cursor === null && typeof payload.total === "number" ? payload.total : null;

  /*
    The supplier returns a cursor even on the last page, so trusting it blindly
    produces a "Next" link to an empty page. A short page is the reliable
    end-of-results signal.
  */
  const pageSize = options.pageSize ?? JETS_PER_PAGE;
  const nextCursor =
    flights.length >= pageSize && payload.cursor != null
      ? String(payload.cursor)
      : null;

  return {
    flights,
    total,
    nextCursor,
    priceRange:
      payload.priceRange &&
      typeof payload.priceRange.min === "number" &&
      typeof payload.priceRange.max === "number"
        ? { min: payload.priceRange.min, max: payload.priceRange.max }
        : null,
    availableModels: Array.isArray(payload.availableAircraftModels)
      ? payload.availableAircraftModels.filter(
          (entry): entry is string => typeof entry === "string",
        )
      : [],
    resolvedOriginCodes: resolvedCodes(route?.originLocation),
    resolvedDestinationCodes: resolvedCodes(route?.destinationLocation),
    error: null,
  };
}
