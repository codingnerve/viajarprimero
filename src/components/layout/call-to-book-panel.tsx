import type { ComponentType } from "react";
import { LinePhoneButton, PhoneNumberText } from "@/components/layout/line-phone";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { CheckIcon, PhoneIcon } from "@/components/ui/icons";
import { serviceFees } from "@/lib/config/legal";
import { configured, isPlaceholder } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";

export interface TripFact {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

/**
 * Book-by-phone panel — what a flight, hotel or private-jet search lands on
 * while bookings are taken by phone (`bookingConfig.callToBook`).
 *
 * Calling is the booking path, so the phone number is the primary action and
 * the trip form is the fallback. Everything a Google Ads reviewer checks
 * on a call-led travel landing page is stated in the panel itself rather than
 * a click away: that we are an agency and not the supplier, that no price is
 * shown because none is quoted yet, what our service fee is, and that nothing
 * is charged until the traveller agrees. No urgency, no "lowest price" claim —
 * neither is something we could substantiate.
 */
export function CallToBookPanel({
  title,
  intro,
  facts,
  quoteHref,
  disclaimer,
  showFee = false,
}: {
  title: string;
  intro: string;
  /** The search, restated so the traveller can read it back to the agent. */
  facts: readonly TripFact[];
  /** Pre-filled quote request for this exact trip. */
  quoteHref: string;
  /** What we are and what we are not, for this vertical's supplier. */
  disclaimer: string;
  /** Flights only — the service fee is priced per ticket. */
  showFee?: boolean;
}) {
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const fee = showFee
    ? serviceFees.find((entry) => !isPlaceholder(entry.amount))
    : undefined;

  const steps = [
    "An agent checks live availability and prices for your dates.",
    "You hear the full price — taxes, supplier charges and our service fee included — before you pay.",
    "Nothing is charged until you agree to book.",
  ];

  return (
    <div className="measure-wide mx-auto overflow-hidden rounded-xs bg-surface shadow-md ring-1 ring-inset ring-border">
      <div className="bg-primary-softer p-6 md:p-8">
        <p className="text-micro font-semibold uppercase tracking-wide text-primary">
          Book by phone
        </p>
        <h2 className="mt-2 text-balance text-h2 text-text">{title}</h2>
        <p className="mt-2 text-body text-text-secondary">{intro}</p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {facts.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-body-sm font-medium text-text">
                  {item.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="p-6 md:p-8">
        {phone && phoneDisplay ? (
          <>
            <LinePhoneButton
              
              size="lg"
              fullWidth
              icon={<PhoneIcon className="size-5" />}
              ariaPrefix="Call to book: "
            >
              <span className="tabular-nums">
              Call <PhoneNumberText />
            </span>
            </LinePhoneButton>
            <p className="mt-2 text-center text-caption text-text-muted">
              Agents available {contactConfig.supportHours}
            </p>

            <ButtonLink
              href={quoteHref}
              variant="outline"
              fullWidth
              className="mt-4"
            >
              Prefer not to call? Send us your trip
            </ButtonLink>
          </>
        ) : (
          <ButtonLink href={quoteHref} size="lg" fullWidth>
            Send us your trip
          </ButtonLink>
        )}

        <ul className="mt-6 space-y-2.5">
          {steps.map((step) => (
            <li key={step} className="flex gap-2.5">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-body-sm text-text-secondary">{step}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-border pt-4 text-caption text-text-muted">
          {disclaimer}
          {fee && (
            <>
              {" "}
              Our {fee.name.toLowerCase()} is {fee.amount} {fee.basis}, quoted
              as one exact amount before you pay.
            </>
          )}{" "}
          <Link
            href="/fees-and-charges"
            className="rounded-xs text-primary underline underline-offset-2 focus-ring"
          >
            Fees and charges
          </Link>
        </p>
      </div>
    </div>
  );
}
