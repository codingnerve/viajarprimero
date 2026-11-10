import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description: `The limits of what ${siteConfig.name} can promise about prices, availability, editorial content and third-party services.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const sections: LegalSection[] = [
    {
      id: "prices-and-availability",
      heading: "Prices and availability",
      body: (
        <>
          <p>
            Airfares and seat availability are controlled by the airlines and
            change continuously. A price is only real at the moment it is
            quoted, and it is only fixed once a ticket has been issued.
          </p>
          <p>
            This is why you will not find sample fares or &ldquo;from&rdquo;
            prices on our route and destination pages. A figure printed there
            would be out of date almost immediately, and we would rather show
            you nothing than show you a number you cannot actually book.
          </p>
        </>
      ),
    },
    {
      id: "editorial-content",
      heading: "Destination and route information",
      body: (
        <>
          <p>
            Our guides, route pages and planning notes are general information
            written to be useful, not a professional advisory service. Flight
            times are approximate and vary with aircraft, routing and season.
            Airport information, transport links and seasonal advice can change
            without us noticing immediately.
          </p>
          <p>
            Check anything time-sensitive against an official source before you
            rely on it for a decision that costs money.
          </p>
        </>
      ),
    },
    {
      id: "travel-documents",
      heading: "Travel documents, visas and health",
      body: (
        <p>
          We are not immigration advisers, and we do not give authoritative
          guidance on entry requirements. Passport validity rules, visa and
          transit-visa requirements, onward-ticket rules and health
          requirements depend on your nationality and your exact route, and they
          change. Always confirm with the relevant embassy, consulate or
          official government source. Being refused boarding or entry for want
          of the right document is not something we can put right afterwards.
        </p>
      ),
    },
    {
      id: "third-parties",
      heading: "Airlines, suppliers and external links",
      body: (
        <>
          <p>
            We arrange travel as an agent. The airlines and suppliers who
            actually provide it are independent businesses responsible for their
            own performance, and their conditions of carriage govern your
            flight.
          </p>
          <p>
            Where we link to another website, we do so because it is likely to
            be useful. We do not control those sites, we are not responsible for
            their content or their privacy practices, and a link is not an
            endorsement.
          </p>
          <p>
            Airline names, marks and logos referenced anywhere on this site
            belong to their owners and are used only to identify the carrier
            operating a service. Their appearance does not imply that those
            airlines endorse or are affiliated with us.
          </p>
        </>
      ),
    },
    {
      id: "no-guarantee",
      heading: "What we do not claim",
      body: (
        <>
          <p>
            We do not advertise a lowest-price guarantee, a guaranteed saving,
            or a promise that any particular fare is the cheapest available. Air
            pricing is too dynamic for anyone to make that claim honestly, and
            we will not make it.
          </p>
          <p>
            We do not claim industry accreditations we do not hold. Where we
            hold one, we publish its registration number so you can verify it
            with the issuing body.
          </p>
        </>
      ),
    },
    {
      id: "relationship-to-terms",
      heading: "How this relates to our terms",
      body: (
        <p>
          This page explains the practical limits of what we can promise. It
          does not replace or reduce our obligations under the{" "}
          <Link href="/terms-and-conditions">terms and conditions</Link>, which
          govern your booking, and it does not affect your statutory rights as a
          consumer.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Disclaimer"
      summary="What we can and cannot promise about prices, editorial content, travel requirements and the third parties who actually operate your flight."
      sections={sections}
    />
  );
}
