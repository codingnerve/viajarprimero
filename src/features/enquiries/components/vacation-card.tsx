import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { enquiryHref } from "@/features/enquiries/lib/enquiry-link";
import type { VacationPackage } from "@/lib/content/vacation-packages";

/**
 * One package idea, ending in a quote request.
 *
 * ## There is no price on this card, and that is the design
 *
 * Every competing page in this category leads with a number — "from $899" —
 * and that number is almost always for a date nobody wants, from an airport
 * nobody is near, in a room the hotel has four of. We have no packaging
 * supplier connected, so any figure here would be invented outright. The card
 * carries the shape of the trip instead: nights, board basis, what a package
 * for it normally covers, and the time of year it suits.
 *
 * The CTA pre-fills the destination into the quote form further down the same
 * page, so choosing an idea and asking about it is one click rather than a
 * scroll and a retype.
 *
 * ## The verdict badge
 *
 * `bundles` says whether a package usually beats booking the flight and the
 * room separately. Two of the six say it often does not, and those cards say
 * so on their face rather than in small print — which is the whole reason the
 * list is worth reading rather than skipping.
 */
export function VacationCard({ entry }: { entry: VacationPackage }) {
  const href = enquiryHref("vacation", { destination: entry.destination });
  const bundlesWell = entry.bundles === "well";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={entry.image.url}
          alt={entry.image.alt}
          fill
          sizes="(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="inverse" size="sm">
            {entry.region}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-h4 text-balance text-text">{entry.title}</h3>

        <p className="mt-1 text-body-sm font-medium text-text-secondary">
          {entry.destination}
        </p>

        {/*
          Facts about the trip rather than about a product. Nights and board
          basis are what actually separate two packages to the same place.
        */}
        <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-caption text-text-muted">
          <li className="tabular-nums">{entry.nights} nights</li>
          <li aria-hidden="true" className="text-text-disabled">
            ·
          </li>
          <li>{entry.board}</li>
        </ul>

        <p className="mt-4 flex-1 text-body-sm text-text-secondary">
          {entry.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {entry.includes.map((item) => (
            <li key={item}>
              <Badge tone="neutral" size="sm">
                {item}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border pt-4">
          <p className="flex items-start gap-2.5 text-caption text-text-secondary">
            {bundlesWell ? (
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning"
              />
            )}
            <span>
              <strong className="font-semibold text-text">
                {bundlesWell ? "Bundles well." : "Price it both ways."}
              </strong>{" "}
              {entry.note}
            </span>
          </p>

          <p className="mt-3 text-caption text-text-muted">
            Best {entry.bestTime}.
          </p>
        </div>

        <div className="mt-5">
          <ButtonLink href={href} fullWidth>
            Request a quote
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
