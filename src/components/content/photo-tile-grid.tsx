import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { PhotoCollection } from "@/lib/content/images";

export interface PhotoTile {
  href: string;
  title: string;
  subtitle?: string;
  /** Basename looked up in the photo collection; also seeds the fallback plate. */
  photoSlug: string;
  /** Explicit "/images/..." path, when the file is not named after the slug. */
  src?: string;
  collection?: PhotoCollection;
  alt: string;
}

/**
 * A grid of photo-led link tiles — "Hotels in London", "Cars in Rome".
 *
 * A tile without a photograph on disk gets the brand plate in the same frame,
 * so the grid never reflows and never shows a broken image.
 *
 * SERVER ONLY — `Photo` reads the filesystem.
 */
export function PhotoTileGrid({ tiles }: { tiles: readonly PhotoTile[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <li key={tile.href}>
          <Link
            href={tile.href}
            className="group block overflow-hidden rounded-xs ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none focus-ring"
          >
            <Photo
              collection={tile.collection ?? "destinations"}
              slug={tile.photoSlug}
              src={tile.src}
              alt={tile.alt}
              sizes="(min-width: 992px) 18rem, (min-width: 576px) 45vw, 90vw"
              overlay
              className="aspect-[4/3] w-full"
              imageClassName="transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transform-none"
            >
              <div className="absolute inset-x-0 bottom-0 p-4">
                {tile.subtitle && (
                  <p className="text-overline uppercase text-white/75">
                    {tile.subtitle}
                  </p>
                )}
                <p className="mt-1 flex items-center justify-between gap-2 text-h3 text-text-inverse">
                  {tile.title}
                  <ArrowRightIcon className="size-5 shrink-0 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
              </div>
            </Photo>
          </Link>
        </li>
      ))}
    </ul>
  );
}
