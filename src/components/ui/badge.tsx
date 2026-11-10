import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "info" | "success" | "warning" | "accent" | "inverse";
type Size = "sm" | "md";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  info: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-gray-800",
  accent: "bg-accent-soft text-accent-hover",
  // For badges on the navy band, where every tinted fill above disappears.
  inverse: "bg-white/12 text-text-inverse ring-1 ring-white/20 ring-inset",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2 py-0.5 text-overline uppercase",
  md: "px-2.5 py-1 text-caption font-medium",
};

/**
 * `dot` prefixes the label with a filled circle in the current colour. It is
 * for status that is otherwise carried by colour alone — the tone tells a
 * sighted reader "good" and the word tells everyone else, but the dot gives
 * the row a scannable left edge in a list of mixed statuses.
 */
export function Badge({
  tone = "neutral",
  size = "md",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full whitespace-nowrap",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
