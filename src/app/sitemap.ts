import type { MetadataRoute } from "next";

import { airlines } from "@/lib/content/airlines";
import { airports } from "@/lib/content/airports";
import { articles } from "@/lib/content/articles";
import { cruiseLines } from "@/lib/content/cruise-lines";
import { deals } from "@/lib/content/deals";
import { destinations } from "@/lib/content/destinations";
import { aircraftCategories, jetRoutes } from "@/lib/content/private-jets";
import { guides } from "@/lib/content/guides";
import { reviews } from "@/lib/content/reviews";
import { routes } from "@/lib/content/routes";
import { trainOperators } from "@/lib/content/trains";
import { siteConfig } from "@/lib/config/site";

/**
 * Sitemap.
 *
 * Only indexable pages appear. `/search` and `/checkout` are deliberately
 * absent: both are `noIndex`, and listing a noindexed URL in a sitemap sends
 * Search Console two contradictory instructions about the same page.
 *
 * `/deals` and `/reviews` are noindexed while they have nothing in them, so
 * they enter the sitemap on exactly the same condition — see the pages
 * themselves, which derive their `noIndex` flag from the same arrays.
 */

const staticPaths = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  // Hand-written Spanish home page. Every other `/es/...` URL is the English
  // page translated in the browser and is noindexed, so it is not listed.
  { path: "/es", priority: 0.9, changeFrequency: "daily" as const },

  // Verticals.
  { path: "/flights", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/hotels", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/car-rentals", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/cruises", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/vacations", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/private-jets", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/trains", priority: 0.8, changeFrequency: "monthly" as const },

  // Private aviation. `/private-jets/request-a-quote` is absent on purpose:
  // it is noIndex and disallowed in robots.txt, like every other funnel step.
  {
    path: "/private-jets/charter",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/private-jets/aircraft",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/private-jets/routes",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/private-jets/corporate",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/private-jets/services",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  /*
    Empty legs is unconditional now.

    It used to be listed only when `emptyLegs` in lib/content held something,
    because a page ranking for "empty leg flights" that then showed a traveller
    nothing was worse than not ranking at all. It has a live charter
    marketplace behind it now, so it always has real availability or an honest
    statement that the market is quiet today — and it is one of the strongest
    commercial pages on the site, so it is worth a daily crawl.
  */
  {
    path: "/private-jets/empty-legs",
    priority: 0.8,
    changeFrequency: "daily" as const,
  },
  {
    path: "/private-jets/faq",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },

  // Content hubs.
  { path: "/destinations", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/airlines", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/airports", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/guides", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/travel-blog", priority: 0.7, changeFrequency: "weekly" as const },

  // Traveller tools.
  { path: "/manage-booking", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/online-check-in", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/baggage-information", priority: 0.6, changeFrequency: "monthly" as const },

  // Company.
  { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/customer-support", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/site-map", priority: 0.4, changeFrequency: "weekly" as const },

  // Legal and compliance.
  { path: "/fees-and-charges", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  {
    path: "/california-privacy-rights",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/your-privacy-choices",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" as const },
  {
    path: "/refund-and-cancellation-policy",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
  {
    path: "/accessibility-statement",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const conditionalPaths = [
    ...(deals.length > 0
      ? [{ path: "/deals", priority: 0.7, changeFrequency: "daily" as const }]
      : []),
    ...(reviews.length > 0
      ? [{ path: "/reviews", priority: 0.5, changeFrequency: "weekly" as const }]
      : []),
  ];

  return [
    ...[...staticPaths, ...conditionalPaths].map((entry) => ({
      url: url(entry.path),
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),

    ...routes.map((route) => ({
      url: url(`/flights/${route.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...destinations.map((destination) => ({
      url: url(`/destinations/${destination.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...destinations.map((destination) => ({
      url: url(`/hotels/${destination.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...airports.map((airport) => ({
      url: url(`/car-rentals/${airport.code.toLowerCase()}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    ...airports.map((airport) => ({
      url: url(`/airports/${airport.code.toLowerCase()}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    ...cruiseLines.map((line) => ({
      url: url(`/cruises/${line.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...trainOperators.map((operator) => ({
      url: url(`/trains/${operator.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...airlines.map((airline) => ({
      url: url(`/airlines/${airline.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    ...aircraftCategories.map((category) => ({
      url: url(`/private-jets/aircraft/${category.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...jetRoutes.map((route) => ({
      url: url(`/private-jets/routes/${route.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    ...guides.map((guide) => ({
      url: url(`/guides/${guide.slug}`),
      lastModified: new Date(`${guide.updatedAt}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),

    ...articles.map((article) => ({
      url: url(`/travel-blog/${article.slug}`),
      lastModified: new Date(`${article.publishedAt}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
