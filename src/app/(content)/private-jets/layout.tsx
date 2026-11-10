import { EarlyBirdModal } from "@/components/layout/early-bird-modal";
import { activePromotion } from "@/lib/config/promotions";

/**
 * Every page in this section gets the discount popup. The section's related
 * pages are no longer a band here - they hang off the footer's "Private jets"
 * link on hover, so they are reachable from every page rather than only after
 * a scroll to the bottom of this one.
 */
export default function PrivateJetsLayout({ children }: LayoutProps<"/private-jets">) {
  const promotion = activePromotion();

  return (
    <>
      {children}
      {promotion && <EarlyBirdModal promotion={promotion} />}
    </>
  );
}
