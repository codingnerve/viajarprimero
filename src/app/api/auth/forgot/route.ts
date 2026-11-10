import {
  authErrorResponse,
  EMAIL_PATTERN,
  field,
  invalid,
  readBody,
  verifyUrl,
} from "@/features/account/lib/auth-request";
import { AuthError, sendPinResetEmail } from "@/lib/providers/supabase-auth";

export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) return invalid("The request could not be read.", 400);

  const email = field(body, "email");
  if (!EMAIL_PATTERN.test(email)) return invalid("That email address does not look right.");

  try {
    await sendPinResetEmail(email, verifyUrl(request));
  } catch (error) {
    // Only surface "not set up" and rate limits; anything else would reveal
    // whether an account exists for that address.
    if (error instanceof AuthError && (error.status === 503 || error.status === 429)) {
      return authErrorResponse(error);
    }
  }

  return Response.json({ ok: true });
}
