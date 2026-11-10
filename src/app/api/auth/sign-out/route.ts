import { redirectTo } from "@/features/account/lib/auth-request";
import { clearSession, readSession } from "@/features/account/lib/session";
import { signOutSession } from "@/lib/providers/supabase-auth";

export async function POST() {
  const { accessToken } = await readSession();
  if (accessToken) await signOutSession(accessToken);

  await clearSession();
  return redirectTo("/");
}
