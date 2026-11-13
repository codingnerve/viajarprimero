import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Section header: optional eyebrow, a title, an optional description, and an
 * optional action. Centered by default, with the action stacked beneath;
 * `align="start"` restores the left-aligned layout with the action pinned right.
 *
 * The eyebrow is deliberately opt-in and should stay rare. A page that puts a
 * small uppercase blue label above every single heading is not building
 * hierarchy — it is repeating the same emphasis six times, which flattens the
 * page and is one of the more recognisable tells of a generated layout. Reach
 * for it when a section genuinely needs a category label above it, not as
 * default decoration.
 *
 * When it is used, it now carries a short rule beside it rather than floating
 * as loose uppercase text, which is what stops it reading as a stray caption.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Tag = "h2",
  tone = "default",
  size = "md",
  className,
  action,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  as?: "h2" | "h3";
  /** `inverse` for the navy band, where the default greys disappear. */
  tone?: "default" | "inverse";
  /**
   * `lg` opens a page or a major band; `md` is every other section; `xl` is
   * the larger, easier-to-read heading the home page uses.
   */
  size?: "md" | "lg" | "xl";
  className?: string;
  action?: ReactNode;
  id?: string;
}) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        // `cn` does not merge conflicting utilities, so each alignment owns its
        // layout classes outright rather than overriding the other's.
        align === "center"
          ? "items-center"
          : "sm:flex-row sm:items-end sm:justify-between sm:gap-10",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          align === "center" && "items-center text-center",
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "flex items-center gap-2.5 uppercase",
              size === "xl" ? "text-body-sm font-semibold tracking-[0.1em]" : "text-overline",
              align === "center" && "justify-center",
              inverse ? "text-gray-400" : "text-primary",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-px w-6",
                inverse ? "bg-white/30" : "bg-primary/40",
              )}
            />
            {eyebrow}
            <span
              aria-hidden="true"
              className={cn(
                "h-px w-6",
                inverse ? "bg-white/30" : "bg-primary/40",
              )}
            />
          </p>
        )}
        {title && (
          <Tag
            id={id}
            className={cn(
              "text-balance",
              size === "xl"
                ? "measure-tight text-h1 md:text-display"
                : size === "lg"
                  ? "measure-tight text-display"
                  : "measure-tight text-h2",
              inverse ? "text-text-inverse" : "text-text",
            )}
          >
            {title}
          </Tag>
        )}
        {description && (
          <p
            className={cn(
              size === "xl" ? "measure text-lg md:text-xl" : "measure text-body-lg",
              inverse ? "text-text-on-dark" : "text-text-secondary",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
