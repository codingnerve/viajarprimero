/**
 * Published deals.
 *
 * THIS ARRAY IS EMPTY ON PURPOSE, and adding to it is a commitment.
 *
 * A "deal" page is the highest-risk surface on a travel site. The conventional
 * version — tiles reading "New York to Miami from $79" with no date, no fare
 * rules and no supplier named — is an advertised price the business cannot
 * honour on demand, which is precisely what Google Ads' Misrepresentation
 * policy prohibits and what consumer-protection regulators treat as bait
 * advertising.
 *
 * The type below therefore makes an unsubstantiated deal impossible to
 * express: every field a traveller would need in order to hold us to the
 * price is required. If you cannot fill one in, you do not have a deal — you
 * have an advertisement, and it does not go on this site.
 *
 * `/deals` renders a plain "nothing published right now" state while this is
 * empty, and is noindexed in that state so an empty page does not get
 * indexed as thin content.
 */
export interface Deal {
  slug: string;
  title: string;
  /** Which vertical the offer belongs to. */
  vertical: "flight" | "stay" | "car" | "cruise";

  /** The supplier actually providing it. Never "various". */
  supplier: string;

  /** Total price in minor units, all mandatory charges included. */
  totalMinorUnits: number;
  currency: string;
  /** What the total covers, e.g. "per person, round trip, taxes included". */
  priceBasis: string;

  /** ISO dates. The travel window the price applies to. */
  travelFrom: string;
  travelTo: string;
  /** ISO date this offer stops being bookable. Required — offers expire. */
  bookByDate: string;

  /** ISO timestamp we last confirmed this price was live with the supplier. */
  verifiedAt: string;

  /**
   * The conditions in full. Not a footnote — a traveller must be able to read
   * why the price might not be available to them before they click.
   */
  conditions: readonly string[];
}

export const deals: readonly Deal[] = [];

/**
 * Deal categories — the Deals dropdown in the header, the /deals page and the
 * home page all read this list. Each `slug` is the anchor on /deals.
 *
 * Descriptions say what to ask for, not a price: an agent quotes the actual
 * offer on the call.
 */
export interface DealCategory {
  slug: string;
  label: string;
  description: string;
}

export const dealGroups: readonly {
  title: string;
  items: readonly DealCategory[];
}[] = [
  {
    title: "Flight deals",
    items: [
      {
        slug: "last-minute-flight-deals",
        label: "Last minute flight deals",
        description: "Leaving soon? We check the seats still open for your dates.",
      },
      {
        slug: "coupon-deals",
        label: "Coupon and promo code deals",
        description:
          "We check partner coupons and our own codes against your route and apply whichever is lower.",
      },
      {
        slug: "business-class-flights",
        label: "Business class flights",
        description:
          "Negotiated and consolidator business class fares, where one is released for your route.",
      },
      {
        slug: "top-airline-deals",
        label: "Top airline deals",
        description: "Current offers from the major US and international airlines.",
      },
      {
        slug: "student-travel-deals",
        label: "Student travel deals",
        description: "Fares for students heading to campus, home or abroad.",
      },
      {
        slug: "deals-for-seniors",
        label: "Deals for seniors",
        description: "Senior fares and help with assistance, seats and bags.",
      },
    ],
  },
  {
    title: "By service",
    items: [
      {
        slug: "flight-hotel-deals",
        label: "Flight + hotel deals",
        description:
          "Packaged together the total is often lower than booking separately — the agent checks both ways for your dates.",
      },
      {
        slug: "hotel-deals",
        label: "Hotel deals",
        description: "Negotiated and partner rates in the cities and resorts you are going to.",
      },
      {
        slug: "car-deals",
        label: "Car deals",
        description: "Rental offers at airports and city locations.",
      },
      {
        slug: "cruise-deals",
        label: "Cruise deals",
        description: "Sailing offers, cabin upgrades and onboard credit, where the line is running them.",
      },
      {
        slug: "private-jet-deals",
        label: "Private jet deals",
        description: "Empty legs and one-way charter offers.",
      },
      {
        slug: "vacation-deals",
        label: "Vacation deals",
        description:
          "Operator packages with the flight, stay and transfers priced as one.",
      },
    ],
  },
  {
    title: "By traveller",
    items: [
      {
        slug: "couples-deals",
        label: "Couples deals",
        description: "Trips for two — getaways, city breaks and beach stays.",
      },
      {
        slug: "honeymoon-deals",
        label: "Honeymoon deals",
        description: "Honeymoon packages with room upgrades where hotels offer them.",
      },
      {
        slug: "family-deals",
        label: "Family deals",
        description: "Family rooms, child fares and trips that suit kids.",
      },
      {
        slug: "newborn-deals",
        label: "Newborn deals",
        description: "Travelling with a baby — infant fares, bassinet seats and cots.",
      },
      {
        slug: "solo-traveller-deals",
        label: "Solo traveller deals",
        description: "Single-occupancy rooms and solo fares without the usual supplement.",
      },
      {
        slug: "group-deals",
        label: "Group deals",
        description: "Group fares and room blocks for 10 or more travellers.",
      },
    ],
  },
  {
    title: "For our customers",
    items: [
      {
        slug: "existing-customer-deals",
        label: "Existing customer deals",
        description: "Booked with us before? Ask for your returning customer offer.",
      },
      {
        slug: "double-deals",
        label: "Double deals",
        description:
          "Where a supplier lets two offers apply to the same booking, we apply both. Not every offer combines — the agent tells you which do.",
      },
    ],
  },
];

/** Offers still bookable today, newest verification first. */
export function getLiveDeals(now = new Date()): readonly Deal[] {
  const today = now.toISOString().slice(0, 10);

  return deals
    .filter((deal) => deal.bookByDate >= today)
    .sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
}
