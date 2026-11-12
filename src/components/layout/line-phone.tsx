"use client";

import type { ComponentProps, ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";
import { usePhoneLine } from "@/hooks/use-phone-line";
import { phoneFor } from "@/lib/config/site";

/**
 * Phone number and `tel:` link for whichever line the current page uses.
 *
 * Server pages cannot know the visitor's language (`/es/…` is a rewrite of the
 * English page) so they render these small client pieces wherever a number is
 * shown, and the right line is picked in the browser: the train line under
 * `/trains`, the Spanish line on `/es` pages, the main line elsewhere.
 */

/** The number as text, e.g. `+1 877 380 4007`. */
export function PhoneNumberText() {
  return <>{phoneFor(usePhoneLine()).phoneDisplay}</>;
}

/** A plain `<a href="tel:…">`. `ariaPrefix` becomes "<prefix><number>". */
export function LinePhoneLink({
  ariaPrefix,
  children,
  className,
}: {
  ariaPrefix?: string;
  children: ReactNode;
  className?: string;
}) {
  const { phone, phoneDisplay } = phoneFor(usePhoneLine());

  return (
    <a
      href={`tel:${phone}`}
      aria-label={ariaPrefix ? `${ariaPrefix}${phoneDisplay}` : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

/** A `ButtonLink` that dials the line for the current page. */
export function LinePhoneButton({
  ariaPrefix,
  ...props
}: Omit<ComponentProps<typeof ButtonLink>, "href"> & { ariaPrefix?: string }) {
  const { phone, phoneDisplay } = phoneFor(usePhoneLine());

  return (
    <ButtonLink
      {...props}
      href={`tel:${phone}`}
      aria-label={ariaPrefix ? `${ariaPrefix}${phoneDisplay}` : undefined}
    />
  );
}
