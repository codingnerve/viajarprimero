import { cn } from "@/lib/utils/cn";

/**
 * The designed stand-in for a photograph.
 *
 * It lives in its own module, apart from `Photo`, for one reason: `Photo` asks
 * the filesystem whether a picture exists, and anything that imports it drags
 * `node:fs` along. The hero carousel is a Client Component that needs the
 * plate but must never see `fs` — importing it from `photo.tsx` fails the
 * build with "the chunking context does not support external modules". So the
 * plate is server- and client-safe, and `Photo` composes it.
 *
 * This is a fallback, not a placeholder to be replaced later: a page whose
 * pictures have not been supplied is finished, not broken.
 */

/**
 * Six brand-consistent gradient pairs.
 *
 * Every one is drawn from the palette in globals.css — the blues, the navy and
 * the accent — so a wall of plates reads as one family rather than as six
 * random swatches. They are deliberately deep: a plate carries white type, and
 * the same contrast rules apply to it as to a photograph.
 */
const PLATES = [
  "from-[#12386f] via-[#1d4fa8] to-primary",
  "from-[#0a1f3d] via-[#173a6b] to-[#2f6fb0]",
  "from-[#123b52] via-[#1a5b73] to-[#2b8ea6]",
  "from-[#25204a] via-[#3a2d6b] to-[#5546a8]",
  "from-[#0a1f3d] via-[#3a2c46] to-[#a35b1e]",
  "from-[#10314a] via-[#215a63] to-[#3f8f6b]",
] as const;

/**
 * Deterministic, not random.
 *
 * The plate for a given slug has to be identical on the server and on the
 * client or React reports a hydration mismatch, and identical between builds
 * or the London card changes colour every deploy. A cheap string hash gives
 * both.
 */
function plateFor(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return PLATES[Math.abs(hash) % PLATES.length];
}

export function PlateFill({
  seed,
  label,
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 bg-gradient-to-br",
        plateFor(seed),
        className,
      )}
    >
      {/*
        A flat two-stop gradient still reads as a placeholder. The grid and the
        soft highlight give it enough structure to pass as a designed surface,
        and both are drawn in CSS so they cost nothing to download.
      */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(120% 90% at 30% 0%, #000 20%, transparent 75%)",
        }}
      />
      <div className="absolute -left-1/4 -top-1/3 size-2/3 rounded-full bg-white/12 blur-3xl" />
      {label && (
        <span className="absolute bottom-4 left-5 text-display-lg leading-none text-white/22">
          {label}
        </span>
      )}
    </div>
  );
}

/** "mexico-city" -> "MC". Two letters is enough to make a plate specific. */
export function initials(slug: string): string {
  return slug
    .split("-")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
