# Extractable Components

A "menu" for the design workflow: which components are worth extracting as
reusable SuperDesign `DraftComponent` entities before generating drafts.

Per SUPERDESIGN.md Step 2.5: **extract layout components first** (they appear on
every page), **skip basic UI primitives** (Button, Input, Card, Badge — too
simple to warrant extraction; better inline in drafts).

## BRAND LOGO — required for every logo position

The project has a **real logo asset**, not a drawn placeholder:

- `public/images/brand/logo.png` — full colour (blue globe-and-plane mark +
  `viajarprimero.com` wordmark), intrinsic 1202x230
- `public/images/brand/logo-inverse.png` — same lockup with the blue swapped to
  white, the orange plane untouched. Used on dark/navy surfaces.

`src/components/layout/logo.tsx` renders these via `next/image` at `h-7 w-auto
md:h-9`. **Any extracted component with a logo position MUST embed the uploaded
Brand Asset's public URL** — never initials, emoji, a generic mark, an invented
SVG, or text alone. The header uses `tone="default"`; anything on the navy
`bg-brand-wash` band uses `tone="inverse"`.

---

## Layout Components

### SiteHeader
- Source: `src/components/layout/site-header.tsx`
- Category: layout
- Description: Sticky translucent header — logo left, centered nav links, call CTA and mobile nav right
- Extractable props: `activeItem` (string, default `"home"`) — which `secondaryNav` link is current
- Hardcoded: Logo image, nav labels (Home/Deals/Destinations/Support/About), call button, all CSS, `var(--header-height)` = 68px
- Notes: translucent `bg-surface/80` + `backdrop-blur-[var(--blur-lg)]` so the navy hero reads as continuous behind it. Do not make it solid white.

### SiteFooter
- Source: `src/components/layout/site-footer.tsx`
- Category: layout
- Description: Multi-column footer — book / private aviation / traveller tools / company / legal link groups
- Extractable props: none (fully static, driven by `footerNav` in `lib/config/site.ts`)
- Hardcoded: all link groups, legal text, logo

### CallButton
- Source: `src/components/layout/call-button.tsx`
- Category: layout
- Description: Header phone CTA with an animated LIVE badge (`--animate-live-pop` / `--animate-live-halo`)
- Extractable props: none
- Hardcoded: phone number from `contactConfig`, badge animation

### MobileNav
- Source: `src/components/layout/mobile-nav.tsx`
- Category: layout
- Description: Mobile drawer rendering all verticals plus secondary nav
- Extractable props: none

### Section
- Source: `src/components/layout/section.tsx`
- Category: layout
- Description: Full-bleed band with the page gutter inside it — the page's structural unit
- Extractable props: `tone` (default/surface/muted/dark/brand/brand-soft, default `"default"`), `size` (xs/sm/md/lg/xl, default `"md"`)
- Hardcoded: tone→class and size→padding maps, `isolate` stacking, `backdrop` slot rendered OUTSIDE the container so a hero image is genuinely full-bleed
- Notes: `tone="brand"` is the `bg-brand-wash` navy gradient the hero sits on.

---

## Basic Components (SKIP extraction — render inline in drafts)

Listed so the design agent knows the real anatomy to match. Full source in
`components.md`.

| Component | Source | Description |
|---|---|---|
| Button / ButtonLink | `src/components/ui/button.tsx` | Variants incl. `outline`, `inverse`; sizes `sm`/`lg` |
| Input | `src/components/ui/input.tsx` | Labelled field |
| Card | `src/components/ui/card.tsx` | Hairline ring + hover lift |
| Badge | `src/components/ui/badge.tsx` | Tinted pill |
| Tabs | `src/components/ui/tabs.tsx` | WAI-ARIA tabs; shapes `underline` \| `segmented`; tones `light` \| `inverse` |
| Accordion | `src/components/ui/accordion.tsx` | Native `<details>`, animated via `::details-content` |
| SectionHeading | `src/components/ui/section-heading.tsx` | Eyebrow + title + description + action |
| Stepper | `src/components/ui/stepper.tsx` | Numbered steps |
| Container | `src/components/ui/container.tsx` | `max-w-page` (1240px) gutter |
| Photo / Plate | `src/components/ui/photo.tsx`, `plate.tsx` | Image with gradient-plate fallback |
| Icons | `src/components/ui/icons.tsx` | Plane, Bed, Car, Ship, Jet, MapPin, Calendar, Receipt, Shield, Headset, ArrowRight, Check + `verticalIcons` map |

## Search panel primitives (CRITICAL for the hero)

`src/components/ui/search-panel.tsx` — the shared anatomy both the flight
search and the enquiry forms compose. **Do not let the two drift.**

| Export | Role |
|---|---|
| `SearchPanel` | Outer shell. `tone="panel"` = floating hero treatment (`shadow-panel`, no border, sits on the navy field); `tone="flat"` = results page |
| `SearchQualifiers` | Quiet row above the journey — trip type, travellers, cabin |
| `SearchRow` | The connected row: `rounded-xl`, hairline `divide`, `lg:divide-x` |
| `SearchCell` | One labelled cell; `min-h-18`, focus ring drawn on the CELL via `focus-within`, not the input |
| `panelInputClasses` | Chromeless input; 16px min (iOS zooms below that) |
| `QuietSelect` | Native `<select>` with the box removed |
| `SearchErrors` | Errors collected BELOW the row so a cell never grows and breaks alignment |

Consumers:
- `src/features/search/components/flight-search-form.tsx` — flights (live results)
- `src/features/enquiries/components/enquiry-quick-form.tsx` — hotels, cars, cruises, jets (written quote)
