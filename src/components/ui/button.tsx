import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "accent"
  | "inverse";
type Size = "sm" | "md" | "lg";

/**
 * Variants.
 *
 * `primary` carries a shadow tinted with the brand colour rather than a grey
 * one — a neutral drop shadow under a saturated button reads as dirt beneath
 * it. `inverse` is new: the navy bands had been reaching for `outline`, which
 * puts a white surface on a dark field and fights the band it sits on.
 */
const variantClasses: Record<Variant, string> = {
  primary: cn(
    "bg-primary text-text-inverse shadow-[0_1px_2px_rgb(11_63_142/0.4),0_6px_16px_rgb(21_96_212/0.26)]",
    "hover:bg-primary-hover hover:shadow-[0_1px_2px_rgb(11_63_142/0.4),0_10px_24px_rgb(21_96_212/0.32)]",
    "active:bg-primary-active active:shadow-[0_1px_2px_rgb(11_63_142/0.4)]",
  ),
  accent: cn(
    "bg-accent text-text-inverse shadow-[0_1px_2px_rgb(11_63_142/0.4),0_6px_16px_rgb(26_115_232/0.28)]",
    "hover:bg-accent-hover",
    "active:brightness-95",
  ),
  secondary: "bg-primary-soft text-primary hover:bg-primary/15 active:bg-primary/20",
  outline: cn(
    "bg-surface text-text ring-1 ring-border-strong ring-inset",
    "hover:bg-gray-50 hover:ring-gray-300 active:bg-gray-100",
  ),
  ghost: "text-text hover:bg-gray-100 active:bg-gray-200",
  inverse: cn(
    "bg-white/10 text-text-inverse ring-1 ring-white/25 ring-inset backdrop-blur-[var(--blur-md)]",
    "hover:bg-white/18 hover:ring-white/40 active:bg-white/25",
  ),
};

/**
 * Heights meet the 44px minimum touch target at `md` and above. `sm` is for
 * dense desktop toolbars only — never for a primary action on mobile.
 */
const sizeClasses: Record<Size, string> = {
  // 36px is fine for a mouse and under the 44px floor for a finger, so the
  // compact height applies only where the pointer is precise.
  sm: "h-11 px-4 text-body pointer-fine:h-9",
  md: "h-12 px-5 text-body",
  lg: "h-14 px-7 text-body-lg",
};

const baseClasses = cn(
  "relative inline-flex select-none items-center justify-center gap-2",
  // Rounded rectangle, matching the 8-16px corners of the cards and fields
  // around it rather than a pill that no other surface on the page shares.
  "rounded-lg font-semibold whitespace-nowrap",
  "transition-[background-color,box-shadow,transform,color] duration-[var(--duration-fast)] ease-out",
  "active:translate-y-px motion-reduce:active:translate-y-0",
  "focus-ring",
  "disabled:pointer-events-none disabled:bg-gray-100 disabled:text-text-disabled disabled:shadow-none disabled:ring-0",
);

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Rendered before the label, at the control's own colour. */
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * `loading` keeps the button in the layout at its resting width while it
 * works. Swapping the label for "Sending…" reflows the row and moves whatever
 * sits beside it, so the label stays put and is dimmed under a spinner
 * instead; `aria-busy` and the disabled state carry the meaning.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonOwnProps & ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {icon}
        {children}
      </span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className,
  children,
  ...props
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="absolute size-5 animate-spin motion-reduce:animate-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="10" cy="10" r="7.5" className="opacity-25" />
      <path d="M17.5 10A7.5 7.5 0 0 0 10 2.5" />
    </svg>
  );
}
