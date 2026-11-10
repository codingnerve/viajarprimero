import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "raised" | "outline" | "plain" | "tinted";
type Padding = "none" | "sm" | "md" | "lg";

/**
 * How a card holds its edge.
 *
 * The old card had exactly one look — 1px border, 12px radius, small shadow —
 * and it was applied to everything from a destination teaser to a paragraph of
 * reassurance text. That is what "boxy" describes: a page where every block of
 * content is drawn inside the same rectangle, so nothing is emphasised because
 * everything is.
 *
 * - `raised`  a plane lifted off the page. Shadow, no border. The default.
 * - `outline` a hairline ring, no lift. For dense lists where twelve shadows
 *             would turn into visual noise.
 * - `plain`   no edge at all. For content grouped by spacing and a heading
 *             rather than by a rectangle drawn around it.
 * - `tinted`  a recessed panel inside another surface — a price summary, a
 *             form footer.
 */
const variantClasses: Record<Variant, string> = {
  raised: "bg-surface shadow-sm",
  outline: "bg-surface ring-1 ring-border ring-inset",
  plain: "bg-transparent",
  tinted: "bg-surface-2 ring-1 ring-border ring-inset",
};

/**
 * Padding is a prop, not a class to override.
 *
 * `cn` is a plain join with no tailwind-merge behind it, so passing `p-0` in
 * `className` does not beat a `p-5` baked into the component — which of the
 * two wins is decided by their order in the generated stylesheet, not by the
 * order they appear in the attribute. Cards whose whole body is a link need
 * the padding on the anchor instead, so that case gets a prop that genuinely
 * removes it.
 */
const paddingClasses: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export function Card({
  className,
  variant = "raised",
  padding = "md",
  interactive = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  variant?: Variant;
  padding?: Padding;
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variantClasses[variant],
        paddingClasses[padding],
        interactive &&
          cn(
            "transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out",
            "hover:-translate-y-1 hover:shadow-lg",
            "motion-reduce:transform-none motion-reduce:transition-none",
          ),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
