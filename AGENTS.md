<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this repository

Viajarprimero is a travel site with two halves: SEO-driven editorial content
(destinations, guides, journal) and a booking funnel (search → stay → checkout).
English only, no locale routing. Content is local MDX, not a CMS.

The folder tree already exists and is deliberate. Put code where this guide says
it goes, and do not invent new top-level folders.

## Where does this code go?

| What you are adding | Where it goes |
|---|---|
| A new page or URL | `src/app/<segment>/page.tsx` |
| A JSON endpoint | `src/app/api/<name>/route.ts` |
| A button, input, card, badge — no domain knowledge | `src/components/ui/` |
| Header, footer, nav, page container | `src/components/layout/` |
| JSON-LD, breadcrumbs, metadata components | `src/components/seo/` |
| MDX renderer and its component map | `src/components/content/` |
| UI used by exactly one feature | `src/features/<feature>/components/` |
| Logic used by exactly one feature | `src/features/<feature>/lib/` |
| That feature's domain types | `src/features/<feature>/types.ts` |
| Site name, nav links, constants | `src/lib/config/` |
| Reading and validating MDX | `src/lib/content/` |
| Metadata builders, schema.org | `src/lib/seo/` |
| Any call to a third-party API | `src/lib/providers/` |
| `cn()`, date/price formatting, slugify | `src/lib/utils/` |
| A reusable React hook | `src/hooks/` |
| Types shared across features | `src/types/` |
| Prose an editor would write | `content/<collection>/*.mdx` |

Existing features: `destinations`, `guides`, `search`, `booking`,
`newsletter`, `enquiries`.
Adding a seventh is a real decision — ask first.

`enquiries` owns the quote-request funnel for the non-flight verticals
(hotels, car hire, cruises). It is one feature rather than three because the
funnel is identical in all three and only a handful of fields differ — see
`verticalCopy` in `features/enquiries/lib/enquiry.ts`. Flights keep their own
`booking` feature because that funnel carries fare rules and cabin classes
the others have no equivalent of.

## Three structural rules

**1. `src/app/` is routing only.** A file under `app/` may define the route,
read params, set metadata, and compose components. It must not contain business
logic, data transformation, or styling systems. If a page file grows past ~120
lines, the excess belongs in `features/`.

**2. Code starts in its feature and only moves out when a second consumer
appears.** Write it in `features/<name>/`. When a second feature needs it,
promote it to `components/` or `lib/`. Do not pre-emptively put things in
`lib/` because they feel general.

**3. `src/lib/providers/` is the only place that talks to an external API.**
Everything else depends on our own types, never a vendor payload shape. Swapping
a booking partner must be a change confined to that folder.

## Import direction

Dependencies point one way. Do not create a cycle.

```
app/  →  features/  →  components/  →  lib/
                 ↘                  ↗
                     hooks/  types/
```

- `lib/` imports nothing from `features/` or `app/`.
- `components/ui/` imports nothing from `features/`.
- One feature importing another is a smell; the shared part belongs in `lib/`.
- Always use the `@/` alias. No `../../..` paths.

## Naming

- Files and folders: `kebab-case.ts` / `kebab-case.tsx`.
- Components: `PascalCase`, one primary component per file, named export.
- Hooks: `use-thing.ts` exporting `useThing`.
- Route files use Next's reserved names exactly: `page.tsx`, `layout.tsx`,
  `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Route groups `(marketing)`, `(content)`, `(booking)` organize files without
  appearing in the URL. `(content)/guides/page.tsx` serves `/guides`.

## Server and client components

Everything is a Server Component by default. Add `"use client"` only when the
file needs state, effects, event handlers, or browser APIs — and push it to the
smallest leaf component rather than a whole page. A page should not become a
client component so one button can have an `onClick`.

Data fetching happens on the server. Do not `fetch()` from a client component
when a server component could load the data and pass it down.

## Routing and metadata

- In this Next version, `params` and `searchParams` are Promises. Type them as
  `Promise<{ slug: string }>` and `await` them.
- Every dynamic content route needs `generateStaticParams` so it prerenders.
- Every page exports `metadata` or `generateMetadata` — built through the shared
  helper in `lib/seo/`, never hand-written per page, so canonical URLs and OG
  tags cannot drift.
- Search-result and checkout pages must be `noIndex`.
- `useSearchParams` requires a `<Suspense>` boundary during prerender.

**This Next version differs from your training data.** Before using a routing,
caching, or metadata API, read the relevant file:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `.../05-server-and-client-components.md`
- `.../06-fetching-data.md`, `.../08-caching.md`, `.../09-revalidating.md`
- `.../14-metadata-and-og-images.md`, `.../15-route-handlers.md`

## Content

`content/` holds prose and frontmatter only — never logic, never JSX beyond the
components the MDX component map exposes. Every collection's frontmatter is
validated by a schema in `lib/content/`; a bad content file should fail the
build, not render a broken page.

## Styling

Tailwind v4, which has no `tailwind.config.js` — the `@theme` block in
`src/app/globals.css` is the config. Tokens are already defined there.

- **Use the generated utilities**: `bg-primary`, `text-gray-500`, `rounded-lg`,
  `shadow-md`, `text-h2`. Never `bg-[#3364FF]` and never
  `bg-[var(--color-primary)]` — if a utility does not exist, the token is
  missing and belongs in `@theme`, not inlined at the call site.
- **No raw hex in components.** A rebrand must be a change to `globals.css`
  alone.
- **`src/styles/design-tokens.json` is the full spec** — component anatomy,
  every interaction state, contrast measurements. Read the relevant section
  before building anything in `components/ui/`; it already specifies button,
  input, card, modal, badge, tooltip, table and pagination behavior. Entries
  marked `"inferred": true` were reconstructed rather than measured, so treat
  them as a sane default you may adjust, not as gospel.
- **No dark mode.** The spec records `theme_variants.present: false` and the
  palette assumes light surfaces. Do not add a `prefers-color-scheme` block
  without building a full dark palette to go with it.
- **Two typefaces: Geist and Fraunces.** Geist (`font-sans`) is body copy,
  UI, small headings, booking references and code. Fraunces (`font-display`)
  is the large headings — `globals.css` applies it to `text-display-lg`,
  `text-display`, `text-h1` and `text-h2` automatically, so do not add it by
  hand. Both are variable fonts loaded once via `next/font/google` in
  `app/layout.tsx` (self-hosted, no runtime request to Google), and `@theme`
  clears the rest of the `--font-*` namespace so `font-mono` and `font-serif`
  do not exist. Pages must vary face and size — one face at one size across a
  page reads as generated. Never name a font family outside `globals.css` and
  `layout.tsx`; a third face is a bug. `next/og` renders in Satori and cannot
  see these variables, but it already defaults to Geist, so OG templates must
  not set `fontFamily` at all.
- **Focus states are not optional**: 2px `--color-primary` ring on every
  interactive element. `#3364FF` on white measures ~4.1:1, which passes AA for
  large text and UI controls but *fails* for body-size text — so blue on white
  is for buttons, headings and icons, not small print.

## Before you claim it works

```bash
npm run lint       # must be clean, warnings included
npx tsc --noEmit   # must pass
npm run build      # must succeed — this is the real check
```

`npm run build` catches what the others miss: Suspense boundaries, invalid
frontmatter, server/client boundary violations, and prerender failures. Report
failures with their output; do not describe unbuilt code as working.

## Don't

- Don't add a dependency without asking. The project intentionally runs on
  `next`, `react`, and `react-dom` alone right now.
- Don't scaffold placeholder or example files across many folders. Write the
  file that was asked for, in the folder this guide names.
- Don't leave a `.gitkeep` in a folder that now has real files — delete it.
- Don't put `fetch()` to a third party anywhere but `lib/providers/`.
- Don't hardcode the site name, URL, or nav links; they live in `lib/config/`.
- Don't create `utils.ts` grab-bag files. Name the module for what it does.
