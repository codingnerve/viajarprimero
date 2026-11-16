import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";

export interface LandingPhone {
  href: string;
  display: string;
  hours: string;
}

/**
 * The line the flight landing page rings, or `null` while the number is still a
 * placeholder — a call button that dials a `TODO_` token is worse than none.
 */
export function getLandingPhone(): LandingPhone | null {
  const phone = configured(contactConfig.phoneFlightLanding);
  const display = configured(contactConfig.phoneDisplayFlightLanding);

  return phone && display
    ? { href: `tel:${phone}`, display, hours: contactConfig.supportHours }
    : null;
}
