import Link from "next/link";

import { EnquiryForm } from "@/features/enquiries/components/enquiry-form";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { aircraftCategories } from "@/lib/content/private-jets";
import { serviceFees } from "@/lib/config/legal";
import { isPlaceholder } from "@/lib/config/placeholders";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Charter quote request.
 *
 * noIndex, per the project guide — this is a funnel step that collects
 * personal data, not a page that should rank. `/private-jets` and
 * `/private-jets/charter` are the pages built to rank and to receive paid
 * traffic; this is where they send people.
 *
 * It has its own URL rather than an anchor on the landing page because the
 * charter request is the longest of the four enquiry forms and because a
 * dedicated destination is easier to point a campaign at and to measure.
 */
export const metadata = buildMetadata({
  title: "Request a private jet quote",
  description:
    "Send us the leg and we will price it with licensed operators. Nothing is held and nothing is charged.",
  path: "/private-jets/request-a-quote",
  noIndex: true,
});

const steps = [
  "We source aircraft from licensed operators near your departure point.",
  "An agent gets back to you with options naming the operator, the aircraft type and the all-in price, broken into its parts.",
  "We confirm the operator's certificate and insurance before you are asked to pay anything.",
];

const assurances = [
  "No card details are collected on this form.",
  "No aircraft is held and no operator is committed.",
  "You see the operator's cancellation terms before you confirm.",
];

export default function RequestJetQuotePage() {
  const publishedFees = serviceFees.filter((fee) => !isPlaceholder(fee.amount));

  return (
    <>
      <Section tone="brand-soft" size="sm" bordered as="div">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Private jets", path: "/private-jets" },
            {
              name: "Request a quote",
              path: "/private-jets/request-a-quote",
            },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Step 1 of 3"
          title="Request a private jet quote"
          intro="Tell us the leg and who is travelling. An agent gets back to you with priced options from licensed operators. This form does not book, hold or charge anything."
        />

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3 border-t border-border pt-4">
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-caption font-bold tabular-nums text-text-inverse"
              >
                {index + 1}
              </span>
              <span className="text-body-sm text-text-secondary">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
          <div className="min-w-0">
            <div className="rounded-2xl bg-surface p-6 shadow-sm md:p-8">
              <EnquiryForm
                vertical="jet"
                aircraftCategories={aircraftCategories.map((category) => ({
                  slug: category.slug,
                  name: category.name,
                  seats: category.seats,
                }))}
              />
            </div>

            <p className="measure mt-6 text-body-sm text-text-secondary">
              Not sure which cabin size you need? Leave it as{" "}
              <em>recommend one for me</em> and tell us what baggage you are
              carrying in the notes — bags force the aircraft choice more often
              than passenger count does. The{" "}
              <Link
                href="/private-jets/aircraft"
                className="font-medium text-primary underline underline-offset-2"
              >
                aircraft guide
              </Link>{" "}
              covers the categories if you would rather choose yourself.
            </p>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <div className="rounded-2xl bg-success-soft p-6">
              <ShieldIcon className="size-6 text-success" />
              <h2 className="mt-3 text-h4 text-text">
                Nothing is charged here
              </h2>
              <ul className="mt-3 space-y-2">
                {assurances.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-body-sm text-gray-700">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-surface-2 p-6 ring-1 ring-inset ring-border">
              <h2 className="text-h4 text-text">What we charge</h2>
              {publishedFees.length > 0 ? (
                <dl className="mt-4 space-y-3 text-body-sm">
                  {publishedFees.map((fee) => (
                    <div
                      key={fee.name}
                      className="border-t border-border pt-3 first:border-0 first:pt-0"
                    >
                      <dt className="font-medium text-text">{fee.name}</dt>
                      <dd className="mt-0.5 text-text-secondary">
                        {fee.amount} {fee.basis}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-2 text-body-sm text-text-secondary">
                  Our service fees are published in full on the fees and charges
                  page, and every fee appears as a separate line in your quote
                  before you pay.
                </p>
              )}
              <p className="mt-4 text-caption text-text-muted">
                Our fee does not change depending on which operator you choose,
                so the recommendation you get is not bought.
              </p>
              <Link
                href="/fees-and-charges"
                className="mt-4 inline-block rounded-sm text-body-sm font-semibold text-primary underline-offset-4 hover:underline focus-ring"
              >
                Full fee schedule
              </Link>
            </div>

            <p className="px-1 text-caption text-text-muted">
              We use the details you provide to price and arrange your flight.
              We do not sell personal data. See the{" "}
              <Link
                href="/privacy-policy"
                className="text-primary underline underline-offset-2"
              >
                privacy policy
              </Link>{" "}
              for what we collect and how long we keep it.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
