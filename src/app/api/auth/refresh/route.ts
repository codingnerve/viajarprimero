import { redirectTo } from "@/features/account/lib/auth-request";
import {
  clearSession,
  readSession,
  saveSession,
} from "@/features/account/lib/session";
import { refreshSession } from "@/lib/providers/supabase-auth";

/**
 * Renews an expired access token, then returns to `next` with `refreshed=1`
 * so that page does not bounce back here a second time.
 */
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("next") ?? "/my-trips";
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/my-trips";

  const target = new URL(next, "http://local");
  target.searchParams.set("refreshed", "1");
  const back = `${target.pathname}${target.search}`;

  const { refreshToken } = await readSession();
  if (!refreshToken) return redirectTo(back);

  try {
    await saveSession(await refreshSession(refreshToken));
  } catch {
    await clearSession();
  }

  return redirectTo(back);
}
