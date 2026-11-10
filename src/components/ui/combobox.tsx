"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import {
  controlClasses,
  controlInvalidClasses,
} from "@/components/ui/input";
import { panelInputClasses } from "@/components/ui/search-panel";
import { cn } from "@/lib/utils/cn";

export interface ComboboxOption {
  /** Stable identity. What the parent stores when one is chosen. */
  id: string;
  /** The line the traveller reads: "JFK — New York", "Barcelona". */
  label: string;
  /** Disambiguating second line. */
  detail?: string;
}

/**
 * The destination picker used by the flight and hotel search panels.
 *
 * It replaced a native `<datalist>` on the flight form. A datalist is the
 * obvious choice until you look at one: it cannot be styled at all, it renders
 * differently in every browser, and on a dark OS theme Chrome draws it as a
 * black panel that has nothing to do with the site around it. It also cannot
 * show a list before the traveller types, which is the behaviour that makes a
 * destination field usable for somebody who does not already know the airport
 * code.
 *
 * So this owns the interaction — open state, active option, keyboard
 * navigation, outside-click, and the ARIA wiring — and the caller owns the
 * data. That split is what lets the hotel form feed it results from a debounced
 * API call and the flight form feed it a filtered local catalogue, without
 * either of them reimplementing the widget.
 *
 * It follows the ARIA combobox pattern: the input keeps focus throughout and
 * owns `aria-expanded` and `aria-activedescendant`, the arrow keys move the
 * active option without moving focus, Enter selects and Escape closes.
 *
 * `open` is controlled by the parent rather than held here, because the row
 * these sit in has to stop clipping while a list is showing — see the
 * `overflow` prop on `SearchRow`.
 *
 * ## Two controls, one widget
 *
 * `variant` picks which input it wears. `panel` is the chromeless control
 * used inside a `SearchCell`, where the cell draws the border and the focus
 * ring. `field` is the bordered control from `components/ui/input`, so the
 * same picklist can sit in a `Field` on a long form next to plain inputs
 * without looking like it was pasted in from somewhere else.
 *
 * The variants also anchor the dropdown differently. In a panel the root is
 * `display: contents` so the list positions against the `SearchCell`. In a
 * form it positions against the input itself — anchoring to the `Field`
 * would drop the list below the hint text, which on a field with two lines
 * of help leaves the options floating well away from the box they belong to.
 */
export function Combobox({
  id,
  listboxId,
  value,
  onValueChange,
  onSelect,
  options,
  open,
  onOpenChange,
  activeIndex,
  onActiveIndexChange,
  placeholder,
  invalid = false,
  heading,
  emptyState,
  icon,
  describedBy,
  variant = "panel",
}: {
  id: string;
  listboxId: string;
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (option: ComboboxOption) => void;
  /** Whatever should be listed right now — search results or a picklist. */
  options: readonly ComboboxOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  placeholder?: string;
  invalid?: boolean;
  /** Shown above the options. Use it to say why a list appeared unprompted. */
  heading?: string;
  /** Rendered instead of the list when there is nothing to show. */
  emptyState?: ReactNode;
  icon?: ReactNode;
  describedBy?: string;
  /** Which control to wear. See the note above. */
  variant?: "panel" | "field";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const field = variant === "field";

  /*
    Clicking outside closes the list.

    In a panel the root is `display: contents`, so "outside" is measured
    against the enclosing cell — a tap on the cell's label or padding focuses
    this input and must not close the list it is about to show.
  */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      const boundary = field ? root : (root?.parentElement ?? root);
      if (!boundary?.contains(event.target as Node)) onOpenChange(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange, field]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || options.length === 0) {
      if (event.key === "ArrowDown") onOpenChange(true);
      if (event.key === "Escape") onOpenChange(false);
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        onActiveIndexChange((activeIndex + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        onActiveIndexChange(
          (activeIndex - 1 + options.length) % options.length,
        );
        break;
      case "Enter":
        if (activeIndex >= 0) {
          event.preventDefault();
          onSelect(options[activeIndex]);
        }
        break;
      case "Escape":
        onOpenChange(false);
        break;
      default:
        break;
    }
  };

  const showList = open && options.length > 0;
  const showEmpty = open && options.length === 0 && Boolean(emptyState);

  return (
    <div ref={rootRef} className={field ? "relative" : "contents"}>
      <div className={field ? undefined : "flex items-center gap-2"}>
        {!field && icon && (
          <span aria-hidden="true" className="shrink-0 text-text-muted">
            {icon}
          </span>
        )}
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 && showList
              ? `${listboxId}-${activeIndex}`
              : undefined
          }
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
            // Typing always shows suggestions, even after Escape, a selection
            // or an outside click closed the list.
            onActiveIndexChange(-1);
            onOpenChange(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => onOpenChange(true)}
          onClick={() => !open && onOpenChange(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={
            field
              ? cn(controlClasses, invalid && controlInvalidClasses)
              : panelInputClasses
          }
        />
      </div>

      {showEmpty && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-[var(--z-dropdown)] mt-1",
            "rounded-xl bg-surface p-4 shadow-lg ring-1 ring-border",
          )}
        >
          {emptyState}
        </div>
      )}

      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={heading ?? "Suggestions"}
          className={cn(
            "absolute left-0 right-0 top-full z-[var(--z-dropdown)] mt-1",
            "max-h-80 overflow-y-auto rounded-xl bg-surface p-1.5 shadow-lg",
            "ring-1 ring-border",
          )}
        >
          {heading && (
            <li
              aria-hidden="true"
              className="px-3 pb-1.5 pt-2 text-overline uppercase text-text-muted"
            >
              {heading}
            </li>
          )}

          {options.map((option, index) => (
            <li key={option.id}>
              <button
                type="button"
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                /*
                  `onMouseDown`, not `onClick`: the input's blur fires first on
                  a click and would close the list before the selection lands.
                */
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSelect(option);
                }}
                onMouseEnter={() => onActiveIndexChange(index)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left",
                  index === activeIndex ? "bg-primary-soft" : "hover:bg-gray-50",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-medium text-text">
                    {option.label}
                  </span>
                  {option.detail && (
                    <span className="block truncate text-caption text-text-muted">
                      {option.detail}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
