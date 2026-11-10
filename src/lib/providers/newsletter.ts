import { addNewsletterContact, brevoListConfigured } from "@/lib/providers/brevo";
import type { DeliveryResult } from "@/lib/providers/team-inbox";

/**
 * Newsletter sign-ups: the Brevo contact list, or NEWSLETTER_WEBHOOK_URL if a
 * different list provider is used instead.
 */

const WEBHOOK_URL = process.env.NEWSLETTER_WEBHOOK_URL;

export async function subscribeToNewsletter(email: string): Promise<DeliveryResult> {
  if (brevoListConfigured()) {
    return (await addNewsletterContact(email)) ? "sent" : "failed";
  }

  if (!WEBHOOK_URL) return "unconfigured";

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "newsletter-signup",
        email,
        consentAt: new Date().toISOString(),
        source: "website",
      }),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
