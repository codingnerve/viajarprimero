import { enquiryHref } from "@/features/enquiries/lib/enquiry-link";
import { airportLabel } from "@/lib/providers/skyaccess";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatLongDate } from "@/lib/utils/format-date";
import type { JetFlight } from "@/types/private-jet";

/**
 * The link from a result card to the quote form.
 *
 * A traveller who has just picked one aircraft out of a list of forty should
 * not arrive at an empty form. This carries the leg across — departure field,
 * arrival field, date, party size, cabin category — and writes what they
 * chose into the notes so the person reading the request knows which of
 * forty it was.
 *
 * It deliberately does not carry the price. The figure on the card is the
 * marketplace's estimate, and repeating it inside a request the traveller
 * signs their name to would read as an agreed number. The reference is
 * enough for us to pull the same leg up.
 *
 * One consumer today. It lives in the feature rather than in `lib/` for
 * exactly that reason — it moves out when a second one appears.
 */
export function jetEnquiryHref(
  flight: JetFlight,
  options: { passengers?: number } = {},
): string {
  const origin = airportLabel(flight.origin);
  const destination = airportLabel(flight.destination);
  const departsOn = flight.departure.earliest.slice(0, 10);

  const reference = [
    `Empty leg from the search: ${flight.origin.code || flight.origin.icao} to ${flight.destination.code || flight.destination.icao} on ${formatLongDate(departsOn)}.`,
    `Aircraft ${flight.aircraft.model}${flight.aircraft.categoryName ? ` (${flight.aircraft.categoryName})` : ""}, ${flight.availableSeats} seats.`,
    flight.departure.isWindow
      ? "Listed with a departure window rather than a fixed time."
      : null,
    flight.price
      ? `Listed estimate ${formatCurrency(flight.price.amountMinorUnits, flight.price.currency, { showCents: false })} — please confirm the actual price.`
      : "No price published for this leg.",
    `Reference ${flight.id}.`,
  ]
    .filter(Boolean)
    .join(" ");

  return enquiryHref("jet", {
    origin,
    destination,
    startDate: departsOn,
    /*
      A charter is sold one leg at a time, so the request is explicitly a
      one-way and carries no end date. Seeding a return here would put a date
      in front of our team that the traveller never chose.
    */
    jetTripType: "one-way",
    adults: Math.max(1, options.passengers ?? flight.availableSeats),
    aircraftCategorySlug: flight.aircraft.categorySlug ?? undefined,
    notes: reference,
  });
}
