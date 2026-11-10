"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { dealGroups } from "@/lib/content/deals";
import { esChrome, esDealGroups, esDeals } from "@/lib/content/es/chrome";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/types/locale";

/**
 * "Deals" in the desktop nav, with a dropdown of every deal category.
 *
 * The label is a link to /deals; hovering the item or pressing the chevron
 * opens the panel. The panel is fixed and centred on the viewport so its four
 * columns never run off the edge, wherever "Deals" sits in the bar.
 */
export function DealsMenu({
  href,
  label,
  locale = "en",
}: {
  href: string;
  label: string;
  locale?: Locale;
}) {
  const es = locale === "es";
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // Tied to the path it was opened on, so navigating closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const active = pathname === href || pathname.startsWith(`${href}/`);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpenedOn(pathname);
  };
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenedOn(null), 150);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenedOn(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOn(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div ref={rootRef} className="flex" onMouseEnter={show} onMouseLeave={hide}>
      <div
        className={cn(
          "relative flex h-full items-center whitespace-nowrap pl-2.5 pr-1 text-h6 font-medium 2xl:pl-3",
          "transition-colors duration-[var(--duration-fast)] ease-out",
          "after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
          "after:origin-left after:transition-transform after:duration-[var(--duration-normal)] after:ease-out",
          "motion-reduce:after:transition-none",
          active || open
            ? "text-primary after:scale-x-100"
            : "text-gray-700 after:scale-x-0 hover:text-text hover:after:scale-x-100",
        )}
      >
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className="rounded-xs focus-ring"
        >
          {label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={
            es
              ? open
                ? esChrome.deals.close
                : esChrome.deals.open
              : open
                ? "Close deals menu"
                : "Open deals menu"
          }
          onClick={() => (open ? setOpenedOn(null) : show())}
          className="grid size-6 place-items-center rounded-xs focus-ring"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-[var(--duration-fast)]",
              open && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          // Anchored to the header bar (its inner container is `relative`), so
          // it opens flush under the bar at the width of the page.
          "absolute inset-x-0 top-full z-[var(--z-dropdown)]",
          "rounded-b-xl border-t border-border bg-surface p-6 shadow-xl",
        )}
      >
        <div className="grid grid-cols-4 gap-6">
          {dealGroups.map((group) => (
            <div key={group.title}>
              <p className="text-overline uppercase text-text-muted">
                {es ? (esDealGroups[group.title] ?? group.title) : group.title}
              </p>
              <ul className="mt-3 space-y-1">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`${href}#${item.slug}`}
                      onClick={() => setOpenedOn(null)}
                      className="block rounded-xs px-2 py-1.5 text-body-sm font-semibold text-text transition-colors hover:bg-primary-softer hover:text-primary focus-ring"
                    >
                      {es ? (esDeals[item.slug]?.label ?? item.label) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end border-t border-border pt-4">
          <Link
            href={href}
            onClick={() => setOpenedOn(null)}
            className="rounded-xs text-body-sm font-semibold text-primary underline-offset-4 hover:underline focus-ring"
          >
            {es ? esChrome.deals.seeAll : "See all deals →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
