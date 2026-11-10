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
        "relative flex h-full items-center whitespace-nowrap px-2.5 font-medium 2xl:px-3",
        "transition-colors duration-[var(--duration-fast)] ease-out focus-ring",
        // 14px step of the scale; `font-medium` above overrides h6's 600.
        "text-h6",
        // The marker is a 2px rule on the bar's own bottom edge.
        "after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
        "after:origin-left after:transition-transform after:duration-[var(--duration-normal)] after:ease-out",
        "motion-reduce:after:transition-none",
        active
          ? "text-primary after:scale-x-100"
          : "text-gray-700 after:scale-x-0 hover:text-text hover:after:scale-x-100",
      )}
    >
      {label}
    </Link>
  );
}
