import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/config/site";
import {
  OG_LOGO_DATA_URI,
  OG_LOGO_HEIGHT,
  OG_LOGO_WIDTH,
} from "@/lib/seo/og-logo";

/**
 * The shared Open Graph frame.
 *
 * `buildMetadata` has taken an `ogImage` since it was written and nothing ever
 * passed one, so every link to this site — a share, a Slack unfurl, a Google
 * Ads sitelink preview — rendered as a bare text stub. This is the frame those
 * links get instead.
 *
 * Deliberately typographic rather than photographic. There is no photography
 * in the repo to build a card from, a card is 1200x630 so a small image
 * stretches badly, and a type-led card stays legible at the ~300px wide
 * thumbnail most timelines actually render. It also means a new section can
 * have its own card without anyone sourcing a picture for it.
 *
 * Every colour here is a literal rather than a token: `next/og` renders in
 * Satori, which has no access to the stylesheet and therefore no
 * `var(--color-primary)`. These are the values from globals.css, and they have
 * to be updated alongside it — the one place in the project where that
 * duplication is unavoidable.
 *
 * The lockup in the corner is the real logo, inlined as a data URI by
 * `og-logo.ts` — see that file for why it is bytes rather than a path or a
 * URL. It used to be a white chip with a drawn paper plane in it, which was a
 * stand-in from before the brand had an actual logo.
 *
 * The same goes for the typeface. Satori cannot see the next/font variables
 * either, so the family is not named here at all: `next/og` already ships
 * Geist as its built-in default, which is the site face. This used to name a
 * bare `sans-serif`, which matched nothing Satori had loaded and only worked
 * by falling through to that same default — right by accident.
 *
 * Caveat: `next/og` bundles Geist-Regular and nothing else, so the 700s below
 * do not actually render bold — the card gets its hierarchy from size alone.
 * They are left in as the correct intent, and would take effect the moment a
 * bold face is registered via the `fonts` option. Doing that means committing
 * a .ttf or .otf to the repo (Satori cannot read the .woff2 next/font emits),
 * which is why it has not been done here.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function ogImage({
  eyebrow,
  title,
  description,
}: {
  /** Small label above the title — the section this page belongs to. */
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a1f3d",
          // The same two radial stops as `bg-brand-wash`, so a shared link
          // looks like the page it points at.
          backgroundImage:
            "radial-gradient(900px 520px at 10% -20%, rgba(43,92,230,0.55), transparent 60%), radial-gradient(700px 460px at 95% 10%, rgba(240,140,30,0.18), transparent 62%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori
              renders this card, not the browser; `next/image` is not available
              to it and would not be optimising anything here anyway. */}
          <img
            src={OG_LOGO_DATA_URI}
            width={OG_LOGO_WIDTH}
            height={OG_LOGO_HEIGHT}
            alt={siteConfig.name}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9fabbd",
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontSize: title.length > 48 ? 62 : 76,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              // Satori has no text-wrap:balance, so long titles are simply
              // given a smaller size above rather than a ragged last line.
              maxWidth: 1000,
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: "#c3cede",
                marginTop: 26,
                maxWidth: 900,
              }}
            >
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "#9fabbd",
          }}
        >
          <div style={{ display: "flex" }}>Flights</div>
          <div style={{ display: "flex", color: "#455063" }}>·</div>
          <div style={{ display: "flex" }}>Hotels</div>
          <div style={{ display: "flex", color: "#455063" }}>·</div>
          <div style={{ display: "flex" }}>Car rental</div>
          <div style={{ display: "flex", color: "#455063" }}>·</div>
          <div style={{ display: "flex" }}>Cruises</div>
          <div style={{ display: "flex", color: "#455063" }}>·</div>
          <div style={{ display: "flex" }}>Private jets</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
