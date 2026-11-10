# Theme & Design Tokens

**Tailwind CSS v4 — there is NO `tailwind.config.js`.** The `@theme` block in
`src/app/globals.css` is the entire config. Every variable declared there also
generates its matching utility class.

## Hard rules (from AGENTS.md)

- Use generated utilities: `bg-primary`, `text-gray-500`, `rounded-lg`,
  `shadow-md`, `text-h2`.
- NEVER `bg-[#3364FF]` and NEVER `bg-[var(--color-primary)]`. If a utility does
  not exist, the token is missing and belongs in `@theme` — not inlined.
- No raw hex in components. A rebrand must be a change to `globals.css` alone.
- **No dark mode.** `theme_variants.present: false`; the palette assumes light
  surfaces. Do not add a `prefers-color-scheme` block.
- **Two typefaces only.** Geist for everything; Geist Mono only for strings read
  character by character (booking refs, promo codes, paths). Both loaded via
  `next/font/google` in `app/layout.tsx`, exposed as `--font-sans` / `--font-mono`.
  A third face is a bug.
- **Focus states are mandatory**: 2px `--color-primary` ring on every interactive
  element, via the `focus-ring` / `focus-ring-inverse` utilities.
- `#3364FF` on white measures ~4.1:1 — passes AA for large text and UI controls
  but FAILS for body-size text. The project's `--color-primary` (`#2b5ce6`) was
  deepened specifically to clear 4.5:1 on white.

## Token quick reference

| Token | Value | Note |
|---|---|---|
| `--color-primary` | `#2b5ce6` | clears 4.5:1 on white |
| `--color-primary-hover` | `#1f47bd` | |
| `--color-secondary` | `#0a1f3d` | navy; the hero/closing band ground |
| `--color-accent` | `#f08c1e` | emphasis only, ~2.4:1, never carries text |
| `--color-text` | `#0a1f3d` | |
| `--color-text-inverse` | `#ffffff` | |
| `--color-text-on-dark` | `#c3cede` | body copy on navy, 8.9:1 |
| `--color-border` | `#e8edf4` | hairline |
| `--color-surface` / `-2` | `#ffffff` / `#f7f9fc` | raised / recessed |
| radius ramp | 6 / 10 / 16 / 22 / 28 / 36px | `sm`→`3xl` |
| `--container-page` | `1240px` | `max-w-page` |
| `--header-height` | `68px` | |

Key custom utilities defined below: `bg-brand-wash` (the navy hero gradient),
`bg-brand-wash-soft`, `bg-photo-scrim`, `focus-ring`, `focus-ring-inverse`,
`measure` / `measure-tight` / `measure-wide`, `rail`, `reveal`, `ring-hairline`,
`modal-dialog`, `skeleton`.

## FULL `src/app/globals.css`

```css
@import "tailwindcss";

/*
 * Design tokens — Viajarprimero.
 *
 * Tailwind v4 has no tailwind.config.js: this @theme block IS the config.
 * Every variable declared here also generates its matching utility class, so
 * write `bg-primary` / `text-gray-500` / `rounded-lg`, never
 * `bg-[var(--color-primary)]`. Namespace prefixes (--color-*, --radius-*,
 * --shadow-*, --text-*) are required — a variable without one produces a CSS
 * custom property but no utility.
 *
 * Full spec, including component anatomy and states: src/styles/design-tokens.json
 *
 * ── 2026 redesign ──────────────────────────────────────────────────────────
 * The palette, radii and shadow ramp below were retuned away from the scraped
 * OTA values. The brief was that the site read as boxy and outdated, and the
 * three tokens most responsible for that were the 4/8/12px radius ramp, the
 * hard #ebedf0 border drawn around every block, and a shadow ramp tuned for a
 * dense fare grid. Those are now a 6-to-36px ramp, a hairline border two
 * thirds of the way to the background, and a two-layer diffuse shadow.
 * Token *names* are unchanged, so nothing that consumed them had to move.
 */
@theme {
  /* --- Brand --- */
  /* Primary is a shade deeper and slightly less violet than the scraped
     #3364FF. It clears 4.5:1 on white, so unlike its predecessor it is legal
     on body-size text as well as on buttons and headings. */
  --color-primary: #2b5ce6;
  --color-primary-hover: #1f47bd;
  --color-primary-active: #17389a;
  --color-secondary: #0a1f3d;
  /* Warm counterweight to all that blue. Emphasis only, never a primary
     action: on white it measures ~2.4:1 and cannot carry text. */
  --color-accent: #f08c1e;
  --color-accent-hover: #d97706;

  /* --- Neutrals --- */
  /* A cooler, wider ramp than the scrape. 50 and 100 are close enough to white
     to act as surfaces rather than as fills, which is what lets two sections
     sit next to each other without a border drawn between them. */
  --color-gray-50: #f7f9fc;
  --color-gray-100: #eef2f7;
  --color-gray-200: #e0e6ef;
  --color-gray-300: #c8d1de;
  --color-gray-400: #9fabbd;
  --color-gray-500: #7b8798;
  --color-gray-600: #5f6b7d;
  --color-gray-700: #445063;
  --color-gray-800: #29344a;
  --color-gray-900: #0a1f3d;

  /* --- Semantic --- */
  --color-success: #0f9d58;
  --color-warning: #e8a207;
  --color-error: #e5484d;
  --color-info: #2b5ce6;

  /* Tinted fills for badges, alerts and toasts. */
  --color-primary-soft: #eaf0ff;
  --color-primary-softer: #f4f7ff;
  --color-success-soft: #e7f6ee;
  --color-warning-soft: #fdf4e3;
  --color-error-soft: #fdeded;
  --color-accent-soft: #fdf1e3;

  /* --- Surfaces --- */
  /* Three tiers, not two. `background` is the page, `surface` is a raised
     plane on it, `surface-2` is the recessed one inside a card — a summary
     row, a form footer — that used to be drawn as another bordered box. */
  --color-background: #ffffff;
  --color-background-alt: #f7f9fc;
  --color-surface: #ffffff;
  --color-surface-2: #f7f9fc;
  --color-surface-sunken: #eef2f7;
  /* Hairline. Two thirds of the way from the old #ebedf0 to the background,
     because the previous value read as a drawn box rather than as an edge. */
  --color-border: #e8edf4;
  --color-border-strong: #d5dde8;
  --color-divider: #e0e6ef;

  /* --- Text --- */
  --color-text: #0a1f3d;
  /* These two were #8592a6 and #a1a9b3, taken straight from the scrape. On
     white they measure 3.15:1 and 2.38:1 — both under the 4.5:1 WCAG AA floor
     for body text, and both were being used for real paragraphs (card
     summaries, section descriptions), not just decoration. Retuned to the
     values below, which clear 4.5:1 on white *and* on the
     --color-background-alt grey that half the sections sit on, while staying
     far enough apart to read as two distinct levels. */
  --color-text-secondary: #4b5768;
  --color-text-muted: #626e80;
  --color-text-disabled: #c8d1de;
  --color-text-inverse: #ffffff;
  /* Body copy on the navy band. Measures 8.9:1 on #0a1f3d — readable without
     the shout of pure white. */
  --color-text-on-dark: #c3cede;

  /* --- Typography --- */
  /* Two families, no more. Geist is the voice of the site; Geist Mono is only
     for strings read character by character (booking references, promo codes,
     paths). Both are loaded and self-hosted by next/font in app/layout.tsx,
     which sets --font-geist-sans and --font-geist-mono; the system stacks
     below are the fallback while those resolve. Never name a family anywhere
     but here. */
  --font-sans: var(--font-geist-sans), -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: var(--font-geist-mono), SFMono-Regular, Consolas,
    "Liberation Mono", Menlo, monospace;

  /* Semantic type scale — `text-h1`, `text-body`, `text-caption`, etc.
     Widened from the scraped trip.com values, every one of which the spec
     marks `inferred: true`. Those numbers describe a data-dense OTA grid where
     14px body text sits inside a fare table; this site is mostly prose about
     fare rules and destinations.

     The redesign pushed the top of the scale further and left the bottom
     alone. A display size only 1.25x the h1 cannot open a page — a hero has to
     hold the first screen on its own — so `display-lg` runs to 2.75rem here
     and is scaled up again at `md` by the components that use it, while body
     text stays at 16px. */

  --text-display-lg: 2.75rem;
  --text-display-lg--line-height: 1.04;
  --text-display-lg--letter-spacing: -0.035em;
  --text-display-lg--font-weight: 700;

  --text-display: 2.25rem;
  --text-display--line-height: 1.08;
  --text-display--letter-spacing: -0.03em;
  --text-display--font-weight: 700;

  --text-h1: 1.875rem;
  --text-h1--line-height: 1.15;
  --text-h1--letter-spacing: -0.025em;
  --text-h1--font-weight: 700;

  --text-h2: 1.625rem;
  --text-h2--line-height: 1.22;
  --text-h2--letter-spacing: -0.022em;
  --text-h2--font-weight: 700;

  --text-h3: 1.25rem;
  --text-h3--line-height: 1.35;
  --text-h3--letter-spacing: -0.014em;
  --text-h3--font-weight: 600;

  --text-h4: 1.0625rem;
  --text-h4--line-height: 1.4;
  --text-h4--letter-spacing: -0.01em;
  --text-h4--font-weight: 600;

  --text-h5: 1rem;
  --text-h5--line-height: 1.5;
  --text-h5--letter-spacing: -0.006em;
  --text-h5--font-weight: 600;

  --text-h6: 0.875rem;
  --text-h6--line-height: 1.5;
  --text-h6--font-weight: 600;

  /* Body sizes carry their own reading leading, so prose does not need
     `leading-relaxed` bolted on at every call site. */
  --text-body-lg: 1.125rem;
  --text-body-lg--line-height: 1.6;

  --text-body: 1rem;
  --text-body--line-height: 1.65;

  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.55;

  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.45;

  --text-overline: 0.6875rem;
  --text-overline--line-height: 1.4;
  --text-overline--letter-spacing: 0.1em;
  --text-overline--font-weight: 700;

  /* One step below overline, for labels riding inside a control rather than
     sitting in the page — the header call CTA's "Call for reservations" line.
     Same uppercase-and-tracked DNA as overline, because at this size the
     letter-spacing is what keeps it readable. Do not use it for prose: 10px
     is below the floor for anything a visitor has to actually read. */
  --text-micro: 0.625rem;
  --text-micro--line-height: 1.4;
  --text-micro--letter-spacing: 0.1em;
  --text-micro--font-weight: 700;

  /* --- Spacing --- */
  /* 4px base. Tailwind derives the whole scale: p-1 = 4px, p-4 = 16px,
     p-6 = 24px, p-12 = 48px — matching space-1 to space-16 in the spec. */
  --spacing: 4px;

  /* --- Radius --- */
  /* The single biggest contributor to "boxy". The old ramp topped out at 12px,
     which on a 400px-wide card is a corner you read as square. */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 22px;
  --radius-2xl: 28px;
  --radius-3xl: 36px;
  --radius-full: 9999px;

  /* --- Shadows --- */
  /* Two layers each: a tight contact shadow that grounds the element and a
     wide diffuse one that lifts it. One layer reads as a drop shadow; two read
     as depth. */
  --shadow-xs: 0 1px 2px rgb(10 31 61 / 0.05);
  --shadow-sm: 0 1px 2px rgb(10 31 61 / 0.05), 0 2px 8px rgb(10 31 61 / 0.05);
  --shadow-md: 0 2px 4px rgb(10 31 61 / 0.05), 0 8px 24px rgb(10 31 61 / 0.08);
  --shadow-lg: 0 4px 8px rgb(10 31 61 / 0.06), 0 16px 48px rgb(10 31 61 / 0.12);
  --shadow-xl: 0 8px 16px rgb(10 31 61 / 0.08), 0 32px 72px rgb(10 31 61 / 0.16);
  /* For the search panel that overhangs the hero: it sits on a dark field, so
     it needs an inset highlight to hold its top edge. */
  --shadow-panel: 0 1px 0 rgb(255 255 255 / 0.6) inset,
    0 12px 32px rgb(10 31 61 / 0.16), 0 40px 80px rgb(10 31 61 / 0.2);

  /* --- Motion --- */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);
  --default-transition-duration: 200ms;

  /* --- Breakpoints --- */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: 1440px;

  /* --- Containers --- */
  /* `max-w-page`. Not named --container-max: that would shadow Tailwind's
     built-in max-w-max (max-content). Widened from 1160px — the extra 80px is
     what lets a four-up card row breathe instead of touching. */
  --container-page: 1240px;
  --container-narrow: 860px;

  /* --- Blur --- */
  --blur-md: 12px;
  --blur-lg: 24px;

  /* --- Animation --- */
  --animate-rise: rise 0.7s var(--ease-out) both;
  --animate-fade: fade 0.5s var(--ease-out) both;
  --animate-shimmer: shimmer 1.6s linear infinite;
  /* The header call CTA's LIVE badge: the badge itself breathes, and its dot
     throws a halo. Both are slow and small on purpose — this runs forever, in
     the corner of every page, next to a phone number someone is trying to
     read. */
  --animate-live-pop: live-pop 2.6s var(--ease-in-out) infinite;
  --animate-live-halo: live-halo 2.6s var(--ease-out) infinite;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

/*
 * LIVE badge. `live-pop` is a 4% scale — enough to catch the eye in
 * peripheral vision, small enough that it never shifts the number beside it.
 * `live-halo` is the ring the dot pushes out; it sits on a ::after-style
 * sibling span so the dot itself stays put.
 */
@keyframes live-pop {
  0%,
  70%,
  100% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.04);
  }
}

@keyframes live-halo {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(2.6);
  }
}

/*
 * Ken Burns drift for the hero backdrop.
 *
 * It starts at 1.04 rather than 1 so the frame is already overscanned — a
 * scale that begins at exactly 1 shows a hairline of background down one edge
 * for the first frames while the browser rounds the transform. The movement is
 * deliberately small: this runs behind a headline and a search panel, and
 * anything more legible than a drift starts competing with them.
 */
@keyframes kenburns {
  from {
    transform: scale(1.04);
  }
  to {
    transform: scale(1.14) translate3d(-1.5%, -1%, 0);
  }
}

/*
 * Tokens with no Tailwind utility namespace. Reach for them through arbitrary
 * values where needed, e.g. `z-[var(--z-modal)]`.
 */
:root {
  --overlay: rgb(10 31 61 / 0.6);

  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 450ms;

  --opacity-disabled: 0.5;
  --opacity-overlay: 0.6;

  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-overlay: 1040;
  --z-modal: 1050;
  --z-tooltip: 1060;

  /* Height of the sticky header. Anything that has to clear it — a sticky
     sidebar, `scroll-mt` on an anchor target — reads this rather than
     hard-coding 64px and drifting when the header changes. */
  --header-height: 68px;
}

/*
 * No dark mode: the design spec records theme_variants.present = false and the
 * palette assumes light surfaces throughout. Do not add a
 * prefers-color-scheme block without a full dark palette to go with it.
 */
body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-kerning: normal;
}

/* Anchors land below the sticky header rather than under it. */
html {
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--header-height) + 16px);
  /* Lets `height: auto` participate in a transition, which is what makes the
     <details> accordion below animate instead of snapping. Ignored where
     unsupported, and the accordion still opens — it just opens instantly. */
  interpolate-size: allow-keywords;
}

/*
 * Animated native <details>.
 *
 * `::details-content` is what makes a JavaScript-free accordion possible: the
 * disclosure animates open without a client component, a height measurement,
 * or a hydration boundary. `allow-discrete` is what keeps the content in the
 * box while it collapses rather than vanishing on the first frame.
 *
 * Scoped to the accordion (`details.group`) rather than every <details> on the
 * site — the deal-conditions disclosures and the like are fine snapping open.
 */
@media (prefers-reduced-motion: no-preference) {
  @supports selector(::details-content) {
    details.group::details-content {
      block-size: 0;
      overflow: hidden;
      transition:
        block-size var(--duration-normal) var(--ease-out),
        content-visibility var(--duration-normal) var(--ease-out) allow-discrete;
    }

    details.group[open]::details-content {
      block-size: auto;
    }
  }
}

/*
 * Focus ring.
 *
 * The spec makes a 2px primary ring mandatory on every interactive element,
 * and it was being retyped as a four-class incantation at ~40 call sites —
 * which is exactly how a couple of them end up missing it. One utility.
 */
@utility focus-ring {
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

/* Same ring for controls sitting on --color-secondary, where blue-on-navy has
   too little separation to be seen. */
@utility focus-ring-inverse {
  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
}

/*
 * Reading measure. Caps prose at ~68 characters; the spec's own guidance is
 * 60-75 and a full container runs to well over 100.
 */
@utility measure {
  max-width: 68ch;
}

@utility measure-tight {
  max-width: 52ch;
}

@utility measure-wide {
  max-width: 78ch;
}

/*
 * Brand gradients.
 *
 * Declared once so a rebrand stays a change to this file. `bg-brand-wash` is
 * the navy field the hero and the closing band sit on; the two radial stops
 * keep it from reading as a flat rectangle of colour, which is the tell that
 * separates a designed hero from a coloured div.
 */
@utility bg-brand-wash {
  background-color: var(--color-secondary);
  background-image:
    radial-gradient(
      70rem 40rem at 12% -10%,
      rgb(43 92 230 / 0.5),
      transparent 60%
    ),
    radial-gradient(
      50rem 34rem at 92% 8%,
      rgb(240 140 30 / 0.16),
      transparent 62%
    ),
    linear-gradient(180deg, #0d2749 0%, #0a1f3d 55%, #081930 100%);
}

/* The same field, quieter, for interior page headers. */
@utility bg-brand-wash-soft {
  background-color: var(--color-primary-softer);
  background-image:
    radial-gradient(
      55rem 30rem at 0% 0%,
      rgb(43 92 230 / 0.1),
      transparent 60%
    ),
    radial-gradient(
      40rem 26rem at 100% 0%,
      rgb(240 140 30 / 0.07),
      transparent 60%
    );
}

/*
 * Scrim for text laid over a photograph.
 *
 * A flat rgba overlay dims the picture evenly, which costs you the image to
 * buy legibility you only needed at the bottom. This ramps, so the top of the
 * frame keeps its contrast.
 */
@utility bg-photo-scrim {
  background-image: linear-gradient(
    180deg,
    rgb(10 31 61 / 0) 0%,
    rgb(10 31 61 / 0.08) 40%,
    rgb(10 31 61 / 0.62) 78%,
    rgb(10 31 61 / 0.86) 100%
  );
}

/*
 * Hairline ring that reads as an edge rather than a drawn box. Used instead of
 * `border` on cards that sit on a tinted surface.
 */
@utility ring-hairline {
  box-shadow: 0 0 0 1px var(--color-border);
}

/*
 * Scroll-driven entrance.
 *
 * Progressive enhancement with no JavaScript and no client boundary: where
 * `animation-timeline: view()` is supported the element rises as it enters,
 * and everywhere else the @supports block never applies and the content is
 * simply there. Nothing is hidden by default, so a browser without the
 * feature — or a crawler — always sees the content.
 */
@utility reveal {
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      animation: rise linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 22%;
    }
  }
}

/*
 * Horizontal rail. Snap points and a hidden scrollbar, for the destination and
 * route strips that would otherwise become a four-row stack on a phone.
 */
@utility rail {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    scroll-snap-align: start;
    flex: none;
  }
}

/*
 * Modal dialog.
 *
 * Built on the native <dialog> element opened with `showModal()`, which is
 * what buys the behaviour a hand-rolled modal has to reimplement badly: the
 * page behind it becomes inert, focus is trapped inside, Escape closes it, and
 * it renders in the top layer so no z-index on the page can cover it.
 *
 * The entry and exit are animated with `@starting-style` plus
 * `transition-behavior: allow-discrete`, so `display` and `overlay` can
 * participate in the transition. Without `overlay` in that list the dialog
 * would drop out of the top layer on the first frame of the exit and appear to
 * jump behind the page as it fades.
 */
@utility modal-dialog {
  /* The dialog itself is only a positioning context; the panel inside carries
     the design. `max-height` with the dynamic viewport unit is what keeps it
     usable on a phone with the browser chrome showing. */
  padding: 0;
  border: none;
  background: transparent;
  /* Wide rather than tall. At 34rem the offer became a column that overflowed
     a laptop viewport and scrolled — which put the headline number off the top
     edge, the worst possible thing to clip. The panel inside lays out
     horizontally from `sm` up, so the extra width buys back the height. */
  max-width: min(48rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  overflow: visible;

  opacity: 0;
  transform: translateY(12px) scale(0.97);
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out),
    display var(--duration-normal) allow-discrete,
    overlay var(--duration-normal) allow-discrete;

  &[open] {
    opacity: 1;
    transform: none;
  }

  /* The entry frame. Declared after `[open]` so it is not overridden by it. */
  @starting-style {
    &[open] {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
    }
  }

  &::backdrop {
    background-color: rgb(6 18 36 / 0.55);
    /* The blur is the premium part, and it is also the expensive part — it
       forces the compositor to re-rasterise everything behind the dialog. It
       is affordable here because the dialog is open rarely and briefly. */
    backdrop-filter: blur(6px) saturate(120%);
    -webkit-backdrop-filter: blur(6px) saturate(120%);

    opacity: 0;
    transition:
      opacity var(--duration-normal) var(--ease-out),
      display var(--duration-normal) allow-discrete,
      overlay var(--duration-normal) allow-discrete;
  }

  &[open]::backdrop {
    opacity: 1;
  }

  @starting-style {
    &[open]::backdrop {
      opacity: 0;
    }
  }
}

/*
 * Reduced motion gets the dialog without the movement.
 *
 * The global reduced-motion block below collapses transition durations to
 * 0.01ms, which for a discrete `display` transition means the element appears
 * and disappears instantly — correct, and what someone asking for reduced
 * motion wants. This just removes the transform so it does not start offset.
 */
@media (prefers-reduced-motion: reduce) {
  dialog.modal-dialog,
  dialog.modal-dialog[open] {
    transform: none;
  }
}

/* Skeleton fill for loading states. */
@utility skeleton {
  background-image: linear-gradient(
    90deg,
    var(--color-gray-100) 0%,
    var(--color-gray-50) 40%,
    var(--color-gray-100) 80%
  );
  background-size: 200% 100%;
  animation: var(--animate-shimmer);
}

/*
 * Reduced motion.
 *
 * Fifteen files animate something and two of them were handling this, which
 * means the setting was mostly being ignored. Honouring it centrally is both
 * more reliable and less to remember: a component opts back in only if its
 * animation carries meaning that the static state cannot.
 */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## `postcss.config.mjs`

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## `package.json` (dependency surface)

```json
{
  "name": "viajarprimero",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```
