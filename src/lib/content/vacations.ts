/**
 * Vacation package reference content.
 *
 * How a package is assembled and what it does and does not include are stable
 * facts about how the industry works, so they are safe to publish. Prices and
 * savings are not, and none appear here — "save up to 40%" is the single most
 * common claim in this corner of travel and almost never survives contact with
 * a specific trip.
 *
 * The "when it is not worth it" list is deliberately as long as the other one.
 * A page that only argues for the thing it sells is an advert; the useful
 * service is telling somebody when to book the parts separately, because they
 * will find out either way and would rather find out from us.
 */

/** When bundling genuinely helps. */
export const packageSuits: readonly string[] = [
  "Beach and resort trips on established leisure routes, where operators hold contracted allotments and the bundled rate reflects them.",
  "Families, where transfers and checked bags across four or five people are a material part of the total rather than a rounding error.",
  "All-inclusive stays, where the board basis is most of the cost and the flight is the smaller half of the decision.",
  "Trips where you would rather one organiser is answerable for the whole thing than hold three separate bookings that do not know about each other.",
];

/** When it does not, which is more often than package marketing suggests. */
export const packageDoesNotSuit: readonly string[] = [
  "Short city breaks, where the flight dominates the cost and the hotel is a night or two — booking the two separately usually gives you more choice for the same money.",
  "Anywhere you want to use airline miles, a companion fare or status benefits. A package fare is normally ineligible for all three.",
  "Trips where you already know the exact flight and the exact hotel you want. If they are not in the same package, forcing them into one costs more, not less.",
  "Plans that are still moving. Package terms are typically less flexible than the two bookings separately, and the change fee applies to the whole thing rather than the half you wanted to move.",
];
