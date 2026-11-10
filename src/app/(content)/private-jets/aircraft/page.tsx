import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Prose } from "@/components/content/prose";
import { aircraftCategories } from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Private jet aircraft guide",
  description:
    "The eight private jet categories compared — seats, range, cabin height and baggage — with what each one is genuinely for and the trade-off that comes with it.",
  path: "/private-jets/aircraft",
});

/**
 * Aircraft category index.
 *
 * The comparison table is the point of this page, and it is the reason the
 * page ranks: everybody publishes category names, almost nobody publishes the
 * cabin height and baggage figures next to them, which are the two numbers
 * that actually decide the choice.
 */
export default function AircraftPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Aircraft", path: "/private-jets/aircraft" },
        ]}
        eyebrow="Aircraft guide"
        title="Eight categories, compared honestly"
        intro="Private aircraft are grouped into categories that describe capability rather than brand. Range and cabin height are what change the experience — and baggage volume is what forces the decision far more often than seat count does."
        actions={
          <ButtonLink href="/private-jets/request-a-quote">
            Ask us to size it for you
          </ButtonLink>
        }
      />

      <Section>
        {/* Wide table, its own scroll container. Seven columns will not fit a
            phone and squeezing them makes every cell one word per line. */}
        <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
          <table className="w-full min-w-[54rem] border-collapse text-body-sm">
            <caption className="sr-only">
              Private jet categories with typical seating, range, cruise speed,
              cabin height and baggage capacity
            </caption>
            <thead>
              <tr>
                {[
                  "Category",
                  "Seats",
                  "Range (nm)",
                  "Cruise (kts)",
                  "Cabin height",
                  "Baggage",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="border-b border-border-strong px-4 py-3 text-left text-overline uppercase text-text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aircraftCategories.map((category) => (
                <tr
                  key={category.slug}
                  className="transition-colors hover:bg-surface-2"
                >
                  <th
                    scope="row"
                    className="border-b border-border px-4 py-4 text-left align-top text-h6 text-text"
                  >
                    <Link
                      href={`/private-jets/aircraft/${category.slug}`}
                      className="rounded-sm underline-offset-4 hover:text-primary hover:underline focus-ring"
                    >
                      {category.name}
                    </Link>
                    <span className="mt-0.5 block text-caption font-normal text-text-muted">
                      {category.examples[0]}
                    </span>
                  </th>
                  <td className="border-b border-border px-4 py-4 align-top tabular-nums text-text-secondary">
                    {category.seats}
                  </td>
                  <td className="border-b border-border px-4 py-4 align-top tabular-nums text-text-secondary">
                    {category.rangeNm}
                  </td>
                  <td className="border-b border-border px-4 py-4 align-top tabular-nums text-text-secondary">
                    {category.cruiseKts}
                  </td>
                  <td className="border-b border-border px-4 py-4 align-top text-text-secondary">
                    {category.cabinHeight}
                  </td>
                  <td className="border-b border-border px-4 py-4 align-top text-text-secondary">
                    {category.baggage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="measure mt-6 text-caption text-text-muted">
          Figures are typical for representative types in each category and are
          given as ranges because they vary by aircraft, configuration and
          payload. Real-world range is always lower than the published figure
          once headwind, passengers, baggage and fuel reserves are accounted
          for. We confirm the specific aircraft&apos;s capability against your
          actual routing before quoting it.
        </p>

        <SectionHeading
          className="mt-16"
          eyebrow="In detail"
          title="What each category is for"
        />

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {aircraftCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/private-jets/aircraft/${category.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none focus-ring"
              >
                <h2 className="text-h3 text-text">{category.name}</h2>
                <p className="mt-1 text-caption tabular-nums text-text-muted">
                  {category.seats} seats · {category.rangeNm} nm ·{" "}
                  {category.cabinHeight} cabin
                </p>
                <p className="mt-4 text-body-sm text-text-secondary">
                  {category.bestFor}
                </p>
                <p className="mt-3 text-body-sm text-text-muted">
                  <span className="font-semibold text-text-secondary">
                    Trade-off:
                  </span>{" "}
                  {category.tradeOff}
                </p>
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-body-sm font-semibold text-primary">
                  Specifications and examples
                  <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16">
          <h2 className="text-h2 text-text">
            The two mistakes people make choosing a category
          </h2>
          <Prose className="mt-4">
            <p>
              <strong>Booking to seat count.</strong> Eight seats does not mean
              eight people with luggage. A light jet with six passengers and six
              full-size cases is over its baggage volume long before it is over
              its seats, and the fix on the day is an aircraft upgrade at short
              notice. Tell us what you are carrying at the quoting stage and it
              never comes up.
            </p>
            <p>
              <strong>Booking to published range.</strong> Manufacturer range
              figures assume conditions you will not have — typically four
              passengers, no wind, and long-range cruise. A category listed as
              capable of your leg may still need a fuel stop westbound in
              winter. We check the specific aircraft against the specific
              routing, and if it needs a stop we say so in the quote rather than
              on the day.
            </p>
          </Prose>
        </section>
      </Section>
    </>
  );
}
