import type { ComponentType } from "react";

import {
  BedIcon,
  CalendarIcon,
  CarIcon,
  JetIcon,
  PlaneIcon,
  ShipIcon,
  SuitcaseIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatLongDate } from "@/lib/utils/format-date";
import type { Trip, TripKind } from "@/types/trip";

const kinds: Record<
  TripKind,
  { label: string; icon: ComponentType<{ className?: string }> }
> = {
  flight: { label: "Flight", icon: PlaneIcon },
  hotel: { label: "Hotel", icon: BedIcon },
  car: { label: "Car rental", icon: CarIcon },
  cruise: { label: "Cruise", icon: ShipIcon },
  "private-jet": { label: "Private jet", icon: JetIcon },
  vacation: { label: "Vacation package", icon: SuitcaseIcon },
  other: { label: "Trip", icon: SuitcaseIcon },
};

export function TripCard({ trip }: { trip: Trip }) {
  const { label, icon: KindIcon } = kinds[trip.kind];
  const cancelled = /cancel/i.test(trip.status);

  const dates = trip.startDate
    ? trip.endDate && trip.endDate !== trip.startDate
      ? `${formatLongDate(trip.startDate)} – ${formatLongDate(trip.endDate)}`
      : formatLongDate(trip.startDate)
    : null;

  return (
    <article className="flex h-full flex-col rounded-xs bg-surface p-5 shadow-sm ring-1 ring-inset ring-border">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-overline uppercase text-primary">
          <KindIcon className="size-4" />
          {label}
        </span>
        <span
          className={cn(
            "rounded-xs px-2 py-0.5 text-caption font-semibold capitalize text-text",
            cancelled ? "bg-error-soft" : "bg-success-soft",
          )}
        >
          {trip.status}
        </span>
      </div>

      <h3 className="mt-3 text-h4 text-text">{trip.title}</h3>

      {dates && (
        <p className="mt-2 flex items-center gap-2 text-body-sm text-text-secondary">
          <CalendarIcon className="size-4 shrink-0" />
          {dates}
        </p>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-body-sm">
        <div>
          <dt className="text-text-muted">Booking reference</dt>
          <dd className="font-semibold tabular-nums tracking-wide text-text">
            {trip.reference}
          </dd>
        </div>
        {trip.total !== null && (
          <div>
            <dt className="text-text-muted">Total</dt>
            <dd className="font-semibold tabular-nums text-text">
              {formatCurrency(Math.round(trip.total * 100), trip.currency)}
            </dd>
          </div>
        )}
      </dl>

      {trip.notes && (
        <p className="mt-3 text-body-sm text-text-secondary">{trip.notes}</p>
      )}
    </article>
  );
}
