import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import { siteConfig } from "@/lib/config/site";

/**
 * The close: a floating blue card with the line on one side and the number as
 * large as the page sets anything on the other, and the disclaimer on the page
 * background beneath it rather than inside the colour.
 */
export function LandingEsClosing({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const { closing } = copy;

  return (
    <Section size="md">
      <div className="grid items-center gap-8 rounded-3xl bg-brand-wash p-8 text-text-inverse shadow-xl md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:p-14">
        <div>
          <p className="text-overline uppercase text-text-on-dark">
            {closing.eyebrow}
          </p>
          <h2 className="mt-3 text-display text-text-inverse">{closing.title}</h2>
          <p className="mt-4 text-body-lg text-text-on-dark">
            {closing.hours(phone.hours)}
          </p>
        </div>

        <div className="md:text-right">
          <a
            href={phone.href}
            aria-label={copy.hero.ariaCall(phone.display)}
            className="block rounded-xl font-display text-display-lg tabular-nums text-text-inverse focus-ring-inverse lg:text-display-xl"
          >
            {phone.display}
          </a>
          <ButtonLink
            href={phone.href}
            size="lg"
            className="mt-5 w-full !bg-white !text-primary hover:!bg-primary-softer md:w-auto"
            icon={<PhoneIcon className="size-5" />}
          >
            {closing.button}
          </ButtonLink>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-caption text-text-muted">
        {closing.disclaimer(siteConfig.name)}
      </p>
    </Section>
  );
}
