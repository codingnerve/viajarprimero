# Shared Layout Components

These render on every page or across many pages. Root layout composes the
header and footer around `{children}`; individual pages render `Section`
bands inside that.

Directory: `src/components/layout/` plus the App Router root layout.

## `src/app/layout.tsx` — root layout (fonts, header, footer, consent)

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CookieConsent } from "@/components/layout/cookie-consent";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

import "./globals.css";

// Two typefaces, and only two. Geist carries every word on the site; Geist
// Mono is reserved for strings a user has to read character by character —
// booking references, promo codes, file paths. next/font self-hosts both, so
// there is no request to Google at runtime and no flash of fallback text.
//
// These feed --font-sans and --font-mono in globals.css, which is where the
// fallback stacks live. Nothing else in the app should name a font family.
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  // Every canonical and OG URL in the app resolves against this.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-tooltip)] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverse"
        >
          Skip to main content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
```

## `src/components/layout/call-button.tsx`

```tsx
import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
    </svg>
  );
}

/**
 * A pulsing green "LIVE" chip.
 *
 * It is decorative reassurance rather than information — the link's own
 * `aria-label` already carries the number — so it is hidden from assistive
 * tech instead of being read out as a stray word between the nav and the CTA.
 *
 * Note that it asserts the line is answered right now. `contactConfig.phone`
 * is still a placeholder number and `supportHours` is still a TODO, so this
 * badge is only truthful once both are real.
 */
function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none inline-flex items-center gap-1.5 rounded-full",
        "bg-success px-1.5 py-0.5 text-overline uppercase leading-none",
        "text-text-inverse shadow-[0_2px_8px_rgb(15_157_88/0.45)]",
        "animate-live-pop",
        className,
      )}
    >
      <span className="relative grid size-1.5 place-items-center">
        <span className="absolute size-1.5 rounded-full bg-white animate-live-halo" />
        <span className="size-1.5 rounded-full bg-white" />
      </span>
      Live
    </span>
  );
}

/**
 * The header's call-to-call CTA.
 *
 * Renders only once a phone number is configured: a CTA that dials a
 * `TODO_` token is worse than no CTA at all.
 *
 * Two shapes, one link each, swapped at `md` — the compact circle keeps the
 * tap target at 44px on the screens most likely to place the call, and the
 * wide pill can afford to show the number itself.
 *
 * The pill is 40px inside a 68px header, which is what leaves room for the
 * LIVE chip to overhang its top-right corner by 8px without escaping the bar
 * — the reason an earlier version of this badge needed a magic margin to sit
 * straight. Nothing here depends on the header height beyond that: the chip is
 * positioned against the pill, not against the bar.
 *
 * The phone glyph appears once, in the white disc. The caption beside it used
 * to repeat the same icon inline, which read as two separate affordances.
 *
 * That caption is full white, not the `white/85` it used to be. Blended over
 * `--color-primary` the veiled version measures ~4.5:1, which sits exactly on
 * the AA threshold — fine at 13px, not fine now the label is 10px. Full white
 * on the same blue is ~5.6:1.
 */
export function CallButton({ className }: { className?: string }) {
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);

  if (!phone || !phoneDisplay) return null;

  const href = `tel:${phone}`;
  const label = `Call for reservations: ${phoneDisplay}`;

  return (
    <>
      <a
        href={href}
        aria-label={label}
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-full",
          "bg-primary text-text-inverse shadow-[0_4px_12px_rgb(43_92_230/0.3)]",
          "transition-colors hover:bg-primary-hover focus-ring md:hidden",
          className,
        )}
      >
        <PhoneIcon className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 grid size-3 place-items-center">
          <span className="absolute size-2 rounded-full bg-success animate-live-halo" />
          <span className="size-2 rounded-full bg-success ring-2 ring-surface" />
        </span>
      </a>

      <a
        href={href}
        aria-label={label}
        className={cn(
          "relative hidden h-10 items-center gap-2 rounded-full pl-1 pr-3.5 md:inline-flex",
          "bg-primary text-text-inverse shadow-[0_4px_14px_rgb(43_92_230/0.32)]",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:bg-primary-hover focus-ring",
          className,
        )}
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-primary">
          <PhoneIcon className="size-3.5" />
        </span>

        <span className="flex flex-col leading-none">
          <span className="text-micro uppercase leading-none">
            Call for reservations
          </span>
          <span className="mt-1 text-h6 font-bold leading-none tabular-nums">
            {phoneDisplay}
          </span>
        </span>

        <LiveBadge className="absolute -right-1 -top-2" />
      </a>
    </>
  );
}
```

## `src/components/layout/cookie-consent.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

/**
 * Cookie consent banner.
 *
 * Reject is given the same prominence as Accept — a "reject" hidden behind a
 * settings panel is a dark pattern regulators specifically call out. Nothing
 * beyond the essential category may load until a choice is recorded; see
 * `use-cookie-consent.ts` for how to gate a tag on it.
 */
export function CookieConsent() {
  const { consent, hydrated, decide, gpc } = useCookieConsent();
  const [showDetail, setShowDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!hydrated || consent) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[var(--z-modal)] border-t border-border bg-surface shadow-lg"
    >
      <div className="mx-auto max-w-page px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="cookie-consent-title" className="text-h5 text-text">
              Cookies on this site
            </h2>
            <p className="mt-1.5 text-body text-gray-700">
              We use cookies needed to run the site and, with your permission,
              cookies that measure how it is used and how our advertising
              performs. Read our{" "}
              <Link
                href="/cookie-policy"
                className="text-primary underline underline-offset-2"
              >
                cookie policy
              </Link>
              .
            </p>

            {/*
              A GPC signal is already a valid opt-out of sharing, so the
              marketing category is locked off and we say why rather than
              silently ignoring either the signal or the checkbox.
            */}
            {gpc && (
              <p className="mt-3 rounded-md bg-primary-soft p-3 text-caption text-gray-800">
                Your browser is sending a Global Privacy Control signal. We
                treat that as an opt-out, so marketing cookies stay off
                whatever else you choose here.
              </p>
            )}

            {showDetail && (
              <fieldset className="mt-4 space-y-3 border-t border-border pt-4">
                <legend className="sr-only">Cookie categories</legend>

                <label className="flex items-start gap-3 text-body text-gray-700">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-1 size-4 accent-[var(--color-primary)]"
                  />
                  <span>
                    <span className="font-semibold text-text">Essential</span> —
                    required for the site to function, including remembering
                    this choice. Always on.
                  </span>
                </label>

                <label className="flex items-start gap-3 text-body text-gray-700">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                    className="mt-1 size-4 accent-[var(--color-primary)]"
                  />
                  <span>
                    <span className="font-semibold text-text">Analytics</span> —
                    aggregate measurement of how pages are used.
                  </span>
                </label>

                <label className="flex items-start gap-3 text-body text-gray-700">
                  <input
                    type="checkbox"
                    checked={marketing && !gpc}
                    disabled={gpc}
                    onChange={(event) => setMarketing(event.target.checked)}
                    className="mt-1 size-4 accent-[var(--color-primary)]"
                  />
                  <span>
                    <span className="font-semibold text-text">Marketing</span> —
                    measuring which adverts lead to a booking.
                    {gpc && (
                      <span className="block text-caption text-text-secondary">
                        Off, because your browser sends a Global Privacy
                        Control signal.
                      </span>
                    )}
                  </span>
                </label>
              </fieldset>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            {showDetail ? (
              <Button
                onClick={() => decide({ analytics, marketing: marketing && !gpc })}
              >
                Save my choices
              </Button>
            ) : (
              <Button
                onClick={() => decide({ analytics: true, marketing: !gpc })}
              >
                Accept all
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => decide({ analytics: false, marketing: false })}
            >
              Reject non-essential
            </Button>
            {!showDetail && (
              <Button variant="ghost" onClick={() => setShowDetail(true)}>
                Choose categories
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## `src/components/layout/cookie-preferences-button.tsx`

```tsx
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
```

## `src/components/layout/early-bird-modal.tsx`

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import type { Promotion } from "@/lib/config/promotions";
import { cn } from "@/lib/utils/cn";

/**
 * The early-bird offer, as a modal on the home page.
 *
 * Built on the native `<dialog>` opened with `showModal()`. That is not a
 * stylistic preference — it is what supplies, for free and correctly, the four
 * things a hand-rolled overlay gets wrong:
 *
 *   · the page behind it becomes inert, so nothing back there is tabbable,
 *     clickable or read out by a screen reader;
 *   · focus is trapped inside and returned to where it came from on close;
 *   · Escape closes it, which people expect and which is a WCAG requirement
 *     for anything that traps focus;
 *   · it renders in the top layer, so the sticky header cannot cover it.
 *
 * Reimplementing that with a `<div>` and a `z-index` is how a promotional
 * modal ends up as an accessibility trap. The animation and the backdrop blur
 * are in globals.css under `modal-dialog`.
 *
 * Dismissal is remembered per promotion id, so a returning visitor is not
 * asked twice — and changing the id in lib/config/promotions re-shows it to
 * everyone, which is what you want for a genuinely new offer.
 *
 * Layout: a wide two-column card from `sm` up — detail on the left, the offer
 * and the code on the navy panel to the right — stacking to offer-then-detail
 * on a phone. It began as a single tall column, which overflowed a laptop
 * viewport and clipped the headline number off the top edge.
 */

/**
 * Body scroll lock.
 *
 * `showModal()` makes the page inert but does not reliably stop it scrolling,
 * so a wheel gesture over the backdrop still moves the page behind the dialog.
 * Padding the body by the scrollbar's width as it is hidden is what stops the
 * whole layout — the sticky header especially — jumping sideways by ~15px as
 * the modal opens.
 *
 * Module scope rather than inside the component: these touch only the DOM, so
 * closing over a render would gain nothing and would make them a dependency of
 * the effect that calls them.
 */
function lockScroll() {
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
}

function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

export function EarlyBirdModal({ promotion }: { promotion: Promotion }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  const storageKey = `vp:promo-dismissed:${promotion.id}`;

  useEffect(() => {
    // Guard the whole effect: this is the only place the modal can be opened,
    // and every reason not to open it belongs here rather than spread across
    // the render.
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(storageKey) === "1";
    } catch {
      // Private mode, or site data blocked. Failing open is the right call —
      // the visitor sees the offer, and can still close it.
    }
    if (dismissed) return;

    /*
      The home page is prerendered, so the server-side expiry check in
      `activePromotion()` ran at build time. Re-checking here means an offer
      that lapses between deploys stops showing without waiting for a rebuild.
    */
    if (new Date().toISOString().slice(0, 10) > promotion.expiresOn) return;

    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      // `showModal()` throws if the dialog is already open — possible if a
      // fast route change remounted this before the timer fired.
      if (!dialog || dialog.open) return;

      dialog.showModal();
      setMounted(true);
      lockScroll();
    }, promotion.delayMs);

    return () => {
      window.clearTimeout(timer);
      unlockScroll();
    };
  }, [promotion.delayMs, promotion.expiresOn, storageKey]);

  /**
   * One exit path for every way of closing.
   *
   * `<dialog>` fires `close` whether it was Escape, the form's dialog method,
   * or `close()` called directly — so remembering the dismissal and restoring
   * the page happens here once rather than at each button.
   */
  const handleClose = () => {
    unlockScroll();
    setMounted(false);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Nothing to do. The offer simply shows again next visit.
    }
  };

  const dismiss = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog m-auto"
      aria-labelledby="early-bird-title"
      aria-describedby="early-bird-body"
      onClose={handleClose}
      /*
        Clicking the backdrop closes it. The dialog element itself fills the
        backdrop area, so the check is whether the click landed on the dialog
        rather than on the panel inside it.
      */
      onClick={(event) => {
        if (event.target === dialogRef.current) dismiss();
      }}
    >
      {/*
        Two columns from `sm` up: the detail on the left, the offer on the navy
        panel to the right. Side by side it is roughly half the height of the
        stacked version and uses the width the dialog already had.
      */}
      <div
        className={cn(
          "relative grid overflow-hidden rounded-3xl bg-surface text-left shadow-xl",
          "max-h-[calc(100dvh-2rem)] overflow-y-auto",
          // Content column first, offer panel second — see the `order` classes
          // on the two children for why the DOM order is the reverse of the
          // visual one at `sm` and up.
          "sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]",
        )}
      >
        {/*
          Close control, pinned to the top-right. The offer panel occupies that
          corner in both layouts — the right-hand column from `sm` up, the top
          band when the columns stack — so the button is always on navy, which
          is why it is white with an inverse focus ring. The default blue ring
          would be invisible against it.

          44px, which is the minimum touch target, and it is the first
          focusable element in the dialog so `showModal()` lands focus on it.
        */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close the early bird offer"
          className={cn(
            "absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full",
            "bg-white/12 text-white ring-1 ring-inset ring-white/25 backdrop-blur-[var(--blur-md)]",
            "transition-[background-color,transform] duration-[var(--duration-fast)]",
            "hover:bg-white/25 active:scale-95 motion-reduce:active:scale-100",
            "focus-ring-inverse",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* ── The offer ───────────────────────────────────────────────── */}
        {/*
          The offer panel sits second in the DOM order at `sm` and up — hence
          `sm:order-2` — but first on a phone, where the columns stack. That is
          deliberate: stacked, the offer has to lead and the detail follow, so
          the heading is the first thing read. Reversing it visually rather
          than in the markup keeps the reading order correct in both layouts.

          `pt-16` at every size: the close control is pinned to this panel's
          top corner, so the content has to start below it. It costs no height
          overall, because this is the shorter of the two columns and the
          padding is absorbed by the row.
        */}
        <div className="flex flex-col justify-center bg-brand-wash px-6 pb-6 pt-16 text-center sm:order-2 sm:px-7 sm:pb-8 sm:text-left">
          <p className="text-overline uppercase text-gray-300">
            {promotion.eyebrow}
          </p>

          <p
            aria-hidden="true"
            className="mt-2 text-[3.25rem] font-bold leading-none tracking-[-0.04em] text-text-inverse sm:mt-3 sm:text-[4rem]"
          >
            {promotion.percentage}
            <span className="align-super text-[0.45em]">%</span>
          </p>

          <h2
            id="early-bird-title"
            className="mt-2 text-balance text-h4 text-text-inverse sm:text-h3"
          >
            {promotion.headline}
          </h2>

          {/* The code moves into the navy panel, where it reads as the thing
              you take away rather than as another block in the column. */}
          <div className="mt-5 rounded-lg border border-dashed border-white/30 bg-white/8 px-3 py-2.5">
            <p className="text-overline uppercase text-gray-400">
              Quote this code
            </p>
            <p className="mt-1 select-all font-mono text-h5 tracking-[0.1em] text-text-inverse">
              {promotion.code}
            </p>
          </div>
        </div>

        <div className="flex flex-col px-6 py-6 sm:order-1 sm:px-8 sm:py-8">
          <p id="early-bird-body" className="text-body-sm text-text-secondary">
            {promotion.body}
          </p>

          <ul className="mt-4 space-y-2">
            {promotion.conditions.map((condition) => (
              <li key={condition} className="flex gap-2.5">
                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" />
                <span className="text-caption text-text-secondary">
                  {condition}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2">
            <ButtonLink href={promotion.ctaHref} fullWidth onClick={dismiss}>
              {promotion.ctaLabel}
            </ButtonLink>

            <button
              type="button"
              onClick={dismiss}
              className="min-h-11 rounded-full text-body-sm font-medium text-text-muted transition-colors hover:text-text focus-ring"
            >
              No thanks, keep browsing
            </button>
          </div>

          <p className="mt-4 text-center text-caption text-text-muted sm:text-left">
            Offer ends {formatExpiry(promotion.expiresOn)}.{" "}
            <Link
              href={promotion.termsUrl}
              onClick={dismiss}
              className="text-primary underline underline-offset-2"
            >
              Terms and fee schedule
            </Link>
            .
          </p>
        </div>
      </div>

      {/*
        `mounted` is read so the state is not dead weight, and it gives the
        dialog a hook for anything that needs to know it is open. Rendering it
        as a data attribute keeps it out of the accessibility tree.
      */}
      <span hidden data-open={mounted ? "true" : "false"} />
    </dialog>
  );
}

/** "31 December 2026". Fixed locale so server and client agree. */
function formatExpiry(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
```

## `src/components/layout/logo.tsx`

```tsx
import Image from "next/image";

import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The brand lockup: globe-and-plane mark plus the `viajarprimero.com`
 * wordmark, as one horizontal asset.
 *
 * This replaces a wordmark that was drawn from SVG primitives because no real
 * logo existed yet. One does now, so the drawing is gone — a hand-built
 * approximation sitting next to the actual logo on the same page is worse than
 * either on its own.
 *
 * `tone="inverse"` is not a filter or an `invert()`: it swaps in a separate
 * file in which the blue is white and the orange is untouched. Inverting the
 * full-colour asset would turn the orange plane a cyan that is nowhere in the
 * palette, and a plain white silhouette would fill in the globe's continents,
 * which are knocked out of the mark rather than painted on it.
 *
 * Intrinsic size is the asset's own 1202x230. Height is set in CSS with an
 * auto width so the lockup scales as one object, and `sizes` keeps the
 * generated srcset on the small rungs of `imageSizes` in next.config rather
 * than shipping the full-width original into a 36px-tall slot.
 */
const LOGO = {
  default: "/images/brand/logo.png",
  inverse: "/images/brand/logo-inverse.png",
} as const;

export function Logo({
  className,
  tone = "default",
  priority = false,
}: {
  className?: string;
  tone?: "default" | "inverse";
  /** Set on the header instance, which is in the first viewport on every page. */
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO[tone]}
      alt={siteConfig.name}
      width={1202}
      height={230}
      priority={priority}
      sizes="(min-width: 768px) 192px, 148px"
      className={cn("h-7 w-auto md:h-9", className)}
    />
  );
}
```

## `src/components/layout/mobile-nav.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils/cn";
import { configured } from "@/lib/config/placeholders";
import {
  contactConfig,
  secondaryNav,
  verticalCatalogue,
} from "@/lib/config/site";

/**
 * Mobile navigation sheet.
 *
 * The smallest possible client boundary: the header itself stays a Server
 * Component and only this toggle ships JavaScript.
 *
 * It is a full-height sheet now rather than a strip of links dropped under the
 * header. On a phone the nav is the whole interaction — it is worth the screen
 * — and the extra room is what lets each vertical carry the line that says
 * what it is, which is the difference between a menu and a list of words.
 */
export function MobileNav() {
  const panelId = useId();
  const pathname = usePathname();

  // The path the drawer was opened on. Deriving `open` from it means a
  // navigation closes the drawer for free - no effect chasing the route, and
  // no window where the panel covers the page the user just moved to.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // The state setter directly, not the `setOpen` helper: setters are
      // stable, so the listener does not resubscribe on every render.
      if (event.key === "Escape") setOpenedOn(null);
    };

    // Locking the page behind the sheet. Without this, a scroll gesture that
    // starts on the sheet and runs past its end scrolls the page underneath,
    // and the drawer is left floating over content that has moved.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-full text-text",
          "transition-colors hover:bg-gray-100 focus-ring",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {/* Backdrop. A tap outside the sheet closes it, which is the gesture
          people try first — but it is not the only way out: the toggle above
          stays visible and Escape works. */}
      <div
        hidden={!open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className="fixed inset-0 top-[var(--header-height)] z-[var(--z-overlay)] bg-[var(--overlay)] animate-fade"
      />

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "fixed inset-x-0 top-[var(--header-height)] z-[var(--z-modal)]",
          "max-h-[calc(100dvh-var(--header-height))] overflow-y-auto",
          "rounded-b-2xl bg-surface pb-8 shadow-xl",
          "animate-rise motion-reduce:animate-none",
        )}
      >
        <nav aria-label="Site" className="px-5 pt-5">
          <p className="text-overline uppercase text-text-muted">Book</p>
          <ul className="mt-3 grid gap-2">
            {verticalCatalogue.map((vertical) => {
              const active =
                pathname === vertical.href ||
                pathname.startsWith(`${vertical.href}/`);

              return (
                <li key={vertical.href}>
                  <Link
                    href={vertical.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-16 flex-col justify-center rounded-xl px-4 py-3",
                      "transition-colors focus-ring",
                      active
                        ? "bg-primary-soft"
                        : "bg-surface-2 hover:bg-gray-100",
                    )}
                  >
                    <span
                      className={cn(
                        "text-h4",
                        active ? "text-primary" : "text-text",
                      )}
                    >
                      {vertical.label}
                    </span>
                    <span className="mt-0.5 text-caption text-text-secondary">
                      {vertical.blurb}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-7 text-overline uppercase text-text-muted">
            Explore
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5">
            {secondaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center rounded-lg px-3 text-body font-medium",
                      "transition-colors focus-ring",
                      active
                        ? "text-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {phone && phoneDisplay && (
          <div className="mt-7 px-5">
            <a
              href={`tel:${phone}`}
              className={cn(
                "flex min-h-14 items-center justify-center gap-2.5 rounded-full",
                "bg-primary px-5 text-body-lg font-semibold text-text-inverse",
                "transition-colors hover:bg-primary-hover focus-ring",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
              </svg>
              Call {phoneDisplay}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
```

## `src/components/layout/nav-link.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

/**
 * Desktop nav item. Needs the pathname to mark the current section, which is
 * the only reason it is a client component.
 *
 * The current section is a filled pill rather than a 3px underline welded to
 * the bottom of the header. The underline tied the marker to the header's own
 * height — it had to be redrawn every time that changed — and read as a tab
 * strip rather than as navigation.
 */
export function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-10 items-center rounded-full px-3.5 font-medium",
        "transition-colors duration-[var(--duration-fast)] ease-out focus-ring",
        "text-body",
        active
          ? "bg-primary-soft text-primary"
          : "text-gray-700 hover:bg-gray-100 hover:text-text",
      )}
    >
      {label}
    </Link>
  );
}
```

## `src/components/layout/page-header.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The heading block at the top of an interior page.
 *
 * Twenty-four pages were each rebuilding this out of `max-w-[70ch]` and
 * `text-h1 md:text-[2.5rem]`. An arbitrary value repeated two dozen times is a
 * token that was never declared, so the size now comes from `--text-display`
 * and the measure from the `measure` utility, both in globals.css.
 *
 * `children` takes the trailing metadata some pages need — a published date, a
 * badge row, a set of facts about a route — so a page does not have to abandon
 * the component the moment it needs one extra line.
 *
 * `actions` takes the calls to action. Twenty pages opened with a heading, an
 * intro, and then nothing to do until the reader scrolled; on a booking site
 * the first screen of every page should offer the next step.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  tone = "default",
  align = "start",
  actions,
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** `inverse` for a header sitting on the navy band. */
  tone?: "default" | "inverse";
  align?: "start" | "center";
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const inverse = tone === "inverse";

  return (
    <header
      className={cn(
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "flex items-center gap-2.5 text-overline uppercase",
            align === "center" && "justify-center",
            inverse ? "text-gray-400" : "text-primary",
          )}
        >
          <span
            aria-hidden="true"
            className={cn("h-px w-6", inverse ? "bg-white/30" : "bg-primary/40")}
          />
          {eyebrow}
        </p>
      ) : null}

      <h1
        className={cn(
          "text-balance text-display md:text-display-lg",
          align === "center" ? "mx-auto measure-tight" : "measure-tight",
          eyebrow ? "mt-4" : null,
          inverse ? "text-text-inverse" : "text-text",
        )}
      >
        {title}
      </h1>

      {intro ? (
        <p
          className={cn(
            "mt-5 text-body-lg",
            align === "center" ? "mx-auto measure" : "measure",
            inverse ? "text-text-on-dark" : "text-text-secondary",
          )}
        >
          {intro}
        </p>
      ) : null}

      {actions ? (
        <div
          className={cn(
            "mt-8 flex flex-wrap items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          {actions}
        </div>
      ) : null}

      {children}
    </header>
  );
}
```

## `src/components/layout/page-intro.tsx`

```tsx
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo/schema";

/**
 * How every interior page opens.
 *
 * Twenty-six pages each wrote out the same three things — a `Section`, a
 * `Breadcrumbs`, and a `PageHeader className="mt-8"` — and then continued
 * their body inside that same section. Two problems came out of that. The gap
 * between the trail and the heading was a class each page could get wrong, and
 * because the header shared a band with the body, no page had an opening: the
 * first screen was heading, paragraph, and then immediately a grid of cards.
 *
 * This is the band. It is tinted, it ends in a rule, and the page's body
 * starts in its own `Section` after it — so an interior page opens the way the
 * home page does, and it opens the same way on all twenty-six.
 */
export function PageIntro({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  actions,
  children,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  /** Trailing metadata — a published date, a badge row, a set of facts. */
  children?: ReactNode;
}) {
  return (
    <Section tone="brand-soft" size="sm" bordered as="div">
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        className="mt-8"
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        actions={actions}
      >
        {children}
      </PageHeader>
    </Section>
  );
}
```

## `src/components/layout/section.tsx`

```tsx
import type { ElementType, ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

type Tone = "default" | "surface" | "muted" | "dark" | "brand" | "brand-soft";
type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * A full-bleed band with the page gutter inside it.
 *
 * Pages were repeating `<section className="…bg-surface"><Container
 * className="py-10 md:py-14">` verbatim, which is how vertical rhythm drifts a
 * few pixels per page. The tone and the padding scale are choices from a fixed
 * set here rather than class strings written out at every call site.
 */
const toneClasses: Record<Tone, string> = {
  default: "",
  surface: "bg-surface",
  muted: "bg-background-alt",
  dark: "bg-secondary",
  /** The gradient navy field. For a hero or a closing statement. */
  brand: "bg-brand-wash",
  /** Its quiet cousin, for an interior page header. */
  "brand-soft": "bg-brand-wash-soft",
};

/**
 * Five genuinely different heights.
 *
 * The original set was 40/56px for everything, which is why the page read as
 * one long undifferentiated column: if the gap before a section is the same as
 * the gap before every other section, the reader gets no signal about which
 * ones open a subject and which ones continue it. `md` is the workhorse, `lg`
 * and `xl` are for a page's opening and closing statement, `sm` and `xs` for
 * utility rows.
 *
 * The whole ramp is more generous than it was — "clean and spacious" is mostly
 * a statement about this constant.
 */
const sizeClasses: Record<Size, string> = {
  xs: "py-6 md:py-8",
  sm: "py-10 md:py-14",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
};

export function Section({
  tone = "default",
  size = "md",
  bordered = false,
  as: Tag = "section",
  width,
  backdrop,
  className,
  containerClassName,
  children,
}: {
  tone?: Tone;
  size?: Size;
  /**
   * Rendered full-bleed behind the content, outside the gutter — a hero
   * carousel, a decorative wash. It sits outside `Container` on purpose: an
   * absolutely-positioned child *inside* the container is clipped to the
   * 1240px content box and stops short of the screen edges, which is the bug
   * that makes a "full-width" hero image look like a wide banner.
   */
  backdrop?: ReactNode;
  /**
   * Rule along the bottom edge, for two bands that share a background. A tone
   * change is already an edge, so drawing a border across one as well is the
   * clutter this component exists to remove.
   */
  bordered?: boolean;
  /** `article` for a single long read, so the band is also the article root. */
  as?: ElementType;
  /** `narrow` for a single column of prose. */
  width?: "page" | "narrow";
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  const dark = tone === "dark" || tone === "brand";

  return (
    <Tag
      className={cn(
        // `isolate` gives every band its own stacking context, so a decorative
        // element positioned inside one cannot land on top of the band after
        // it. That was how the hero's glow ended up over the search panel.
        "relative isolate",
        toneClasses[tone],
        dark && "text-text-inverse",
        bordered && "border-b border-border",
        className,
      )}
    >
      {backdrop}
      <Container
        width={width}
        className={cn("relative z-10", sizeClasses[size], containerClassName)}
      >
        {children}
      </Container>
    </Tag>
  );
}
```

## `src/components/layout/site-footer.tsx`

```tsx
import Link from "next/link";

import { CookiePreferencesButton } from "@/components/layout/cookie-preferences-button";
import { Logo } from "@/components/layout/logo";
import { configured } from "@/lib/config/placeholders";
import {
  businessModel,
  californiaRestitutionFund,
  sellerOfTravelRegistrations,
} from "@/lib/config/legal";
import { contactConfig, footerNav, siteConfig } from "@/lib/config/site";

const columns = [
  { title: "Book", links: footerNav.book },
  { title: "Private aviation", links: footerNav.privateAviation },
  { title: "Traveller tools", links: footerNav.travellerTools },
  { title: "Company", links: footerNav.company },
  { title: "Legal", links: footerNav.legal },
] as const;

/**
 * Site footer.
 *
 * Carries the disclosures Google Ads reviewers look for on a travel site: who
 * the operator is, where they are, how to reach them, and — because we sell as
 * an agent rather than as the carrier — an explicit statement of that
 * relationship. Placeholder values are suppressed rather than printed.
 *
 * The redesign changed the shape, not the content. Four columns of grey links
 * at one weight is a wall to skim past; the identity block now leads at a
 * larger size with the contact details as the first thing under it, the link
 * columns are lighter and narrower, and the compliance text sits in its own
 * band at the bottom where it reads as a statement rather than as more links.
 */
export function SiteFooter() {
  const email = configured(contactConfig.email);
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const legalName = configured(siteConfig.legalName);

  const addressParts = [
    configured(contactConfig.address.street),
    configured(contactConfig.address.city),
    configured(contactConfig.address.region),
    configured(contactConfig.address.postalCode),
    configured(contactConfig.address.country),
  ].filter(Boolean);

  return (
    <footer className="mt-auto bg-secondary text-text-on-dark">
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Logo tone="inverse" />
            <p className="mt-5 max-w-sm text-body text-gray-400">
              {siteConfig.description}
            </p>

            <address className="mt-6 space-y-2 text-body not-italic">
              {legalName && (
                <p className="font-semibold text-text-inverse">{legalName}</p>
              )}
              {addressParts.length > 0 && (
                <p className="text-gray-400">{addressParts.join(", ")}</p>
              )}
              {phone && phoneDisplay && (
                <p>
                  <a
                    href={`tel:${phone}`}
                    className="rounded-sm text-h4 text-text-inverse tabular-nums underline-offset-4 hover:underline focus-ring-inverse"
                  >
                    {phoneDisplay}
                  </a>
                  {configured(contactConfig.supportHours) && (
                    <span className="block text-caption text-gray-500">
                      {contactConfig.supportHours}
                    </span>
                  )}
                </p>
              )}
              {email && (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="rounded-sm text-gray-400 underline-offset-4 hover:text-white hover:underline focus-ring-inverse"
                  >
                    {email}
                  </a>
                </p>
              )}
            </address>

            {contactConfig.accreditations.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {contactConfig.accreditations.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-full bg-white/8 px-3 py-1 text-caption text-gray-300 ring-1 ring-inset ring-white/12"
                  >
                    {item.label}: {item.id}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {columns.map((column) => {
              const id = column.title.replace(/\s+/g, "-").toLowerCase();

              return (
                <nav key={column.title} aria-labelledby={`footer-${id}`}>
                  <h2
                    id={`footer-${id}`}
                    className="text-overline uppercase text-gray-500"
                  >
                    {column.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="rounded-sm text-body-sm text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-ring-inverse"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {column.title === "Legal" && (
                      <li>
                        <CookiePreferencesButton />
                      </li>
                    )}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compliance band. Separated from the links above by a rule and a
          darker ground so it reads as a legal statement rather than as more
          navigation nobody will click. */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="mx-auto max-w-page space-y-4 px-5 py-8 text-caption text-gray-500 md:px-8">
          {businessModel === "agency" && (
            <p className="max-w-4xl">
              {siteConfig.name} is a travel agency and charter broker. We arrange
              air travel, accommodation, car hire, cruises and private jet
              charter as an agent for the airlines, hotels, rental companies,
              cruise lines and licensed air carriers that operate them; we are
              not an airline, hotel, rental company, cruise line or air
              carrier, and we do not own, operate or crew any aircraft, ship or
              vehicle ourselves. Each
              supplier&apos;s own conditions of carriage, booking conditions and
              fare rules govern what you buy. Prices and availability are
              supplied by those operators and change until a booking is
              confirmed and ticketed.
            </p>
          )}

          {/*
            California and Florida require a registered seller of travel to
            publish its registration number in advertising. Nothing renders
            until the numbers are real - see sellerOfTravelRegistrations.
          */}
          {sellerOfTravelRegistrations.length > 0 && (
            <p className="max-w-4xl">
              {sellerOfTravelRegistrations.map((registration, index) => (
                <span key={registration.registrationNumber}>
                  {index > 0 && " · "}
                  {registration.state} Seller of Travel {registration.scheme}{" "}
                  {registration.registrationNumber}
                </span>
              ))}
              {californiaRestitutionFund === "not-participant" && (
                <>
                  {" "}
                  Registration as a seller of travel in California does not
                  constitute approval by the State of California. We are not a
                  participant in the California Travel Consumer Restitution
                  Fund.
                </>
              )}
              {californiaRestitutionFund === "participant" && (
                <>
                  {" "}
                  Registration as a seller of travel in California does not
                  constitute approval by the State of California. We are a
                  participant in the California Travel Consumer Restitution
                  Fund.
                </>
              )}
            </p>
          )}

          <p>
            &copy; {new Date().getFullYear()} {legalName ?? siteConfig.name}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## `src/components/layout/site-header.tsx`

```tsx
import Link from "next/link";

import { CallButton } from "@/components/layout/call-button";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { secondaryNav } from "@/lib/config/site";

/**
 * Sticky site header.
 *
 * The logo holds the left edge, the site links sit centered between it and
 * the call CTA, which owns the right — see `secondaryNav` in lib/config/site
 * for why the verticals are not up here.
 *
 * The bar is translucent with a backdrop blur rather than solid white, which
 * is what lets the navy hero read as continuous behind it instead of being
 * capped by a white strip. `supports-[backdrop-filter]` keeps a solid
 * background for browsers that would otherwise render it transparent.
 */
export function SiteHeader() {
  return (
    <header
      className={cnHeader}
      style={{ height: "var(--header-height)" }}
    >
      <div className="mx-auto flex h-full max-w-page items-center gap-3 px-5 md:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-md focus-ring"
          aria-label="Viajarprimero — home"
        >
          <Logo priority />
        </Link>

        {/*
          The nav takes the space between the logo and the CTA and centers
          itself in it, so the links sit mid-bar rather than tucked against
          the logo.
        */}
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center justify-center gap-0.5">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
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
const cnHeader = [
  "sticky top-0 z-[var(--z-sticky)]",
  "border-b border-border/80 bg-surface",
  "supports-[backdrop-filter]:bg-surface/80",
  "supports-[backdrop-filter]:backdrop-blur-[var(--blur-lg)]",
  "supports-[backdrop-filter]:backdrop-saturate-150",
].join(" ");
```

