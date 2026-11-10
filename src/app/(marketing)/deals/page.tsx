import Link from "next/link";

import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getLiveDeals } from "@/lib/content/deals";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatLongDate } from "@/lib/utils/format-date";

export const metadata = buildMetadata({
  title: "Deals",
  description:
    "Flight, hotel, car, cruise, private jet and vacation deals — plus deals for couples, families, groups and existing customers. Call an agent for current offers.",
  path: "/deals",
  // Matches sitemap.ts, which drops /deals from the sitemap while nothing is
  // published. With no live offer the page is a list of things to ask about,
  // not an offer page, and should not be indexed as one.
  noIndex: getLiveDeals().length === 0,
});

/**
 * Deals.
 *
 * Every category from the header dropdown, anchored by slug. Offers published
 * in `deals` (with supplier, dates and conditions) show above the categories.
 */
export default function DealsPage() {
  const live = getLiveDeals();

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Deals", path: "/deals" },
        ]}
        title="Deals"
        intro="Pick the kind of deal you want, then call or chat with an agent. They check what is available for your dates and tell you the full price before you book."
      />

      <Section>
        <div className="measure-wide mb-14 rounded-xs bg-gray-50 p-6 ring-1 ring-inset ring-border">
          <h2 className="text-h4 text-text">Where our deals come from</h2>
          <p className="mt-2 text-body-sm text-text-secondary">
            We are a travel agency, not the airline, hotel, rental desk or
            cruise line. We do not set their prices, so a lower price here is
            always one of four things:
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm text-text-secondary">
            <li>
              A promotion the supplier is already running, which we pass on
              unchanged.
            </li>
            <li>
              A negotiated or consolidator rate our agency has access to and
              the public site does not.
            </li>
            <li>
              A partner or promo code, applied only when it actually beats the
              price you would otherwise pay.
            </li>
            <li>
              A reduction in{" "}
              <Link
                href="/fees-and-charges"
                className="text-primary underline underline-offset-2"
              >
                our own service fee
              </Link>
              , which is the only part of the total that is ours to discount.
            </li>
          </ul>
          <p className="mt-3 text-caption text-text-secondary">
            None of these are guaranteed on every route or every date. Which
            ones apply to your trip is what the agent checks, and you get the
            full price — supplier cost and our fee itemised separately — before
            anything is booked.
          </p>
        </div>

        {live.length > 0 && (
          <div className="mb-14">
            <h2 className="text-h3 text-text">Current offers</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((deal) => (
                <li key={deal.slug}>
                  <Card className="flex h-full flex-col">
                    <Badge tone="accent">{deal.vertical}</Badge>
                    <h3 className="mt-3 text-h4 text-text">{deal.title}</h3>

                    <p className="mt-2 text-h3 text-text">
                      {formatCurrency(deal.totalMinorUnits, deal.currency)}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {deal.priceBasis}
                    </p>

                    <dl className="mt-3 space-y-1 text-caption text-gray-700">
                      <div className="flex gap-1">
                        <dt className="text-text-secondary">Supplier:</dt>
                        <dd>{deal.supplier}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-text-secondary">Travel:</dt>
                        <dd>
                          {formatLongDate(deal.travelFrom)} –{" "}
                          {formatLongDate(deal.travelTo)}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-text-secondary">Book by:</dt>
                        <dd>{formatLongDate(deal.bookByDate)}</dd>
                      </div>
                    </dl>

                    <details className="mt-3">
                      <summary className="cursor-pointer text-body font-semibold text-primary focus-ring">
                        Conditions
                      </summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-caption text-gray-700">
                        {deal.conditions.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </details>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DealCategoryGrid />

        <p className="mt-12 measure text-caption text-text-secondary">
          Deals depend on availability and change until a booking is confirmed.
          The agent tells you the conditions before you pay. Our service fees
          are set out on the{" "}
          <Link href="/fees-and-charges" className="text-primary underline underline-offset-2">
            fees and charges
          </Link>{" "}
          page.
        </p>
      </Section>
    </>
  );
}
