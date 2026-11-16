import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * The three steps as three cards in a row, joined by a dashed flight path, with
 * the middle card dropped a little so the row reads as a route with a dip in
 * it rather than a table. On a phone they stack and the path disappears.
 */
export function LandingEsSteps({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const { steps } = copy;

  return (
    <Section id="how-it-works" size="md">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-overline uppercase text-primary">{steps.eyebrow}</p>
        <h2 className="mt-3 text-display text-text">{steps.title}</h2>
        <p className="mt-4 text-body-lg text-text-secondary">{steps.intro}</p>
      </div>

      <div className="relative mt-14">
        <div
          aria-hidden="true"
          className="absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-border-strong md:block"
        />
        <ol className="relative grid gap-6 md:grid-cols-3">
          {steps.items.map((step, index) => (
            <li
              key={step.title}
              className={
                index === 1
                  ? "md:translate-y-10"
                  : undefined
              }
            >
              <div className="h-full rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border transition-shadow duration-[var(--duration-normal)] hover:shadow-lg md:p-7">
                <span className="grid size-14 place-items-center rounded-full bg-primary font-display text-h2 text-text-inverse shadow-md">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-h2 text-text">{step.title}</h3>
                <p className="mt-3 text-body text-text-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 flex justify-center md:mt-24">
        <ButtonLink
          href={phone.href}
          size="lg"
          icon={<PhoneIcon className="size-5" />}
        >
          {copy.hero.call(phone.display)}
        </ButtonLink>
      </div>
    </Section>
  );
}
