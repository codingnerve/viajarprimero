import Image from "next/image";
import Link from "next/link";

import { MapPinIcon } from "@/components/ui/icons";
import { PlateFill } from "@/components/ui/plate";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { Hotel } from "@/types/hotel";

/**
 * A hotel as a photo tile, for the grid on the hotels landing page.
 *
 * Same rules as `HotelCard`: no price unless the supplier returned one for the
 * dates, and no score for an unrated property.
 */
export function HotelTile({
  hotel,
  href,
  nights,
}: {
  hotel: Hotel;
  href: string;
  nights: number;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xs bg-surface ring-1 ring-inset ring-border transition-shadow duration-[var(--duration-normal)] hover:shadow-lg has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(min-width: 992px) 18rem, (min-width: 576px) 45vw, 90vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transform-none"
          />
        ) : (
          <PlateFill seed={hotel.id} label={hotel.name.slice(0, 2).toUpperCase()} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {hotel.stars > 0 && (
          <p className="text-caption text-accent">
            <span aria-hidden="true">{"★".repeat(Math.round(hotel.stars))}</span>
            <span className="sr-only">{hotel.stars} star hotel</span>
          </p>
        )}

        <h3 className="mt-1 text-h5 text-balance text-text">
          <Link
            href={href}
            className="outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
          >
            {hotel.name}
          </Link>
        </h3>

        {hotel.city && (
          <p className="mt-1 flex items-center gap-1 text-caption text-text-muted">
            <MapPinIcon className="size-3.5 shrink-0" />
            {hotel.city}
          </p>
        )}

        {hotel.rating !== null && (
          <p className="mt-3 flex items-center gap-2">
            <span className="rounded-xs bg-primary px-1.5 py-0.5 text-caption font-bold tabular-nums text-text-inverse">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-caption text-text-secondary">
              {hotel.reviewCount > 0
                ? `${hotel.reviewCount.toLocaleString("en-US")} guest reviews`
                : "Guest rated"}
            </span>
          </p>
        )}

        {hotel.price && (
          <div className="mt-auto pt-4">
            <p className="text-h3 tabular-nums text-text">
              {formatCurrency(hotel.price.total, hotel.price.currency)}
            </p>
            <p className="text-caption text-text-muted">
              total for {nights} {nights === 1 ? "night" : "nights"}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
