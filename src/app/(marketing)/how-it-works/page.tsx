import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { commitments } from "@/lib/content/home";
import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "How it works",
  description:
    "Search or call, talk to an agent, then confirm and we book — flights, hotels, cars, cruises, private jets and vacation packages.",
  path: "/how-it-works",
});

/**
 * How it works — the booking as it actually runs: search or call, an agent
 * prices it with you, you confirm and we book. At each step it says what the
 * traveller has committed to.
 */
const steps = [
  {
    title: "Search or call us",
    body: "Search flights, hotels or private jets on the site, or call us with any trip — a cruise, a rental car, a vacation package or a group booking.",
    committed: "Nothing. Searching and calling cost nothing.",
  },
  {
    title: "Talk to an agent",
    body: "An agent checks live prices and availability for your dates and tells you the full price — taxes, supplier charges and our service fee included. You also hear the rules that come with it: baggage and change rules on a flight, the cancellation deadline on a hotel, the deposit on a cruise.",
    committed: "Still nothing. You can say no.",
  },
  {
    title: "You confirm, we book",
    body: "When an option works for you, confirm it and pay. The agent makes the booking and you get your confirmation and booking reference.",
    committed:
      "The booking is made. Changes and refunds follow the airline, hotel or supplier's own rules.",
  },
];

export default function HowItWorksPage() {
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ]}
        title="How it works"
        intro="Three steps from your first search to a confirmed booking — the same for a flight, a hotel, a car, a cruise or a private jet."
      />

      <Section>

        <ol className="max-w-3xl space-y-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xs bg-surface ring-1 ring-inset ring-border p-5 md:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-h5 font-bold text-text-inverse tabular-nums">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-h3 text-text">{step.title}</h2>
                  <p className="mt-2 text-body-lg text-gray-700">
                    {step.body}
                  </p>
                  <p className="mt-3 border-l-2 border-primary pl-3 text-body text-text-secondary">
                    <span className="font-semibold text-text">
                      What you have committed to:
                    </span>{" "}
                    {step.committed}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-10 max-w-3xl rounded-xs bg-primary-softer p-6">
          <h2 className="text-h3 text-text">After you are booked</h2>
          <p className="mt-2 text-body-lg text-gray-700">
            Changes and refunds follow the supplier&apos;s own rules for what you
            booked — the fare rules on your ticket, the cancellation deadline on
            your room, the terms on your rental or cabin. Both are set out in
            the{" "}
            <Link
              href="/refund-and-cancellation-policy"
              className="text-primary underline underline-offset-2"
            >
              refund and cancellation policy
            </Link>{" "}
            and the{" "}
            <Link
              href="/fees-and-charges"
              className="text-primary underline underline-offset-2"
            >
              fee schedule
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {phone && phoneDisplay && (
              <ButtonLink
                href={`tel:${phone}`}
                icon={<PhoneIcon className="size-4" />}
                aria-label={`Call to book: ${phoneDisplay}`}
              >
                <span className="tabular-nums">Call {phoneDisplay}</span>
              </ButtonLink>
            )}
            <ButtonLink href="/flights" variant="outline">
              Search flights
            </ButtonLink>
          </div>
        </section>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="What we promise"
          title="How we treat every booking"
          description="Each one links to the page that sets it out in full."
        />

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {commitments.map((item, index) => (
            <li key={item.title} className="py-8 first:pt-0 last:pb-0">
              <div className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="mt-1 text-h4 tabular-nums text-text-disabled"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-h3 text-text">{item.title}</h3>
                  <p className="measure mt-2 text-body text-text-secondary">
                    {item.body}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-block rounded-sm text-body font-semibold text-primary underline-offset-4 hover:underline focus-ring"
                  >
                    {item.linkLabel}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
