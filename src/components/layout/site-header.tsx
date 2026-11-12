import Link from "next/link";

import { AccountButton } from "@/components/layout/account-dialog";
import { CallButton } from "@/components/layout/call-button";
import { DealsMenu } from "@/components/layout/deals-menu";
import { LanguageSelect } from "@/components/layout/language-select";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { HeadsetIcon } from "@/components/ui/icons";
import { contactConfig, mainNav, siteConfig, utilityNav } from "@/lib/config/site";
import { esChrome } from "@/lib/content/es/chrome";
import { cn } from "@/lib/utils/cn";
import type { PhoneLine } from "@/lib/config/site";
import type { Locale } from "@/types/locale";

/**
 * Site header: a utility strip above a solid, sticky main bar.
 *
 * From `xl` the strip (help links, language, account) sits above the bar and
 * scrolls away with the page; only the bar stays. Below `xl` there is just the
 * bar, with the account icon, call button and the menu, and everything else
 * lives in the mobile drawer.
 *
 * The bar is solid white with a hairline under it rather than floating glass
 * over the hero: it reads as part of the page's structure, stays legible over
 * any content, and the hero starts cleanly beneath it. `--header-height` is
 * the bar alone (see globals.css), so sticky sidebars and `scroll-mt` offsets
 * clear exactly what stays on screen.
 *
 * The last two nav items (Reviews, Blog) only appear from 1600px; below that
 * there is room for the logo, nine links and the call button in any language
 * we write, and no more. Spanish labels are longer than English ones, which is
 * why the Spanish nav uses the short forms in `esChrome.nav`.
 */
export function SiteHeader({
  locale = "en",
  line = locale,
}: {
  locale?: Locale;
  /** Which phone line to show; defaults to the language's own. */
  line?: PhoneLine;
}) {
  const es = locale === "es";
  const label = (item: { href: string; label: string }) =>
    es ? (esChrome.nav[item.href] ?? item.label) : item.label;

  return (
    <>
      {/*
        Above the sticky bar in the stacking order: the language list opens
        downward out of this strip, and the bar (z-sticky) would otherwise
        paint over it.
      */}
      <div className="relative z-[var(--z-overlay)] hidden border-b border-border bg-background-alt xl:block">
        <div className="mx-auto flex h-9 max-w-page items-center justify-between px-gutter">
          <p className="flex items-center gap-2 text-caption font-medium text-text-secondary">
            <HeadsetIcon className="size-4 text-primary" />
            {es
              ? esChrome.strip(contactConfig.supportHours)
              : `Real travel agents, ${contactConfig.supportHours}`}
          </p>

          <div className="flex items-center gap-1">
            <nav aria-label={es ? esChrome.helpNavLabel : "Help"}>
              <ul className="flex items-center">
                {utilityNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex h-7 items-center rounded-md px-2.5 text-caption font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-text focus-ring"
                    >
                      {label(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border-strong" />
            <LanguageSelect locale={locale} />
            <AccountButton>{es ? esChrome.manageTrips : undefined}</AccountButton>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-[var(--z-sticky)] overflow-x-clip border-b border-border bg-surface/95 backdrop-blur-[var(--blur-md)]">
        <div className="relative mx-auto flex h-[var(--header-height)] max-w-page items-center gap-4 px-gutter">
          <Link
            href="/"
            className="shrink-0 rounded-md focus-ring"
            aria-label={
              es ? esChrome.homeLabel(siteConfig.name) : "Viajarprimero — home"
            }
          >
            <Logo variant="wordmark" priority />
          </Link>

          <nav
            aria-label={es ? esChrome.mainNavLabel : "Main"}
            className="hidden h-full flex-1 xl:block"
          >
            <ul className="flex h-full items-stretch justify-center">
              {mainNav.map((item, index) => (
                <li
                  key={item.href}
                  className={cn("flex", index >= 9 && "hidden min-[1600px]:flex")}
                >
                  {item.href === "/deals" ? (
                    <DealsMenu href={item.href} label={label(item)} locale={locale} />
                  ) : (
                    <NavLink href={item.href} label={label(item)} />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <AccountButton variant="icon" className="xl:hidden" />
            <CallButton locale={locale} line={line} />
            <MobileNav locale={locale} line={line} />
          </div>
        </div>
      </header>
    </>
  );
}
