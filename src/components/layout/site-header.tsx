import Link from "next/link";

import { AccountButton } from "@/components/layout/account-dialog";
import { CallButton } from "@/components/layout/call-button";
import { DealsMenu } from "@/components/layout/deals-menu";
import { LanguageSelect } from "@/components/layout/language-select";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { mainNav, utilityNav } from "@/lib/config/site";

/**
 * Sticky site header — two floating white pills.
 *
 * From `xl`: a small utility pill (customer support, contact, language,
 * Manage my trips) sits above the main bar (logo, full nav, call CTA). Below
 * `xl` only the main bar shows, with the account icon, call button and the
 * menu; everything else is in the mobile drawer.
 *
 * The `<header>` itself is a transparent band that keeps `--header-height` in
 * flow (68px, 112px from `xl` — see globals.css), so sticky sidebars and
 * `scroll-mt` offsets are unaffected.
 */
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-[var(--z-sticky)] flex flex-col justify-center gap-1.5 px-gutter pt-3 xl:pt-2"
      style={{ height: "var(--header-height)" }}
    >
      <div className="mx-auto hidden w-full max-w-page justify-end xl:flex">
        <div className="flex h-9 items-center gap-1 rounded-full border border-gray-200 bg-surface pl-1.5 pr-1 shadow-glass">
          <nav aria-label="Help">
            <ul className="flex items-center">
              {utilityNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-7 items-center rounded-full px-2.5 text-caption font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-text focus-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-gray-200" />
          <LanguageSelect />
          <AccountButton />
        </div>
      </div>

      <div className={cnBar}>
        <Link
          href="/"
          className="shrink-0 rounded-md focus-ring"
          aria-label="Viajarprimero — home"
        >
          <Logo variant="wordmark" priority />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 xl:block">
          <ul className="flex items-center justify-center gap-0.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                {item.href === "/deals" ? (
                  <DealsMenu href={item.href} label={item.label} />
                ) : (
                  <NavLink href={item.href} label={item.label} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <AccountButton variant="icon" className="xl:hidden" />
          <CallButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

/**
 * Pulled out only because the class list is long enough that inlining it made
 * the element above unreadable.
 */
const cnBar = [
  "mx-auto flex h-14 w-full max-w-header items-center gap-3 pl-5 pr-2 xl:max-w-page",
  "rounded-full border border-gray-200 bg-surface shadow-glass",
].join(" ");
