import {
  authErrorResponse,
  field,
  invalid,
  PIN_PATTERN,
  readBody,
} from "@/features/account/lib/auth-request";
import { readSession } from "@/features/account/lib/session";
import { updatePin } from "@/lib/providers/supabase-auth";

/** Sets a new PIN for the session opened by a reset link. */
export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) return invalid("The request could not be read.", 400);

  const pin = field(body, "pin");
  if (!PIN_PATTERN.test(pin)) return invalid("Your PIN must be 6 digits.");

  const { accessToken } = await readSession();
  if (!accessToken) {
    return invalid("Your reset link has expired. Please request a new one.", 401);
  }

  try {
    await updatePin(accessToken, pin);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
