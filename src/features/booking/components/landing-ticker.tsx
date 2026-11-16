import { PlaneIcon } from "@/components/ui/icons";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

function Run({
  phone,
  phrases,
  hidden,
}: {
  phone: LandingPhone;
  phrases: readonly string[];
  hidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {phrases.map((phrase) => (
        <li key={phrase} className="flex shrink-0 items-center gap-8">
          <span className="font-display text-h5 italic text-text-on-dark">
            {phrase}
          </span>
          <PlaneIcon className="size-4 shrink-0 text-text-on-dark/70" />
          <a
            href={phone.href}
            tabIndex={hidden ? -1 : undefined}
            className="rounded-sm text-h4 tabular-nums text-text-inverse focus-ring-inverse"
          >
            {phone.display}
          </a>
          <PlaneIcon className="size-4 shrink-0 text-text-on-dark/70" />
        </li>
      ))}
    </ul>
  );
}

/**
 * A departures-board ticker that repeats the number. It runs as two identical
 * runs side by side, translated by exactly one run's width, so the loop has no
 * seam; the second run is hidden from assistive technology and the tab order.
 * Reduced motion gets the first run, still.
 */
export function LandingTicker({
  phone,
  phrases,
}: {
  phone: LandingPhone;
  phrases: readonly string[];
}) {
  return (
    <div className="group overflow-hidden bg-secondary py-4 text-text-inverse">
      <div className="flex w-max animate-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused]">
        <Run phone={phone} phrases={phrases} />
        <Run phone={phone} phrases={phrases} hidden />
      </div>
    </div>
  );
}
