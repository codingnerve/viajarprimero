"use client";

import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export interface TabItem {
  /** Stable across renders — it keys the panel and the aria wiring. */
  id: string;
  label: string;
  /** Optional second line under the label. */
  hint?: string;
  /** Leading glyph. Sized by the tab, so pass an unsized <svg>. */
  icon?: ReactNode;
  panel: ReactNode;
}

/**
 * Tab set following the WAI-ARIA tabs pattern.
 *
 * Every panel stays mounted and inactive ones are hidden with the `hidden`
 * attribute rather than unmounted: these panels hold forms, and a traveller
 * who fills in dates, glances at another tab and comes back should find the
 * dates still there.
 *
 * Only the selected tab is in the tab order; the arrow keys move between them.
 * That is the pattern screen reader users expect, and it also stops a four-tab
 * strip from costing four tab presses to skip past.
 *
 * Three shapes. `underline` is the classic strip for switching between views
 * of a page. `segmented` is a pill group for choosing what you are booking — it
 * reads as a control rather than as navigation, and it is the shape a traveller
 * already knows from every airline app. `panel` is the booking-engine strip:
 * a large glyph above its label, an active rule beneath it, and the whole row
 * sitting on the white card that holds the search itself. It is the widest and
 * loudest of the three because on the home page this strip is the primary
 * navigation of the product, not a secondary control.
 */
type Shape = "underline" | "segmented" | "panel";

export function Tabs({
  items,
  label,
  defaultTabId,
  tone = "light",
  shape = "underline",
  className,
  listClassName,
  panelClassName,
}: {
  items: readonly TabItem[];
  /** Names the tab strip for assistive technology. */
  label: string;
  defaultTabId?: string;
  /** `inverse` is for tabs sitting on a dark surface. */
  tone?: "light" | "inverse";
  shape?: Shape;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  const move = (from: number, delta: number) => {
    const next = items[(from + delta + items.length) % items.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(index, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(index, -1);
        break;
      case "Home":
        event.preventDefault();
        move(0, 0);
        break;
      case "End":
        event.preventDefault();
        move(items.length - 1, 0);
        break;
      default:
        break;
    }
  };

  const segmented = shape === "segmented";
  const panel = shape === "panel";
  const inverse = tone === "inverse";

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className={cn(
          "flex overflow-x-auto",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // The negative inset lets the strip scroll to the screen edge on a
          // phone instead of clipping the last tab against the gutter. A panel
          // strip is the exception: it sits inside a card that already owns its
          // gutter, so bleeding it would run the tabs under the card's corners.
          panel ? "px-1" : "-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0",
          segmented
            ? cn(
                "gap-1 md:w-fit md:rounded-full md:p-1",
                inverse
                  ? "md:bg-white/10 md:ring-1 md:ring-inset md:ring-white/15 md:backdrop-blur-[var(--blur-md)]"
                  : "md:bg-gray-100",
              )
            : panel
              ? "gap-0.5 border-b border-border sm:gap-2 md:justify-center md:gap-6"
              : "gap-1",
          listClassName,
        )}
      >
        {items.map((item, index) => {
          const selected = item.id === active;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={selected}
              aria-controls={panelId(item.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap font-semibold",
                "transition-[background-color,color,box-shadow] duration-[var(--duration-fast)] ease-out",
                inverse ? "focus-ring-inverse" : "focus-ring",
                segmented
                  ? cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-body",
                      selected
                        ? inverse
                          ? "bg-surface text-secondary shadow-sm"
                          : "bg-surface text-primary shadow-sm"
                        : inverse
                          ? "text-gray-300 hover:bg-white/10 hover:text-text-inverse"
                          : "text-gray-600 hover:bg-white/70 hover:text-text",
                    )
                  : panel
                    ? cn(
                        "relative inline-flex min-w-18 flex-col items-center gap-2",
                        "px-2 pb-3.5 pt-2 text-micro uppercase tracking-wider",
                        "sm:min-w-20 sm:px-3 md:min-w-24 md:text-overline",
                        selected ? "text-primary" : "text-text hover:text-primary",
                      )
                    : cn(
                      "rounded-t-md border-b-2 px-4 py-3 text-body-lg",
                      inverse
                        ? selected
                          ? "border-white text-text-inverse"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                        : selected
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-text",
                    ),
              )}
            >
              {item.icon && (
                <span
                  aria-hidden="true"
                  className={
                    panel ? "text-primary [&>svg]:size-6" : "[&>svg]:size-4.5"
                  }
                >
                  {item.icon}
                </span>
              )}
              {item.label}
              {/*
                The active rule, drawn as a child rather than as a border on the
                button itself. Inset from the tab's own padding, it underlines
                the label rather than the whole cell — and because it is always
                rendered and only changes colour, switching tabs cannot shift
                the row by a pixel.
              */}
              {panel && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2 bottom-0 h-0.5 rounded-full",
                    "transition-colors duration-[var(--duration-fast)]",
                    selected ? "bg-primary" : "bg-transparent",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={panelId(item.id)}
          aria-labelledby={tabId(item.id)}
          tabIndex={0}
          hidden={item.id !== active}
          className={cn("focus-ring", panelClassName)}
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
