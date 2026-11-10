import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Compact book-by-phone card for the quote-request forms.
 *
 * The home page's car rental, cruise and vacation tabs hand over to a quote
 * form rather than a results page; while bookings are taken by phone that form
 * leads with the number. Renders nothing until a phone number is configured.
 */
export function CallPrompt({ className }: { className?: string }) {
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);

  if (!phone || !phoneDisplay) return null;

  return (
    <div
      className={cn(
        "rounded-xs bg-primary-softer p-5 ring-1 ring-inset ring-border",
        className,
      )}
    >
      <p className="text-micro font-semibold uppercase tracking-wide text-primary">
        Book by phone
      </p>
      <p className="mt-1.5 text-body-sm text-text-secondary">
        Call and an agent will price the trip and book it with you. Nothing is
        charged until you agree.
      </p>
      <ButtonLink
        href={`tel:${phone}`}
        fullWidth
        className="mt-4"
        icon={<PhoneIcon className="size-4" />}
        aria-label={`Call to book: ${phoneDisplay}`}
      >
        <span className="tabular-nums">Call {phoneDisplay}</span>
      </ButtonLink>
      <p className="mt-2 text-center text-caption text-text-muted">
        Agents available {contactConfig.supportHours}
      </p>
    </div>
  );
}
