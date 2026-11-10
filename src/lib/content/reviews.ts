/**
 * Customer reviews.
 *
 * THIS ARRAY IS EMPTY ON PURPOSE.
 *
 * Fabricated testimonials are the single fastest way to lose a travel
 * advertising account, and in the United States they are separately actionable
 * under the FTC's rule on consumer reviews and testimonials — which covers
 * invented reviews, reviews written by insiders presented as customers, and
 * suppressing negative reviews to skew an average.
 *
 * So this file holds nothing until real customers have written something, and
 * the type forces each entry to be traceable to a booking. `/reviews` renders
 * an honest empty state meanwhile, and is noindexed while empty.
 *
 * If reviews are later collected through a third-party platform, prefer
 * rendering that platform's verified widget over copying its text into here —
 * the platform's own verification is the part that carries weight.
 */
export interface Review {
  id: string;
  /** Display name as the reviewer consented to it being published. */
  author: string;
  /** ISO date the review was submitted. */
  submittedAt: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** Which service the review is about. */
  vertical: "flight" | "stay" | "car" | "cruise" | "vacation" | "jet";
  /**
   * Internal booking reference the review is tied to. Required: a review that
   * cannot be traced to a real booking must not be published.
   */
  bookingReference: string;
  /** Whether the reviewer was given anything in exchange. Must be disclosed. */
  incentivised: boolean;
}

export const reviews: readonly Review[] = [];

/**
 * Average rating, or null when there is nothing to average.
 *
 * Returning null rather than 0 matters: the caller must render "no reviews
 * yet" rather than a zero-star average, and must not emit AggregateRating
 * structured data for an empty set. Marking up a rating with no reviews behind
 * it is a fabricated claim that search engines penalise directly.
 */
export function getAverageRating(): number | null {
  if (reviews.length === 0) return null;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
