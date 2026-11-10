import { siteConfig } from "@/lib/config/site";

/**
 * Formats a minor-unit amount (cents) as a price string.
 *
 * Fares are held in minor units so that arithmetic on money never runs through
 * a float: a total that disagrees with the sum of its parts by a cent is a
 * billing-transparency problem, not a rounding curiosity.
 */
export function formatCurrency(
  amountInMinorUnits: number,
  currency: string = siteConfig.currency,
  options: { showCents?: boolean } = {},
): string {
  const { showCents = amountInMinorUnits % 100 !== 0 } = options;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amountInMinorUnits / 100);
}
