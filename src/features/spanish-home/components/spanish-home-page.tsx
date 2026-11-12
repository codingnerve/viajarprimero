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
import { contactConfig, siteConfig, verticalCatalogue } from "@/lib/config/site";
import { airports } from "@/lib/content/airports";
import { getResolvedDestinations } from "@/lib/content/destinations";
import {
  esAbout,
  esBlog,
  esDealsSection,
  esDestinations,
  esFaq,
  esHero,
  esHow,
  esNewsletter,
  esNumberWords,
  esServices,
  esSignUp,
  esVerticals,
} from "@/lib/content/es/home";
import { jetHubs } from "@/lib/content/private-jets";
import { popularPlaces } from "@/lib/providers/liteapi";
import { faqSchema } from "@/lib/seo/schema";

/** The enquiry funnel behind each quote-only tab. Total, like the English page. */
const QUICK_FORM_VERTICAL: Record<
  Exclude<(typeof verticalCatalogue)[number]["key"], "flights">,
  EnquiryVertical
> = {
  hotels: "stay",
  cars: "car",
  cruises: "cruise",
  privateJets: "jet",
};

const SERVICE_ORDER = ["flights", "privateJets", "cruises", "hotels", "cars"] as const;

const SERVICE_ART: Record<(typeof SERVICE_ORDER)[number], string> = {
  flights: "/images/services/flights.png",
  privateJets: "/images/services/private-jets.png",
  cruises: "/images/services/cruise-badge.png",
  hotels: "/images/services/hotels.png",
  cars: "/images/services/car-rental.png",
};

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

const aboutIcons = {
  agents: HeadsetIcon,
  price: ReceiptIcon,
  rules: ShieldIcon,
  trips: SuitcaseIcon,
} as const;

/**
 * The Spanish home page, `/es`.
 *
 * Section for section the same page as `/`, built from the same shared
 * sections and written in Spanish rather than run through a translator. Every
 * claim is the claim the English page makes.
 *
 * Links go to the same English pages as the English home page. A visitor who
 * follows one stays in Spanish, because the proxy keeps `/es/...` on the
 * browser-translated version of the page.
 */
export async function SpanishHomePage() {
  const destinations = getResolvedDestinations();
  const popularStays = await popularPlaces();

  const supportHours = contactConfig.supportHours;
  const countWord =
    esNumberWords[verticalCatalogue.length] ?? String(verticalCatalogue.length);

  const services = [
    ...SERVICE_ORDER.flatMap((key) =>
      verticalCatalogue
        .filter((vertical) => vertical.key === key)
        .map((vertical) => ({
          href: vertical.href,
          label: esVerticals[key].label,
          blurb: esVerticals[key].blurb,
          art: SERVICE_ART[key],
          featured: key === "flights",
        })),
    ),
    {
      href: "/vacations",
      label: esServices.vacations.label,
      blurb: esServices.vacations.blurb,
      art: "/images/services/vacations.png",
      featured: true,
    },
  ];

  const spanishDestinations = destinations.map((destination) => {
    const copy = esDestinations.bySlug[destination.slug];

    return copy ? { ...destination, ...copy } : destination;
  });

  const faqItems = esFaq.items;

  return (
    <>
      <JsonLd
        schema={faqSchema(faqItems.map(({ question, answer }) => ({ question, answer })))}
      />

      <HomeHero
        title={`${countWord} ${esHero.titleSuffix}`}
        accent={esHero.titleLine2}
        intro={esHero.intro}
        proof={[
          { icon: ReceiptIcon, label: esHero.proof.itemised },
          { icon: ShieldIcon, label: esHero.proof.rules },
          { icon: HeadsetIcon, label: esHero.proof.agents(supportHours) },
        ]}
        tabsLabel={esHero.tabsLabel}
        tabs={verticalCatalogue.map((vertical) => {
          const VerticalIcon = verticalIcons[vertical.key];

          return {
            id: vertical.key,
            label: esVerticals[vertical.key].label,
            icon: <VerticalIcon />,
            panel:
              vertical.key === "flights" ? (
                <FlightSearchForm airports={airports} tone="bare" locale="es" />
              ) : vertical.key === "hotels" ? (
                <HotelSearchForm tone="bare" popular={popularStays} locale="es" />
              ) : vertical.key === "privateJets" ? (
                <JetSearchForm tone="bare" hubs={jetHubs} locale="es" />
              ) : (
                <EnquiryQuickForm
                  vertical={QUICK_FORM_VERTICAL[vertical.key]}
                  tone="bare"
                  locale="es"
                />
              ),
          };
        })}
      />

      <TrustBar
        points={esAbout.points(supportHours).map(({ key, title, body }) => ({
          icon: aboutIcons[key as keyof typeof aboutIcons],
          title,
          body,
        }))}
      />

      <ServicesBento
        eyebrow={esServices.eyebrow}
        title={esServices.title}
        description={esServices.description}
        items={services}
      />

      <HowItWorks
        eyebrow={esHow.eyebrow}
        title={esHow.title}
        steps={esHow.steps}
        linkHref="/how-it-works"
        linkLabel={esHow.link}
      />

      <Section tone="muted">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-overline uppercase text-primary">{esDealsSection.eyebrow}</p>
            <h2 className="mt-3 text-balance text-h2 text-text">{esDealsSection.title}</h2>
            <p className="mt-3 text-body-lg text-text-secondary">{esDealsSection.description}</p>
          </div>
          <ButtonLink href="/deals" variant="outline" className="shrink-0">
            {esDealsSection.seeAll}
          </ButtonLink>
        </div>
        <div className="mt-10">
          <DealCategoryGrid variant="compact" featured={featuredDeals} locale="es" />
        </div>
      </Section>

      <AboutBlock
        eyebrow={esAbout.eyebrow}
        title={esAbout.title(siteConfig.name)}
        description={esAbout.description}
        linkLabel={esAbout.more}
        badge={esHero.proof.agents(supportHours)}
      />

      <ContentBand
        tone="muted"
        eyebrow={esDestinations.eyebrow}
        title={esDestinations.title}
        description={esDestinations.description}
      >
        <DestinationsRail itemCount={spanishDestinations.length}>
          {spanishDestinations.map((destination) => (
            <li
              key={destination.slug}
              className="w-[16rem] sm:w-[18rem] md:w-[calc((100%-2rem)/3)]"
            >
              <DestinationCard destination={destination} readLabel={esDestinations.readGuide} />
            </li>
          ))}
        </DestinationsRail>
      </ContentBand>

      <PrivateAviationBand locale="es" />

      <ContentBand
        tone="muted"
        eyebrow={esBlog.eyebrow}
        title={esBlog.title}
        description={esBlog.description}
      >
        <LatestArticles locale="es" />
      </ContentBand>

      <SignUpBand
        title={esSignUp.title}
        body={esSignUp.body}
        benefits={[
          { icon: TagIcon, title: esSignUp.benefits.fares },
          { icon: StarIcon, title: esSignUp.benefits.members },
          { icon: ClockIcon, title: esSignUp.benefits.early },
          { icon: ReceiptIcon, title: esSignUp.benefits.manage },
        ]}
        button={esSignUp.button}
      />

      <FaqSplit
        eyebrow={esFaq.eyebrow}
        title={esFaq.title}
        description={esFaq.description}
        items={faqItems}
        name="home-faq-es"
      />

      <Section tone="brand" size="sm">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="measure-tight">
            <h2 className="text-h2 text-text-inverse">{esNewsletter.title}</h2>
            <p className="mt-3 text-body-lg text-text-on-dark">{esNewsletter.body}</p>
          </div>
          <NewsletterSignup tone="inverse" locale="es" />
        </div>
      </Section>
    </>
  );
}
