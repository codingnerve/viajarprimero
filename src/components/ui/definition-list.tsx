import { cn } from "@/lib/utils/cn";

export interface Definition {
  term: string;
  detail: string;
}

/**
 * A term-and-explanation list.
 *
 * Three pages were building this out of `divide-y rounded-lg border bg-surface`
 * with a `<div className="p-4">` per row — the cruise fare inclusions, the car
 * hire desk charges, the hotel checks. It is a list of things explained, not a
 * grid of cards, and drawing a box around it was most of why those pages read
 * as stacked rectangles.
 *
 * Rules between rows, no box around the whole, and the term set against the
 * detail rather than above it wherever there is room for two columns.
 */
export function DefinitionList({
  items,
  className,
}: {
  items: readonly Definition[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
        >
          <dt className="text-h5 text-text">{item.term}</dt>
          <dd className="measure text-body-sm text-text-secondary">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}
