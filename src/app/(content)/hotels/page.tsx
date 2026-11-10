import { redirect } from "next/navigation";

import { CustomerReviews } from "@/components/content/customer-reviews";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { PhotoTileGrid } from "@/components/content/photo-tile-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryBand } from "@/features/enquiries/components/enquiry-band";
import { HotelSearchForm } from "@/features/hotels/components/hotel-search-form";
import { PopularHotels } from "@/features/hotels/components/popular-hotels";
import {
  carriedFromUrl,
  hotelSearchRedirect,
} from "@/features/hotels/lib/hotel-search-redirect";
import { getResolvedDestinations } from "@/lib/content/destinations";
import { publicFileExists } from "@/lib/content/images";
import { popularPlaces } from "@/lib/providers/liteapi";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Hotels",
  description:
    "Search hotels by city and dates and compare photos, guest ratings and prices — or ask a travel agent to find the right room for you.",
  path: "/hotels",
});

const HERO_IMAGE = "/images/home/hotel.jpg";

export default async function HotelsPage(props: PageProps<"/hotels">) {
  // Old enquiry links arrive as `/hotels?where=…&start=…&end=…`. A destination
  // that resolves becomes a real search; otherwise the dates are carried into
  // the form below.
  const rawParams = await props.searchParams;
  const redirectTo = await hotelSearchRedirect(rawParams);
  if (redirectTo) redirect(redirectTo);

  const carriedSearch = carriedFromUrl(rawParams);
  const popular = await popularPlaces();
  const destinations = getResolvedDestinations();

  const heroSlides: HeroSlide[] = [
    {
      id: HERO_IMAGE,
      src: publicFileExists(HERO_IMAGE) ? HERO_IMAGE : null,
      alt: "A hotel stay",
    },
  ];

  return (
    <>
      {/* z-20 so the destination picker can hang below this band. */}
      <Section
        tone="brand"
        size="lg"
        className="z-20"
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <Breadcrumbs
          tone="inverse"
          items={[
            { name: "Home", path: "/" },
            { name: "Hotels", path: "/hotels" },
          ]}
        />
        <PageHeader
          className="mt-8"
          tone="inverse"
          eyebrow="Hotels"
          title="Find the right hotel for your trip"
          intro="Search by city and dates to compare photos, guest ratings and prices — or tell us what you need and an agent finds the room for you."
        />
        <div className="mt-10 rounded-xs bg-surface p-3 shadow-panel md:p-4">
          <HotelSearchForm tone="bare" popular={popular} initial={carriedSearch} />
        </div>
      </Section>

      <PopularHotels />

      <Section tone="surface">
        <SectionHeading
          eyebrow="Destinations"
          title="Explore hotels by city"
          description="Where to stay, when to go and how to get around in each city."
        />
        <div className="mt-10">
          <PhotoTileGrid
            tiles={destinations.map((destination) => ({
              href: `/hotels/${destination.slug}`,
              title: `Hotels in ${destination.city}`,
              subtitle: destination.country,
              photoSlug: destination.slug,
              src: destination.src,
              alt: `${destination.city}, ${destination.country}`,
            }))}
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Deals" title="Hotel deals" />
        <div className="mt-10">
          <DealCategoryGrid
            variant="compact"
            featured={["hotel-deals", "flight-hotel-deals", "couples-deals", "family-deals"]}
          />
        </div>
      </Section>

      <Section>
        <CustomerReviews vertical="stay" />
      </Section>

      <Section tone="muted" bordered>
        <EnquiryBand
          vertical="stay"
          eyebrow="Prefer to ask?"
          title="Request hotel options"
          description="Tell us the city, the dates and what matters to you, and an agent comes back with rooms that fit."
          points={[
            "No account, and no card details",
            "Nothing is held and nothing is charged",
            "A real agent gets back to you",
            "Hotels, resorts and apartments",
          ]}
          disclaimer="We are a travel agency, not a hotel. Rooms are supplied by the property, and its own booking conditions govern your stay."
        />
      </Section>
    </>
  );
}
