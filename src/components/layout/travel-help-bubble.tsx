"use client";

import Image from "next/image";

import { CloseIcon, HeadsetIcon, PhoneIcon } from "@/components/ui/icons";
import { useLocale } from "@/hooks/use-locale";
import { esChrome } from "@/lib/content/es/chrome";
import { cn } from "@/lib/utils/cn";

/**
 * Floating "talk to a specialist" bubble — phones only.
 *
 * Where `CallButton` is a compact CTA living inside the nav bar, this is the
 * unmissable version for a visitor who has not looked at the header — same
 * phone number, same gate on it being configured (see `CallButton`: a CTA
 * that dials a `TODO_` token is worse than no CTA). `FloatingHelp` owns that
 * gate and the dismissed flag, because `ChatWidget` has to move out of the
 * way for exactly as long as this card is on screen.
 *
 * It hides from `sm` up, which is where `CallButton` stops being a bare
 * handset icon and becomes the wide pill carrying the number in full. Above
 * that the bubble would restate a CTA already on screen while permanently
 * occupying a corner of the page; below it the header offers an unlabelled
 * icon and the number is worth stating outright.
 *
 * It takes the bottom gutter outright and `ChatWidget` yields it: clearing
 * the chat launcher horizontally instead would leave under 100px for the
 * number, which then wraps mid-digits.
 *
 * The "Travel help" tag and the close control float in a `pt-3` reserved
 * above the card rather than sitting fully outside it, so their overhang
 * never extends past the fixed container's own inset-x-4 margin — the thing
 * that keeps this from bleeding off a narrow viewport.
 */
export function TravelHelpBubble({
  phone,
  phoneDisplay,
  onDismiss,
}: {
  phone: string;
  phoneDisplay: string;
  onDismiss: () => void;
}) {
  const es = useLocale() === "es";
  const href = `tel:${phone}`;
  const label = es
    ? esChrome.bubble.aria(phoneDisplay)
    : `Call our travel agents: ${phoneDisplay}`;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-[var(--z-sticky)]",
        // Phones only — hidden from `sm` (576px) up.
        "sm:hidden",
        "animate-rise motion-reduce:animate-none",
      )}
    >
      <div className="relative pt-3">
        <span
          aria-hidden="true"
          className="absolute left-5 top-0 z-10 inline-flex items-center gap-1.5 rounded-12 bg-surface px-3 py-1 text-caption font-semibold text-text shadow-md"
        >
          <HeadsetIcon className="size-3.5 text-primary" />
          {es ? esChrome.bubble.tag : "Travel help"}
        </span>

        <button
          type="button"
          onClick={onDismiss}
          aria-label={es ? esChrome.bubble.dismiss : "Dismiss travel help"}
          className={cn(
            "absolute -top-1 right-0 z-10 grid size-6 place-items-center rounded-full",
            "bg-secondary text-text-inverse shadow-md ring-2 ring-background",
            "transition-colors hover:bg-secondary/85 focus-ring-inverse",
          )}
        >
          <CloseIcon className="size-3" />
        </button>

        <a
          href={href}
          aria-label={label}
          className={cn(
            "flex min-w-0 items-center gap-3 rounded-12 bg-primary py-2 pl-2.5 pr-3",
            "shadow-[0_12px_32px_rgb(43_92_230/0.35)]",
            "transition-colors duration-[var(--duration-fast)] hover:bg-primary-hover",
            "focus-ring",
          )}
        >
          <span className="relative shrink-0">
            <Image
              src="/images/support/specialist-avatar.jpg"
              alt=""
              width={256}
              height={256}
              sizes="40px"
              className="size-10 rounded-full object-cover ring-2 ring-white/40"
            />
            <span className="absolute -bottom-0.5 -right-0.5 grid size-3.5 place-items-center">
              <span className="absolute size-3.5 rounded-full bg-success animate-live-halo" />
              <span className="size-3 rounded-full bg-success ring-2 ring-primary" />
            </span>
          </span>

          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="text-body-sm text-white/90">
              {es ? esChrome.bubble.talk : "Talk to a travel specialist"}
            </span>
            <span className="text-h6 font-bold tabular-nums text-white">
              {phoneDisplay}
            </span>
          </span>

          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-primary">
            <PhoneIcon className="size-4" />
          </span>
        </a>
      </div>
    </div>
  );
}
