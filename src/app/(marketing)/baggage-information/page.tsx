import { AirlineDirectory } from "@/components/content/airline-directory";
import { Prose } from "@/components/content/prose";
import { AgencyNotice } from "@/components/layout/agency-notice";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Baggage information",
  description:
    "Baggage information for major airlines. Choose your airline to find its carry-on and checked bag rules on the airline's own website.",
  path: "/baggage-information",
});

/**
 * Baggage information.
 *
 * Allowances and bag fees are set by the airline for each fare, so this page
 * does not reprint them. It is a directory: pick the airline, land on its
 * page, and go from there to the carrier's own baggage rules.
 */
export default function BaggageInformationPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Baggage information", path: "/baggage-information" },
        ]}
        title="Baggage information"
        intro="Choose your airline below. Each airline sets its own carry-on and checked bag rules, and each airline page takes you straight to them."
      />

      <Section>
        <AirlineDirectory topic="baggage" />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <section>
            <h2 className="text-h2 text-text">Where to find your allowance</h2>
            <Prose className="mt-4">
              <ul>
                <li>
                  <strong>On your ticket confirmation</strong> — the allowance
                  for each flight is shown there.
                </li>
                <li>
                  <strong>On the airline&apos;s website</strong>, under your
                  booking reference.
                </li>
                <li>
                  <strong>From us</strong> — call and we will check it with you.
                </li>
              </ul>
              <p>
                Power banks and spare lithium batteries always go in your cabin
                bag, never in checked luggage.
              </p>
            </Prose>
          </section>

          <section>
            <h2 className="text-h2 text-text">If a bag is delayed or lost</h2>
            <Prose className="mt-4">
              <p>
                Report it at the airline&apos;s baggage desk before you leave
                the airport, and keep the reference number you are given.
              </p>
              <p>
                The claim is handled by the airline. We will help you reach the
                right team and send you the booking details you need.
              </p>
            </Prose>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/online-check-in" variant="outline">
            Online check-in
          </ButtonLink>
          <ButtonLink href="/customer-support" variant="outline">
            Customer support
          </ButtonLink>
        </div>

        <AgencyNotice className="measure mt-10" />
      </Section>
    </>
  );
}
