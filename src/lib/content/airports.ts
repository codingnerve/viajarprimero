import type { Airport } from "@/types/flight";

/**
 * Airport reference data. IATA codes and city/country pairs are public facts,
 * so this catalogue is safe to state outright — unlike fares, which are not
 * facts we hold and are never hard-coded anywhere in this project.
 */
export const airports: readonly Airport[] = [
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "United States", countryCode: "US" },
  { code: "EWR", name: "Newark Liberty International", city: "Newark", country: "United States", countryCode: "US" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "United States", countryCode: "US" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "United States", countryCode: "US" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "United States", countryCode: "US" },
  { code: "MIA", name: "Miami International", city: "Miami", country: "United States", countryCode: "US" },
  { code: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", country: "United States", countryCode: "US" },
  { code: "BOS", name: "Logan International", city: "Boston", country: "United States", countryCode: "US" },
  { code: "IAD", name: "Washington Dulles International", city: "Washington, D.C.", country: "United States", countryCode: "US" },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "United States", countryCode: "US" },
  { code: "LHR", name: "Heathrow", city: "London", country: "United Kingdom", countryCode: "GB" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France", countryCode: "FR" },
  { code: "MAD", name: "Adolfo Suárez Madrid-Barajas", city: "Madrid", country: "Spain", countryCode: "ES" },
  { code: "BCN", name: "Josep Tarradellas Barcelona-El Prat", city: "Barcelona", country: "Spain", countryCode: "ES" },
  { code: "FCO", name: "Leonardo da Vinci-Fiumicino", city: "Rome", country: "Italy", countryCode: "IT" },
  { code: "LIS", name: "Humberto Delgado", city: "Lisbon", country: "Portugal", countryCode: "PT" },
  { code: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany", countryCode: "DE" },
  { code: "MEX", name: "Benito Juárez International", city: "Mexico City", country: "Mexico", countryCode: "MX" },
  { code: "CUN", name: "Cancún International", city: "Cancún", country: "Mexico", countryCode: "MX" },
  { code: "BOG", name: "El Dorado International", city: "Bogotá", country: "Colombia", countryCode: "CO" },
  { code: "LIM", name: "Jorge Chávez International", city: "Lima", country: "Peru", countryCode: "PE" },
  { code: "GRU", name: "São Paulo/Guarulhos International", city: "São Paulo", country: "Brazil", countryCode: "BR" },
  { code: "EZE", name: "Ministro Pistarini", city: "Buenos Aires", country: "Argentina", countryCode: "AR" },
  { code: "SJU", name: "Luis Muñoz Marín International", city: "San Juan", country: "Puerto Rico", countryCode: "PR" },
  { code: "PTY", name: "Tocumen International", city: "Panama City", country: "Panama", countryCode: "PA" },
  { code: "NRT", name: "Narita International", city: "Tokyo", country: "Japan", countryCode: "JP" },
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
];

const byCode = new Map(airports.map((airport) => [airport.code, airport]));

export function getAirport(code: string): Airport | undefined {
  return byCode.get(code.toUpperCase());
}

/**
 * Substring match over code, city and airport name — enough for the origin and
 * destination pickers, which search a fixed local catalogue rather than
 * hitting the network on every keystroke.
 */
export function searchAirports(term: string, limit = 8): Airport[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];

  return airports
    .filter(
      (airport) =>
        airport.code.toLowerCase().startsWith(needle) ||
        airport.city.toLowerCase().includes(needle) ||
        airport.name.toLowerCase().includes(needle) ||
        airport.country.toLowerCase().includes(needle),
    )
    .slice(0, limit);
}
