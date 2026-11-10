import {
  authErrorResponse,
  EMAIL_PATTERN,
  field,
  invalid,
  PIN_PATTERN,
  readBody,
} from "@/features/account/lib/auth-request";
import { saveSession } from "@/features/account/lib/session";
import { signInWithPin } from "@/lib/providers/supabase-auth";

export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) return invalid("The request could not be read.", 400);

  const email = field(body, "email");
  const pin = field(body, "pin");
  if (!EMAIL_PATTERN.test(email) || !PIN_PATTERN.test(pin)) {
    return invalid("Enter your email and your 6-digit PIN.");
  }

  try {
    await saveSession(await signInWithPin(email, pin));
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
