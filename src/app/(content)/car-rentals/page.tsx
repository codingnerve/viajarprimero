import { CustomerReviews } from "@/components/content/customer-reviews";
import { DealCategoryGrid } from "@/components/content/deal-category-grid";
import { PhotoTileGrid, type PhotoTile } from "@/components/content/photo-tile-grid";
import { Prose } from "@/components/content/prose";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { HeroCarousel, type HeroSlide } from "@/components/ui/hero-carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryBand } from "@/features/enquiries/components/enquiry-band";
import { VehicleClassTable } from "@/features/enquiries/components/vehicle-class-table";
import { getAirport } from "@/lib/content/airports";
import { carRentalHeroImages } from "@/lib/content/car-rental-hero";
import { publicFileExists, type PhotoCollection } from "@/lib/content/images";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Car rental",
  description:
    "Rent a car at airports and city locations in the US and abroad. Tell us where and when, and a real travel agent finds the right car and books it with you.",
  path: "/car-rentals",
});

/** Airport code, photo collection, photo basename. */
const LOCATIONS: ReadonlyArray<[string, PhotoCollection, string]> = [
  ["LAX", "home", "car-hire-road-trip"],
  ["MIA", "home", "car-hire-suv"],
  ["JFK", "home", "car-hire-compact"],
  ["ORD", "home", "car"],
  ["LHR", "destinations", "london"],
  ["FCO", "destinations", "rome"],
  ["LIS", "destinations", "lisbon"],
  ["MEX", "destinations", "mexico-city"],
];

export default function CarRentalsPage() {
  // No captions: one frame shows a registration plate, and a caption would
  // imply a specific car or a place we hold fleet.
  const heroSlides: HeroSlide[] = carRentalHeroImages.map((image) => ({
    id: image.src,
    src: publicFileExists(image.src) ? image.src : null,
    alt: image.alt,
    detail: `Photo: ${image.credit}`,
  }));

  const locationTiles: PhotoTile[] = LOCATIONS.flatMap(([code, collection, photo]) => {
    const airport = getAirport(code);
    return airport
      ? [
          {
            href: `/car-rentals/${code.toLowerCase()}`,
            title: `Cars in ${airport.city}`,
            subtitle: `${airport.code} airport`,
            collection,
            photoSlug: photo,
            alt: `Car rental in ${airport.city}`,
          },
        ]
      : [];
  });

  return (
    <>
      <Section
        tone="brand"
        size="lg"
        containerClassName="flex min-h-96 flex-col justify-center pb-20 md:min-h-[30rem] md:pb-24"
        backdrop={<HeroCarousel slides={heroSlides} />}
      >
        <Breadcrumbs
          tone="inverse"
          items={[
            { name: "Home", path: "/" },
            { name: "Car rental", path: "/car-rentals" },
          ]}
        />
        <PageHeader
          className="mt-8"
          tone="inverse"
          eyebrow="Car rental"
          title="Car rental made simple"
          intro="Airport or city pick-up, compact car or SUV — tell us where and when you need it, and a real agent finds the right car and books it with you."
        />
      </Section>

      {/* z-20: Section sets `isolate`, so the next band would paint over an open picklist. */}
      <Section tone="muted" bordered className="z-20">
        <EnquiryBand
          vertical="car"
          eyebrow="Tell us the trip"
          title="Request car rental options"
          description="Where you are collecting, the dates, and roughly what size of car. An agent gets back to you with the cars available."
          points={[
            "No account, and no card details",
            "Nothing is held and nothing is charged",
            "A real agent gets back to you",
            "Airport and city pick-up locations",
          ]}
          disclaimer="We are a travel agency, not a rental company. The car is supplied by the rental firm and its own rental agreement governs the hire."
        />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Locations"
          title="Popular car rental locations"
          description="Pick up at the airport as you land, or in the city when you are ready to drive."
        />
        <div className="mt-10">
          <PhotoTileGrid tiles={locationTiles} />
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Vehicle classes"
          title="Choose the right size of car"
          description="Rental companies guarantee the class, not the exact model — so pick the class that fits your group and your luggage."
        />
        <VehicleClassTable className="mt-8" />
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Deals" title="Car rental deals" />
        <div className="mt-10">
          <DealCategoryGrid
            variant="compact"
            featured={["car-deals", "vacation-deals", "family-deals", "existing-customer-deals"]}
          />
        </div>
      </Section>

      <Section>
        <CustomerReviews vertical="car" />
      </Section>

      <Section size="sm">
        <h2 className="text-h2 text-text">Before you drive away</h2>
        <Prose className="mt-4">
          <p>
            Photograph the car from every corner before you leave the bay,
            including the roof, the wheels and the windscreen, and do the same
            on return. It takes three minutes and settles almost any damage
            question before it starts.
          </p>
          <p>
            Bring your physical driving licence, a card in the main
            driver&apos;s own name, and an International Driving Permit where
            the country requires one.
          </p>
        </Prose>
      </Section>
    </>
  );
}
