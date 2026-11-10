import Image from "next/image";
import Link from "next/link";

import { AccountButton } from "@/components/layout/account-dialog";
import { Section } from "@/components/layout/section";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { LatestArticles } from "@/components/content/latest-articles";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
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
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
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
  esNewsletter,
  esNumberWords,
  esServices,
  esSignUp,
  esVerticals,
} from "@/lib/content/es/home";
import { getPhoto, publicFileExists } from "@/lib/content/images";
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

const proofIcons = [ReceiptIcon, ShieldIcon, HeadsetIcon] as const;

/**
 * The Spanish home page, `/es`.
 *
 * Section for section the same page as `/`, written in Spanish rather than run
 * through a translator: the hero and search tabs, what we book, deals, why
 * book with us, destinations, private aviation, the blog, sign-up, FAQ and the
 * newsletter. Everything that makes a claim makes the same claim the English
 * page does.
 *
 * Links go to the same English pages as the English home page. A visitor who
 * follows one stays in Spanish, because the proxy keeps `/es/...` on the
 * browser-translated version of the page.
 */
export async function SpanishHomePage() {
  const destinations = getResolvedDestinations();
  const popularStays = await popularPlaces();

  const supportHours = contactConfig.supportHours;
  const verticalCount = verticalCatalogue.length;
  const countWord = esNumberWords[verticalCount] ?? String(verticalCount);

  const first = destinations[0];
  const poster =
    (first?.src && publicFileExists(first.src) ? first.src : null) ??
    (first
      ? (getPhoto("hero", first.slug) ?? getPhoto("destinations", first.slug))
      : null);

  const proofPoints = [
    esHero.proof.itemised,
    esHero.proof.rules,
    esHero.proof.agents(supportHours),
  ];

  const services = [
    ...SERVICE_ORDER.flatMap((key) =>
      verticalCatalogue
        .filter((vertical) => vertical.key === key)
        .map((vertical) => ({
          href: vertical.href,
          label: esVerticals[key].label,
          blurb: esVerticals[key].blurb,
          art: SERVICE_ART[key],
        })),
    ),
    {
      href: "/vacations",
      label: esServices.vacations.label,
      blurb: esServices.vacations.blurb,
      art: "/images/services/vacations.png",
    },
  ];

  const spanishDestinations = destinations.map((destination) => {
    const copy = esDestinations.bySlug[destination.slug];

    return copy ? { ...destination, ...copy } : destination;
  });

  const memberBenefits = [
    { icon: TagIcon, title: esSignUp.benefits.fares },
    { icon: StarIcon, title: esSignUp.benefits.members },
    { icon: ClockIcon, title: esSignUp.benefits.early },
    { icon: ReceiptIcon, title: esSignUp.benefits.manage },
  ];

  return (
    <>
      <JsonLd
        schema={faqSchema(
          esFaq.items.map(({ question, answer }) => ({ question, answer })),
        )}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Section
        tone="brand"
        size="lg"
        className="z-20 flex min-h-svh flex-col justify-center"
        containerClassName="pb-24 md:pb-28"
        backdrop={<HeroVideo src="/videos/hero.mp4" poster={poster} />}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-rise text-balance text-display-lg text-text-inverse [animation-delay:80ms] motion-reduce:animate-none">
            {countWord} {esHero.titleSuffix}
            <br className="hidden sm:block" />{" "}
            <span className="text-gray-300">{esHero.titleLine2}</span>
          </h1>
          <p className="animate-rise measure mx-auto mt-5 text-body-lg text-balance text-text-on-dark [animation-delay:160ms] motion-reduce:animate-none">
            {esHero.intro}
          </p>

          <ul className="animate-rise mt-7 flex flex-wrap items-center justify-center gap-y-2 [animation-delay:240ms] motion-reduce:animate-none">
            {proofPoints.map((title, index) => {
              const ProofIcon = proofIcons[index];

              return (
                <li key={title} className="flex items-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-3 hidden h-4 w-px bg-white/25 sm:mx-4 sm:block"
                    />
                  )}
                  <span className="flex items-center gap-2 px-2 sm:px-0">
                    <ProofIcon className="size-4.5 shrink-0 text-gray-300" />
                    <span className="text-body-sm font-semibold text-text-inverse">
                      {title}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="animate-rise mx-auto mt-10 max-w-5xl rounded-xs bg-surface p-2 shadow-panel [animation-delay:320ms] motion-reduce:animate-none md:mt-12 md:p-3">
          <Tabs
            tone="light"
            shape="panel"
            label={esHero.tabsLabel}
            panelClassName="pt-3 md:pt-4"
            items={verticalCatalogue.map((vertical) => {
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
        </div>
      </Section>

      {/* ── Lo que reservamos ──────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow={esServices.eyebrow}
          title={esServices.title}
          description={esServices.description}
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

      {/* ── Ofertas ────────────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow={esDealsSection.eyebrow}
          title={esDealsSection.title}
          description={esDealsSection.description}
        />
        <div className="mt-10">
          <DealCategoryGrid variant="compact" featured={featuredDeals} locale="es" />
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/deals" variant="outline">
            {esDealsSection.seeAll}
          </ButtonLink>
        </div>
      </Section>

      {/* ── Sobre nosotros ─────────────────────────────────────────────── */}
      <Section
        backdrop={
          <>
            <Image
              src="/images/home/why-us-road.jpg"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="pointer-events-none object-cover opacity-10"
            />
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
              eyebrow={esAbout.eyebrow}
              title={esAbout.title(siteConfig.name)}
              description={esAbout.description}
            />
            <ButtonLink href="/about" variant="outline" className="mt-8">
              {esAbout.more}
            </ButtonLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {esAbout.points(supportHours).map(({ key, title, body }) => {
              const PointIcon = aboutIcons[key as keyof typeof aboutIcons];

              return (
                <li
                  key={key}
                  className="rounded-xs bg-surface p-5 ring-1 ring-inset ring-border"
                >
                  <PointIcon className="size-6 text-primary" />
                  <p className="mt-3 text-h6 text-text">{title}</p>
                  <p className="mt-1 text-body-sm text-text-secondary">{body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* ── Adónde vamos ───────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow={esDestinations.eyebrow}
          description={esDestinations.description}
        />
        <DestinationsRail itemCount={spanishDestinations.length}>
          {spanishDestinations.map((destination) => (
            <li
              key={destination.slug}
              className="w-[16rem] sm:w-[18rem] md:w-[calc((100%-2rem)/3)]"
            >
              <DestinationCard
                destination={destination}
                readLabel={esDestinations.readGuide}
              />
            </li>
          ))}
        </DestinationsRail>
      </Section>

      {/* ── Aviación privada ───────────────────────────────────────────── */}
      <PrivateAviationBand locale="es" />

      {/* ── Blog ───────────────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading eyebrow={esBlog.eyebrow} description={esBlog.description} />
        <div className="mt-10">
          <LatestArticles locale="es" />
        </div>
      </Section>

      {/* ── Regístrese ─────────────────────────────────────────────────── */}
      <Section>
        <div className="grid items-center gap-8 rounded-xs bg-brand-wash p-8 md:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <h2 className="text-h2 text-text-inverse">{esSignUp.title}</h2>
            <p className="mt-3 text-body-lg text-text-on-dark">{esSignUp.body}</p>
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
            {esSignUp.button}
          </AccountButton>
        </div>
      </Section>

      {/* ── Preguntas frecuentes ───────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading eyebrow={esFaq.eyebrow} description={esFaq.description} />
        <Accordion
          items={esFaq.items}
          name="home-faq-es"
          className="mx-auto mt-10 max-w-3xl border-t border-border"
        />
      </Section>

      {/* ── Boletín ────────────────────────────────────────────────────── */}
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
