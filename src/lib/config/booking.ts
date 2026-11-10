/**
 * How bookings are taken right now.
 *
 * `callToBook: true` — every search (flights, hotels, private jets) lands on a
 * book-by-phone panel instead of supplier results, and the quote forms on the
 * car rental, cruise and vacation pages lead with the phone number. No
 * supplier is called, so no price, availability or sample result is shown
 * that an agent has not actually quoted.
 *
 * Flip to `false` once the fare, hotel and charter feeds are live and
 * bookable; the results pages fall back to their supplier outcomes.
 */
export const bookingConfig: { callToBook: boolean } = {
  callToBook: true,
};
