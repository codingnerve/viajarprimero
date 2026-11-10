import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { HotelTile } from "@/features/hotels/components/hotel-tile";
import {
  buildHotelSearchParams,
  hotelSearchHref,
} from "@/features/hotels/lib/hotel-search-params";
import { popularPlaces, searchHotels } from "@/lib/providers/liteapi";
import { formatLongDate } from "@/lib/utils/format-date";
import type { HotelSearchQuery } from "@/types/hotel";

const NIGHTS = 2;

function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Hotels with photos, guest ratings and prices on the hotels landing page.
 *
 * Every price comes from a real search — the first popular city, two adults,
 * two nights a month from today — and the dates are printed with it. With no
 * hotel supplier connected the section is left out, never filled with
 * made-up hotels.
 */
export async function PopularHotels() {
  const [place] = await popularPlaces();
  if (!place) return null;

  const query: HotelSearchQuery = {
    placeId: place.id,
    placeName: place.name,
    checkIn: isoDaysFromNow(30),
    checkOut: isoDaysFromNow(30 + NIGHTS),
    adults: 2,
    children: 0,
    rooms: 1,
  };

  const result = await searchHotels(query, { limit: 12 });
  if (!result.configured) return null;

  const hotels = result.hotels.filter((hotel) => hotel.price).slice(0, 4);
  if (hotels.length === 0) return null;

  const params = buildHotelSearchParams(query).toString();

  return (
    <Section>
      <SectionHeading
        eyebrow={`Hotels in ${place.name}`}
        title="Popular hotels right now"
        description={`Prices for 2 adults, ${NIGHTS} nights from ${formatLongDate(query.checkIn)}.`}
        action={
          <ButtonLink href={hotelSearchHref(query)} variant="outline" size="sm">
            See all hotels in {place.name}
          </ButtonLink>
        }
      />

      {result.source === "sample" && (
        <p className="mt-4 text-center text-caption text-text-muted">
          Sample data for development — not real hotels or prices.
        </p>
      )}

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <HotelTile
              hotel={hotel}
              href={`/hotels/stay/${hotel.id}?${params}`}
              nights={NIGHTS}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
