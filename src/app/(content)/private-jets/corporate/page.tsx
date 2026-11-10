import Link from "next/link";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Prose } from "@/components/content/prose";
import {
  aircraftCategories,
  corporateProgrammes,
} from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Corporate private jet travel",
  description:
    "Private aviation for companies: consolidated itemised billing, booking inside your travel policy, group and multi-leg movements, and operator due diligence documented for duty of care.",
  path: "/private-jets/corporate",
});

/**
 * Corporate travel.
 *
 * Written for the person who signs off the invoice rather than the person in
 * the seat, because on corporate charter those are rarely the same person and
 * the finance and governance questions are what actually block a booking.
 *
 * The absence here is deliberate and stated: no jet cards, no block hours, no
 * prepaid balances. Those involve holding client funds against future flying,
 * we do not offer them, and a finance director is better served by us saying
 * so than by implying a capability we would have to walk back.
 */

const dutyOfCare = [
  "The operating air carrier named on every quote, before approval rather than after the flight.",
  "Air carrier certificate identified for the specific operator on each trip.",
  "Certificate of insurance available before departure on request.",
  "A written record of the options offered and the option chosen, retained per trip.",
];

export default function CorporatePage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Corporate travel", path: "/private-jets/corporate" },
        ]}
        eyebrow="Corporate travel"
        title="Private aviation your finance team can sign off"
        intro="Charter that arrives as one itemised invoice, inside your travel policy, with the operating carrier documented for every leg. Built for the approval process rather than around it."
        actions={
          <>
            <ButtonLink href="/private-jets/request-a-quote">
              Discuss a corporate account
            </ButtonLink>
            <ButtonLink href="/fees-and-charges" variant="outline">
              How we are paid
            </ButtonLink>
          </>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="What we set up"
              title="Four things that make charter workable at scale"
            />

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {corporateProgrammes.map((programme) => (
                <li
                  key={programme.slug}
                  className="flex h-full flex-col rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border"
                >
                  <h2 className="text-h4 text-text">{programme.name}</h2>
                  <p className="mt-2 text-body-sm text-text-secondary">
                    {programme.summary}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {programme.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-caption text-gray-700">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <section className="mt-16">
              <h2 className="text-h2 text-text">
                Duty of care, documented rather than asserted
              </h2>
              <p className="measure mt-3 text-body text-text-secondary">
                If your organisation has a duty-of-care obligation, &ldquo;we
                only use vetted operators&rdquo; is not evidence. This is what
                you get per trip, without asking twice.
              </p>
              <ul className="mt-6 space-y-3">
                {dutyOfCare.map((line) => (
                  <li key={line} className="flex gap-3 border-t border-border pt-3">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-body-sm text-gray-700">{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16">
              <h2 className="text-h2 text-text">
                What we do not offer, and why
              </h2>
              <Prose className="mt-4">
                <p>
                  We do not sell jet cards, block hours or fractional shares,
                  and we do not hold company money against future flying.
                </p>
                <p>
                  Those products work by taking a substantial deposit up front
                  in exchange for a fixed hourly rate. The rate is real, but so
                  is the exposure: the money sits on somebody else&apos;s
                  balance sheet until you fly it, and card providers have failed
                  with customer balances outstanding. Their customers became
                  unsecured creditors.
                </p>
                <p>
                  Every trip we arrange is priced when you book it and paid for
                  when you take it. If your flying volume genuinely justifies a
                  card, we will tell you — and we would rather you compared it
                  against real charter quotes from us than against a brochure
                  rate.
                </p>
                <p>
                  Our fees are published in full on the{" "}
                  <Link href="/fees-and-charges">fees and charges</Link> page,
                  and they do not change based on which operator you choose.
                  That is the part that makes a recommendation worth having.
                </p>
              </Prose>
            </section>

            <section className="mt-16">
              <h2 className="text-h2 text-text">Getting set up</h2>
              <Prose className="mt-4">
                <p>
                  There is no onboarding fee and no minimum commitment. Tell us
                  who approves travel, what your policy allows, and how you need
                  the invoice broken down, and we will configure it before the
                  first trip rather than after the first invoice query.
                </p>
                <p>
                  For a single trip, you do not need an account at all — send us
                  the leg and we will quote it.
                </p>
              </Prose>
            </section>
          </div>

          <EnquiryPanel
            vertical="jet"
            title="Talk to us about a corporate account"
            intro="Tell us the first trip and roughly how often you expect to fly. We will set the billing and approval side up around it."
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
