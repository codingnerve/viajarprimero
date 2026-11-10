import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The heading block at the top of an interior page.
 *
 * Twenty-four pages were each rebuilding this out of `max-w-[70ch]` and
 * `text-h1 md:text-[2.5rem]`. An arbitrary value repeated two dozen times is a
 * token that was never declared, so the size now comes from `--text-display`
 * and the measure from the `measure` utility, both in globals.css.
 *
 * `children` takes the trailing metadata some pages need — a published date, a
 * badge row, a set of facts about a route — so a page does not have to abandon
 * the component the moment it needs one extra line.
 *
 * `actions` takes the calls to action. Twenty pages opened with a heading, an
 * intro, and then nothing to do until the reader scrolled; on a booking site
 * the first screen of every page should offer the next step.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  tone = "default",
  align = "start",
  actions,
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** `inverse` for a header sitting on the navy band. */
  tone?: "default" | "inverse";
  align?: "start" | "center";
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const inverse = tone === "inverse";

  return (
    <header
      className={cn(
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "flex items-center gap-2.5 text-overline uppercase",
            align === "center" && "justify-center",
            inverse ? "text-gray-400" : "text-primary",
          )}
        >
          <span
            aria-hidden="true"
            className={cn("h-px w-6", inverse ? "bg-white/30" : "bg-primary/40")}
          />
          {eyebrow}
        </p>
      ) : null}

      <h1
        className={cn(
          "text-balance text-display md:text-display-lg",
          align === "center" ? "mx-auto measure-tight" : "measure-tight",
          eyebrow ? "mt-4" : null,
          inverse ? "text-text-inverse" : "text-text",
        )}
      >
        {title}
      </h1>

      {intro ? (
        <p
          className={cn(
            "mt-5 text-body-lg",
            align === "center" ? "mx-auto measure" : "measure",
            inverse ? "text-text-on-dark" : "text-text-secondary",
          )}
        >
          {intro}
        </p>
      ) : null}

      {actions ? (
        <div
          className={cn(
            "mt-8 flex flex-wrap items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          {actions}
        </div>
      ) : null}

      {children}
    </header>
  );
}
