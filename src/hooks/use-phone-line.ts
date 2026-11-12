"use client";

import { usePathname } from "next/navigation";

import { languageFromSegment, stripLanguagePrefix } from "@/lib/config/languages";
import type { PhoneLine } from "@/lib/config/site";

/**
 * Which phone line the current page shows. The train pages keep their own line
 * in every language; any other `/es` page shows the Spanish line; everything
 * else the main line.
 */
export function usePhoneLine(): PhoneLine {
  const pathname = usePathname();
  const bare = stripLanguagePrefix(pathname);

  if (bare === "/trains" || bare.startsWith("/trains/")) return "trains";
  if (languageFromSegment(pathname.split("/")[1] ?? "") === "es") return "es";
  return "en";
}
