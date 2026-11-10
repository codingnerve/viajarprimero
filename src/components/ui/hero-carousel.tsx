"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { PlateFill } from "@/components/ui/plate";
import { cn } from "@/lib/utils/cn";

export interface HeroSlide {
  /** Stable key and the seed for the fallback plate. */
  id: string;
  /** Resolved on the server. `null` renders the gradient plate instead. */
  src: string | null;
  /** Describes the photograph, for the rare case it is not decorative. */
  alt: string;
  /**
   * Shown in the caption chip — the place in the frame.
   *
   * Optional, because not every set has one honestly available. The
   * destination frames name a city and the cruise frames name a ship, both
   * of which are facts. Aircraft photography has no equivalent: a visible
   * registration must not be published on a charter page, and a type read
   * off a photograph is a guess. Those slides carry the credit alone.
   */
  caption?: string;
  /** Second line of the chip: the country, the airport code, a credit. */
  detail?: string;
}

const INTERVAL_MS = 6500;

/**
 * The hero backdrop.
 *
 * A slow crossfade behind the search panel, with a Ken Burns drift on the
 * active frame so a still photograph does not read as a static banner. The
 * navy wash and a ramped scrim sit on top of it, which is what keeps the
 * headline and the panel legible over any photograph that lands here.
 *
 * ── Why this is a client component ────────────────────────────────────────
 * It would be shorter as a pure-CSS crossfade with staggered animation
 * delays, and that version cannot be paused. WCAG 2.2.2 requires a mechanism
 * to stop anything that moves automatically for more than five seconds, so
 * the timer, the pause control and the reduced-motion opt-out are worth the
 * boundary. It is a leaf: the hero, the header and the page around it all
 * stay Server Components.
 *
 * ── What it does not do ───────────────────────────────────────────────────
 * The images are decorative — the destination they show is not information
 * the page depends on — so the slide layer is `aria-hidden` and the caption
 * chip is not a live region. A screen reader gets the headline and the search
 * panel without a running commentary of city names it cannot act on.
 */
export function HeroCarousel({
  slides,
  className,
}: {
  slides: readonly HeroSlide[];
  className?: string;
}) {

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  // Motion preference is read after mount, not during render: the server has
  // no media queries, so consulting it in the initial render would produce
  // markup the client disagrees with.
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!playing || reduced || slides.length < 2) return;

    timer.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, reduced, slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index];
  const moving = playing && !reduced && slides.length > 1;

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      {/* Slides. Decorative: the navy wash above carries the design and the
          copy carries the meaning. */}
      <div aria-hidden="true" className="absolute inset-0">
        {slides.map((slide, slideIndex) => {
          const current = slideIndex === index;

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity ease-in-out",
                "duration-[1200ms] motion-reduce:duration-0",
                current ? "opacity-100" : "opacity-0",
              )}
            >
              {slide.src ? (
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  // The first frame is the largest thing above the fold, so it
                  // is fetched at high priority; the rest are lazy and arrive
                  // long before their turn.
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover",
                    current && moving && "animate-[kenburns_14s_ease-out_forwards]",
                  )}
                />
              ) : (
                <PlateFill seed={slide.id} />
              )}
            </div>
          );
        })}
      </div>

      {/* The brand field, over the photography rather than instead of it.
          `mix-blend-multiply` keeps the picture's structure visible where a
          flat navy panel at the same opacity would flatten it to a tint. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-wash opacity-45 mix-blend-multiply"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-secondary/20" />
      {/* Bottom ramp, so the panel's white edge has something to sit against. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-secondary/60 to-transparent"
      />

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-page items-end justify-between gap-4 px-gutter pb-5 md:pb-6">
            {/* Where the picture was taken. Visible content, so it is not
                inside the aria-hidden layer above. */}
            <p
              key={active.id}
              className="animate-fade text-caption text-white/70 motion-reduce:animate-none"
            >
              {active.caption && (
                <span className="font-semibold text-white/90">
                  {active.caption}
                </span>
              )}
              {active.detail && (
                <span>
                  {active.caption ? " · " : ""}
                  {active.detail}
                </span>
              )}
            </p>

            <div className="flex shrink-0 items-center gap-3">
              <ul className="flex items-center gap-1.5">
                {slides.map((slide, slideIndex) => {
                  const current = slideIndex === index;

                  return (
                    <li key={slide.id}>
                      <button
                        type="button"
                        aria-label={`Show ${slide.caption ?? `slide ${slideIndex + 1}`}`}
                        aria-current={current ? "true" : undefined}
                        onClick={() => {
                          setIndex(slideIndex);
                          setPlaying(false);
                        }}
                        className="group grid h-8 place-items-center px-0.5 focus-ring-inverse"
                      >
                        <span
                          className={cn(
                            "block h-1 rounded-full transition-all duration-[var(--duration-normal)] ease-out",
                            current
                              ? "w-7 bg-white"
                              : "w-3 bg-white/40 group-hover:bg-white/70",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                aria-pressed={!playing}
                className={cn(
                  "grid size-8 place-items-center rounded-full",
                  "bg-white/12 text-white ring-1 ring-inset ring-white/20",
                  "transition-colors hover:bg-white/25 focus-ring-inverse",
                )}
              >
                <span className="sr-only">
                  {playing ? "Pause the backdrop" : "Play the backdrop"}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-3"

                >
                  {playing ? (
                    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
                  ) : (
                    <path d="M4.5 2.5 13 8l-8.5 5.5z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
