"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { CloseIcon, PhoneIcon } from "@/components/ui/icons";
import { usePhoneLine } from "@/hooks/use-phone-line";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, phoneFor, siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

export interface BookingSummary {
  /** Reference the traveller reads out on the call. */
  offerId: string;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  /** Already formatted for display — the server owns date formatting. */
  departDate: string;
  returnDate?: string;
  passengers: string;
  cabin: string;
  carrier: string;
  /** Flight numbers, comma-separated. */
  flights: string;
  /** Already formatted, including the currency symbol. */
  fare: string;
}

/**
 * "Call to book" on a search result.
 *
 * Bookings are made by phone, so this opens a dialog with the number, the trip
 * repeated back and a reference to quote. The number is shown as text as well
 * as a `tel:` link, because on a desktop the link goes nowhere useful. The
 * emailed quote stays as the fallback for anyone who will not call.
 *
 * The dialog restates what the fare is and is not — live, taxes and carrier
 * charges included, not held, our service fee not yet added — at the moment
 * the traveller commits. That is the disclosure Google Ads expects there.
 *
 * Built on the native `<dialog>` for the same reasons as the early-bird modal:
 * focus trapping, Escape, an inert background and top-layer rendering, none of
 * which a div with a z-index gets right. Styling is the shared `modal-dialog`
 * utility in globals.css.
 */
export function BookingConfirmButton({
  summary,
  quoteHref,
}: {
  summary: BookingSummary;
  /** Pre-filled quote request for this exact trip. */
  quoteHref: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const line = phoneFor(usePhoneLine());
  const phone = configured(line.phone);
  const phoneDisplay = configured(line.phoneDisplay);

  const show = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    setOpen(true);
    // `showModal()` leaves the page scrollable behind the dialog; the padding
    // compensates for the scrollbar so the layout does not jump sideways.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  };

  const close = () => dialogRef.current?.close();

  // Fires for every route out — the button, Escape, the backdrop — so the
  // page is restored in one place rather than at each of them.
  const handleClose = () => {
    setOpen(false);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const rows: ReadonlyArray<[string, string]> = [
    ["From", `${summary.originCity} (${summary.originCode})`],
    ["To", `${summary.destinationCity} (${summary.destinationCode})`],
    ["Departing", summary.departDate],
    ...(summary.returnDate
      ? ([["Returning", summary.returnDate]] as Array<[string, string]>)
      : []),
    ["Travellers", summary.passengers],
    ["Cabin", summary.cabin],
    ["Airline", summary.carrier],
    ...(summary.flights
      ? ([["Flights", summary.flights]] as Array<[string, string]>)
      : []),
    ["Fare found", summary.fare],
    ["Reference", summary.offerId],
  ];

  return (
    <>
      <Button
        type="button"
        onClick={show}
        fullWidth
        aria-haspopup="dialog"
        icon={<PhoneIcon className="size-4" />}
      >
        Call to book
      </Button>

      <dialog
        ref={dialogRef}
        className="modal-dialog m-auto"
        aria-labelledby={`confirm-title-${summary.offerId}`}
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-surface text-left shadow-xl">
          <div className="flex items-start justify-between gap-4 bg-brand-wash px-6 py-6 sm:px-8">
            <div>
              <p className="text-overline uppercase text-gray-300">
                Book by phone
              </p>
              <h2
                id={`confirm-title-${summary.offerId}`}
                className="mt-2 text-balance text-h3 text-text-inverse"
              >
                Call to book this flight
              </h2>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full",
                "bg-white/12 text-white ring-1 ring-inset ring-white/25",
                "transition-colors hover:bg-white/25 focus-ring-inverse",
              )}
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <p className="text-body text-text-secondary">
              Call our travel agents and quote the reference below. They check
              the fare is still available and tell you the exact total before
              anything is charged.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {phone && phoneDisplay && (
                <>
                  <ButtonLink
                    href={`tel:${phone}`}
                    size="lg"
                    fullWidth
                    icon={<PhoneIcon className="size-5" />}
                    aria-label={`Call to book: ${phoneDisplay}`}
                  >
                    <span className="tabular-nums">Call {phoneDisplay}</span>
                  </ButtonLink>
                  <p className="text-center text-caption text-text-muted">
                    Agents available {contactConfig.supportHours}
                  </p>
                </>
              )}
            </div>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              {rows.map(([term, value]) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-6 py-3"
                >
                  <dt className="text-caption text-text-muted">{term}</dt>
                  <dd
                    className={cn(
                      "text-right text-body-sm font-medium text-text",
                      (term === "Fare found" ||
                        term === "Flights" ||
                        term === "Reference") &&
                        "tabular-nums",
                      term === "Reference" && "tracking-wide",
                    )}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-caption text-text-secondary">
              <strong className="font-semibold text-text">
                About this price.
              </strong>{" "}
              {summary.fare} is the live fare for all travellers, including
              taxes and carrier charges. It is not held and can change until
              the ticket is issued. Our booking service fee is added on top and
              quoted as one exact amount before you pay.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <ButtonLink
                href={quoteHref}
                variant="outline"
                fullWidth
                onClick={close}
              >
                Send my trip to an agent instead
              </ButtonLink>
              <button
                type="button"
                onClick={close}
                className="min-h-11 rounded-full text-body-sm font-medium text-text-muted transition-colors hover:text-text focus-ring"
              >
                Back to results
              </button>
            </div>

            <p className="mt-4 text-center text-caption text-text-muted">
              {siteConfig.name} is an independent travel agency, not an
              airline. See{" "}
              <Link
                href="/fees-and-charges"
                onClick={close}
                className="text-primary underline underline-offset-2"
              >
                fees and charges
              </Link>
              .
            </p>
          </div>
        </div>

        <span hidden data-open={open ? "true" : "false"} />
      </dialog>
    </>
  );
}
