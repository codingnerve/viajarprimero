"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { AccountButton } from "@/components/layout/account-dialog";
import { LanguageSelect } from "@/components/layout/language-select";
import { cn } from "@/lib/utils/cn";
import { configured } from "@/lib/config/placeholders";
import { mainNav, phoneFor, utilityNav } from "@/lib/config/site";
import { esChrome } from "@/lib/content/es/chrome";
import type { Locale } from "@/types/locale";

/**
 * Mobile navigation sheet, below `xl`.
 *
 * The smallest possible client boundary: the header itself stays a Server
 * Component and only this toggle ships JavaScript. It carries the full nav,
 * the help links, Manage my trips, the language list and the call button.
 */
export function MobileNav({ locale = "en" }: { locale?: Locale }) {
  const es = locale === "es";
  const panelId = useId();
  const pathname = usePathname();

  // The path the drawer was opened on. Deriving `open` from it means a
  // navigation closes the drawer for free - no effect chasing the route, and
  // no window where the panel covers the page the user just moved to.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // The state setter directly, not the `setOpen` helper: setters are
      // stable, so the listener does not resubscribe on every render.
      if (event.key === "Escape") setOpenedOn(null);
    };

    // Locking the page behind the sheet. Without this, a scroll gesture that
    // starts on the sheet and runs past its end scrolls the page underneath,
    // and the drawer is left floating over content that has moved.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const line = phoneFor(locale);
  const phone = configured(line.phone);
  const phoneDisplay = configured(line.phoneDisplay);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          es
            ? open
              ? esChrome.menu.close
              : esChrome.menu.open
            : open
              ? "Close menu"
              : "Open menu"
        }
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-full text-text",
          "transition-colors hover:bg-gray-100 focus-ring",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[var(--header-height)] z-[var(--z-modal)]",
          "overflow-y-auto bg-surface pb-6",
          "animate-rise motion-reduce:animate-none",
        )}
      >
        <div className="px-5 pt-4">
          <AccountButton variant="block">
            {es ? esChrome.manageTrips : undefined}
          </AccountButton>
        </div>

        <nav aria-label={es ? esChrome.siteNavLabel : "Site"} className="px-5 pt-2">
          <ul className="divide-y divide-gray-100">
            {[...mainNav, ...utilityNav].map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center text-body font-medium",
                      "transition-colors focus-ring",
                      active ? "text-primary" : "text-text hover:text-primary",
                    )}
                  >
                    {es ? (esChrome.nav[item.href] ?? item.label) : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {phone && phoneDisplay && (
          <div className="mt-4 px-5">
            <a
              href={`tel:${phone}`}
              className={cn(
                "flex min-h-12 items-center justify-center gap-2.5 rounded",
                "bg-primary px-5 text-body font-semibold text-text-inverse",
                "transition-colors hover:bg-primary-hover focus-ring",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
              </svg>
              {es ? esChrome.call.mobile(phoneDisplay) : `Call ${phoneDisplay}`}
            </a>
          </div>
        )}

        <LanguageSelect
          variant="list"
          locale={locale}
          className="mt-6 border-t border-gray-100 px-5 pt-5"
        />
      </div>
    </div>
  );
}
