import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { serviceFees } from "@/lib/config/legal";
import { isPlaceholder } from "@/lib/config/placeholders";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Fees and charges",
  description: `Every fee ${siteConfig.name} charges, what it is for, and when it applies — published in advance, not discovered at checkout.`,
  path: "/fees-and-charges",
});

/**
 * Fee schedule.
 *
 * Published as its own page because "unclear billing" is the specific thing
 * that gets travel advertisers suspended. The table is generated from
 * `serviceFees` in config, and unconfigured amounts are shown as unset rather
 * than as a number — a fee schedule quoting an invented figure is worse than
 * one that admits it is incomplete.
 */
export default function FeesPage() {
  const unconfigured = serviceFees.filter((fee) => isPlaceholder(fee.amount));

  const sections: LegalSection[] = [
    {
      id: "what-you-pay",
      heading: "What makes up the price you pay",
      body: (
        <>
          <p>
            Every quote we send breaks the total into three parts, and those
            three parts add up to exactly what you are charged:
          </p>
          <ol>
            <li>
              <strong>The airfare</strong> — what the airline charges for the
              seat, under the fare you selected.
            </li>
            <li>
              <strong>Taxes and carrier-imposed charges</strong> — government
              taxes, airport charges and airline surcharges. These are set by
              others and passed through unchanged.
            </li>
            <li>
              <strong>Our service fee</strong> — what we charge for arranging
              the booking. Always shown as its own line, never folded into the
              fare.
            </li>
          </ol>
          <p>
            <strong>
              We do not add a fee at the payment step. The total in your quote is
              the total you pay.
            </strong>
          </p>
        </>
      ),
    },
    {
      id: "our-fees",
      heading: "Our fees",
      body: (
        <>
          {serviceFees.length === 0 ? (
            <p>
              We do not currently charge a service fee. The price you are quoted
              is the airfare plus taxes and carrier-imposed charges.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Fee</th>
                      <th>Amount</th>
                      <th>Charged</th>
                      <th>Refundable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceFees.map((fee) => (
                      <tr key={fee.name}>
                        <td>
                          <strong>{fee.name}</strong>
                          {fee.note && (
                            <>
                              <br />
                              <span>{fee.note}</span>
                            </>
                          )}
                        </td>
                        <td>
                          {isPlaceholder(fee.amount) ? (
                            <em>not yet set</em>
                          ) : (
                            fee.amount
                          )}
                        </td>
                        <td>{fee.basis}</td>
                        <td>{fee.refundable ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {unconfigured.length > 0 && (
                <p>
                  <strong>Note for the site operator:</strong> {unconfigured.length}{" "}
                  {unconfigured.length === 1 ? "fee has" : "fees have"} no amount
                  set. Fill in <code>serviceFees</code> in{" "}
                  <code>src/lib/config/legal.ts</code>. Advertising with an
                  incomplete fee schedule is exactly the transparency gap that
                  gets a travel account suspended.
                </p>
              )}
            </>
          )}
        </>
      ),
    },
    {
      id: "charges-that-are-not-ours",
      heading: "Charges that are not ours",
      body: (
        <>
          <p>
            These are charged by the airline or another party, not by us, and we
            have no control over them:
          </p>
          <ul>
            <li>
              <strong>Airline change and cancellation fees</strong> — set by the
              fare rules of your ticket. We charge no fee of our own to process
              a change or cancellation; you pay only what the airline charges
              under its own rules.
            </li>
            <li>
              <strong>Seat selection, extra baggage and onboard purchases</strong>{" "}
              — paid to the airline, usually at check-in or during booking.
            </li>
            <li>
              <strong>Excess baggage at the airport</strong> — charged by the
              airline at the desk.
            </li>
            <li>
              <strong>Foreign exchange and card fees</strong> — if your card is
              in a different currency from the quote, your bank sets the rate
              and may add a fee. We never see it.
            </li>
            <li>
              <strong>Visas, insurance and vaccinations</strong> — arranged and
              paid for by you directly.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "commission",
      heading: "Commission",
      body: (
        <p>
          We may receive commission from an airline or supplier on some
          bookings. Where we do, it comes out of the fare the airline sets — it
          is not added to your total, and it does not change the price you were
          quoted. We disclose this because you are entitled to know how we are
          paid, not because it costs you anything.
        </p>
      ),
    },
    {
      id: "changes-to-fees",
      heading: "Changes to this schedule",
      body: (
        <p>
          We can change our fees, and this page always shows what is current.
          The fees that apply to your booking are the ones quoted to you at the
          time — a later change to this schedule does not affect a booking
          already made. Related detail is in the{" "}
          <Link href="/terms-and-conditions">terms and conditions</Link> and the{" "}
          <Link href="/refund-and-cancellation-policy">refund policy</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Fees and charges"
      summary="Everything we charge, published in advance. Our fees appear as separate lines in your quote — nothing is added at the payment step."
      sections={sections}
    />
  );
}
