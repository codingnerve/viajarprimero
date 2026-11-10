import type { AccountUser, Trip, TripKind } from "@/types/trip";

/**
 * Supabase (free plan): customer accounts and the `trips` table behind
 * /my-trips, over Supabase's REST API.
 *
 * Plain fetch rather than supabase-js — the project runs on next and react
 * alone, and these are the only calls the site makes.
 *
 * Needs SUPABASE_URL and SUPABASE_ANON_KEY. The table and its access policy
 * are in supabase-schema.sql next to this file.
 */

const BASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const ANON_KEY = process.env.SUPABASE_ANON_KEY;

export function accountsConfigured(): boolean {
  return Boolean(BASE_URL && ANON_KEY);
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
}

export class AuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const FRIENDLY_ERRORS: Record<string, string> = {
  invalid_credentials: "That email and PIN do not match.",
  email_not_confirmed:
    "Please confirm your email first — the link is in your inbox.",
  user_already_exists:
    "An account with this email already exists. Sign in instead.",
  weak_password: "Choose a different 6-digit PIN.",
  over_request_rate_limit: "Too many attempts. Please wait a minute and try again.",
  over_email_send_rate_limit:
    "Too many emails sent. Please try again in a little while.",
};

function errorMessage(data: Record<string, unknown>): string {
  const code =
    typeof data.error_code === "string"
      ? data.error_code
      : typeof data.code === "string"
        ? data.code
        : "";
  if (FRIENDLY_ERRORS[code]) return FRIENDLY_ERRORS[code];

  const text = [data.msg, data.error_description, data.message, data.error].find(
    (value): value is string => typeof value === "string",
  );
  if (text && /invalid login credentials/i.test(text)) {
    return FRIENDLY_ERRORS.invalid_credentials;
  }
  return text ?? "Something went wrong. Please try again.";
}

async function call<T>(
  path: string,
  {
    method = "GET",
    body,
    accessToken,
  }: { method?: string; body?: unknown; accessToken?: string } = {},
): Promise<T> {
  if (!BASE_URL || !ANON_KEY) {
    throw new AuthError(
      "Online accounts are not switched on yet. Please call us to manage your trip.",
      503,
    );
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${accessToken ?? ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new AuthError("We could not reach the account service. Please try again.", 502);
  }

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new AuthError(
      errorMessage((data ?? {}) as Record<string, unknown>),
      response.status,
    );
  }

  return data as T;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

function toSession(data: TokenResponse | null): AuthSession | null {
  if (!data?.access_token || !data.refresh_token) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in ?? 3600,
  };
}

function requireSession(data: TokenResponse | null): AuthSession {
  const session = toSession(data);
  if (!session) throw new AuthError("Sign-in did not complete. Please try again.", 502);
  return session;
}

const withRedirect = (path: string, redirectTo: string) =>
  `${path}?redirect_to=${encodeURIComponent(redirectTo)}`;

export async function signInWithPin(email: string, pin: string) {
  return requireSession(
    await call<TokenResponse>("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: { email, password: pin },
    }),
  );
}

/**
 * Returns a session when email confirmation is off; null when Supabase has
 * sent a confirmation email instead (the default, and the safe setting).
 */
export async function signUpWithPin(input: {
  name: string;
  email: string;
  pin: string;
  redirectTo: string;
}): Promise<AuthSession | null> {
  const data = await call<TokenResponse>(
    withRedirect("/auth/v1/signup", input.redirectTo),
    {
      method: "POST",
      body: {
        email: input.email,
        password: input.pin,
        data: { full_name: input.name },
      },
    },
  );
  return toSession(data);
}

export async function sendPinResetEmail(email: string, redirectTo: string) {
  await call(withRedirect("/auth/v1/recover", redirectTo), {
    method: "POST",
    body: { email },
  });
}

export async function refreshSession(refreshToken: string) {
  return requireSession(
    await call<TokenResponse>("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: refreshToken },
    }),
  );
}

export async function updatePin(accessToken: string, pin: string) {
  await call("/auth/v1/user", {
    method: "PUT",
    body: { password: pin },
    accessToken,
  });
}

export async function signOutSession(accessToken: string) {
  await call("/auth/v1/logout", { method: "POST", accessToken }).catch(
    () => undefined,
  );
}

interface UserResponse {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; name?: string };
}

export async function getAccountUser(accessToken: string): Promise<AccountUser> {
  const user = await call<UserResponse>("/auth/v1/user", { accessToken });
  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
  };
}

/** Where to send the browser for Google or Facebook sign-in. */
export function oauthSignInUrl(
  provider: "google" | "facebook",
  redirectTo: string,
): string | null {
  if (!BASE_URL || !ANON_KEY) return null;
  const params = new URLSearchParams({ provider, redirect_to: redirectTo });
  return `${BASE_URL}/auth/v1/authorize?${params}`;
}

const TRIP_KINDS: readonly TripKind[] = [
  "flight",
  "hotel",
  "car",
  "cruise",
  "private-jet",
  "vacation",
  "other",
];

interface TripRow {
  id: string;
  reference: string;
  trip_type: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  total_amount: number | string | null;
  currency: string | null;
  notes: string | null;
}

/** The signed-in customer's trips. Row-level security limits it to their email. */
export async function listTrips(accessToken: string): Promise<Trip[]> {
  const rows = await call<TripRow[] | null>(
    "/rest/v1/trips?select=id,reference,trip_type,title,start_date,end_date,status,total_amount,currency,notes&order=start_date.asc.nullslast",
    { accessToken },
  );

  return (rows ?? []).map((row) => {
    const total = row.total_amount === null ? null : Number(row.total_amount);
    return {
      id: row.id,
      reference: row.reference,
      kind: TRIP_KINDS.find((kind) => kind === row.trip_type) ?? "other",
      title: row.title,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      total: total !== null && Number.isFinite(total) ? total : null,
      currency: row.currency ?? "USD",
      notes: row.notes,
    };
  });
}
