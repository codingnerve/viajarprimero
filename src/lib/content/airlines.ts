/**
 * Airline directory.
 *
 * Deliberately thin. IATA codes, alliance membership and an airline's own
 * domain are stable public facts we can state outright. Baggage allowances,
 * seat pitch, change fees and check-in windows are NOT: they change without
 * notice, they vary by fare bucket and route, and a stale figure republished
 * here reads to a traveller as our promise rather than the airline's policy.
 *
 * So every page built from this data links the traveller to the carrier's own
 * page and says plainly that the carrier is the only authority on it. That is
 * the honest position and it is also the one that survives an Ads review.
 */
export interface Airline {
  slug: string;
  name: string;
  /** IATA two-character designator. */
  code: string;
  country: string;
  alliance: "Star Alliance" | "oneworld" | "SkyTeam" | "None";
  /** The carrier's own site. Root domain only — deep links rot. */
  website: string;
}

export const airlines: readonly Airline[] = [
  { slug: "american-airlines", name: "American Airlines", code: "AA", country: "United States", alliance: "oneworld", website: "https://www.aa.com" },
  { slug: "delta-air-lines", name: "Delta Air Lines", code: "DL", country: "United States", alliance: "SkyTeam", website: "https://www.delta.com" },
  { slug: "united-airlines", name: "United Airlines", code: "UA", country: "United States", alliance: "Star Alliance", website: "https://www.united.com" },
  { slug: "southwest-airlines", name: "Southwest Airlines", code: "WN", country: "United States", alliance: "None", website: "https://www.southwest.com" },
  { slug: "alaska-airlines", name: "Alaska Airlines", code: "AS", country: "United States", alliance: "oneworld", website: "https://www.alaskaair.com" },
  { slug: "jetblue", name: "JetBlue", code: "B6", country: "United States", alliance: "None", website: "https://www.jetblue.com" },
  { slug: "spirit-airlines", name: "Spirit Airlines", code: "NK", country: "United States", alliance: "None", website: "https://www.spirit.com" },
  { slug: "frontier-airlines", name: "Frontier Airlines", code: "F9", country: "United States", alliance: "None", website: "https://www.flyfrontier.com" },
  { slug: "hawaiian-airlines", name: "Hawaiian Airlines", code: "HA", country: "United States", alliance: "None", website: "https://www.hawaiianairlines.com" },
  { slug: "allegiant-air", name: "Allegiant Air", code: "G4", country: "United States", alliance: "None", website: "https://www.allegiantair.com" },
  { slug: "air-canada", name: "Air Canada", code: "AC", country: "Canada", alliance: "Star Alliance", website: "https://www.aircanada.com" },
  { slug: "british-airways", name: "British Airways", code: "BA", country: "United Kingdom", alliance: "oneworld", website: "https://www.britishairways.com" },
  { slug: "virgin-atlantic", name: "Virgin Atlantic", code: "VS", country: "United Kingdom", alliance: "SkyTeam", website: "https://www.virginatlantic.com" },
  { slug: "lufthansa", name: "Lufthansa", code: "LH", country: "Germany", alliance: "Star Alliance", website: "https://www.lufthansa.com" },
  { slug: "air-france", name: "Air France", code: "AF", country: "France", alliance: "SkyTeam", website: "https://www.airfrance.com" },
  { slug: "klm", name: "KLM Royal Dutch Airlines", code: "KL", country: "Netherlands", alliance: "SkyTeam", website: "https://www.klm.com" },
  { slug: "iberia", name: "Iberia", code: "IB", country: "Spain", alliance: "oneworld", website: "https://www.iberia.com" },
  { slug: "tap-air-portugal", name: "TAP Air Portugal", code: "TP", country: "Portugal", alliance: "Star Alliance", website: "https://www.flytap.com" },
  { slug: "turkish-airlines", name: "Turkish Airlines", code: "TK", country: "Türkiye", alliance: "Star Alliance", website: "https://www.turkishairlines.com" },
  { slug: "emirates", name: "Emirates", code: "EK", country: "United Arab Emirates", alliance: "None", website: "https://www.emirates.com" },
  { slug: "qatar-airways", name: "Qatar Airways", code: "QR", country: "Qatar", alliance: "oneworld", website: "https://www.qatarairways.com" },
  { slug: "aeromexico", name: "Aeroméxico", code: "AM", country: "Mexico", alliance: "SkyTeam", website: "https://www.aeromexico.com" },
  { slug: "copa-airlines", name: "Copa Airlines", code: "CM", country: "Panama", alliance: "Star Alliance", website: "https://www.copaair.com" },
  { slug: "avianca", name: "Avianca", code: "AV", country: "Colombia", alliance: "Star Alliance", website: "https://www.avianca.com" },
  { slug: "latam-airlines", name: "LATAM Airlines", code: "LA", country: "Chile", alliance: "None", website: "https://www.latamairlines.com" },
  { slug: "japan-airlines", name: "Japan Airlines", code: "JL", country: "Japan", alliance: "oneworld", website: "https://www.jal.com" },
  { slug: "all-nippon-airways", name: "All Nippon Airways", code: "NH", country: "Japan", alliance: "Star Alliance", website: "https://www.ana.co.jp" },
];

const bySlug = new Map(airlines.map((airline) => [airline.slug, airline]));

export function getAirline(slug: string): Airline | undefined {
  return bySlug.get(slug);
}
