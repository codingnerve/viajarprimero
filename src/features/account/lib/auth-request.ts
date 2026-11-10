import { PIN_LENGTH } from "@/lib/config/account";
import { AuthError } from "@/lib/providers/supabase-auth";

/** Shared plumbing for the /api/auth route handlers. */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PIN_PATTERN = new RegExp(`^\\d{${PIN_LENGTH}}$`);

export async function readBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const data: unknown = await request.json();
    return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const field = (body: Record<string, unknown>, key: string) => {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
};

export const invalid = (message: string, status = 422) =>
  Response.json({ message }, { status });

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  return Response.json(
    { message: "Something went wrong. Please try again." },
    { status: 500 },
  );
}

/** Where Supabase sends people back to after an email link or Google/Facebook. */
export const verifyUrl = (request: Request) =>
  `${new URL(request.url).origin}/account/verify`;

/**
 * A 303 built by hand: `Response.redirect()` has immutable headers, and the
 * session cookies still have to be added to the response.
 */
export const redirectTo = (location: string) =>
  new Response(null, { status: 303, headers: { Location: location } });
