import Link from "next/link";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { DefinitionList } from "@/components/ui/definition-list";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Prose } from "@/components/content/prose";
import { aircraftCategories } from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Deliberately not titled "Private jet charter" — that is `/private-jets`,
 * and two pages in the same section competing on an identical title split
 * their own ranking signals and give Search Console nothing to tell them
 * apart. This page is the process; the landing page is the offer.
 */
export const metadata = buildMetadata({
  title: "How private jet charter works",
  description:
    "How on-demand private jet charter works: how the aircraft is sourced, how the operator is vetted, what the quote includes and excludes, and what happens between your request and departure.",
  path: "/private-jets/charter",
});

/**
 * On-demand charter — the process page.
 *
 * Distinct from the `/private-jets` landing page on purpose. That page answers
 * "why you" and "what does it cost"; this one answers "what actually happens
 * after I send the request", which is the question that decides whether a
 * first-time charterer goes through with it.
 *
 * It carries the operator due-diligence detail, because that is the part a
 * broker is genuinely accountable for and the part almost nobody publishes.
 */

const steps = [
  {
    term: "1. You send the leg",
    detail:
      "Where from, where to, when, how many people and — the one everybody forgets — what baggage. Ski bags, golf clubs and film equipment change the aircraft more often than passenger count does.",
  },
  {
    term: "2. We source against it",
    detail:
      "We approach operators with suitable aircraft near your departure point. Aircraft already positioned near you are cheaper to fly than aircraft that have to be brought in, which is why the same request can come back at very different prices.",
  },
  {
    term: "3. You get options",
    detail:
      "Normally two or three, each naming the operator, the aircraft type, the year, the cabin layout and the all-in price broken into its parts. Not a single take-it-or-leave-it figure.",
  },
  {
    term: "4. We check the operator",
    detail:
      "Air carrier certificate and insurance confirmed for the specific operator flying you, before you are asked to pay. On request we send you the certificate itself rather than an assurance that we looked.",
  },
  {
    term: "5. You confirm and we contract",
    detail:
      "The charter agreement is between you and the operator; we arrange it. You get the operator's cancellation schedule and its terms before payment, not after.",
  },
  {
    term: "6. Details before departure",
    detail:
      "Tail number, crew, FBO, catering, ground transport and any customs notification confirmed ahead of the day, with a point of contact who is a person rather than a queue.",
  },
];

const included = [
  "Aircraft, flight crew and fuel for your legs",
  "Positioning of the aircraft to and from your departure point",
  "Landing, handling and ramp fees at both ends",
  "Standard catering appropriate to the galley on board",
  "Applicable air transportation taxes and segment fees",
  "Our service fee, shown as its own line",
];

const notIncluded = [
  "Ground transport, unless you ask us to arrange it and it is quoted",
  "De-icing, which is charged at cost on the day and cannot be quoted in advance",
  "Extended crew overnights caused by a schedule change you make",
  "Additional catering or specific wines requested after the quote is issued",
  "Customs overtime charges at fields that levy them outside published hours",
];

export default function CharterPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Charter", path: "/private-jets/charter" },
        ]}
        eyebrow="On-demand charter"
        title="How a charter actually gets arranged"
        intro="Ad-hoc charter means the aircraft is sourced for your specific trip rather than drawn from a fleet or a card balance. Here is exactly what happens between your request and the aircraft door closing."
        actions={
          <>
            <ButtonLink href="/private-jets/request-a-quote">
              Request a charter quote
            </ButtonLink>
            <ButtonLink href="/private-jets/aircraft" variant="outline">
              Compare aircraft
            </ButtonLink>
          </>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="The process"
              title="Six steps, and who is responsible at each one"
            />
            <DefinitionList items={steps} className="mt-8" />

            <SectionHeading
              className="mt-16"
              eyebrow="The quote"
              title="What the price covers"
              description="Charter quotes vary wildly in what they fold in. Ours is built the same way every time, and the exclusions are stated rather than discovered."
            />

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-success-soft p-6">
                <h3 className="text-h4 text-text">In the quoted price</h3>
                <ul className="mt-4 space-y-3">
                  {included.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                      <span className="text-body-sm text-gray-700">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-warning-soft p-6">
                <h3 className="text-h4 text-text">Not in it, and why</h3>
                <ul className="mt-4 space-y-3">
                  {notIncluded.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-body-sm text-gray-700">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section className="mt-16">
              <h2 className="text-h2 text-text">
                Charter, jet cards and fractional shares
              </h2>
              <Prose className="mt-4">
                <p>
                  Three different products get sold under the same heading, and
                  the differences are financial rather than aeronautical.
                </p>
                <ul>
                  <li>
                    <strong>On-demand charter</strong> is what we arrange. You
                    pay for one trip, priced when you book it. Nothing is paid
                    in advance, and there is no balance to lose.
                  </li>
                  <li>
                    <strong>Jet cards</strong> take a large deposit up front
                    against future flying at a fixed hourly rate. The rate buys
                    certainty; the deposit is money you have handed to a company
                    whose balance sheet you have not seen. Card providers have
                    failed, and their customers have become unsecured creditors.
                  </li>
                  <li>
                    <strong>Fractional ownership</strong> is buying a share of a
                    specific aircraft, with monthly management fees and a
                    multi-year commitment. It is an asset purchase with a travel
                    product attached.
                  </li>
                </ul>
                <p>
                  We do not sell cards or shares, and we do not hold client funds
                  against future flying. If you fly enough hours that a card
                  genuinely makes sense, we will tell you that too — but we would
                  rather you compared it against a real charter quote than
                  against a brochure rate.
                </p>
              </Prose>
            </section>

            <section className="mt-16">
              <h2 className="text-h2 text-text">
                What to ask any charter broker
              </h2>
              <Prose className="mt-4">
                <p>
                  These are the questions that separate a broker from a lead
                  generator. Ask us, and ask whoever else you are speaking to.
                </p>
                <ul>
                  <li>
                    Who is the operator, and can I see their air carrier
                    certificate? A broker who will not name the operator before
                    payment is not in a position to answer for the flight.
                  </li>
                  <li>
                    Is the quoted price all-in, and what specifically is excluded?
                  </li>
                  <li>
                    Does your fee change depending on which operator I pick? If
                    it does, the recommendation is not neutral.
                  </li>
                  <li>
                    What is the cancellation schedule, and when does it step?
                  </li>
                  <li>
                    What happens if the aircraft goes technical on the morning
                    of the flight, and who pays for the alternative?
                  </li>
                </ul>
                <p>
                  Our answers are on the{" "}
                  <Link href="/private-jets/faq">private jet FAQ</Link>, and our
                  fees are published on the{" "}
                  <Link href="/fees-and-charges">fees and charges</Link> page.
                </p>
              </Prose>
            </section>
          </div>

          <EnquiryPanel
            vertical="jet"
            title="Request a charter quote"
            intro="The leg, the dates, the passengers and the bags. We come back with options naming the operator and the aircraft."
            disclaimer="We are a charter broker, not an air carrier. Every flight is operated by a licensed operator under its own air carrier certificate, and that operator's conditions of carriage govern the flight."
            aircraftCategories={aircraftCategories.map((category) => ({
              slug: category.slug,
              name: category.name,
              seats: category.seats,
            }))}
          />
        </div>
      </Section>
    </>
  );
}
