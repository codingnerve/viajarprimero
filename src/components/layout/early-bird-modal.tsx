"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";
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
          <CloseIcon className="size-5" />
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
            <p className="mt-1 select-all text-h5 tabular-nums tracking-[0.1em] text-text-inverse">
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
