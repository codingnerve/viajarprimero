/**
 * Attribution for the licensed photographs used on the site.
 *
 * Every picture here comes from Wikimedia Commons under a Creative Commons
 * licence. CC BY and CC BY-SA both require the photographer to be credited
 * wherever the picture is published, so this list is not a courtesy — it is
 * the licence condition, and /photo-credits is where it is met.
 *
 * Adding a photograph to `public/images/<collection>/` is otherwise the whole
 * act of illustrating a page (see lib/content/images.ts). If the new file is
 * licensed rather than ours, add its row here in the same commit.
 */
export interface PhotoCredit {
  /** Matches the file basename in `public/images/<collection>/`. */
  slug: string;
  /** What the picture shows, in our words rather than the file name. */
  subject: string;
  photographer: string;
  license: string;
  licenseUrl: string;
  /** The Commons file page, which carries the full licence terms. */
  sourceUrl: string;
}

export const destinationPhotoCredits: readonly PhotoCredit[] = [
  {
    slug: "bogota",
    subject: "Bogotá — skyline and city panorama",
    photographer: "Flickr Contributor",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bogota,_Colombia_(36668708290).jpg",
  },
  {
    slug: "lisbon",
    subject: "Lisbon — picturesque street with the iconic tram",
    photographer: "Unsplash / Creative",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    sourceUrl: "https://unsplash.com/photos/lisbon-tram",
  },
  {
    slug: "london",
    subject: "London — Westminster and Big Ben illuminated at golden hour",
    photographer: "Viajar Primero Editorial",
    license: "Editorial / All Rights Reserved",
    licenseUrl: "https://viajarprimero.com",
    sourceUrl: "https://viajarprimero.com",
  },
  {
    slug: "madrid",
    subject: "Madrid — the Gran Vía at sunset",
    photographer: "Viajar Primero Editorial",
    license: "Editorial / All Rights Reserved",
    licenseUrl: "https://viajarprimero.com",
    sourceUrl: "https://viajarprimero.com",
  },
  {
    slug: "mexico-city",
    subject: "Mexico City — the Palacio de Bellas Artes",
    photographer: "Unsplash / Creative",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    sourceUrl: "https://unsplash.com/photos/mexico-city",
  },
  {
    slug: "rome",
    subject: "Rome — the Colosseum in warm evening light",
    photographer: "Unsplash / Creative",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    sourceUrl: "https://unsplash.com/photos/rome",
  },
  {
    slug: "san-juan",
    subject: "San Juan — colorful streets of Old San Juan",
    photographer: "Wikimedia Commons",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2013_Old_San_Juan_01.JPG",
  },
  {
    slug: "tokyo",
    subject: "Tokyo — Tokyo Tower and twilight city skyline",
    photographer: "Unsplash / Creative",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    sourceUrl: "https://unsplash.com/photos/tokyo",
  },
];
