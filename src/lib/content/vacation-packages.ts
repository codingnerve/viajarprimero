import data from "@/lib/content/vacation-packages.json";

/**
 * Vacation package ideas, read from `vacation-packages.json`.
 *
 * A JSON file for the same reason the blog imagery is one: the contents are
 * placeholders and replacing them is an edit to data, not to code.
 *
 * ## What these are, and what they are not
 *
 * They are the *shape* of a trip — where, how long, what board basis, what a
 * package for it normally covers. All of that is true of the destination
 * rather than of anything we are holding.
 *
 * They are not inventory. No packaging supplier is connected to this site, so
 * there is no price, no departure date, no named hotel and no availability
 * claim anywhere in the file. Each card ends at a quote request, which is the
 * only honest thing it can do.
 *
 * `bundles` is the field that keeps the list from being an advert. Two of the
 * six say a package often will not beat booking the flight and the room
 * separately, because for a short city break it often will not — and a
 * traveller finds that out either way.
 */

export type BundleVerdict = "well" | "sometimes";

export interface VacationPackage {
  slug: string;
  /** The string handed to the quote form. */
  destination: string;
  region: string;
  title: string;
  nights: number;
  board: string;
  bestTime: string;
  summary: string;
  /** What a package for this trip normally covers. Never a price. */
  includes: readonly string[];
  /** Whether bundling usually beats booking the parts separately. */
  bundles: BundleVerdict;
  /** The honest one-liner that goes with the verdict. */
  note: string;
  image: { url: string; alt: string };
}

/** True while the imagery is stock rather than commissioned. */
export const vacationImagesArePlaceholders = data.placeholder;

export const vacationPackages: readonly VacationPackage[] = data.packages.map(
  (entry) => ({
    ...entry,
    bundles: entry.bundles as BundleVerdict,
  }),
);

export function getVacationPackage(slug: string): VacationPackage | undefined {
  return vacationPackages.find((entry) => entry.slug === slug);
}
