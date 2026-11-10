import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * 16px text is deliberate: iOS Safari zooms the viewport on focus for anything
 * smaller, which throws the user out of the layout mid-form.
 *
 * The resting border is a ring rather than a border so the control keeps the
 * same box size in every state — a 1px border growing to 2px on focus shifts
 * every sibling in the row by a pixel, which is the flicker you see on a lot
 * of booking forms when you tab through them.
 */
export const controlClasses = cn(
  "h-13 w-full rounded-lg bg-surface px-4 text-body text-text",
  "ring-1 ring-inset ring-border-strong",
  "placeholder:text-text-muted",
  "transition-[box-shadow,background-color] duration-[var(--duration-fast)] ease-out",
  "hover:ring-gray-300",
  "focus:outline-none focus:ring-2 focus:ring-primary",
  "disabled:bg-gray-50 disabled:text-text-disabled disabled:ring-border",
);

/** Exported so `Combobox` can wear the same control as the inputs beside it. */
export const controlInvalidClasses =
  "ring-2 ring-error hover:ring-error focus:ring-error";

const invalidClasses = controlInvalidClasses;

export function Input({
  className,
  invalid = false,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(controlClasses, invalid && invalidClasses, className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

/**
 * An input with a leading icon or a trailing affordance.
 *
 * Wrapping rather than restyling: the icon is positioned against this element
 * and the control keeps its own padding, so a field with an icon and one
 * without still line up on the same baseline in a grid.
 */
export function InputGroup({
  icon,
  trailing,
  className,
  children,
}: {
  icon?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {icon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text-muted"
        >
          {icon}
        </span>
      )}
      {/* `Boolean(...)` rather than the bare node: ReactNode admits bigint,
          which is not a ClassValue, so `icon && "..."` does not narrow. */}
      <div
        className={cn(
          Boolean(icon) && "[&_input]:pl-11",
          Boolean(trailing) && "[&_input]:pr-11",
        )}
      >
        {children}
      </div>
      {trailing && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {trailing}
        </span>
      )}
    </div>
  );
}

export function Textarea({
  className,
  invalid = false,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        controlClasses,
        "h-auto min-h-32 py-3 leading-relaxed",
        invalid && invalidClasses,
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid = false,
  children,
  ...props
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      className={cn(
        controlClasses,
        "cursor-pointer appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23626e80%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')]",
        invalid && invalidClasses,
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

/**
 * Checkbox with a real hit area.
 *
 * The bare `<input type="checkbox">` scattered across the consent forms was a
 * 16px target with a browser-default tick. This keeps native semantics — it is
 * still an input, so it is still focusable, still announced, still submits —
 * and only replaces what the browser draws.
 */
export function Checkbox({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-sm bg-surface",
        "ring-1 ring-inset ring-border-strong transition-colors duration-[var(--duration-fast)]",
        "hover:ring-gray-400",
        "checked:bg-primary checked:ring-primary",
        "checked:bg-[length:14px] checked:bg-center checked:bg-no-repeat",
        "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M3 8.5l3.5 3.5L13 5%22/></svg>')]",
        "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:ring-border",
        "disabled:checked:bg-gray-300 disabled:checked:ring-gray-300",
        "focus-ring",
        className,
      )}
      {...props}
    />
  );
}
