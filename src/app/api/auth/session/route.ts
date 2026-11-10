import {
  authErrorResponse,
  field,
  invalid,
  readBody,
} from "@/features/account/lib/auth-request";
import { saveSession } from "@/features/account/lib/session";
import { getAccountUser } from "@/lib/providers/supabase-auth";

/**
 * Stores the session handed back in an email link or after Google/Facebook
 * (read from the URL by /account/verify). The token is checked with Supabase
 * before it is trusted.
 */
export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) return invalid("The request could not be read.", 400);

  const accessToken = field(body, "accessToken");
  const refreshToken = field(body, "refreshToken");
  const expiresIn = Number(body.expiresIn);
  if (!accessToken || !refreshToken) return invalid("This link is incomplete.", 400);

  try {
    await getAccountUser(accessToken);
    await saveSession({
      accessToken,
      refreshToken,
      expiresIn: Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 3600,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
