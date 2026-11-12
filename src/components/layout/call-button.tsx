import { PhoneIcon } from "@/components/ui/icons";
import { configured } from "@/lib/config/placeholders";
import { phoneFor, type PhoneLine } from "@/lib/config/site";
import { esChrome } from "@/lib/content/es/chrome";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/types/locale";

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
 * The phone glyph appears once, in the white disc. The caption beside it used
 * to repeat the same icon inline, which read as two separate affordances.
 *
 * That caption is full white, not the `white/85` it used to be. Blended over
 * `--color-primary` the veiled version measures ~4.5:1, which sits exactly on
 * the AA threshold — fine at 13px, not fine now the label is 10px. Full white
 * on the same blue is ~5.6:1.
 */
export function CallButton({
  className,
  locale = "en",
  line: lineKey = locale,
}: {
  className?: string;
  locale?: Locale;
  line?: PhoneLine;
}) {
  const line = phoneFor(lineKey);
  const phone = configured(line.phone);
  const phoneDisplay = configured(line.phoneDisplay);

  if (!phone || !phoneDisplay) return null;

  const href = `tel:${phone}`;
  const label =
    locale === "es"
      ? esChrome.call.aria(phoneDisplay)
      : `Call our travel agents: ${phoneDisplay}`;

  return (
    <>
      <a
        href={href}
        aria-label={label}
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-lg",
          "bg-accent text-text-inverse",
          // Compact again between `xl` and `2xl`, where the full nav fills the bar.
          "transition-colors hover:bg-accent-hover hover:text-text-inverse focus-ring md:hidden xl:inline-flex 2xl:hidden",
          className,
        )}
      >
        <PhoneIcon className="size-5" />
      </a>

      <a
        href={href}
        aria-label={label}
        className={cn(
          "relative hidden h-11 items-center gap-2.5 rounded-lg pl-2 pr-4 md:inline-flex xl:hidden 2xl:inline-flex",
          "bg-accent text-text-inverse",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:bg-accent-hover hover:text-text-inverse focus-ring",
          className,
        )}
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface text-primary">
          <PhoneIcon className="size-3.5" />
        </span>

        <span className="flex flex-col leading-none">
          <span className="text-micro uppercase leading-none">
            {locale === "es" ? esChrome.call.label : "Call our agents"}
          </span>
          <span className="mt-1 text-h6 font-bold leading-none tabular-nums">
            {phoneDisplay}
          </span>
        </span>
      </a>
    </>
  );
}
