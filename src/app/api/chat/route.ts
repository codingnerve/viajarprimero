import { deliverToTeam } from "@/lib/providers/team-inbox";

/**
 * Receives a message from the chat's fallback form (used when Tawk.to live
 * chat is not set up) and sends it to the team inbox. 503 rather than a fake
 * success when no delivery is configured.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { message: "The request body could not be read." },
      { status: 400 },
    );
  }

  const name = text(payload.name, 80);
  const contact = text(payload.contact, 120);
  const message = text(payload.message, 2000);

  if (!name) {
    return Response.json({ message: "Please add your name." }, { status: 422 });
  }
  if (!EMAIL_PATTERN.test(contact) && !PHONE_PATTERN.test(contact)) {
    return Response.json(
      { message: "Add a phone number or email so an agent can reach you." },
      { status: 422 },
    );
  }
  if (!message) {
    return Response.json({ message: "Please write a message." }, { status: 422 });
  }

  const result = await deliverToTeam({
    type: "chat-message",
    subject: `Chat message from ${name}`,
    request: {
      name,
      contact,
      topic: text(payload.topic, 80),
      page: text(payload.page, 200),
      message,
    },
    replyTo: EMAIL_PATTERN.test(contact) ? contact : undefined,
  });

  if (result === "unconfigured") {
    return Response.json(
      { message: "Chat messages cannot be sent right now. Please call us instead." },
      { status: 503 },
    );
  }
  if (result === "failed") {
    return Response.json(
      { message: "We could not send your message. Please try again, or call us." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
