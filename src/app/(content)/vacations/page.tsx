import Link from "next/link";

import { CustomerReviews } from "@/components/content/customer-reviews";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { Prose } from "@/components/content/prose";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryBand } from "@/features/enquiries/components/enquiry-band";
import { VacationCard } from "@/features/enquiries/components/vacation-card";
import { vacationPackages } from "@/lib/content/vacation-packages";
import { packageDoesNotSuit, packageSuits } from "@/lib/content/vacations";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Vacation packages",
  description:
    "Vacation packages with flights and hotel booked together. Beach, city and family trips planned by a real travel agent around your dates.",
  path: "/vacations",
});

/**
 * Vacation packages.
 *
 * The sixth thing we quote, and the only one assembled from two of the others
 * — a flight and a stay, sold as one trip. It reuses the `vacation` enquiry
 * vertical rather than getting a funnel of its own; see `verticalCopy`.
 *
 * ## What this page may not say
 *
 * No packaging supplier is connected to this site, and the funnel is a written
 * request answered by a person. So the page describes the product and what we
 * will do when asked, and never claims an existing operation or a saving.
 *
 * "Save up to 40%" is the standard claim in this corner of travel. It is
 * absent here on purpose: a bundled price beats two separate bookings on some
 * trips and loses on others, and which one yours is cannot be known before
 * somebody prices it. That is why the "when it is not worth it" list below is
 * as long as the one arguing for it — a page that only makes the case for the
 * thing it sells is an advert, and the traveller finds out either way.
 *
 * It is deliberately not in `verticalCatalogue`. That list drives the five
 * tabs in the home page hero, and a sixth tab is a layout decision rather than
 * a content one. The route in is the footer and this page.
 */

export default function VacationsPage() {
  return (
    <>
      <Section tone="brand-soft" size="sm" bordered>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Vacation packages", path: "/vacations" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Vacations"
          title="Vacation packages, planned for you"
          intro="Flights and hotel booked together as one trip, with transfers added where you want them. Tell us where and when, and a real agent puts it together."
        />
      </Section>

      {/*
        The list. Ideas rather than inventory — see lib/content/vacation-packages
        for why none of them carries a price.

        Each card ends at the form below with its destination already filled
        in, so picking one and asking about it is a click rather than a
        scroll and a retype.
      */}
      <Section>
        <SectionHeading
          eyebrow="Where people go"
          title="Trips we are asked to put together"
          description="Six favourite trips to start from. Pick one and we plan it around your airport, your dates and who is travelling."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {vacationPackages.map((entry) => (
            <li key={entry.slug}>
              <VacationCard entry={entry} />
            </li>
          ))}
        </ul>

        <p className="measure-wide mt-8 text-caption text-text-muted">
          Somewhere else in mind? The form below takes any destination — these
          are the ones we are asked about most, not the only ones we quote.
        </p>
      </Section>

      {/*
        The request, under the list. z-20 because Section sets `isolate`, so
        each band is its own stacking context and the next would otherwise
        paint over an open picklist.
      */}
      <Section tone="muted" bordered className="z-20">
        <EnquiryBand
          vertical="vacation"
          eyebrow="Tell us the trip"
          title="Request vacation options"
          description="Where you would fly from, where you want to go, the dates and who is travelling. An agent gets back to you with trip options."
          points={[
            "No account, and no card details",
            "Nothing is held and nothing is charged",
            "A real agent gets back to you",
            "Flights, hotel and transfers in one trip",
          ]}
          disclaimer="We are a travel agency. Flights are operated by licensed airlines and accommodation is supplied by the property or its operator, each under its own conditions. We will tell you who is responsible for what, and which consumer protections apply to your booking, before you pay."
        />
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Straight answer"
          title="When a package is worth it — and when it is not"
          description="We would rather tell you to book the flight and the hotel separately than sell you a bundle that costs more. You would find out anyway."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-success-soft p-6">
            <h3 className="text-h4 text-text">It usually stacks up</h3>
            <ul className="mt-4 space-y-3">
              {packageSuits.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="text-body-sm text-text-secondary">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-surface p-6 ring-1 ring-inset ring-border">
            <h3 className="text-h4 text-text">Book the parts separately</h3>
            <ul className="mt-4 space-y-3">
              {packageDoesNotSuit.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-text-disabled"
                  />
                  <span className="text-body-sm text-text-secondary">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Deals" title="Vacation deals" />
        <div className="mt-10">
          <DealCategoryGrid
            variant="compact"
            featured={["vacation-deals", "flight-hotel-deals", "honeymoon-deals", "family-deals"]}
          />
        </div>
      </Section>

      <Section>
        <CustomerReviews vertical="vacation" />
      </Section>

      <Section size="sm">
        <h2 className="text-h2 text-text">What helps us price it faster</h2>
        <Prose className="mt-4">
          <p>
            A second airport you could fly from, and a few days either side of
            your dates. Those two answers move a package price more than
            anything else, and a request that includes them usually comes back
            with three options rather than one.
          </p>
          <p>
            Board basis is worth deciding early — room only and all-inclusive
            are not small variations on the same holiday. If you are unsure,
            say so and we will price both.
          </p>
          <p>
            Already know the flight or the property you want? Send it. We can
            build the package around a fixed half, or tell you honestly that
            booking it as <Link href="/flights">flights</Link> and a{" "}
            <Link href="/hotels">hotel</Link> separately would come to less.
          </p>
        </Prose>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/destinations" variant="outline">
            Browse destinations
          </ButtonLink>
          <ButtonLink href="/cruises" variant="outline">
            Cruises instead
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
