import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatLongDate } from "@/lib/utils/format-date";
import type { HotelRoom } from "@/types/hotel";

/**
 * The bookable rooms on a property page.
 *
 * These come from the live rates call, not from the property's content — the
 * content endpoint lists every room type the hotel has ever had, while rates
 * lists the ones available and priced for these dates. Rendering the former as
 * bookable would offer rooms that do not exist tonight.
 *
 * Every row states the board, the cancellation terms and the total for the
 * whole stay. No per-night teaser: a nightly figure that does not include the
 * taxes and fees the property adds is the single thing travellers most often
 * get caught by, and this site's whole argument is that it quotes totals.
 *
 * The CTA is a quote request rather than a booking. No payment is taken
 * anywhere on this site and no room is held — see `/how-it-works`. Calling it
 * "Book now" would describe an outcome the button does not produce.
 */
export function HotelRoomList({
  rooms,
  hasQuery,
  nights,
  searchQs,
  hotelName,
}: {
  rooms: readonly HotelRoom[];
  /** False when the page was opened without dates, so nothing is priced. */
  hasQuery: boolean;
  nights: number;
  /** The search, for the quote link. */
  searchQs: string;
  hotelName: string;
}) {
  if (!hasQuery) {
    return (
      <p className="mt-6 rounded-xl bg-surface-2 p-5 text-body-sm text-text-secondary ring-1 ring-inset ring-border">
        Search dates above to see which rooms are available and what they cost.
      </p>
    );
  }

  if (rooms.length === 0) {
    return (
      <p className="mt-6 rounded-xl bg-warning-soft p-5 text-body-sm text-gray-800">
        <strong className="font-semibold">
          No rooms available for these dates.
        </strong>{" "}
        The property returned no offers for your dates and occupancy. Different
        dates, or fewer guests per room, often change that — or ask us and we
        will check directly with the property.
      </p>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {rooms.map((room, index) => (
        <li
          key={`${room.offerId}-${room.rateId}`}
          className="grid overflow-hidden rounded-xl bg-surface ring-1 ring-inset ring-border md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,13rem)]"
        >
          {room.photos.length > 0 ? (
            <div className="relative aspect-[4/3] bg-gray-100 md:aspect-auto">
              <Image
                src={room.photos[0]}
                alt={`${room.name} at ${hotelName}`}
                fill
                sizes="(min-width: 768px) 12rem, 100vw"
                // Rooms sit well below the fold; none of them is the LCP.
                loading="lazy"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="hidden md:block md:bg-surface-2" />
          )}

          <div className="min-w-0 p-5">
            <h3 className="text-h5 text-text">{room.name}</h3>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              <li>
                <Badge tone="neutral" size="sm">
                  {room.board}
                </Badge>
              </li>
              {room.maxOccupancy && (
                <li>
                  <Badge tone="neutral" size="sm">
                    Sleeps {room.maxOccupancy}
                  </Badge>
                </li>
              )}
              <li>
                <Badge tone={room.refundable ? "success" : "neutral"} size="sm">
                  {room.refundable ? "Free cancellation" : "Non-refundable"}
                </Badge>
              </li>
            </ul>

            {room.refundable && room.cancellationDeadline && (
              <p className="mt-3 flex items-start gap-2 text-caption text-text-secondary">
                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" />
                <span>
                  Cancel free until{" "}
                  {formatLongDate(room.cancellationDeadline.slice(0, 10))} — the
                  property&apos;s deadline, in its own time zone.
                </span>
              </p>
            )}

            {room.amenities.length > 0 && (
              <p className="mt-3 text-caption text-text-muted">
                {room.amenities.slice(0, 5).join(" · ")}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-border bg-surface-2 p-5 md:border-l md:border-t-0 md:text-right">
            <div>
              <p className="text-h3 tabular-nums text-text">
                {formatCurrency(room.total, room.currency)}
              </p>
              <p className="text-caption text-text-muted">
                total for {nights} {nights === 1 ? "night" : "nights"}
              </p>
            </div>

            {/*
              A quote request, not a booking. Nothing on this site takes
              payment or holds a room, so the label says what the button does.
              The room is carried so the request names it rather than making
              the traveller describe it again.
            */}
            <ButtonLink
              href={`/hotels?${searchQs}&offer=${encodeURIComponent(room.offerId)}#request`}
              variant={index === 0 ? "primary" : "outline"}
              fullWidth
            >
              Select room
            </ButtonLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
