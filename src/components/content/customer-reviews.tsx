import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { reviews, type Review } from "@/lib/content/reviews";
import { formatLongDate } from "@/lib/utils/format-date";

/**
 * Customer reviews for one kind of trip.
 *
 * Shows only the reviews in lib/content/reviews, each tied to a real booking.
 * Nothing is written to fill the space — invented reviews are illegal under
 * the FTC's review rule — so until real ones are added the block invites
 * travellers who booked with us to leave one.
 */
export function CustomerReviews({
  vertical,
  title = "What our travellers say",
}: {
  vertical: Review["vertical"];
  title?: string;
}) {
  const shown = reviews
    .filter((review) => review.vertical === vertical)
    .slice(0, 6);

  return (
    <div>
      <SectionHeading eyebrow="Reviews" title={title} />

      {shown.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((review) => (
            <li key={review.id}>
              <Card className="flex h-full flex-col">
                <p className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      className={index < review.rating ? "size-4" : "size-4 opacity-25"}
                    />
                  ))}
                  <span className="sr-only">{review.rating} out of 5 stars</span>
                </p>
                <p className="mt-3 flex-1 text-body text-gray-700">{review.body}</p>
                <p className="mt-4 text-caption text-text-secondary">
                  {review.author} ·{" "}
                  <time dateTime={review.submittedAt}>
                    {formatLongDate(review.submittedAt)}
                  </time>
                </p>
                {review.incentivised && (
                  <p className="mt-1 text-caption text-text-muted">
                    This reviewer received an incentive for writing this review.
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center rounded-xs bg-surface px-6 py-8 text-center ring-1 ring-inset ring-border">
          <p aria-hidden="true" className="flex gap-1 text-accent">
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon key={index} className="size-6" />
            ))}
          </p>
          <p className="mt-4 text-h4 text-text">
            Travelled with us? Tell others how it went.
          </p>
          <p className="mt-2 text-body-sm text-text-secondary">
            Every review here comes from a real booking and is published under
            the traveller&apos;s own name.
          </p>
          <ButtonLink href="/reviews" variant="outline" className="mt-5">
            Read and write reviews
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
