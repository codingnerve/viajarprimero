"use client";

import type { ReactNode } from "react";

import { FloatingHelp } from "@/components/layout/floating-help";
import { useLocale } from "@/hooks/use-locale";
import { usePhoneLine } from "@/hooks/use-phone-line";
import type { Locale } from "@/types/locale";

import { esChrome } from "@/lib/content/es/chrome";

/**
 * The header, `<main>` and footer for whichever language the page is written
 * in.
 *
 * `/es` is hand-written Spanish; every other URL is the English site. Both
 * headers and footers are rendered on the server and handed in as props, and
 * this picks one by path — so the root layout can serve both languages without
 * reading request headers, which would make every page dynamic.
 *
 * The wrapper carries `lang` for screen readers, and keeps Google Translate
 * off the Spanish page: it is already Spanish, and the translator treats the
 * page as English.
 */
/**
 * Which header and footer to show: the two languages, the train pages (English
 * with their own phone line), or a translated `/es/…` page (English chrome with
 * the Spanish phone line).
 */
export type ChromeKey = Locale | "trains" | "es-en";

export function LocaleChrome({
  headers,
  footers,
  children,
}: {
  headers: Record<ChromeKey, ReactNode>;
  footers: Record<ChromeKey, ReactNode>;
  children: ReactNode;
}) {
  const locale = useLocale();
  const line = usePhoneLine();
  const chrome: ChromeKey =
    locale === "es" ? "es" : line === "es" ? "es-en" : line;
  const es = locale === "es";

  return (
    <div
      lang={locale}
      translate={es ? "no" : undefined}
      className={es ? "notranslate contents" : "contents"}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-tooltip)] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverse"
      >
        {es ? esChrome.skipToMain : "Skip to main content"}
      </a>

      {headers[chrome]}
      <main id="main" className="flex-1">
        {children}
      </main>
      {footers[chrome]}
      <FloatingHelp />
    </div>
  );
}
