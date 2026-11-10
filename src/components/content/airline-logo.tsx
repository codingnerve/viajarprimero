import Image from "next/image";

import { getAirlineLogo } from "@/lib/content/airline-logos";
import { cn } from "@/lib/utils/cn";

/**
 * An airline's mark, or its IATA code on a plain tile when no file exists.
 *
 * Wherever an airline is named in a list or a heading, the mark sits beside
 * the name so the carrier is recognisable at a glance. The name is always
 * rendered next to it, so the image itself is decorative.
 *
 * SERVER ONLY — the lookup reads the filesystem.
 */
export function AirlineLogo({
  code,
  name,
  className,
}: {
  code: string;
  name: string;
  /** Sets the frame size. Defaults to a 96×40 tile. */
  className?: string;
}) {
  const src = getAirlineLogo(name, code);

  return (
    <span
      className={cn(
        "relative flex h-10 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-surface",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="6rem"
          className="object-contain p-1"
        />
      ) : (
        <span className="text-h6 tabular-nums tracking-wide text-text-muted">
          {code}
        </span>
      )}
    </span>
  );
}
