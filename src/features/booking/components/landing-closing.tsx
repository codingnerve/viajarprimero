import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import { siteConfig } from "@/lib/config/site";

/** The closing statement: the number, as large as the page ever sets anything. */
export function LandingClosing({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const { closing } = copy;

  return (
    <Section tone="brand" size="lg">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-overline uppercase text-text-on-dark">
          {closing.eyebrow}
        </p>
        <h2 className="mt-4 text-display text-text-inverse">{closing.title}</h2>
        <a
          href={phone.href}
          aria-label={copy.hero.ariaCall(phone.display)}
          className="mt-8 inline-block rounded-xl font-display text-display-lg tabular-nums text-text-inverse transition-transform hover:scale-[1.02] focus-ring-inverse motion-reduce:transform-none md:text-display-xl"
        >
          {phone.display}
        </a>
        <p className="mt-4 text-body text-text-on-dark">
          {closing.hours(phone.hours)}
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink
            href={phone.href}
            size="lg"
            className="!bg-white !text-primary hover:!bg-primary-softer"
            icon={<PhoneIcon className="size-5" />}
          >
            {closing.button}
          </ButtonLink>
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-caption text-text-on-dark/80">
          {closing.disclaimer(siteConfig.name)}
        </p>
      </div>
    </Section>
  );
}
