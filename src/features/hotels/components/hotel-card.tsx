import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CheckIcon, MapPinIcon } from "@/components/ui/icons";
import { PlateFill } from "@/components/ui/plate";
import { formatCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils/cn";
import type { Hotel } from "@/types/hotel";

/**
 * A hotel in the results list.
 *
 * Photo left, content middle, price right — the shape of every hotel results
 * page a traveller has used, and the one that survives being scanned twenty
 * rows at a time. It collapses to a stacked card below `md` with the image
 * running full width.
 *
 * Two things it deliberately does not do:
 *
 *  · It never shows a price it does not have. A hotel with no offer for these
 *    dates says so, rather than showing a blank or a "from" figure borrowed
 *    from other dates.
 *  · It never shows a zero rating. The supplier uses 0 to mean unrated, and
 *    "0.0/10" next to a real hotel's name is a libel rather than a data point
 *    — so an unrated property shows no score at all.
 */
export function HotelCard({
  hotel,
  href,
  nights,
  facilityNames,
}: {
  hotel: Hotel;
  /** Details link, carrying the search so the dates survive the click. */
  href: string;
  nights: number;
  /** Supplier facility id → name, for the amenity chips. */
  facilityNames: ReadonlyMap<number, string>;
}) {
  const amenities = hotel.facilityIds
    .map((facilityId) => facilityNames.get(facilityId))
    .filter((name): name is string => Boolean(name))
    .slice(0, 4);

  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-xl bg-surface",
        "ring-1 ring-inset ring-border",
        "transition-shadow duration-[var(--duration-normal)] hover:shadow-lg",
        "md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,13rem)]",
        "has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 md:aspect-auto md:h-full">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(min-width: 768px) 17rem, 100vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transform-none"
          />
        ) : (
          <PlateFill seed={hotel.id} label={hotel.name.slice(0, 2).toUpperCase()} />
        )}
      </div>

      <div className="flex min-w-0 flex-col p-5">
        {hotel.stars > 0 && (
          <p className="text-caption text-accent" aria-label={`${hotel.stars} star hotel`}>
            <span aria-hidden="true">{"★".repeat(Math.round(hotel.stars))}</span>
          </p>
        )}

        <h3 className="mt-1 text-h4 text-balance text-text">
          {/* The anchor covers the card via `after:`, so the whole tile is a
              target while the link's accessible name stays the hotel name. */}
          <Link
            href={href}
            className="outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
          >
            {hotel.name}
          </Link>
        </h3>

        {(hotel.address || hotel.city) && (
          <p className="mt-1.5 flex items-start gap-1.5 text-caption text-text-muted">
            <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
            <span className="min-w-0">
              {[hotel.address, hotel.city].filter(Boolean).join(", ")}
            </span>
          </p>
        )}

        {hotel.summary && (
          <p className="mt-3 line-clamp-2 text-body-sm text-text-secondary">
            {hotel.summary}
          </p>
        )}

        {amenities.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {amenities.map((amenity) => (
              <li key={amenity}>
                <Badge tone="neutral" size="sm">
                  {amenity}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price rail. Its own tinted ground rather than a border, so the eye
          separates "what you get" from "what it costs". */}
      <div className="flex flex-col justify-between gap-4 border-t border-border bg-surface-2 p-5 md:border-l md:border-t-0">
        {hotel.rating !== null ? (
          <div className="flex items-center gap-2">
            <span className="rounded-lg rounded-bl-sm bg-primary px-2 py-1 text-body-sm font-bold tabular-nums text-text-inverse">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-caption text-text-muted">
              {hotel.reviewCount > 0
                ? `${hotel.reviewCount.toLocaleString("en-US")} reviews`
                : "Guest rated"}
            </span>
          </div>
        ) : (
          <p className="text-caption text-text-muted">No guest rating yet</p>
        )}

        {hotel.price ? (
          <div className="md:text-right">
            <p className="text-h2 tabular-nums text-text">
              {formatCurrency(hotel.price.total, hotel.price.currency)}
            </p>
            <p className="text-caption text-text-muted">
              total for {nights} {nights === 1 ? "night" : "nights"}
            </p>

            {hotel.price.refundable && (
              <p className="mt-2 flex items-center gap-1.5 text-caption font-medium text-success md:justify-end">
                <CheckIcon className="size-3.5" />
                Free cancellation
              </p>
            )}

            <span
              aria-hidden="true"
              className="mt-3 inline-flex min-h-9 items-center rounded-full bg-primary px-4 text-body-sm font-semibold text-text-inverse transition-colors group-hover:bg-primary-hover"
            >
              See availability
            </span>
          </div>
        ) : (
          /*
            No offer came back for these dates. Saying so is the whole point:
            an empty price column would read as a rendering fault, and a "from"
            figure carried over from other dates would be a fabricated price.
          */
          <div className="md:text-right">
            <p className="text-body-sm font-medium text-text-secondary">
              No availability
            </p>
            <p className="mt-1 text-caption text-text-muted">
              for these dates and occupancy
            </p>
            <span
              aria-hidden="true"
              className="mt-3 inline-flex min-h-9 items-center rounded-full bg-gray-100 px-4 text-body-sm font-semibold text-text-secondary"
            >
              View hotel
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
