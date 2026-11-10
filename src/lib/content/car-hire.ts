/**
 * Car rental reference content.
 *
 * Vehicle classes and the structure of a rental bill are stable facts about
 * how the industry works, so they are safe to publish. Actual rates are not,
 * and none appear here — a rental price depends on the pick-up point, the
 * date, the driver's age and the supplier's fleet on the day.
 *
 * The "what is usually extra" list exists because unexpected counter charges
 * are the single most common car rental complaint. Setting the expectation
 * before the traveller books is both the useful thing to do and the opposite
 * of the "unclear billing" pattern that Google Ads penalises.
 */

export interface VehicleClass {
  slug: string;
  name: string;
  typicalFor: string;
  seats: string;
  luggage: string;
  note: string;
}

export const vehicleClasses: readonly VehicleClass[] = [
  {
    slug: "economy",
    name: "Economy",
    typicalFor: "Two adults travelling light, city driving, short hops.",
    seats: "4–5",
    luggage: "1 large case or 2 cabin bags",
    note: "Cheapest to hire and to fuel, but genuinely tight with four adults and their luggage. Often a manual gearbox outside the US.",
  },
  {
    slug: "compact",
    name: "Compact",
    typicalFor: "The default choice for most European trips.",
    seats: "5",
    luggage: "1 large case + 1 cabin bag",
    note: "Small enough for older town centres and multi-storey car parks, which matters more than engine size on a European itinerary.",
  },
  {
    slug: "intermediate",
    name: "Intermediate / mid-size",
    typicalFor: "Four adults, or two adults with real luggage.",
    seats: "5",
    luggage: "2 large cases",
    note: "The sensible step up when a compact would mean putting a case on someone's lap. Usually a small price difference.",
  },
  {
    slug: "suv",
    name: "SUV",
    typicalFor: "Families, ski trips, unpaved or mountain roads.",
    seats: "5–7",
    luggage: "3+ large cases depending on row configuration",
    note: "A seven-seat SUV with all rows up has almost no boot space. If you need seven seats and luggage, you need a van.",
  },
  {
    slug: "minivan",
    name: "Minivan / people carrier",
    typicalFor: "Groups of six or more travelling together.",
    seats: "7–9",
    luggage: "4+ large cases",
    note: "Almost always cheaper than two smaller cars once fuel, tolls and a second insurance excess are counted.",
  },
  {
    slug: "convertible",
    name: "Convertible",
    typicalFor: "Coastal and scenic driving routes.",
    seats: "2–4",
    luggage: "1 cabin bag with the roof down",
    note: "Boot space largely disappears when the roof is stowed. Check the figure with the roof down, not up.",
  },
];
