/**
 * The photographs behind the private-jet search hero.
 *
 * Declared rather than discovered from the directory, for the same reason as
 * the cruise set: each frame needs wording that only somebody who has looked
 * at the picture can write.
 *
 * ## These frames carry no caption, and that is deliberate
 *
 * The cruise photographs name the ship, because the name is printed on the
 * hull and saying it claims nothing. There is no equivalent here. One of these
 * aircraft carries a visible US registration, and captioning a specific tail
 * on a charter page implies we have that aircraft to offer — which is the one
 * thing this vertical must never imply. We are a broker: we do not own,
 * operate or crew aircraft, and no wording anywhere near this photography may
 * suggest otherwise.
 *
 * Naming a type would be a second problem. "Falcon 900" read off a photograph
 * is a guess, and a guess about the aircraft is exactly what a traveller
 * comparing charter quotes would take literally.
 *
 * So the chip beside each frame carries the photographer and nothing else, and
 * the pictures do the job they are actually here to do: making the band look
 * like private aviation rather than a navy rectangle.
 */

export interface PrivateJetHeroImage {
  /** Public path. Checked against the filesystem before it reaches next/image. */
  src: string;
  /**
   * What is in the frame.
   *
   * `HeroCarousel` renders these with an empty `alt` and hides the slide layer
   * from assistive technology, which is correct for a decorative backdrop.
   * This is held so the next person choosing a frame can tell what each file
   * is without opening it.
   */
  alt: string;
  /** Photographer, as credited on Unsplash. */
  credit: string;
}

export const privateJetHeroImages: readonly PrivateJetHeroImage[] = [
  {
    src: "/images/private-jet/slider/jet-on-the-ramp.jpg",
    alt: "A white business jet parked on an apron with its airstair down, two dark sports cars alongside it and a hangar behind.",
    credit: "Alen Kajtezović",
  },
  {
    src: "/images/private-jet/slider/jet-cabin.jpg",
    alt: "The cabin of a small business jet, four pale leather seats facing each other in club formation, the flight deck visible ahead through an open bulkhead.",
    credit: "Yaroslav Muzychenko",
  },
  {
    src: "/images/private-jet/slider/jet-airstair.jpg",
    alt: "A business jet on the ramp under broken cloud, airstair lowered and ground air connected.",
    credit: "Yuri G.",
  },
];
