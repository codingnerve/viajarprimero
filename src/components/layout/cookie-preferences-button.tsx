"use client";

import { useCookieConsent } from "@/hooks/use-cookie-consent";

/**
 * Reopens the cookie banner so a visitor can change or withdraw consent.
 *
 * Withdrawing consent has to be as easy as giving it, which means a control
 * on every page rather than an instruction to clear browser storage. This is
 * the link `/your-privacy-choices` and the cookie policy both point at, so it
 * belongs in the footer where those pages say it is.
 */
export function CookiePreferencesButton() {
  const { reopen } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={reopen}
      className="rounded-sm text-body-sm text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-ring-inverse"
    >
      Cookie choices
    </button>
  );
}
