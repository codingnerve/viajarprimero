import Image from "next/image";

import { initials, PlateFill } from "@/components/ui/plate";
import {
  getPhoto,
  publicFileExists,
  type PhotoCollection,
} from "@/lib/content/images";
import { cn } from "@/lib/utils/cn";

/**
 * An editorial image, or a designed stand-in for one.
 *
 * This is the drop-in slot: if `public/images/<collection>/<slug>.jpg` exists
 * it is rendered through next/image at the sizes the caller asks for, and if
 * it does not, the same frame is filled with a brand gradient plate carrying
 * the subject's initials. Both are the same shape and the same aspect ratio,
 * so a grid does not reflow when a photograph is added — and a half-
 * illustrated grid still looks deliberate.
 *
 * SERVER ONLY: `getPhoto` reads the filesystem, so importing this from a
 * Client Component fails the build. A client component that needs the fallback
 * imports `PlateFill` from ui/plate directly, which carries no such
 * dependency.
 */
export function Photo({
  collection,
  slug,
  src: explicitSrc,
  alt,
  sizes,
  label,
  priority = false,
  className,
  imageClassName,
  overlay = false,
  children,
}: {
  collection: PhotoCollection;
  /** File basename to look for, and the seed for the fallback plate. */
  slug: string;
  /**
   * An explicit path, which wins over the filesystem lookup.
   *
   * The lookup handles the common case — drop a file named after the slug into
   * the collection folder and it appears. This is the escape hatch for a
   * picture that lives somewhere else or is shared between entries.
   *
   * It must be a path from the web root ("/images/...") or an absolute URL.
   * A "@/images/..." value is a TypeScript path alias, not a URL: the bundler
   * resolves it at build time and the browser cannot, so it yields a broken
   * image. Anything under "public/" is served from the root.
   */
  src?: string;
  /** Describes the photograph. Ignored by the fallback, which is decorative. */
  alt: string;
  sizes: string;
  /** Drawn on the fallback plate. Defaults to the slug's initials. */
  label?: string;
  priority?: boolean;
  /** Sets the frame: aspect ratio, radius, position. */
  className?: string;
  imageClassName?: string;
  /** Ramped scrim, for frames that carry text over the image. */
  overlay?: boolean;
  /** Rendered above the image and the scrim. */
  children?: React.ReactNode;
}) {
  /*
    A caller-supplied path wins, but only if it points at a file that is really
    there. These paths are typed by hand in the content modules, so the two
    ways they go wrong are a stale filename and the `@/images/...` form — which
    is a TypeScript alias resolved at build time, not a URL a browser can
    request. Either renders a broken image, so a path that does not resolve is
    discarded here and the slug lookup and then the gradient plate take over. A
    designed fallback beats a broken <img>.
  */
  const usableExplicitSrc =
    explicitSrc && publicFileExists(explicitSrc) ? explicitSrc : null;

  const src = usableExplicitSrc ?? getPhoto(collection, slug);

  return (
    <div className={cn("relative overflow-hidden bg-gray-100", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <PlateFill seed={slug} label={label ?? initials(slug)} />
      )}

      {overlay && <div aria-hidden="true" className="absolute inset-0 bg-photo-scrim" />}

      {children}
    </div>
  );
}
