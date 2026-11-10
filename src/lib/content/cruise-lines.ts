/**
 * Cruise line directory.
 *
 * Same rule as the airline directory: the line's name, its home market and its
 * own website are facts; fares, cabin availability, included perks and current
 * itineraries are not, and none are hard-coded here. `sailingRegions` lists
 * where a line has an established year-round presence, which is stable enough
 * to publish and useful when a traveller is choosing between lines.
 */
export interface CruiseLine {
  slug: string;
  name: string;
  /** Where the line is headquartered / its primary market. */
  basedIn: string;
  /** One line describing who the line actually suits. No superlatives. */
  character: string;
  sailingRegions: readonly string[];
  website: string;
}

export const cruiseLines: readonly CruiseLine[] = [
  {
    slug: "royal-caribbean",
    name: "Royal Caribbean International",
    basedIn: "United States",
    character:
      "Large ships built around onboard activity — the vessel is as much the destination as the ports are. Suits families and first-time cruisers who want plenty to do at sea.",
    sailingRegions: ["Caribbean", "Bahamas", "Mediterranean", "Alaska"],
    website: "https://www.royalcaribbean.com",
  },
  {
    slug: "carnival",
    name: "Carnival Cruise Line",
    basedIn: "United States",
    character:
      "Shorter, more informal sailings from a wide spread of US home ports, often reachable by car rather than a connecting flight.",
    sailingRegions: ["Caribbean", "Bahamas", "Mexico", "Alaska"],
    website: "https://www.carnival.com",
  },
  {
    slug: "norwegian-cruise-line",
    name: "Norwegian Cruise Line",
    basedIn: "United States",
    character:
      "Freestyle format with no fixed dining times or formal nights. Suits travellers who dislike a rigid onboard schedule.",
    sailingRegions: ["Caribbean", "Alaska", "Europe", "Hawaii"],
    website: "https://www.ncl.com",
  },
  {
    slug: "msc-cruises",
    name: "MSC Cruises",
    basedIn: "Switzerland and Italy",
    character:
      "European-run line with a strong Mediterranean programme and a growing Caribbean season. Onboard languages and clientele are noticeably more international.",
    sailingRegions: ["Mediterranean", "Caribbean", "Northern Europe"],
    website: "https://www.msccruises.com",
  },
  {
    slug: "princess-cruises",
    name: "Princess Cruises",
    basedIn: "United States",
    character:
      "Mid-size to large ships with a longer average itinerary and an older passenger profile. Well established in Alaska.",
    sailingRegions: ["Alaska", "Caribbean", "Europe", "Panama Canal"],
    website: "https://www.princess.com",
  },
  {
    slug: "celebrity-cruises",
    name: "Celebrity Cruises",
    basedIn: "United States",
    character:
      "Premium positioning with a quieter onboard atmosphere and a stronger food and drink programme than the mass-market lines.",
    sailingRegions: ["Caribbean", "Alaska", "Mediterranean", "Galápagos"],
    website: "https://www.celebritycruises.com",
  },
  {
    slug: "holland-america-line",
    name: "Holland America Line",
    basedIn: "United States and Netherlands",
    character:
      "Traditional, unhurried cruising on smaller ships, with longer voyages and a destination-led rather than activity-led focus.",
    sailingRegions: ["Alaska", "Caribbean", "Northern Europe", "World voyages"],
    website: "https://www.hollandamerica.com",
  },
  {
    slug: "virgin-voyages",
    name: "Virgin Voyages",
    basedIn: "United States",
    character:
      "Adults-only ships with a design-forward, no-buffet approach. Gratuities and most dining are built into the fare rather than added later.",
    sailingRegions: ["Caribbean", "Mediterranean"],
    website: "https://www.virginvoyages.com",
  },
  {
    slug: "disney-cruise-line",
    name: "Disney Cruise Line",
    basedIn: "United States",
    character:
      "Built end-to-end around families with young children. Priced well above the mass-market lines, and the difference is in the childcare and entertainment.",
    sailingRegions: ["Caribbean", "Bahamas", "Alaska", "Europe"],
    website: "https://disneycruise.disney.go.com",
  },
  {
    slug: "cunard",
    name: "Cunard",
    basedIn: "United Kingdom",
    character:
      "Ocean-liner tradition, formal evenings, and the scheduled transatlantic crossing between Southampton and New York rather than a round-trip cruise.",
    sailingRegions: ["Transatlantic", "Northern Europe", "World voyages"],
    website: "https://www.cunard.com",
  },
  {
    slug: "viking",
    name: "Viking",
    basedIn: "Switzerland and Norway",
    character:
      "Adults-only river and ocean sailings with an itinerary-first, culturally-led programme. No casinos and no children on board.",
    sailingRegions: ["European rivers", "Northern Europe", "Mediterranean"],
    website: "https://www.viking.com",
  },
  {
    slug: "costa-cruises",
    name: "Costa Cruises",
    basedIn: "Italy",
    character:
      "Italian-run Mediterranean specialist with a European passenger mix and a more relaxed, late-dining rhythm.",
    sailingRegions: ["Mediterranean", "Northern Europe", "Caribbean"],
    website: "https://www.costacruises.com",
  },
];

const bySlug = new Map(cruiseLines.map((line) => [line.slug, line]));

export function getCruiseLine(slug: string): CruiseLine | undefined {
  return bySlug.get(slug);
}
