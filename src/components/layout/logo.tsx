import Image from "next/image";

import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The brand asset, in two cuts.
 *
 * `lockup` is the full horizontal asset: globe-and-plane mark plus the
 * `viajarprimero.com` wordmark. This replaces a wordmark that was drawn from
 * SVG primitives because no real logo existed yet. One does now, so the
 * drawing is gone — a hand-built approximation sitting next to the actual
 * logo on the same page is worse than either on its own.
 *
 * `wordmark` is that same file cropped to the type alone, and exists for the
 * header. In the lockup the globe is the tallest thing in the frame and the
 * type only fills the middle 142 of its 230 pixels, so a CSS height sized to
 * fit the bar leaves the words reading around 60% of it — small next to the
 * nav links. Cropping to the type's own bounding box means the height applies
 * to the type itself, so the same vertical space in the bar buys visibly
 * larger words. It is a crop of the real asset, not a re-drawing: the letter
 * shapes and spacing are untouched.
 *
 * `tone="inverse"` is not a filter or an `invert()`: it swaps in a separate
 * file in which the blue is white and the orange is untouched. Inverting the
 * full-colour asset would turn the orange plane a cyan that is nowhere in the
 * palette, and a plain white silhouette would fill in the globe's continents,
 * which are knocked out of the mark rather than painted on it.
 *
 * Intrinsic size is each asset's own. Height is set in CSS with an auto width
 * so the art scales as one object, and `sizes` keeps the generated srcset on
 * the small rungs of `imageSizes` in next.config rather than shipping the
 * full-width original into a 36px-tall slot.
 */
const VARIANTS = {
  lockup: {
    src: {
      default: "/images/brand/logo.png",
      inverse: "/images/brand/logo-inverse.png",
    },
    width: 1202,
    height: 230,
    sizes: "(min-width: 768px) 192px, 148px",
    size: "h-7 w-auto md:h-9",
  },
  wordmark: {
    src: {
      default: "/images/brand/wordmark.png",
      inverse: "/images/brand/wordmark-inverse.png",
    },
    width: 926,
    height: 146,
    sizes: "(min-width: 768px) 178px, 128px",
    size: "h-5 w-auto md:h-7",
  },
} as const;

export function Logo({
  className,
  variant = "lockup",
  tone = "default",
  priority = false,
}: {
  className?: string;
  /** `wordmark` drops the globe mark so the type can carry the full height. */
  variant?: "lockup" | "wordmark";
  tone?: "default" | "inverse";
  /** Set on the header instance, which is in the first viewport on every page. */
  priority?: boolean;
}) {
  const asset = VARIANTS[variant];

  return (
    <Image
      src={asset.src[tone]}
      alt={siteConfig.name}
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={asset.sizes}
      className={cn(asset.size, className)}
    />
  );
}
