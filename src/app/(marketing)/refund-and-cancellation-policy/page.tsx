import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { changeAndCancellationFeePolicy, dotTwentyFourHourRuleApplies } from "@/lib/config/legal";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Refund and cancellation policy",
  description:
    "When a ticket can be cancelled or refunded, the 24-hour cancellation right, how long refunds take, and what we charge to process one.",
  path: "/refund-and-cancellation-policy",
});

/**
 * Refund and cancellation policy.
 *
 * A clear, findable refund policy is one of the things a Google Ads review of
 * a travel advertiser looks for, and vagueness here reads as evasion. We
 * charge no fee of our own for a change or cancellation — see
 * `changeAndCancellationFeePolicy` in config — so this page never claims one.
 */
export default function RefundPolicyPage() {
  const email = configured(contactConfig.email);

  const sections: LegalSection[] = [
    {
      id: "the-short-version",
      heading: "The short version",
      body: (
        <>
          <p>
            <strong>
              Most airline tickets are non-refundable, and that is set by the
              airline, not by us.
            </strong>{" "}
            Whether you can cancel, change, or get money back depends on the
            fare rules of the specific ticket you bought. We tell you those
            rules before you pay so the decision is an informed one.
          </p>
          <p>Three things are always true:</p>
          <ul>
            <li>
              We do not keep money for a service we did not provide. If we
              cannot issue your ticket, you get everything back.
            </li>
            <li>
              Where a refund is due from the airline, we pass on what the
              airline releases in full — we do not deduct a fee of our own
              from it.
            </li>
            <li>
              We will tell you what a cancellation is actually worth{" "}
              <em>before</em> you ask us to make it, so you can decide whether
              it is worth doing.
            </li>
          </ul>
        </>
      ),
    },
    ...(dotTwentyFourHourRuleApplies
      ? [
          {
            id: "twenty-four-hour",
            heading: "The 24-hour cancellation right",
            body: (
              <>
                <p>
                  United States Department of Transportation rules require
                  airlines and ticket agents to let you cancel a reservation
                  without penalty within 24 hours of booking, provided the
                  booking was made at least seven days before the flight
                  departs, and to refund you in full.
                </p>
                <p>
                  Where your itinerary falls within that rule, this applies to
                  bookings made through us. Contact us as soon as possible
                  within that window — the right expires 24 hours after the
                  booking is made, and we cannot extend it.
                </p>
                <p>
                  Some airlines instead offer to hold a fare for 24 hours rather
                  than refund a completed booking. Where that applies to your
                  itinerary, we will tell you which of the two you have.
                </p>
              </>
            ),
          },
        ]
      : []),
    {
      id: "before-ticket-issue",
      heading: "Before your ticket is issued",
      body: (
        <p>
          A booking is not binding until the airline issues the ticket. If you
          decide against the trip before that point, or if we cannot secure the
          quoted fare, you are refunded in full with no fee. This is not a
          concession — no service has been delivered yet.
        </p>
      ),
    },
    {
      id: "after-ticket-issue",
      heading: "After your ticket is issued",
      body: (
        <>
          <p>
            Once a ticket exists, the airline&apos;s fare rules govern. In
            practice tickets fall into three groups:
          </p>
          <ul>
            <li>
              <strong>Refundable fares.</strong> Can be cancelled for a refund
              of the fare, usually less an airline cancellation charge.
            </li>
            <li>
              <strong>Changeable but non-refundable fares.</strong> No money
              back, but the value can often be applied to a future ticket, less
              an airline change fee and any difference in fare. These credits
              usually expire — we will tell you when.
            </li>
            <li>
              <strong>Fully non-refundable, non-changeable fares.</strong>{" "}
              Nothing is recoverable except, in most cases, certain government
              taxes and airport charges that are only payable when you actually
              fly.
            </li>
          </ul>

          <h3>Recovering unused taxes</h3>
          <p>
            Even on a non-refundable ticket, some taxes and airport charges are
            refundable if you do not travel, because the airline never has to
            pay them. The amount is often small and airlines do not refund it
            automatically. Ask us and we will make the claim; if the recoverable
            amount is less than the cost of processing it, we will tell you that
            plainly rather than charging you a fee to recover less than the fee.
          </p>

          <h3>What we charge</h3>
          <p>{changeAndCancellationFeePolicy}</p>
          <p>
            Our service fee on the original booking covers work already done and
            is not refundable, except where we could not issue your ticket or
            where the 24-hour right applies. The full schedule is on the{" "}
            <Link href="/fees-and-charges">fees and charges</Link> page.
          </p>
        </>
      ),
    },
    {
      id: "how-to-request",
      heading: "How to request a cancellation or change",
      body: (
        <>
          <p>
            Contact us
            {email ? (
              <>
                {" "}
                at <a href={`mailto:${email}`}>{email}</a>
              </>
            ) : (
              " through our contact page"
            )}{" "}
            with your booking reference and what you need. Do not assume a
            cancellation has happened until we confirm it in writing — an
            unattended request is not a cancellation, and a no-show usually
            forfeits more than a cancellation would.
          </p>
          <p>
            We will tell you what the cancellation or change is worth and what
            it will cost <em>before</em> we action it, and we will wait for you
            to confirm.
          </p>
          <p>
            <strong>Within 24 hours of departure, or once travel has
            started</strong>, contact the operating airline directly. They
            control the booking at that stage and can act immediately; we
            cannot.
          </p>
        </>
      ),
    },
    {
      id: "how-long-refunds-take",
      heading: "How long a refund takes",
      body: (
        <>
          <p>
            A refund passes through the airline before it reaches you, so the
            timing is largely outside our control. Typically:
          </p>
          <ul>
            <li>
              We submit the refund request to the airline within 3 business days
              of you confirming it.
            </li>
            <li>
              Airlines commonly take 7 to 30 days to process a refund, and
              sometimes longer for tickets bought through a consolidator.
            </li>
            <li>
              Once the airline releases the funds, we pass them to your original
              payment method within 5 business days.
            </li>
            <li>
              Your bank or card issuer may then take several more days to show
              it.
            </li>
          </ul>
          <p>
            We refund to the original payment method. If a refund is taking
            materially longer than this, ask us — we will chase the airline and
            tell you where it actually is rather than repeating a generic
            timeline.
          </p>
        </>
      ),
    },
    {
      id: "airline-cancellations",
      heading: "If the airline cancels or changes your flight",
      body: (
        <>
          <p>
            When an airline cancels a flight, changes the schedule
            significantly, or denies you boarding, your rights come from the
            carrier and from the regulations covering your route — for example
            EU Regulation 261/2004 or UK261 for qualifying flights, or US DOT
            rules for flights to and from the United States. These rights can
            include a full refund or compensation, and they are generally
            stronger than anything in a fare rule.
          </p>
          <p>
            We will tell you what has changed as soon as the airline tells us,
            explain the options we can see, and help you claim. We cannot grant
            a refund or compensation on the airline&apos;s behalf, and we will
            not pretend otherwise — but we will not leave you to work out the
            process alone either.
          </p>
        </>
      ),
    },
    {
      id: "chargebacks",
      heading: "Disputes and chargebacks",
      body: (
        <p>
          If you believe a charge is wrong, come to us first — most billing
          disputes are a misunderstanding about what a fare rule permits, and we
          can usually resolve it faster than a bank can. If a chargeback is
          raised for a booking that was properly delivered, we may recover the
          amount and any associated costs from you. {siteConfig.name} keeps
          records of every quote and confirmation for exactly this reason: so
          what was agreed is a matter of record rather than recollection.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Refund and cancellation policy"
      summary="When a ticket can be cancelled or refunded, what you get back, how long it takes, and what we charge to handle it."
      sections={sections}
    />
  );
}
