import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * How the call goes, as a vertical flight log. The numerals are set in the
 * display face and hang outside the text column so the eye reads 1-2-3 down
 * the margin before reading any copy.
 */
export function LandingSteps({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const { steps } = copy;

  return (
    <Section id="how-it-works" size="md">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-overline uppercase text-primary">{steps.eyebrow}</p>
          <h2 className="mt-3 text-display text-text">{steps.title}</h2>
          <p className="mt-5 max-w-md text-body-lg text-text-secondary">
            {steps.intro}
          </p>
          <ButtonLink
            href={phone.href}
            size="lg"
            className="mt-8"
            icon={<PhoneIcon className="size-5" />}
          >
            {copy.hero.call(phone.display)}
          </ButtonLink>
        </div>

        <ol className="relative space-y-10 border-l border-dashed border-border-strong pl-10 md:pl-14">
          {steps.items.map((step, index) => (
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
