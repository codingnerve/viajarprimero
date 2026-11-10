import { siteConfig } from "@/lib/config/site";

/**
 * Brevo (free plan, 300 emails a day).
 *
 * Sends the team's notification emails and adds newsletter subscribers to a
 * contact list.
 *
 *   BREVO_API_KEY              API key (Brevo → SMTP & API → API keys)
 *   BREVO_SENDER_EMAIL         a sender address verified in Brevo
 *   BREVO_NEWSLETTER_LIST_ID   numeric id of the newsletter contact list
 */

const API = "https://api.brevo.com/v3";
const API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const LIST_ID = Number(process.env.BREVO_NEWSLETTER_LIST_ID);

export const brevoEmailConfigured = () => Boolean(API_KEY && SENDER_EMAIL);

export const brevoListConfigured = () =>
  Boolean(API_KEY) && Number.isInteger(LIST_ID) && LIST_ID > 0;

async function post(path: string, body: unknown): Promise<boolean> {
  if (!API_KEY) return false;

  try {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!SENDER_EMAIL) return Promise.resolve(false);

  return post("/smtp/email", {
    sender: { email: SENDER_EMAIL, name: siteConfig.name },
    to: [{ email: to }],
    subject,
    textContent: text,
    ...(replyTo ? { replyTo: { email: replyTo } } : {}),
  });
}

/** Adds (or updates) a contact on the newsletter list. */
export function addNewsletterContact(email: string): Promise<boolean> {
  if (!brevoListConfigured()) return Promise.resolve(false);

  return post("/contacts", {
    email,
    listIds: [LIST_ID],
    updateEnabled: true,
  });
}
