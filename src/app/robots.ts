import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

/**
 * robots.txt.
 *
 * The booking funnel and the API are disallowed. This backs up the `noIndex`
 * metadata on those pages rather than replacing it: robots.txt stops crawling,
 * the meta tag stops indexing, and a page reached by an inbound link needs
 * both.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/search",
        "/checkout",
        "/private-jets/request-a-quote",
        // Hotel and private-jet results are noIndex for the same reason
        // flight results are: no stable content, and one near-duplicate URL
        // per date pair. The pages built to rank are the landing pages that
        // launch them — /hotels, /private-jets/empty-legs.
        "/hotels/search",
        "/private-jets/search",
        "/api/",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
