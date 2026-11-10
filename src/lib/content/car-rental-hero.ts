/**
 * The photographs behind the car-rental hero.
 *
 * Declared rather than discovered, like the cruise and private-jet sets: a
 * caption and alt text need somebody to have looked at the picture.
 *
 * ## No captions, only credits
 *
 * The cruise frames name the ship, because the name is painted on the hull and
 * saying it claims nothing. There is no equivalent here, and two of these
 * carry things that must not be published on a rental page: one shows a
 * California registration plate, the other a satnav screen with a real town on
 * it. Captioning either would suggest a specific car, or a specific place we
 * hold fleet. We hold no fleet at all.
 *
 * Naming the models would be the same mistake in a different coat. These are
 * stock photographs; the car anybody is actually given is the rental company's
 * to choose within the class booked, which is what the vehicle-class table
 * further down the page exists to explain.
 */

export interface CarRentalHeroImage {
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

export const carRentalHeroImages: readonly CarRentalHeroImage[] = [
  {
    src: "/images/car-rental/suv-desert-road.jpg",
    alt: "A white full-size SUV parked on a gravel track in a red rock desert under a wide pale sky.",
    credit: "Sven D",
  },
  {
    src: "/images/car-rental/cockpit.jpg",
    alt: "The driver's side of a pickup truck cabin — steering wheel, instrument binnacle and a tall touchscreen showing a navigation map.",
    credit: "Brock Wegner",
  },
  {
    src: "/images/car-rental/instrument-cluster.jpg",
    alt: "A rev counter lit in white and blue against a black instrument cluster.",
    credit: "Chris Liverani",
  },
];
