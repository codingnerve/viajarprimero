import Link from "next/link";

import { BookingRequestForm } from "@/features/booking/components/booking-request-form";
import { parseBookingSeed } from "@/features/booking/lib/booking-request";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { ENQUIRY_ANCHOR } from "@/features/enquiries/lib/enquiry-link";
import { airports } from "@/lib/content/airports";
import { verticalCatalogue } from "@/lib/config/site";
import { serviceFees } from "@/lib/config/legal";
import { isPlaceholder } from "@/lib/config/placeholders";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Quote request.
 *
 * noIndex, per the project guide — this is a funnel step that collects
 * personal data, not a page that should rank.
 *
 * It is called "request a quote" throughout rather than "checkout", because
 * that is what it does: no payment is taken and no seat is held. The URL keeps
 * the `checkout` segment the route scaffold defines; the language the
 * traveller reads describes the real outcome.
 */
export const metadata = buildMetadata({
  title: "Request a flight quote",
  description: "Send us your flight and an agent will price it.",
  path: "/checkout",
  noIndex: true,
});

const steps = [
  "We read your request and check live availability.",
  "An agent gets back to you with options, the total broken into fare, taxes and carrier charges, and our service fee.",
  "Nothing is charged unless you confirm and we issue the ticket.",
];

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  /*
    The search results and the route pages both link here with the trip in the
    URL. This page was ignoring those parameters entirely and rendering the
    form's own defaults — round trip, one adult, economy — which read as the
    form being pre-filled with the wrong answers rather than not pre-filled at
    all. `parseBookingSeed` drops anything malformed instead of seeding a value
    nobody chose.

    Reading searchParams makes this route dynamic. That is the right trade
    here: it is noIndex, it is a funnel step nobody arrives at cold, and a
    statically cached form that ignores its own URL is the bug being fixed.
  */
  const rawParams = await props.searchParams;
  const seed = parseBookingSeed(rawParams);

  const publishedFees = serviceFees.filter((fee) => !isPlaceholder(fee.amount));
  const otherVerticals = verticalCatalogue.filter(
    (vertical) => vertical.key !== "flights",
  );

  return (
    <>
      <Section tone="brand-soft" size="sm" bordered>
        <PageHeader
          eyebrow="Step 1 of 3"
          title="Request a flight quote"
          intro="Tell us the trip and an agent will get back to you with priced options. This form does not book, hold or charge anything."
        />

        {/*
          The progress statement is the reassurance this page most needs, so it
          is above the fold rather than in a sidebar the reader reaches after
          the form. Three short steps, no icons competing with the heading.
        */}
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
              <BookingRequestForm airports={airports} initial={seed} />
            </div>

            <p className="measure mt-6 text-body-sm text-text-secondary">
              This one is for flights. A hotel, car rental or cruise request has
              its own fields — the cancellation deadline, the driver&apos;s age,
              the sailing region — so it lives on{" "}
              {otherVerticals.map((vertical, index, list) => (
                <span key={vertical.href}>
                  <Link
                    href={`${vertical.href}#${ENQUIRY_ANCHOR}`}
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    {vertical.label.toLowerCase()}
                  </Link>
                  {index < list.length - 2 ? ", " : ""}
                  {index === list.length - 2 ? " or " : ""}
                  {index === list.length - 1 ? "." : ""}
                </span>
              ))}
            </p>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
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
              <Link
                href="/fees-and-charges"
                className="mt-5 inline-block rounded-sm text-body-sm font-semibold text-primary underline-offset-4 hover:underline focus-ring"
              >
                Full fee schedule
              </Link>
            </div>

            <div className="rounded-2xl bg-success-soft p-6">
              <ShieldIcon className="size-6 text-success" />
              <h2 className="mt-3 text-h4 text-text">
                Nothing is charged here
              </h2>
              <ul className="mt-3 space-y-2">
                {[
                  "No card details are collected on this form.",
                  "No seat is held and no fare is locked.",
                  "You confirm before anything is booked.",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-body-sm text-gray-700">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="px-1 text-caption text-text-muted">
              We use the details you provide to price and arrange your trip. We
              do not sell personal data. See the{" "}
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
