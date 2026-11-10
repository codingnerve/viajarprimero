import { AirlineDirectory } from "@/components/content/airline-directory";
import { Prose } from "@/components/content/prose";
import { AgencyNotice } from "@/components/layout/agency-notice";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Online check-in",
  description:
    "Online check-in for major airlines. Choose your airline to see how check-in works and go straight to the airline's own check-in page.",
  path: "/online-check-in",
});

/**
 * Online check-in.
 *
 * Check-in runs on the airline's own system, so this page is a directory: pick
 * the airline, land on its page, and go from there to the carrier's check-in.
 * No check-in windows are published here — they belong to the airline.
 */
export default function OnlineCheckInPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Online check-in", path: "/online-check-in" },
        ]}
        title="Online check-in"
        intro="Choose your airline below. Check-in is done on the airline's own website or app, and each airline page takes you straight there."
      />

      <Section>
        <AirlineDirectory topic="check-in" />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <section>
            <h2 className="text-h2 text-text">What you need to check in</h2>
            <Prose className="mt-4">
              <ul>
                <li>
                  <strong>The airline booking reference</strong> — the
                  six-character code on your confirmation, labelled as the
                  airline reference.
                </li>
                <li>
                  <strong>The passenger&apos;s surname</strong>, exactly as it
                  appears on the booking.
                </li>
                <li>
                  <strong>Passport details</strong> for international flights.
                </li>
              </ul>
            </Prose>
          </section>

          <section>
            <h2 className="text-h2 text-text">Flying on a codeshare?</h2>
            <Prose className="mt-4">
              <p>
                Check in with the airline that <strong>operates</strong> the
                flight. Your confirmation says &ldquo;operated by&rdquo; next to
                the flight number.
              </p>
              <p>
                If online check-in will not complete, check in at the airport
                counter and arrive early — or call us and we will look at the
                booking with you.
              </p>
            </Prose>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/baggage-information" variant="outline">
            Baggage information
          </ButtonLink>
          <ButtonLink href="/manage-booking" variant="outline">
            Manage a booking
          </ButtonLink>
        </div>

        <AgencyNotice className="measure mt-10" />
      </Section>
    </>
  );
}
