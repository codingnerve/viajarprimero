import fs from "node:fs";
import path from "node:path";

/**
 * Airline marks, matched to a carrier name by what the filename contains.
 *
 * The files were dropped into `public/images/airline-logos/` from a logo
 * archive, so the names are whatever that archive called them —
 * `0082_Air-France-Logo.jpg`, `Delta-Air-Lines-logo-tumb.jpg`,
 * `All-Nippon-Airways-Logo-tumb.jpg`. There is no manifest and no code in
 * them, which is why this matches on the name rather than on an IATA
 * designator.
 *
 * ## Matching, and why it is not a straight `includes`
 *
 * A naive substring test finds a mark for every carrier whose name starts
 * "Air" — the set contains sixty of them — so "Air France" would happily
 * resolve to Air Gabon. Three passes, narrowest first:
 *
 *   1. The whole normalised name equals the normalised filename.
 *   2. The whole normalised name appears inside it. "Air India" matches both
 *      `Air-India-Logo` and `Air-India-Express-Logo`, so the shortest
 *      candidate wins and the plain carrier beats its subsidiary.
 *   3. The first word, and only when it is six characters or more — enough for
 *      "Lufthansa" or "American" and short enough to exclude "Air", which is
 *      the token that would do the damage.
 *
 * Before any of that, a mark filed under `iata/<CODE>.png` wins outright when
 * the caller knows the designator — that match is exact, not a guess.
 *
 * Anything that fails all three gets no logo, and the card falls back to the
 * carrier's designator on a brand plate. That fallback is the normal case, not
 * an error state: the archive is heavily weighted towards carriers beginning
 * with A, and most searches turn up airlines that are simply not in it.
 *
 * ## What this must not do
 *
 * Guess. A mark shown against the wrong carrier is worse than no mark — it is
 * a false statement about who operates the flight, on a page whose whole point
 * is that the schedules are real. The three passes above are deliberately
 * conservative for that reason.
 *
 * SERVER ONLY. It reads the filesystem, so importing it from a file carrying
 * "use client" will fail the build.
 */

const DIRECTORY = path.join(process.cwd(), "public", "images", "airline-logos");

const EXTENSIONS = [".svg", ".webp", ".png", ".jpg", ".jpeg"] as const;

/**
 * Words the archive appends to every file, plus the numeric prefixes and
 * thumbnail sizes. Stripping them is what lets `Air-France` fall out of
 * `0082_Air-France-Logo.jpg`.
 *
 * "tumb" is in here twice over because the archive misspells "thumb" in most
 * of its filenames and correctly in the rest.
 */
const NOISE = /(logo|tumb|thumb|500x281|copy|\d+x\d+)/g;

/**
 * "Air France" and "0082_Air-France-Logo.jpg" both reduce to "airfrance".
 *
 * Accents are decomposed and their marks dropped rather than stripped with
 * the rest of the punctuation. Deleting the character outright turned
 * "Aeroméxico" into "aeromxico", which matches nothing — the archive files it
 * as `Aeromexico-Logo-tumb.png`, unaccented, as most of them are.
 */
function normalise(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(NOISE, "")
    .replace(/[^a-z0-9]/g, "");
}

interface LogoEntry {
  /** Normalised filename, for matching. */
  key: string;
  /** Public path, ready for next/image. */
  src: string;
}

let index: readonly LogoEntry[] | null = null;

function entries(): readonly LogoEntry[] {
  if (index) return index;

  let files: string[];
  try {
    files = fs.readdirSync(DIRECTORY);
  } catch {
    // A missing directory is a normal state — every card falls back to its
    // plate and nothing on the page breaks.
    index = [];
    return index;
  }

  const found: LogoEntry[] = [];

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (!EXTENSIONS.includes(extension as (typeof EXTENSIONS)[number])) continue;

    /*
      The archive prefixes some files with an index — `0082_Air-France-Logo`.
      It is not part of the airline's name and would otherwise sit inside the
      normalised key, where it cannot match anything.
    */
    const base = path.basename(file, extension).replace(/^\d+[_-]/, "");
    const key = normalise(base);
    if (!key) continue;

    found.push({ key, src: `/images/airline-logos/${encodeURIComponent(file)}` });
  }

  index = found;
  return index;
}

/**
 * The mark for a carrier, or null when the archive has nothing for it.
 *
 * @example getAirlineLogo("Delta Air Lines")
 *          // "/images/airline-logos/Delta-Air-Lines-logo-tumb.jpg"
 * @example getAirlineLogo("Turkish Airlines") // null — not in the archive
 */
export function getAirlineLogo(
  carrierName: string,
  code?: string,
): string | null {
  // 0 — a mark filed by IATA designator in `iata/`, which is exact.
  const designator = code?.trim().toUpperCase();
  if (designator && /^[A-Z0-9]{2}$/.test(designator)) {
    if (fs.existsSync(path.join(DIRECTORY, "iata", `${designator}.png`))) {
      return `/images/airline-logos/iata/${designator}.png`;
    }
  }

  const name = normalise(carrierName);
  if (name.length < 3) return null;

  const all = entries();

  // 1 — the whole name, exactly.
  const exact = all.find((entry) => entry.key === name);
  if (exact) return exact.src;

  // 2 — the whole name, contained. Shortest wins, so a carrier beats its own
  //     subsidiary: "Air India" takes Air India, not Air India Express.
  const contained = all
    .filter((entry) => entry.key.includes(name))
    .sort((a, b) => a.key.length - b.key.length);
  if (contained.length > 0) return contained[0].src;

  /*
    3 — the first word, and only a distinctive one. Six characters is the
    threshold that keeps "Lufthansa" and "American" while excluding "Air",
    which on its own would match sixty unrelated carriers.
  */
  const firstWord = carrierName.trim().split(/\s+/)[0] ?? "";
  const token = normalise(firstWord);
  if (token.length < 6) return null;

  const byToken = all
    .filter((entry) => entry.key.startsWith(token))
    .sort((a, b) => a.key.length - b.key.length);

  return byToken.length > 0 ? byToken[0].src : null;
}
