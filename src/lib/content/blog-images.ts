import data from "@/lib/content/blog-images.json";

/**
 * Article imagery, read from `blog-images.json`.
 *
 * A JSON file rather than a TypeScript literal because this is the one
 * collection on the site whose contents are expected to be replaced wholesale:
 * the entries are placeholders, and swapping them for commissioned files is an
 * edit to data, not to code. Nothing else needs touching when they change.
 *
 * ## Why a missing entry renders nothing
 *
 * An article with no image gets no image. The obvious alternative — fall back
 * to a generic travel photograph — puts the same stock picture on unrelated
 * pieces, which reads as filler and makes the whole collection look automated.
 * The index and the article page are both designed to work without one, the
 * way `Photo` treats a missing destination file.
 *
 * ## These are placeholders, and the alt text is not
 *
 * `placeholder: true` in the JSON records what they are. The alt text was
 * written after looking at each frame, so it survives the swap being forgotten
 * — a picture with an accurate description is a worse placeholder to leave in
 * than one with a lorem-ipsum caption, which is the point.
 */

export interface BlogImage {
  /** Absolute URL, or a path under `public/` once these are replaced. */
  url: string;
  /** Describes the frame. Never claims whose photograph it is or where. */
  alt: string;
}

const bySlug = new Map<string, BlogImage>(
  data.images.map((image) => [image.slug, { url: image.url, alt: image.alt }]),
);

/** True while the set is stock rather than commissioned. */
export const blogImagesArePlaceholders = data.placeholder;

/**
 * The image for an article, or null when none has been assigned.
 *
 * @example getBlogImage("choosing-a-first-cruise")
 */
export function getBlogImage(slug: string): BlogImage | null {
  return bySlug.get(slug) ?? null;
}
