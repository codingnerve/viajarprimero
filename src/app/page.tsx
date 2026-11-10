import Image from "next/image";
import Link from "next/link";

import { DestinationCard } from "@/features/destinations/components/destination-card";
import { DestinationsRail } from "@/features/destinations/components/destinations-rail";
import { NewsletterSignup } from "@/features/newsletter/components/newsletter-signup";
import { EnquiryQuickForm } from "@/features/enquiries/components/enquiry-quick-form";
import { HotelSearchForm } from "@/features/hotels/components/hotel-search-form";
import { FlightSearchForm } from "@/features/search/components/flight-search-form";
import { EarlyBirdModal } from "@/components/layout/early-bird-modal";
import { Section } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { type HeroSlide } from "@/components/ui/hero-carousel";
import { HeroVideo } from "@/components/ui/hero-video";
import {
  ClockIcon,
  HeadsetIcon,
  ReceiptIcon,
  ShieldIcon,
  StarIcon,
  SuitcaseIcon,
  TagIcon,
  verticalIcons,
} from "@/components/ui/icons";
import { AccountButton } from "@/components/layout/account-dialog";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { LatestArticles } from "@/components/content/latest-articles";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
import { JetSearchForm } from "@/features/private-jets/components/jet-search-form";
import { PrivateAviationBand } from "@/features/private-jets/components/private-aviation-band";
import { airports } from "@/lib/content/airports";
import { popularPlaces } from "@/lib/providers/liteapi";
import { getResolvedDestinations } from "@/lib/content/destinations";
import { jetHubs } from "@/lib/content/private-jets";
import { getPhoto, publicFileExists } from "@/lib/content/images";
import { faqs } from "@/lib/content/faqs";
import { activePromotion } from "@/lib/config/promotions";
import { contactConfig, siteConfig, verticalCatalogue } from "@/lib/config/site";
import type { EnquiryVertical } from "@/features/enquiries/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
  languages: { en: "/", es: "/es", "x-default": "/" },
});

/**
 * The nav key for a vertical, mapped to the enquiry vertical behind it.
 *
 * A nested ternary covered four cases and silently fell through to "cruise"
 * for anything it did not recognise — so adding private jets sent the jet tab
 * to the cruise form rather than failing. A total map cannot do that: adding a
 * sixth vertical to `verticalCatalogue` now breaks the build here until
 * somebody says which funnel it belongs to.
 */
const QUICK_FORM_VERTICAL: Record<
  Exclude<(typeof verticalCatalogue)[number]["key"], "flights">,
  EnquiryVertical
> = {
  hotels: "stay",
  cars: "car",
  cruises: "cruise",
  privateJets: "jet",
};

/**
 * The headline counts the verticals in words, and a numeral in a display-size
 * headline reads as a price. Covers the plausible range; anything outside it
 * falls back to the numeral rather than inventing a word.
 */
const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
] as const;

const VERTICAL_COUNT_WORD =
  NUMBER_WORDS[verticalCatalogue.length] ?? String(verticalCatalogue.length);

/** The five questions that matter before a first booking; /faq has the rest. */
const homeFaqs = faqs.slice(0, 5);

/**
 * The three claims under the search panel.
 *
 * Each one is a statement about our own conduct that the linked page spells
 * out in full — not a superlative, not a number we cannot substantiate, and
 * emphatically not "best price guaranteed". Anything added here has to survive
 * the same test.
 */
const proofPoints = [
  {
    icon: ReceiptIcon,
    title: "Itemised before you pay",
    body: "Supplier charge, taxes, our fee — as separate lines.",
  },
  {
    icon: ShieldIcon,
    title: "Rules up front",
    body: "Fare conditions and cancellation deadlines with the price.",
  },
  {
    icon: HeadsetIcon,
    title: `Real agents, ${contactConfig.supportHours}`,
    body: "Call any time and a person picks up.",
  },
];

/** "What we book" cards, in the header's order, plus vacation packages. */
const SERVICE_ORDER = ["flights", "privateJets", "cruises", "hotels", "cars"] as const;

/**
 * The illustrated cut-outs behind the "What we book" cards.
 *
 * These are photographic rather than line icons, so they are transparent PNGs
 * shown on the card surface directly — a soft tile behind them would read as a
 * second background box around an image that already has its own depth.
 */
const SERVICE_ART: Record<(typeof SERVICE_ORDER)[number], string> = {
  flights: "/images/services/flights.png",
  privateJets: "/images/services/private-jets.png",
  cruises: "/images/services/cruise-badge.png",
  hotels: "/images/services/hotels.png",
  cars: "/images/services/car-rental.png",
};

const services = [
  ...SERVICE_ORDER.flatMap((key) =>
    verticalCatalogue
      .filter((vertical) => vertical.key === key)
      .map((vertical) => ({
        href: vertical.href,
        label: vertical.label,
        blurb: vertical.blurb,
        art: SERVICE_ART[key],
      })),
  ),
  {
    href: "/vacations",
    label: "Vacation packages",
    blurb: "Flights, hotel and extras planned as one trip.",
    art: "/images/services/vacations.png",
  },
];

const featuredDeals = [
  "last-minute-flight-deals",
  "coupon-deals",
  "flight-hotel-deals",
  "cruise-deals",
  "family-deals",
  "honeymoon-deals",
  "group-deals",
  "double-deals",
] as const;

const aboutPoints = [
  {
    icon: HeadsetIcon,
    title: "Real agents",
    body: `Available ${contactConfig.supportHours}, on the phone and in chat.`,
  },
  {
    icon: ReceiptIcon,
    title: "Full price first",
    body: "Taxes and fees included before you pay.",
  },
  {
    icon: ShieldIcon,
    title: "Rules explained",
    body: "Baggage, changes and cancellations up front.",
  },
  {
    icon: SuitcaseIcon,
    title: "Every kind of trip",
    body: "From a single flight to a whole holiday.",
  },
];

const memberBenefits = [
  { icon: TagIcon, title: "Exclusive fares & deals" },
  { icon: StarIcon, title: "Members only offers" },
  { icon: ClockIcon, title: "Early bird access" },
  { icon: ReceiptIcon, title: "Manage your bookings" },
];

/**
 * Home page.
 *
 * The hero gives all four verticals the same entry point rather than a flight
 * search with the other three demoted to links underneath it. Flights are the
 * only vertical with live results behind them, so its tab is a search and the
 * rest start a written quote — but each one starts here, in the same panel,
 * with the same three questions.
 *
 * After the hero the page argues rather than lists: where we go, what we book,
 * then one vertical done properly — car rental, where the gap between the quoted
 * rate and the final bill is widest and an agent is therefore worth the most —
 * then deals, about us, reviews, the blog and sign up.
 */
export default async function HomePage() {
  const destinations = getResolvedDestinations();

  /* Resolved once on the server and handed to the hotel tab's combobox. */
  const popularStays = await popularPlaces();

  /*
    The offer is resolved on the server, so an expired or disabled promotion
    never reaches the browser as markup at all — nothing to hide with CSS and
    nothing in the DOM for a scraper to find. The modal re-checks the expiry
    on the client too, because this page is prerendered and the build could
    predate the end date. See lib/config/promotions.
  */
  const promotion = activePromotion();

  /**
   * Hero backdrop slides.
   *
   * Resolved here rather than inside the carousel because looking a photograph
   * up touches the filesystem, and the carousel is a client component. Five is
   * the ceiling: at 6.5 seconds a slide, more than five means the last one is
   * first seen half a minute in, by which time nobody is still watching the
   * hero.
   *
   * A slide with no photograph yet renders the brand plate, so the carousel
   * works from an empty `public/images/` directory and fills in on its own as
   * pictures are added.
   */
  const heroSlides: HeroSlide[] = destinations.slice(0, 5).map((destination) => ({
    id: destination.slug,
    /*
      Three sources, in order of specificity: the path set on the destination
      itself, then a file named after the slug in the hero collection, then one
      in the destinations collection.

      The explicit path is checked before it is used. `next/image` throws on a
      src it cannot parse — a relative path, or the `@/images/...` alias, which
      is a build-time TypeScript mapping rather than a URL — and because this
      is a Server Component that throw is a 500 on the home page rather than
      one missing picture. A path that does not resolve to a real file under
      `public/` is dropped here so the carousel falls through to the gradient
      plate instead.

      `HeroSlide.src` is `string | null` while `Destination.src` is
      `string | undefined`, so the chain ending in `getPhoto` is also what
      narrows undefined to null.
    */
    src:
      (destination.src && publicFileExists(destination.src)
        ? destination.src
        : null) ??
      getPhoto("hero", destination.slug) ??
      getPhoto("destinations", destination.slug),
    alt: `${destination.city}, ${destination.country}`,
    caption: destination.city,
    detail: destination.country,
  }));

  return (
    <>
      <JsonLd schema={faqSchema(homeFaqs.map(({ question, answer }) => ({ question, answer })))} />

      {promotion && <EarlyBirdModal promotion={promotion} />}

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      {/*
        The backdrop is a slow crossfade through the cities we actually write
        guides for, so the picture behind the search panel is a claim the site
        can stand behind rather than generic stock scenery. Until a photograph
        exists for a slug it draws the brand plate instead — same frame, same
        motion, nothing to swap out later.

        `pb-24` leaves the bottom of the band clear for the carousel's own
        caption and controls, which sit along that edge.
      */}
      <Section
        tone="brand"
        size="lg"
        /*
          z-20, and deliberately NOT overflow-hidden.

          The carousel clips itself (see its own root), so the band never
          needed to clip as well — and clipping here cut the destination
          combobox off at the bottom of the hero.

          The z-index is the other half. Every Section is `isolate`, so each
          band is its own stacking context and they paint in document order;
          without this the section below would paint straight over a dropdown
          hanging out of this one, whatever z-index the dropdown carried.

          Full screen: globals.css pulls every page's first band up under the
          header's transparent strip, so the photograph starts at the top of
          the viewport. `svh` rather than `vh` so mobile browser chrome does
          not push the search panel below the fold.
        */
        className="z-20 flex min-h-svh flex-col justify-center"
        containerClassName="pb-24 md:pb-28"
        backdrop={
          <HeroVideo src="/videos/hero.mp4" poster={heroSlides[0]?.src ?? null} />
        }
      >
        {/*
          Centred rather than ranged left. The search card below is the widest
          element on the band and it is symmetrical; a left-aligned headline
          above it left the composition sitting off its own axis.
        */}
        <div className="mx-auto max-w-3xl text-center">
          {/*
            The headline counts the verticals, so it is derived from
            `verticalCatalogue` rather than typed out. Switching a vertical off
            in lib/config/site used to leave the hero claiming four of them;
            now it cannot.
          */}
          <h1 className="animate-rise text-balance text-display-lg text-text-inverse [animation-delay:80ms] motion-reduce:animate-none">
            {VERTICAL_COUNT_WORD} ways to travel.
            <br className="hidden sm:block" />{" "}
            <span className="text-gray-300">One honest price.</span>
          </h1>
          <p className="animate-rise measure mx-auto mt-5 text-body-lg text-balance text-text-on-dark [animation-delay:160ms] motion-reduce:animate-none">
            Search flights, hotels and private jets, or call and a real agent
            books any trip with you — the full price explained, nothing charged
            until you say yes.
          </p>

          {/*
            The three claims, promoted out from under the search panel to sit
            directly beneath the headline as a single strip.

            They are the same three statements about our own conduct as before,
            each still spelled out in full on the page it links to — only the
            supporting sentence is dropped, because at this size it would be
            three lines of small print between the headline and the control the
            hero exists to present. Carrying them as a strip rather than as a
            three-column block is what lets the search card own the lower half
            of the band.
          */}
          <ul className="animate-rise mt-7 flex flex-wrap items-center justify-center gap-y-2 [animation-delay:240ms] motion-reduce:animate-none">
            {proofPoints.map(({ icon: ProofIcon, title }, index) => (
              <li key={title} className="flex items-center">
                {/*
                  The rule belongs to the item after it, so it only ever
                  appears between two claims — never trailing the last one on a
                  row that has wrapped.
                */}
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-3 hidden h-4 w-px bg-white/25 sm:block sm:mx-4"
                  />
                )}
                <span className="flex items-center gap-2 px-2 sm:px-0">
                  <ProofIcon className="size-4.5 shrink-0 text-gray-300" />
                  <span className="text-body-sm font-semibold text-text-inverse">
                    {title}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/*
          One card holding both the vertical strip and the panel it switches,
          rather than a strip floating on the navy above a separate white
          panel. Two surfaces read as two controls; one reads as the booking
          engine, which is what it is — and it is the single thing on this
          screen a traveller is meant to aim at.

          The card stays inside the band rather than overhanging its bottom
          edge: the carousel draws its caption and slide controls along that
          edge, and a card overlapping them would cover both.
        */}
        <div className="animate-rise mx-auto mt-10 max-w-5xl rounded-xs bg-surface p-2 shadow-panel [animation-delay:320ms] motion-reduce:animate-none md:mt-12 md:p-3">
          <Tabs
            tone="light"
            shape="panel"
            label="What are you booking?"
            panelClassName="pt-3 md:pt-4"
            items={verticalCatalogue.map((vertical) => {
              const VerticalIcon = verticalIcons[vertical.key];

              return {
                id: vertical.key,
                label: vertical.label,
                icon: <VerticalIcon />,
                /*
                  Three kinds of panel, because the three verticals behave
                  differently at this point in the funnel.

                  Flights, hotels and private jets all have live inventory
                  behind them, so those tabs run a real search and land on
                  results. Car rental and cruises have no live feed, so they open
                  a written quote — and the copy under those panels says so.

                  The jet panel asks for one date rather than two. Charter is
                  priced a leg at a time, and a return field would imply a
                  product that does not exist at the price shown.

                  Hotels used to use the quote form here. It looked identical
                  to a search, but it seeded an enquiry and dropped the
                  traveller on a landing page carrying another form: you
                  searched, and arrived somewhere to search again.
                */
                panel:
                  vertical.key === "flights" ? (
                    <FlightSearchForm airports={airports} tone="bare" />
                  ) : vertical.key === "hotels" ? (
                    <HotelSearchForm tone="bare" popular={popularStays} />
                  ) : vertical.key === "privateJets" ? (
                    <JetSearchForm tone="bare" hubs={jetHubs} />
                  ) : (
                    <EnquiryQuickForm
                      vertical={QUICK_FORM_VERTICAL[vertical.key]}
                      tone="bare"
                    />
                  ),
              };
            })}
          />
        </div>
      </Section>

      {/* ── What we book ───────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="What we book"
          title="Every kind of trip, one agency"
          description="Search online or call — a real agent books it with you."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ href, label, blurb, art }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full items-start gap-4 rounded-xs bg-surface p-6 shadow-sm ring-1 ring-inset ring-border transition-shadow hover:shadow-md focus-ring"
              >
                <Image
                  src={art}
                  alt=""
                  width={128}
                  height={128}
                  className="size-14 shrink-0 object-contain"
                />
                <span>
                  <span className="block text-h4 text-text group-hover:text-primary">
                    {label}
                  </span>
                  <span className="mt-1 block text-body-sm text-text-secondary">
                    {blurb}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Deals ──────────────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Deals"
          title="Deals for every traveller"
          description="Flights, hotels, cruises and more — plus deals for couples, families, groups and existing customers."
        />
        <div className="mt-10">
          <DealCategoryGrid variant="compact" featured={featuredDeals} />
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/deals" variant="outline">
            See all deals
          </ButtonLink>
        </div>
      </Section>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <Section
        backdrop={
          <>
            {/*
              A photograph at low opacity rather than a flat band. It has to
              stay a texture, not a picture: at 10% it reads as tone behind the
              copy and the cards keep their contrast.
            */}
            <Image
              src="/images/home/why-us-road.jpg"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="pointer-events-none object-cover opacity-10"
            />
            {/* Fades the photo out at the top and bottom edges so the band
                does not end on a hard horizontal line. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"
            />
          </>
        }
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="start"
              eyebrow="About us"
              title={`Why travellers book with ${siteConfig.name}`}
              description="We are a travel agency with real agents on the phone day and night. Tell us the trip — we find the options, explain the full price and book it with you."
            />
            <ButtonLink href="/about" variant="outline" className="mt-8">
              More about us
            </ButtonLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {aboutPoints.map(({ icon: PointIcon, title, body }) => (
              <li
                key={title}
                className="rounded-xs bg-surface p-5 ring-1 ring-inset ring-border"
              >
                <PointIcon className="size-6 text-primary" />
                <p className="mt-3 text-h6 text-text">{title}</p>
                <p className="mt-1 text-body-sm text-text-secondary">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Destinations ───────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Where we go"
          description="Short, practical guides to what changes how you plan — not a list of attractions you could find anywhere."
        />

        {/*
          A rail rather than a grid. Eight destination cards stacked four rows
          deep on a phone is a wall the reader scrolls past; a rail keeps the
          section one screen tall at every width. Three cards to a view on
          desktop, paged with the chevrons — exactly three to a view, no
          partial card peeking in.
        */}
        <DestinationsRail itemCount={destinations.length}>
          {destinations.map((destination) => (
            <li
              key={destination.slug}
              className="w-[16rem] sm:w-[18rem] md:w-[calc((100%-2rem)/3)]"
            >
              <DestinationCard destination={destination} />
            </li>
          ))}
        </DestinationsRail>
      </Section>

      {/* ── Private aviation ───────────────────────────────────────────── */}
      <PrivateAviationBand />

      {/* ── The blog ───────────────────────────────────────────────────── */}
      {/*
        The way into the writing. It had none from here — the blog was in the
        footer and the site map only, and the header carries five items by
        design (see secondaryNav), so this is the door.

        Placed before the FAQ.
      */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Blog"
          description="Fare buckets, connection rules, what a rental excess really is. Explanations rather than promises — nothing here tells you to book on a Tuesday."
        />
        <div className="mt-10">
          <LatestArticles />
        </div>
      </Section>

      {/* ── Sign up ────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid items-center gap-8 rounded-xs bg-brand-wash p-8 md:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <h2 className="text-h2 text-text-inverse">Sign up and earn rewards</h2>
            <p className="mt-3 text-body-lg text-text-on-dark">
              Create a free account for member offers and one place to manage
              your trips.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {memberBenefits.map(({ icon: BenefitIcon, title }) => (
                <li
                  key={title}
                  className="flex items-center gap-2.5 text-body-sm font-semibold text-text-inverse"
                >
                  <BenefitIcon className="size-5 shrink-0" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
          <AccountButton variant="cta" initialMode="sign-up">
            Sign up free
          </AccountButton>
        </div>
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="FAQ"
          description="What we book, what we charge, and what happens if plans change. Straight answers before you commit."
        />
        <Accordion items={homeFaqs} name="home-faq" className="mx-auto mt-10 max-w-3xl border-t border-border" />
      </Section>

      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      {/*
        Closes on the same navy the page opened with, so the whole thing reads
        as one bounded piece rather than trailing off into a grey box.
      */}
      <Section tone="brand" size="sm">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="measure-tight">
            <h2 className="text-h2 text-text-inverse">
              Travel news, occasionally
            </h2>
            <p className="mt-3 text-body-lg text-text-on-dark">
              New routes and sailings, seasonal changes in the places we cover,
              and offers when they are genuinely worth your attention.
            </p>
          </div>
          <NewsletterSignup tone="inverse" />
        </div>
      </Section>
    </>
  );
}
