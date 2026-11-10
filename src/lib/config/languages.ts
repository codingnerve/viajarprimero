/**
 * Languages offered in the header's language picker.
 *
 * The site is written in English. Picking another language runs the page
 * through Google Translate in the visitor's browser (see `LanguageSelect`), so
 * `code` must be a Google Translate language code.
 */
export const languages = [
  { code: "en", label: "English (US)", flag: "🇺🇸" },
  { code: "es", label: "Spanish (ES)", flag: "🇪🇸" },
  { code: "fr", label: "French (FR)", flag: "🇫🇷" },
  { code: "de", label: "German (DE)", flag: "🇩🇪" },
  { code: "it", label: "Italian (IT)", flag: "🇮🇹" },
  { code: "pt", label: "Portuguese (PT)", flag: "🇵🇹" },
  { code: "nl", label: "Dutch (NL)", flag: "🇳🇱" },
  { code: "zh-CN", label: "Chinese (CN)", flag: "🇨🇳" },
  { code: "ja", label: "Japanese (JP)", flag: "🇯🇵" },
  { code: "ko", label: "Korean (KR)", flag: "🇰🇷" },
  { code: "hi", label: "Hindi (IN)", flag: "🇮🇳" },
  { code: "ar", label: "Arabic (SA)", flag: "🇸🇦" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export const defaultLanguage: LanguageCode = "en";

/**
 * The URL segment a language is served under: `/es`, `/ar`, `/zh-cn`.
 *
 * English is the site's own language and is never prefixed — `/hotels` is the
 * canonical URL, `/es/hotels` the same page with the translator switched on.
 */
export function languageSegment(code: LanguageCode): string {
  return code.toLowerCase();
}

/** The language a URL segment names, or `null` when it names a page instead. */
export function languageFromSegment(segment: string): LanguageCode | null {
  const lower = segment.toLowerCase();
  return languages.find((language) => language.code.toLowerCase() === lower)?.code ?? null;
}

/** `/es/hotels` → `/hotels`. An unprefixed path is returned unchanged. */
export function stripLanguagePrefix(pathname: string): string {
  const [, first = "", ...rest] = pathname.split("/");
  if (!languageFromSegment(first)) return pathname;
  const remainder = rest.join("/");
  return remainder ? `/${remainder}` : "/";
}

/** `/hotels` + `es` → `/es/hotels`. English stays at `/hotels`. */
export function withLanguagePrefix(pathname: string, code: LanguageCode): string {
  const bare = stripLanguagePrefix(pathname);
  if (code === defaultLanguage) return bare;
  const segment = languageSegment(code);
  return bare === "/" ? `/${segment}` : `/${segment}${bare}`;
}

/**
 * The language Google Translate's cookie asks for. Its value is
 * `/<page language>/<target language>`, so only the tail matters.
 */
export function languageFromTranslateCookie(value: string | undefined): LanguageCode | null {
  if (!value) return null;
  const target = decodeURIComponent(value).split("/").pop() ?? "";
  return languageFromSegment(target);
}

/** The cookie value that puts Google Translate into `code`. */
export function translateCookieValue(code: LanguageCode): string {
  return `/${defaultLanguage}/${code}`;
}

/** Name of Google Translate's language cookie. */
export const TRANSLATE_COOKIE = "googtrans";
