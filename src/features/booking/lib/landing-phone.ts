import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";

export interface LandingPhone {
  href: string;
  display: string;
  hours: string;
}

/**
 * The line a flight landing page rings — the English page's own line, or the
 * Spanish line for `/esflights` — or `null` while the number is still a
 * placeholder: a call button that dials a `TODO_` token is worse than none.
 */
export function getLandingPhone(lang: "en" | "es" = "en"): LandingPhone | null {
  const phone = configured(
    lang === "es" ? contactConfig.phoneEs : contactConfig.phoneFlightLanding,
  );
  const display = configured(
    lang === "es"
      ? contactConfig.phoneDisplayEs
      : contactConfig.phoneDisplayFlightLanding,
  );

  return phone && display
    ? { href: `tel:${phone}`, display, hours: contactConfig.supportHours }
    : null;
}
