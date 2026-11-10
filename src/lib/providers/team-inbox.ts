import { contactConfig } from "@/lib/config/site";
import { brevoEmailConfigured, sendEmail } from "@/lib/providers/brevo";

/**
 * Where quote requests, enquiries and chat messages go.
 *
 * An email to the team inbox through Brevo, and/or a POST to
 * BOOKING_REQUEST_WEBHOOK_URL (a CRM or a Zap). "unconfigured" when neither
 * is set, so the form can say so rather than pretend it sent.
 *
 * The inbox is `contactConfig.email` unless TEAM_INBOX_EMAIL overrides it.
 */

const WEBHOOK_URL = process.env.BOOKING_REQUEST_WEBHOOK_URL;
const INBOX = process.env.TEAM_INBOX_EMAIL ?? contactConfig.email;

export type DeliveryResult = "sent" | "unconfigured" | "failed";

export async function deliverToTeam({
  type,
  subject,
  request,
  replyTo,
}: {
  type: string;
  subject: string;
  request: object;
  replyTo?: string;
}): Promise<DeliveryResult> {
  const viaEmail = brevoEmailConfigured();
  if (!viaEmail && !WEBHOOK_URL) return "unconfigured";

  const receivedAt = new Date().toISOString();

  const results = await Promise.all([
    viaEmail
      ? sendEmail({
          to: INBOX,
          subject,
          text: `${subject}\nReceived: ${receivedAt}\n${describe(request)}`,
          replyTo,
        })
      : Promise.resolve(false),
    WEBHOOK_URL
      ? fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, receivedAt, request }),
        }).then(
          (response) => response.ok,
          () => false,
        )
      : Promise.resolve(false),
  ]);

  return results.some(Boolean) ? "sent" : "failed";
}

/** A readable plain-text dump of the request for the email body. */
function describe(value: unknown, indent = ""): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    return value.length === 0
      ? "—"
      : value.map((item) => `\n${indent}  - ${describe(item, `${indent}  `)}`).join("");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `\n${indent}${key}: ${describe(item, `${indent}  `)}`)
      .join("");
  }
  return String(value);
}
