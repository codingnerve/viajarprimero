import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { ResolvedDestination } from "@/lib/content/destinations";
import { cn } from "@/lib/utils/cn";

/**
 * Destination teaser.
 *
 * Photo-led, with the city set over the bottom of the frame. Where no
 * photograph has been added for the slug yet, `Photo` fills the same frame
 * with a brand gradient plate carrying the city's initials — so the card is
 * complete either way and the grid does not reflow when a picture arrives.
 * Dropping `public/images/destinations/london.jpg` into the repo is the whole
 * act of illustrating London.
 *
 * `headingLevel` exists because this card appears in two places with different
 * outlines: under a section heading on the home page, where its title is
 * correctly an h3, and directly under the page h1 on the index, where an h3
 * skips a level and breaks the screen-reader document outline. The visual size
 * comes from the type token either way, so the tag can follow the outline
 * rather than the styling.
 */
export function DestinationCard({
  destination,
  headingLevel: Heading = "h3",
  className,
  readLabel = "Read the guide",
  large = false,
}: {
  /** Bigger text, used on the home page. */
  large?: boolean;
  destination: ResolvedDestination;
  headingLevel?: "h2" | "h3";
  className?: string;
  /** The link text under the summary. Overridden by the Spanish home page. */
  readLabel?: string;
}) {
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/destinations/${destination.slug}`}
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-lg bg-surface",
          "ring-1 ring-inset ring-border",
          "transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out",
          "hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none",
          "focus-ring",
        )}
      >
        <Photo
          collection="destinations"
          slug={destination.slug}
          src={destination.src}
          alt={`${destination.city}, ${destination.country}`}
          label={destination.airport.code}
          sizes="(min-width: 992px) 20rem, (min-width: 576px) 45vw, 80vw"
          overlay
          className="aspect-[4/3] w-full"
          imageClassName="transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transform-none"
        >
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p
              className={cn(
                "uppercase text-white/80",
                large ? "text-body-sm font-semibold tracking-[0.08em]" : "text-overline text-white/70",
              )}
            >
              {destination.country} · {destination.airport.code}
            </p>
            <Heading
              className={cn("mt-1 text-text-inverse", large ? "text-2xl font-semibold" : "text-h3")}
            >
              {destination.city}
            </Heading>
          </div>
        </Photo>

        <div className={cn("flex flex-1 flex-col", large ? "p-5" : "p-4")}>
          <p className={cn("text-text-secondary", large ? "text-body" : "text-body-sm")}>
            {destination.summary}
          </p>
          <span
            className={cn(
              "mt-auto flex items-center gap-1.5 pt-4 font-semibold text-primary",
              large ? "text-body" : "text-body-sm",
            )}
          >
            {readLabel}
            <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </div>
      </Link>
    </article>
  );
}
