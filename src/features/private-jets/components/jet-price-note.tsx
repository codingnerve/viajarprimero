import { cn } from "@/lib/utils/cn";

/**
 * The pricing disclaimer.
 *
 * It is a component rather than a paragraph copied onto three pages so the
 * wording cannot drift between them. A charter price is not a fare: it moves
 * with the aircraft finally assigned, the routing, crew duty limits, landing
 * and handling fees at the specific fields, and the operator's own final
 * confirmation. Presenting a marketplace estimate as a bookable total is the
 * single most common misrepresentation in this industry.
 *
 * `variant="inline"` is the one that sits under a results list; `"panel"` is
 * the boxed version for a page that has no list above it to attach to.
 */
export function JetPriceNote({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "panel";
  className?: string;
}) {
  const body = (
    <>
      Displayed prices are estimates and may change based on availability,
      aircraft selection, routing, and final operator confirmation. Your final
      price will be confirmed by our team before booking.
    </>
  );

  if (variant === "panel") {
    return (
      <aside
        className={cn(
          "rounded-xl bg-brand-wash-soft p-5 ring-1 ring-inset ring-border",
          className,
        )}
      >
        <h2 className="text-overline uppercase text-text-muted">
          About these prices
        </h2>
        <p className="measure mt-2 text-body-sm text-text-secondary">{body}</p>
        <p className="measure mt-2 text-caption text-text-muted">
          Flights are operated by licensed air carriers, not by us. Empty legs
          are sold subject to the originating charter and can be re-timed or
          withdrawn at short notice.
        </p>
      </aside>
    );
  }

  return (
    <p className={cn("measure-wide text-caption text-text-muted", className)}>
      {body} Flights are operated by licensed air carriers, not by us.
    </p>
  );
}
