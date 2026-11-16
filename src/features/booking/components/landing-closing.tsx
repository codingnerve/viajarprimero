import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import { siteConfig } from "@/lib/config/site";

/** The closing statement: the number, as large as the page ever sets anything. */
export function LandingClosing({ phone }: { phone: LandingPhone }) {
  return (
    <Section tone="brand" size="lg">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-overline uppercase text-text-on-dark">
          Ready when you are
        </p>
        <h2 className="mt-4 text-display text-text-inverse">
          Say the route. Hear the price.
        </h2>
        <a
          href={phone.href}
          aria-label={`Call ${phone.display}`}
          className="mt-8 inline-block rounded-xl font-display text-display-lg tabular-nums text-text-inverse transition-transform hover:scale-[1.02] focus-ring-inverse motion-reduce:transform-none md:text-display-xl"
        >
          {phone.display}
        </a>
        <p className="mt-4 text-body text-text-on-dark">
          Real travel agents, {phone.hours}.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink
            href={phone.href}
            size="lg"
            className="!bg-white !text-primary hover:!bg-primary-softer"
            icon={<PhoneIcon className="size-5" />}
          >
            Call now
          </ButtonLink>
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-caption text-text-on-dark/80">
          {siteConfig.name} is a travel agency, not an airline. Fares and fare
          rules are set by the carriers and confirmed with you before anything
          is booked.
        </p>
      </div>
    </Section>
  );
}
