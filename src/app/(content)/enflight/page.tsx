import { FlightLandingPage } from "@/features/booking/components/flight-landing-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Book a Flight by Phone",
  description:
    "Call a real travel agent to book your flight. You hear the airfare, taxes, carrier charges and our fee, plus the fare rules, before you pay.",
  path: "/enflight",
  languages: { en: "/enflight", es: "/esflights" },
});

export default function EnFlightPage() {
  return <FlightLandingPage />;
}
