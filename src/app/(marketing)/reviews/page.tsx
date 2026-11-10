import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Prose } from "@/components/content/prose";
import { getAverageRating, reviews } from "@/lib/content/reviews";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatLongDate } from "@/lib/utils/format-date";

/**
 * Customer reviews.
 *
 * Noindexed while empty, for the same reason as /deals.
 *
 * Note what this page does NOT emit: no AggregateRating structured data, ever,
 * unless there are real reviews behind it. Marking up a star rating that no
 * customer produced is a fabricated claim, it is specifically penalised by
 * search engines, and under the FTC's rule on consumer reviews it is
 * actionable in its own right.
 */
export const metadata = buildMetadata({
  title: "Reviews",
  description:
    "What customers say about booking with us. We publish reviews tied to real bookings, we do not write our own, and we do not remove the unflattering ones.",
  path: "/reviews",
  noIndex: reviews.length === 0,
});

export default function ReviewsPage() {
  const average = getAverageRating();

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ]}
        title="Reviews"
        intro="Every review on this page is tied to a real booking we made for the person who wrote it. We do not write our own, we do not buy them, and we do not delete the unflattering ones."
      >
        {/*
          `getAverageRating` returns null with no reviews, and this block was
          rendering unconditionally — so the empty page opened with " out of 5
          from 0 reviews", which reads as a zero score rather than as an
          absence of scores. No reviews, no rating line.
        */}
        {average !== null && (
          <p className="mt-6 text-h3 text-text">
            {average} out of 5{" "}
            <span className="text-body-lg font-normal text-text-secondary">
              from {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </p>
        )}
      </PageIntro>

      <Section>

        {reviews.length === 0 ? (
          <div className="mt-8 measure">
            <Alert tone="info" title="No reviews published yet">
              <p>
                We have not published any customer reviews yet. Rather than fill
                the gap with testimonials nobody wrote, we are leaving this page
                honest and empty until real ones arrive.
              </p>
            </Alert>

            <Prose className="mt-8">
              <h2>Why there is nothing here</h2>
              <p>
                Invented testimonials are trivial to write and, on a travel site,
                almost expected — which is exactly why they are worth nothing.
                They are also unlawful in the United States: the Federal Trade
                Commission&apos;s rule on consumer reviews covers fake reviews,
                reviews written by insiders and presented as customers, and
                suppressing genuine negative ones.
              </p>
              <p>
                So this page stays empty until customers have written something,
                and each entry we publish will name what was booked and when.
              </p>
              <h2>How to judge us in the meantime</h2>
              <p>
                Read what we commit to and hold us to it. Our{" "}
                <Link href="/fees-and-charges">fees and charges</Link> page lists
                every fee we charge; our{" "}
                <Link href="/refund-and-cancellation-policy">
                  refund and cancellation policy
                </Link>{" "}
                sets out what happens when a trip changes; and{" "}
                <Link href="/about">about us</Link> says plainly what kind of
                business this is and what it is not.
              </p>
            </Prose>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Contact us</ButtonLink>
              <ButtonLink href="/how-it-works" variant="outline">
                How it works
              </ButtonLink>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <li key={review.id}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-h5 text-text">
                      <span aria-hidden="true">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="sr-only">
                        {review.rating} out of 5 stars
                      </span>
                    </p>
                    <Badge tone="neutral">{review.vertical}</Badge>
                  </div>

                  <p className="mt-3 flex-1 text-body text-gray-700">
                    {review.body}
                  </p>

                  <p className="mt-3 text-caption text-text-secondary">
                    {review.author} ·{" "}
                    <time dateTime={review.submittedAt}>
                      {formatLongDate(review.submittedAt)}
                    </time>
                  </p>

                  {/* Disclosure is mandatory where anything was given in return. */}
                  {review.incentivised && (
                    <p className="mt-1 text-caption text-text-muted">
                      This reviewer received an incentive for writing this review.
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
