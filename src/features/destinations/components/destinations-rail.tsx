"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ChevronIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

const AUTO_ADVANCE_MS = 5000;
/** Matches `gap-4` on the list, so a page step lands exactly on the next card. */
const RAIL_GAP_PX = 16;

/**
 * The home page's destination rail.
 *
 * Three cards to a view rather than four-and-a-sliver — a card cut off
 * mid-frame read as a layout bug, not an invitation to scroll. The chevrons
 * page a full view at a time and track real scroll position, so they
 * disappear at either end of the rail.
 *
 * It also pages itself every five seconds, wrapping back to the start at the
 * end. `prefers-reduced-motion` turns that off outright, and hovering or
 * focusing anywhere in the rail pauses it — a card should not slide out from
 * under a pointer that is mid-click on "Read the guide".
 *
 * `children` rather than a `destinations` prop: this shell only needs
 * `scrollLeft`, which is a client-only concern, but the `<DestinationCard>`s
 * it wraps read the filesystem to resolve their photos and must stay on the
 * server. Taking them as pre-rendered children keeps that boundary where it
 * belongs instead of dragging `DestinationCard` into the client bundle.
 */
export function DestinationsRail({
  itemCount,
  children,
}: {
  itemCount: number;
  children: ReactNode;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(itemCount > 1);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      setCanScrollLeft(rail.scrollLeft > 8);
      setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [itemCount]);

  useEffect(() => {
    if (paused || reduced || itemCount < 2) return;

    const timer = setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;

      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollTo({
        left: atEnd ? 0 : rail.scrollLeft + rail.clientWidth + RAIL_GAP_PX,
        behavior: "smooth",
      });
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [paused, reduced, itemCount]);

  const scrollByPage = (direction: 1 | -1) => {
    railRef.current?.scrollBy({
      left: direction * (railRef.current.clientWidth + RAIL_GAP_PX),
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative mt-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <ul ref={railRef} className="rail gap-4 pb-2">
        {children}
      </ul>

      <button
        type="button"
        aria-label="Previous destinations"
        disabled={!canScrollLeft}
        onClick={() => scrollByPage(-1)}
        className={cn(
          "absolute top-1/2 left-1 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full",
          "bg-surface text-text ring-1 ring-border-strong shadow-md",
          "transition-[opacity,box-shadow] duration-[var(--duration-fast)] ease-out hover:shadow-lg",
          "focus-ring disabled:pointer-events-none disabled:opacity-0",
          "md:flex",
        )}
      >
        <ChevronIcon className="size-5 rotate-180" />
      </button>
      <button
        type="button"
        aria-label="Next destinations"
        disabled={!canScrollRight}
        onClick={() => scrollByPage(1)}
        className={cn(
          "absolute top-1/2 right-1 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full",
          "bg-surface text-text ring-1 ring-border-strong shadow-md",
          "transition-[opacity,box-shadow] duration-[var(--duration-fast)] ease-out hover:shadow-lg",
          "focus-ring disabled:pointer-events-none disabled:opacity-0",
          "md:flex",
        )}
      >
        <ChevronIcon className="size-5" />
      </button>
    </div>
  );
}
