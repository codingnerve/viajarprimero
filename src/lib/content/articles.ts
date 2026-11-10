/**
 * Travel blog.
 *
 * Prose lives here as structured data rather than MDX because this project
 * carries no MDX dependency — the same decision routes.ts and destinations.ts
 * already made. A block array keeps the copy free of markup while still
 * letting `Prose` render headings, paragraphs and lists properly.
 *
 * Editorial rule for this collection: an article may explain how something
 * works, but it may not promise an outcome. "Fares tend to move this way" is
 * publishable; "book on a Tuesday to save 30%" is a fabricated claim dressed
 * up as advice, and we do not run it.
 */

export interface ArticleBlock {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly string[];
}

export interface Article {
  slug: string;
  title: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** ISO date the piece was published or last substantively revised. */
  publishedAt: string;
  category: "Planning" | "Flying" | "Money" | "Destinations";
  readingMinutes: number;
  intro: string;
  blocks: readonly ArticleBlock[];
}

export const articles: readonly Article[] = [
  {
    slug: "how-airline-pricing-actually-works",
    title: "How airline pricing actually works",
    summary:
      "Why the same seat costs different amounts on different days, and what that means for when you book.",
    publishedAt: "2026-02-11",
    category: "Money",
    readingMinutes: 7,
    intro:
      "Almost every piece of flight-booking advice you have read is a rule of thumb invented to fill an article. The underlying system is not mysterious, though, and understanding it tells you more than any day-of-the-week trick.",
    blocks: [
      {
        heading: "A flight is not one price, it is a stack of buckets",
        paragraphs: [
          "An airline does not set a single price for a route. It divides the cabin into fare buckets, each with its own price and its own conditions, and releases them in sequence. When the cheapest bucket sells out, the next one becomes the lowest available price. Nothing changed about the aircraft or the date — a quantity of inventory was simply consumed.",
          "This is why a fare can rise sharply overnight and then sit still for three weeks. You are not watching a price move; you are watching buckets empty.",
        ],
      },
      {
        heading: "Why fares sometimes fall",
        paragraphs: [
          "Airlines forecast how full a flight will be at each point before departure. When bookings run behind that forecast, the revenue management system can reopen a cheaper bucket to stimulate demand. When they run ahead, it closes cheap inventory earlier than planned.",
          "So a fare drop is a signal that the flight is selling more slowly than expected. It is genuinely unpredictable from the outside, which is the honest answer to whether you should wait.",
        ],
      },
      {
        heading: "What the fare class actually buys you",
        paragraphs: [
          "Two passengers in adjacent economy seats can hold completely different tickets. The fare class determines whether the ticket can be changed, whether it can be refunded, how much it earns, and whether a bag is included.",
          "This is the part that matters more than the headline number. A cheaper fare that cannot be changed is not cheaper if there is any real chance your dates move.",
        ],
        list: [
          "Refundability is set by the fare rules, not by the airline's goodwill.",
          "Change permissions and change fees are separate things — a ticket can be changeable and still cost you the fare difference.",
          "Basic economy fares frequently exclude seat selection and carry-on baggage entirely on some carriers.",
          "The same route on the same day can be sold under a dozen different fare rules at once.",
        ],
      },
      {
        heading: "The advice that survives contact with the system",
        paragraphs: [
          "Book when the price is one you are willing to pay for a ticket whose rules you have read. That is unsatisfying next to a promise about Tuesday afternoons, but it is the only guidance that is actually true.",
          "One thing genuinely is in your control: if your itinerary touches the United States and you booked at least seven days before departure, US Department of Transportation rules give you 24 hours to cancel for a full refund. That window is a real hedge against booking too early.",
        ],
      },
    ],
  },
  {
    slug: "what-to-check-before-you-book-a-connection",
    title: "What to check before you book a connection",
    summary:
      "Connection time is the least examined number on an itinerary and the one most likely to ruin a trip.",
    publishedAt: "2026-03-04",
    category: "Flying",
    readingMinutes: 6,
    intro:
      "A search engine will happily sell you a 50-minute connection through an airport where 50 minutes is not enough. The itinerary is legal — the airline filed it — but legal and comfortable are different standards.",
    blocks: [
      {
        heading: "Minimum connection time is a floor, not a recommendation",
        paragraphs: [
          "Every airport publishes a minimum connection time, and booking systems will build any itinerary that clears it. That figure assumes both flights are on time, that you do not need to clear immigration, and that your gates are not at opposite ends of the airport.",
          "Treat it as the point below which the connection is impossible, rather than the point above which it is fine.",
        ],
      },
      {
        heading: "The questions that actually matter",
        paragraphs: [
          "Before accepting a connection, work through these. They take two minutes and they are the difference between a tight connection and an unmakeable one.",
        ],
        list: [
          "Do you change terminal? Inter-terminal transfers at large hubs can consume half an hour on their own.",
          "Do you clear immigration and customs? Entering a country to connect means queueing, collecting bags, and re-checking them.",
          "Is it one ticket or two? On a single ticket the airline rebooks you when you misconnect. On two separate tickets, a missed connection is your problem and your cost.",
          "Is the connection the last departure of the day? If it is, a missed connection means an overnight rather than a two-hour delay.",
          "Are both flights operated by the same airline or alliance? Baggage transfer between unaffiliated carriers is frequently not through-checked.",
        ],
      },
      {
        heading: "Where the extra hour is worth paying for",
        paragraphs: [
          "On the return leg of a trip, a tight connection costs you an inconvenient evening. On the outbound leg of a trip with a fixed commitment at the other end — a wedding, a cruise departure, a conference — it can cost you the reason you travelled.",
          "The asymmetry is worth pricing. If a longer connection is available for a modest difference on the outbound, take it, and save the tight one for the way home.",
        ],
      },
      {
        heading: "If it goes wrong anyway",
        paragraphs: [
          "On a single ticket, the operating carrier is responsible for getting you to your destination, and depending on where you are flying, statutory compensation may apply on top. Keep boarding passes and any written notice of the delay reason — the claim usually turns on what the airline said caused it.",
        ],
      },
    ],
  },
  {
    slug: "reading-a-hotel-rate-before-you-book",
    title: "Reading a hotel rate before you book it",
    summary:
      "Resort fees, city taxes and the difference between a refundable and a prepaid rate.",
    publishedAt: "2026-04-22",
    category: "Money",
    readingMinutes: 5,
    intro:
      "The nightly rate is rarely what you pay. The gap between the two is entirely predictable, and it is worth knowing which parts of it are the property's choice and which are the local government's.",
    blocks: [
      {
        heading: "Three separate things get added to a nightly rate",
        paragraphs: [
          "Occupancy or tourist tax is set by the city or state and is unavoidable. In some European cities it is collected per person per night at the property rather than through the booking.",
          "Resort or destination fees are the property's own charge, presented as covering amenities you may not use. They are mandatory where they apply, which is precisely why they belong in the total rather than in a footnote.",
          "Optional extras — parking, breakfast, late checkout — are genuinely optional, but parking in a dense city can quietly exceed the room rate.",
        ],
      },
      {
        heading: "Refundable versus prepaid",
        paragraphs: [
          "A prepaid, non-refundable rate is typically the lowest price a property publishes, and it is a real saving if your dates are certain. If they are not, you have bought a discount by taking on the entire risk of the trip changing.",
          "The useful question is not which rate is cheaper but how much the flexibility costs as a percentage. When a refundable rate is a few percent more, it is usually worth it. When it is forty percent more, it is a different decision.",
        ],
      },
      {
        heading: "What to confirm before you commit",
        paragraphs: [],
        list: [
          "The total for the whole stay, taxes and mandatory fees included — not the nightly headline.",
          "The cancellation deadline in the property's local time zone, not yours.",
          "Whether the rate is per room or per person, which varies by market.",
          "What the occupancy limit actually is: a room for two is not a room for two adults and a child in much of Europe.",
          "Whether a deposit or a card pre-authorisation is taken at check-in, and how long it takes to release.",
        ],
      },
    ],
  },
  {
    slug: "car-hire-without-the-desk-surprise",
    title: "Car rental without the surprise at the desk",
    summary:
      "The excess, the fuel policy and the additional driver — the three things that decide what you actually pay.",
    publishedAt: "2026-05-19",
    category: "Planning",
    readingMinutes: 6,
    intro:
      "Car rental has the widest gap between quoted price and final bill of anything in travel. Almost all of it comes down to three decisions made at the counter, and all three can be settled before you get there.",
    blocks: [
      {
        heading: "The excess is the number that matters",
        paragraphs: [
          "Nearly every quoted rate includes damage cover with an excess — the amount you are liable for before the cover starts. It is routinely four figures, and it is held against your card for the duration of the rental.",
          "You can reduce it to zero by buying the rental company's own waiver at the desk, or by buying standalone excess insurance from an independent insurer beforehand, which is typically far cheaper. The trade-off with standalone cover is that you pay the rental company first and reclaim afterwards.",
        ],
      },
      {
        heading: "Fuel policy",
        paragraphs: [
          "Full-to-full is the only policy that cannot cost you money: you collect a full tank and return a full tank. Anything else — pre-purchase, full-to-empty — means buying fuel at the company's rate with no refund for what you leave in the tank.",
        ],
      },
      {
        heading: "Drivers and documents",
        paragraphs: [
          "Anyone who might drive must be named on the agreement. An unnamed driver at the wheel voids the cover completely, which turns a minor scrape into an uninsured loss.",
          "Bring the physical licence, the card the booking was made on in the main driver's own name, and where required an International Driving Permit. A digital licence is not accepted at most counters.",
        ],
      },
      {
        heading: "Before you drive away",
        paragraphs: [
          "Photograph the car from every corner, including the roof, the wheels and the windscreen, with the timestamp on. Do the same at return. This takes three minutes and resolves virtually every damage dispute before it starts.",
        ],
      },
    ],
  },
  {
    slug: "choosing-a-first-cruise",
    title: "Choosing a first cruise",
    summary:
      "Ship size, itinerary pace and what the fare does and does not include.",
    publishedAt: "2026-06-30",
    category: "Planning",
    readingMinutes: 6,
    intro:
      "Cruise lines differ from one another far more than airlines do. Picking the wrong one is not a matter of a slightly worse trip — it is a fortnight on a ship built for somebody else.",
    blocks: [
      {
        heading: "Ship size changes the holiday completely",
        paragraphs: [
          "A large ship is a resort that moves. It has the space for multiple restaurants, theatres and pools, and it suits travellers who are happy to spend sea days on board. It also means several thousand people going ashore at once.",
          "A smaller ship reaches ports the large ones cannot enter, and the day ashore is less crowded. There is correspondingly less to do at sea.",
        ],
      },
      {
        heading: "Read the itinerary for pace, not just for places",
        paragraphs: [
          "Two itineraries visiting the same countries can be entirely different holidays. Count the sea days and look at the hours in port — an eight-hour call, minus tendering, is a half day rather than a day.",
          "Overnight stays in port are the ones worth seeking out. They are the difference between seeing a city and seeing its cruise terminal.",
        ],
      },
      {
        heading: "What the fare includes varies enormously",
        paragraphs: [
          "This is the single biggest source of unexpected cost. Some lines build gratuities, most dining and basic drinks into the fare. Others quote a low headline fare and charge separately for nearly everything.",
        ],
        list: [
          "Gratuities: often charged per person per day to your onboard account automatically.",
          "Drinks: rarely included on mass-market lines; packages are priced per person per day and usually must be bought for every adult in the cabin.",
          "Speciality dining: main dining rooms are included, the named restaurants generally are not.",
          "Shore excursions: booked through the line they cost more, but a delay returning is the line's problem rather than yours.",
          "Port charges and government taxes: mandatory, and quoted separately by some lines.",
          "Wi-Fi: almost always extra, and satellite connectivity is not comparable to a hotel's.",
        ],
      },
      {
        heading: "The flight is part of the decision",
        paragraphs: [
          "Fly in the day before the ship sails. A cruise will not wait for a delayed flight, and the cost of a night in a hotel is trivial against the cost of missing the departure port entirely.",
        ],
      },
    ],
  },
  {
    slug: "travel-documents-and-entry-rules",
    title: "Passports, visas and the rules that catch people out",
    summary:
      "Validity windows, onward-travel proof, and why the airline checks before the border does.",
    publishedAt: "2026-07-14",
    category: "Planning",
    readingMinutes: 5,
    intro:
      "Entry rules are set by the destination government, change without much notice, and are enforced at the departure gate as well as at the border. The airline can refuse to board you, and when it does, the ticket is generally not refunded.",
    blocks: [
      {
        heading: "Passport validity is not the same as expiry",
        paragraphs: [
          "Many countries require a passport to remain valid for six months beyond your date of entry. A passport that expires in four months is a valid document that will not get you into those countries.",
          "Some also require a minimum number of blank pages. Check both before booking rather than before packing.",
        ],
      },
      {
        heading: "Electronic authorisations are not visas, but they are mandatory",
        paragraphs: [
          "Several countries require an electronic travel authorisation applied for online in advance, separate from any visa. They are usually approved quickly, but not always, and arriving without one means being turned away at check-in.",
        ],
      },
      {
        heading: "Proof of onward travel",
        paragraphs: [
          "Airlines are fined for carrying passengers who are refused entry, so they check what the border will check. On a one-way ticket to a country that requires evidence of onward travel, expect to be asked for it at the gate.",
        ],
      },
      {
        heading: "Where to check",
        paragraphs: [
          "Use the destination government's own immigration site, and your own government's travel advisory for the return. Both are authoritative in a way that no travel site, including this one, can be — rules change and only the issuing authority is current.",
          "If your itinerary involves a connection in a third country, check that country's transit rules too. Some require a transit visa even when you never leave the airport.",
        ],
      },
    ],
  },
];

const bySlug = new Map(articles.map((article) => [article.slug, article]));

export function getArticle(slug: string): Article | undefined {
  return bySlug.get(slug);
}

/** Newest first — the order the blog index and the sitemap both want. */
export function getArticlesByDate(): readonly Article[] {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
