"use client";

import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils/cn";

/**
 * The hero backdrop, as footage.
 *
 * Same treatment as the carousel it replaces — navy wash, bottom ramp — so
 * the headline and the search panel stay legible over whatever frame is on
 * screen. The clip is decorative: it carries no information the page depends
 * on, so it is `aria-hidden` and muted.
 *
 * ── Why this is a client component ────────────────────────────────────────
 * WCAG 2.2.2 requires a mechanism to stop anything that moves automatically
 * for more than five seconds, and `prefers-reduced-motion` has to hold the
 * first frame rather than play. Both need the element, so the boundary is
 * worth it. It is a leaf: the hero and the page around it stay Server
 * Components.
 */
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  /** First frame stand-in while the clip loads. `null` renders the wash alone. */
  poster?: string | null;
  className?: string;
}) {
  const es = useLocale() === "es";
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  // Read after mount, not during render: the server has no media queries, so
  // consulting one in the initial render produces markup the client disagrees
  // with.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    if (playing && !reduced) {
      // A rejected play() is normal — a browser can refuse autoplay whatever
      // the muted attribute says. The poster stays up and the pause control
      // reads as playing, so the caller is left with a still frame rather
      // than an unhandled rejection.
      void element.play().catch(() => setPlaying(false));
    } else {
      element.pause();
    }
  }, [playing, reduced]);

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      <video
        ref={video}
        aria-hidden="true"
        // autoPlay is on so the clip starts before hydration; the effect above
        // is what keeps it honest afterwards.
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
        className="absolute inset-0 size-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* The brand field, over the footage rather than instead of it.
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

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-page justify-end px-gutter pb-5 md:pb-6">
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
              {es
                ? playing
                  ? "Pausar el video de fondo"
                  : "Reproducir el video de fondo"
                : playing
                  ? "Pause the backdrop"
                  : "Play the backdrop"}
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
  );
}
