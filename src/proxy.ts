import { NextResponse, type NextRequest } from "next/server";

import {
  TRANSLATE_COOKIE,
  defaultLanguage,
  languageFromSegment,
  languageFromTranslateCookie,
  stripLanguagePrefix,
  translateCookieValue,
  withLanguagePrefix,
} from "@/lib/config/languages";

/**
 * Puts the chosen language in the URL.
 *
 * The site is written in English and translated in the visitor's browser by
 * Google Translate, which is driven by a cookie — so without this the address
 * bar says `/hotels` whatever language the page is showing, and a Spanish
 * reader cannot send anyone the page they are actually looking at.
 *
 * Two rules, and between them every URL a visitor sees carries their language
 * without a single `<Link href>` in the codebase having to know about it:
 *
 *   `/es/hotels`  is rewritten to `/hotels` and the translate cookie is set,
 *                 so the English page is served and translated on arrival.
 *   `/hotels`     with a translate cookie already set is redirected to
 *                 `/es/hotels`, which is what keeps the prefix on every
 *                 internal link.
 *
 * The prefixed URLs are `noindex`: the HTML they return is the same English
 * document as the canonical path — the translation only happens in the browser
 * — so letting Google index twelve copies of it would be twelve duplicates,
 * not twelve translations.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [, first = ""] = pathname.split("/");
  const prefix = languageFromSegment(first);

  if (prefix) {
    const bare = stripLanguagePrefix(pathname);

    // `/en/...` is the canonical page under a redundant prefix. Send it home
    // and clear the cookie, so English readers hold a clean URL.
    if (prefix === defaultLanguage) {
      const response = NextResponse.redirect(new URL(`${bare}${search}`, request.url));
      response.cookies.delete(TRANSLATE_COOKIE);
      return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = bare;

    const response = NextResponse.rewrite(url);
    response.cookies.set(TRANSLATE_COOKIE, translateCookieValue(prefix), {
      path: "/",
      // Google Translate's script reads this in the browser, so it cannot be
      // httpOnly. It holds a language code and nothing else.
      httpOnly: false,
      sameSite: "lax",
    });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const chosen = languageFromTranslateCookie(request.cookies.get(TRANSLATE_COOKIE)?.value);
  if (chosen && chosen !== defaultLanguage) {
    const target = withLanguagePrefix(pathname, chosen);
    return NextResponse.redirect(new URL(`${target}${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes, Next's own assets, the generated metadata
  // routes, and any path with a file extension (`/sitemap.xml`, `/robots.txt`,
  // and everything in `public/`). None of those are pages a reader navigates
  // to, and a language prefix on them is meaningless.
  matcher: ["/((?!api|_next|opengraph-image|.*\\..*).*)"],
};
