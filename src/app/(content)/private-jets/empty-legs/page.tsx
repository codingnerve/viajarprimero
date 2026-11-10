import Link from "next/link";

import { Prose } from "@/components/content/prose";
import { CallToBookPanel } from "@/components/layout/call-to-book-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { DefinitionList } from "@/components/ui/definition-list";
import { CalendarIcon, MapPinIcon, PlaneIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { JetFlightCard } from "@/features/private-jets/components/jet-flight-card";
import { JetPriceNote } from "@/features/private-jets/components/jet-price-note";
import { JetSearchForm } from "@/features/private-jets/components/jet-search-form";
import { WorldLandDefs } from "@/features/private-jets/components/world-land-defs";
import { jetEnquiryHref } from "@/features/private-jets/lib/jet-enquiry-link";
import { jetSearchHref } from "@/features/private-jets/lib/jet-search-params";
import { bookingConfig } from "@/lib/config/booking";
import { siteConfig } from "@/lib/config/site";
import { jetHubs } from "@/lib/content/private-jets";
import { searchJetFlights } from "@/lib/providers/skyaccess";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";
import type { JetFlight } from "@/types/private-jet";

/**
 * Empty legs — the private-aviation landing page.
 *
 * This is the page built to rank; `/private-jets/search` is the funnel it
 * feeds, and that one is noindexed because a results page is not stable
 * content. So the editorial below the fold is not filler: it is the reason
 * this URL deserves to exist separately from the search it launches.
 *
 * It used to be noindexed too, because `emptyLegs` in lib/content was an empty
 * array and we would not ship a page that ranks for "empty leg flights" and
 * then shows a traveller nothing. It now has a live marketplace behind it, so
 * the page carries real availability — and the honesty constraint that
 * motivated the noindex is still the thing shaping every decision here:
 *
 * - Legs are shown with their departure *window*, not a departure time.
 * - Prices are labelled as estimates, and `JetPriceNote` says so in terms.
 * - When the supplier is unreachable, the page says the supplier is
 *   unreachable — it does not fall back to a stale list, and it never
 *   fabricates one.
 *
 * The sample shown is a genuine query — everything leaving the New York area
 * airports over the next fortnight — rather than a curated list, so what is on
 * the page is what is actually for sale on the day it is read.
 */

const SAMPLE_ORIGIN = "New York, NY, United States";
const SAMPLE_WINDOW_DAYS = 14;
const SAMPLE_COUNT = 6;

const howTheyWork = [
  {
    term: "Why they exist",
    detail:
      "An aircraft has to be somewhere. After dropping passengers it either waits or flies on to its next job, and either way that repositioning flight is happening. Selling it at a discount is better for the operator than flying it empty.",
  },
  {
    term: "What you actually save",
    detail:
      "Discounts are genuine and can be substantial, but they are against that specific leg on that specific day — not against a quote for the trip you wanted. Comparing an empty leg to a charter on your own dates is comparing two different products.",
  },
  {
    term: "What you give up",
    detail:
      "The route, the date and the departure time are the operator's, not yours. They can move when the originating charter moves, and they can vanish entirely if that charter cancels or the operator sells the leg first.",
  },
  {
    term: "Who they suit",
    detail:
      "Travellers whose plans genuinely bend around the aircraft. If you need to be somewhere on a particular day, an empty leg is not the product — a quoted charter is.",
  },
];

const faqs = [
  {
    question: "How much cheaper is an empty leg?",
    answer:
      "Typically a substantial fraction of a full charter on the same aircraft, but the saving is against that leg on that day, not against the trip you originally wanted. An operator repositioning an empty aircraft would rather recover part of the cost than none of it, which is where the discount comes from.",
  },
  {
    question: "Can an empty leg be cancelled?",
    answer:
      "Yes. An empty leg exists because of an originating charter, so if that charter moves or cancels, the repositioning flight moves or disappears with it. This is the central trade-off of the product and no broker can remove it. We tell you immediately if a leg you have asked about is withdrawn.",
  },
  {
    question: "Is the departure time fixed?",
    answer:
      "Usually not. Most legs carry a departure window rather than a slot, and the exact time is agreed with the operator once the flight is confirmed. Any listing showing a precise departure time for an unsold empty leg is showing you the start of the window.",
  },
  {
    question: "Can I change the route or add a stop?",
    answer:
      "No. The aircraft is going where the operator needs it to go — that is what makes it cheap. If you need a different routing, you need a charter quote, which we are happy to price.",
  },
  {
    question: "Is an empty-leg price final?",
    answer:
      "It is an estimate. Charter pricing moves with the aircraft finally assigned, the routing, crew duty limits, and the landing and handling fees at the specific airports involved. We confirm the final figure with the operator before you commit to anything.",
  },
  {
    question: "Who actually operates the flight?",
    answer:
      "A licensed air carrier, not us. We are a travel agency: we source the aircraft and handle the booking, and the operator's own conditions of carriage govern the flight. We will tell you who the operator is and what safety audits they hold before you book.",
  },
];

export const metadata = buildMetadata({
  title: "Empty leg flights",
  description:
    "Empty leg flights explained — aircraft repositioning without passengers, sold at a discount. How to find one on your route, and what the trade-off actually is.",
  path: "/private-jets/empty-legs",
});

const hubs = jetHubs.map((hub) => ({
  query: hub.query,
  label: hub.label,
  detail: hub.detail,
}));

function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export default async function EmptyLegsPage() {
  const departOn = isoDaysFromNow(1);
  const departUntil = isoDaysFromNow(SAMPLE_WINDOW_DAYS);

  // While bookings are taken by phone the marketplace is not called at all.
  const result = bookingConfig.callToBook
    ? null
    : await searchJetFlights(
        {
          origin: SAMPLE_ORIGIN,
          destination: "",
          departOn,
          departUntil,
          passengers: 4,
        },
        { pageSize: SAMPLE_COUNT },
      );

  const legs: readonly JetFlight[] =
    result?.flights.slice(0, SAMPLE_COUNT) ?? [];

  const searchAllHref = jetSearchHref({
    origin: SAMPLE_ORIGIN,
    destination: "",
    departOn,
    passengers: 4,
    flexible: true,
  });

  return (
    <>
      {/*
        FAQPage schema, so these answers can win the question boxes this page
        competes for. Every answer here is visible on the page in the same
        words — marking up copy a visitor cannot see is a manual action
        waiting to happen.
      */}
      <JsonLd
        schema={faqSchema(
          faqs.map(({ question, answer }) => ({ question, answer })),
        )}
      />

      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Empty legs", path: "/private-jets/empty-legs" },
        ]}
        eyebrow="Repositioning flights"
        title="Empty leg flights"
        intro="An aircraft flying to collect a charter, or flying home after one, with no passengers on board. Because the flight is happening anyway, operators sell it at a discount — and because it belongs to their schedule rather than yours, it comes with a real trade-off."
      />

      {/* ── Search ───────────────────────────────────────────────────────── */}
      {/* z-20 so the destination picklists hang over the band below rather
          than being painted over by it — Section sets `isolate`. */}
      <Section size="sm" tone="muted" bordered className="z-20">
        <SectionHeading
          eyebrow={bookingConfig.callToBook ? "Your route" : "Live availability"}
          title="Find an empty leg on your route"
          description="Leave the destination blank to see everything leaving a city — most people who fly this way are chasing the aircraft rather than a particular arrival airport."
        />
        <JetSearchForm
          className="mt-8"
          tone="flat"
          hubs={hubs}
          initial={{ origin: SAMPLE_ORIGIN, departOn, passengers: 4, flexible: true }}
        />
      </Section>

      {/* ── A genuine sample ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow={result ? `Next ${SAMPLE_WINDOW_DAYS} days` : "Book by phone"}
          title={result ? "Leaving New York shortly" : "Ask an agent about empty legs"}
          description={
            result
              ? "A live query, not a curated list — these are the next departures a charter marketplace is publishing out of the New York area airports. Search above for any other city."
              : "Empty legs are not listed or sold online. They appear and sell within hours, so an agent checks what operators have published for your route on the day."
          }
        />

        {!result ? (
          <div className="mt-8">
            <CallToBookPanel
              title="Find an empty leg with a charter agent"
              intro="Call and an agent will check the repositioning flights operators have published for your route and dates, confirm the price with the operator, and book it with you on the phone."
              facts={[
                {
                  icon: MapPinIcon,
                  label: "Route",
                  value: "Any route — an open destination finds the most legs",
                },
                {
                  icon: CalendarIcon,
                  label: "Dates",
                  value: "Flexible dates find the most legs",
                },
                {
                  icon: PlaneIcon,
                  label: "Pricing",
                  value: "Priced for the whole aircraft, not per seat",
                },
              ]}
              quoteHref="/private-jets/request-a-quote"
              disclaimer={`${siteConfig.name} is a charter broker, not an air carrier. Every flight is operated by a licensed operator under its own air carrier certificate.`}
            />
          </div>
        ) : result.error ? (
          <Alert
            tone="warning"
            title="We cannot reach the charter marketplace right now"
            className="measure-wide mt-8"
          >
            <p>{result.error}</p>
            <p className="mt-2">
              We would rather show you nothing than a list of flights we cannot
              confirm are still available. Tell us your route and we will price
              it by hand instead.
            </p>
          </Alert>
        ) : legs.length === 0 ? (
          <Alert
            tone="info"
            title="Nothing published out of New York today"
            className="measure-wide mt-8"
          >
            <p>
              No operator has published a repositioning flight from the New York
              area in the next {SAMPLE_WINDOW_DAYS} days. That is ordinary —
              empty legs appear and sell within hours. Search your own route
              above, or register it and we will tell you when one matches.
            </p>
          </Alert>
        ) : (
          <>
            {/* The basemap geometry, once for every route panel below. */}
            <WorldLandDefs />

            <ul className="mt-10 space-y-5">
              {legs.map((flight) => (
                <li key={flight.id}>
                  <JetFlightCard flight={flight} href={jetEnquiryHref(flight)} />
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={searchAllHref}>
                See everything leaving New York
              </ButtonLink>
              <ButtonLink href="/private-jets/request-a-quote" variant="outline">
                Register a different route
              </ButtonLink>
            </div>
          </>
        )}

        {result && <JetPriceNote variant="panel" className="mt-10" />}
      </Section>

      {/* ── What they are ────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div className="min-w-0">
            <Prose>
              <h2>Why most empty-leg pages are lying to you</h2>
              <p>
                Most of them are permanently full, and that is the tell. A
                genuine empty leg exists for hours or days: it appears when an
                operator confirms a charter, and it disappears when somebody
                buys it or the originating trip moves. A page showing forty of
                them on a Tuesday afternoon is not showing you availability, it
                is showing you a list built to generate a phone call.
              </p>
              <p>
                When you ring about one of those, it has usually just gone — and
                the conversation moves smoothly on to a full-price charter.{" "}
                {result
                  ? "The list above is a live query against a charter marketplace, run when you loaded this page. If it is short, that is because the market is short today."
                  : "We only tell you about a leg an agent has checked with the operator that day. If there is nothing on your route, that is because the market is short, and we will say so."}
              </p>
              <h2>How to actually catch one</h2>
              <p>
                Flexibility is the whole game. Search with the destination blank
                and the date window open, and you will see several times as much
                as a search for one city pair on one named day. If your dates
                are firm, ask for a{" "}
                <Link href="/private-jets/request-a-quote">charter quote</Link>{" "}
                instead — it will cost more than an empty leg and it will
                actually depart when you need it to.
              </p>
              <p>
                It is also worth registering the route you want. Empty legs
                surface with very little notice, so having your requirement on
                file before one appears beats refreshing a page.
              </p>
            </Prose>

            <SectionHeading
              className="mt-16"
              eyebrow="Before you chase one"
              title="How empty legs really work"
            />
            <DefinitionList items={howTheyWork} className="mt-8" />
          </div>

          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border">
              <h2 className="text-h3 text-text">Register your route</h2>
              <p className="mt-2 text-body-sm text-text-secondary">
                Give us the leg and how much your dates can move. We will come
                back when something genuinely matches, rather than adding you to
                a broadcast list.
              </p>
              <div className="mt-5 space-y-3">
                <ButtonLink href="/private-jets/request-a-quote" fullWidth>
                  Register a route
                </ButtonLink>
                <ButtonLink
                  href="/private-jets/charter"
                  variant="outline"
                  fullWidth
                >
                  How charter works
                </ButtonLink>
              </div>
              <p className="mt-5 text-caption text-text-muted">
                Empty legs are operated by licensed air carriers and sold
                subject to the originating charter. They can be withdrawn or
                re-timed at short notice, and we will always tell you when that
                has happened.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="Questions"
          title="What people ask about empty legs"
        />

        <div className="measure-wide mt-10">
          <Accordion
            items={faqs}
            name="empty-leg-faq"
            className="border-t border-border"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={searchAllHref}>Search empty legs</ButtonLink>
          <ButtonLink href="/private-jets/faq" variant="outline">
            More private jet questions
          </ButtonLink>
        </div>
      </Section>

    </>
  );
}
