import { EnquiryForm } from "@/features/enquiries/components/enquiry-form";
import { ENQUIRY_ANCHOR } from "@/features/enquiries/lib/enquiry-link";
import { CallPrompt } from "@/components/layout/call-prompt";
import { CheckIcon } from "@/components/ui/icons";
import type { Enquiry, EnquiryVertical } from "@/features/enquiries/types";
import { bookingConfig } from "@/lib/config/booking";
import { cn } from "@/lib/utils/cn";

/**
 * The quote-request panel on a vertical landing page.
 *
 * Hotels, car rental and cruises each had their own copy of this — a Card, a
 * heading, a reassurance line, the agency disclaimer as an Alert, and the
 * form. Three copies of the same aside is how the disclaimer ends up worded
 * differently on one of them, which for this particular block is a compliance
 * problem rather than a cosmetic one.
 *
 * It owns the `#request` anchor the whole site links to (`ENQUIRY_ANCHOR`),
 * including from the home page hero, so the scroll target cannot go missing
 * from one vertical.
 */
export function EnquiryPanel({
  vertical,
  title,
  /**
   * What we are and what we are not. Required rather than defaulted: every
   * vertical has a different supplier and a different governing document, and
   * a generic fallback would be the wrong one two times in three.
   */
  disclaimer,
  aircraftCategories,
  initial,
  intro,
  className,
}: {
  vertical: EnquiryVertical;
  title: string;
  disclaimer: string;
  /** Private jets only. Ignored by the other verticals. */
  aircraftCategories?: ReadonlyArray<{ slug: string; name: string; seats: string }>;
  /**
   * Pre-fills the form from the page it sits on — the city on a hotel guide,
   * the airport on a pick-up point, the line on a cruise page. A traveller who
   * reached the London page should not have to type "London".
   */
  initial?: Partial<Enquiry>;
  /** Replaces the three default assurances where a page can be specific. */
  intro?: string;
  className?: string;
}) {
  return (
    <aside
      id={ENQUIRY_ANCHOR}
      className={cn(
        "scroll-mt-[calc(var(--header-height)+1.5rem)]",
        "lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start",
        className,
      )}
    >
      <div className="overflow-hidden rounded-2xl bg-surface shadow-lg ring-1 ring-inset ring-border">
        <div className="bg-brand-wash px-6 py-6">
          <h2 className="text-h3 text-text-inverse">{title}</h2>
          {intro ? (
            <p className="mt-3 text-body-sm text-text-on-dark">{intro}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {[
                "No account needed",
                "Nothing is charged",
                "An agent gets back to you",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-body-sm text-text-on-dark"
                >
                  <CheckIcon className="size-4 shrink-0 text-gray-400" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6">
          {bookingConfig.callToBook && (
            <>
              <CallPrompt />
              <p className="mb-4 mt-6 text-overline uppercase text-text-muted">
                Or send us your trip
              </p>
            </>
          )}
          <EnquiryForm
            vertical={vertical}
            aircraftCategories={aircraftCategories}
            initial={initial}
          />
        </div>

        <p className="border-t border-border bg-surface-2 px-6 py-4 text-caption text-text-muted">
          {disclaimer}
        </p>
      </div>
    </aside>
  );
}
