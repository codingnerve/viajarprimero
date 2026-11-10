/**
 * The photographs behind the flight search hero.
 *
 * Declared rather than discovered, like the cruise, private-jet and car-rental
 * sets: a caption and alt text need somebody to have looked at the picture.
 *
 * ## No captions, only credits
 *
 * The cruise frames name the ship, because the name is painted on the hull.
 * There is no equivalent here — an airliner in a photograph is identifiable
 * only by a livery detail, and naming a carrier we happen to have a stock
 * photograph of would suggest a relationship with that airline we do not have.
 * Naming a type would be the same mistake: it is a guess read off a shape.
 *
 * The pictures do the job they are here to do, which is to make the band look
 * like air travel rather than a navy rectangle.
 */

export interface FlightHeroImage {
  /** Public path. Checked against the filesystem before it reaches next/image. */
  src: string;
  /**
   * What is in the frame.
   *
   * `HeroCarousel` renders these with an empty `alt` and hides the slide layer
   * from assistive technology, which is right for a decorative backdrop. It is
   * held so the next person choosing a frame can tell what each file is
   * without opening it.
   */
  alt: string;
  /** Photographer, as credited on Unsplash. */
  credit: string;
}

export const flightHeroImages: readonly FlightHeroImage[] = [
  {
    src: "/images/flights/slider/departure-at-sunset.jpg",
    alt: "An airliner lifting off a runway in low golden light, terminal buildings and hills behind it.",
    credit: "Avel Chuklanov",
  },
  {
    src: "/images/flights/slider/short-final.jpg",
    alt: "A widebody airliner on short final over lit approach lights, with a town and snow-covered mountains behind.",
    credit: "Pascal Meier",
  },
  {
    src: "/images/flights/slider/on-approach.jpg",
    alt: "A twin-engine airliner seen head-on with its gear down, against a blue sky and scattered cloud.",
    credit: "John McArthur",
  },
];
