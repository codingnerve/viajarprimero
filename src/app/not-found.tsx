import Link from "next/link";

import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { verticalCatalogue } from "@/lib/config/site";

/**
 * 404.
 *
 * A dead end is the worst place to leave a traveller with nothing to click, so
 * the page carries the four verticals as well as an apology. The copy also
 * says outright that nothing has gone wrong with a booking — on a travel site
 * that is the first thing an unexpected error page makes people wonder.
 */
export default function NotFound() {
  return (
    <Section tone="brand" size="lg">
      <div className="measure">
        <p className="text-overline uppercase text-gray-400">Error 404</p>
        <h1 className="mt-4 text-balance text-display text-text-inverse md:text-display-lg">
          That page does not exist
        </h1>
        <p className="mt-5 text-body-lg text-text-on-dark">
          The link may be out of date, or the address may have a typo in it.
          Nothing has gone wrong with a booking — this is just a missing page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to the home page</ButtonLink>
          <ButtonLink href="/customer-support" variant="inverse">
            Contact support
          </ButtonLink>
        </div>
      </div>

      <nav aria-label="What we book" className="mt-14 border-t border-white/15 pt-8">
        <p className="text-overline uppercase text-gray-400">
          Or start somewhere else
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {verticalCatalogue.map((vertical) => (
            <li key={vertical.href}>
              <Link
                href={vertical.href}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-xl bg-white/8 px-4 text-body font-semibold text-text-inverse ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15 focus-ring-inverse"
              >
                {vertical.label}
                <ArrowRightIcon className="size-4 shrink-0 text-gray-400 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
