import { Section } from "@/components/layout/section";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import { siteConfig } from "@/lib/config/site";

/** Questions on the right, a sticky number card on the left that follows the reader down. */
export function LandingEsFaq({
  phone,
  copy,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  return (
    <Section tone="surface" size="md">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-overline uppercase text-primary">{copy.faq.eyebrow}</p>
          <h2 className="mt-3 text-display text-text">{copy.faq.title}</h2>

          <div className="mt-8 rounded-2xl bg-primary-softer p-6 ring-1 ring-inset ring-primary-soft">
            <p className="text-overline uppercase text-text-muted">
              {copy.hero.desk}
            </p>
            <a
              href={phone.href}
              aria-label={copy.hero.ariaCall(phone.display)}
              className="mt-1 block rounded-md font-display text-h1 tabular-nums text-primary focus-ring"
            >
              {phone.display}
            </a>
            <ButtonLink
              href={phone.href}
              fullWidth
              className="mt-4"
              icon={<PhoneIcon className="size-5" />}
            >
              {copy.closing.button}
            </ButtonLink>
          </div>
        </div>

        <Accordion
          name="es-flight-faq"
          items={copy.faq.items(phone, siteConfig.name)}
          large
        />
      </div>
    </Section>
  );
}
