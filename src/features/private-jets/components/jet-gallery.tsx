"use client";

import Image from "next/image";
import { useState } from "react";

import { ChevronIcon } from "@/components/ui/icons";
import { PlateFill } from "@/components/ui/plate";
import { cn } from "@/lib/utils/cn";

/**
 * The aircraft photography on a result card.
 *
 * Operators supply several frames of the same tail — exterior, cabin, cockpit,
 * baggage hold — and on a charter search those are the decision. Somebody
 * choosing between a Phenom and a Hawker is choosing a cabin they will sit in
 * for three hours, and one exterior shot cannot answer that.
 *
 * ## Why only the active frame is mounted
 *
 * A results page carries up to twenty-four cards and the supplier sends as
 * many as fifteen images per aircraft. Rendering them all so they can
 * cross-fade would put hundreds of requests on a page nobody has scrolled yet.
 * So one frame is mounted at a time, keyed by index, and the key change gives
 * the fade. The browser caches what it has already fetched, so stepping back
 * is instant.
 *
 * ## Why the arrows are buttons inside a card that is itself a link
 *
 * The card has a link covering it so clicking anywhere opens the request. That
 * overlay sits *below* this gallery in the stacking order, which is what lets
 * these buttons be clicked at all — and it means the photograph is not itself
 * a link. That is the right trade: a traveller flicking through cabin shots is
 * not trying to navigate, and being thrown onto the quote form mid-gallery
 * would be the bug.
 */
export function JetGallery({
  images,
  alt,
  seed,
  sizes,
  className,
}: {
  images: readonly string[];
  /** Describes the aircraft, not the frame — the frame index is appended. */
  alt: string;
  /** Fallback tint when the operator supplied no photography. */
  seed: string;
  sizes: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={cn("relative overflow-hidden bg-gray-100", className)}>
        {/*
          A tinted plate rather than a stock aeroplane. Borrowing another
          aircraft's photograph to fill a gap is how a traveller ends up
          expecting an interior that was never on offer.
        */}
        <PlateFill seed={seed} label="Aircraft" />
      </div>
    );
  }

  const step = (delta: number) =>
    setIndex((current) => (current + delta + images.length) % images.length);

  const multiple = images.length > 1;

  return (
    <div
      className={cn(
        "group/gallery relative overflow-hidden bg-gray-100",
        className,
      )}
    >
      <Image
        key={index}
        src={images[index]}
        alt={index === 0 ? alt : `${alt} — photo ${index + 1}`}
        fill
        sizes={sizes}
        className="animate-fade object-cover motion-reduce:animate-none"
      />

      {multiple && (
        <>
          {/*
            A scrim behind the controls rather than over the whole frame. The
            arrows sit on photographs whose corners are sometimes bright sky
            and sometimes dark hangar, and a white-on-white arrow is invisible
            in exactly the cases a traveller needs it.
          */}
          <GalleryButton
            direction="previous"
            onClick={() => step(-1)}
            className="left-2"
          />
          <GalleryButton
            direction="next"
            onClick={() => step(1)}
            className="right-2"
          />

          {/*
            Dots rather than "3 / 15": at this size the count is unreadable,
            and what the traveller needs to know is that there is more to see,
            not precisely how much.
          */}
          <ul
            aria-hidden="true"
            className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5"
          >
            {images.map((image, dot) => (
              <li
                key={image}
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-[var(--duration-fast)]",
                  dot === index ? "bg-white" : "bg-white/45",
                )}
              />
            ))}
          </ul>

          {/*
            Screen readers get the position as text; the dots above are
            decorative because a list of six identical dots is noise.
          */}
          <p className="sr-only" role="status">
            Photo {index + 1} of {images.length}
          </p>
        </>
      )}
    </div>
  );
}

function GalleryButton({
  direction,
  onClick,
  className,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${direction === "next" ? "Next" : "Previous"} photo`}
      className={cn(
        "absolute top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center",
        "rounded-full bg-black/45 text-white backdrop-blur-sm",
        "transition-[opacity,background-color] duration-[var(--duration-fast)]",
        "hover:bg-black/65 focus-ring-inverse",
        /*
          Always visible on touch, where there is no hover to reveal them, and
          revealed on hover or keyboard focus on a pointer device.
        */
        "md:opacity-0 md:group-hover/gallery:opacity-100 md:focus-visible:opacity-100",
        className,
      )}
    >
      <ChevronIcon
        className={cn("size-4", direction === "previous" && "rotate-180")}
      />
    </button>
  );
}
