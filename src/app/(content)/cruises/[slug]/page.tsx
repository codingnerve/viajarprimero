import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/content/prose";
import { cruiseLines, getCruiseLine } from "@/lib/content/cruise-lines";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Cruise line page.
 *
 * Describes who a line suits and links to the line's own site for itineraries
 * and fares. We do not republish sailing dates or prices: they change weekly,
 * and a stale itinerary presented as current is a claim about availability we
 * have no basis for making.
 */

export function generateStaticParams() {
  return cruiseLines.map((line) => ({ slug: line.slug }));
}

export async function generateMetadata(props: PageProps<"/cruises/[slug]">) {
  const { slug } = await props.params;
  const line = getCruiseLine(slug);
  if (!line) return {};

  return buildMetadata({
    title: `${line.name} cruises`,
    description: `${line.character} Where ${line.name} sails, and what its fares do and do not include.`,
    path: `/cruises/${line.slug}`,
  });
}

export default async function CruiseLinePage(
  props: PageProps<"/cruises/[slug]">,
) {
  const { slug } = await props.params;
  const line = getCruiseLine(slug);
  if (!line) notFound();

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cruises", path: "/cruises" },
          { name: line.name, path: `/cruises/${line.slug}` },
        ]}
        eyebrow={`Based in ${line.basedIn}`}
        title={`${line.name} cruises`}
        intro={line.character}
      >
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {line.sailingRegions.map((region) => (
            <li key={region}>
              <Badge tone="neutral">{region}</Badge>
            </li>
          ))}
        </ul>
      </PageIntro>

      <Section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">Where {line.name} sails</h2>
              <Prose>
                <p>
                  {line.name} has an established presence in{" "}
                  {line.sailingRegions.slice(0, -1).join(", ")}
                  {line.sailingRegions.length > 1 ? " and " : ""}
                  {line.sailingRegions[line.sailingRegions.length - 1]}.
                  Deployment shifts season to season, so treat this as where the
                  line reliably operates rather than a list of what is on sale
                  today.
                </p>
                <p>
                  Current itineraries, sailing dates and fares live with the line
                  itself. We do not republish them here because they change
                  weekly and a stale itinerary is worse than none —{" "}
                  <a href={line.website} rel="noopener noreferrer nofollow" target="_blank">
                    {line.name}&apos;s own site
                  </a>{" "}
                  is the authority. Tell us the region and the window and we will
                  compare what is actually available across lines.
                </p>
              </Prose>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-h3 text-text">
                What to confirm before booking
              </h2>
              <Prose>
                <ul>
                  <li>
                    How many sea days the itinerary has, and how many hours each
                    port call actually allows ashore once tendering is counted.
                  </li>
                  <li>
                    Whether the cabin grade you are quoted is a specific cabin or
                    a guarantee to be assigned later.
                  </li>
                </ul>
              </Prose>
            </section>

            <nav aria-label="Related pages" className="border-t border-border pt-6">
              <ul className="flex flex-wrap gap-3">
                <li>
                  <Link
                    href="/cruises"
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    All cruise lines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/travel-blog/choosing-a-first-cruise"
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    Choosing a first cruise
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flights"
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    Flights to the departure port
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <EnquiryPanel
            vertical="cruise"
            title={`Request a ${line.name} sailing`}
            intro="An agent gets back to you with sailings that fit. Nothing is held and nothing is charged."
            disclaimer="We are a travel agency, not a cruise line. Sailings are operated by the line, and its own passenger ticket contract governs the voyage."
            initial={{ cruiseLineSlug: line.slug }}
          />
        </div>
      </Section>
    </>
  );
}
