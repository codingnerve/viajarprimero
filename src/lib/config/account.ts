/**
 * Customer accounts.
 *
 * Cookie names are shared by the auth route handlers (server) and the header's
 * account button (client), so they live here rather than in either.
 */
export const accountCookies = {
  accessToken: "vp_at",
  refreshToken: "vp_rt",
  /** Not httpOnly — only tells the header to show "My trips". Holds no token. */
  signedIn: "vp_signed_in",
} as const;

/** Customer PINs are six digits: Supabase's minimum password length. */
export const PIN_LENGTH = 6;
