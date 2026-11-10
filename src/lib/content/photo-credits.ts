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
    subject: "Bogotá — the centre below Monserrate",
    photographer: "Jos Cuevasc",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Monserrate_y_centro_de_Bogota.jpg",
  },
  {
    slug: "lisbon",
    subject: "Lisbon — rooftops and the 25 de Abril bridge",
    photographer: "acediscovery",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:LisbonSkyline.jpg",
  },
  {
    slug: "london",
    subject: "London — Tower Bridge from the Thames",
    photographer: "Dietmar Rabich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:London,_Tower_Bridge_--_2016_--_4787.jpg",
  },
  {
    slug: "madrid",
    subject: "Madrid — the Plaza Mayor",
    photographer: "Suicasmo",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Plaza_Mayor,_Madrid_20180720.jpg",
  },
  {
    slug: "mexico-city",
    subject: "Mexico City — the Zócalo and the Metropolitan Cathedral",
    photographer: "Jeff Kramer",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mexico_City_Zocalo_Cathedral.jpg",
  },
  {
    slug: "rome",
    subject: "Rome — the Colosseum at dusk",
    photographer: "JuventusTorin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Colosseum_Rome_at_evening.JPG",
  },
  {
    slug: "san-juan",
    subject: "San Juan — the umbrellas over Calle Fortaleza",
    photographer: "Jorge Rodriguez",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Calle_Fortaleza_with_umbrellas_in_Old_San_Juan,_Puerto_Rico.jpg",
  },
  {
    slug: "tokyo",
    subject: "Tokyo — Shibuya with Mount Fuji beyond",
    photographer: "Syced",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Shibuya_and_Mount_Fuji_seen_from_Roppongi_Hills.jpg",
  },
];
