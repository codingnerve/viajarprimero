import Link from "next/link";

import { AirlineLogo } from "@/components/content/airline-logo";
import { airlines } from "@/lib/content/airlines";

export type AirlineTopic = "check-in" | "baggage";

const TOPIC_LABEL: Record<AirlineTopic, string> = {
  "check-in": "Online check-in",
  baggage: "Baggage information",
};

/**
 * Every airline we book, with its logo and a "View details" link to that
 * airline's page — opened at the check-in or baggage section.
 *
 * Check-in and baggage rules belong to the airline, so this page does not
 * repeat them. It gets the traveller to the right airline in one click.
 *
 * Two tables side by side from `lg` up, one after the other below it.
 */
export function AirlineDirectory({ topic }: { topic: AirlineTopic }) {
  const label = TOPIC_LABEL[topic];
  const half = Math.ceil(airlines.length / 2);
  const halves = [airlines.slice(0, half), airlines.slice(half)];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {halves.map((list, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xs bg-surface ring-1 ring-inset ring-border"
        >
          <table className="w-full border-collapse text-body-sm">
            <caption className="sr-only">
              {label} by airline{index > 0 ? ", continued" : ""}
            </caption>
            <thead>
              <tr className="bg-secondary text-text-inverse">
                <th scope="col" className="px-4 py-3 text-left text-h6">
                  Airlines
                </th>
                <th scope="col" className="px-4 py-3 text-right text-h6">
                  {label}
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((airline) => (
                <tr
                  key={airline.slug}
                  className="border-t border-border transition-colors hover:bg-surface-2"
                >
                  <th scope="row" className="px-4 py-2.5 text-left font-normal">
                    <span className="flex items-center gap-3">
                      <AirlineLogo
                        code={airline.code}
                        name={airline.name}
                        className="h-9 w-20"
                      />
                      <span className="text-h6 uppercase text-text">
                        {airline.name}
                      </span>
                    </span>
                  </th>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      href={`/airlines/${airline.slug}#${topic}`}
                      aria-label={`${label} for ${airline.name}: view details`}
                      className="whitespace-nowrap rounded-xs text-body-sm text-primary underline underline-offset-2 hover:text-primary-hover focus-ring"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
