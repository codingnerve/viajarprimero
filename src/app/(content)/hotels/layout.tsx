import { EarlyBirdModal } from "@/components/layout/early-bird-modal";
import { activePromotion } from "@/lib/config/promotions";

/**
 * Every page in this section gets the discount popup. The section's related
 * pages are no longer a band above the footer - they hang off that section's
 * link in the footer on hover, so they are reachable from anywhere on the
 * site rather than only from the bottom of these pages.
 */
export default function HotelsLayout({ children }: LayoutProps<"/hotels">) {
  const promotion = activePromotion();

  return (
    <>
      {children}
      {promotion && <EarlyBirdModal promotion={promotion} />}
    </>
  );
}
