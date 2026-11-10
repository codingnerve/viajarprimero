import { TrainsPageContent } from "@/features/trains/components/trains-page-content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Train Tickets & Rail Booking Guides",
  description:
    "Rail booking guides for train operators, with the corridors travellers ask about most. Send a rail request and an agent checks schedules and fares with you before anything is booked.",
  path: "/trains",
});

export default function TrainsPage() {
  return <TrainsPageContent />;
}
