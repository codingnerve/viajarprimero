import { TrainsPageContent } from "@/features/trains/components/trains-page-content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Train Tickets & Rail Booking",
  description:
    "Book train tickets with a real travel agent. Send a rail request and we check schedules, fares and ticket rules with you before anything is booked.",
  path: "/trains",
});

export default function TrainsPage() {
  return <TrainsPageContent />;
}
