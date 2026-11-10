import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { businessModel, jurisdiction } from "@/lib/config/legal";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms and conditions",
  description: `The terms on which ${siteConfig.name} arranges travel: how a booking is formed, what is included in the price, and who is responsible for what.`,
  path: "/terms-and-conditions",
});

/**
 * Terms and conditions.
 *
 * The two clauses that matter most for an advertising review are section 3
 * (when a contract is actually formed) and section 4 (what the price includes).
 * Vagueness in either is what "unclear billing" means in practice.
 *
 * Governing law and forum come from config and must be set with legal advice —
 * they are not values to guess at.
 */
export default function TermsPage() {
  const legalName = configured(siteConfig.legalName) ?? siteConfig.name;
  const email = configured(contactConfig.email);
  const governingLaw = configured(jurisdiction.governingLaw);
  const courts = configured(jurisdiction.courts);

  const sections: LegalSection[] = [
    {
      id: "about-these-terms",
      heading: "About these terms",
      body: (
        <>
          <p>
            These terms govern your use of {siteConfig.url} and any travel
            arrangements you make through {legalName} (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;). By using the site or asking us to arrange travel,
            you accept them.
          </p>
          <p>
            They sit alongside our{" "}
            <Link href="/privacy-policy">privacy policy</Link>,{" "}
            <Link href="/cookie-policy">cookie policy</Link>,{" "}
            <Link href="/refund-and-cancellation-policy">
              refund and cancellation policy
            </Link>{" "}
            and <Link href="/fees-and-charges">fee schedule</Link>, all of which
            form part of your agreement with us.
          </p>
        </>
      ),
    },
    {
      id: "our-role",
      heading: "Our role",
      body:
        businessModel === "agency" ? (
          <>
            <p>
              <strong>We are a travel agency, not an airline.</strong> We
              arrange air travel as an agent for the airlines and suppliers that
              actually provide it. We do not operate flights.
            </p>
            <p>
              When you book a flight through us, the contract of carriage is
              between you and the operating airline. That airline&apos;s
              conditions of carriage and the fare rules attached to your ticket
              govern the flight itself — including baggage allowances, whether
              the ticket can be changed or refunded, what happens if the flight
              is delayed or cancelled, and any compensation you may be entitled
              to.
            </p>
            <p>
              Our own obligation to you is to arrange the booking with
              reasonable skill and care, to quote accurately, and to tell you
              the rules that apply before you pay.
            </p>
          </>
        ) : (
          <p>
            We sell the travel arrangements described on this site as principal,
            which means we are contractually responsible to you for providing
            them, subject to these terms.
          </p>
        ),
    },
    {
      id: "how-a-booking-is-made",
      heading: "How a booking is made",
      body: (
        <>
          <p>A booking with us goes through four distinct stages:</p>
          <ol>
            <li>
              <strong>Your request.</strong> Submitting a search or a quote
              request is an enquiry. It does not reserve a seat, does not fix a
              price, and commits neither of us to anything.
            </li>
            <li>
              <strong>Our quote.</strong> We send you priced options. A quote is
              an invitation for you to make an offer, not a binding contract,
              and it is valid only for the period stated in it. Fares and
              availability are controlled by the airline and can change.
            </li>
            <li>
              <strong>Your confirmation and payment.</strong> When you accept a
              quote and pay, you are making an offer to book.
            </li>
            <li>
              <strong>Ticket issue.</strong> A binding booking exists only when
              the airline issues the ticket and we send you the ticket number.
              Until that moment there is no confirmed booking, however far the
              process has gone.
            </li>
          </ol>
          <p>
            <strong>
              If we cannot issue a ticket at the quoted price — because the fare
              or the seat is gone before issue — we will tell you promptly and
              refund everything you paid in full.
            </strong>{" "}
            You are free to accept a revised quote instead, but you are under no
            obligation to.
          </p>
        </>
      ),
    },
    {
      id: "prices-and-payment",
      heading: "Prices, fees and payment",
      body: (
        <>
          <p>
            Every quote we send shows the total you will pay, broken into the
            airfare, the taxes and carrier-imposed charges, and our service fee.
            These add up to the total. We do not add a charge at the payment
            step that was absent from the quote.
          </p>
          <p>Our service fee is published in advance in the{" "}
            <Link href="/fees-and-charges">fee schedule</Link>. It is charged
            for the work of arranging a booking, and is separate from anything
            the airline charges. We charge no fee of our own for a later
            change or cancellation — see the{" "}
            <Link href="/refund-and-cancellation-policy">
              refund and cancellation policy
            </Link>.
          </p>
          <h3>What the total does not include</h3>
          <ul>
            <li>
              Optional extras charged directly by the airline, such as seat
              selection, additional baggage or onboard purchases, unless the
              quote says they are included.
            </li>
            <li>
              Charges imposed at the airport, such as excess baggage fees.
            </li>
            <li>
              Costs that are not travel — visas, insurance, vaccinations,
              transfers — unless we have quoted for them explicitly.
            </li>
          </ul>
          <h3>Payment and currency</h3>
          <p>
            Prices are quoted in {siteConfig.currency} unless stated otherwise.
            If you pay with a card denominated in another currency, your bank
            sets the exchange rate and may add its own fee; that is between you
            and your bank, and we have no visibility of it.
          </p>
          <p>
            Payment must clear before a ticket is issued. If a payment is
            reversed or charged back after a ticket has been issued, we may
            cancel the booking to the extent the fare rules allow and recover
            what we are owed.
          </p>
        </>
      ),
    },
    {
      id: "changes-and-cancellations",
      heading: "Changes, cancellations and refunds",
      body: (
        <p>
          What you can change and what you can get back depends on the fare
          rules of your specific ticket, and those rules are set by the airline,
          not by us. Our{" "}
          <Link href="/refund-and-cancellation-policy">
            refund and cancellation policy
          </Link>{" "}
          sets out how this works in detail, including the statutory 24-hour
          cancellation right that applies to certain itineraries and how long
          airline refunds typically take. We charge no fee of our own for a
          change or cancellation — what it costs is whatever the airline or
          other supplier charges under its own rules.
        </p>
      ),
    },
    {
      id: "your-responsibilities",
      heading: "Your responsibilities",
      body: (
        <>
          <p>
            Some things only you can get right, and mistakes in them are
            expensive to fix or impossible to fix.
          </p>
          <ul>
            <li>
              <strong>Names must match your travel document exactly.</strong>{" "}
              Airlines treat a name change as a cancellation and rebooking, and
              many fares do not permit it at all. Check the spelling on your
              confirmation immediately and tell us the same day if it is wrong.
            </li>
            <li>
              <strong>Travel documents and entry requirements are yours to
              satisfy.</strong> Passports, visas, transit visas, onward-ticket
              requirements and health rules depend on your nationality, your
              route and current regulations, and they change. Check with the
              relevant embassy or official government source. We cannot advise
              authoritatively on immigration matters, and we are not responsible
              if you are refused boarding or entry.
            </li>
            <li>
              <strong>Check your itinerary and reconfirm.</strong> Airlines
              change schedules. Confirm your flight times with the operating
              airline before you travel.
            </li>
            <li>
              <strong>Arrive in time.</strong> Follow the airline&apos;s
              check-in and airport arrival guidance for your route.
            </li>
            <li>
              <strong>Give us accurate contact details.</strong> If an airline
              changes or cancels your flight, we can only pass that on if we can
              reach you.
            </li>
          </ul>
          <p>
            We strongly recommend travel insurance covering cancellation,
            medical costs and disruption. Most airline tickets are
            non-refundable, and insurance is usually the only route to recovering
            money if your plans change.
          </p>
        </>
      ),
    },
    {
      id: "using-this-site",
      heading: "Using this site",
      body: (
        <>
          <p>
            You may use this site to research and book genuine travel. You may
            not use it to make speculative or fraudulent bookings, to scrape or
            harvest content or fares systematically, to interfere with its
            operation, or to attempt to gain access to systems or data you are
            not entitled to.
          </p>
          <p>
            The content of this site — text, layout, design and the
            {" "}{siteConfig.name} name — belongs to us or our licensors. You may
            read and share it; you may not republish it as your own.
          </p>
          <p>
            Airline names and marks referenced on this site belong to their
            respective owners and are used only to identify the carrier
            operating a service. Their use does not imply any endorsement of us
            by those airlines.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      heading: "Our liability",
      body: (
        <>
          <p>
            We are responsible for arranging your booking with reasonable skill
            and care, and for the accuracy of what we quote you.
          </p>
          <p>
            We are not responsible for the acts or omissions of an airline or
            other supplier — including delays, cancellations, schedule changes,
            denied boarding, downgrades, lost or damaged baggage, or injury
            during carriage. Claims of that kind lie against the carrier, whose
            liability is governed by its conditions of carriage and by
            international conventions such as the Montreal Convention.
          </p>
          <p>
            We are not liable for events outside our reasonable control,
            including weather, industrial action, air traffic control
            restrictions, civil unrest, government action and epidemics.
          </p>
          <p>
            Except where the law does not allow it to be limited, our total
            liability arising from any booking is limited to the total service
            fees we charged you for that booking. Nothing in these terms limits
            our liability for death or personal injury caused by our negligence,
            for fraud, or for anything else that cannot lawfully be excluded —
            and nothing here affects your statutory rights as a consumer.
          </p>
        </>
      ),
    },
    {
      id: "complaints",
      heading: "Complaints",
      body: (
        <p>
          If something has gone wrong, tell us as soon as you can
          {email ? (
            <>
              {" "}
              at <a href={`mailto:${email}`}>{email}</a>
            </>
          ) : (
            " through our contact page"
          )}{" "}
          with your booking reference and what happened. We will acknowledge
          your complaint and tell you who is handling it. Where the issue is the
          airline&apos;s responsibility we will tell you plainly, and help you
          take it to them rather than passing you back and forth.
        </p>
      ),
    },
    {
      id: "governing-law",
      heading: "Governing law and changes to these terms",
      body: (
        <>
          {governingLaw && courts ? (
            <p>
              These terms are governed by the laws of {governingLaw}, and
              disputes are subject to the exclusive jurisdiction of {courts}.
              If you are a consumer, this does not deprive you of the protection
              of the mandatory laws of the country where you live.
            </p>
          ) : (
            <p>
              The governing law and jurisdiction for these terms have not yet
              been set. They must be configured in{" "}
              <code>src/lib/config/legal.ts</code>, on legal advice, before this
              site goes live.
            </p>
          )}
          <p>
            We may update these terms as our service changes. The version in
            force when you made a booking is the one that applies to it — a
            later change does not alter a booking you have already made.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Terms and conditions"
      summary="The terms on which we arrange travel: how a booking becomes binding, what your price includes, what you are responsible for, and what we are."
      sections={sections}
    />
  );
}
