import { cookies } from "next/headers";

import { accountCookies } from "@/lib/config/account";
import type { AuthSession } from "@/lib/providers/supabase-auth";

/**
 * The signed-in session, kept in httpOnly cookies so tokens never reach page
 * JavaScript. Writing is only allowed in route handlers.
 */

const MONTH = 60 * 60 * 24 * 30;

const options = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function saveSession(session: AuthSession) {
  const store = await cookies();

  store.set(accountCookies.accessToken, session.accessToken, {
    ...options,
    httpOnly: true,
    maxAge: Math.max(60, session.expiresIn - 60),
  });
  store.set(accountCookies.refreshToken, session.refreshToken, {
    ...options,
    httpOnly: true,
    maxAge: MONTH,
  });
  store.set(accountCookies.signedIn, "1", {
    ...options,
    httpOnly: false,
    maxAge: MONTH,
  });
}

export async function clearSession() {
  const store = await cookies();
  for (const name of Object.values(accountCookies)) store.delete(name);
}

export async function readSession() {
  const store = await cookies();
  return {
    accessToken: store.get(accountCookies.accessToken)?.value ?? null,
    refreshToken: store.get(accountCookies.refreshToken)?.value ?? null,
  };
}
