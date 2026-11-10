/**
 * Promotional offers.
 *
 * ⚠️ READ BEFORE THIS SITE GOES LIVE OR REACHES GOOGLE ADS ⚠️
 *
 * An advertised discount is a claim, and the same rule governs it as governs
 * everything else in `lib/config`: it has to be true, it has to be honourable,
 * and it has to be substantiable if a reviewer or a customer asks.
 *
 * Two things in particular:
 *
 * 1. WHAT IS BEING DISCOUNTED. We are an agency and a broker. We do not set
 *    airfares, room rates, rental rates, cruise fares or charter prices — the
 *    supplier does. The only money in a booking that is genuinely ours to
 *    discount is our own service fee, so that is what this offer reduces, and
 *    the copy says so in as many words. An offer worded as "10% off your
 *    trip" would be a discount on somebody else's price that we are in no
 *    position to give, and that is a misrepresentation rather than a
 *    marketing flourish.
 *
 * 2. THE TERMS BELOW MUST BE REAL. `termsUrl` has to resolve to a page setting
 *    out the conditions in full, and `expiresOn` has to be a date the business
 *    will actually honour to. Both are checked at render time — see
 *    `activePromotion()` — and the popup does not appear if either is missing
 *    or the date has passed. That is deliberate: a promotional banner that
 *    outlives its own terms is the most common way a legitimate offer turns
 *    into a complaint.
 *
 * Set `enabled: false` to switch the popup off entirely without deleting the
 * copy.
 */
export interface Promotion {
  enabled: boolean;
  /** Bumping this re-shows the popup to people who dismissed the previous one. */
  id: string;
  eyebrow: string;
  headline: string;
  /** The offer in one sentence. Must name what is actually being discounted. */
  body: string;
  /** Percentage off. Displayed as the headline number. */
  percentage: number;
  /** The code a traveller quotes. Must be one the team will actually honour. */
  code: string;
  /** ISO date. The popup stops rendering the day after this. */
  expiresOn: string;
  /** The three conditions worth stating on the popup itself. */
  conditions: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  /** Page carrying the conditions in full. Required — see note 2 above. */
  termsUrl: string;
  /**
   * Milliseconds after page load before the popup appears.
   *
   * Not zero. A modal that lands during first paint is dismissed reflexively
   * before it is read, competes with the Largest Contentful Paint, and on a
   * slow connection can arrive while the page is still assembling underneath
   * it. A short delay after the hero has settled performs better and is far
   * less hostile.
   */
  delayMs: number;
}

export const earlyBirdPromotion: Promotion = {
  // On: shown on the home page and every booking section. Confirm the expiry
  // below is a date the business will honour before this reaches Google Ads.
  enabled: true,
  id: "early-bird-2026-10",
  eyebrow: "Early bird",
  headline: "10% off our service fee",
  // Note the precision here. Not "10% off your booking" — see note 1 above.
  body: "Book at least 60 days before you travel and we will take 10% off our own service fee on the booking. The supplier's price is theirs to set, so that part is unchanged — and it is still itemised separately on your quote, as always.",
  percentage: 10,
  code: "EARLYBIRD10",
  // TODO_PROMOTION_EXPIRY — confirm the date the business will honour this to
  // and update it. The popup hides itself the day after this date.
  expiresOn: "2026-12-31",
  conditions: [
    "Applies to our service fee only, not to the supplier's price.",
    "Departure must be at least 60 days after the booking is confirmed.",
    "Quote the code when you request your quote — it cannot be applied afterwards.",
  ],
  ctaLabel: "See all deals",
  ctaHref: "/deals",
  termsUrl: "/fees-and-charges",
  delayMs: 2200,
};

/**
 * The promotion to show, or `null`.
 *
 * Every condition that would make the offer unhonourable is checked here
 * rather than in the component, so there is exactly one place that decides
 * whether a discount is live. An expired promotion returns `null` and nothing
 * renders — the banner cannot outlive its own terms.
 */
export function activePromotion(now: Date = new Date()): Promotion | null {
  const promotion = earlyBirdPromotion;

  if (!promotion.enabled) return null;
  if (!promotion.code || !promotion.termsUrl) return null;

  // Compared as ISO date strings so the result does not shift with the
  // server's timezone. The offer runs to the end of `expiresOn`.
  if (now.toISOString().slice(0, 10) > promotion.expiresOn) return null;

  return promotion;
}
