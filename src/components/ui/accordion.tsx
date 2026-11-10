import { cn } from "@/lib/utils/cn";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * FAQ list built on native <details>.
 *
 * No JavaScript, no client boundary, keyboard-operable and expandable before
 * hydration — which also means the answers are in the HTML for crawlers rather
 * than appearing only after a bundle loads.
 *
 * `name` puts every row in one exclusive group, so opening a question closes
 * the one before it. That is native accordion behaviour with no state to
 * manage; it is also why the rows animate open rather than snapping — the
 * `interpolate-size` declaration below lets `height: auto` be transitioned.
 */
export function Accordion({
  items,
  name,
  className,
}: {
  items: readonly AccordionItem[];
  /**
   * Groups the rows for exclusive open/close. Must be unique per accordion on
   * the page — two accordions sharing a name would close each other's rows.
   */
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <details
          key={item.question}
          name={name}
          className="group [&::details-content]:overflow-hidden"
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-6 py-5",
              "text-h5 text-text transition-colors duration-[var(--duration-fast)]",
              "hover:text-primary group-open:text-primary",
              "focus-ring [&::-webkit-details-marker]:hidden",
            )}
          >
            <span className="text-balance">{item.question}</span>
            {/*
              A plus that becomes a minus, rather than a chevron that flips.
              The chevron is ambiguous at rest — it reads as "there is more
              below" as often as "this opens" — where a plus states outright
              that something is collapsed.
            */}
            <span
              aria-hidden="true"
              className={cn(
                "relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                "bg-gray-100 text-text-secondary transition-colors duration-[var(--duration-fast)]",
                "group-hover:bg-primary-soft group-hover:text-primary",
                "group-open:bg-primary group-open:text-text-inverse",
              )}
            >
              <span className="absolute h-0.5 w-3 rounded-full bg-current" />
              <span
                className={cn(
                  "absolute h-3 w-0.5 rounded-full bg-current",
                  "transition-transform duration-[var(--duration-normal)] ease-out",
                  "group-open:scale-y-0 motion-reduce:transition-none",
                )}
              />
            </span>
          </summary>
          <p className="measure pb-5 text-body text-text-secondary">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
