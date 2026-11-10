import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Prose } from "@/components/content/prose";
import { jetRoutes } from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Popular private jet routes",
  description:
    "The private jet routes we are asked about most, written around the business-aviation airports actually used on each city pair — distances, approximate block times and what constrains each leg.",
  path: "/private-jets/routes",
});

/**
 * Route index.
 *
 * Carries no prices, for the same reason the scheduled-flight route pages do:
 * charter is quoted per aircraft per leg and moves with positioning and the
 * day, so a "from" figure here would be invented. What it carries instead is
 * the airport pair, which is where most of the actual time saving on these
 * legs comes from and which almost nobody leads with.
 */
export default function JetRoutesPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Routes", path: "/private-jets/routes" },
        ]}
        eyebrow="Route guide"
        title="Popular private jet routes"
        intro="Each of these covers the airports business aviation actually uses on that city pair, the distance, roughly how long it takes, and the thing that constrains it — which is usually an airport slot or a crew duty limit rather than the aircraft."
        actions={
          <ButtonLink href="/private-jets/request-a-quote">
            Price a different leg
          </ButtonLink>
        }
      />

      <Section>
        <ul className="grid gap-4 md:grid-cols-2">
          {jetRoutes.map((route) => (
            <li key={route.slug}>
              <Link
                href={`/private-jets/routes/${route.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none focus-ring"
              >
                <div className="flex items-center gap-3">
                  <span className="text-h2 tabular-nums text-text">
                    {route.originCode}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative flex h-px flex-1 items-center"
                  >
                    <span className="h-px w-full border-t border-dashed border-divider" />
                    <ArrowRightIcon className="absolute left-1/2 size-4 -translate-x-1/2 bg-surface text-primary transition-transform duration-[var(--duration-slow)] ease-out group-hover:translate-x-1 motion-reduce:transform-none" />
                  </span>
                  <span className="text-h2 tabular-nums text-text">
                    {route.destinationCode}
                  </span>
                </div>

                <h2 className="mt-4 text-h5 text-text">
                  {route.originCity} to {route.destinationCity}
                </h2>
                <p className="mt-1 text-caption text-text-muted">
                  {route.originAirport} · {route.destinationAirport}
                </p>

                <p className="mt-4 flex-1 text-body-sm text-text-secondary">
                  {route.intro}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-caption">
                  <div>
                    <dt className="text-text-muted">Distance</dt>
                    <dd className="mt-0.5 font-medium tabular-nums text-text">
                      {route.distanceNm.toLocaleString("en-US")} nm
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Block time</dt>
                    <dd className="mt-0.5 font-medium text-text">
                      {route.blockTime}
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16">
          <h2 className="text-h2 text-text">Why we publish no prices here</h2>
          <Prose className="mt-4">
            <p>
              Charter is priced per aircraft per leg, and the largest variable
              is where the aircraft happens to be. The same New York to Miami
              flight can differ by thousands depending on whether a suitable
              aircraft is already sitting at Teterboro or has to be flown in
              from elsewhere — and that changes day to day.
            </p>
            <p>
              A &ldquo;from&rdquo; figure on a page like this would be a number
              picked from the most favourable day of the year and shown to
              everyone. Send us the leg and the dates and you get a real one,
              built the way the{" "}
              <Link href="/private-jets/charter">charter page</Link> describes.
            </p>
          </Prose>
        </section>
      </Section>
    </>
  );
}
