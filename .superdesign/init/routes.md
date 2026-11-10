# Routes

File-based routing, Next.js App Router. **English only — no locale routing.**

Route groups `(marketing)`, `(content)`, `(booking)` organise files without
appearing in the URL: `(content)/guides/page.tsx` serves `/guides`.

Conventions enforced by AGENTS.md:
- `src/app/` is **routing only** — define the route, read params, set metadata,
  compose components. No business logic, no data transformation, no styling
  systems. Past ~120 lines the excess belongs in `src/features/`.
- `params` and `searchParams` are **Promises** in this Next version — type them
  `Promise<{ slug: string }>` and `await` them.
- Every dynamic content route needs `generateStaticParams`.
- Every page exports `metadata` or `generateMetadata`, built through the shared
  helper in `lib/seo/` — never hand-written per page.
- Search-result and checkout pages must be `noIndex`.
- `useSearchParams` requires a `<Suspense>` boundary during prerender.

All pages render inside `src/app/layout.tsx` (the only layout file): Geist +
Geist Mono via `next/font/google`, `SiteHeader`, `{children}`, `SiteFooter`,
cookie consent.

## Route table

| URL | File | Group |
|---|---|---|
| `/checkout` | `src/app/(booking)/checkout/page.tsx` | (booking) |
| `/search` | `src/app/(booking)/search/page.tsx` | (booking) |
| `/airlines/[slug]` | `src/app/(content)/airlines/[slug]/page.tsx` | (content) |
| `/airlines` | `src/app/(content)/airlines/page.tsx` | (content) |
| `/airports/[slug]` | `src/app/(content)/airports/[slug]/page.tsx` | (content) |
| `/airports` | `src/app/(content)/airports/page.tsx` | (content) |
| `/car-rentals/[slug]` | `src/app/(content)/car-rentals/[slug]/page.tsx` | (content) |
| `/car-rentals` | `src/app/(content)/car-rentals/page.tsx` | (content) |
| `/cruises/[slug]` | `src/app/(content)/cruises/[slug]/page.tsx` | (content) |
| `/cruises` | `src/app/(content)/cruises/page.tsx` | (content) |
| `/destinations/[slug]` | `src/app/(content)/destinations/[slug]/page.tsx` | (content) |
| `/destinations` | `src/app/(content)/destinations/page.tsx` | (content) |
| `/flights/[slug]` | `src/app/(content)/flights/[slug]/page.tsx` | (content) |
| `/flights` | `src/app/(content)/flights/page.tsx` | (content) |
| `/guides/[slug]` | `src/app/(content)/guides/[slug]/page.tsx` | (content) |
| `/guides` | `src/app/(content)/guides/page.tsx` | (content) |
| `/hotels/[slug]` | `src/app/(content)/hotels/[slug]/page.tsx` | (content) |
| `/hotels` | `src/app/(content)/hotels/page.tsx` | (content) |
| `/private-jets/aircraft/[slug]` | `src/app/(content)/private-jets/aircraft/[slug]/page.tsx` | (content) |
| `/private-jets/aircraft` | `src/app/(content)/private-jets/aircraft/page.tsx` | (content) |
| `/private-jets/charter` | `src/app/(content)/private-jets/charter/page.tsx` | (content) |
| `/private-jets/corporate` | `src/app/(content)/private-jets/corporate/page.tsx` | (content) |
| `/private-jets/empty-legs` | `src/app/(content)/private-jets/empty-legs/page.tsx` | (content) |
| `/private-jets/faq` | `src/app/(content)/private-jets/faq/page.tsx` | (content) |
| `/private-jets` | `src/app/(content)/private-jets/page.tsx` | (content) |
| `/private-jets/request-a-quote` | `src/app/(content)/private-jets/request-a-quote/page.tsx` | (content) |
| `/private-jets/routes/[slug]` | `src/app/(content)/private-jets/routes/[slug]/page.tsx` | (content) |
| `/private-jets/routes` | `src/app/(content)/private-jets/routes/page.tsx` | (content) |
| `/private-jets/services` | `src/app/(content)/private-jets/services/page.tsx` | (content) |
| `/travel-blog/[slug]` | `src/app/(content)/travel-blog/[slug]/page.tsx` | (content) |
| `/travel-blog` | `src/app/(content)/travel-blog/page.tsx` | (content) |
| `/about` | `src/app/(marketing)/about/page.tsx` | (marketing) |
| `/accessibility-statement` | `src/app/(marketing)/accessibility-statement/page.tsx` | (marketing) |
| `/baggage-information` | `src/app/(marketing)/baggage-information/page.tsx` | (marketing) |
| `/california-privacy-rights` | `src/app/(marketing)/california-privacy-rights/page.tsx` | (marketing) |
| `/contact` | `src/app/(marketing)/contact/page.tsx` | (marketing) |
| `/cookie-policy` | `src/app/(marketing)/cookie-policy/page.tsx` | (marketing) |
| `/customer-support` | `src/app/(marketing)/customer-support/page.tsx` | (marketing) |
| `/deals` | `src/app/(marketing)/deals/page.tsx` | (marketing) |
| `/disclaimer` | `src/app/(marketing)/disclaimer/page.tsx` | (marketing) |
| `/faq` | `src/app/(marketing)/faq/page.tsx` | (marketing) |
| `/fees-and-charges` | `src/app/(marketing)/fees-and-charges/page.tsx` | (marketing) |
| `/how-it-works` | `src/app/(marketing)/how-it-works/page.tsx` | (marketing) |
| `/manage-booking` | `src/app/(marketing)/manage-booking/page.tsx` | (marketing) |
| `/online-check-in` | `src/app/(marketing)/online-check-in/page.tsx` | (marketing) |
| `/privacy-policy` | `src/app/(marketing)/privacy-policy/page.tsx` | (marketing) |
| `/refund-and-cancellation-policy` | `src/app/(marketing)/refund-and-cancellation-policy/page.tsx` | (marketing) |
| `/reviews` | `src/app/(marketing)/reviews/page.tsx` | (marketing) |
| `/site-map` | `src/app/(marketing)/site-map/page.tsx` | (marketing) |
| `/terms-and-conditions` | `src/app/(marketing)/terms-and-conditions/page.tsx` | (marketing) |
| `/your-privacy-choices` | `src/app/(marketing)/your-privacy-choices/page.tsx` | (marketing) |
| `/` | `src/app/page.tsx` | — |

## API route handlers

| Endpoint | File |
|---|---|
| `/api/booking-request` | `src/app/api/booking-request/route.ts` |
| `/api/enquiry` | `src/app/api/enquiry/route.ts` |
| `/api/newsletter` | `src/app/api/newsletter/route.ts` |
| `/api/search` | `src/app/api/search/route.ts` |

## Other App Router files

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — fonts, header, footer, consent |
| `src/app/page.tsx` | Home page (the primary design target) |
| `src/app/error.tsx` | Error boundary |
| `src/app/not-found.tsx` | 404 |
| `src/app/(booking)/search/loading.tsx` | Search results skeleton |
| `src/app/sitemap.ts` | Sitemap |
| `src/app/robots.ts` | robots.txt |
| `src/app/opengraph-image.tsx` | OG image (next/og, Satori) |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico` | Icons |

## Features

`src/features/<name>/` owns UI and logic used by exactly one feature:
`destinations`, `guides`, `search`, `booking`, `newsletter`, `enquiries`.

- `search` — flight search form + results (the only vertical with live results)
- `enquiries` — the quote-request funnel for hotels, car hire, cruises and jets
- `booking` — the flight funnel, which carries fare rules and cabin classes
