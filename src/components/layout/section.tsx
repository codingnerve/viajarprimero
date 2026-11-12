import type { ElementType, ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

type Tone = "default" | "surface" | "muted" | "dark" | "brand" | "brand-soft";
type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * A full-bleed band with the page gutter inside it.
 *
 * Pages were repeating `<section className="…bg-surface"><Container
 * className="py-10 md:py-14">` verbatim, which is how vertical rhythm drifts a
 * few pixels per page. The tone and the padding scale are choices from a fixed
 * set here rather than class strings written out at every call site.
 */
const toneClasses: Record<Tone, string> = {
  default: "",
  surface: "bg-surface",
  muted: "bg-background-alt",
  dark: "bg-secondary",
  /** The gradient navy field. For a hero or a closing statement. */
  brand: "bg-brand-wash",
  /** Its quiet cousin, for an interior page header. */
  "brand-soft": "bg-brand-wash-soft",
};

/**
 * Five genuinely different heights.
 *
 * The original set was 40/56px for everything, which is why the page read as
 * one long undifferentiated column: if the gap before a section is the same as
 * the gap before every other section, the reader gets no signal about which
 * ones open a subject and which ones continue it. `md` is the workhorse, `lg`
 * and `xl` are for a page's opening and closing statement, `sm` and `xs` for
 * utility rows.
 *
 * The whole ramp is more generous than it was — "clean and spacious" is mostly
 * a statement about this constant.
 */
const sizeClasses: Record<Size, string> = {
  xs: "py-6 md:py-8",
  sm: "py-10 md:py-14",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
};

export function Section({
  tone = "default",
  size = "md",
  bordered = false,
  as: Tag = "section",
  width,
  backdrop,
  lightBackdrop = false,
  className,
  containerClassName,
  children,
}: {
  tone?: Tone;
  size?: Size;
  /**
   * Rendered full-bleed behind the content, outside the gutter — a hero
   * carousel, a decorative wash. It sits outside `Container` on purpose: an
   * absolutely-positioned child *inside* the container is clipped to the
   * content box and stops short of the screen edges, which is the bug that
   * makes a "full-width" hero image look like a wide banner.
   */
  backdrop?: ReactNode;
  /** The backdrop is pale, so the band keeps dark text instead of white. */
  lightBackdrop?: boolean;
  /**
   * Rule along the bottom edge, for two bands that share a background. A tone
   * change is already an edge, so drawing a border across one as well is the
   * clutter this component exists to remove.
   */
  bordered?: boolean;
  /** `article` for a single long read, so the band is also the article root. */
  as?: ElementType;
  /** `narrow` for a single column of prose. */
  width?: "page" | "narrow";
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  const dark = (tone === "dark" || tone === "brand") && !lightBackdrop;

  return (
    <Tag
      className={cn(
        // `isolate` gives every band its own stacking context, so a decorative
        // element positioned inside one cannot land on top of the band after
        // it. That was how the hero's glow ended up over the search panel.
        "relative isolate",
        toneClasses[tone],
        dark && "text-text-inverse",
        bordered && "border-b border-border",
        className,
      )}
    >
      {backdrop}
      <Container
        width={width}
        className={cn("relative z-10", sizeClasses[size], containerClassName)}
      >
        {children}
      </Container>
    </Tag>
  );
}
