import type { Metadata } from "next";

import { siteConfig } from "@/lib/config/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Path only, with a leading slash. The canonical URL is derived from it. */
  path: string;
  /**
   * Keep search results, checkout and anything with personal data out of the
   * index. Required by the project guide for the booking funnel.
   */
  noIndex?: boolean;
  ogImage?: string;
}

/**
 * The only place page metadata is constructed.
 *
 * Building every page's canonical and OG tags through one helper is what stops
 * them drifting apart — a wrong canonical on a route landing page quietly
 * splits its ranking signals, and nobody notices for months.
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  ogImage,
}: BuildMetadataOptions): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();
  const fullTitle =
    path === "/" ? title : `${title} | ${siteConfig.name}`;

  return {
    // `absolute` bypasses the root layout's `%s | Viajarprimero` template.
    // Without it the suffix is applied twice, because fullTitle already
    // carries it - "Privacy policy | Viajarprimero | Viajarprimero".
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: canonical,
      locale: siteConfig.locale,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
