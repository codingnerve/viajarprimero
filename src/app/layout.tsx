import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";

import { CookieConsent } from "@/components/layout/cookie-consent";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingHelp } from "@/components/layout/floating-help";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

import "./globals.css";

// Two typefaces, both variable fonts self-hosted by next/font (no request to
// Google at runtime):
//
//  · Geist — body copy, UI and small headings. Feeds --font-sans.
//  · Fraunces — large headings (display, h1, h2). Feeds --font-display.
//
// The contrast is deliberate: one face at one size across a whole page reads
// as generated. globals.css holds the fallback stacks and decides which
// classes use the display face. Nothing else in the app names a family.
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  // Every canonical and OG URL in the app resolves against this.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${geistSans.variable} ${fraunces.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-tooltip)] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverse"
        >
          Skip to main content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <FloatingHelp />
        <CookieConsent />
      </body>
    </html>
  );
}
