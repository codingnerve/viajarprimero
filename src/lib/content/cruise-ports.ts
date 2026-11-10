import type { PicklistGroup } from "@/types/picklist";

/**
 * Cruise departure ports and sailing regions, for the quote form's picklists.
 *
 * Both lists are hardcoded rather than fetched. No cruise supplier is
 * connected to this site, and a list of places a traveller can *ask* about is
 * not a claim about availability — unlike a price or a sailing date, which we
 * would never hardcode. What it must not do is imply we hold inventory at any
 * of these ports, so the form asks where you would like to sail from and the
 * reply comes from a person.
 *
 * ## What is in the port list
 *
 * US homeports — the places ships actually begin and end voyages — rather than
 * ports of call. A traveller boards at a homeport; Cozumel and Ketchikan are
 * places the ship visits, and offering them as a departure point would produce
 * requests nobody can fulfil.
 *
 * Puerto Rico is included because San Juan is a US homeport, and it is one of
 * the few places a Southern Caribbean sailing starts without a repositioning
 * flight.
 *
 * This list needs a review each year. Lines move homeports — Carnival left
 * Charleston in 2024, which is why it is absent — and a port that has lost its
 * scheduled departures should come out rather than sit here generating
 * requests we then have to turn down.
 */

/** The choice offered before any place: an answer, not an empty field. */
export const NO_PORT_PREFERENCE = "No preference — suggest a port";
export const NO_REGION_PREFERENCE = "Not sure yet — suggest an itinerary";

export const usCruisePorts: readonly PicklistGroup[] = [
  {
    label: "Open to anywhere",
    options: [NO_PORT_PREFERENCE],
  },
  {
    label: "Florida",
    options: [
      "Miami, FL (PortMiami)",
      "Fort Lauderdale, FL (Port Everglades)",
      "Port Canaveral, FL (Orlando)",
      "Tampa, FL",
      "Jacksonville, FL",
      "Palm Beach, FL",
    ],
  },
  {
    label: "Gulf Coast",
    options: [
      "Galveston, TX",
      "New Orleans, LA",
      "Mobile, AL",
    ],
  },
  {
    label: "Northeast and Mid-Atlantic",
    options: [
      "Cape Liberty, NJ (Bayonne)",
      "Manhattan, NY",
      "Brooklyn, NY",
      "Boston, MA",
      "Baltimore, MD",
      "Norfolk, VA",
    ],
  },
  {
    label: "West Coast",
    options: [
      "Los Angeles, CA (San Pedro)",
      "Long Beach, CA",
      "San Diego, CA",
      "San Francisco, CA",
      "Seattle, WA",
    ],
  },
  {
    label: "Alaska",
    options: ["Seward, AK", "Whittier, AK", "Juneau, AK"],
  },
  {
    label: "Hawaii and Puerto Rico",
    options: ["Honolulu, HI", "San Juan, Puerto Rico"],
  },
];

/**
 * Where the sailing goes.
 *
 * Regions rather than individual ports, because that is how an itinerary is
 * chosen and sold: nobody books "a cruise to Cozumel", they book a Western
 * Caribbean sailing that happens to call there. The notes field further down
 * the form is where a specific ship or itinerary goes.
 */
export const cruiseDestinations: readonly PicklistGroup[] = [
  {
    label: "Open to suggestions",
    options: [NO_REGION_PREFERENCE],
  },
  {
    label: "Caribbean and Atlantic",
    options: [
      "Eastern Caribbean",
      "Western Caribbean",
      "Southern Caribbean",
      "Bahamas",
      "Bermuda",
    ],
  },
  {
    label: "North America",
    options: [
      "Alaska",
      "Canada and New England",
      "Mexican Riviera",
      "Hawaii",
      "Pacific Coastal",
      "Panama Canal",
    ],
  },
  {
    label: "Europe",
    options: [
      "Mediterranean",
      "Greek Isles",
      "Northern Europe and the Baltic",
      "Norwegian fjords",
      "British Isles",
      "Iceland and Greenland",
    ],
  },
  {
    label: "Further afield",
    options: [
      "Transatlantic crossing",
      "South America",
      "Antarctica",
      "Asia",
      "Australia and New Zealand",
      "South Pacific",
      "Middle East and the Gulf",
      "Africa and the Indian Ocean",
      "World cruise",
    ],
  },
];
