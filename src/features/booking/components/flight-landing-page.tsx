import { notFound } from "next/navigation";

import { CustomerReviews } from "@/components/content/customer-reviews";
import { Section } from "@/components/layout/section";
import { Accordion } from "@/components/ui/accordion";
import { LandingClosing } from "@/features/booking/components/landing-closing";
import { LandingHero } from "@/features/booking/components/landing-hero";
import { LandingReceipt } from "@/features/booking/components/landing-receipt";
import { LandingRoutes } from "@/features/booking/components/landing-routes";
import { LandingSteps } from "@/features/booking/components/landing-steps";
import { LandingTicker } from "@/features/booking/components/landing-ticker";
import { landingCopyEn } from "@/features/booking/lib/landing-copy";
import { getLandingPhone } from "@/features/booking/lib/landing-phone";
import { siteConfig } from "@/lib/config/site";
import { flightHeroImages } from "@/lib/content/flight-hero";
import { getResolvedRoutes } from "@/lib/content/routes";

/**
 * The English flight landing page (`/enflight`): a boarding pass hero, a
 * scrolling number ticker, a vertical flight log, a receipt and a departures
 * board. `/esflights` is the same promise in Spanish with its own layout —
 * see `FlightLandingPageEs`.
 */
export function FlightLandingPage() {
  const phone = getLandingPhone("en");
  if (!phone) notFound();

  const copy = landingCopyEn;
  const routes = getResolvedRoutes().slice(0, 5);

  return (
    <>
      <LandingHero
        phone={phone}
        copy={copy}
        path="/enflight"
        image={{ src: flightHeroImages[0].src }}
      />
      <LandingTicker phone={phone} phrases={copy.ticker} />
      <LandingSteps phone={phone} copy={copy} />
      <LandingReceipt phone={phone} copy={copy} />
      <LandingRoutes routes={routes} phone={phone} copy={copy} />

      <Section>
        <CustomerReviews vertical="flight" />
      </Section>

      <Section tone="surface" size="md" width="narrow">
        <p className="text-overline uppercase text-primary">{copy.faq.eyebrow}</p>
        <h2 className="mt-3 text-h1 text-text">{copy.faq.title}</h2>
        <Accordion
          name="en-flight-faq"
          items={copy.faq.items(phone, siteConfig.name)}
          className="mt-8"
        />
      </Section>

      <LandingClosing phone={phone} copy={copy} />
    </>
  );
}
