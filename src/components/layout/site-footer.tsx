import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import { CookiePreferencesButton } from "@/components/layout/cookie-preferences-button";
import { FooterSectionFlyout } from "@/components/layout/footer-section-flyout";
import type { BookingSection } from "@/lib/content/section-links";
import { Logo } from "@/components/layout/logo";
import { configured } from "@/lib/config/placeholders";
import {
  businessModel,
  californiaRestitutionFund,
  sellerOfTravelRegistrations,
} from "@/lib/config/legal";
import { contactConfig, footerNav, siteConfig } from "@/lib/config/site";
import { esChrome } from "@/lib/content/es/chrome";
import type { Locale } from "@/types/locale";

/**
 * Book-column links that open their section's link panel on hover. `Deals`
 * is deliberately absent: it has no `sectionLinkColumns` entry of its own and
 * its pages already appear as a column inside every other section's panel.
 */
const flyoutSections: Record<string, BookingSection | undefined> = {
  "/flights": "flights",
  "/hotels": "hotels",
  "/car-rentals": "cars",
  "/cruises": "cruises",
  "/vacations": "vacations",
  "/private-jets": "privateJets",
};

const columns = [
  { title: "Book", links: footerNav.book },
  { title: "Traveller tools", links: footerNav.travellerTools },
  { title: "Company", links: footerNav.company },
  { title: "Legal", links: footerNav.legal },
] as const;

/**
 * Site footer.
 *
 * Carries the disclosures Google Ads reviewers look for on a travel site: who
 * the operator is, where they are, how to reach them, and — because we sell as
 * an agent rather than as the carrier — an explicit statement of that
 * relationship. Placeholder values are suppressed rather than printed.
 *
 * The redesign changed the shape, not the content. Four columns of grey links
 * at one weight is a wall to skim past; the identity block now leads at a
 * larger size with the contact details as the first thing under it, the link
 * columns are lighter and narrower, and the compliance text sits in its own
 * band at the bottom where it reads as a statement rather than as more links.
 */
export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const es = locale === "es";
  const t = esChrome.footer;
  const email = configured(contactConfig.email);
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const legalName = configured(siteConfig.legalName);

  const addressParts = [
    configured(contactConfig.address.street),
    configured(contactConfig.address.city),
    configured(contactConfig.address.region),
    configured(contactConfig.address.postalCode),
    configured(contactConfig.address.country),
  ].filter(Boolean);

  return (
    <footer className="mt-auto bg-secondary text-text-on-dark">
      {/* A thin coral-to-teal rule closes the page and marks where it ends. */}
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-accent via-primary to-secondary" />

      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-6 px-gutter py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-h2 text-text-inverse">
              {es ? t.ctaTitle : "Ready to plan your trip?"}
            </h2>
            <p className="mt-2 text-body text-text-on-dark">
              {es
                ? t.ctaBody
                : "Call a real agent or send us the details — the full price comes before you pay."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {phone && phoneDisplay && (
              <ButtonLink
                href={`tel:${phone}`}
                variant="accent"
                size="lg"
                icon={<PhoneIcon className="size-5" />}
              >
                {es ? t.ctaCall(phoneDisplay) : `Call ${phoneDisplay}`}
              </ButtonLink>
            )}
            <ButtonLink href="/contact" variant="inverse" size="lg">
              {es ? t.ctaQuote : "Request a quote"}
            </ButtonLink>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-page px-gutter py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Logo tone="inverse" />
            <p className="mt-5 max-w-sm text-body text-gray-400">
              {siteConfig.description}
            </p>

            <address className="mt-6 space-y-2 text-body not-italic">
              {legalName && (
                <p className="font-semibold text-text-inverse">{legalName}</p>
              )}
              {addressParts.length > 0 && (
                <p className="text-gray-400">{addressParts.join(", ")}</p>
              )}
              {phone && phoneDisplay && (
                <p>
                  <a
                    href={`tel:${phone}`}
                    className="rounded-sm text-h4 text-text-inverse tabular-nums underline-offset-4 hover:underline focus-ring-inverse"
                  >
                    {phoneDisplay}
                  </a>
                  {configured(contactConfig.supportHours) && (
                    <span className="block text-caption text-gray-400">
                      {contactConfig.supportHours}
                    </span>
                  )}
                </p>
              )}
              {email && (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="rounded-sm text-gray-400 underline-offset-4 hover:text-white hover:underline focus-ring-inverse"
                  >
                    {email}
                  </a>
                </p>
              )}
            </address>

            {contactConfig.accreditations.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {contactConfig.accreditations.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-full bg-white/8 px-3 py-1 text-caption text-gray-300 ring-1 ring-inset ring-white/12"
                  >
                    {item.label}: {item.id}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {columns.map((column) => {
              const id = column.title.replace(/\s+/g, "-").toLowerCase();

              return (
                <nav key={column.title} aria-labelledby={`footer-${id}`}>
                  <h2
                    id={`footer-${id}`}
                    className="text-overline uppercase text-gray-400"
                  >
                    {es ? (t.columns[column.title] ?? column.title) : column.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) =>
                      /*
                        The hover flyouts list English link labels, so the
                        Spanish footer uses plain links.
                      */
                      !es && flyoutSections[link.href] ? (
                        <li key={link.href} className="group relative">
                          <FooterSectionFlyout
                            href={link.href}
                            label={link.label}
                            section={flyoutSections[link.href]!}
                          />
                        </li>
                      ) : (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="rounded-sm text-body-sm text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-ring-inverse"
                          >
                            {es ? (t.links[link.href] ?? link.label) : link.label}
                          </Link>
                        </li>
                      ),
                    )}
                    {column.title === "Legal" && (
                      <li>
                        <CookiePreferencesButton />
                      </li>
                    )}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compliance band. Separated from the links above by a rule and a
          darker ground so it reads as a legal statement rather than as more
          navigation nobody will click. */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="mx-auto max-w-page space-y-4 px-gutter py-8 text-caption text-gray-400">
          {businessModel === "agency" && es && (
            <p className="max-w-4xl">{t.agency(siteConfig.name)}</p>
          )}
          {businessModel === "agency" && !es && (
            <p className="max-w-4xl">
              {siteConfig.name} is a travel agency and charter broker. We arrange
              air travel, accommodation, car rental, cruises and private jet
              charter as an agent for the airlines, hotels, rental companies,
              cruise lines and licensed air carriers that operate them; we are
              not an airline, hotel, rental company, cruise line or air
              carrier, and we do not own, operate or crew any aircraft, ship or
              vehicle ourselves. Each
              supplier&apos;s own conditions of carriage, booking conditions and
              fare rules govern what you buy. Prices and availability are
              supplied by those operators and change until a booking is
              confirmed and ticketed.
            </p>
          )}

          {/*
            California and Florida require a registered seller of travel to
            publish its registration number in advertising. Nothing renders
            until the numbers are real - see sellerOfTravelRegistrations.
          */}
          {sellerOfTravelRegistrations.length > 0 && es && (
            <p className="max-w-4xl">
              {sellerOfTravelRegistrations
                .map((registration) =>
                  t.sellerOfTravel(
                    registration.state,
                    registration.scheme,
                    registration.registrationNumber,
                  ),
                )
                .join(" · ")}
              {californiaRestitutionFund !== "not-applicable" &&
                ` ${t.californiaNotApproval} ${
                  californiaRestitutionFund === "participant"
                    ? t.californiaParticipant
                    : t.californiaNotParticipant
                }`}
            </p>
          )}
          {sellerOfTravelRegistrations.length > 0 && !es && (
            <p className="max-w-4xl">
              {sellerOfTravelRegistrations.map((registration, index) => (
                <span key={registration.registrationNumber}>
                  {index > 0 && " · "}
                  {registration.state} Seller of Travel {registration.scheme}{" "}
                  {registration.registrationNumber}
                </span>
              ))}
              {californiaRestitutionFund === "not-participant" && (
                <>
                  {" "}
                  Registration as a seller of travel in California does not
                  constitute approval by the State of California. We are not a
                  participant in the California Travel Consumer Restitution
                  Fund.
                </>
              )}
              {californiaRestitutionFund === "participant" && (
                <>
                  {" "}
                  Registration as a seller of travel in California does not
                  constitute approval by the State of California. We are a
                  participant in the California Travel Consumer Restitution
                  Fund.
                </>
              )}
            </p>
          )}

          <p>
            &copy; {new Date().getFullYear()} {legalName ?? siteConfig.name}.{" "}
            {es ? t.rights : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
