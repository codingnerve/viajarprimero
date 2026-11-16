import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * The price, as a bento grid instead of a receipt: one tall blue card that
 * makes the argument and a tile per line of the quote. Amounts stay "on the
 * call" — we hold no fares of our own and will not print an invented one.
 */
export function LandingEsPrice({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const { receipt } = copy;

  return (
    <Section tone="muted" size="md">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col rounded-3xl bg-brand-wash p-8 text-text-inverse md:p-10">
          <p className="text-overline uppercase text-text-on-dark">
            {receipt.eyebrow}
          </p>
          <h2 className="mt-3 text-display text-text-inverse">{receipt.title}</h2>
          <p className="mt-5 text-body-lg text-text-on-dark">{receipt.body}</p>
          <ButtonLink
            href={phone.href}
            size="lg"
            className="mt-8 w-fit !bg-white !text-primary hover:!bg-primary-softer lg:mt-auto"
            icon={<PhoneIcon className="size-5" />}
          >
            {receipt.cta(phone.display)}
          </ButtonLink>
        </div>

        <div className="grid content-start gap-4 sm:grid-cols-2">
          {receipt.lines.map((line, index) => (
            <div
              key={line.label}
              className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border md:p-7"
            >
              <span className="font-display text-h2 italic text-primary/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-h4 text-text">{line.label}</h3>
              <p className="mt-1 text-body-sm text-text-muted">{line.note}</p>
              <p className="mt-5 inline-flex rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary">
                {receipt.onCall}
              </p>
            </div>
          ))}

          <div className="rounded-3xl bg-primary-soft p-6 md:p-7">
            <p className="text-overline uppercase text-primary">{receipt.total}</p>
            <p className="mt-2 font-display text-h1 italic text-primary">
              {receipt.totalValue}
            </p>
            <p className="mt-3 text-body-sm text-text-secondary">
              {receipt.rules}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
