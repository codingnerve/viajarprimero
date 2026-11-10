"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

/**
 * Desktop nav item. Needs the pathname to mark the current section, which is
 * the only reason it is a client component.
 *
 * The current section is a filled pill rather than a 3px underline welded to
 * the bottom of the header. The underline tied the marker to the header's own
 * height — it had to be redrawn every time that changed — and read as a tab
 * strip rather than as navigation.
 */
export function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-9 items-center rounded-full px-2.5 font-medium 2xl:px-3",
        "transition-colors duration-[var(--duration-fast)] ease-out focus-ring",
        // 14px step of the scale; `font-medium` above overrides h6's 600.
        "text-h6",
        active
          ? "bg-primary-soft text-primary"
          : "text-gray-700 hover:bg-gray-100 hover:text-text",
      )}
    >
      {label}
    </Link>
  );
}
