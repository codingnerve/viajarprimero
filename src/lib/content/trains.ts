/**
 * Rail operator guides.
 *
 * Same rule as the airline and cruise-line directories: an operator's name,
 * its home country and the kind of service it runs are facts; fares,
 * timetables, allowances and fare rules are not, and none are hard-coded here.
 * Journey times are rounded guidance only. Anything that depends on the
 * ticket is deferred to the team, who confirm it before a booking is made.
 *
 * Copy here must not name the brand, the phone number or the email address —
 * those come from `lib/config/site.ts` at render time.
 */

export type TrainCorridor = {
  label: string;
  /** Rounded guidance, e.g. "about 3h". Never a timetable. */
  typicalDuration: string;
};

export type TrainStation = {
  /**
   * Unique key across all operators. Amtrak stations use Amtrak's own
   * three-letter station code; stations of operators without a public code
   * use an internal `XX-NAME` key. It is never shown as if it were official.
   */
  code: string;
  name: string;
  city: string;
};

export type SeatClass = { name: string; description: string };

export type TrainOperator = {
  id: string;
  slug: string;
  code: string;
  name: string;
  country: string;
  logoAccent: "primary" | "secondary" | "accent";
  /** Listing card. */
  summary: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** Three short chips. */
  highlights: string[];
  guideIntro: string;
  whyBook: string;
  howToBook: string;
  manageBooking: string;
  seatClassesIntro: string;
  seatClasses: SeatClass[];
  changePolicy: string;
  cancellationPolicy: string;
  baggageIntro: string;
  baggage: { title: string; detail: string }[];
  stationCheckIn: string;
  popularCorridors: TrainCorridor[];
  stations: TrainStation[];
  faqs: { question: string; answer: string }[];
};

export const trainOperators: readonly TrainOperator[] = [
  {
    id: "amtrak",
    slug: "amtrak",
    code: "AMTK",
    name: "Amtrak",
    country: "United States",
    logoAccent: "primary",
    summary:
      "Intercity passenger rail across the United States, from the busy Northeast Corridor to long-distance routes through the Midwest, the Mountain West and the Pacific coast.",
    intro:
      "Amtrak runs intercity passenger trains across the United States, including the Northeast Corridor between Boston, New York and Washington and long-distance routes such as the Empire Builder and the Coast Starlight. Tell us where and when you want to travel and our team will check the options with you.",
    highlights: [
      "Northeast Corridor and long-distance routes",
      "Coach, Business and sleeping-car options",
      "Handled by a real travel agent",
    ],
    guideIntro:
      "Amtrak is the national passenger railroad of the United States. Services range from frequent city-to-city trains in the Northeast to multi-day long-distance journeys with sleeping accommodation. Which services, seat types and fares apply depends on the route, the date and the train, so this guide explains how booking works and what to ask before you commit.",
    whyBook:
      "Rail itineraries are often one part of a bigger trip: a flight in, a few days of hotels, a car at the other end. Sending us the whole picture means one person checks that the connections make sense, explains the fare rules attached to your ticket in plain language, and tells you the full price before anything is booked.",
    howToBook:
      "Send us your route, travel dates and how many passengers are travelling, using the search above or by phone. We check live schedules and fares, come back with the options that fit, and explain the rules on each one. Nothing is booked until you have agreed, and no payment is taken on this website.",
    manageBooking:
      "If you booked through us, contact us with your name and travel date and we will help with changes, questions about your ticket or a disrupted journey. For live train status on the day, the operator's own app and station boards are the authority.",
    seatClassesIntro:
      "Which classes are offered depends on the train. Many routes sell the options below; we confirm exactly what is on your service before you decide.",
    seatClasses: [
      {
        name: "Coach",
        description:
          "The standard seat on most services, with reserved or unreserved seating depending on the train. A sensible choice for shorter daytime journeys.",
      },
      {
        name: "Business and First",
        description:
          "A step up in space and comfort on selected trains, usually with extra legroom and a quieter seating area. Availability varies by service and date.",
      },
      {
        name: "Sleeping car",
        description:
          "Private rooms with beds on many long-distance overnight trains. Room types differ in size and facilities, and the fare structure differs from a seat fare, so we walk you through what is included.",
      },
    ],
    changePolicy:
      "Whether a ticket can be changed, and what that costs, depends on the fare you buy and on the operator's rules at the time. We check the conditions attached to your specific ticket and tell you before you book, so there are no surprises later. If your plans change after booking, contact us as early as you can.",
    cancellationPolicy:
      "Refund rules differ between fare types and can change with how close to departure you cancel. We read out the cancellation conditions for your fare before booking, and any fee the operator charges is passed on to you at cost. Our own service fee is covered in our fees and charges page.",
    baggageIntro:
      "Allowances depend on the ticket and the service, so treat the points below as the questions to ask rather than a promise of what is included.",
    baggage: [
      {
        title: "Carry-on luggage",
        detail:
          "Trains generally let you keep a limited amount of luggage with you in the carriage. We confirm the carry-on rules for your service and ticket.",
      },
      {
        title: "Checked luggage",
        detail:
          "Checked baggage is only offered at some stations and on some trains. If you are travelling with large bags, ask us before you book.",
      },
    ],
    stationCheckIn:
      "Large stations on busy corridors can be crowded, so plan to arrive with time to spare and check the departure board for your platform. Bring the photo ID and the booking details we send you. Some stations have staffed ticket counters and assistance services; we can point you to what your departure station offers.",
    popularCorridors: [
      { label: "Boston – New York", typicalDuration: "about 4h" },
      { label: "New York – Philadelphia", typicalDuration: "about 1h 30m" },
      { label: "New York – Washington", typicalDuration: "about 3h" },
      { label: "Boston – Washington", typicalDuration: "about 7h 30m" },
      { label: "Chicago – St. Louis", typicalDuration: "about 5h 30m" },
      { label: "Seattle – Portland", typicalDuration: "about 3h 30m" },
      { label: "Los Angeles – San Diego", typicalDuration: "about 2h 45m" },
      { label: "Chicago – New York", typicalDuration: "about 19h" },
    ],
    stations: [
      { code: "NYP", name: "New York Penn Station", city: "New York" },
      { code: "WAS", name: "Washington Union Station", city: "Washington, DC" },
      { code: "BOS", name: "Boston South Station", city: "Boston" },
      { code: "PHL", name: "Philadelphia 30th Street Station", city: "Philadelphia" },
      { code: "BAL", name: "Baltimore Penn Station", city: "Baltimore" },
      { code: "CHI", name: "Chicago Union Station", city: "Chicago" },
      { code: "STL", name: "St. Louis Gateway Station", city: "St. Louis" },
      { code: "LAX", name: "Los Angeles Union Station", city: "Los Angeles" },
      { code: "SAN", name: "San Diego Santa Fe Depot", city: "San Diego" },
      { code: "SEA", name: "Seattle King Street Station", city: "Seattle" },
      { code: "PDX", name: "Portland Union Station", city: "Portland" },
      { code: "NOL", name: "New Orleans Union Passenger Terminal", city: "New Orleans" },
    ],
    faqs: [
      {
        question: "Can you book Amtrak tickets for me?",
        answer:
          "Yes. Send us the route, dates and number of passengers and our team will check availability and fares, explain the ticket conditions and confirm the full price with you before anything is booked.",
      },
      {
        question: "Do you show Amtrak prices on this page?",
        answer:
          "No. Fares change with date, demand and ticket type, so we do not publish figures we cannot guarantee. We give you a firm price in writing before you agree to book.",
      },
      {
        question: "Can I combine a train journey with flights or a hotel?",
        answer:
          "Yes. Many travellers pair a rail leg with flights, hotels or a rental car. Tell us the whole trip and we will check that the timings connect.",
      },
      {
        question: "Is payment taken on this website?",
        answer:
          "No. This website only sends us your request. Payment is discussed with you directly after we have confirmed the details.",
      },
    ],
  },
  {
    id: "tren-maya",
    slug: "tren-maya",
    code: "MAYA",
    name: "Tren Maya",
    country: "Mexico",
    logoAccent: "accent",
    summary:
      "A passenger railway across the Yucatán Peninsula, linking the Caribbean coast, colonial cities and archaeological regions without a rental car.",
    intro:
      "Tren Maya connects destinations on Mexico's Yucatán Peninsula, including Cancún, Playa del Carmen, Tulum, Mérida and Campeche. It is a way to move between the coast and the interior without driving. Send us your dates and stops and our team will check what is running and what it costs.",
    highlights: [
      "Cancún, Tulum, Mérida and Campeche",
      "Standard and Premium classes",
      "Handled by a real travel agent",
    ],
    guideIntro:
      "Tren Maya is a passenger railway on the Yucatán Peninsula in southeastern Mexico. Service patterns, stations in operation and ticket rules have changed since the line opened, so we confirm the current position for your dates rather than rely on an out-of-date description. This guide explains how booking works and what to ask before you commit.",
    whyBook:
      "The line is usually one piece of a longer trip: flights into Cancún or Mérida, hotels in several towns, and transfers between stations and town centres. Giving us the full itinerary means one person checks that the timings connect, explains the ticket conditions in plain language and confirms the price before anything is booked.",
    howToBook:
      "Send us your stops, travel dates and how many passengers are travelling, using the search above or by phone. We check what is available for your dates, come back with options and explain the rules on each. Nothing is booked until you have agreed, and no payment is taken on this website.",
    manageBooking:
      "If you booked through us, contact us with your name and travel date and we will help with changes and questions about your ticket. For live information on the day of travel, the operator's own channels and the station are the authority.",
    seatClassesIntro:
      "The service is sold in more than one class. The summary below is a guide to the kind of choice involved; we confirm exactly what is offered on your train and date.",
    seatClasses: [
      {
        name: "Standard",
        description:
          "The everyday seat, suited to shorter hops between towns on the coast or between nearby cities.",
      },
      {
        name: "Premium",
        description:
          "A higher class with more space and added comforts, worth asking about for longer legs. What it includes varies by service, so we confirm before you choose.",
      },
    ],
    changePolicy:
      "Whether a ticket can be changed, and at what cost, depends on the fare and on the operator's rules at the time. Fares and conditions can also differ by passenger category, for example residents and visitors. We check the rules that apply to you and tell you before booking.",
    cancellationPolicy:
      "Refund conditions depend on the fare and on how close to departure you cancel. We explain the cancellation terms for your ticket before booking, and any charge the operator makes is passed on to you at cost. Our own service fee is covered on our fees and charges page.",
    baggageIntro:
      "Luggage rules depend on the ticket and the service. Treat the points below as the questions to ask rather than a promise of what is included.",
    baggage: [
      {
        title: "Carry-on luggage",
        detail:
          "Passengers generally keep a limited amount of luggage with them in the carriage. We confirm the carry-on rules for your service.",
      },
      {
        title: "Larger bags",
        detail:
          "If you are travelling with large suitcases, surfboards or sports equipment, ask us before you book so we can check whether and how they can be carried.",
      },
    ],
    stationCheckIn:
      "Some stations sit outside the town centre, so allow time for the transfer between your hotel and the station. Arrive early, and bring the photo ID or passport used for the booking, as it may be checked. We tell you which station each of your journeys uses so there is no confusion between stops with similar names.",
    popularCorridors: [
      { label: "Cancún – Playa del Carmen", typicalDuration: "about 1h" },
      { label: "Cancún Airport – Tulum", typicalDuration: "about 1h 30m" },
      { label: "Playa del Carmen – Tulum", typicalDuration: "about 1h" },
      { label: "Cancún – Mérida", typicalDuration: "about 4h 30m" },
      { label: "Mérida – Campeche", typicalDuration: "about 2h" },
      { label: "Mérida – Valladolid", typicalDuration: "about 1h 30m" },
      { label: "Tulum – Bacalar", typicalDuration: "about 2h" },
      { label: "Campeche – Palenque", typicalDuration: "about 3h 30m" },
    ],
    stations: [
      { code: "TM-CUNAIR", name: "Cancún Airport", city: "Cancún" },
      { code: "TM-CUN", name: "Cancún", city: "Cancún" },
      { code: "TM-PMOR", name: "Puerto Morelos", city: "Puerto Morelos" },
      { code: "TM-PDC", name: "Playa del Carmen", city: "Playa del Carmen" },
      { code: "TM-TUL", name: "Tulum", city: "Tulum" },
      { code: "TM-BAC", name: "Bacalar", city: "Bacalar" },
      { code: "TM-CHE", name: "Chetumal", city: "Chetumal" },
      { code: "TM-MER", name: "Mérida", city: "Mérida" },
      { code: "TM-IZA", name: "Izamal", city: "Izamal" },
      { code: "TM-VAL", name: "Valladolid", city: "Valladolid" },
      { code: "TM-CAM", name: "Campeche", city: "Campeche" },
      { code: "TM-PAL", name: "Palenque", city: "Palenque" },
    ],
    faqs: [
      {
        question: "Can you book Tren Maya tickets for me?",
        answer:
          "Yes. Send us your stops, dates and number of passengers and our team will check availability and fares, explain the ticket conditions and confirm the full price with you before anything is booked.",
      },
      {
        question: "Which stations are currently in service?",
        answer:
          "Stations and service patterns have changed since the line opened, so we check the current position for your travel dates and tell you which stops your journey can use.",
      },
      {
        question: "Can I add flights and hotels to my rail trip?",
        answer:
          "Yes. Many travellers combine the train with flights into Cancún or Mérida and hotels in several towns. Tell us the whole trip and we will check that the timings connect.",
      },
      {
        question: "Is payment taken on this website?",
        answer:
          "No. This website only sends us your request. Payment is discussed with you directly after we have confirmed the details.",
      },
    ],
  },
];

export function findTrainOperator(slug: string): TrainOperator | undefined {
  return trainOperators.find((operator) => operator.slug === slug);
}

/** Every operator's stations, de-duplicated by `code`, for the hub search. */
export const allTrainStations: readonly TrainStation[] = [
  ...new Map(
    trainOperators
      .flatMap((operator) => operator.stations)
      .map((station) => [station.code, station] as const),
  ).values(),
];
