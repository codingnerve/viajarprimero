import type { Locale } from "@/types/locale";

/** Every user-visible string in `JetSearchForm`, per language. */
export interface JetSearchCopy {
  ariaLabel: string;
  flexible: (days: number) => string;
  passengersLabel: string;
  passengers: (n: number) => string;
  from: string;
  fromPlaceholder: string;
  hubsHeading: string;
  to: string;
  toPlaceholder: string;
  arrivalsHeading: string;
  noHub: (query: string) => string;
  departure: string;
  submitQuote: string;
  submitSearch: string;
  errors: {
    fromMissing: string;
    departMissing: string;
    datePassed: string;
  };
}

export const jetSearchCopy: Record<Locale, JetSearchCopy> = {
  en: {
    ariaLabel: "Private jet search",
    flexible: (days) => `Flexible by ${days} days`,
    passengersLabel: "Passengers",
    passengers: (n) => `${n} ${n === 1 ? "passenger" : "passengers"}`,
    from: "From",
    fromPlaceholder: "City or airport",
    hubsHeading: "Private aviation hubs",
    to: "To (optional)",
    toPlaceholder: "Anywhere",
    arrivalsHeading: "Popular arrivals",
    noHub: (query) => `No hub matches “${query}” — we will search it anyway.`,
    departure: "Departure",
    submitQuote: "Get a charter quote",
    submitSearch: "Search private jets",
    errors: {
      fromMissing: "Where does the flight depart from?",
      departMissing: "Add a departure date.",
      datePassed: "That date has passed.",
    },
  },
  es: {
    ariaLabel: "Búsqueda de aviones privados",
    flexible: (days) => `Fechas flexibles (${days} días)`,
    passengersLabel: "Pasajeros",
    passengers: (n) => `${n} ${n === 1 ? "pasajero" : "pasajeros"}`,
    from: "Origen",
    fromPlaceholder: "Ciudad o aeropuerto",
    hubsHeading: "Centros de aviación privada",
    to: "Destino (opcional)",
    toPlaceholder: "Cualquier lugar",
    arrivalsHeading: "Destinos populares",
    noHub: (query) =>
      `Ningún centro coincide con “${query}”; lo buscaremos de todos modos.`,
    departure: "Fecha de salida",
    submitQuote: "Obtener cotización de chárter",
    submitSearch: "Buscar aviones privados",
    errors: {
      fromMissing: "¿Desde dónde sale el vuelo?",
      departMissing: "Agregue la fecha de salida.",
      datePassed: "Esa fecha ya pasó.",
    },
  },
};
