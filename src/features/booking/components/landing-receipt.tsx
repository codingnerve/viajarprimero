import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * What the quote contains, drawn as the receipt it will become. Every line is
 * something the site's own fees page commits to; amounts are left as "on the
 * call" because we hold no fares of our own and will not print an invented one.
 */
export function LandingReceipt({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const { receipt } = copy;

  return (
    <Section tone="muted" size="md">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-md rounded-xs bg-surface px-7 pb-10 pt-8 shadow-lg lg:-rotate-1 motion-reduce:rotate-0">
            <p className="text-center text-overline uppercase text-text-muted">
              {receipt.header}
            </p>
            <dl className="mt-6 space-y-5">
              {receipt.lines.map((line) => (
                <div key={line.label}>
                  <div className="flex items-baseline gap-3">
                    <dt className="text-h5 text-text">{line.label}</dt>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 border-t border-dotted border-border-strong"
                    />
                    <dd className="text-body-sm font-semibold tabular-nums text-primary">
                      {receipt.onCall}
                    </dd>
                  </div>
                  <p className="mt-0.5 text-caption text-text-muted">{line.note}</p>
                </div>
              ))}
            </dl>

            <div className="mt-7 border-t-2 border-dashed border-border-strong pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-h4 text-text">{receipt.total}</p>
                <p className="font-display text-h3 italic text-primary">
                  {receipt.totalValue}
                </p>
              </div>
              <p className="mt-3 text-body-sm text-text-secondary">
                {receipt.rules}
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
          <p className="text-overline uppercase text-primary">{receipt.eyebrow}</p>
          <h2 className="mt-3 text-display text-text">{receipt.title}</h2>
          <p className="mt-5 max-w-lg text-body-lg text-text-secondary">
            {receipt.body}
          </p>
          <ButtonLink
            href={phone.href}
            variant="outline"
            size="lg"
            className="mt-8"
            icon={<PhoneIcon className="size-5 text-primary" />}
          >
            {receipt.cta(phone.display)}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
