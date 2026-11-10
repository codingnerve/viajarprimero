import Link from "next/link";

import { CustomerReviews } from "@/components/content/customer-reviews";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { Prose } from "@/components/content/prose";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryBand } from "@/features/enquiries/components/enquiry-band";
import { cruiseHeroImages } from "@/lib/content/cruise-hero";
import { cruiseLines } from "@/lib/content/cruise-lines";
import { publicFileExists } from "@/lib/content/images";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cruises",
  description:
    "Ocean and river cruises from US ports and around the world. Compare cruise lines and ask a travel agent for sailings that fit your dates.",
  path: "/cruises",
});

/**
 * Cruises landing page.
 *
 * The comparison is the point. Cruise fares are quoted low and inclusive of
 * very different things line to line, so the useful service is telling a
 * traveller what a fare covers before they book — not showing them a "from"
 * price that omits gratuities, drinks and port charges.
 *
 * ## What this page may not say
 *
 * No cruise supplier is connected to this site. The funnel is a written
 * request answered by a person, and the page has to read like one. It used to
 * claim rather more than that — that port charges "are in ours", that we
 * "confirm each of these for the specific sailing before you book", that we
 * can "quote the flights and the sailing together". Every one of those
 * describes an established booking operation in the present tense, and none of
 * them is something a traveller could hold us to.
 *
 * They are now written as what they actually are: what we will do when you
 * ask. The difference matters — a promise about answering a request is a
 * commitment we control, and a claim about how our quotes already work is one
 * we would be making up.
 *
 * The general statements about the industry stay, because they are true of it
 * rather than about us: gratuities are usually billed per day, speciality
 * restaurants usually cost extra, Wi-Fi is almost always extra. Each is hedged
 * where the practice genuinely varies.
 */

export default function CruisesPage() {
  /*
    A frame whose file is missing renders the brand plate rather than
    breaking the page. `next/image` throws on a src it cannot resolve, and in
    a Server Component that throw is a 500 on the whole route — so the path is
    checked here and dropped to null if the file is not there.
  */
  const heroSlides: HeroSlide[] = cruiseHeroImages.map((image) => ({
    id: image.src,
    src: publicFileExists(image.src) ? image.src : null,
    alt: image.alt,
    caption: image.caption,
    detail: `Photo: ${image.credit}`,
  }));

  return (
    <>
      {/*
        Ships behind the headline rather than a flat wash.

        The carousel is the same component as the home page hero, which is
        what keeps the crossfade, the Ken Burns drift, the pause control and
        the reduced-motion opt-out consistent — and WCAG 2.2.2 satisfied,
        since anything moving for more than five seconds needs a way to stop
        it.

        The extra bottom padding leaves room for the caption chip the
        carousel draws along its own bottom edge; without it the credit line
        sits under the intro text.
      */}
      <Section
        tone="brand"
        size="lg"
        containerClassName="pb-20 md:pb-24"
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <Breadcrumbs
          tone="inverse"
          items={[
            { name: "Home", path: "/" },
            { name: "Cruises", path: "/cruises" },
          ]}
        />

        <PageHeader
          className="mt-8"
          tone="inverse"
          eyebrow="Cruises"
          title="Find the right cruise for you"
          intro="Caribbean, Alaska, Europe and beyond. Tell us where and when you want to sail, and a real agent finds the ship and the cabin that suit you."
        />
      </Section>

      {/*
        The request, given the width. It sits directly under the hero rather
        than at the foot of the page because that is where a traveller arriving
        from the home page tab lands — the quick panel hands over with the
        port, the region and the date already in the URL, and scrolling past
        three sections of editorial to find the form they were promised is the
        wrong way round.

        z-20 because Section sets `isolate`, so each band is its own stacking
        context and the next one would otherwise paint over an open picklist.
      */}
      <Section tone="muted" bordered className="z-20">
        <EnquiryBand
          vertical="cruise"
          eyebrow="Tell us the sailing"
          title="Request cruise options"
          description="Three things to start: where you would sail from, where you want to go, and roughly when. An agent gets back to you with what is available and what the fare covers."
          points={[
            "No account, and no card details",
            "Nothing is held and nothing is charged",
            "A real agent gets back to you",
            "Ocean, river and expedition cruises",
          ]}
          disclaimer="We are a travel agency, not a cruise line. Sailings are operated by the line, and its own passenger ticket contract governs the voyage."
        />
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Cruise lines"
          title="Who each line is actually for"
          description="Plain descriptions of the onboard experience, not marketing positioning. Fares and itineraries live with the line itself and change constantly."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cruiseLines.map((line) => (
            <li key={line.slug}>
              <article className="group relative flex h-full flex-col rounded-xl bg-surface p-5 ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary">
                <h3 className="text-h4 text-text">
                  <Link
                    href={`/cruises/${line.slug}`}
                    className="outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
                  >
                    {line.name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-body-sm text-text-secondary">
                  {line.character}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {line.sailingRegions.map((region) => (
                    <li key={region}>
                      <Badge tone="neutral" size="sm">
                        {region}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <span
                  aria-hidden="true"
                  className="mt-4 flex items-center gap-1.5 text-body-sm font-semibold text-primary"
                >
                  Who it suits
                  <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Deals" title="Cruise deals" />
        <div className="mt-10">
          <DealCategoryGrid
            variant="compact"
            featured={["cruise-deals", "honeymoon-deals", "family-deals", "group-deals"]}
          />
        </div>
      </Section>

      <Section>
        <CustomerReviews vertical="cruise" />
      </Section>

      <Section size="sm">
        <h2 className="text-h2 text-text">Book the flight for the day before</h2>
        <Prose className="mt-4">
          <p>
            A cruise will not wait for a delayed flight. The cost of a hotel
            night in the departure port is trivial against the cost of missing
            the sailing entirely, and missing it is not covered by the cruise
            line.
          </p>
          <p>
            Say so in your request and we will look at the{" "}
            <Link href="/flights">flights</Link> alongside the sailing, so the
            connection between the two is somebody&apos;s responsibility rather
            than an assumption.
          </p>
        </Prose>
      </Section>
    </>
  );
}
