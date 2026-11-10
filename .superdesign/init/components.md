# Shared UI Components

Framework: **Next.js 16.3.4** (App Router) / **React 19.2.8** / **TypeScript**
CSS: **Tailwind CSS v4** — no `tailwind.config.js`; the `@theme` block in
`src/app/globals.css` IS the config (see `theme.md`).
Component library: **custom** (no shadcn/Radix/MUI — the project runs on
`next`, `react`, `react-dom` alone).

Directory: `src/components/ui/`
Convention: `kebab-case.tsx` files, `PascalCase` named exports (no default
exports), one primary component per file. Server Components by default;
`"use client"` appears only where state/effects/handlers are needed.

Utility: `cn()` from `@/lib/utils/cn` (full source at the end of this file).

## `src/components/ui/accordion.tsx`

```tsx
import { cn } from "@/lib/utils/cn";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * FAQ list built on native <details>.
 *
 * No JavaScript, no client boundary, keyboard-operable and expandable before
 * hydration — which also means the answers are in the HTML for crawlers rather
 * than appearing only after a bundle loads.
 *
 * `name` puts every row in one exclusive group, so opening a question closes
 * the one before it. That is native accordion behaviour with no state to
 * manage; it is also why the rows animate open rather than snapping — the
 * `interpolate-size` declaration below lets `height: auto` be transitioned.
 */
export function Accordion({
  items,
  name,
  className,
}: {
  items: readonly AccordionItem[];
  /**
   * Groups the rows for exclusive open/close. Must be unique per accordion on
   * the page — two accordions sharing a name would close each other's rows.
   */
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <details
          key={item.question}
          name={name}
          className="group [&::details-content]:overflow-hidden"
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-6 py-5",
              "text-h5 text-text transition-colors duration-[var(--duration-fast)]",
              "hover:text-primary group-open:text-primary",
              "focus-ring [&::-webkit-details-marker]:hidden",
            )}
          >
            <span className="text-balance">{item.question}</span>
            {/*
              A plus that becomes a minus, rather than a chevron that flips.
              The chevron is ambiguous at rest — it reads as "there is more
              below" as often as "this opens" — where a plus states outright
              that something is collapsed.
            */}
            <span
              aria-hidden="true"
              className={cn(
                "relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                "bg-gray-100 text-text-secondary transition-colors duration-[var(--duration-fast)]",
                "group-hover:bg-primary-soft group-hover:text-primary",
                "group-open:bg-primary group-open:text-text-inverse",
              )}
            >
              <span className="absolute h-0.5 w-3 rounded-full bg-current" />
              <span
                className={cn(
                  "absolute h-3 w-0.5 rounded-full bg-current",
                  "transition-transform duration-[var(--duration-normal)] ease-out",
                  "group-open:scale-y-0 motion-reduce:transition-none",
                )}
              />
            </span>
          </summary>
          <p className="measure pb-5 text-body text-text-secondary">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
```

## `src/components/ui/alert.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Tone = "info" | "success" | "warning" | "error";

const toneClasses: Record<Tone, string> = {
  info: "bg-primary-softer text-gray-800",
  success: "bg-success-soft text-gray-800",
  warning: "bg-warning-soft text-gray-800",
  error: "bg-error-soft text-gray-800",
};

/** The rule down the left edge, which is what makes the tone readable at a
    glance without saturating the whole panel. */
const railClasses: Record<Tone, string> = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

const iconClasses: Record<Tone, string> = {
  info: "text-primary",
  success: "text-success",
  warning: "text-accent-hover",
  error: "text-error",
};

/**
 * Every tone carries a text label as well as its colour — colour alone must
 * never be the only thing distinguishing a warning from a confirmation.
 */
const toneLabels: Record<Tone, string> = {
  info: "Note",
  success: "Confirmed",
  warning: "Important",
  error: "Problem",
};

const icons: Record<Tone, ReactNode> = {
  info: <path d="M10 9v5m0-8.5v.01M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />,
  success: <path d="m6 10.5 2.8 2.8L14.5 7.5M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />,
  warning: <path d="M10 7v4m0 3.5v.01M8.6 2.9 1.9 15a1.6 1.6 0 0 0 1.4 2.4h13.4a1.6 1.6 0 0 0 1.4-2.4L11.4 2.9a1.6 1.6 0 0 0-2.8 0Z" />,
  error: <path d="M7.5 7.5l5 5m0-5-5 5M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />,
};

export function Alert({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: Tone;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg py-4 pl-5 pr-4",
        toneClasses[tone],
        className,
      )}
      role={tone === "error" ? "alert" : undefined}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1", railClasses[tone])}
      />
      <div className="flex gap-3">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])}
        >
          {icons[tone]}
        </svg>
        <div className="min-w-0">
          <p className="text-h6 text-text">{title ?? toneLabels[tone]}</p>
          <div className="mt-1 text-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

## `src/components/ui/badge.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "info" | "success" | "warning" | "accent" | "inverse";
type Size = "sm" | "md";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  info: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-gray-800",
  accent: "bg-accent-soft text-accent-hover",
  // For badges on the navy band, where every tinted fill above disappears.
  inverse: "bg-white/12 text-text-inverse ring-1 ring-white/20 ring-inset",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2 py-0.5 text-overline uppercase",
  md: "px-2.5 py-1 text-caption font-medium",
};

/**
 * `dot` prefixes the label with a filled circle in the current colour. It is
 * for status that is otherwise carried by colour alone — the tone tells a
 * sighted reader "good" and the word tells everyone else, but the dot gives
 * the row a scannable left edge in a list of mixed statuses.
 */
export function Badge({
  tone = "neutral",
  size = "md",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full whitespace-nowrap",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
```

## `src/components/ui/button.tsx`

```tsx
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "accent"
  | "inverse";
type Size = "sm" | "md" | "lg";

/**
 * Variants.
 *
 * `primary` carries a shadow tinted with the brand colour rather than a grey
 * one — a neutral drop shadow under a saturated button reads as dirt beneath
 * it. `inverse` is new: the navy bands had been reaching for `outline`, which
 * puts a white surface on a dark field and fights the band it sits on.
 */
const variantClasses: Record<Variant, string> = {
  primary: cn(
    "bg-primary text-text-inverse shadow-[0_1px_2px_rgb(23_56_154/0.4),0_6px_16px_rgb(43_92_230/0.28)]",
    "hover:bg-primary-hover hover:shadow-[0_1px_2px_rgb(23_56_154/0.4),0_10px_24px_rgb(43_92_230/0.34)]",
    "active:bg-primary-active active:shadow-[0_1px_2px_rgb(23_56_154/0.4)]",
  ),
  accent: cn(
    "bg-accent text-secondary shadow-[0_1px_2px_rgb(180_95_10/0.35),0_6px_16px_rgb(240_140_30/0.3)]",
    "hover:bg-accent-hover hover:text-text-inverse",
    "active:brightness-95",
  ),
  secondary: "bg-primary-soft text-primary hover:bg-primary/15 active:bg-primary/20",
  outline: cn(
    "bg-surface text-text ring-1 ring-border-strong ring-inset",
    "hover:bg-gray-50 hover:ring-gray-300 active:bg-gray-100",
  ),
  ghost: "text-text hover:bg-gray-100 active:bg-gray-200",
  inverse: cn(
    "bg-white/10 text-text-inverse ring-1 ring-white/25 ring-inset backdrop-blur-[var(--blur-md)]",
    "hover:bg-white/18 hover:ring-white/40 active:bg-white/25",
  ),
};

/**
 * Heights meet the 44px minimum touch target at `md` and above. `sm` is for
 * dense desktop toolbars only — never for a primary action on mobile.
 */
const sizeClasses: Record<Size, string> = {
  // 36px is fine for a mouse and under the 44px floor for a finger, so the
  // compact height applies only where the pointer is precise.
  sm: "h-11 px-4 text-body pointer-fine:h-9",
  md: "h-12 px-5 text-body",
  lg: "h-14 px-7 text-body-lg",
};

const baseClasses = cn(
  "relative inline-flex select-none items-center justify-center gap-2",
  // Pill. The 16-28px card radii need a fully-round control beside them; a
  // 10px-radius button next to a 22px card is the mismatch that made the old
  // UI read as assembled rather than designed.
  "rounded-full font-semibold whitespace-nowrap",
  "transition-[background-color,box-shadow,transform,color] duration-[var(--duration-fast)] ease-out",
  "active:translate-y-px motion-reduce:active:translate-y-0",
  "focus-ring",
  "disabled:pointer-events-none disabled:bg-gray-100 disabled:text-text-disabled disabled:shadow-none disabled:ring-0",
);

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Rendered before the label, at the control's own colour. */
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * `loading` keeps the button in the layout at its resting width while it
 * works. Swapping the label for "Sending…" reflows the row and moves whatever
 * sits beside it, so the label stays put and is dimmed under a spinner
 * instead; `aria-busy` and the disabled state carry the meaning.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonOwnProps & ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {icon}
        {children}
      </span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className,
  children,
  ...props
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="absolute size-5 animate-spin motion-reduce:animate-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="10" cy="10" r="7.5" className="opacity-25" />
      <path d="M17.5 10A7.5 7.5 0 0 0 10 2.5" />
    </svg>
  );
}
```

## `src/components/ui/card.tsx`

```tsx
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "raised" | "outline" | "plain" | "tinted";
type Padding = "none" | "sm" | "md" | "lg";

/**
 * How a card holds its edge.
 *
 * The old card had exactly one look — 1px border, 12px radius, small shadow —
 * and it was applied to everything from a destination teaser to a paragraph of
 * reassurance text. That is what "boxy" describes: a page where every block of
 * content is drawn inside the same rectangle, so nothing is emphasised because
 * everything is.
 *
 * - `raised`  a plane lifted off the page. Shadow, no border. The default.
 * - `outline` a hairline ring, no lift. For dense lists where twelve shadows
 *             would turn into visual noise.
 * - `plain`   no edge at all. For content grouped by spacing and a heading
 *             rather than by a rectangle drawn around it.
 * - `tinted`  a recessed panel inside another surface — a price summary, a
 *             form footer.
 */
const variantClasses: Record<Variant, string> = {
  raised: "bg-surface shadow-sm",
  outline: "bg-surface ring-1 ring-border ring-inset",
  plain: "bg-transparent",
  tinted: "bg-surface-2 ring-1 ring-border ring-inset",
};

/**
 * Padding is a prop, not a class to override.
 *
 * `cn` is a plain join with no tailwind-merge behind it, so passing `p-0` in
 * `className` does not beat a `p-5` baked into the component — which of the
 * two wins is decided by their order in the generated stylesheet, not by the
 * order they appear in the attribute. Cards whose whole body is a link need
 * the padding on the anchor instead, so that case gets a prop that genuinely
 * removes it.
 */
const paddingClasses: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export function Card({
  className,
  variant = "raised",
  padding = "md",
  interactive = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  variant?: Variant;
  padding?: Padding;
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variantClasses[variant],
        paddingClasses[padding],
        interactive &&
          cn(
            "transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out",
            "hover:-translate-y-1 hover:shadow-lg",
            "motion-reduce:transform-none motion-reduce:transition-none",
          ),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

## `src/components/ui/consent-fields.tsx`

```tsx
import Link from "next/link";

import { Checkbox } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

/**
 * The two consent controls every quote request carries.
 *
 * It sat duplicated byte-for-byte in `features/booking` and
 * `features/enquiries`. The enquiry form's own header comment already names
 * the risk — "three files that start identical and drift" is how a consent
 * checkbox ends up correct on two forms and pre-checked on the third — and
 * that argument applies with more force across two features than within one.
 * A second consumer appeared, so it moved out, per the project guide.
 *
 * Two controls, kept separate and both unchecked by default: accepting the
 * terms is a condition of submitting, marketing is genuinely optional.
 * Bundling them into one checkbox would make the marketing consent invalid.
 * Neither may ever be given a `defaultChecked`.
 */
export function ConsentFields({
  idPrefix,
  termsAccepted,
  onTermsChange,
  marketingOptIn,
  onMarketingChange,
  error,
  className,
}: {
  /** The form's `useId`, so the ids are unique when two forms share a page. */
  idPrefix: string;
  termsAccepted: boolean;
  onTermsChange: (value: boolean) => void;
  marketingOptIn: boolean;
  onMarketingChange: (value: boolean) => void;
  /** Validation message for the terms checkbox. */
  error?: string;
  className?: string;
}) {
  const termsId = `${idPrefix}-termsAccepted`;

  return (
    <div
      className={cn(
        "space-y-4 rounded-xl bg-surface-2 p-5 ring-1 ring-inset ring-border",
        error && "ring-error",
        className,
      )}
    >
      <div>
        <label
          htmlFor={termsId}
          className="flex cursor-pointer items-start gap-3 text-body-sm text-gray-700"
        >
          <Checkbox
            id={termsId}
            checked={termsAccepted}
            onChange={(event) => onTermsChange(event.target.checked)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${termsId}-error` : undefined}
          />
          <span>
            I have read the{" "}
            <Link
              href="/terms-and-conditions"
              className="font-medium text-primary underline underline-offset-2"
            >
              terms and conditions
            </Link>{" "}
            and the{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-primary underline underline-offset-2"
            >
              privacy policy
            </Link>
            . <span className="text-error">*</span>
          </span>
        </label>

        {error && (
          <p
            id={`${termsId}-error`}
            role="alert"
            className="mt-2 pl-8 text-caption font-medium text-error"
          >
            {error}
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4 text-body-sm text-gray-700">
        <Checkbox
          checked={marketingOptIn}
          onChange={(event) => onMarketingChange(event.target.checked)}
        />
        <span>
          Email me occasional travel deals. Optional, and you can unsubscribe
          from any email.
        </span>
      </label>
    </div>
  );
}
```

## `src/components/ui/container.tsx`

```tsx
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Width = "page" | "narrow";

const widthClasses: Record<Width, string> = {
  page: "max-w-page",
  /** For a single column of prose — a policy page, a guide, an article. */
  narrow: "max-w-[var(--container-narrow)]",
};

/**
 * The page gutter. `max-w-page` is the container from the design spec;
 * horizontal padding widens with the viewport rather than staying pinned at
 * the mobile inset.
 */
export function Container({
  as: Tag = "div",
  width = "page",
  className,
  children,
}: {
  as?: ElementType;
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        widthClasses[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

## `src/components/ui/definition-list.tsx`

```tsx
import { cn } from "@/lib/utils/cn";

export interface Definition {
  term: string;
  detail: string;
}

/**
 * A term-and-explanation list.
 *
 * Three pages were building this out of `divide-y rounded-lg border bg-surface`
 * with a `<div className="p-4">` per row — the cruise fare inclusions, the car
 * hire desk charges, the hotel checks. It is a list of things explained, not a
 * grid of cards, and drawing a box around it was most of why those pages read
 * as stacked rectangles.
 *
 * Rules between rows, no box around the whole, and the term set against the
 * detail rather than above it wherever there is room for two columns.
 */
export function DefinitionList({
  items,
  className,
}: {
  items: readonly Definition[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
        >
          <dt className="text-h5 text-text">{item.term}</dt>
          <dd className="measure text-body-sm text-text-secondary">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

## `src/components/ui/field.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface FieldProps {
  /** Must match the control's id — a visible label, never placeholder-only. */
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + hint/error, wired for screen readers.
 *
 * The error sits directly below the control it belongs to and is announced via
 * role="alert"; a summary at the top of the form is not a substitute.
 *
 * The optional/required convention is inverted from the usual one: a red
 * asterisk on nine of ten fields is decoration, so the marker is only drawn
 * where it distinguishes something. `required` still sets the assistive text
 * either way.
 */
export function Field({
  htmlFor,
  label,
  required = false,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-1.5 text-h6 text-text"
      >
        {label}
        {required ? (
          <>
            <span className="text-error" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="text-caption font-normal text-text-muted">
            optional
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-caption text-text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-caption font-medium text-error"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 size-3.5 shrink-0"
          >
            <path d="M8 5v3.5m0 2.5v.01M8 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
```

## `src/components/ui/hero-carousel.tsx`

```tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { PlateFill } from "@/components/ui/plate";
import { cn } from "@/lib/utils/cn";

export interface HeroSlide {
  /** Stable key and the seed for the fallback plate. */
  id: string;
  /** Resolved on the server. `null` renders the gradient plate instead. */
  src: string | null;
  /** Describes the photograph, for the rare case it is not decorative. */
  alt: string;
  /** Shown in the caption chip — the place in the frame. */
  caption: string;
  /** Second line of the chip: the country, the airport code. */
  detail?: string;
}

const INTERVAL_MS = 6500;

/**
 * The hero backdrop.
 *
 * A slow crossfade behind the search panel, with a Ken Burns drift on the
 * active frame so a still photograph does not read as a static banner. The
 * navy wash and a ramped scrim sit on top of it, which is what keeps the
 * headline and the panel legible over any photograph that lands here.
 *
 * ── Why this is a client component ────────────────────────────────────────
 * It would be shorter as a pure-CSS crossfade with staggered animation
 * delays, and that version cannot be paused. WCAG 2.2.2 requires a mechanism
 * to stop anything that moves automatically for more than five seconds, so
 * the timer, the pause control and the reduced-motion opt-out are worth the
 * boundary. It is a leaf: the hero, the header and the page around it all
 * stay Server Components.
 *
 * ── What it does not do ───────────────────────────────────────────────────
 * The images are decorative — the destination they show is not information
 * the page depends on — so the slide layer is `aria-hidden` and the caption
 * chip is not a live region. A screen reader gets the headline and the search
 * panel without a running commentary of city names it cannot act on.
 */
export function HeroCarousel({
  slides,
  className,
}: {
  slides: readonly HeroSlide[];
  className?: string;
}) {

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  // Motion preference is read after mount, not during render: the server has
  // no media queries, so consulting it in the initial render would produce
  // markup the client disagrees with.
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!playing || reduced || slides.length < 2) return;

    timer.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, reduced, slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index];
  const moving = playing && !reduced && slides.length > 1;

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      {/* Slides. Decorative: the navy wash above carries the design and the
          copy carries the meaning. */}
      <div aria-hidden="true" className="absolute inset-0">
        {slides.map((slide, slideIndex) => {
          const current = slideIndex === index;

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity ease-in-out",
                "duration-[1200ms] motion-reduce:duration-0",
                current ? "opacity-100" : "opacity-0",
              )}
            >
              {slide.src ? (
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  // The first frame is the largest thing above the fold, so it
                  // is fetched at high priority; the rest are lazy and arrive
                  // long before their turn.
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover",
                    current && moving && "animate-[kenburns_14s_ease-out_forwards]",
                  )}
                />
              ) : (
                <PlateFill seed={slide.id} />
              )}
            </div>
          );
        })}
      </div>

      {/* The brand field, over the photography rather than instead of it.
          `mix-blend-multiply` keeps the picture's structure visible where a
          flat navy panel at the same opacity would flatten it to a tint. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-wash opacity-[0.82] mix-blend-multiply"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-secondary/35" />
      {/* Bottom ramp, so the panel's white edge has something to sit against. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-secondary to-transparent"
      />

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-page items-end justify-between gap-4 px-5 pb-5 md:px-8 md:pb-6">
            {/* Where the picture was taken. Visible content, so it is not
                inside the aria-hidden layer above. */}
            <p
              key={active.id}
              className="animate-fade text-caption text-white/70 motion-reduce:animate-none"
            >
              <span className="font-semibold text-white/90">
                {active.caption}
              </span>
              {active.detail && <span> · {active.detail}</span>}
            </p>

            <div className="flex shrink-0 items-center gap-3">
              <ul className="flex items-center gap-1.5">
                {slides.map((slide, slideIndex) => {
                  const current = slideIndex === index;

                  return (
                    <li key={slide.id}>
                      <button
                        type="button"
                        aria-label={`Show ${slide.caption}`}
                        aria-current={current ? "true" : undefined}
                        onClick={() => {
                          setIndex(slideIndex);
                          setPlaying(false);
                        }}
                        className="group grid h-8 place-items-center px-0.5 focus-ring-inverse"
                      >
                        <span
                          className={cn(
                            "block h-1 rounded-full transition-all duration-[var(--duration-normal)] ease-out",
                            current
                              ? "w-7 bg-white"
                              : "w-3 bg-white/40 group-hover:bg-white/70",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                aria-pressed={!playing}
                className={cn(
                  "grid size-8 place-items-center rounded-full",
                  "bg-white/12 text-white ring-1 ring-inset ring-white/20",
                  "transition-colors hover:bg-white/25 focus-ring-inverse",
                )}
              >
                <span className="sr-only">
                  {playing ? "Pause the backdrop" : "Play the backdrop"}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-3"

                >
                  {playing ? (
                    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
                  ) : (
                    <path d="M4.5 2.5 13 8l-8.5 5.5z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## `src/components/ui/icons.tsx`

```tsx
import { cn } from "@/lib/utils/cn";

/**
 * The icon set.
 *
 * Drawn rather than installed: the project runs on next, react and react-dom
 * alone, and an icon library would be a dependency carried for nine glyphs.
 *
 * Every icon is a 24-unit outline on a common stroke weight, so a row of them
 * reads as one family. They inherit `currentColor` and take their size from
 * the caller (`className="size-5"`), which is why none of them set one.
 */

type IconProps = {
  className?: string;
};

function Icon({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
    >
      {children}
    </svg>
  );
}

export function PlaneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.2 13.8 3.5 12l17-6.5-5 16.5-2.2-6.5-3.1 3.3v-4.9Z" />
    </Icon>
  );
}

export function BedIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 18v-6.5A1.5 1.5 0 0 1 4.5 10H20a1 1 0 0 1 1 1v7M3 14h18M3 18v2M21 18v2M6.5 10V7.5A1.5 1.5 0 0 1 8 6h3a1.5 1.5 0 0 1 1.5 1.5V10" />
    </Icon>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 16.5V19a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1.5M16.5 17.5V19a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1v-2.5M3 16.5v-3.9a2 2 0 0 1 .2-.9l2-4A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.1l2 4a2 2 0 0 1 .2.9v3.9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M3.6 12.5h16.8M7 15h1.5M15.5 15H17" />
    </Icon>
  );
}

export function ShipIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 14.5 5 9.8a1 1 0 0 1 1-.8h12a1 1 0 0 1 1 .8l1.5 4.7M6.5 9V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v3M12 5V3" />
      <path d="M2.5 14.5h19l-1.6 4.4a2 2 0 0 1-1.9 1.3H6a2 2 0 0 1-1.9-1.3L2.5 14.5Z" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Icon>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 3.5h14v17l-2.3-1.5-2.3 1.5-2.4-1.5L9.6 20.5 7.3 19 5 20.5v-17Z" />
      <path d="M8.5 8h7M8.5 12h7M8.5 15.5h4" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-3.2 7-9V5.8l-7-2.8-7 2.8V12c0 5.8 7 9 7 9Z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </Icon>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 13h1.8a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V13ZM20 13h-1.8a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1V13Z" />
      <path d="M18 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </Icon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21.5s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </Icon>
  );
}

export function JetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      {/* A swept business jet in plan view — distinct from the paper-plane
          glyph used for scheduled flights, which is the whole point: these
          two sit next to each other in the nav. */}
      <path d="M12 2.5c1 0 1.8 1.3 1.8 3v3.2l7.2 4.3v2l-7.2-2.2v4l2.4 1.8v1.7L12 19.6l-4.2.7v-1.7l2.4-1.8v-4L3 15v-2l7.2-4.3V5.5c0-1.7.8-3 1.8-3Z" />
    </Icon>
  );
}

/** Keyed by the `verticalCatalogue` entry, so a vertical cannot gain a page
    without someone deciding what it looks like. */
export const verticalIcons = {
  flights: PlaneIcon,
  hotels: BedIcon,
  cars: CarIcon,
  cruises: ShipIcon,
  privateJets: JetIcon,
} as const;
```

## `src/components/ui/input.tsx`

```tsx
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * 16px text is deliberate: iOS Safari zooms the viewport on focus for anything
 * smaller, which throws the user out of the layout mid-form.
 *
 * The resting border is a ring rather than a border so the control keeps the
 * same box size in every state — a 1px border growing to 2px on focus shifts
 * every sibling in the row by a pixel, which is the flicker you see on a lot
 * of booking forms when you tab through them.
 */
export const controlClasses = cn(
  "h-13 w-full rounded-lg bg-surface px-4 text-body text-text",
  "ring-1 ring-inset ring-border-strong",
  "placeholder:text-text-muted",
  "transition-[box-shadow,background-color] duration-[var(--duration-fast)] ease-out",
  "hover:ring-gray-300",
  "focus:outline-none focus:ring-2 focus:ring-primary",
  "disabled:bg-gray-50 disabled:text-text-disabled disabled:ring-border",
);

const invalidClasses = "ring-2 ring-error hover:ring-error focus:ring-error";

export function Input({
  className,
  invalid = false,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(controlClasses, invalid && invalidClasses, className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

/**
 * An input with a leading icon or a trailing affordance.
 *
 * Wrapping rather than restyling: the icon is positioned against this element
 * and the control keeps its own padding, so a field with an icon and one
 * without still line up on the same baseline in a grid.
 */
export function InputGroup({
  icon,
  trailing,
  className,
  children,
}: {
  icon?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {icon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text-muted"
        >
          {icon}
        </span>
      )}
      {/* `Boolean(...)` rather than the bare node: ReactNode admits bigint,
          which is not a ClassValue, so `icon && "..."` does not narrow. */}
      <div
        className={cn(
          Boolean(icon) && "[&_input]:pl-11",
          Boolean(trailing) && "[&_input]:pr-11",
        )}
      >
        {children}
      </div>
      {trailing && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {trailing}
        </span>
      )}
    </div>
  );
}

export function Textarea({
  className,
  invalid = false,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        controlClasses,
        "h-auto min-h-32 py-3 leading-relaxed",
        invalid && invalidClasses,
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid = false,
  children,
  ...props
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      className={cn(
        controlClasses,
        "cursor-pointer appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23626e80%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')]",
        invalid && invalidClasses,
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

/**
 * Checkbox with a real hit area.
 *
 * The bare `<input type="checkbox">` scattered across the consent forms was a
 * 16px target with a browser-default tick. This keeps native semantics — it is
 * still an input, so it is still focusable, still announced, still submits —
 * and only replaces what the browser draws.
 */
export function Checkbox({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-sm bg-surface",
        "ring-1 ring-inset ring-border-strong transition-colors duration-[var(--duration-fast)]",
        "hover:ring-gray-400",
        "checked:bg-primary checked:ring-primary",
        "checked:bg-[length:14px] checked:bg-center checked:bg-no-repeat",
        "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M3 8.5l3.5 3.5L13 5%22/></svg>')]",
        "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:ring-border",
        "disabled:checked:bg-gray-300 disabled:checked:ring-gray-300",
        "focus-ring",
        className,
      )}
      {...props}
    />
  );
}
```

## `src/components/ui/photo.tsx`

```tsx
import Image from "next/image";

import { initials, PlateFill } from "@/components/ui/plate";
import {
  getPhoto,
  publicFileExists,
  type PhotoCollection,
} from "@/lib/content/images";
import { cn } from "@/lib/utils/cn";

/**
 * An editorial image, or a designed stand-in for one.
 *
 * This is the drop-in slot: if `public/images/<collection>/<slug>.jpg` exists
 * it is rendered through next/image at the sizes the caller asks for, and if
 * it does not, the same frame is filled with a brand gradient plate carrying
 * the subject's initials. Both are the same shape and the same aspect ratio,
 * so a grid does not reflow when a photograph is added — and a half-
 * illustrated grid still looks deliberate.
 *
 * SERVER ONLY: `getPhoto` reads the filesystem, so importing this from a
 * Client Component fails the build. A client component that needs the fallback
 * imports `PlateFill` from ui/plate directly, which carries no such
 * dependency.
 */
export function Photo({
  collection,
  slug,
  src: explicitSrc,
  alt,
  sizes,
  label,
  priority = false,
  className,
  imageClassName,
  overlay = false,
  children,
}: {
  collection: PhotoCollection;
  /** File basename to look for, and the seed for the fallback plate. */
  slug: string;
  /**
   * An explicit path, which wins over the filesystem lookup.
   *
   * The lookup handles the common case — drop a file named after the slug into
   * the collection folder and it appears. This is the escape hatch for a
   * picture that lives somewhere else or is shared between entries.
   *
   * It must be a path from the web root ("/images/...") or an absolute URL.
   * A "@/images/..." value is a TypeScript path alias, not a URL: the bundler
   * resolves it at build time and the browser cannot, so it yields a broken
   * image. Anything under "public/" is served from the root.
   */
  src?: string;
  /** Describes the photograph. Ignored by the fallback, which is decorative. */
  alt: string;
  sizes: string;
  /** Drawn on the fallback plate. Defaults to the slug's initials. */
  label?: string;
  priority?: boolean;
  /** Sets the frame: aspect ratio, radius, position. */
  className?: string;
  imageClassName?: string;
  /** Ramped scrim, for frames that carry text over the image. */
  overlay?: boolean;
  /** Rendered above the image and the scrim. */
  children?: React.ReactNode;
}) {
  /*
    A caller-supplied path wins, but only if it points at a file that is really
    there. These paths are typed by hand in the content modules, so the two
    ways they go wrong are a stale filename and the `@/images/...` form — which
    is a TypeScript alias resolved at build time, not a URL a browser can
    request. Either renders a broken image, so a path that does not resolve is
    discarded here and the slug lookup and then the gradient plate take over. A
    designed fallback beats a broken <img>.
  */
  const usableExplicitSrc =
    explicitSrc && publicFileExists(explicitSrc) ? explicitSrc : null;

  const src = usableExplicitSrc ?? getPhoto(collection, slug);

  return (
    <div className={cn("relative overflow-hidden bg-gray-100", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <PlateFill seed={slug} label={label ?? initials(slug)} />
      )}

      {overlay && <div aria-hidden="true" className="absolute inset-0 bg-photo-scrim" />}

      {children}
    </div>
  );
}
```

## `src/components/ui/plate.tsx`

```tsx
import { cn } from "@/lib/utils/cn";

/**
 * The designed stand-in for a photograph.
 *
 * It lives in its own module, apart from `Photo`, for one reason: `Photo` asks
 * the filesystem whether a picture exists, and anything that imports it drags
 * `node:fs` along. The hero carousel is a Client Component that needs the
 * plate but must never see `fs` — importing it from `photo.tsx` fails the
 * build with "the chunking context does not support external modules". So the
 * plate is server- and client-safe, and `Photo` composes it.
 *
 * This is a fallback, not a placeholder to be replaced later: a page whose
 * pictures have not been supplied is finished, not broken.
 */

/**
 * Six brand-consistent gradient pairs.
 *
 * Every one is drawn from the palette in globals.css — the blues, the navy and
 * the accent — so a wall of plates reads as one family rather than as six
 * random swatches. They are deliberately deep: a plate carries white type, and
 * the same contrast rules apply to it as to a photograph.
 */
const PLATES = [
  "from-[#12386f] via-[#1d4fa8] to-[#2b5ce6]",
  "from-[#0a1f3d] via-[#173a6b] to-[#2f6fb0]",
  "from-[#123b52] via-[#1a5b73] to-[#2b8ea6]",
  "from-[#25204a] via-[#3a2d6b] to-[#5546a8]",
  "from-[#0a1f3d] via-[#3a2c46] to-[#a35b1e]",
  "from-[#10314a] via-[#215a63] to-[#3f8f6b]",
] as const;

/**
 * Deterministic, not random.
 *
 * The plate for a given slug has to be identical on the server and on the
 * client or React reports a hydration mismatch, and identical between builds
 * or the London card changes colour every deploy. A cheap string hash gives
 * both.
 */
function plateFor(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return PLATES[Math.abs(hash) % PLATES.length];
}

export function PlateFill({
  seed,
  label,
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 bg-gradient-to-br",
        plateFor(seed),
        className,
      )}
    >
      {/*
        A flat two-stop gradient still reads as a placeholder. The grid and the
        soft highlight give it enough structure to pass as a designed surface,
        and both are drawn in CSS so they cost nothing to download.
      */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(120% 90% at 30% 0%, #000 20%, transparent 75%)",
        }}
      />
      <div className="absolute -left-1/4 -top-1/3 size-2/3 rounded-full bg-white/12 blur-3xl" />
      {label && (
        <span className="absolute bottom-4 left-5 text-display-lg leading-none text-white/22">
          {label}
        </span>
      )}
    </div>
  );
}

/** "mexico-city" -> "MC". Two letters is enough to make a plate specific. */
export function initials(slug: string): string {
  return slug
    .split("-")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
```

## `src/components/ui/search-panel.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The anatomy of a search panel.
 *
 * Two features build one — `search` for flights, `enquiries` for hotels, car
 * hire and cruises — and they sit in the same hero, one per tab. A traveller
 * switching tabs must not see the control change shape underneath them, which
 * is exactly what happens when two features each own their own version of it.
 * So the shell, the cells and the quiet selects live here and both call sites
 * compose them.
 *
 * The parts are unstyled as to *content*: what goes in a cell is the calling
 * form's business. What they fix is the geometry — one connected control with
 * hairline dividers, a focus ring drawn on the cell rather than the input, and
 * a 72px minimum row height that keeps the labels legible above the values.
 */

/**
 * The outer shell.
 *
 * `panel` is the floating hero treatment — heavy shadow, no border, meant to
 * sit on a photograph or the navy field. `flat` is for a results page, where
 * the form is a control on a white page rather than the hero of it.
 */
export function SearchPanel({
  tone = "panel",
  className,
  children,
  ...props
}: React.ComponentProps<"form"> & { tone?: "panel" | "flat" }) {
  return (
    <form
      noValidate
      className={cn(
        "rounded-2xl bg-surface p-3 md:p-4",
        tone === "panel"
          ? "shadow-panel"
          : "shadow-sm ring-1 ring-inset ring-border",
        className,
      )}
      {...props}
    >
      {children}
    </form>
  );
}

/**
 * The qualifier row above the journey: trip type, travellers, cabin.
 *
 * Small and quiet by design — these change the search rather than being the
 * search, and giving them the same visual weight as the origin field is how a
 * booking form ends up looking like a tax return.
 */
export function SearchQualifiers({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-2 px-1 pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The connected row itself. `columns` is the lg-and-up track list; below that
 * the cells always stack, because four fields side by side on a phone gives
 * each of them about 80px.
 */
export function SearchRow({
  columns,
  className,
  children,
}: {
  columns: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-xl bg-surface-2",
        "divide-y divide-border ring-1 ring-inset ring-border",
        "lg:divide-x lg:divide-y-0",
        columns,
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One cell of the connected row.
 *
 * The focus ring is drawn on the cell via `focus-within` rather than on the
 * input, so the whole labelled area lights up. That is both easier to see and
 * a bigger target — clicking anywhere in the cell, label included, focuses the
 * control.
 */
export function SearchCell({
  htmlFor,
  label,
  invalid = false,
  disabled = false,
  className,
  children,
}: {
  htmlFor: string;
  label: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-18 flex-col justify-center gap-1 px-4 py-3",
        "transition-colors duration-[var(--duration-fast)]",
        "focus-within:z-10 focus-within:bg-surface",
        "focus-within:outline focus-within:-outline-offset-2 focus-within:outline-2 focus-within:outline-primary",
        !disabled && "hover:bg-surface",
        invalid && "bg-error-soft",
        disabled && "opacity-60",
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className={cn(
          "text-overline uppercase",
          invalid ? "text-error" : "text-text-muted",
        )}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * The input inside a cell carries no chrome of its own — the cell draws the
 * state. 16px minimum, because iOS Safari zooms the viewport on focus for
 * anything smaller.
 */
export const panelInputClasses = cn(
  "w-full bg-transparent text-body font-medium text-text",
  "placeholder:font-normal placeholder:text-text-muted",
  "focus:outline-none",
  "disabled:cursor-not-allowed disabled:text-text-disabled",
  // Safari draws a date input at its own intrinsic width and leaves the
  // calendar glyph mid-cell; this pins it to the text baseline like the rest.
  "[&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-date-and-time-value]:text-left",
);

/**
 * A select with no box around it, for the qualifier row.
 *
 * It keeps a native `<select>` underneath — so it is keyboard-operable, opens
 * the platform picker on a phone, and is announced correctly — and only drops
 * the border and background the browser would otherwise draw.
 */
export function QuietSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  /** Visually hidden: the chosen option is the visible label. */
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "min-h-9 cursor-pointer appearance-none rounded-full bg-transparent",
          "pl-3.5 pr-8 text-body-sm font-semibold text-gray-700",
          "transition-colors duration-[var(--duration-fast)] hover:bg-gray-100 hover:text-text",
          "focus-ring",
          "bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23626e80%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')]",
        )}
      >
        {children}
      </select>
    </div>
  );
}

/**
 * The errors from a connected row, collected beneath it.
 *
 * A message inside a 72px cell either clips or grows the cell and shunts the
 * whole row out of alignment. Below the row each one still names its field and
 * still carries the id that field's `aria-describedby` points at, so the
 * association survives the move.
 */
export function SearchErrors({
  idPrefix,
  errors,
}: {
  idPrefix: string;
  errors: ReadonlyArray<readonly [field: string, message: string]>;
}) {
  if (errors.length === 0) return null;

  return (
    <ul className="mt-3 space-y-1.5 px-1">
      {errors.map(([field, message]) => (
        <li
          key={field}
          id={`${idPrefix}-${field}-error`}
          role="alert"
          className="flex items-start gap-2 text-caption font-medium text-error"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 size-3.5 shrink-0"
          >
            <path d="M8 5v3.5m0 2.5v.01M8 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
          </svg>
          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
}
```

## `src/components/ui/section-heading.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Section header: optional eyebrow, a title, an optional description, and an
 * optional action pinned to the right.
 *
 * The eyebrow is deliberately opt-in and should stay rare. A page that puts a
 * small uppercase blue label above every single heading is not building
 * hierarchy — it is repeating the same emphasis six times, which flattens the
 * page and is one of the more recognisable tells of a generated layout. Reach
 * for it when a section genuinely needs a category label above it, not as
 * default decoration.
 *
 * When it is used, it now carries a short rule beside it rather than floating
 * as loose uppercase text, which is what stops it reading as a stray caption.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  as: Tag = "h2",
  tone = "default",
  size = "md",
  className,
  action,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  as?: "h2" | "h3";
  /** `inverse` for the navy band, where the default greys disappear. */
  tone?: "default" | "inverse";
  /** `lg` opens a page or a major band; `md` is every other section. */
  size?: "md" | "lg";
  className?: string;
  action?: ReactNode;
  id?: string;
}) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10",
        align === "center" && "sm:flex-col sm:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          align === "center" && "items-center text-center",
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "flex items-center gap-2.5 text-overline uppercase",
              align === "center" && "justify-center",
              inverse ? "text-gray-400" : "text-primary",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-px w-6",
                inverse ? "bg-white/30" : "bg-primary/40",
              )}
            />
            {eyebrow}
          </p>
        )}
        <Tag
          id={id}
          className={cn(
            "text-balance",
            size === "lg" ? "measure-tight text-display" : "measure-tight text-h2",
            inverse ? "text-text-inverse" : "text-text",
          )}
        >
          {title}
        </Tag>
        {description && (
          <p
            className={cn(
              "measure text-body-lg",
              inverse ? "text-text-on-dark" : "text-text-secondary",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
```

## `src/components/ui/stepper.tsx`

```tsx
"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

export interface StepItem {
  /** Stable across renders — it keys the panel and the aria wiring. */
  id: string;
  title: string;
  body: string;
  /** The specifics behind the step, one line each. */
  points: readonly string[];
}

/**
 * A sequence the reader walks through, one step at a time.
 *
 * Three steps printed side by side are read as three unrelated boxes and then
 * skipped. Showing one at a time costs the reader a click and buys the space
 * to say what the step actually involves — which is the part that answers
 * "what happens after I send this?".
 *
 * It follows the WAI-ARIA tabs pattern rather than inventing a widget: only
 * the current step is in the tab order, the arrow keys move between them, and
 * the rail above each label stays filled once passed so the strip reads as
 * progress rather than as three equal options.
 */
export function Stepper({
  items,
  label,
  action,
  className,
}: {
  items: readonly StepItem[];
  /** Names the step strip for assistive technology. */
  label: string;
  /** Rendered in the panel footer, after the advance button. */
  action?: ReactNode;
  className?: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabId = (index: number) => `${uid}-step-${index}`;
  const panelId = (index: number) => `${uid}-panel-${index}`;

  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(index - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="grid gap-5 sm:grid-cols-3 sm:gap-8"
      >
        {items.map((item, index) => {
          const selected = index === active;
          const passed = index <= active;
          const done = index < active;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={selected}
              aria-controls={panelId(index)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="group flex min-h-11 flex-col items-start text-left focus-ring"
            >
              {/* The rail. It fills left-to-right as the reader advances, so
                  the strip carries progress without a separate progress bar. */}
              <span
                aria-hidden="true"
                className={cn(
                  "h-1 w-full rounded-full transition-colors duration-[var(--duration-normal)]",
                  passed
                    ? "bg-primary"
                    : "bg-divider group-hover:bg-gray-300",
                )}
              />

              <span className="mt-4 flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-caption font-bold tabular-nums",
                    "transition-colors duration-[var(--duration-normal)]",
                    done
                      ? "bg-primary text-text-inverse"
                      : selected
                        ? "bg-primary text-text-inverse"
                        : "bg-gray-100 text-text-muted",
                  )}
                >
                  {done ? <CheckIcon className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-h3 transition-colors duration-[var(--duration-normal)]",
                    selected ? "text-text" : "text-text-muted",
                  )}
                >
                  {item.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={panelId(index)}
          aria-labelledby={tabId(index)}
          tabIndex={0}
          hidden={index !== active}
          className="mt-8 rounded-2xl bg-surface p-6 shadow-sm focus-ring md:p-10"
        >
          <p className="measure text-body-lg text-text">{item.body}</p>

          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {item.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
                >
                  <CheckIcon className="size-3.5" />
                </span>
                <span className="text-body-sm text-text-secondary">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {index < items.length - 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActive(index + 1)}
              >
                Next: {items[index + 1].title}
              </Button>
            )}
            {action}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## `src/components/ui/tabs.tsx`

```tsx
"use client";

import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export interface TabItem {
  /** Stable across renders — it keys the panel and the aria wiring. */
  id: string;
  label: string;
  /** Optional second line under the label. */
  hint?: string;
  /** Leading glyph. Sized by the tab, so pass an unsized <svg>. */
  icon?: ReactNode;
  panel: ReactNode;
}

/**
 * Tab set following the WAI-ARIA tabs pattern.
 *
 * Every panel stays mounted and inactive ones are hidden with the `hidden`
 * attribute rather than unmounted: these panels hold forms, and a traveller
 * who fills in dates, glances at another tab and comes back should find the
 * dates still there.
 *
 * Only the selected tab is in the tab order; the arrow keys move between them.
 * That is the pattern screen reader users expect, and it also stops a four-tab
 * strip from costing four tab presses to skip past.
 *
 * Two shapes. `underline` is the classic strip for switching between views of
 * a page. `segmented` is a pill group for choosing what you are booking — it
 * reads as a control rather than as navigation, which is what the hero needs,
 * and it is the shape a traveller already knows from every airline app.
 */
type Shape = "underline" | "segmented";

export function Tabs({
  items,
  label,
  defaultTabId,
  tone = "light",
  shape = "underline",
  className,
  listClassName,
  panelClassName,
}: {
  items: readonly TabItem[];
  /** Names the tab strip for assistive technology. */
  label: string;
  defaultTabId?: string;
  /** `inverse` is for tabs sitting on a dark surface. */
  tone?: "light" | "inverse";
  shape?: Shape;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  const move = (from: number, delta: number) => {
    const next = items[(from + delta + items.length) % items.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(index, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(index, -1);
        break;
      case "Home":
        event.preventDefault();
        move(0, 0);
        break;
      case "End":
        event.preventDefault();
        move(items.length - 1, 0);
        break;
      default:
        break;
    }
  };

  const segmented = shape === "segmented";
  const inverse = tone === "inverse";

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className={cn(
          // The negative inset lets the strip scroll to the screen edge on a
          // phone instead of clipping the last tab against the gutter.
          "-mx-5 flex overflow-x-auto px-5 md:mx-0 md:px-0",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          segmented
            ? cn(
                "gap-1 md:w-fit md:rounded-full md:p-1",
                inverse
                  ? "md:bg-white/10 md:ring-1 md:ring-inset md:ring-white/15 md:backdrop-blur-[var(--blur-md)]"
                  : "md:bg-gray-100",
              )
            : "gap-1",
          listClassName,
        )}
      >
        {items.map((item, index) => {
          const selected = item.id === active;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={selected}
              aria-controls={panelId(item.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap font-semibold",
                "transition-[background-color,color,box-shadow] duration-[var(--duration-fast)] ease-out",
                inverse ? "focus-ring-inverse" : "focus-ring",
                segmented
                  ? cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-body",
                      selected
                        ? inverse
                          ? "bg-surface text-secondary shadow-sm"
                          : "bg-surface text-primary shadow-sm"
                        : inverse
                          ? "text-gray-300 hover:bg-white/10 hover:text-text-inverse"
                          : "text-gray-600 hover:bg-white/70 hover:text-text",
                    )
                  : cn(
                      "rounded-t-md border-b-2 px-4 py-3 text-body-lg",
                      inverse
                        ? selected
                          ? "border-white text-text-inverse"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                        : selected
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-text",
                    ),
              )}
            >
              {item.icon && (
                <span aria-hidden="true" className="[&>svg]:size-4.5">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={panelId(item.id)}
          aria-labelledby={tabId(item.id)}
          tabIndex={0}
          hidden={item.id !== active}
          className={cn("focus-ring", panelClassName)}
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
```

## `src/lib/utils/cn.ts`

```ts
type ClassValue = string | number | null | false | undefined | ClassValue[];

/**
 * Joins conditional class names. Deliberately not `clsx`: the project runs on
 * next/react/react-dom alone, and this is the entire surface we use.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}
```
