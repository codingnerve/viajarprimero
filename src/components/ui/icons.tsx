/**
 * The icon set.
 *
 * Drawn rather than installed: the project runs on next, react and react-dom
 * alone, and an icon library would be a dependency carried for nine glyphs.
 *
 * Every icon is a 24-unit outline on a common stroke weight, so a row of them
 * reads as one family. They inherit `currentColor` and take their size from
 * the caller (`className="size-5"`), falling back to 24px when none is given.
 *
 * That fallback is a `width`/`height` attribute rather than a class, and the
 * comment on `Icon` explains why — it is the difference between a caller's
 * size being honoured and being silently discarded.
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
      /*
        The 24px default is set as presentational attributes, NOT as a
        `size-6` class.

        It used to be `cn("size-6", className)`, which silently ignored every
        caller that asked for something smaller. `cn` is a plain string join
        with no tailwind-merge behind it, so that produced `class="size-6
        size-4"` — and which of the two wins is decided by their order in the
        generated stylesheet, not by the order in the attribute. Tailwind emits
        size utilities in ascending order, so the largest always landed last
        and won. Thirty-five call sites were asking for 14, 16 or 20px and
        every one of them was rendering at 24.

        Attributes fix it properly: any CSS rule beats a presentational
        attribute, so `size-4` from a caller now takes effect, while an icon
        with no size at all still gets a sensible 24px rather than an
        unconstrained SVG.
      */
      width="24"
      height="24"
      className={className}
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

export function ChevronIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9.5 5 7 7-7 7" />
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

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
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

export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      {/* Two figures rather than one: the field it labels is a party size,
          and a single silhouette reads as "account". */}
      <path d="M9.5 11.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
      <path d="M2.75 19.25a6.75 6.75 0 0 1 13.5 0" />
      <path d="M16 5.6a3.25 3.25 0 0 1 0 6.05" />
      <path d="M18.4 13.6a6.76 6.76 0 0 1 2.85 5.65" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5Z" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
    </Icon>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.3A8 8 0 1 1 20.5 11.5Z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </Icon>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12.1V4.5a1 1 0 0 1 1-1h7.6a1 1 0 0 1 .7.3l7.9 7.9a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0l-7.9-7.9a1 1 0 0 1-.3-.7Z" />
      <circle cx="8.25" cy="8.25" r="1.25" />
    </Icon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3.5 2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  );
}

export function SuitcaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="7" width="17" height="12.5" rx="2" />
      <path d="M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7M8 7v12.5M16 7v12.5" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  );
}

export function TrainIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="3.5" width="14" height="13" rx="3" />
      <path d="M5 11h14M9 20.5l1.5-4M15 20.5l-1.5-4M9 14h.01M15 14h.01" />
    </Icon>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4 3.5 7.5 7 11M3.5 7.5h14M17 13l3.5 3.5L17 20M20.5 16.5h-14" />
    </Icon>
  );
}

export function SeatIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4.5h6a2 2 0 0 1 2 2V13H8.5a1.5 1.5 0 0 1-1.5-1.5V4.5ZM15 13h3.5a1 1 0 0 1 1 1v2.5H7.5V13M9 16.5v4M17 16.5v4" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
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
