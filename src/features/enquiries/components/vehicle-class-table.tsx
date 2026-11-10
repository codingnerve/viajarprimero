import { vehicleClasses } from "@/lib/content/car-hire";
import { cn } from "@/lib/utils/cn";

/**
 * Rental vehicle classes: seats, luggage and what each class suits.
 *
 * Keeps its own horizontal scroll rather than squeezing four columns into a
 * phone — `min-w` is what makes it scroll instead of wrapping every cell.
 */
export function VehicleClassTable({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0",
        className,
      )}
    >
      <table className="w-full min-w-[42rem] border-collapse text-body-sm">
        <caption className="sr-only">
          Rental vehicle classes, typical seating and luggage capacity
        </caption>
        <thead>
          <tr>
            {["Class", "Seats", "Luggage", "Worth knowing"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="border-b border-border-strong px-4 py-3 text-left text-overline uppercase text-text-muted"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicleClasses.map((vehicle) => (
            <tr key={vehicle.slug} className="transition-colors hover:bg-surface-2">
              <th
                scope="row"
                className="border-b border-border px-4 py-4 text-left align-top text-h6 text-text"
              >
                {vehicle.name}
                <span className="mt-0.5 block text-caption font-normal text-text-muted">
                  {vehicle.typicalFor}
                </span>
              </th>
              <td className="border-b border-border px-4 py-4 align-top tabular-nums text-text-secondary">
                {vehicle.seats}
              </td>
              <td className="border-b border-border px-4 py-4 align-top text-text-secondary">
                {vehicle.luggage}
              </td>
              <td className="border-b border-border px-4 py-4 align-top text-text-secondary">
                {vehicle.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
