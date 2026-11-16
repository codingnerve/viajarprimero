import Link from "next/link";

import { Section } from "@/components/layout/section";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import type { ResolvedRoute } from "@/lib/content/routes";
import { formatDuration } from "@/lib/utils/format-duration";

/**
 * Routes as a departures board: one row per city pair, the codes large, a read
 * more link to the route guide and a call link on the same row. No prices —
 * see the note on `Route`.
 */
export function LandingRoutes({
  routes,
  phone,
}: {
  routes: readonly ResolvedRoute[];
  phone: LandingPhone;
}) {
  return (
    <Section tone="dark" size="md">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-overline uppercase text-text-on-dark">Departures</p>
          <h2 className="mt-3 max-w-xl text-display text-text-inverse">
            Routes people call about most.
          </h2>
        </div>
        <a
          href={phone.href}
          className="rounded-md font-display text-h1 tabular-nums text-text-inverse underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-white focus-ring-inverse"
        >
          {phone.display}
        </a>
      </div>

      <ul className="mt-12 divide-y divide-white/15 border-y border-white/15">
        {routes.map((route) => (
          <li
            key={route.slug}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 py-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto_auto] md:py-6"
          >
            <Link
              href={`/flights/${route.slug}`}
              className="group flex items-baseline gap-3 rounded-sm focus-ring-inverse md:gap-4"
            >
              <span className="text-h1 tabular-nums text-text-inverse">
                {route.origin.code}
              </span>
              <span aria-hidden="true" className="text-text-on-dark/60 transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
              <span className="text-h1 tabular-nums text-text-inverse">
                {route.destination.code}
              </span>
              <span className="hidden text-body-sm text-text-on-dark lg:inline">
                {route.origin.city} to {route.destination.city}
              </span>
            </Link>

            <p className="hidden text-body-sm text-text-on-dark md:block">
              {route.nonstopAvailable
                ? `Nonstop about ${formatDuration(route.nonstopDurationMinutes)}`
                : "Connection required"}
              <span className="block text-caption text-text-on-dark/80">
                Best: {route.bestMonths}
              </span>
            </p>

            <p className="col-start-1 row-start-2 text-caption text-text-on-dark md:hidden">
              {route.origin.city} to {route.destination.city}
            </p>

            <a
              href={phone.href}
              aria-label={`Call ${phone.display} about ${route.origin.city} to ${route.destination.city}`}
              className="col-start-2 row-span-2 row-start-1 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-body-sm font-semibold text-primary transition-colors hover:bg-primary-softer focus-ring-inverse md:col-start-4 md:row-span-1 md:row-start-1"
            >
              <PhoneIcon className="size-4" />
              <span className="hidden sm:inline">Call about this</span>
              <span className="sm:hidden">Call</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
