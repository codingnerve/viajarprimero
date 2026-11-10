/**
 * Private aviation content.
 *
 * The same rule as every other content module here: nothing in this file may
 * be a claim the business cannot stand behind. That constrains this vertical
 * harder than the others, because private aviation marketing is built almost
 * entirely on numbers nobody substantiates — "from $4,900 an hour", "3,000
 * aircraft in our fleet", "guaranteed availability in 4 hours".
 *
 * So what is here is:
 *
 *  - Aircraft *categories*, which are an industry-standard taxonomy, with
 *    seat counts, ranges and cabin dimensions given as the ranges they
 *    genuinely are. Named types are cited as examples of a category, which is
 *    a statement of fact about the aircraft, not a claim to operate one.
 *  - Route distances, which are great-circle arithmetic and do not change.
 *  - Block times as ranges, explicitly tied to a category and marked
 *    approximate, because a light jet and an ultra-long-range aircraft fly the
 *    same leg an hour apart.
 *  - Explanations of how charter pricing actually works.
 *
 * What is deliberately NOT here: hourly rates, fleet sizes, aircraft counts,
 * response-time guarantees, safety ratings we did not audit, and individual
 * flights. Availability is live and belongs to the charter marketplace behind
 * `lib/providers/skyaccess` — a hand-maintained list of empty legs in this
 * file would be stale within hours of anyone writing it, and a stale empty leg
 * is the single most common misrepresentation in this corner of the industry.
 *
 * We are a charter broker: we arrange flights operated by licensed air
 * carriers. We do not own, operate or crew aircraft, and no wording in this
 * file may imply otherwise. In the United States that distinction is the
 * difference between a broker and a Part 135 certificate holder, and it is
 * not a marketing nuance.
 */

export interface AircraftCategory {
  slug: string;
  name: string;
  /** Passengers in a typical layout, as a range. */
  seats: string;
  /** Still-air range with typical payload, nautical miles, as a range. */
  rangeNm: string;
  /** Approximate non-stop reach, in plain language. */
  reach: string;
  /** Typical cruise speed, knots true airspeed. */
  cruiseKts: string;
  cabinHeight: string;
  baggage: string;
  /** Whether a cabin attendant is usual, and whether there is an enclosed lav. */
  cabin: string;
  /** The trip this category is genuinely the right answer for. */
  bestFor: string;
  /** The honest downside. Every category has one. */
  tradeOff: string;
  /**
   * Types commonly operated in this category. Naming them describes the
   * category; it is not a statement that we have one available.
   */
  examples: readonly string[];
}

/**
 * The eight categories, smallest to largest.
 *
 * Ranges are the manufacturers' published figures for representative types,
 * rounded and given as spans. Real-world range is always lower — headwind,
 * payload, reserves and runway all take a bite — which is why the `reach`
 * field is written in cities rather than numbers wherever it can be.
 */
export const aircraftCategories: readonly AircraftCategory[] = [
  {
    slug: "turboprop",
    name: "Turboprop",
    seats: "6–9",
    rangeNm: "1,000–1,800",
    reach: "Regional hops — New York to Chicago, London to Edinburgh",
    cruiseKts: "270–320",
    cabinHeight: "1.45–1.50 m",
    baggage: "Modest, but often accessible in flight",
    cabin: "Single pilot or two crew, no cabin attendant",
    bestFor:
      "Short legs into small fields. A turboprop can use runways a jet cannot, which on regional trips often puts you closer to where you are actually going.",
    tradeOff:
      "Slower and noisier than a jet, and it flies lower, so it works around weather rather than over it.",
    examples: ["Pilatus PC-12", "Beechcraft King Air 350", "Cessna Caravan"],
  },
  {
    slug: "very-light-jet",
    name: "Very light jet",
    seats: "4–6",
    rangeNm: "1,100–1,500",
    reach: "Miami to New York, London to Nice",
    cruiseKts: "340–400",
    cabinHeight: "1.42–1.47 m",
    baggage: "One soft bag per passenger, realistically",
    cabin: "Two crew, compact or partitioned lavatory",
    bestFor:
      "Two to four people on a short leg who want jet speed at the bottom of the jet market.",
    tradeOff:
      "Baggage is the binding constraint far more often than seats are. Golf clubs and ski bags rarely fit.",
    examples: ["Cessna Citation M2", "Embraer Phenom 100", "HondaJet Elite"],
  },
  {
    slug: "light-jet",
    name: "Light jet",
    seats: "6–8",
    rangeNm: "1,500–2,300",
    reach: "New York to Miami, London to Rome, Los Angeles to Seattle",
    cruiseKts: "400–450",
    cabinHeight: "1.45–1.50 m",
    baggage: "Enough for a week for six, not for six people's ski kit",
    cabin: "Two crew, enclosed lavatory on most types",
    bestFor:
      "The workhorse of domestic charter. Most short-haul private trips are flown on one of these, and for good reason.",
    tradeOff:
      "You cannot stand up. On anything over two hours that starts to matter.",
    examples: [
      "Cessna Citation CJ3+",
      "Embraer Phenom 300E",
      "Learjet 75 Liberty",
    ],
  },
  {
    slug: "midsize-jet",
    name: "Midsize jet",
    seats: "7–9",
    rangeNm: "2,000–3,000",
    reach: "Transcontinental US in one hop in most wind conditions",
    cruiseKts: "430–470",
    cabinHeight: "1.70–1.75 m",
    baggage: "Genuine luggage space, usually accessible in flight",
    cabin: "Two crew, enclosed lavatory, cabin attendant optional",
    bestFor:
      "The first category where the cabin stops being a compromise. A stand-up-ish cabin and a real baggage hold.",
    tradeOff:
      "Coast-to-coast westbound against winter headwinds can still force a fuel stop.",
    examples: [
      "Cessna Citation XLS+",
      "Hawker 900XP",
      "Learjet 60XR",
    ],
  },
  {
    slug: "super-midsize-jet",
    name: "Super-midsize jet",
    seats: "8–10",
    rangeNm: "3,000–3,900",
    reach: "New York to Los Angeles nonstop; London to the Middle East",
    cruiseKts: "460–500",
    cabinHeight: "1.80–1.85 m",
    baggage: "Large, accessible in flight",
    cabin: "Two crew, full lavatory, cabin attendant usual",
    bestFor:
      "Full-height cabin, transcontinental range and a galley, without stepping up to heavy-jet cost.",
    tradeOff:
      "Not a transatlantic aircraft in every wind. Check the specific leg rather than the category.",
    examples: [
      "Bombardier Challenger 350",
      "Cessna Citation Longitude",
      "Gulfstream G280",
    ],
  },
  {
    slug: "heavy-jet",
    name: "Heavy jet",
    seats: "10–16",
    rangeNm: "3,900–5,000",
    reach: "New York to London, London to Dubai",
    cruiseKts: "470–500",
    cabinHeight: "1.83–1.88 m",
    baggage: "Substantial, with in-flight access",
    cabin: "Two crew plus cabin attendant, full galley, separate zones",
    bestFor:
      "Transatlantic travel, or a larger group who need to work or sleep en route.",
    tradeOff:
      "Needs longer runways and more handling, which rules out some of the smaller fields a light jet can use.",
    examples: [
      "Bombardier Challenger 605",
      "Dassault Falcon 900LX",
      "Gulfstream G450",
    ],
  },
  {
    slug: "ultra-long-range-jet",
    name: "Ultra-long-range jet",
    seats: "12–19",
    rangeNm: "6,000–7,700",
    reach: "New York to Tokyo, London to Los Angeles, nonstop",
    cruiseKts: "490–516",
    cabinHeight: "1.88–1.95 m",
    baggage: "Large, with a dedicated compartment",
    cabin:
      "Two or three crew plus cabin attendant, full galley, dedicated sleeping area",
    bestFor:
      "Intercontinental legs where the alternative is a stop, and arriving able to work is the point.",
    tradeOff:
      "The most expensive category to position. If the aircraft is not already near you, that repositioning is on the quote.",
    examples: [
      "Gulfstream G650ER",
      "Bombardier Global 7500",
      "Dassault Falcon 8X",
    ],
  },
  {
    slug: "vip-airliner",
    name: "VIP airliner",
    seats: "19–50+",
    rangeNm: "4,000–6,000",
    reach: "Intercontinental, with a full cabin",
    cruiseKts: "450–480",
    cabinHeight: "2.10–2.20 m",
    baggage: "Airliner-scale hold",
    cabin: "Multiple cabin crew, conference and sleeping zones",
    bestFor:
      "Groups too large for a business jet — a touring party, a full board, a sports squad.",
    tradeOff:
      "Airport options narrow considerably, and lead times are longer than for a business jet.",
    examples: [
      "Airbus ACJ319",
      "Boeing BBJ",
      "Embraer Lineage 1000E",
    ],
  },
];

export function getAircraftCategory(
  slug: string,
): AircraftCategory | undefined {
  return aircraftCategories.find((category) => category.slug === slug);
}

export interface JetRoute {
  slug: string;
  originCity: string;
  originAirport: string;
  originCode: string;
  destinationCity: string;
  destinationAirport: string;
  destinationCode: string;
  /** Great-circle distance, nautical miles, rounded to the nearest 10. */
  distanceNm: number;
  /** Approximate block time as a range across suitable categories. */
  blockTime: string;
  /** Category slugs that can genuinely fly this leg nonstop. */
  suitableCategories: readonly string[];
  /** Why this leg is chartered, and what is specific about it. */
  intro: string;
  /** Practical, non-promissory planning notes. */
  notes: readonly string[];
}

/**
 * Routes we are asked about.
 *
 * The airports named are the business-aviation fields actually used on these
 * city pairs — Teterboro rather than JFK, Van Nuys rather than LAX, Farnborough
 * and Luton rather than Heathrow. That choice is most of the value of flying
 * privately on these legs, so the pages lead with it.
 *
 * Distances are great-circle between the named airports. No prices: charter is
 * quoted per aircraft per leg and moves with positioning, crew duty and the
 * day, so a "from" figure here would be fiction.
 */
export const jetRoutes: readonly JetRoute[] = [
  {
    slug: "new-york-to-london",
    originCity: "New York",
    originAirport: "Teterboro",
    originCode: "TEB",
    destinationCity: "London",
    destinationAirport: "Farnborough",
    destinationCode: "FAB",
    distanceNm: 3010,
    blockTime: "about 6h 30m–7h 30m eastbound, 7h 30m–8h 30m westbound",
    suitableCategories: ["heavy-jet", "ultra-long-range-jet", "vip-airliner"],
    intro:
      "The busiest private transatlantic leg there is. Teterboro to Farnborough or Luton avoids both Kennedy and Heathrow, which on a normal day saves more time on the ground than the aircraft saves in the air.",
    notes: [
      "Eastbound is materially quicker than westbound — the jet stream is worth an hour or more, and a westbound winter leg is where a heavy jet can become a tech stop.",
      "Farnborough and Luton both clear customs on the ramp. Neither is a terminal experience.",
      "Crew duty limits, not aircraft range, are usually what shapes the schedule on this route.",
    ],
  },
  {
    slug: "new-york-to-miami",
    originCity: "New York",
    originAirport: "Teterboro",
    originCode: "TEB",
    destinationCity: "Miami",
    destinationAirport: "Opa-locka Executive",
    destinationCode: "OPF",
    distanceNm: 950,
    blockTime: "about 2h 30m–3h",
    suitableCategories: ["light-jet", "midsize-jet", "super-midsize-jet"],
    intro:
      "The most chartered domestic leg in the United States, and the one where light jets earn their keep. Opa-locka and Fort Lauderdale Executive are both closer to most Miami destinations than Miami International.",
    notes: [
      "Demand is heavily seasonal and directional. Southbound before a holiday weekend and northbound after it are the two hardest times to source an aircraft at short notice.",
      "This is a prime empty-leg corridor precisely because so much traffic runs one way at once.",
      "Several Florida fields have noise curfews. Confirm the arrival slot before committing to a late departure.",
    ],
  },
  {
    slug: "los-angeles-to-las-vegas",
    originCity: "Los Angeles",
    originAirport: "Van Nuys",
    originCode: "VNY",
    destinationCity: "Las Vegas",
    destinationAirport: "Harry Reid",
    destinationCode: "LAS",
    distanceNm: 205,
    blockTime: "about 55m–1h 10m",
    suitableCategories: ["turboprop", "very-light-jet", "light-jet"],
    intro:
      "Short enough that the aircraft category barely changes the arrival time, which makes it the clearest case in charter for choosing on cabin and cost rather than on speed.",
    notes: [
      "On a leg this short, taxi and ground time is a large share of the total. The FBO you use matters more than the aircraft you book.",
      "Van Nuys is the busiest general-aviation airport in the world; allow for a departure queue at peak.",
      "Weekend demand into Las Vegas is extreme. Same-day availability is genuinely limited, not a sales tactic.",
    ],
  },
  {
    slug: "london-to-nice",
    originCity: "London",
    originAirport: "Luton",
    originCode: "LTN",
    destinationCity: "Nice",
    destinationAirport: "Côte d'Azur",
    destinationCode: "NCE",
    distanceNm: 560,
    blockTime: "about 1h 45m–2h 10m",
    suitableCategories: ["very-light-jet", "light-jet", "midsize-jet"],
    intro:
      "The established European leisure charter route, and one where the calendar dominates everything. Nice handles a large share of European business aviation traffic in a few summer weeks.",
    notes: [
      "During the Cannes and Monaco events, Nice operates slot restrictions and parking is constrained. Book considerably further ahead than the flight itself would suggest.",
      "Aircraft parking at Nice is often unavailable at peak, so the aircraft may reposition after dropping you — which appears on the quote.",
      "Cannes-Mandelieu is closer to Cannes but takes only smaller types and closes at night.",
    ],
  },
  {
    slug: "new-york-to-los-angeles",
    originCity: "New York",
    originAirport: "Teterboro",
    originCode: "TEB",
    destinationCity: "Los Angeles",
    destinationAirport: "Van Nuys",
    destinationCode: "VNY",
    distanceNm: 2150,
    blockTime: "about 5h–5h 45m westbound, 4h 15m–5h eastbound",
    suitableCategories: [
      "super-midsize-jet",
      "heavy-jet",
      "ultra-long-range-jet",
    ],
    intro:
      "The classic transcontinental. It is the leg where the difference between a midsize and a super-midsize stops being about comfort and starts being about whether you stop for fuel.",
    notes: [
      "Westbound against the jet stream is the demanding direction. A midsize jet that flies it nonstop in summer may need a fuel stop in January.",
      "A fuel stop adds 45–60 minutes on the ground. If nonstop matters, it has to be specified when the quote is requested, not assumed.",
      "The three-hour time-zone gain eastbound makes early departures unusually productive on this route.",
    ],
  },
  {
    slug: "london-to-geneva",
    originCity: "London",
    originAirport: "Farnborough",
    originCode: "FAB",
    destinationCity: "Geneva",
    destinationAirport: "Genève Aéroport",
    destinationCode: "GVA",
    distanceNm: 425,
    blockTime: "about 1h 30m–1h 50m",
    suitableCategories: ["very-light-jet", "light-jet", "midsize-jet"],
    intro:
      "A short, dense business and ski route. Geneva is the gateway for most of the French and Swiss Alps, and the winter peaks on this leg are sharp and predictable.",
    notes: [
      "Geneva applies slot restrictions and a parking allocation in winter. Saturdays in the ski season are the constraint, not the aircraft.",
      "Ski and board bags are bulky rather than heavy, and they are the reason a light jet becomes a midsize on this route more often than passenger count is.",
      "Sion and Chambéry sit closer to some resorts but have real terrain and weather limitations.",
    ],
  },
];

export function getJetRoute(slug: string): JetRoute | undefined {
  return jetRoutes.find((route) => route.slug === slug);
}

export interface JetService {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  /** What we can genuinely arrange, stated as arrangements not guarantees. */
  points: readonly string[];
}

/**
 * What we arrange around the flight.
 *
 * Written as arrangements rather than amenities. "Ground transport arranged to
 * the aircraft steps" is something a broker does; "chauffeur service" implies
 * we employ drivers, which we do not.
 */
export const jetServices: readonly JetService[] = [
  {
    slug: "ground-transport",
    name: "Ground transport both ends",
    summary:
      "Arranged to meet the aircraft, and held if the flight moves.",
    detail:
      "At most business-aviation airports a car can be driven to the aircraft steps, which is the part of private travel that saves the most time and the part most often left to the traveller to organise. We arrange it at both ends and keep it tied to the actual flight, so a delayed departure moves the car rather than stranding it.",
    points: [
      "Booked against the tail number and the FBO, not against a scheduled time.",
      "Re-timed by us if the departure moves, without you making a second call.",
      "Quoted as a line on the charter estimate rather than settled later.",
    ],
  },
  {
    slug: "catering",
    name: "Catering to the cabin",
    summary: "Ordered against the galley the aircraft actually has.",
    detail:
      "Catering on a private flight is limited by the galley on board — a light jet has no oven, and a hot meal on one is not a service level, it is a physical impossibility. We order against the specific aircraft, so what arrives is what can be served, and dietary requirements are passed to the operator in writing.",
    points: [
      "Matched to the galley on the assigned aircraft, confirmed after the tail is allocated.",
      "Allergies and dietary requirements passed to the operator in writing, not verbally.",
      "Ordered to the departure time, and re-ordered by us if the slot moves.",
    ],
  },
  {
    slug: "fbo-and-handling",
    name: "FBO and handling",
    summary: "The terminal you use, chosen rather than defaulted.",
    detail:
      "Most business-aviation airports have more than one fixed-base operator, and they differ in where they sit on the field, how they handle customs, and what they charge. The operator will default to whichever they have an arrangement with. We tell you which one you are being routed through and what it means for your arrival.",
    points: [
      "Named on the quote, with its location on the field.",
      "Customs and immigration arrangements confirmed for international arrivals.",
      "Handling and ramp fees itemised rather than folded into a single figure.",
    ],
  },
  {
    slug: "passengers-and-documents",
    name: "Passengers, pets and documents",
    summary: "The paperwork checked before the day, not at the aircraft.",
    detail:
      "Private does not mean exempt. Passports, visas, customs declarations and pet import rules apply exactly as they do on a scheduled flight, and an aircraft can be held on the ramp for a missing document just as readily as a passenger can be refused at a gate.",
    points: [
      "Passenger manifest, passport and visa requirements confirmed against the actual routing.",
      "Pet carriage confirmed with the operator in advance — it is the operator's decision, and it is not automatic.",
      "Customs notification handled for international arrivals, with the arrival airport's own requirements checked.",
    ],
  },
  {
    slug: "schedule-changes",
    name: "Changes and cancellations",
    summary: "The operator's terms, given to you before you commit.",
    detail:
      "Charter cancellation terms are set by the operator and they are considerably firmer than most travellers expect — inside a short window a cancellation can carry most of the charter price. We put the specific terms for your specific quote in front of you before payment, rather than referring you to a contract afterwards.",
    points: [
      "The operator's cancellation schedule stated on the quote, with the dates it steps at.",
      "What happens on a mechanical or a weather cancellation set out separately, because the two are treated differently.",
      "Any change fee named up front, so a schedule move is a decision rather than a surprise.",
    ],
  },
  {
    slug: "accessibility",
    name: "Accessibility and medical needs",
    summary: "Confirmed with the operator against the specific aircraft.",
    detail:
      "Boarding a business jet means air stairs, and the cabin is not step-free. What is possible varies enormously by type, and it is the operator who decides. We ask the question in advance and give you the answer for the aircraft being offered, rather than a general assurance.",
    points: [
      "Step height and boarding arrangements confirmed for the specific type.",
      "Oxygen, medical equipment and accompanying carers cleared with the operator ahead of the flight.",
      "Where a type will not work, we say so and price an alternative that will.",
    ],
  },
];

export interface CorporateProgramme {
  slug: string;
  name: string;
  summary: string;
  points: readonly string[];
}

/**
 * Corporate arrangements.
 *
 * Note what is absent: jet cards, fractional shares and block hours. Those are
 * financial products, several of them involve holding client funds in advance,
 * and we do not offer them. Saying so plainly is more useful to a finance
 * director than implying we do.
 */
export const corporateProgrammes: readonly CorporateProgramme[] = [
  {
    slug: "consolidated-billing",
    name: "One invoice, itemised by trip",
    summary:
      "Every charter on a single monthly invoice, each leg broken into the operator's charge, the taxes and fees, and our fee.",
    points: [
      "Cost centre or project code carried on each leg where you supply one.",
      "The operator's charge, taxes and handling, and our service fee as separate lines on every trip.",
      "Supporting operator documentation available for audit without a separate request.",
    ],
  },
  {
    slug: "travel-policy",
    name: "Booking inside your travel policy",
    summary:
      "Your approval thresholds and aircraft rules applied when the quote is built, not checked afterwards.",
    points: [
      "Named approvers, and no charter released without the approval you specify.",
      "Category and operator restrictions applied at quoting stage, so out-of-policy options are not offered.",
      "A written record of what was offered and what was chosen, for every trip.",
    ],
  },
  {
    slug: "group-movements",
    name: "Group and multi-leg movements",
    summary:
      "Board meetings, site visits and roadshows planned as one movement rather than as separate flights.",
    points: [
      "Multi-leg itineraries planned around crew duty limits, which is what actually constrains a long day of flying.",
      "Aircraft sized to the group and the baggage together, rather than to the headcount alone.",
      "Contingency routing identified in advance for legs where a diversion would be expensive.",
    ],
  },
  {
    slug: "duty-of-care",
    name: "Operator due diligence on the record",
    summary:
      "The operating certificate and insurance for the actual carrier, in writing, before the flight.",
    points: [
      "The operator's air carrier certificate identified for each flight we arrange.",
      "Certificate of insurance available before departure on request.",
      "The operating carrier named on the quote — never presented as our own aircraft, because it is not.",
    ],
  },
];

export interface JetFaq {
  question: string;
  answer: string;
}

/**
 * Questions asked before a first charter.
 *
 * These feed FAQPage structured data on `/private-jets/faq`, so every answer
 * has to be true as written — a schema-marked answer is a machine-readable
 * assertion, and a vague one is worse than none.
 */
export const jetFaqs: readonly JetFaq[] = [
  {
    question: "Do you own the aircraft you charter?",
    answer:
      "No. We are a charter broker: we arrange flights operated by licensed air carriers, and every quote names the operator, the aircraft type and the registration once it is assigned. We do not own, operate or crew aircraft. Any company telling you about 'our fleet' while acting as a broker is describing something that does not exist.",
  },
  {
    question: "How is a private charter priced?",
    answer:
      "Per aircraft per leg, not per seat. The price is built from the operator's hourly rate for the flight time, plus positioning — flying the aircraft to you and away again — plus crew duty and any overnight, landing and handling at both ends, and applicable taxes. Positioning is usually the largest variable and the main reason two quotes for the same flight can differ substantially.",
  },
  {
    question: "Is chartering cheaper than buying business-class seats?",
    answer:
      "Usually not, and we will tell you when it is not. Charter can become competitive on a short leg with a group of six or more, on a route with no convenient scheduled service, or on a same-day return where the alternative is an overnight stay. On a single traveller flying a well-served route it very rarely is.",
  },
  {
    question: "What is an empty leg?",
    answer:
      "An aircraft repositioning without passengers — flying to collect a charter, or flying home after one. Because the flight is happening anyway, operators sell these at a discount. The trade-off is real: the date, the time and the route are the operator's, they can change or disappear at short notice, and they are only worth pursuing if your plans genuinely bend around the aircraft.",
  },
  {
    question: "How far in advance do I need to book?",
    answer:
      "It depends on the leg and the season far more than on a general rule, so we will not quote you a headline response time. A midweek domestic light jet can often be arranged inside a day. Nice in event season, Geneva on a winter Saturday, or anywhere over a major holiday can be constrained weeks out — usually by airport slots and parking rather than by aircraft availability.",
  },
  {
    question: "What identification and documents do I need?",
    answer:
      "The same as any other flight. Passports and visas apply exactly as they do on a scheduled service for international travel, and customs and immigration must be notified in advance. Flying privately changes where you are processed, not whether you are.",
  },
  {
    question: "Can I take pets?",
    answer:
      "Often, and usually in the cabin, but it is the operator's decision for each aircraft and it is never automatic. Country import rules apply in full and some destinations require paperwork weeks ahead. We confirm it with the operator before you commit rather than on the day.",
  },
  {
    question: "What happens if the aircraft goes technical?",
    answer:
      "The operator is responsible for providing the flight, and in practice will look for a replacement aircraft. That is not instant and it is not guaranteed. What we do is put the specific terms for your charter in front of you before you pay, so you know what you are entitled to rather than discovering it at the FBO.",
  },
  {
    question: "How much baggage can I actually take?",
    answer:
      "Less than the seat count suggests, and this is the most common misunderstanding in charter. Baggage volume, not passenger count, is what forces a category upgrade most often — particularly with ski or golf equipment. Tell us what you are carrying and we will size the aircraft to it, because discovering it at the aircraft is expensive.",
  },
  {
    question: "Can you arrange one-way charter?",
    answer:
      "Yes. Be aware that a one-way charter is not half the price of a return: the aircraft still has to get back or on to its next job, and that positioning is part of what you are paying for. Where a route is a common repositioning corridor, an empty leg may be a genuinely cheaper way to fly it one-way.",
  },
];

/**
 * Departure and arrival places offered in the private-jet search picklist.
 *
 * The charter marketplace has no autocomplete endpoint — origin and
 * destination are free text that it resolves generously, so "New York" finds
 * Teterboro, White Plains, Islip, JFK, LaGuardia, Newark, Morristown,
 * Caldwell and Farmingdale. That means this list is a *convenience*, not a
 * constraint: anything typed is searched, and a place missing from here still
 * works.
 *
 * `query` is the exact string handed to the supplier. Every entry here was
 * checked against the live API and returns real inventory; the format
 * "City, State, Country" is what resolves most reliably for US fields.
 *
 * These are private-aviation hubs rather than the biggest cities. Where
 * charter traffic actually concentrates — Teterboro, Van Nuys, Opa-locka —
 * is not where scheduled traffic does.
 */
export interface JetHubEntry {
  query: string;
  label: string;
  detail: string;
}

export const jetHubs: readonly JetHubEntry[] = [
  {
    query: "New York, NY, United States",
    label: "New York",
    detail: "Teterboro, White Plains, Islip and the New York airports",
  },
  {
    query: "Los Angeles, CA, United States",
    label: "Los Angeles",
    detail: "Van Nuys, Burbank, Long Beach, LAX",
  },
  {
    query: "Miami, FL, United States",
    label: "Miami",
    detail: "Opa-locka, Fort Lauderdale, Boca Raton, Palm Beach",
  },
  {
    query: "Las Vegas, NV, United States",
    label: "Las Vegas",
    detail: "Harry Reid, Henderson, North Las Vegas",
  },
  {
    query: "San Francisco, CA, United States",
    label: "San Francisco",
    detail: "SFO, Oakland, San Jose, Hayward",
  },
  {
    query: "Chicago, IL, United States",
    label: "Chicago",
    detail: "Midway, O'Hare, Palwaukee, DuPage",
  },
  {
    query: "Dallas, TX, United States",
    label: "Dallas",
    detail: "Dallas Love, DFW, Addison",
  },
  {
    query: "Houston, TX, United States",
    label: "Houston",
    detail: "Hobby, Bush, Sugar Land, David Wayne Hooks",
  },
  {
    query: "Boston, MA, United States",
    label: "Boston",
    detail: "Logan, Hanscom, Norwood",
  },
  {
    query: "Atlanta, GA, United States",
    label: "Atlanta",
    detail: "Hartsfield-Jackson, DeKalb-Peachtree, Fulton County",
  },
  {
    query: "Denver, CO, United States",
    label: "Denver",
    detail: "Denver International, Centennial, Rocky Mountain",
  },
  {
    query: "Aspen, CO, United States",
    label: "Aspen",
    detail: "Aspen/Pitkin County, Eagle, Rifle",
  },
  {
    query: "Scottsdale, AZ, United States",
    label: "Scottsdale",
    detail: "Scottsdale, Phoenix Sky Harbor, Mesa Gateway",
  },
  {
    query: "Nashville, TN, United States",
    label: "Nashville",
    detail: "Nashville International, John C. Tune",
  },
  {
    query: "Seattle, WA, United States",
    label: "Seattle",
    detail: "Boeing Field, Sea-Tac, Paine Field",
  },
  {
    query: "Toronto, Canada",
    label: "Toronto",
    detail: "Pearson, Billy Bishop, Buttonville",
  },
  {
    query: "Cabo San Lucas, Mexico",
    label: "Cabo San Lucas",
    detail: "Los Cabos, Cabo San Lucas International",
  },
  {
    query: "London, United Kingdom",
    label: "London",
    detail: "Luton, Farnborough, Biggin Hill, London City",
  },
  {
    query: "Paris, France",
    label: "Paris",
    detail: "Le Bourget, Charles de Gaulle, Orly",
  },
  {
    query: "Geneva, Switzerland",
    label: "Geneva",
    detail: "Geneva, and the Alpine fields it feeds",
  },
  {
    query: "Nice, France",
    label: "Nice",
    detail: "Côte d'Azur, Cannes-Mandelieu",
  },
  {
    query: "Dubai, United Arab Emirates",
    label: "Dubai",
    detail: "Al Maktoum, Dubai International, Sharjah",
  },
];
