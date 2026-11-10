import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  ReceiptIcon,
  SearchIcon,
  SeatIcon,
  ShieldIcon,
  SuitcaseIcon,
  SwapIcon,
  TrainIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { RailSearch } from "@/features/trains/components/rail-search";
import { getRailPhone } from "@/features/trains/lib/rail-phone";
import { siteConfig } from "@/lib/config/site";
import { trainOperators, type TrainOperator } from "@/lib/content/trains";

type IconComponent = ComponentType<{ className?: string }>;

/** A titled card in the guide column. `id` makes it an anchor target. */
function GuideCard({
  id,
  title,
  icon: Icon,
  children,
}: {
  id?: string;
  title: string;
  icon?: IconComponent;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-24 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border md:p-8"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
          >
            <Icon className="size-5" />
          </span>
        )}
        <h2 id={headingId} className="text-h3 text-text">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-4 text-body text-text-secondary">
        {children}
      </div>
    </section>
  );
}

/** One operator's rail guide at `/trains/[slug]`. */
export function TrainDetailPageContent({
  operator,
}: {
  operator: TrainOperator;
}) {
  const phone = getRailPhone();
  const brand = siteConfig.name;
  const others = trainOperators.filter((other) => other.id !== operator.id);

  const contents = [
    { id: "why-book", title: `Why book ${operator.name} tickets with ${brand}?` },
    { id: "how-to-book", title: `How to book ${operator.name} rail tickets` },
    { id: "manage-booking", title: `Manage your ${operator.name} booking` },
    { id: "seating", title: "Seat selection and upgrades" },
    { id: "changes", title: "Train change policy" },
    { id: "cancellations", title: "Rail ticket cancellation policy" },
    { id: "baggage", title: "Baggage policies" },
    { id: "stations", title: "Station check-in options" },
    { id: "routes", title: `Popular ${operator.name} routes` },
    { id: "faq", title: `${operator.name} questions` },
  ];
  const titleOf = (id: string) =>
    contents.find((entry) => entry.id === id)?.title ?? "";

  return (
    <div className="pb-14">
      <Section tone="brand" size="md" as="div">
        <Breadcrumbs
          tone="inverse"
          items={[
            { name: "Home", path: "/" },
            { name: "Trains", path: "/trains" },
            { name: operator.name, path: `/trains/${operator.slug}` },
          ]}
        />

        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <PageHeader
            tone="inverse"
            eyebrow={
              <span className="inline-flex items-center gap-2">
                <TrainIcon className="size-4" />
                Rail guide
              </span>
            }
            title={`Book ${operator.name} rail tickets`}
            intro={operator.intro}
          />

          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-inset ring-white/20 lg:min-w-60">
            <p className="text-overline uppercase text-text-on-dark">
              Rail brand
            </p>
            <p className="mt-2 text-display text-text-inverse">
              {operator.code}
            </p>
            <Badge tone="inverse" className="mt-3">
              <MapPinIcon className="size-3.5" />
              {operator.country}
            </Badge>
          </div>
        </div>
      </Section>

      <Container>
        <RailSearch
          stations={operator.stations}
          title={`Search ${operator.name} journeys`}
          subtitle="Compare train routes, flexible dates and passenger options for city-to-city travel."
          className="relative z-10 -mt-8"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_18rem]">
          <nav
            aria-label="Contents"
            className="hidden self-start lg:sticky lg:top-24 lg:block"
          >
            <p className="text-overline uppercase text-text-muted">Contents</p>
            <ul className="mt-3 space-y-1 border-l border-border">
              {contents.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="-ml-px block rounded-sm border-l-2 border-transparent py-1.5 pl-4 text-body-sm text-text-secondary transition-colors hover:border-primary hover:text-primary focus-ring"
                  >
                    {entry.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-5">
            <GuideCard title={`${operator.name} rail booking guide`} icon={TrainIcon}>
              <p>{operator.guideIntro}</p>
            </GuideCard>

            <GuideCard id="why-book" title={titleOf("why-book")} icon={ShieldIcon}>
              <p>{operator.whyBook}</p>
              <ul className="flex flex-wrap gap-2">
                {operator.highlights.map((highlight) => (
                  <li key={highlight}>
                    <Badge tone="success">
                      <CheckIcon className="size-3.5" />
                      {highlight}
                    </Badge>
                  </li>
                ))}
              </ul>
            </GuideCard>

            <GuideCard id="how-to-book" title={titleOf("how-to-book")} icon={SearchIcon}>
              <p>{operator.howToBook}</p>
            </GuideCard>

            <GuideCard id="manage-booking" title={titleOf("manage-booking")} icon={UsersIcon}>
              <p>{operator.manageBooking}</p>
            </GuideCard>

            <GuideCard id="seating" title={titleOf("seating")} icon={SeatIcon}>
              <p>{operator.seatClassesIntro}</p>
              <dl className="space-y-3">
                {operator.seatClasses.map((seatClass) => (
                  <div
                    key={seatClass.name}
                    className="border-l-2 border-primary pl-4"
                  >
                    <dt className="text-h5 text-text">{seatClass.name}</dt>
                    <dd className="mt-1">{seatClass.description}</dd>
                  </div>
                ))}
              </dl>
            </GuideCard>

            <GuideCard id="changes" title={titleOf("changes")} icon={SwapIcon}>
              <p>{operator.changePolicy}</p>
            </GuideCard>

            <GuideCard id="cancellations" title={titleOf("cancellations")} icon={ReceiptIcon}>
              <p>{operator.cancellationPolicy}</p>
            </GuideCard>

            <GuideCard id="baggage" title={titleOf("baggage")} icon={SuitcaseIcon}>
              <p>{operator.baggageIntro}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {operator.baggage.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl bg-surface-2 p-4 ring-1 ring-inset ring-border"
                  >
                    <h3 className="text-h5 text-text">{item.title}</h3>
                    <p className="mt-1 text-body-sm">{item.detail}</p>
                  </div>
                ))}
              </div>
            </GuideCard>

            <GuideCard id="stations" title={titleOf("stations")} icon={MapPinIcon}>
              <p>{operator.stationCheckIn}</p>
            </GuideCard>

            <GuideCard id="routes" title={titleOf("routes")} icon={ClockIcon}>
              <ul className="divide-y divide-border">
                {operator.popularCorridors.map((corridor) => (
                  <li
                    key={corridor.label}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="text-text">{corridor.label}</span>
                    <span className="shrink-0 text-body-sm text-text-muted">
                      {corridor.typicalDuration}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-caption text-text-muted">
                Journey times are approximate and vary by service.
              </p>
            </GuideCard>

            <GuideCard id="faq" title={titleOf("faq")} icon={InfoIcon}>
              <Accordion
                name={`${operator.slug}-faq`}
                items={operator.faqs}
                className="-mt-2"
              />
            </GuideCard>
          </div>

          <aside className="space-y-5 lg:col-start-2 xl:sticky xl:top-24 xl:col-start-3 xl:self-start">
            <div className="rounded-2xl bg-primary p-6 text-text-inverse">
              <h2 className="text-h4 text-text-inverse">Need help booking?</h2>
              <p className="mt-2 text-body-sm text-white/90">
                Talk to a travel agent about your {operator.name} trip.
              </p>
              {phone ? (
                <ButtonLink
                  href={phone.href}
                  variant="accent"
                  fullWidth
                  className="mt-4"
                  icon={<PhoneIcon className="size-5" />}
                >
                  Call {phone.display}
                </ButtonLink>
              ) : (
                <ButtonLink
                  href="/contact"
                  variant="accent"
                  fullWidth
                  className="mt-4"
                  icon={<ArrowRightIcon className="size-5" />}
                >
                  Contact us
                </ButtonLink>
              )}
            </div>

            {others.length > 0 && (
              <nav
                aria-labelledby="other-rail-brands"
                className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border"
              >
                <h2 id="other-rail-brands" className="text-h4 text-text">
                  Other rail brands
                </h2>
                <ul className="mt-3 divide-y divide-border">
                  {others.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/trains/${other.slug}`}
                        className="flex items-center justify-between gap-3 py-2.5 text-body text-primary hover:underline focus-ring"
                      >
                        {other.name}
                        <ArrowRightIcon className="size-4 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="space-y-2 rounded-2xl bg-surface-2 p-5 text-caption text-text-muted ring-1 ring-inset ring-border">
              <p>Baggage and fare rules vary by ticket and by service.</p>
              <p>
                We confirm rail ticket conditions with you before anything is
                booked.
              </p>
              <p>
                {brand} is a travel agency and is not affiliated with{" "}
                {operator.name}. Names belong to their owners.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
