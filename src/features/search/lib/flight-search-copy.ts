import type { CabinClass } from "@/types/flight";
import type { Locale } from "@/types/locale";

/**
 * Every user-visible string in the flight search form, per locale.
 *
 * Only display text lives here. Values sent to /search stay in their canonical
 * form (`round-trip`, `economy`, airport codes).
 */
export interface FlightSearchCopy {
  formLabel: string;
  tripTypeLabel: string;
  roundTrip: string;
  oneWay: string;
  adultsLabel: string;
  adults: (count: number) => string;
  childrenLabel: string;
  children: (count: number) => string;
  cabinLabel: string;
  cabins: Record<CabinClass, string>;
  from: string;
  to: string;
  depart: string;
  return: string;
  placeholder: string;
  popularDepartures: string;
  popularArrivals: string;
  noAirportMatch: (query: string) => string;
  swapLabel: string;
  getQuote: string;
  search: string;
  errors: {
    origin: string;
    destination: string;
    sameAirport: string;
    departMissing: string;
    datePassed: string;
    returnMissing: string;
    returnBeforeDepart: string;
  };
}

export const flightSearchCopy: Record<Locale, FlightSearchCopy> = {
  en: {
    formLabel: "Flight search",
    tripTypeLabel: "Trip type",
    roundTrip: "Round trip",
    oneWay: "One way",
    adultsLabel: "Adults",
    adults: (count) => `${count} ${count === 1 ? "adult" : "adults"}`,
    childrenLabel: "Children",
    children: (count) => `${count} ${count === 1 ? "child" : "children"}`,
    cabinLabel: "Cabin",
    cabins: {
      economy: "Economy",
      "premium-economy": "Premium economy",
      business: "Business",
      first: "First",
    },
    from: "From",
    to: "To",
    depart: "Depart",
    return: "Return",
    placeholder: "City or airport",
    popularDepartures: "Popular departures",
    popularArrivals: "Popular arrivals",
    noAirportMatch: (query) => `No airport matches “${query}”.`,
    swapLabel: "Swap departure and destination",
    getQuote: "Get a quote",
    search: "Search",
    errors: {
      origin: "Choose a departure airport from the list.",
      destination: "Choose a destination airport from the list.",
      sameAirport: "Departure and destination must be different.",
      departMissing: "Add a departure date.",
      datePassed: "That date has passed.",
      returnMissing: "Add a return date, or switch to one way.",
      returnBeforeDepart: "The return cannot be before the departure.",
    },
  },
  es: {
    formLabel: "Búsqueda de vuelos",
    tripTypeLabel: "Tipo de viaje",
    roundTrip: "Ida y vuelta",
    oneWay: "Solo ida",
    adultsLabel: "Adultos",
    adults: (count) => `${count} ${count === 1 ? "adulto" : "adultos"}`,
    childrenLabel: "Niños",
    children: (count) => `${count} ${count === 1 ? "niño" : "niños"}`,
    cabinLabel: "Cabina",
    cabins: {
      economy: "Económica",
      "premium-economy": "Económica premium",
      business: "Ejecutiva",
      first: "Primera clase",
    },
    from: "Origen",
    to: "Destino",
    depart: "Salida",
    return: "Regreso",
    placeholder: "Ciudad o aeropuerto",
    popularDepartures: "Salidas populares",
    popularArrivals: "Llegadas populares",
    noAirportMatch: (query) => `Ningún aeropuerto coincide con “${query}”.`,
    swapLabel: "Intercambiar origen y destino",
    getQuote: "Obtener cotización",
    search: "Buscar",
    errors: {
      origin: "Elija un aeropuerto de salida de la lista.",
      destination: "Elija un aeropuerto de destino de la lista.",
      sameAirport: "El origen y el destino deben ser diferentes.",
      departMissing: "Agregue una fecha de salida.",
      datePassed: "Esa fecha ya pasó.",
      returnMissing: "Agregue una fecha de regreso o cambie a solo ida.",
      returnBeforeDepart: "El regreso no puede ser anterior a la salida.",
    },
  },
};
