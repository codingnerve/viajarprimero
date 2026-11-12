import Link from "next/link";

import { LinePhoneLink, PhoneNumberText } from "@/components/layout/line-phone";
import { PageIntro } from "@/components/layout/page-intro";
import { AgencyNotice } from "@/components/layout/agency-notice";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Prose } from "@/components/content/prose";
import { configured } from "@/lib/config/placeholders";
import { dotTwentyFourHourRuleApplies } from "@/lib/config/legal";
import { contactConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Manage a booking",
  description:
    "Change, cancel or ask about a booking you made with us — what we handle, what the airline handles, and the 24-hour cancellation right on US itineraries.",
  path: "/manage-booking",
});

/**
 * Manage a booking.
 *
 * There is no self-service booking lookup here, and there is not going to be
 * one until a reservation system is actually connected. A form that takes a
 * reference and returns nothing — or worse, returns a plausible-looking page
 * built from no real data — is a fake feature, and on a travel site it is the
 * fake feature most likely to strand somebody at an airport.
 *
 * So this page does the honest version: it tells the traveller exactly what to
 * send and to whom, and it puts the DOT 24-hour cancellation right at the top
 * where a traveller who needs it today can actually find it.
 */
export default function ManageBookingPage() {
  const email = configured(contactConfig.email);
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const supportHours = configured(contactConfig.supportHours);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Manage a booking", path: "/manage-booking" },
        ]}
        title="Manage a booking"
        intro="Bookings are handled by a person rather than a self-service portal. Call or send us the reference and what you need, and an agent will tell you any costs before anything is changed."
      />

      <Section>

        <AgencyNotice className="mb-8 measure" />

        {dotTwentyFourHourRuleApplies && (
          <Alert
            tone="info"
            title="Booked in the last 24 hours?"
            className="mt-8 measure"
          >
            <p>
              If your itinerary touches the United States and you booked at least
              seven days before departure, US Department of Transportation rules
              give you 24 hours from ticketing to cancel for a full refund, with
              no penalty from us or the airline.
            </p>
            <p className="mt-2">
              Contact us immediately if you want to use it — the window is
              counted from when the ticket was issued, not from when you noticed.
              Full detail is in the{" "}
              <Link
                href="/refund-and-cancellation-policy"
                className="text-primary underline underline-offset-2"
              >
                refund and cancellation policy
              </Link>
              .
            </p>
          </Alert>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="min-w-0">
            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">What to send us</h2>
              <Prose>
                <p>
                  Including all of this in the first message saves a round trip
                  and, when a fare rule has a deadline attached, sometimes saves
                  the fare:
                </p>
                <ul>
                  <li>
                    <strong>Your booking reference</strong>, from the confirmation
                    email we sent you.
                  </li>
                  <li>
                    <strong>The lead passenger&apos;s name</strong>, as it appears
                    on the booking.
                  </li>
                  <li>
                    <strong>What you need</strong> — the new dates, the correction,
                    or the question.
                  </li>
                  <li>
                    <strong>How urgent it is</strong>, and when you travel. We
                    prioritise imminent departures.
                  </li>
                </ul>
                <p>
                  Please do not email passport numbers, card numbers or dates of
                  birth unless we have specifically asked for them. If we need
                  something sensitive to make a change, we will tell you how to
                  send it safely.
                </p>
              </Prose>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">
                What we do, and what the airline does
              </h2>
              <Prose>
                <p>
                  We are the travel agent, not the carrier. That split decides who
                  can actually help you, and it is worth knowing before you spend
                  an hour on the wrong line.
                </p>
                <h2>Come to us for</h2>
                <ul>
                  <li>Changing or cancelling a booking we made for you.</li>
                  <li>
                    Name spelling corrections — these have tight airline deadlines,
                    so tell us the moment you spot one.
                  </li>
                  <li>
                    Understanding what your fare rules permit and what a change
                    will cost before you commit to it.
                  </li>
                  <li>Invoices, receipts, and confirmation resends.</li>
                  <li>Adding baggage or requesting special assistance.</li>
                </ul>
                <h2>Go to the airline directly for</h2>
                <ul>
                  <li>Online check-in and boarding passes.</li>
                  <li>Seat selection once check-in has opened.</li>
                  <li>Same-day disruption — a cancelled or delayed flight at the airport.</li>
                  <li>Frequent flyer numbers and mileage claims.</li>
                  <li>Lost, delayed or damaged baggage claims.</li>
                </ul>
              </Prose>
            </section>

            <section>
              <h2 className="mb-3 text-h3 text-text">Before you ask to change</h2>
              <Prose>
                <p>
                  Two things are worth knowing so the answer is not a surprise.
                  First, a change usually costs the airline&apos;s change fee{" "}
                  <em>plus</em> the difference in fare, and the fare difference is
                  frequently the larger of the two. Second, &ldquo;changeable&rdquo;
                  and &ldquo;refundable&rdquo; are separate permissions — a ticket
                  can be one without being the other.
                </p>
                <p>
                  We will tell you the total cost before anything is
                  changed, and nothing is charged until you agree to it. Our own
                  fees are listed on the{" "}
                  <Link href="/fees-and-charges">fees and charges</Link> page.
                </p>
              </Prose>
            </section>
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <Card className="p-5">
              <h2 className="text-h4 text-text">Contact us about a booking</h2>
              {email || phone ? (
                <ul className="mt-3 space-y-2 text-body text-gray-700">
                  {email && (
                    <li>
                      Email:{" "}
                      <a
                        href={`mailto:${email}`}
                        className="text-primary underline underline-offset-2"
                      >
                        {email}
                      </a>
                    </li>
                  )}
                  {phone && phoneDisplay && (
                    <li>
                      Phone:{" "}
                      <LinePhoneLink className="text-primary underline underline-offset-2">
                        <PhoneNumberText />
                      </LinePhoneLink>
                      {supportHours && (
                        <span className="block text-caption text-text-secondary">
                          {supportHours}
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              ) : (
                <p className="mt-3 text-body text-gray-700">
                  Our contact details are on the contact page.
                </p>
              )}

              <ButtonLink href="/contact" className="mt-5 w-full">
                Contact page
              </ButtonLink>
              <ButtonLink
                href="/customer-support"
                variant="outline"
                className="mt-2 w-full"
              >
                Customer support
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
