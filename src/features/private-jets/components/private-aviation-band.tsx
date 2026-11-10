import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/types/locale";

const bandCopy = {
  en: {
    eyebrow: "Private aviation",
    description:
      "Charter is priced per aircraft rather than per seat, which is what makes the schedule yours — several stops in a day, a departure time that is on nobody's timetable, an airfield the airlines do not serve.",
    points: [
      {
        title: "Priced all-in",
        body: "Positioning, crew, landing and handling are in the number, not added later.",
      },
      {
        title: "Operator named",
        body: "You know which licensed carrier is flying you before you pay.",
      },
      {
        title: "Told when not to",
        body: "If business class is the better answer on your route, we say so.",
      },
    ],
    explore: "Explore private jets",
    quote: "Request a charter quote",
    cabinAlt:
      "Cream leather club seats facing each other in a private jet cabin, cockpit visible beyond",
    airstairAlt: "Business jet on the apron with its airstair lowered",
  },
  es: {
    eyebrow: "Aviación privada",
    description:
      "El chárter se cotiza por aeronave y no por asiento, y eso es lo que hace suyo el itinerario: varias escalas en un día, una hora de salida que no figura en el horario de nadie, un aeródromo al que no llegan las aerolíneas.",
    points: [
      {
        title: "Precio todo incluido",
        body: "El posicionamiento, la tripulación, el aterrizaje y el manejo en tierra están incluidos en el precio, no se añaden después.",
      },
      {
        title: "Operador identificado",
        body: "Usted sabe qué transportista autorizado lo llevará antes de pagar.",
      },
      {
        title: "Se lo decimos cuando no conviene",
        body: "Si la clase ejecutiva es la mejor opción para su ruta, se lo decimos.",
      },
    ],
    explore: "Explorar aviones privados",
    quote: "Solicitar cotización de chárter",
    cabinAlt:
      "Asientos de cuero color crema frente a frente en la cabina de un avión privado, con la cabina de mando al fondo",
    airstairAlt: "Jet ejecutivo en la plataforma con la escalerilla bajada",
  },
} as const;

/**
 * The home page's door into private aviation.
 *
 * The three `points` are statements about how we behave that a page on this
 * site spells out, not superlatives. "Largest fleet" and "available in 4
 * hours" are the two things every competitor says here and neither is
 * something a broker can substantiate.
 *
 * It was a text-only navy band, and against a hero that is already a navy
 * field it read as more of the same. This is a light editorial spread instead:
 * a photo mosaic carries the "different order of thing" signal that the dark
 * ground used to.
 *
 * Corners are 4px throughout, buttons included. `cn` does not merge
 * conflicting utilities, so the buttons use the important modifier to beat
 * the pill radius Button bakes in rather than changing it site-wide.
 */
export function PrivateAviationBand({ locale = "en" }: { locale?: Locale }) {
  const copy = bandCopy[locale];

  return (
    <Section tone="surface" size="lg">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
        {/* Mosaic. The overlap needs room beneath it, hence the bottom pad. */}
        <div className="relative pb-12 sm:pb-16">
          <Photo
            collection="home"
            slug="jet-cabin"
            src="/images/private-jet/slider/jet-cabin.jpg"
            alt={copy.cabinAlt}
            sizes="(min-width: 1024px) 460px, 70vw"
            className="aspect-[4/5] w-[68%] rounded-lg"
          />
          <div className="absolute bottom-0 right-0 w-3/5 rounded-lg bg-surface p-1.5 shadow-xl">
            <Photo
              collection="home"
              slug="jet-airstair"
              src="/images/private-jet/slider/jet-airstair.jpg"
              alt={copy.airstairAlt}
              sizes="(min-width: 1024px) 340px, 60vw"
              className="aspect-[3/2] rounded-md"
            />
          </div>
        </div>

        <div className="max-lg:order-first">
          <SectionHeading
            align="start"
            eyebrow={copy.eyebrow}
            description={copy.description}
          />

          <ol className="mt-8 space-y-6">
            {copy.points.map((point, index) => (
              <li key={point.title} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="pt-px text-h6 tabular-nums text-primary"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-h6 text-text">{point.title}</p>
                  <p className="mt-1 text-caption text-text-secondary">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/private-jets" size="lg" className="rounded-xs!">
              {copy.explore}
            </ButtonLink>
            <ButtonLink
              href="/private-jets/request-a-quote"
              variant="outline"
              size="lg"
              className="rounded-xs!"
            >
              {copy.quote}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
