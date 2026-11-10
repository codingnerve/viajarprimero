import { Section } from "@/components/layout/section";

/**
 * Search results, loading.
 *
 * `/search` is the only dynamic route on the site: it awaits a fare supplier,
 * so it is the one page where the traveller can be left looking at nothing.
 * Next renders this instantly while the server works.
 *
 * The skeleton mirrors the real result list — a heading, then rows with an
 * itinerary block and a price rail — so the page does not visibly rearrange
 * itself when the offers arrive. Getting that wrong is worse than no skeleton
 * at all: a placeholder that does not match what replaces it reads as a second
 * page load.
 *
 * The whole thing is `aria-hidden` behind one polite status message. A screen
 * reader user wants "searching", not a description of eight grey rectangles.
 */
export default function SearchLoading() {
  return (
    <>
      <Section tone="brand" size="sm">
        <p role="status" className="sr-only">
          Searching for flights.
        </p>

        <div aria-hidden="true">
          <div className="h-9 w-72 max-w-full rounded-lg bg-white/15" />
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="h-4 w-56 rounded-full bg-white/10" />
            <div className="h-4 w-40 rounded-full bg-white/10" />
            <div className="h-4 w-24 rounded-full bg-white/10" />
          </div>
        </div>
      </Section>

      <Section size="sm" tone="muted" bordered>
        <div
          aria-hidden="true"
          className="h-36 rounded-2xl bg-surface shadow-sm ring-1 ring-inset ring-border md:h-32"
        />
      </Section>

      <Section size="sm">
        <div aria-hidden="true">
          <div className="skeleton h-7 w-40 rounded-lg" />

          <ul className="mt-6 space-y-4">
            {[0, 1, 2].map((row) => (
              <li
                key={row}
                className="flex flex-col overflow-hidden rounded-xl ring-1 ring-inset ring-border md:flex-row"
              >
                <div className="flex-1 space-y-4 p-5">
                  <div className="skeleton h-3.5 w-28 rounded-full" />
                  <div className="flex items-center gap-4">
                    <div className="skeleton h-7 w-16 rounded-md" />
                    <div className="skeleton h-px flex-1" />
                    <div className="skeleton h-7 w-16 rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <div className="skeleton h-6 w-32 rounded-full" />
                    <div className="skeleton h-6 w-28 rounded-full" />
                    <div className="skeleton h-6 w-36 rounded-full" />
                  </div>
                </div>

                <div className="shrink-0 space-y-3 bg-surface-2 p-5 md:w-60 md:border-l md:border-border">
                  <div className="skeleton h-8 w-28 rounded-md" />
                  <div className="skeleton h-3 w-32 rounded-full" />
                  <div className="skeleton h-3 w-full rounded-full" />
                  <div className="skeleton h-3 w-full rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
