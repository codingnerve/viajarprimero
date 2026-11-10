"use client";

import Image from "next/image";
import { useState } from "react";

import { PlateFill } from "@/components/ui/plate";
import { cn } from "@/lib/utils/cn";

/**
 * Hotel gallery.
 *
 * A large frame with a thumbnail strip under it. The strip is a radiogroup
 * rather than a list of buttons, because that is what it is — one of these is
 * selected — and it gives arrow-key navigation for free in the pattern screen
 * reader users expect.
 *
 * Only the first image is `priority`; it is the largest thing above the fold
 * on the details page and the one that decides LCP. The rest are lazy, which
 * matters because a property can return thirty photographs.
 */
export function HotelGallery({
  images,
  alt,
  seed,
}: {
  images: readonly string[];
  alt: string;
  /** Fallback plate seed when the property has no photography. */
  seed: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
        <PlateFill seed={seed} label={alt.slice(0, 2).toUpperCase()} />
      </div>
    );
  }

  // Six is as many as fit the strip without the thumbnails becoming
  // unreadable; the count on the last one says how many are not shown.
  const thumbnails = images.slice(0, 6);
  const hidden = images.length - thumbnails.length;

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          key={images[active]}
          src={images[active]}
          alt={active === 0 ? alt : `${alt} — photograph ${active + 1}`}
          fill
          sizes="(min-width: 992px) 60vw, 100vw"
          priority={active === 0}
          className="animate-fade object-cover motion-reduce:animate-none"
        />
      </div>

      {images.length > 1 && (
        <div
          role="radiogroup"
          aria-label={`${alt} photographs`}
          className="mt-3 grid grid-cols-6 gap-2"
        >
          {thumbnails.map((image, index) => {
            const selected = index === active;
            const last = index === thumbnails.length - 1;

            return (
              <button
                key={image}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Photograph ${index + 1} of ${images.length}`}
                onClick={() => setActive(index)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100",
                  "transition-[opacity,box-shadow] duration-[var(--duration-fast)] focus-ring",
                  selected
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="12vw"
                  className="object-cover"
                />
                {last && hidden > 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-secondary/70 text-body-sm font-semibold text-text-inverse">
                    +{hidden}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
