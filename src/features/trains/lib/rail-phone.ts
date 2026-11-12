import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";

/**
 * The sales line for the rail pages, or `null` while the number is still a
 * placeholder — a call button that dials a `TODO_` token is worse than none.
 */
export function getRailPhone(): { href: string; display: string } | null {
  const phone = configured(contactConfig.phoneTrains);
  const display = configured(contactConfig.phoneDisplayTrains);

  return phone && display ? { href: `tel:${phone}`, display } : null;
}
