/**
 * Quote-request types for the non-flight verticals.
 *
 * One shape covers hotels, car rental and cruises because the funnel is the same
 * in all three: the traveller tells us what they want, we come back with prices
 * with a price we can actually hold. The vertical-specific fields hang off the
 * same object rather than forcing three parallel types and three parallel
 * forms that drift apart within a month.
 *
 * As with flights, submitting this is NOT a booking. Nothing is reserved and
 * nothing is charged. That wording is load-bearing: describing a form
 * submission as a confirmed reservation would misrepresent what the traveller
 * has actually got.
 */

/**
 * `vacation` is flights and accommodation quoted as one trip. It reuses this
 * shape rather than getting its own because the funnel is identical to the
 * others — it just happens to need both a departure city and a destination,
 * which `origin` already covers for charter.
 */
export type EnquiryVertical = "stay" | "car" | "cruise" | "jet" | "vacation";

export interface Enquiry {
  vertical: EnquiryVertical;

  /**
   * Private jets only: where the aircraft departs from.
   *
   * The other three verticals have one place in them — a city, a pick-up
   * point, a sailing region — but a charter is priced on a leg, and the
   * departure airport moves the price as much as the arrival one does
   * (positioning the aircraft to you is a real cost, and it is the single
   * most common reason two quotes for "the same flight" differ).
   */
  origin?: string;

  /** City, region or — for cruises — sailing area. Free text by design. */
  destination: string;
  /** ISO date. Check-in, pick-up, or sailing date depending on vertical. */
  startDate: string;
  /** ISO date. Check-out, drop-off, or return. */
  endDate: string;

  adults: number;
  children: number;

  /** Hotels only: number of rooms required. */
  rooms?: number;
  /**
   * Car rental only. Rental companies price and refuse by driver age, so asking
   * up front avoids quoting a rate the traveller cannot actually be given.
   */
  driverAge?: number;
  /** Car rental only: where the car goes back, if not the pick-up point. */
  dropOffLocation?: string;
  /**
   * Car rental only: the vehicle class asked for.
   *
   * A class, never a model. The rental company guarantees the category and
   * picks the car within it on the day, which is the single most
   * misunderstood thing about renting — see the table on /car-rentals.
   */
  carType?: string;
  /** Cruises only: a preferred line, matched against lib/content/cruise-lines. */
  cruiseLineSlug?: string;
  /**
   * Private jets only: a preferred cabin category, matched against
   * lib/content/private-jets. A preference, never a guarantee — the aircraft
   * that is actually available on the day is the operator's to offer, and the
   * quote names the specific type and tail rather than the category.
   */
  aircraftCategorySlug?: string;
  /**
   * Private jets only: a one-way charter is priced differently from a return,
   * because an empty positioning leg has to go somewhere either way.
   */
  jetTripType?: "one-way" | "return";

  fullName: string;
  email: string;
  phone?: string;
  notes?: string;

  /** Explicit opt-in. Never pre-checked, never bundled with the Terms. */
  marketingOptIn: boolean;
  /** Acceptance of the Terms and Privacy Policy. Required to submit. */
  termsAccepted: boolean;
}

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;
