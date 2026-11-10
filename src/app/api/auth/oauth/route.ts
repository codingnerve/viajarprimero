import { redirectTo, verifyUrl } from "@/features/account/lib/auth-request";
import { oauthSignInUrl } from "@/lib/providers/supabase-auth";

/** Starts Google or Facebook sign-in: /api/auth/oauth?provider=google */
export async function GET(request: Request) {
  const provider = new URL(request.url).searchParams.get("provider");
  if (provider !== "google" && provider !== "facebook") return redirectTo("/my-trips");

  return redirectTo(oauthSignInUrl(provider, verifyUrl(request)) ?? "/my-trips");
}
