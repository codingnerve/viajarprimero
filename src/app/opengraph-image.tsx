import {
  ogImage,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/lib/seo/og-template";
import { siteConfig } from "@/lib/config/site";

/**
 * Default share card for the whole site.
 *
 * It sits at the root of `app/`, so every route inherits it unless that route
 * declares its own — one file covers all 179 pages, and a section only needs
 * its own when it deserves a different headline.
 */
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage({
    title: "Four ways to travel. One honest price.",
    description:
      "The full price broken down, the rules explained, nothing charged until you say yes.",
  });
}
