import Link from "next/link";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { CustomerReviews } from "@/components/content/customer-reviews";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import { JetSearchForm } from "@/features/private-jets/components/jet-search-form";
import { DefinitionList } from "@/components/ui/definition-list";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { publicFileExists } from "@/lib/content/images";
import { privateJetHeroImages } from "@/lib/content/private-jet-hero";
import {
  aircraftCategories,
  jetFaqs,
  jetHubs,
  jetRoutes,
  jetServices,
} from "@/lib/content/private-jets";
import { bookingConfig } from "@/lib/config/booking";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Private jet charter",
  description:
    "Private jet charter with licensed operators worldwide. Tell us the route and a real agent comes back with the aircraft, the operator and an all-in quote.",
  path: "/private-jets",
});

/**
 * Private aviation landing page.
 *
 * This is the page paid traffic lands on, so it has to do two jobs at once:
 * rank for charter intent, and be a page a sceptical first-time charterer
 * trusts. Those pull in the same direction here, because what this market
 * lacks is a straight answer about how the price is built.
 *
 * It carries no "from $X per hour" figure. We are a broker, not an operator, and every claim
 * on this page is written to keep that distinction visible — see the header
 * comment in lib/content/private-jets.ts for why that matters legally as well
 * as ethically.
 */

/** Honest positioning against the alternatives. */
const whenItMakesSense = [
  "A group of four or more on a route with no convenient scheduled service, where the per-person maths stops looking absurd.",
  "A same-day return that scheduled flying would turn into an overnight, once a hotel and a lost working day are counted.",
  "A destination whose nearest airline airport is two hours' drive from where you actually need to be.",
  "A schedule that has to bend around you rather than the other way round — several stops in a day, or a departure time that is not on anybody's timetable.",
];

/** One still frame behind the hero; a single slide renders without controls. */
const heroSlides: HeroSlide[] = privateJetHeroImages.slice(0, 1).map((image) => ({
  id: image.src,
  src: publicFileExists(image.src) ? image.src : null,
  alt: image.alt,
}));

const whenItDoesNot = [
  "One or two people on a well-served trunk route. Business class is almost always the better answer and we will say so.",
  "A trip where the dates are fixed months out and the scheduled fare is already booked cheaply.",
  "Any comparison that starts from an empty-leg price. Those are real but they are not a benchmark for a charter on your dates.",
];

export default function PrivateJetsPage() {
  const featuredRoutes = jetRoutes.slice(0, 3);
  const topFaqs = jetFaqs.slice(0, 5);

  return (
    <>
      {/*
        FAQPage markup for the five questions actually shown on this page. The
        full set is marked up on /private-jets/faq — repeating all ten here
        would assert the same content on two URLs.
      */}
      <JsonLd
        schema={faqSchema(
          topFaqs.map(({ question, answer }) => ({ question, answer })),
        )}
      />

      {/*
        Service markup naming the provider and, explicitly, the brokerage
        relationship. `serviceType` is what this is; the description says what
        it is not.
      */}
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Private jet charter brokerage",
          name: "Private jet charter",
          provider: { "@type": "TravelAgency", name: siteConfig.name },
          description:
            "Arrangement of private jet charter flights operated by licensed air carriers. We are a charter broker and do not own, operate or crew aircraft.",
          areaServed: "Worldwide",
          url: new URL("/private-jets", siteConfig.url).toString(),
        }}
      />

      <Section
        tone="brand"
        size="lg"
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <Breadcrumbs
          tone="inverse"
          items={[
            { name: "Home", path: "/" },
            { name: "Private jets", path: "/private-jets" },
          ]}
        />

        <PageHeader
          className="mt-8"
          tone="inverse"
          eyebrow="Private aviation"
          title="Private jet charter, quoted all-in"
          intro="Tell us the route and we come back with the aircraft, the licensed operator that flies it, and one all-in price."
          actions={
            <>
              <ButtonLink href="/private-jets/request-a-quote" size="lg">
                Request a charter quote
              </ButtonLink>
              <ButtonLink
                href="/private-jets/empty-legs"
                variant="inverse"
                size="lg"
              >
                See live empty legs
              </ButtonLink>
            </>
          }
        />

        {/*
          The disclosure that separates this page from most of its
          competitors, placed above the fold on purpose rather than in a
          footnote. A first-time charterer who reads nothing else should read
          this.
        */}
        <p className="measure mt-12 border-t border-white/15 pt-6 text-body-sm text-gray-400">
          We are a charter broker. Every flight we arrange is operated by a
          licensed air carrier, and the quote names that operator. We do not own
          aircraft, we do not operate them, and we do not have a fleet.
        </p>
      </Section>

      {/*
        The search sits in its own band under the hero rather than inside it.
        A panel on the navy would compete with the disclosure above, which is
        the one thing on this page a first-time charterer has to read.

        z-20 because Section sets `isolate`, so each band is its own stacking
        context and the next one would otherwise paint over an open picklist.
      */}
      <Section size="sm" tone="muted" bordered className="z-20">
        <SectionHeading
          eyebrow={bookingConfig.callToBook ? "Your route" : "Live availability"}
          title={
            bookingConfig.callToBook
              ? "Tell us where you are flying"
              : "See what is flying"
          }
          description={
            bookingConfig.callToBook
              ? "Give us the route and date, and an agent will source aircraft by phone, including repositioning flights at a fraction of a full charter."
              : "Search real operator availability, including repositioning flights at a fraction of a full charter. Leave the destination blank to see everything leaving a city."
          }
        />
        <JetSearchForm className="mt-8" tone="flat" hubs={jetHubs} />
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            {/* ── When it is and is not the right answer ─────────────── */}
            <SectionHeading
              eyebrow="Straight answer"
              title="When chartering is worth it — and when it is not"
              description="We would rather tell you to fly commercially than sell you a charter you did not need. Repeat clients are worth more than one oversold trip."
            />

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-success-soft p-6">
                <h3 className="text-h4 text-text">It usually stacks up</h3>
                <ul className="mt-4 space-y-3">
                  {whenItMakesSense.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                      <span className="text-body-sm text-gray-700">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-surface-2 p-6 ring-1 ring-inset ring-border">
                <h3 className="text-h4 text-text">It usually does not</h3>
                <ul className="mt-4 space-y-3">
                  {whenItDoesNot.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-text-disabled"
                      />
                      <span className="text-body-sm text-gray-700">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Aircraft ───────────────────────────────────────────── */}
            <SectionHeading
              className="mt-16"
              eyebrow="Aircraft"
              title="Eight categories, and what each one is for"
              description="Categories are an industry taxonomy, not a brand. What matters is range, cabin height and baggage — and baggage forces the choice more often than seats do."
              action={
                <ButtonLink
                  href="/private-jets/aircraft"
                  variant="outline"
                  size="sm"
                >
                  Full aircraft guide
                </ButtonLink>
              }
            />

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {aircraftCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/private-jets/aircraft/${category.slug}`}
                    className="group flex h-full flex-col rounded-xl bg-surface-2 p-5 ring-1 ring-inset ring-border transition-[background-color,box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:bg-surface hover:shadow-md motion-reduce:transform-none focus-ring"
                  >
                    <span className="text-h5 text-text">{category.name}</span>
                    <span className="mt-1 text-caption text-text-muted">
                      {category.seats} seats · {category.rangeNm} nm range
                    </span>
                    <span className="mt-3 text-body-sm text-text-secondary">
                      {category.reach}
                    </span>
                    <span className="mt-auto flex items-center gap-1.5 pt-4 text-body-sm font-semibold text-primary">
                      Details
                      <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Routes ─────────────────────────────────────────────── */}
            <SectionHeading
              className="mt-16"
              eyebrow="Routes"
              title="Legs we are asked about most"
              description="Written around the business-aviation airports actually used on these city pairs, which is where most of the time saving comes from."
              action={
                <ButtonLink
                  href="/private-jets/routes"
                  variant="outline"
                  size="sm"
                >
                  All routes
                </ButtonLink>
              }
            />

            <ul className="mt-8 divide-y divide-border border-y border-border">
              {featuredRoutes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={`/private-jets/routes/${route.slug}`}
                    className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5 focus-ring"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-h4 tabular-nums text-text">
                        {route.originCode}
                      </span>
                      <ArrowRightIcon className="size-4 text-primary transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                      <span className="text-h4 tabular-nums text-text">
                        {route.destinationCode}
                      </span>
                      <span className="text-body-sm text-text-secondary">
                        {route.originCity} to {route.destinationCity}
                      </span>
                    </span>
                    <span className="text-caption tabular-nums text-text-muted">
                      {route.distanceNm.toLocaleString("en-US")} nm ·{" "}
                      {route.blockTime}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Services ───────────────────────────────────────────── */}
            <SectionHeading
              className="mt-16"
              eyebrow="Around the flight"
              title="What we arrange, and what we do not"
              action={
                <ButtonLink
                  href="/private-jets/services"
                  variant="outline"
                  size="sm"
                >
                  All services
                </ButtonLink>
              }
            />
            <DefinitionList
              className="mt-8"
              items={jetServices.slice(0, 4).map((service) => ({
                term: service.name,
                detail: service.summary,
              }))}
            />

            {/* ── FAQ ────────────────────────────────────────────────── */}
            <SectionHeading
              className="mt-16"
              eyebrow="Before you charter"
              title="Questions worth asking"
              action={
                <ButtonLink
                  href="/private-jets/faq"
                  variant="outline"
                  size="sm"
                >
                  All questions
                </ButtonLink>
              }
            />
            <Accordion
              items={topFaqs}
              name="jet-landing-faq"
              className="mt-6 border-t border-border"
            />
          </div>

          <EnquiryPanel
            vertical="jet"
            title="Request a charter quote"
            intro="Tell us the leg and who is travelling. An agent gets back to you with the operator, the aircraft and the all-in price. Nothing is held and nothing is charged."
            disclaimer="We are a charter broker, not an air carrier. Every flight is operated by a licensed operator under its own air carrier certificate, and that operator's conditions of carriage govern the flight."
            aircraftCategories={aircraftCategories.map((category) => ({
              slug: category.slug,
              name: category.name,
              seats: category.seats,
            }))}
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Deals" title="Private jet deals" />
        <div className="mt-10">
          <DealCategoryGrid
            variant="compact"
            featured={["private-jet-deals", "group-deals", "existing-customer-deals", "double-deals"]}
          />
        </div>
      </Section>

      <Section>
        <CustomerReviews vertical="jet" />
      </Section>
    </>
  );
}
