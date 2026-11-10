import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema";
import { cn } from "@/lib/utils/cn";

/**
 * Visible breadcrumb trail plus its matching structured data, emitted from one
 * source so the two cannot describe different hierarchies.
 *
 * `tone="inverse"` is for a trail laid over a photograph or the navy band,
 * where the default greys are illegible.
 */
export function Breadcrumbs({
  items,
  tone = "default",
  className,
}: {
  items: BreadcrumbItem[];
  tone?: "default" | "inverse";
  className?: string;
}) {
  const inverse = tone === "inverse";

  return (
    <>
      <JsonLd schema={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className={cn(
            "flex flex-wrap items-center gap-x-2 gap-y-1 text-caption",
            inverse ? "text-white/70" : "text-text-muted",
          )}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path} className="flex items-center gap-2">
                {isLast ? (
                  <span
                    aria-current="page"
                    className={cn(
                      "font-medium",
                      inverse ? "text-white" : "text-text",
                    )}
                  >
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.path}
                      className={cn(
                        "rounded-sm underline-offset-4 transition-colors hover:underline",
                        inverse
                          ? "hover:text-white focus-ring-inverse"
                          : "hover:text-primary focus-ring",
                      )}
                    >
                      {item.name}
                    </Link>
                    <span
                      aria-hidden="true"
                      className={inverse ? "text-white/40" : "text-text-disabled"}
                    >
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
