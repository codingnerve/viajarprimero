import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

const STEPS = [
  {
    title: "Say where and when",
    body: "Route, dates, how many are travelling. If your dates can move, say so — it changes what we look at.",
  },
  {
    title: "Hear the full price",
    body: "The airfare, taxes and carrier-imposed charges, and our service fee, as separate lines. Then the fare rules for that exact ticket: changes, refunds, bags.",
  },
  {
    title: "Decide, then pay",
    body: "Nothing is booked until you say yes. If the answer is no, you hang up having paid nothing.",
  },
] as const;

/**
 * How the call goes, as a vertical flight log. The numerals are set in the
 * display face and hang outside the text column so the eye reads 1-2-3 down
 * the margin before reading any copy.
 */
export function LandingSteps({ phone }: { phone: LandingPhone }) {
  return (
    <Section id="how-it-works" size="md">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-overline uppercase text-primary">How a call goes</p>
          <h2 className="mt-3 text-display text-text">
            Three things happen, in this order.
          </h2>
          <p className="mt-5 max-w-md text-body-lg text-text-secondary">
            No fare tables to decode and no total that grows at checkout. You
            talk to a person, and the price arrives in writing-sized pieces.
          </p>
          <ButtonLink
            href={phone.href}
            size="lg"
            className="mt-8"
            icon={<PhoneIcon className="size-5" />}
          >
            Call {phone.display}
          </ButtonLink>
        </div>

        <ol className="relative space-y-10 border-l border-dashed border-border-strong pl-10 md:pl-14">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-10 top-0 -translate-x-1/2 bg-background font-display text-display tabular-nums text-primary/90 md:-left-14"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h2 text-text">{step.title}</h3>
              <p className="mt-3 max-w-lg text-body-lg text-text-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
