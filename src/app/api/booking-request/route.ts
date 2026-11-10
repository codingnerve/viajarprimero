import {
  hasErrors,
  validateBookingRequest,
  type BookingRequest,
} from "@/features/booking/lib/booking-request";
import { deliverToTeam } from "@/lib/providers/team-inbox";

/**
 * Receives a flight quote request and sends it to the team (see
 * lib/providers/team-inbox).
 *
 * With no delivery configured the endpoint returns 503 rather than 200: a form
 * that reports success while the request goes nowhere is the worst possible
 * failure here — the traveller stops looking, and nobody sees the enquiry.
 */
export async function POST(request: Request) {
  let payload: Partial<BookingRequest>;

  try {
    payload = (await request.json()) as Partial<BookingRequest>;
  } catch {
    return Response.json(
      { message: "The request body could not be read." },
      { status: 400 },
    );
  }

  // Re-run the same validation the form ran. Client-side checks are a courtesy
  // to the traveller, not a control on what reaches us.
  const errors = validateBookingRequest(payload);
  if (hasErrors(errors)) {
    return Response.json(
      { message: "Some details need correcting.", errors },
      { status: 422 },
    );
  }

  const email = (payload as { email?: unknown }).email;

  const result = await deliverToTeam({
    type: "booking-request",
    subject: "New flight quote request",
    request: payload,
    replyTo: typeof email === "string" ? email : undefined,
  });

  if (result === "unconfigured") {
    return Response.json(
      {
        message:
          "Online requests are not accepting submissions right now. Please contact us directly and we will take your details.",
      },
      { status: 503 },
    );
  }

  if (result === "failed") {
    return Response.json(
      {
        message:
          "We could not record your request. Please try again, or contact us directly.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
