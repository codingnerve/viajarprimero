import fs from "node:fs";
import path from "node:path";

/**
 * Which editorial photographs actually exist on disk.
 *
 * The site ships with almost no photography, and the alternative to this
 * module was a hardcoded `image:` field on every destination and guide that
 * someone has to remember to add at the same moment they add the file. This
 * reads `public/images/<collection>/` instead, so dropping
 * `public/images/destinations/london.jpg` into the repo is the entire act of
 * adding a photo to the London guide — no content edit, no code change.
 *
 * Where a photo does not exist the caller draws a designed plate instead (see
 * components/ui/photo.tsx). That is a deliberate fallback rather than a
 * placeholder to be replaced later: the page is complete without the picture.
 *
 * SERVER ONLY. It touches the filesystem, so importing it from a file carrying
 * "use client" will fail the build. Every page that uses it is a Server
 * Component and every content route is prerendered, so the directory is read
 * at build time and never on a request.
 */

export type PhotoCollection = "destinations" | "guides" | "home" | "hero";

/** Extensions we will pick up, in the order they are preferred. */
const EXTENSIONS = [".avif", ".webp", ".jpg", ".jpeg", ".png"] as const;

/**
 * One read per collection per process. `null` records "the directory is not
 * there", which is a normal state and must not be retried on every card.
 *
 * Disabled in development. The point of this module is that dropping a file
 * into `public/images/` is the whole act of adding a photo, and a cache that
 * lives for the life of the process breaks exactly that: the long-running
 * `next dev` server keeps serving the index it read at boot, so a photo added
 * an hour in renders as the gradient plate until someone restarts the server
 * and concludes the picture is broken. A readdir per render is nothing next to
 * what dev already does, and production still reads each collection once.
 */
const CACHE_ENABLED = process.env.NODE_ENV === "production";

const cache = new Map<PhotoCollection, Map<string, string> | null>();

function indexOf(collection: PhotoCollection): Map<string, string> | null {
  const cached = CACHE_ENABLED ? cache.get(collection) : undefined;
  if (cached !== undefined) return cached;

  const dir = path.join(process.cwd(), "public", "images", collection);

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    if (CACHE_ENABLED) cache.set(collection, null);
    return null;
  }

  const index = new Map<string, string>();

  for (const entry of entries) {
    const ext = path.extname(entry).toLowerCase();
    const extIndex = EXTENSIONS.indexOf(ext as (typeof EXTENSIONS)[number]);
    if (extIndex === -1) continue;

    const slug = path.basename(entry, path.extname(entry));
    const existing = index.get(slug);

    // A slug with both a .webp and a .jpg keeps the better format.
    if (existing) {
      const existingIndex = EXTENSIONS.indexOf(
        path.extname(existing).toLowerCase() as (typeof EXTENSIONS)[number],
      );
      if (existingIndex <= extIndex) continue;
    }

    index.set(slug, `/images/${collection}/${entry}`);
  }

  if (CACHE_ENABLED) cache.set(collection, index);
  return index;
}

/**
 * The public path to a photograph, or `null` if none has been added yet.
 *
 * @example getPhoto("destinations", "london") // "/images/destinations/london.jpg"
 */
export function getPhoto(
  collection: PhotoCollection,
  slug: string,
): string | null {
  return indexOf(collection)?.get(slug) ?? null;
}

/** How many photographs a collection currently has. Used by layouts that
    switch between a photo-led and a type-led treatment wholesale, rather than
    going ragged with three of eight cards illustrated. */
export function photoCount(collection: PhotoCollection): number {
  return indexOf(collection)?.size ?? 0;
}

/**
 * Whether a hand-written public path actually resolves to a file.
 *
 * Content entries can name a photograph explicitly rather than relying on the
 * slug lookup, and those paths are typed by hand — so they go stale when a
 * file is renamed, and they are easy to get subtly wrong ("@/images/..." is a
 * TypeScript alias, not a URL; "images/..." without the leading slash is
 * relative to the current route). Any of those renders a broken image, which
 * is the one outcome worse than no image at all.
 *
 * Checking here means `Photo` can fall through to the gradient plate instead,
 * so a bad path costs a photograph rather than the layout.
 *
 * SERVER ONLY, and cheap: the result is memoised per path and every content
 * route is prerendered, so each distinct path is stat-ed once per build.
 */
const existsCache = new Map<string, boolean>();

export function publicFileExists(publicPath: string): boolean {
  const cached = CACHE_ENABLED ? existsCache.get(publicPath) : undefined;
  if (cached !== undefined) return cached;

  // Only root-relative paths can be resolved against `public/`. An absolute
  // URL is somebody else's server and cannot be checked from here; a bare or
  // aliased path is a mistake. Both are reported as "not ours to verify".
  if (!publicPath.startsWith("/")) {
    if (CACHE_ENABLED) existsCache.set(publicPath, false);
    return false;
  }

  let exists = false;
  try {
    // `decodeURIComponent` because a path may carry an encoded space or accent
    // while the file on disk does not.
    const relative = decodeURIComponent(publicPath).split("/").filter(Boolean);
    exists = fs.statSync(path.join(process.cwd(), "public", ...relative)).isFile();
  } catch {
    exists = false;
  }

  if (CACHE_ENABLED) existsCache.set(publicPath, exists);
  return exists;
}
