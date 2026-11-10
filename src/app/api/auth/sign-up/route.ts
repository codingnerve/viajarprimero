import {
  authErrorResponse,
  EMAIL_PATTERN,
  field,
  invalid,
  PIN_PATTERN,
  readBody,
  verifyUrl,
} from "@/features/account/lib/auth-request";
import { saveSession } from "@/features/account/lib/session";
import { signUpWithPin } from "@/lib/providers/supabase-auth";

export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) return invalid("The request could not be read.", 400);

  const name = field(body, "name").slice(0, 80);
  const email = field(body, "email");
  const pin = field(body, "pin");

  if (!name) return invalid("Please add your name.");
  if (!EMAIL_PATTERN.test(email)) return invalid("That email address does not look right.");
  if (!PIN_PATTERN.test(pin)) return invalid("Your PIN must be 6 digits.");

  try {
    const session = await signUpWithPin({
      name,
      email,
      pin,
      redirectTo: verifyUrl(request),
    });

    // No session means Supabase emailed a confirmation link first.
    if (!session) return Response.json({ ok: true, signedIn: false });

    await saveSession(session);
    return Response.json({ ok: true, signedIn: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
