import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Width = "page" | "narrow";

const widthClasses: Record<Width, string> = {
  page: "max-w-page",
  /** For a single column of prose — a policy page, a guide, an article. */
  narrow: "max-w-[var(--container-narrow)]",
};

/**
 * The page gutter. `max-w-page` is the container from the design spec;
 * horizontal padding widens with the viewport rather than staying pinned at
 * the mobile inset.
 */
export function Container({
  as: Tag = "div",
  width = "page",
  className,
  children,
}: {
  as?: ElementType;
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-gutter",
        widthClasses[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
