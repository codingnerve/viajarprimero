import { getAirport } from "@/lib/content/airports";
import type { Airport } from "@/types/flight";

/**
 * Destination guides.
 *
 * Editorial content only: what a place is like, when to go, what to know
 * before booking. No fares, no availability claims, no superlatives we cannot
 * stand behind.
 */
export interface Destination {
  slug: string;
  city: string;
  /**
   * Optional photograph for this destination, written as a path from the web
   * root: "/images/...", never "@/images/...".
   *
   * The "@/" prefix is a TypeScript path alias for "src/". The bundler
   * resolves it at build time and it means nothing to a browser, so an
   * "@/images/..." src produces a request the server cannot answer. Anything
   * under "public/" is served from the site root instead — the file at
   * "public/images/home/jet.jpg" is requested as "/images/home/jet.jpg".
   *
   * Optional on purpose. Leave it out and `Photo` falls back to looking for
   * "public/images/destinations/<slug>.jpg", and failing that to a brand
   * gradient plate — so a destination with no picture still renders a
   * finished card. Set it only to point at a file the automatic lookup would
   * not find on its own.
   */
  src?: string;
  country: string;
  /** Primary airport serving the city. */
  airportCode: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  intro: string;
  bestTimeToVisit: string;
  gettingAround: string;
  goodToKnow: readonly string[];
  /** Route slugs from lib/content/routes.ts that land here. */
  relatedRouteSlugs: readonly string[];
}

export const destinations: readonly Destination[] = [
  {
    slug: "london",
    city: "London",
    country: "United Kingdom",
    airportCode: "LHR",
    summary:
      "Six airports, endless neighbourhoods, and a transport system that makes all of it reachable.",
    intro:
      "London absorbs however much time you give it. The centre is walkable in patches and quite deliberately not walkable across, so the practical decision is which two or three areas you want to know properly rather than trying to cover the map. The city is served by six airports, and which one you land at meaningfully changes your first two hours.",
    bestTimeToVisit:
      "May to September has the longest days and the best odds on weather. Late autumn and winter are darker and wetter, but noticeably quieter and easier to move around.",
    gettingAround:
      "The Underground and buses cover almost everything; a contactless card or phone works as your ticket with no separate purchase. Fares are capped daily, so tapping in for short hops is not penalised.",
    goodToKnow: [
      "Heathrow, Gatwick, Stansted, Luton, City and Southend all serve London and are spread widely — confirm which one your ticket uses before booking onward transport.",
      "Many major museums have no admission charge, though special exhibitions are ticketed and often sell out ahead.",
      "Sunday transport schedules are reduced and engineering works are common; check before relying on a specific line.",
    ],
    relatedRouteSlugs: ["new-york-to-london"],
  },
  {
    slug: "madrid",
    src: "/images/home/hotel.jpg",
    city: "Madrid",
    country: "Spain",
    airportCode: "MAD",
    summary:
      "A capital that runs late, eats later, and connects onward to the whole Iberian peninsula.",
    intro:
      "Madrid is a working capital rather than a preserved one, and it keeps hours that surprise first-time visitors — dinner at ten is unremarkable. The centre is compact enough to cross on foot, and the city sits at the middle of Spain's high-speed rail network, which makes it a sensible base for wider travel.",
    bestTimeToVisit:
      "Spring and autumn. July and August are genuinely hot and much of the city empties out; winter is cold but clear and quiet.",
    gettingAround:
      "The metro is fast, cheap and reaches the airport directly. Central Madrid rewards walking more than most capitals of its size.",
    goodToKnow: [
      "Madrid-Barajas is large and multi-terminal; a connection between T4 and T4S requires a train and real time.",
      "Many restaurants do not open for dinner until 20:30 or later.",
      "High-speed rail reaches Seville, Barcelona and Valencia in a few hours — often a better option than a short domestic flight.",
    ],
    relatedRouteSlugs: ["new-york-to-madrid"],
  },
  {
    slug: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    airportCode: "MEX",
    summary:
      "A vast, high-altitude capital best approached one neighbourhood at a time.",
    intro:
      "Mexico City is enormous and organised into neighbourhoods with distinct characters, which is the only sane way to plan a visit. It sits at roughly 2,240 metres, and the altitude is enough that a slow first day is genuinely worth building into the itinerary.",
    bestTimeToVisit:
      "March to May and October to November. The rainy season runs roughly June to September, when afternoon downpours are routine.",
    gettingAround:
      "The metro is extensive and inexpensive but crowded at peak. Ride-hailing apps are widely used and remove the ambiguity of hailing on the street.",
    goodToKnow: [
      "Altitude affects some travellers on arrival — keep the first evening light.",
      "Traffic makes short distances slow at peak hours; plan by time, not by map distance.",
      "Major archaeological sites near the city are day trips that need an early start.",
    ],
    relatedRouteSlugs: ["los-angeles-to-mexico-city"],
  },
  {
    slug: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    airportCode: "LIS",
    summary:
      "The shortest transatlantic hop from the US East Coast, and a city built on hills.",
    intro:
      "Lisbon is compact, steep, and considerably more physical to walk than a map suggests. It is also one of the easiest European cities to reach from the eastern United States, with a crossing short enough that the overnight does not wreck the following day.",
    bestTimeToVisit:
      "March to June and September to October. Midsummer is hot and busy; winter is mild but wetter.",
    gettingAround:
      "Metro, trams and funiculars cover the hills. The airport is close to the centre and on the metro line.",
    goodToKnow: [
      "The hills are real — comfortable shoes matter more here than in most European capitals.",
      "Lisbon connects onward to the Azores and Madeira, which are separate trips worth planning deliberately.",
      "Sintra is an easy train day trip and correspondingly crowded; go early.",
    ],
    relatedRouteSlugs: ["boston-to-lisbon"],
  },
  {
    slug: "bogota",
    city: "Bogotá",
    country: "Colombia",
    airportCode: "BOG",
    summary:
      "A high-altitude capital and the connecting point for the rest of Colombia.",
    intro:
      "Bogotá sits at about 2,600 metres in the Andes, which shapes both the climate and how you should plan your first day. It is Colombia's main international gateway, so many itineraries pass through it — though the city itself justifies more than a connection.",
    bestTimeToVisit:
      "December to March and July to August are the drier windows. Temperatures are stable year-round; it is the rainfall that changes.",
    gettingAround:
      "The TransMilenio bus system covers the main corridors. Ride-hailing is common for anything off those routes.",
    goodToKnow: [
      "The altitude is higher than Mexico City's — take the first day slowly.",
      "It is cool year-round despite being near the equator; pack layers, not shorts.",
      "Bogotá connects onward to Cartagena, Medellín and the coffee region by short domestic flights.",
    ],
    relatedRouteSlugs: ["miami-to-bogota"],
  },
  {
    slug: "rome",
    city: "Rome",
    country: "Italy",
    airportCode: "FCO",
    summary:
      "Dense, layered and best visited outside the height of summer.",
    intro:
      "Rome puts more history per square kilometre than almost anywhere, which is exactly why it needs pacing rather than a checklist. The historic centre is walkable, and much of what you want to see sits within it.",
    bestTimeToVisit:
      "April to May and late September to October. July and August are hot and crowded in a way that materially changes the experience.",
    gettingAround:
      "The centre is best walked. The Leonardo Express connects Fiumicino to Roma Termini in about half an hour.",
    goodToKnow: [
      "Major sites use timed entry and sell out ahead — book before you travel, not on the day.",
      "Rome has two airports, Fiumicino and Ciampino, and they are not interchangeable.",
      "August sees many local businesses close for the holidays.",
    ],
    relatedRouteSlugs: ["chicago-to-rome"],
  },
  {
    slug: "san-juan",
    city: "San Juan",
    country: "Puerto Rico",
    airportCode: "SJU",
    summary:
      "Caribbean travel without leaving US jurisdiction, and a hub for the eastern islands.",
    intro:
      "San Juan combines a walled colonial old town with a modern city and beaches within reach of both. For travellers from the US mainland it is domestic travel, which removes a layer of paperwork from a Caribbean trip.",
    bestTimeToVisit:
      "December to April is the dry season and the peak. Hurricane season runs roughly June through November.",
    gettingAround:
      "Old San Juan is walkable. A car is useful for the rest of the island; ride-hailing works within the metro area.",
    goodToKnow: [
      "US citizens travelling from the mainland do not need a passport, though standard photo ID rules apply.",
      "Travel insurance deserves genuine thought during hurricane season.",
      "San Juan connects onward to much of the eastern Caribbean.",
    ],
    relatedRouteSlugs: ["new-york-to-san-juan"],
  },
  {
    slug: "tokyo",
    city: "Tokyo",
    country: "Japan",
    airportCode: "NRT",
    summary:
      "Two airports, exceptional rail, and a city that rewards planning by district.",
    intro:
      "Tokyo is less a single city than a collection of dense districts connected by the best urban rail network in the world. Trying to see it centrally is a mistake; picking a handful of areas and doing them properly is not.",
    bestTimeToVisit:
      "March to May and October to November. Summer is hot and humid; the cherry blossom window in spring is short and heavily booked.",
    gettingAround:
      "Rail covers effectively everything. A contactless IC card removes the need to work out individual fares.",
    goodToKnow: [
      "Tokyo is served by Narita and Haneda; Haneda is much closer to the centre and they are not interchangeable.",
      "The transfer from Narita takes about an hour and should be part of your arrival planning.",
      "Crossing the date line means outbound and return dates will not look symmetrical — check days of the week.",
    ],
    relatedRouteSlugs: ["san-francisco-to-tokyo"],
  },
];

const bySlug = new Map(destinations.map((destination) => [destination.slug, destination]));

export function getDestination(slug: string): Destination | undefined {
  return bySlug.get(slug);
}

export interface ResolvedDestination extends Destination {
  airport: Airport;
}

export function resolveDestination(
  destination: Destination,
): ResolvedDestination | undefined {
  const airport = getAirport(destination.airportCode);
  if (!airport) return undefined;

  return { ...destination, airport };
}

export function getResolvedDestinations(): ResolvedDestination[] {
  return destinations
    .map(resolveDestination)
    .filter((destination): destination is ResolvedDestination => destination !== undefined);
}
