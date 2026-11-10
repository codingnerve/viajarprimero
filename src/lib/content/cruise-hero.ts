/**
 * The photographs behind the cruises hero.
 *
 * Declared rather than discovered from the directory, because each frame needs
 * a caption and alt text that only a person who has looked at the picture can
 * write. The auto-indexing in `lib/content/images` is right for a destination
 * card, where the slug is the caption; it cannot tell you which ship is in the
 * frame.
 *
 * ## Captions are read off the hull, not invented
 *
 * All three show a named ship whose name is legible in the photograph, so the
 * caption states it. What the captions deliberately do not say is *where* —
 * none of these locations is verifiable from the image, and labelling the
 * turquoise one "Caribbean" would be a guess presented as a fact on a page
 * that sells Caribbean sailings.
 *
 * They also imply nothing about what we sell. These are stock photographs of
 * ships operated by their lines; the disclaimer in the request band says who
 * operates a sailing and whose contract governs it.
 *
 * Photographer credits are carried because the frames come from Unsplash.
 * Attribution is not required by that licence, but it costs a line of type and
 * it is how you treat somebody whose work you are using.
 */

export interface CruiseHeroImage {
  /** Public path. Checked against the filesystem before it reaches next/image. */
  src: string;
  /**
   * What is in the frame.
   *
   * `HeroCarousel` renders these with an empty `alt` and hides the whole slide
   * layer from assistive technology, which is correct — the backdrop is
   * decorative and a screen reader should get the headline, not a running
   * commentary on ship photography. This is held because `HeroSlide` asks for
   * it, and because the next person choosing a frame should be able to tell
   * what each file is without opening it.
   */
  alt: string;
  /** The ship, as printed on the hull. */
  caption: string;
  /** Photographer, as credited on Unsplash. */
  credit: string;
}

export const cruiseHeroImages: readonly CruiseHeroImage[] = [
  {
    src: "/images/cruise/slider/royal-princess-at-sea.jpg",
    alt: "A large cruise ship under way on open water at sunset, seen from above, with an orange sky behind it.",
    caption: "Royal Princess",
    credit: "Alonso Reyes",
  },
  {
    src: "/images/cruise/slider/msc-divina-alongside.jpg",
    alt: "A cruise ship berthed at a pier beside a white sand beach, with clear turquoise water in the foreground.",
    caption: "MSC Divina",
    credit: "Georgy Trofimov",
  },
  {
    src: "/images/cruise/slider/regal-princess-at-dusk.jpg",
    alt: "A cruise ship at dusk with its decks lit, passengers on the upper rails, under a heavy cloudy sky.",
    caption: "Regal Princess",
    credit: "Peter Hansen",
  },
];
