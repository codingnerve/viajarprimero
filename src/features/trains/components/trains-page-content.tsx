import type { ComponentType, ReactNode } from "react";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  ArrowRightIcon,
  CheckIcon,
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
import { railGuide } from "@/lib/content/trains";

type IconComponent = ComponentType<{ className?: string }>;

/** A titled card in the guide column. `id` makes it an anchor target. */
function GuideCard({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: IconComponent;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border md:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
        >
          <Icon className="size-5" />
        </span>
        <h2 id={`${id}-heading`} className="text-h3 text-text">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-4 text-body text-text-secondary">
        {children}
      </div>
    </section>
  );
}

/** The `/trains` page: a rail search and a brand-neutral booking guide. */
export function TrainsPageContent() {
  const phone = getRailPhone();
  const brand = siteConfig.name;

  const contents = [
    { id: "why-book", title: `Why book train tickets with ${brand}?` },
    { id: "how-to-book", title: "How to book rail tickets" },
    { id: "manage-booking", title: "Manage your rail booking" },
    { id: "seating", title: "Seat selection and upgrades" },
    { id: "changes", title: "Train change policy" },
    { id: "cancellations", title: "Rail ticket cancellation policy" },
    { id: "baggage", title: "Baggage policies" },
    { id: "stations", title: "Station check-in" },
    { id: "faq", title: "Rail booking questions" },
  ];
  const titleOf = (id: string) =>
    contents.find((entry) => entry.id === id)?.title ?? "";

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Trains", path: "/trains" },
        ]}
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <TrainIcon className="size-4" />
            Passenger rail travel
          </span>
        }
        title={
          <>
            Book train tickets with{" "}
            <span className="text-accent-hover">a real travel agent</span>
          </>
        }
        intro={railGuide.intro}
      />

      <Section size="sm" containerClassName="space-y-12 md:space-y-14">
        <RailSearch />

        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_18rem]">
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
            <section
              aria-labelledby="rail-guide-heading"
              className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border md:p-8"
            >
              <h2 id="rail-guide-heading" className="text-h3 text-text">
                Rail booking guide
              </h2>
              <p className="mt-4 text-body text-text-secondary">
                {railGuide.guideIntro}
              </p>
            </section>

            <GuideCard id="why-book" title={titleOf("why-book")} icon={ShieldIcon}>
              <p>{railGuide.whyBook}</p>
              <ul className="flex flex-wrap gap-2">
                {railGuide.highlights.map((highlight) => (
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
              <p>{railGuide.howToBook}</p>
            </GuideCard>

            <GuideCard id="manage-booking" title={titleOf("manage-booking")} icon={UsersIcon}>
              <p>{railGuide.manageBooking}</p>
            </GuideCard>

            <GuideCard id="seating" title={titleOf("seating")} icon={SeatIcon}>
              <p>{railGuide.seatClassesIntro}</p>
              <dl className="space-y-3">
                {railGuide.seatClasses.map((seatClass) => (
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
              <p>{railGuide.changePolicy}</p>
            </GuideCard>

            <GuideCard id="cancellations" title={titleOf("cancellations")} icon={ReceiptIcon}>
              <p>{railGuide.cancellationPolicy}</p>
            </GuideCard>

            <GuideCard id="baggage" title={titleOf("baggage")} icon={SuitcaseIcon}>
              <p>{railGuide.baggageIntro}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {railGuide.baggage.map((item) => (
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
              <p>{railGuide.stationCheckIn}</p>
            </GuideCard>

            <GuideCard id="faq" title={titleOf("faq")} icon={InfoIcon}>
              <Accordion name="trains-faq" items={railGuide.faqs} className="-mt-2" />
            </GuideCard>
          </div>

          <aside className="space-y-5 lg:col-start-2 xl:sticky xl:top-24 xl:col-start-3 xl:self-start">
            <div className="rounded-2xl bg-primary p-6 text-text-inverse">
              <h2 className="text-h4 text-text-inverse">Need help booking?</h2>
              <p className="mt-2 text-body-sm text-white/90">
                Talk to a travel agent about your rail trip.
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

            <div className="space-y-2 rounded-2xl bg-surface-2 p-5 text-caption text-text-muted ring-1 ring-inset ring-border">
              <p>Baggage and fare rules vary by ticket and by service.</p>
              <p>
                We confirm rail ticket conditions with you before anything is
                booked.
              </p>
              <p>
                {brand} is a travel agency and does not operate trains. Rail
                services are run by the operators themselves.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
