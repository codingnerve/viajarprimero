# Viajarprimero

A travel agency site covering flights, hotels, car hire and cruises: search and
SEO content pages on one side, a quote-and-book funnel on the other, plus the
full legal and compliance surface a US advertising account needs.

See `AGENTS.md` for where code goes and the conventions this repo follows.

## Running it

```bash
npm run dev      # http://localhost:3000
npm run lint     # must be clean, warnings included
npx tsc --noEmit # must pass
npm run build    # the real check
```

## How pricing works here

**This site never displays a fare it does not hold.** Route and destination
pages carry no "from $199" figure, and the results page does not render sample
itineraries. That is a deliberate constraint, not an unfinished feature:

- `src/lib/providers/flight-search.ts` is the only module allowed to talk to a
  fare supplier. With no supplier configured it returns `configured: false`.
- `/search` renders three visibly different states — no supplier connected, a
  supplier that returned nothing, and a supplier that errored. They are never
  collapsed into one empty grid, because "we found nothing" and "we did not
  look" say different things to a traveller.
- Every quoted total itemises fare, taxes and carrier charges, and our service
  fee. `FlightOffer.total` must equal the sum of its parts.

Publishing an invented fare would be a misrepresentation and is the fastest way
to lose a Google Ads account in the travel vertical.

## Before you launch

Nothing below is optional. Every one of these is a value the site cannot invent
for you, and placeholders are rendered as visible warnings rather than silently
passed off as fact.

### 1. Fill in the config

`src/lib/config/site.ts`

- [ ] `legalName` — the operating entity
- [ ] `contactConfig.email`, `privacyEmail` — inboxes someone actually reads
- [ ] `contactConfig.phone`, `phoneDisplay`, `supportHours` — or delete the
      phone entirely rather than publishing an unanswered line
- [ ] `contactConfig.address` — a real registered address
- [ ] `contactConfig.accreditations` — **leave empty unless you hold them.**
      Each entry publishes its registration number for verification
- [ ] `url` — the production domain

`src/lib/config/legal.ts`

- [ ] `policyEffectiveDate` — until set, every policy page shows a visible
      "effective date not yet set" notice
- [ ] `jurisdiction` — governing law and courts, on legal advice
- [ ] `businessModel` — `agency` or `merchant`; this drives the wording across
      the Terms, Disclaimer and footer
- [ ] `serviceFees` — real amounts. An unpriced fee renders as "not yet set" on
      the fee schedule
- [ ] `dotTwentyFourHourRuleApplies` — confirm it applies to your itineraries
- [ ] `dataProcessors` / `cookieInventory` — must list **every** tag you fire.
      The cookie policy table and the consent banner are both generated from
      these, so an omission here under-declares in two places at once
- [ ] `sellerOfTravelRegistrations` — **leave empty unless registered.**
      California and Florida require a registered seller of travel to publish
      its registration number in advertising; the footer disclosure renders
      only once real numbers are present. An invented CST number is checkable
      against the California Attorney General's register in seconds, and is a
      criminal matter there rather than merely an advertising problem
- [ ] `californiaRestitutionFund` — only a registered California seller of
      travel can participate; the disclosure wording differs by answer
- [ ] `sellsOrSharesPersonalInformation` — derived from your marketing tags.
      Read the comment before overriding it: running Ads remarketing generally
      counts as "sharing" under the CPRA even though no money changes hands
- [ ] `enquiryRetentionPeriod` — must match what your CRM actually does

### 2. Set the environment variables

| Variable | Without it |
|---|---|
| `SERPAPI_API_KEY` | `/search` shows the call-to-book panel instead of live fares |
| `BOOKING_REQUEST_WEBHOOK_URL` | Both quote forms — flights (`/api/booking-request`) and hotels/cars/cruises (`/api/enquiry`) — return 503 and tell the traveller to contact you directly |
| `NEWSLETTER_WEBHOOK_URL` | Sign-ups return 503 |

The endpoints refuse rather than returning a false success. A form that reports
"thank you" while the request goes nowhere is the worst failure mode available:
the traveller stops looking, and nobody ever sees the enquiry.

### 3. Wire consent to your tags

`src/hooks/use-cookie-consent.ts` records the decision and emits a
`vp:consentchange` event. **Analytics and advertising tags must be mounted from
that state**, not loaded unconditionally. A banner that records a choice while
the tags fire regardless is the most common way sites fail a GDPR/ePrivacy
check — and it invalidates the consent you collected.

### 4. Have the policies reviewed

The pages under `src/app/(marketing)/` — privacy, California privacy rights,
your privacy choices, cookies, terms, refunds, fees, disclaimer, accessibility —
are working drafts covering the substance a travel agency advertising in the US
needs. They are not legal advice. Have counsel review them against your
jurisdiction, your actual data flows and your supplier contracts before you
publish.

## The empty-by-design pages

Two pages ship with nothing in them, and filling them is a commitment rather
than a chore:

- **`/deals`** (`src/lib/content/deals.ts`) — the `Deal` type requires a named
  supplier, a travel window, a book-by date, a verification timestamp and the
  conditions in full, so an unsubstantiated offer cannot be expressed. The
  conventional "from $79" tile is an advertised price you cannot honour on
  demand, which is what the Misrepresentation policy prohibits.
- **`/reviews`** (`src/lib/content/reviews.ts`) — every entry must carry the
  booking reference it came from, and incentivised reviews must be disclosed.
  Fake testimonials are separately actionable under the FTC's consumer reviews
  rule. The page never emits `AggregateRating` markup without real reviews
  behind it.

Both are `noIndex` while empty and are automatically excluded from
`sitemap.xml` in that state, so an empty page is never indexed as thin content.
Both flip to indexable the moment real data is added — no second edit needed.

## Not built yet

- **Live fare, rate and cabin search** — `/search` runs the flights path
  through `lib/providers/flight-search.ts` and shows the quote route while no
  supplier is configured. Hotels, cars and cruises are quote-request only by
  design; there is no rate grid anywhere, because we hold no inventory.
- **Payment capture** — every funnel ends at a quote request. There is no
  checkout, and nothing on the site claims otherwise.
- **Self-service booking lookup** — `/manage-booking` routes to a person. A
  reference box that returns nothing would be a fake feature, and on a travel
  site it is the fake feature most likely to strand someone at an airport.
- **Editorial MDX** — `content/` is unused. The travel blog, routes,
  destinations, airlines and cruise lines all read from typed data in
  `src/lib/content/`, which avoids the MDX dependency `AGENTS.md` requires
  asking about first.
