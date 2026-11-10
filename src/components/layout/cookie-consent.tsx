"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { useLocale } from "@/hooks/use-locale";
import { esChrome } from "@/lib/content/es/chrome";

/**
 * Cookie consent banner.
 *
 * A compact card anchored to the bottom-left rather than a full-width bar: the
 * notice is secondary to whatever the visitor came for, and a bar pinned across
 * the viewport covers the first thing they look at on a phone. It slides up on
 * mount and never blocks the page — `aria-modal="false"`, no overlay.
 *
 * Reject is given the same prominence as Accept — a "reject" hidden behind a
 * settings panel is a dark pattern regulators specifically call out. Nothing
 * beyond the essential category may load until a choice is recorded; see
 * `use-cookie-consent.ts` for how to gate a tag on it.
 */
export function CookieConsent() {
  const { consent, hydrated, decide, gpc } = useCookieConsent();
  const es = useLocale() === "es";
  const t = esChrome.cookie;
  const [showDetail, setShowDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!hydrated || consent) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className={[
        "fixed bottom-4 left-4 right-4 z-[var(--z-modal)]",
        "sm:right-auto sm:bottom-6 sm:left-6 sm:w-[22rem]",
        "max-h-[80vh] overflow-y-auto overscroll-contain",
        "rounded-xl border border-border bg-surface p-5 shadow-xl",
        "animate-rise motion-reduce:animate-none",
      ].join(" ")}
    >
      <h2 id="cookie-consent-title" className="text-h5 text-text">
        {es ? t.title : "Cookies on this site"}
      </h2>
      <p className="mt-1.5 text-body-sm text-gray-700">
        {es
          ? t.intro
          : "We use cookies to run the site and, with your permission, to measure how it is used. Read our"}{" "}
        <Link
          href="/cookie-policy"
          className="text-primary underline underline-offset-2"
        >
          {es ? t.policy : "cookie policy"}
        </Link>
        .
      </p>

      {/*
        A GPC signal is already a valid opt-out of sharing, so the marketing
        category is locked off and we say why rather than silently ignoring
        either the signal or the checkbox.
      */}
      {gpc && (
        <p className="mt-3 rounded-md bg-primary-soft p-2.5 text-caption text-gray-800">
          {es
            ? t.gpc
            : "Your browser is sending a Global Privacy Control signal. We treat that as an opt-out, so marketing cookies stay off whatever else you choose here."}
        </p>
      )}

      {showDetail && (
        <fieldset className="mt-4 space-y-3 border-t border-border pt-4">
          <legend className="sr-only">
            {es ? t.legend : "Cookie categories"}
          </legend>

          <label className="flex items-start gap-2.5 text-body-sm text-gray-700">
            <input
              type="checkbox"
              checked
              disabled
              className="mt-0.5 size-4 accent-[var(--color-primary)]"
            />
            <span>
              <span className="font-semibold text-text">
                {es ? t.essential : "Essential"}
              </span>{" "}
              —{" "}
              {es
                ? t.essentialBody
                : "required for the site to function, including remembering this choice. Always on."}
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-body-sm text-gray-700">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              className="mt-0.5 size-4 accent-[var(--color-primary)]"
            />
            <span>
              <span className="font-semibold text-text">
                {es ? t.analytics : "Analytics"}
              </span>{" "}
              —{" "}
              {es
                ? t.analyticsBody
                : "aggregate measurement of how pages are used."}
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-body-sm text-gray-700">
            <input
              type="checkbox"
              checked={marketing && !gpc}
              disabled={gpc}
              onChange={(event) => setMarketing(event.target.checked)}
              className="mt-0.5 size-4 accent-[var(--color-primary)]"
            />
            <span>
              <span className="font-semibold text-text">
                {es ? t.marketing : "Marketing"}
              </span>{" "}
              —{" "}
              {es
                ? t.marketingBody
                : "measuring which adverts lead to a booking."}
              {gpc && (
                <span className="block text-caption text-text-secondary">
                  {es
                    ? t.marketingOff
                    : "Off, because your browser sends a Global Privacy Control signal."}
                </span>
              )}
            </span>
          </label>
        </fieldset>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {showDetail ? (
          <Button
            size="sm"
            fullWidth
            onClick={() => decide({ analytics, marketing: marketing && !gpc })}
          >
            {es ? t.save : "Save my choices"}
          </Button>
        ) : (
          <Button
            size="sm"
            fullWidth
            onClick={() => decide({ analytics: true, marketing: !gpc })}
          >
            {es ? t.acceptAll : "Accept all"}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => decide({ analytics: false, marketing: false })}
        >
          {es ? t.reject : "Reject non-essential"}
        </Button>
        {!showDetail && (
          <button
            type="button"
            onClick={() => setShowDetail(true)}
            className="focus-ring mt-0.5 self-center rounded-sm text-caption font-semibold text-text-secondary underline underline-offset-2 hover:text-text"
          >
            {es ? t.choose : "Choose categories"}
          </button>
        )}
      </div>
    </div>
  );
}
