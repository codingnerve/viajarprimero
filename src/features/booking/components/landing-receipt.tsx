import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

const LINES = [
  { label: "Airfare", note: "the carrier's fare for your dates" },
  { label: "Taxes & carrier-imposed charges", note: "itemised, not folded in" },
  { label: "Our service fee", note: "stated as its own line" },
] as const;

/**
 * What the quote contains, drawn as the receipt it will become. Every line is
 * something the site's own fees page commits to; amounts are left as "on the
 * call" because we hold no fares of our own and will not print an invented one.
 */
export function LandingReceipt({ phone }: { phone: LandingPhone }) {
  return (
    <Section tone="muted" size="md">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-md rounded-xs bg-surface px-7 pb-10 pt-8 shadow-lg lg:-rotate-1 motion-reduce:rotate-0">
            <p className="text-center text-overline uppercase text-text-muted">
              Your quote · read aloud, then confirmed
            </p>
            <dl className="mt-6 space-y-5">
              {LINES.map((line) => (
                <div key={line.label}>
                  <div className="flex items-baseline gap-3">
                    <dt className="text-h5 text-text">{line.label}</dt>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 border-t border-dotted border-border-strong"
                    />
                    <dd className="text-body-sm font-semibold tabular-nums text-primary">
                      on the call
                    </dd>
                  </div>
                  <p className="mt-0.5 text-caption text-text-muted">{line.note}</p>
                </div>
              ))}
            </dl>

            <div className="mt-7 border-t-2 border-dashed border-border-strong pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-h4 text-text">Total, before you pay</p>
                <p className="font-display text-h3 italic text-primary">
                  one number
                </p>
              </div>
              <p className="mt-3 text-body-sm text-text-secondary">
                Plus the fare rules for this ticket, explained: changes,
                cancellations and baggage.
              </p>
            </div>

            {/* Torn edge. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-2 h-2 bg-surface [mask:conic-gradient(from_-45deg_at_bottom,transparent,black_1deg_90deg,transparent_91deg)_50%_/_16px_100%]"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-overline uppercase text-primary">The price</p>
          <h2 className="mt-3 text-display text-text">
            Built line by line, so nothing hides in the total.
          </h2>
          <p className="mt-5 max-w-lg text-body-lg text-text-secondary">
            A headline fare is only the first line of a ticket. We read you all
            of them, including the one that is ours, and you can ask about any
            of them before a card comes out.
          </p>
          <ButtonLink
            href={phone.href}
            variant="outline"
            size="lg"
            className="mt-8"
            icon={<PhoneIcon className="size-5 text-primary" />}
          >
            Ask for your quote · {phone.display}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
