# Viajarprimero — Design System

## Product context

A travel site with two halves: SEO-driven editorial content (destinations,
guides, journal) and a booking funnel (search → stay → checkout). English only.
Content is local MDX, not a CMS.

**Five verticals**, all sold through the same promise — a written quote with the
supplier charge, taxes and our fee as separate lines:

| Vertical | Funnel | Note |
|---|---|---|
| Flights | live search → results | the ONLY vertical with live results |
| Hotels | written quote | |
| Car hire | written quote | widest gap between quoted and final bill |
| Cruises | written quote | |
| Private jets | written quote | newest, most premium |

**JTBD:** "Tell me the real total and the rules before I pay, and let me reach a
human." The site's entire differentiation is honesty about price, so the UI must
never imply a superlative it cannot substantiate. No "best price guaranteed", no
"lowest fares", no invented review counts or ratings.

## Voice

Plain, specific, slightly understated. Claims are statements about our own
conduct that a linked page spells out — "Itemised before you pay", "Rules up
front", "Answered by a person" — never superlatives. Sentence case, not Title
Case. British-leaning spelling ("itemised", "car hire", "traveller").

---

## Colour

**Tailwind v4. There is NO `tailwind.config.js`.** The `@theme` block in
`src/app/globals.css` IS the config. Every token there generates its utility.

**Hard rule: no raw hex in components.** Write `bg-primary`, never
`bg-[#2b5ce6]` and never `bg-[var(--color-primary)]`. If a utility does not
exist, the token is missing and belongs in `@theme`.

| Role | Token | Value |
|---|---|---|
| Primary action | `--color-primary` | `#2b5ce6` — clears 4.5:1 on white |
| Primary hover / active | `--color-primary-hover` / `-active` | `#1f47bd` / `#17389a` |
| Brand ground | `--color-secondary` | `#0a1f3d` navy |
| Accent | `--color-accent` | `#f08c1e` — **emphasis only**, ~2.4:1, never carries text |
| Text | `--color-text` | `#0a1f3d` |
| Text on navy | `--color-text-on-dark` | `#c3cede` — 8.9:1 |
| Inverse text | `--color-text-inverse` | `#ffffff` |
| Hairline | `--color-border` | `#e8edf4` |
| Surface / recessed | `--color-surface` / `-2` | `#ffffff` / `#f7f9fc` |
| Tinted fill | `--color-primary-soft` | `#eaf0ff` |

**No dark mode.** `theme_variants.present: false`. The palette assumes light
surfaces. Do not add a `prefers-color-scheme` block.

### Brand gradients (utilities, declared once in globals.css)

- `bg-brand-wash` — the navy field the hero and the closing band sit on. Two
  radial stops (blue top-left, a whisper of orange top-right) over a navy
  vertical gradient, so it never reads as a flat rectangle of colour. **This is
  what separates a designed hero from a coloured div.**
- `bg-brand-wash-soft` — its quiet cousin for interior page headers.
- `bg-photo-scrim` — ramped scrim for text over a photograph, so the top of the
  frame keeps its contrast instead of dimming the whole image evenly.

## Typography

**Two typefaces, and only two. A third face is a bug.**

- **Geist** (`--font-sans`) for everything.
- **Geist Mono** (`--font-mono`) ONLY for strings read character by character:
  booking references, promo codes, code and paths. Use sparingly.

Both are loaded once via `next/font/google` in `app/layout.tsx` (self-hosted, no
runtime request to Google). Never name a font family anywhere else.

Semantic scale — use `text-display-lg`, `text-h2`, `text-body`, `text-caption`.
Never `text-[32px]`.

| Token | Size | Weight / tracking |
|---|---|---|
| `text-display-lg` | 2.75rem | 700, -0.035em, lh 1.04 |
| `text-display` | 2.25rem | 700, -0.03em |
| `text-h1` | 1.875rem | 700, -0.025em |
| `text-h2` | 1.625rem | 700, -0.022em |
| `text-h3` | 1.25rem | 600 |
| `text-h6` | 0.875rem | 600 |
| `text-body-lg` | 1.125rem | lh 1.6 |
| `text-body` | 1rem | lh 1.65 |
| `text-caption` | 0.8125rem | lh 1.45 |
| `text-overline` | 0.6875rem | 700, +0.1em, uppercase |
| `text-micro` | 0.625rem | +0.1em — labels riding inside a control only |

Body sizes carry their own reading leading — do not bolt `leading-relaxed` on.
Prose is capped by `measure` (68ch) / `measure-tight` (52ch) / `measure-wide` (78ch).

Display sizes are scaled up again at `md` by the components that use them: the
hero runs `text-display-lg md:text-[3.5rem] lg:text-[4rem]`.

## Spacing, radius, shadow

- Spacing base 4px. `--spacing: 4px`, so `p-4` = 16px, `p-6` = 24px.
- **Radius ramp 6 / 10 / 16 / 22 / 28 / 36px** (`sm`→`3xl`) plus `full`. The old
  4/8/12 ramp is what made the site read as boxy — do not go back to it. Cards
  are `rounded-xl`/`2xl`; pills and tabs are `rounded-full`.
- **Shadows are two-layer**: a tight contact shadow that grounds plus a wide
  diffuse one that lifts. One layer reads as a drop shadow; two read as depth.
  `--shadow-panel` additionally carries an inset white highlight for the search
  panel that overhangs the hero on a dark field.
- Container `max-w-page` = 1240px; `--container-narrow` 860px. Gutter `px-5 md:px-8`.

## Layout

`Section` is the structural unit — a full-bleed band with the gutter inside it.
`tone` picks the ground (`brand` = navy hero), `size` picks the height from a
fixed ramp (xs 24px → xl 96/160px). Alternating tones is what gives the page
rhythm; a border drawn between two bands that already differ in tone is clutter.

Horizontal `rail` (snap points, hidden scrollbar) is preferred over a grid
wherever a grid would become a four-row stack on a phone.

## Interaction states

- **Focus is not optional**: 2px `--color-primary` ring, `outline-offset: 2px`,
  via the `focus-ring` utility. On navy use `focus-ring-inverse` (white ring) —
  blue on navy has too little separation.
- Cards: no chrome at rest (hairline ring + tinted ground), earning
  `-translate-y-1` + `shadow-lg` on hover. So a row reads as one surface divided,
  not as N boxes set down next to each other.
- Minimum target 44px (`min-h-11`). Inputs are 16px minimum — iOS Safari zooms
  the viewport on anything smaller.
- Reduced motion is honoured centrally in `globals.css`; a component opts back
  in only if its animation carries meaning the static state cannot.

## Motion

`--animate-rise` (16px up + fade, 0.7s `--ease-out`) staggered by
`[animation-delay:80ms/160ms/240ms/320ms]` down the hero. `reveal` is a
scroll-driven entrance using `animation-timeline: view()` — progressive
enhancement with no JS and no client boundary. Ken Burns drift on the hero
backdrop starts at scale 1.04 so the frame is already overscanned.

Durations: `--duration-fast` 150ms, `--duration-normal` 250ms, `--duration-slow` 450ms.

## Accessibility

- `#3364FF` on white measures ~4.1:1 — passes AA for large text and UI controls
  but **fails for body-size text**. The project's `#2b5ce6` was deepened
  specifically to clear 4.5:1, so blue body text is legal here; keep it that way.
- `--color-text-secondary` and `-muted` were retuned off the scraped values
  precisely because those failed AA on real paragraphs. Do not reintroduce
  lighter greys for prose.
- `--color-accent` cannot carry text at any size.
- Tabs follow the WAI-ARIA tabs pattern: only the selected tab is in the tab
  order, arrow keys move between them, panels stay mounted (a traveller who
  fills in dates, glances at another tab and comes back must find them intact).

## Architecture constraints that shape the UI

- **Server Components by default.** `"use client"` only for state, effects,
  handlers or browser APIs, pushed to the smallest leaf. A page must never
  become a client component so one button can have an `onClick`.
- `src/app/` is routing only — past ~120 lines the excess belongs in `features/`.
- Dependencies point one way: `app/ → features/ → components/ → lib/`.
- The project runs on `next`, `react`, `react-dom` **alone**. No component
  library, no icon package, no animation library. Icons are hand-drawn SVGs in
  `src/components/ui/icons.tsx`.

## Brand assets

`public/images/brand/logo.png` (full colour) and `logo-inverse.png` (blue swapped
to white, orange plane untouched — for navy surfaces). Globe-and-plane mark plus
the `viajarprimero.com` wordmark as one horizontal lockup, intrinsic 1202x230,
rendered at `h-7 w-auto md:h-9`. **Never substitute initials, emoji, a generic
mark, an invented SVG, or text alone.**
