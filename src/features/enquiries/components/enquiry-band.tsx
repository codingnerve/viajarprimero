import type { ReactNode } from "react";

import { CallPrompt } from "@/components/layout/call-prompt";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryForm } from "@/features/enquiries/components/enquiry-form";
import { ENQUIRY_ANCHOR } from "@/features/enquiries/lib/enquiry-link";
import type { Enquiry, EnquiryVertical } from "@/features/enquiries/types";
import { bookingConfig } from "@/lib/config/booking";
import { cn } from "@/lib/utils/cn";

/**
 * A quote request given a full band of the page, rather than a sidebar.
 *
 * `EnquiryPanel` is the sticky 23rem aside that sits beside editorial content.
 * It works where the request is a secondary action next to something a
 * traveller is reading. It does not work where the request *is* the page: a
 * form with a departure port, a destination and a date, then a name, an email
 * and two consent checkboxes, squeezed into a single 23rem column, becomes a
 * tall stack of narrow boxes that reads as an afterthought.
 *
 * So this gives the form the width instead. The fields sit two across, the
 * picklists have room to show a port name without truncating it, and the
 * assurances move to a column beside the form rather than a header above it.
 *
 * The anchor stays `#request`, because links to it are already out there —
 * every quick form on the home page hands over to one.
 */
export function EnquiryBand({
  vertical,
  eyebrow,
  title,
  description,
  disclaimer,
  points,
  aside,
  initial,
  className,
}: {
  vertical: EnquiryVertical;
  eyebrow: string;
  title: string;
  description: string;
  /**
   * What we are and what we are not. Required rather than defaulted: every
   * vertical has a different supplier and a different governing document, and
   * a generic fallback would be the wrong one two times in three.
   */
  disclaimer: string;
  /** Short assurances. Each must be literally true of this funnel. */
  points: readonly string[];
  /** Anything else worth saying beside the form — how the reply works. */
  aside?: ReactNode;
  /** Pre-fills the form from the page it sits on. */
  initial?: Partial<Enquiry>;
  className?: string;
}) {
  return (
    <div
      id={ENQUIRY_ANCHOR}
      className={cn(
        "scroll-mt-[calc(var(--header-height)+1.5rem)]",
        className,
      )}
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-12">
        <div className="min-w-0 rounded-2xl bg-surface p-6 shadow-lg ring-1 ring-inset ring-border md:p-8">
          {bookingConfig.callToBook && (
            <>
              <CallPrompt />
              <p className="mb-4 mt-6 text-overline uppercase text-text-muted">
                Or send us your trip
              </p>
            </>
          )}
          <EnquiryForm vertical={vertical} initial={initial} />
        </div>

        <aside className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          <ul className="space-y-3">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-body-sm text-text-secondary"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                {point}
              </li>
            ))}
          </ul>

          {aside && (
            <div className="mt-8 rounded-xl bg-surface-2 p-5">{aside}</div>
          )}

          <p className="mt-8 border-t border-border pt-5 text-caption text-text-muted">
            {disclaimer}
          </p>
        </aside>
      </div>
    </div>
  );
}
