import { subscribeToNewsletter } from "@/lib/providers/newsletter";

/**
 * Newsletter sign-up.
 *
 * Like the quote endpoint, this refuses rather than pretending: with no list
 * configured it returns 503 instead of thanking someone for subscribing to a
 * list that does not exist. See lib/providers/newsletter.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let payload: { email?: string; consent?: boolean };

  try {
    payload = (await request.json()) as { email?: string; consent?: boolean };
  } catch {
    return Response.json(
      { message: "The request body could not be read." },
      { status: 400 },
    );
  }

  const email = payload.email?.trim() ?? "";

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json(
      { message: "That email address does not look right." },
      { status: 422 },
    );
  }

  // Marketing consent is a separate, affirmative act — never inferred from the
  // fact that someone typed an address into a box.
  if (payload.consent !== true) {
    return Response.json(
      { message: "Please confirm you want to receive marketing emails." },
      { status: 422 },
    );
  }

  const result = await subscribeToNewsletter(email);

  if (result === "unconfigured") {
    return Response.json(
      { message: "Sign-ups are not open right now. Please try again later." },
      { status: 503 },
    );
  }

  if (result === "failed") {
    return Response.json(
      { message: "We could not complete the sign-up. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
