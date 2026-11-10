import { getAirport } from "@/lib/content/airports";
import type { Airport } from "@/types/flight";

/**
 * Route landing pages — the SEO surface of the site.
 *
 * Note what this data does NOT contain: prices. Pages like "cheap flights from
 * X to Y" conventionally lead with a "from $199" figure, but we hold no fares
 * of our own, so publishing one would be a fabricated claim and a Google Ads
 * misrepresentation. Everything here is a stable, checkable fact about the
 * route plus genuine editorial guidance.
 */
export interface Route {
  slug: string;
  originCode: string;
  destinationCode: string;
  /** Approximate nonstop block time. Marked as approximate wherever shown. */
  nonstopDurationMinutes: number;
  /** Great-circle distance, rounded to the nearest 10 km. */
  distanceKm: number;
  nonstopAvailable: boolean;
  /** Editorial intro, 2-3 sentences. Written for readers, not crawlers. */
  intro: string;
  /** Practical, non-promissory planning notes. */
  planningNotes: readonly string[];
  bestMonths: string;
}

export const routes: readonly Route[] = [
  {
    slug: "new-york-to-london",
    originCode: "JFK",
    destinationCode: "LHR",
    nonstopDurationMinutes: 420,
    distanceKm: 5570,
    nonstopAvailable: true,
    intro:
      "One of the busiest long-haul corridors in the world, which works in your favour: the sheer number of daily departures between New York and London means schedule choice is wide and there is usually more than one way to build the trip. Overnight eastbound departures land in the morning; westbound returns give you the day back.",
    planningNotes: [
      "Eastbound flights are almost all overnight — arriving mid-morning, you will lose most of the first day to fatigue if you schedule anything demanding.",
      "Heathrow and Gatwick serve London from different sides of the city; check which one your itinerary uses before booking onward transport.",
      "Immigration queues at Heathrow can be long at peak arrival banks. Allow a genuine buffer on connecting itineraries.",
    ],
    bestMonths: "April to June, and September to October",
  },
  {
    slug: "new-york-to-madrid",
    originCode: "JFK",
    destinationCode: "MAD",
    nonstopDurationMinutes: 450,
    distanceKm: 5760,
    nonstopAvailable: true,
    intro:
      "Madrid is a natural first stop in Spain and a major connecting hub onward to the rest of Iberia and Latin America. Nonstop service from New York runs year-round, with the schedule thickening over the summer.",
    planningNotes: [
      "Madrid-Barajas is a large, multi-terminal airport; connections between terminals need time, particularly T4 to T4S.",
      "Summer heat in Madrid is severe. Shoulder-season travel is more comfortable and usually less contested.",
      "If Spain is a starting point rather than the destination, compare the total journey via Madrid against a direct routing to your final city.",
    ],
    bestMonths: "May, and September to October",
  },
  {
    slug: "miami-to-bogota",
    originCode: "MIA",
    destinationCode: "BOG",
    nonstopDurationMinutes: 235,
    distanceKm: 2440,
    nonstopAvailable: true,
    intro:
      "Miami is the principal North American gateway to Colombia, and the run to Bogotá is short enough to be a comfortable daytime flight. El Dorado sits at roughly 2,600 m, so the arrival is at altitude.",
    planningNotes: [
      "Bogotá's altitude affects some travellers on the first day — plan a light arrival schedule.",
      "Check passport validity and any entry requirements well before departure; rules differ by nationality and change.",
      "Bogotá is a strong connecting point for the rest of Colombia if the coast or the coffee region is your real destination.",
    ],
    bestMonths: "December to March, and July to August",
  },
  {
    slug: "los-angeles-to-mexico-city",
    originCode: "LAX",
    destinationCode: "MEX",
    nonstopDurationMinutes: 220,
    distanceKm: 2500,
    nonstopAvailable: true,
    intro:
      "A dense short-haul international route with departures throughout the day, which makes it one of the easier trips to shift by a few hours if the schedule suits you better. Mexico City sits at high altitude and rewards a slow first day.",
    planningNotes: [
      "Mexico City is at roughly 2,240 m; give yourself an easy first evening.",
      "Ground transfer from the airport into the central neighbourhoods can be slow at peak hours — budget more time than the distance suggests.",
      "Daytime departures are plentiful, so an early flight is rarely the only option.",
    ],
    bestMonths: "March to May, and October to November",
  },
  {
    slug: "new-york-to-paris",
    originCode: "JFK",
    destinationCode: "CDG",
    nonstopDurationMinutes: 425,
    distanceKm: 5840,
    nonstopAvailable: true,
    intro:
      "A heavily served transatlantic route with a wide spread of departure times. Charles de Gaulle connects onward across Europe, so Paris works equally as a destination and as a gateway.",
    planningNotes: [
      "Charles de Gaulle's terminals are far apart; a connection there needs real time, not the legal minimum.",
      "The RER B into central Paris is fast but crowded with luggage at peak — worth knowing before you commit to it.",
      "August is quiet in the city itself as locals leave, which changes what is open.",
    ],
    bestMonths: "April to June, and September",
  },
  {
    slug: "chicago-to-rome",
    originCode: "ORD",
    destinationCode: "FCO",
    nonstopDurationMinutes: 555,
    distanceKm: 7740,
    nonstopAvailable: true,
    intro:
      "Seasonal and year-round nonstop options connect Chicago with Rome, though the schedule is noticeably thinner outside the summer. Fiumicino is a straightforward arrival airport with a direct rail link into the city.",
    planningNotes: [
      "Winter schedules are reduced on this route; connecting itineraries may be the only practical option in the low season.",
      "The Leonardo Express runs Fiumicino to Roma Termini in about 30 minutes and avoids road traffic entirely.",
      "Roman summers are hot and crowded; the shoulder seasons are materially more pleasant.",
    ],
    bestMonths: "April to May, and late September to October",
  },
  {
    slug: "boston-to-lisbon",
    originCode: "BOS",
    destinationCode: "LIS",
    nonstopDurationMinutes: 380,
    distanceKm: 5150,
    nonstopAvailable: true,
    intro:
      "One of the shortest transatlantic crossings from the US East Coast, which makes Lisbon an unusually gentle introduction to Europe — the overnight is short enough to arrive genuinely functional.",
    planningNotes: [
      "The flight is short for an overnight; sleep is limited, so keep arrival day light regardless.",
      "Lisbon airport is close to the city, and the metro reaches it directly.",
      "Lisbon is a common connecting point onward to the Azores, Madeira and mainland Europe.",
    ],
    bestMonths: "March to June, and September to October",
  },
  {
    slug: "san-francisco-to-tokyo",
    originCode: "SFO",
    destinationCode: "NRT",
    nonstopDurationMinutes: 655,
    distanceKm: 8280,
    nonstopAvailable: true,
    intro:
      "A long Pacific crossing with a substantial time-zone shift. Westbound flights cross the date line and arrive the following afternoon, so the itinerary reads oddly on paper even when it is straightforward in practice.",
    planningNotes: [
      "Narita is well outside central Tokyo; the train transfer takes roughly an hour and needs to be part of your arrival plan.",
      "Tokyo is served by both Narita and Haneda — confirm which one your itinerary uses, as they are not interchangeable.",
      "The date line means the outbound and return dates will not look symmetrical. Check the day of the week, not just the date.",
    ],
    bestMonths: "March to May, and October to November",
  },
  {
    slug: "new-york-to-san-juan",
    originCode: "JFK",
    destinationCode: "SJU",
    nonstopDurationMinutes: 235,
    distanceKm: 2560,
    nonstopAvailable: true,
    intro:
      "San Juan is domestic travel for US passengers, which removes a layer of paperwork from a Caribbean trip. The route is frequent and short enough to work as a long weekend.",
    planningNotes: [
      "No passport is required for US citizens travelling from the mainland, though photo ID rules still apply.",
      "Hurricane season runs roughly June through November; travel insurance is worth genuine consideration in that window.",
      "San Juan connects onward to much of the eastern Caribbean if you are island-hopping.",
    ],
    bestMonths: "December to April",
  },
  {
    slug: "miami-to-lima",
    originCode: "MIA",
    destinationCode: "LIM",
    nonstopDurationMinutes: 350,
    distanceKm: 4230,
    nonstopAvailable: true,
    intro:
      "Lima is the main gateway to Peru and a significant South American connecting hub. Many itineraries treat it as a stopover on the way to Cusco, but the city rewards a couple of days in its own right.",
    planningNotes: [
      "If you are continuing to Cusco, the altitude change is significant — a night in Lima or the Sacred Valley first is the usual advice.",
      "Lima's coastal fog season runs roughly June to November and makes the city greyer than travellers expect.",
      "Domestic connections in Peru are often tight; leave real margin between the international arrival and any onward flight.",
    ],
    bestMonths: "May to September for the highlands, December to March for the coast",
  },
  {
    slug: "los-angeles-to-cancun",
    originCode: "LAX",
    destinationCode: "CUN",
    nonstopDurationMinutes: 275,
    distanceKm: 3690,
    nonstopAvailable: true,
    intro:
      "A resort route with a heavy leisure schedule, which means departures cluster at times that suit package travel. Cancún airport is busy and its arrivals hall is aggressively commercial.",
    planningNotes: [
      "Ignore the transfer touts in the arrivals hall; arrange ground transport in advance.",
      "Peak weeks around spring break and the winter holidays are considerably more contested than the rest of the year.",
      "Cancún is the entry point for the wider Yucatán, not only the hotel zone.",
    ],
    bestMonths: "December to April",
  },
  {
    slug: "new-york-to-barcelona",
    originCode: "JFK",
    destinationCode: "BCN",
    nonstopDurationMinutes: 465,
    distanceKm: 6160,
    nonstopAvailable: true,
    intro:
      "Barcelona has good nonstop service from New York, weighted towards the summer. The airport is close to the city and connected by both metro and mainline rail.",
    planningNotes: [
      "Summer is the peak in every sense — schedule, crowds and heat all rise together.",
      "Barcelona is a practical starting point for the Costa Brava and the rest of Catalonia by rail.",
      "Some visitor sites require timed entry booked well ahead; that is a planning constraint, not a same-day decision.",
    ],
    bestMonths: "May to June, and September to October",
  },
];

const bySlug = new Map(routes.map((route) => [route.slug, route]));

export function getRoute(slug: string): Route | undefined {
  return bySlug.get(slug);
}

export interface ResolvedRoute extends Route {
  origin: Airport;
  destination: Airport;
}

/**
 * Attaches airport records to a route.
 *
 * Returns undefined when a code has no catalogue entry rather than rendering a
 * page with a blank city name — a broken content reference should fail the
 * build via `generateStaticParams`, not ship as a half-empty page.
 */
export function resolveRoute(route: Route): ResolvedRoute | undefined {
  const origin = getAirport(route.originCode);
  const destination = getAirport(route.destinationCode);
  if (!origin || !destination) return undefined;

  return { ...route, origin, destination };
}

export function getResolvedRoutes(): ResolvedRoute[] {
  return routes
    .map(resolveRoute)
    .filter((route): route is ResolvedRoute => route !== undefined);
}
