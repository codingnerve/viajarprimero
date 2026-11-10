"use client";

import { usePathname } from "next/navigation";

import type { Locale } from "@/types/locale";

/**
 * Which hand-written language the current page is in.
 *
 * Only `/es` has real Spanish copy; everything else — including `/es/hotels`,
 * which is the English page translated in the browser — is English underneath.
 * Client components that live in the root layout (cookie banner, floating
 * help) use this to pick their copy.
 */
export function useLocale(): Locale {
  return usePathname() === "/es" ? "es" : "en";
}
