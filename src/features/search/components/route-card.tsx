import Link from "next/link";

import { formatDuration } from "@/lib/utils/format-duration";
import type { ResolvedRoute } from "@/lib/content/routes";
import { cn } from "@/lib/utils/cn";

/**
 * Route teaser.
 *
 * Deliberately carries no price. A "from $X" badge is the convention on cards
 * like this, but we hold no fares of our own, and publishing an invented or
 * stale one is a misrepresentation — so the card leads with the facts of the
 * route instead.
 *
 * The airport pair is set at display size with the flight path drawn between
 * them, because that pair *is* the content. The previous card put the codes at
 * body size and gave the same weight to the city names underneath, which left
 * a grid of a dozen routes with nothing to scan by.
 */
export function RouteCard({
  route,
  className,
}: {
  route: ResolvedRoute;
  className?: string;
}) {
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/flights/${route.slug}`}
        className={cn(
          "flex h-full flex-col rounded-xl bg-surface p-5",
          "ring-1 ring-inset ring-border",
          "transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out",
          "hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none",
          "focus-ring",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-h2 tabular-nums text-text">
            {route.origin.code}
          </span>

          {/* The path, not an arrow: a dotted rule with a plane riding it
              reads as a route at a glance where a chevron reads as "next". */}
          <span
            aria-hidden="true"
            className="relative flex h-px flex-1 items-center"
          >
            <span className="h-px w-full border-t border-dashed border-divider" />
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={cn(
                "absolute left-1/2 size-4 -translate-x-1/2 rounded-full bg-surface text-primary",
                "transition-transform duration-[var(--duration-slow)] ease-out",
                "group-hover:translate-x-2 motion-reduce:transform-none",
              )}
            >
              <path d="M10.2 13.8 3.5 12l17-6.5-5 16.5-2.2-6.5-3.1 3.3v-4.9Z" />
            </svg>
          </span>

          <span className="text-h2 tabular-nums text-text">
            {route.destination.code}
          </span>
        </div>

        <p className="mt-3 text-body-sm text-text-secondary">
          {route.origin.city} to {route.destination.city}
        </p>

        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4 text-caption">
          <div>
            <dt className="text-text-muted">Nonstop</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-text">
              {route.nonstopAvailable
                ? `about ${formatDuration(route.nonstopDurationMinutes)}`
                : "connection required"}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Best months</dt>
            <dd className="mt-0.5 font-medium text-text">{route.bestMonths}</dd>
          </div>
        </dl>
      </Link>
    </article>
  );
}
