import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Guide } from "@/lib/content/guides";
import { cn } from "@/lib/utils/cn";

/**
 * Guide summary card.
 *
 * The link wraps the heading rather than the card so that the accessible name
 * of the link is the guide title — a whole-card anchor announces the summary
 * and the metadata as part of the link text, which is worse to listen to. The
 * `after` pseudo-element on that anchor then covers the card, so a pointer
 * still gets the whole tile as a target. Best of both.
 *
 * `media` is opt-in. A guide index reads better as a dense typographic list
 * than as nine illustrated tiles, so the picture is for the places where the
 * card is one of two or three — a related-reading rail, a landing page.
 */
export function GuideCard({
  guide,
  headingLevel: Heading = "h3",
  media = false,
  className,
}: {
  guide: Guide;
  /**
   * The card sits under a section heading in some places and directly under a
   * page h1 on the index, where an h3 would skip a level and break the
   * screen-reader outline. Size comes from the type token either way, so the
   * tag can follow the outline rather than the styling.
   */
  headingLevel?: "h2" | "h3";
  media?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface",
        "ring-1 ring-inset ring-border",
        "transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out",
        "hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none",
        "has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary",
        className,
      )}
    >
      {media && (
        <Photo
          collection="guides"
          slug={guide.slug}
          alt={guide.title}
          sizes="(min-width: 992px) 24rem, 90vw"
          className="aspect-[16/9] w-full"
          imageClassName="transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transform-none"
        />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info" size="sm">
            {guide.category}
          </Badge>
          <span className="text-caption text-text-muted">
            {guide.readingMinutes} min read
          </span>
        </div>

        <Heading className="mt-3 text-h4 text-text">
          <Link
            href={`/guides/${guide.slug}`}
            className="rounded-sm outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
          >
            {guide.title}
          </Link>
        </Heading>

        <p className="mt-2 flex-1 text-body-sm text-text-secondary">
          {guide.summary}
        </p>

        <span
          aria-hidden="true"
          className="mt-4 flex items-center gap-1.5 text-body-sm font-semibold text-primary"
        >
          Read the guide
          <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
