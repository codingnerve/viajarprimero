import { notFound } from "next/navigation";

import { LandingEsClosing } from "@/features/booking/components/landing-es-closing";
import { LandingEsFaq } from "@/features/booking/components/landing-es-faq";
import { LandingEsHero } from "@/features/booking/components/landing-es-hero";
import { LandingEsPrice } from "@/features/booking/components/landing-es-price";
import { LandingEsRoutes } from "@/features/booking/components/landing-es-routes";
import { LandingEsSteps } from "@/features/booking/components/landing-es-steps";
import { LandingEsStrip } from "@/features/booking/components/landing-es-strip";
import { landingCopyEs } from "@/features/booking/lib/landing-copy-es";
import { getLandingPhone } from "@/features/booking/lib/landing-phone";
import { flightHeroImages } from "@/lib/content/flight-hero";
import { getResolvedRoutes } from "@/lib/content/routes";

/**
 * The Spanish flight landing page (`/esflights`). Same promise and the same
 * theme as `/enflight`, laid out differently on purpose: a light hero with an
 * arch photograph, cards and a bento grid where the English page has a boarding
 * pass, a vertical log and a receipt. Customer reviews are English-only, so
 * they are left out.
 */
export function FlightLandingPageEs() {
  const phone = getLandingPhone("es");
  if (!phone) notFound();

  const copy = landingCopyEs;
  const routes = getResolvedRoutes().slice(0, 6);

  return (
    <>
      <LandingEsHero
        phone={phone}
        copy={copy}
        path="/esflights"
        image={{ src: flightHeroImages[0].src }}
      />
      <LandingEsStrip phone={phone} phrases={copy.ticker} />
      <LandingEsSteps phone={phone} copy={copy} />
      <LandingEsPrice phone={phone} copy={copy} />
      <LandingEsRoutes routes={routes} phone={phone} copy={copy} />
      <LandingEsFaq phone={phone} copy={copy} />
      <LandingEsClosing phone={phone} copy={copy} />
    </>
  );
}
