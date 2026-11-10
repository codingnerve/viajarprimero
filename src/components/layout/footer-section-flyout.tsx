import Link from "next/link";

import {
  sectionLinkColumns,
  sectionLinkLabels,
  type BookingSection,
} from "@/lib/content/section-links";
import { cn } from "@/lib/utils/cn";

/**
 * A footer "Book" link with that section's related pages hanging off it on
 * hover.
 *
 * These columns used to be a band above the site footer, rendered by each
 * section's layout - so a reader on the cruise pages got cruise lines and
 * cruise deals, but only after scrolling past the whole page, and only while
 * they were already in that section. Hovering the footer link reaches the same
 * links from anywhere on the site and costs the page nothing when unopened.
 *
 * No state and no effects, so this stays a server component: `group-hover` and
 * `group-focus-within` do the work, which also means the panel opens for the
 * keyboard, not just the mouse. The panel is a DOM child of the same `<li>`,
 * so moving the pointer down into it keeps the group hovered, and the
 * wrapper's top padding means there is no dead gap to cross.
 *
 * It opens downwards, into the footer's own ground. Upwards it cleared the
 * footer's top edge and floated over the page above it; down here it lands
 * over the compliance band rather than past the end of the document, so
 * nothing gains scroll height. The columns need the full `xl` width to stay
 * one row tall - below that the link behaves like every other footer link.
 */
export function FooterSectionFlyout({
  href,
  label,
  section,
}: {
  href: string;
  label: string;
  section: BookingSection;
}) {
  const columns = sectionLinkColumns(section);
  const wide = columns.length >= 5;

  return (
    <>
      <Link
        href={href}
        className="rounded-sm text-body-sm text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline group-hover:text-white focus-ring-inverse"
      >
        {label}
      </Link>

      <div
        className={cn(
          "invisible absolute left-0 top-full z-30 max-w-[calc(100vw-3rem)] pt-3 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 max-xl:hidden",
          wide ? "w-[52rem]" : "w-[44rem]",
        )}
      >
        <nav
          aria-label={sectionLinkLabels[section]}
          className="rounded-xs bg-secondary shadow-xl ring-1 ring-white/12"
        >
          <div
            className={cn(
              "grid divide-x divide-white/10 rounded-xs bg-white/6 p-6",
              wide ? "grid-cols-5" : "grid-cols-4",
            )}
          >
            {columns.map((column) => {
              const id = `footer-${section}-${column.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`;

              return (
                <div key={column.title} className="px-5 first:pl-0 last:pr-0">
                  <h3 id={id} className="text-overline uppercase text-gray-500">
                    {column.title}
                  </h3>
                  <ul aria-labelledby={id} className="mt-4 space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="rounded-sm text-body-sm text-gray-300 underline-offset-4 transition-colors hover:text-white hover:underline focus-ring-inverse"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
