import { EarlyBirdModal } from "@/components/layout/early-bird-modal";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import {
  AboutBlock,
  ContentBand,
  FaqSplit,
  HomeHero,
  HowItWorks,
  ServicesBento,
  SignUpBand,
  TrustBar,
} from "@/components/content/home-sections";
import { LatestArticles } from "@/components/content/latest-articles";
import { Section } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
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
import { DestinationCard } from "@/features/destinations/components/destination-card";
import { DestinationsRail } from "@/features/destinations/components/destinations-rail";
import { EnquiryQuickForm } from "@/features/enquiries/components/enquiry-quick-form";
import type { EnquiryVertical } from "@/features/enquiries/types";
import { HotelSearchForm } from "@/features/hotels/components/hotel-search-form";
import { NewsletterSignup } from "@/features/newsletter/components/newsletter-signup";
import { JetSearchForm } from "@/features/private-jets/components/jet-search-form";
import { PrivateAviationBand } from "@/features/private-jets/components/private-aviation-band";
import { FlightSearchForm } from "@/features/search/components/flight-search-form";
import { activePromotion } from "@/lib/config/promotions";
import { contactConfig, siteConfig, verticalCatalogue } from "@/lib/config/site";
import { airports } from "@/lib/content/airports";
import { getResolvedDestinations } from "@/lib/content/destinations";
import { faqs } from "@/lib/content/faqs";
import { getPhoto, publicFileExists } from "@/lib/content/images";
import { jetHubs } from "@/lib/content/private-jets";
import { popularPlaces } from "@/lib/providers/liteapi";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
  languages: { en: "/", es: "/es", "x-default": "/" },
});

/**
 * The enquiry funnel behind each quote-only search tab. A total map, so a new
 * vertical in `verticalCatalogue` breaks the build here until somebody says
 * which funnel it belongs to — a nested ternary would have silently sent it to
 * the cruise form.
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
 * The headline counts the verticals in words, because a numeral in a
 * display-size headline reads as a price.
 */
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"] as const;
const VERTICAL_COUNT_WORD =
  NUMBER_WORDS[verticalCatalogue.length] ?? String(verticalCatalogue.length);

/** The five questions that matter before a first booking; /faq has the rest. */
const homeFaqs = faqs.slice(0, 5);

/**
 * The three claims under the headline. Each is a statement about our own
 * conduct that the linked page spells out in full — never a superlative.
 */
const proofPoints = [
  { icon: ReceiptIcon, label: "Itemised before you pay" },
  { icon: ShieldIcon, label: "Rules up front" },
  { icon: HeadsetIcon, label: `Real agents, ${contactConfig.supportHours}` },
];

const SERVICE_ORDER = ["flights", "privateJets", "cruises", "hotels", "cars"] as const;

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
        featured: key === "flights",
      })),
  ),
  {
    href: "/vacations",
    label: "Vacation packages",
    blurb: "Flights, hotel and extras planned as one trip.",
    art: "/images/services/vacations.png",
    featured: true,
  },
];

const steps = [
  {
    title: "Tell us the trip",
    body: "Call, chat or send a request with the route, the dates and who is travelling.",
  },
  {
    title: "We find and price the options",
    body: "An agent checks the suppliers and comes back with the full price: fare, taxes and our fee as separate lines.",
  },
  {
    title: "You decide",
    body: "Nothing is charged until you say yes, and the rules for your fare are explained first.",
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
 * The hero gives every vertical the same entry point: flights, hotels and
 * private jets run a real search, car rental and cruises open a written quote,
 * and all of them start in the same panel. After it the page explains the
 * process, then the services, deals, why people book with us, where we go,
 * private aviation, the blog, sign-up, the FAQ and the newsletter.
 */
export default async function HomePage() {
  const destinations = getResolvedDestinations();
  const popularStays = await popularPlaces();

  // Resolved on the server so an expired promotion never reaches the browser;
  // the modal re-checks the expiry on the client because this page is
  // prerendered. See lib/config/promotions.
  const promotion = activePromotion();

  // First frame of the hero while the clip loads. An explicit path is checked
  // before it is used: `next/image` throws on a src it cannot parse, and in a
  // Server Component that is a 500 rather than one missing picture.
  const first = destinations[0];
  const poster =
    (first?.src && publicFileExists(first.src) ? first.src : null) ??
    (first
      ? (getPhoto("hero", first.slug) ?? getPhoto("destinations", first.slug))
      : null);

  const heroSlides = destinations
    .map((d) => ({
      id: d.slug,
      src: getPhoto("hero", d.slug) ?? getPhoto("destinations", d.slug),
      alt: `${d.city}, ${d.country}`,
      caption: d.city,
      detail: d.country,
    }))
    .filter((s): s is { id: string; src: string; alt: string; caption: string; detail: string } => Boolean(s.src));

  return (
    <>
      <JsonLd
        schema={faqSchema(homeFaqs.map(({ question, answer }) => ({ question, answer })))}
      />

      {promotion && <EarlyBirdModal promotion={promotion} />}

      <HomeHero
        title={`${VERTICAL_COUNT_WORD} ways to travel.`}
        accent="One honest price."
        intro="Search flights, hotels and private jets, or call and a real agent books any trip with you — the full price explained, nothing charged until you say yes."
        proof={proofPoints}
        tabsLabel="What are you booking?"
        poster={poster}
        slides={heroSlides}
        tabs={verticalCatalogue.map((vertical) => {
          const VerticalIcon = verticalIcons[vertical.key];

          return {
            id: vertical.key,
            label: vertical.label,
            icon: <VerticalIcon />,
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

      <TrustBar points={aboutPoints} />

      <ServicesBento
        eyebrow="What we book"
        title="Every kind of trip, one agency"
        description="Search online or call — a real agent books it with you."
        items={services}
      />

      <HowItWorks
        eyebrow="How it works"
        title="From first call to confirmed booking"
        steps={steps}
        linkHref="/how-it-works"
        linkLabel="See how it works"
      />

      <Section tone="muted">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-overline uppercase text-primary">Deals</p>
            <h2 className="mt-3 text-balance text-h2 text-text">Deals for every traveller</h2>
            <p className="mt-3 text-body-lg text-text-secondary">
              Flights, hotels, cruises and more — plus deals for couples, families, groups and
              existing customers.
            </p>
          </div>
          <ButtonLink href="/deals" variant="outline" className="shrink-0">
            See all deals
          </ButtonLink>
        </div>
        <div className="mt-10">
          <DealCategoryGrid variant="compact" featured={featuredDeals} />
        </div>
      </Section>

      <AboutBlock
        eyebrow="About us"
        title={`Why travellers book with ${siteConfig.name}`}
        description="We are a travel agency with real agents on the phone day and night. Tell us the trip — we find the options, explain the full price and book it with you."
        linkLabel="More about us"
        badge={proofPoints[2].label}
      />

      <ContentBand
        tone="muted"
        eyebrow="Where we go"
        title="Destination guides"
        description="Short, practical guides to what changes how you plan — not a list of attractions you could find anywhere."
      >
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
      </ContentBand>

      <PrivateAviationBand />

      <ContentBand
        tone="muted"
        eyebrow="Blog"
        title="From the travel blog"
        description="Fare buckets, connection rules, what a rental excess really is. Explanations rather than promises — nothing here tells you to book on a Tuesday."
      >
        <LatestArticles />
      </ContentBand>

      <SignUpBand
        title="Sign up and earn rewards"
        body="Create a free account for member offers and one place to manage your trips."
        benefits={memberBenefits}
        button="Sign up free"
      />

      <FaqSplit
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="What we book, what we charge, and what happens if plans change. Straight answers before you commit."
        items={homeFaqs}
        name="home-faq"
      />

      <Section tone="brand" size="sm">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="measure-tight">
            <h2 className="text-h2 text-text-inverse">Travel news, occasionally</h2>
            <p className="mt-3 text-body-lg text-text-on-dark">
              New routes and sailings, seasonal changes in the places we cover, and offers when
              they are genuinely worth your attention.
            </p>
          </div>
          <NewsletterSignup tone="inverse" />
        </div>
      </Section>
    </>
  );
}
