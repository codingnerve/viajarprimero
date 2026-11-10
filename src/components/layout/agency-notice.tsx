import { Alert } from "@/components/ui/alert";
import { siteConfig } from "@/lib/config/site";

/**
 * "We are not the airline" notice for pages whose names (manage booking,
 * check-in, baggage, support) could be mistaken for a carrier's own service.
 * Google Ads' Misrepresentation policy expects this stated up front.
 */
export function AgencyNotice({ className }: { className?: string }) {
  return (
    <Alert tone="info" className={className}>
      {siteConfig.name} is an independent travel agency. We are not an airline,
      hotel, rental company or cruise line, and we are not affiliated with or
      endorsed by any of them. Airline names belong to their owners.
    </Alert>
  );
}
