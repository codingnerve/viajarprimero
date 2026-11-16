import { CheckIcon } from "@/components/ui/icons";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * A static promise row under the hero, with the number at its end. Quieter than
 * the English page's scrolling ticker: three ticks, then the line to ring.
 */
export function LandingEsStrip({
  phone,
  phrases,
}: {
  phone: LandingPhone;
  phrases: readonly string[];
}) {
  return (
    <div className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-8 gap-y-3 px-gutter py-4">
        {phrases.map((phrase) => (
          <p
            key={phrase}
            className="flex items-center gap-2 text-body-sm font-medium text-text"
          >
            <CheckIcon className="size-4 text-success" />
            {phrase}
          </p>
        ))}
        <a
          href={phone.href}
          className="rounded-md text-h5 tabular-nums text-primary transition-colors hover:text-primary-hover focus-ring"
        >
          {phone.display}
        </a>
      </div>
    </div>
  );
}
