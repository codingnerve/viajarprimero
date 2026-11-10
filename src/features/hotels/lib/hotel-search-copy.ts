import type { Locale } from "@/types/locale";

/** Every user-visible string in `HotelSearchForm`, per language. */
export interface HotelSearchCopy {
  ariaLabel: string;
  roomsLabel: string;
  rooms: (n: number) => string;
  adultsLabel: string;
  adults: (n: number) => string;
  childrenLabel: string;
  children: (n: number) => string;
  whereTo: string;
  placePlaceholder: string;
  popularHeading: string;
  emptyTitle: (query: string) => string;
  emptyCallToBook: string;
  /** Text before the "ask us" link, including its trailing space. */
  emptyHintBefore: string;
  emptyHintLink: string;
  /** Text after the "ask us" link. */
  emptyHintAfter: string;
  searchingStatus: string;
  checkIn: string;
  checkOut: string;
  submitQuote: string;
  submitSearch: string;
  errors: {
    placeEmpty: string;
    placeNotFound: (query: string) => string;
    placePick: string;
    checkInMissing: string;
    datePassed: string;
    checkOutMissing: string;
    checkOutOrder: string;
  };
}

export const hotelSearchCopy: Record<Locale, HotelSearchCopy> = {
  en: {
    ariaLabel: "Hotel search",
    roomsLabel: "Rooms",
    rooms: (n) => `${n} ${n === 1 ? "room" : "rooms"}`,
    adultsLabel: "Adults",
    adults: (n) => `${n} ${n === 1 ? "adult" : "adults"}`,
    childrenLabel: "Children",
    children: (n) => `${n} ${n === 1 ? "child" : "children"}`,
    whereTo: "Where to",
    placePlaceholder: "City, area or hotel",
    popularHeading: "Popular destinations",
    emptyTitle: (query) => `No destinations match “${query}”`,
    emptyCallToBook:
      "Press Get a quote and an agent will find it for you by phone.",
    emptyHintBefore:
      "Try the city rather than the neighbourhood, or check the spelling. You can also ",
    emptyHintLink: "ask us to find it",
    emptyHintAfter: ".",
    searchingStatus: "Searching destinations",
    checkIn: "Check-in",
    checkOut: "Check-out",
    submitQuote: "Get a quote",
    submitSearch: "Search",
    errors: {
      placeEmpty: "Where are you going?",
      placeNotFound: (query) =>
        `We could not find “${query}”. Try the city name.`,
      placePick: "Pick a city or area from the list.",
      checkInMissing: "Add a check-in date.",
      datePassed: "That date has passed.",
      checkOutMissing: "Add a check-out date.",
      checkOutOrder: "Check-out must be after check-in.",
    },
  },
  es: {
    ariaLabel: "Búsqueda de hoteles",
    roomsLabel: "Habitaciones",
    rooms: (n) => `${n} ${n === 1 ? "habitación" : "habitaciones"}`,
    adultsLabel: "Adultos",
    adults: (n) => `${n} ${n === 1 ? "adulto" : "adultos"}`,
    childrenLabel: "Niños",
    children: (n) => `${n} ${n === 1 ? "niño" : "niños"}`,
    whereTo: "Destino",
    placePlaceholder: "Ciudad, zona u hotel",
    popularHeading: "Destinos populares",
    emptyTitle: (query) => `Ningún destino coincide con “${query}”`,
    emptyCallToBook:
      "Pulse Obtener cotización y un agente lo buscará por teléfono.",
    emptyHintBefore:
      "Pruebe con la ciudad en lugar del barrio o revise la ortografía. También puede ",
    emptyHintLink: "pedirnos que lo busquemos",
    emptyHintAfter: ".",
    searchingStatus: "Buscando destinos",
    checkIn: "Entrada",
    checkOut: "Salida",
    submitQuote: "Obtener cotización",
    submitSearch: "Buscar",
    errors: {
      placeEmpty: "¿A dónde viaja?",
      placeNotFound: (query) =>
        `No encontramos “${query}”. Pruebe con el nombre de la ciudad.`,
      placePick: "Elija una ciudad o zona de la lista.",
      checkInMissing: "Agregue la fecha de entrada.",
      datePassed: "Esa fecha ya pasó.",
      checkOutMissing: "Agregue la fecha de salida.",
      checkOutOrder: "La salida debe ser posterior a la entrada.",
    },
  },
};
