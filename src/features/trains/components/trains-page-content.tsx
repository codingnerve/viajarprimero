import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  ArrowRightIcon,
  PhoneIcon,
  TrainIcon,
} from "@/components/ui/icons";
import { RailSearch } from "@/features/trains/components/rail-search";
import { getRailPhone } from "@/features/trains/lib/rail-phone";
import {
  allTrainStations,
  trainOperators,
  type TrainOperator,
} from "@/lib/content/trains";
import { cn } from "@/lib/utils/cn";

const accentClasses: Record<TrainOperator["logoAccent"], string> = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary text-text-inverse",
  accent: "bg-accent-soft text-accent-hover",
};

/** The `/trains` hub: operator guides, a rail search, and a call-to-help band. */
export function TrainsPageContent() {
  const phone = getRailPhone();

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
            Rail booking guides for{" "}
            <span className="text-accent-hover">trusted train operators</span>
          </>
        }
        intro="Browse operator guides, see the corridors travellers ask about most, and send a rail booking request alongside your flights. Our team checks live schedules and fares with you before anything is confirmed."
      />

      <Section size="sm" containerClassName="space-y-12 md:space-y-14">
        <RailSearch stations={allTrainStations} />

        <ul className="grid items-stretch gap-5 lg:grid-cols-2">
          {trainOperators.map((operator) => (
            <li key={operator.id} className="flex">
              <article className="relative flex w-full flex-col rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border transition-shadow hover:shadow-md md:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-caption font-semibold tracking-wide",
                      accentClasses[operator.logoAccent],
                    )}
                  >
                    {operator.code}
                  </span>
                  <Badge tone="neutral">{operator.country}</Badge>
                </div>

                <h2 className="mt-4 text-h3 text-text">
                  Book {operator.name} rail tickets
                </h2>
                <p className="mt-2 text-body text-text-secondary">
                  {operator.summary}
                </p>

                <div className="mt-5">
                  <p className="text-overline uppercase text-text-muted">
                    Popular corridors
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {operator.popularCorridors.slice(0, 4).map((corridor) => (
                      <li key={corridor.label}>
                        <Badge tone="neutral">{corridor.label}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <Link
                    href={`/trains/${operator.slug}`}
                    className="text-body font-semibold text-primary underline-offset-4 after:absolute after:inset-0 after:rounded-2xl hover:underline focus-ring"
                  >
                    View guide and request a trip
                  </Link>
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
                  >
                    <TrainIcon className="size-5" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="grid items-center gap-6 rounded-2xl bg-primary p-7 text-text-inverse md:p-10 lg:grid-cols-[1.5fr_auto]">
          <div>
            <h2 className="text-h2 text-text-inverse">
              Need help planning your rail itinerary?
            </h2>
            <p className="mt-2 max-w-2xl text-body text-white/90">
              Tell us where you are going and when. We will check the options,
              explain the ticket rules in plain language and confirm the full
              price with you before anything is booked.
            </p>
          </div>
          {phone ? (
            <ButtonLink
              href={phone.href}
              variant="accent"
              size="lg"
              icon={<PhoneIcon className="size-5" />}
            >
              Call {phone.display}
            </ButtonLink>
          ) : (
            <ButtonLink
              href="/contact"
              variant="accent"
              size="lg"
              icon={<ArrowRightIcon className="size-5" />}
            >
              Contact us
            </ButtonLink>
          )}
        </div>
      </Section>
    </>
  );
}
