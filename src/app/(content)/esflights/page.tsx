import { FlightLandingPageEs } from "@/features/booking/components/flight-landing-page-es";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Reserve su vuelo por teléfono",
  description:
    "Llame a un agente de viajes real para reservar su vuelo. Usted escucha la tarifa aérea, los impuestos, los cargos de la aerolínea y nuestra tarifa, más las reglas tarifarias, antes de pagar.",
  path: "/esflights",
  locale: "es_US",
  languages: { en: "/enflight", es: "/esflights" },
});

export default function EsFlightPage() {
  return <FlightLandingPageEs />;
}
