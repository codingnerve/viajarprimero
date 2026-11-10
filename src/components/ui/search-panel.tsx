import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The anatomy of a search panel.
 *
 * Two features build one — `search` for flights, `enquiries` for hotels, car
 * hire and cruises — and they sit in the same hero, one per tab. A traveller
 * switching tabs must not see the control change shape underneath them, which
 * is exactly what happens when two features each own their own version of it.
 * So the shell, the cells and the quiet selects live here and both call sites
 * compose them.
 *
 * The parts are unstyled as to *content*: what goes in a cell is the calling
 * form's business. What they fix is the geometry — one connected control with
 * hairline dividers, a focus ring drawn on the cell rather than the input, and
 * a 72px minimum row height that keeps the labels legible above the values.
 */

/**
 * The outer shell.
 *
 * `panel` is the floating hero treatment — heavy shadow, no border, meant to
 * sit on a photograph or the navy field. `flat` is for a results page, where
 * the form is a control on a white page rather than the hero of it. `bare`
 * carries no chrome at all, for a panel nested inside a card that already
 * draws the white plane, the radius and the shadow — without it the hero card
 * would draw all three twice, one inset a few pixels inside the other.
 */
export type SearchPanelTone = "panel" | "flat" | "bare";

export function SearchPanel({
  tone = "panel",
  className,
  children,
  ...props
}: React.ComponentProps<"form"> & { tone?: SearchPanelTone }) {
  return (
    <form
      noValidate
      className={cn(
        tone !== "bare" &&
          cn(
            "rounded-xs bg-surface p-3 md:p-4",
            tone === "panel"
              ? "shadow-panel"
              : "shadow-sm ring-1 ring-inset ring-border",
          ),
        className,
      )}
      {...props}
    >
      {children}
    </form>
  );
}

/**
 * The qualifier row above the journey: trip type, travellers, cabin.
 *
 * Small and quiet by design — these change the search rather than being the
 * search, and giving them the same visual weight as the origin field is how a
 * booking form ends up looking like a tax return.
 */
export function SearchQualifiers({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-2 px-1 pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The connected row itself. `columns` is the lg-and-up track list; below that
 * the cells always stack, because four fields side by side on a phone gives
 * each of them about 80px.
 */
export function SearchRow({
  columns,
  overflow = "clip",
  className,
  children,
}: {
  columns: string;
  /**
   * Whether the row clips what its cells paint.
   *
   * `clip` is right almost always: the cells carry their own hover and focus
   * backgrounds, and without clipping those paint square into the row's
   * rounded corners.
   *
   * `visible` exists for one case — a cell containing a dropdown. An
   * ancestor's `overflow: hidden` clips absolutely-positioned descendants no
   * matter what their z-index is, so a combobox listbox inside a clipped row
   * is cut off at the row's edge rather than hanging below it. A row holding
   * an open dropdown has to stop clipping for the duration.
   *
   * It is a prop rather than something a caller passes through `className`
   * because `cn` has no tailwind-merge behind it: `overflow-hidden` and
   * `overflow-visible` would both land in the class list and their order in
   * the generated stylesheet, not the attribute, would decide the winner.
   */
  overflow?: "clip" | "visible";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid rounded-xs bg-surface-2",
        overflow === "clip" ? "overflow-hidden" : "overflow-visible",
        "divide-y divide-border ring-1 ring-inset ring-border",
        "lg:divide-x lg:divide-y-0",
        columns,
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One cell of the connected row.
 *
 * The focus ring is drawn on the cell via `focus-within` rather than on the
 * input, so the whole labelled area lights up. That is both easier to see and
 * a bigger target — clicking anywhere in the cell, label included, focuses the
 * control.
 */
export function SearchCell({
  htmlFor,
  label,
  invalid = false,
  disabled = false,
  className,
  children,
}: {
  htmlFor: string;
  label: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-18 flex-col justify-center gap-1 px-4 py-3",
        "transition-colors duration-[var(--duration-fast)]",
        "focus-within:z-10 focus-within:bg-surface",
        "focus-within:outline focus-within:-outline-offset-2 focus-within:outline-2 focus-within:outline-primary",
        !disabled && "hover:bg-surface",
        invalid && "bg-error-soft",
        disabled && "opacity-60",
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className={cn(
          "text-overline uppercase",
          invalid ? "text-error" : "text-text-muted",
        )}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * The input inside a cell carries no chrome of its own — the cell draws the
 * state. 16px minimum, because iOS Safari zooms the viewport on focus for
 * anything smaller.
 */
export const panelInputClasses = cn(
  "w-full bg-transparent text-body font-medium text-text",
  "placeholder:font-normal placeholder:text-text-muted",
  "focus:outline-none",
  "disabled:cursor-not-allowed disabled:text-text-disabled",
  // Safari draws a date input at its own intrinsic width and leaves the
  // calendar glyph mid-cell; this pins it to the text baseline like the rest.
  "[&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-date-and-time-value]:text-left",
);

/**
 * A select with no box around it, for the qualifier row.
 *
 * It keeps a native `<select>` underneath — so it is keyboard-operable, opens
 * the platform picker on a phone, and is announced correctly — and only drops
 * the border and background the browser would otherwise draw.
 */
export function QuietSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  /** Visually hidden: the chosen option is the visible label. */
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "min-h-9 cursor-pointer appearance-none rounded-xs bg-transparent",
          "pl-3.5 pr-8 text-body-sm font-semibold text-gray-700",
          /*
            Size to the selected option, not to the widest one.

            A native <select> takes its intrinsic width from its longest
            option, so the cabin control was as wide as "Premium economy" even
            while showing "Economy" — leaving a visible gap between the label
            and the chevron pinned to its right edge, and pushing the three
            controls apart from each other. `field-sizing: content` makes the
            box follow the current value instead, so they sit together and the
            chevron stays next to the word it belongs to.

            Progressive enhancement: where it is unsupported the control falls
            back to intrinsic width, which is what it did before.
          */
          "field-sizing-content",
          "transition-colors duration-[var(--duration-fast)] hover:bg-gray-100 hover:text-text",
          "focus-ring",
          "bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23626e80%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')]",
        )}
      >
        {children}
      </select>
    </div>
  );
}

/**
 * The errors from a connected row, collected beneath it.
 *
 * A message inside a 72px cell either clips or grows the cell and shunts the
 * whole row out of alignment. Below the row each one still names its field and
 * still carries the id that field's `aria-describedby` points at, so the
 * association survives the move.
 */
export function SearchErrors({
  idPrefix,
  errors,
}: {
  idPrefix: string;
  errors: ReadonlyArray<readonly [field: string, message: string]>;
}) {
  if (errors.length === 0) return null;

  return (
    <ul className="mt-3 space-y-1.5 px-1">
      {errors.map(([field, message]) => (
        <li
          key={field}
          id={`${idPrefix}-${field}-error`}
          role="alert"
          className="flex items-start gap-2 text-caption font-medium text-error"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 size-3.5 shrink-0"
          >
            <path d="M8 5v3.5m0 2.5v.01M8 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
          </svg>
          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
}
