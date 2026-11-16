import Link from "next/link";

import { Section } from "@/components/layout/section";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import type { ResolvedRoute } from "@/lib/content/routes";
import { formatDuration } from "@/lib/utils/format-duration";

/**
 * Routes as cards, each with its own call button — the English page shows the
 * same routes as a dark departures board. No prices; city names are the airport
 * data's own and stay as written.
 */
export function LandingEsRoutes({
  routes,
  phone,
  copy,
}: {
  routes: readonly ResolvedRoute[];
  phone: LandingPhone;
  copy: LandingCopy;
}) {
  const t = copy.routes;

  return (
    <Section size="md">
      <div className="max-w-2xl">
        <p className="text-overline uppercase text-primary">{t.eyebrow}</p>
        <h2 className="mt-3 text-display text-text">{t.title}</h2>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => {
          const pair = `${route.origin.city} ${t.to} ${route.destination.city}`;

          return (
            <li
              key={route.slug}
              className="flex flex-col rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
            >
              <Link
                href={`/flights/${route.slug}`}
                className="rounded-md focus-ring"
              >
                <span className="flex items-center gap-3">
                  <span className="text-h2 tabular-nums text-text">
                    {route.origin.code}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 border-t border-dashed border-border-strong"
                  />
                  <span className="text-h2 tabular-nums text-text">
                    {route.destination.code}
                  </span>
                </span>
                <span className="mt-2 block text-body-sm text-text-secondary">
                  {pair}
                </span>
              </Link>

              <p className="mt-4 text-caption text-text-muted">
                {route.nonstopAvailable
                  ? t.nonstop(formatDuration(route.nonstopDurationMinutes))
                  : t.connection}
              </p>

              <a
                href={phone.href}
                aria-label={t.ariaCall(
                  phone.display,
                  route.origin.city,
                  route.destination.city,
                )}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-soft text-body-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-text-inverse focus-ring"
              >
                <PhoneIcon className="size-4" />
                {t.callAbout} · {phone.display}
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
