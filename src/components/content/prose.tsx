import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Typographic defaults for long-form copy — policy pages, guides, editorial.
 *
 * Tailwind's typography plugin is a dependency this project does not carry, so
 * the element styles are declared here against our own tokens instead. Line
 * length is capped at ~70 characters, which is the readable measure.
 */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "measure text-body-lg text-gray-700",
        "[&_p]:mb-4",
        // h2 is the top level inside prose: these blocks always sit under the
        // page h1, so starting at h3 skipped a level in the document outline.
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-h3 [&_h2]:text-text first:[&_h2]:mt-0",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-h4 [&_h3]:text-text",
        "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-h5 [&_h4]:text-text",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
        "[&_strong]:font-semibold [&_strong]:text-text",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-hover",
        // Tables live in an overflow-x-auto wrapper; the min-width makes them
        // scroll on a narrow screen instead of squeezing columns to unreadable.
        "[&_table]:mb-4 [&_table]:w-full [&_table]:min-w-lg [&_table]:text-body",
        "[&_th]:border-b [&_th]:border-divider [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left [&_th]:text-h6 [&_th]:text-text",
        "[&_td]:border-b [&_td]:border-border [&_td]:p-3 [&_td]:align-top",
        className,
      )}
    >
      {children}
    </div>
  );
}
