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
import { landingFaqs } from "@/features/booking/lib/landing-faq";
import { getLandingPhone } from "@/features/booking/lib/landing-phone";
import { flightHeroImages } from "@/lib/content/flight-hero";
import { getResolvedRoutes } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Book a Flight by Phone",
  description:
    "Call a real travel agent to book your flight. You hear the airfare, taxes, carrier charges and our fee, plus the fare rules, before you pay.",
  path: "/enflight",
});

export default function BookFlightsPage() {
  const phone = getLandingPhone();
  if (!phone) notFound();

  const hero = flightHeroImages[0];
  const routes = getResolvedRoutes().slice(0, 5);

  return (
    <>
      <LandingHero phone={phone} image={{ src: hero.src, alt: hero.alt }} />
      <LandingTicker phone={phone} />
      <LandingSteps phone={phone} />
      <LandingReceipt phone={phone} />
      <LandingRoutes routes={routes} phone={phone} />

      <Section>
        <CustomerReviews vertical="flight" />
      </Section>

      <Section tone="surface" size="md" width="narrow">
        <p className="text-overline uppercase text-primary">Questions</p>
        <h2 className="mt-3 text-h1 text-text">Before you call</h2>
        <Accordion
          name="book-flights-faq"
          items={landingFaqs(phone)}
          className="mt-8"
        />
      </Section>

      <LandingClosing phone={phone} />
    </>
  );
}
