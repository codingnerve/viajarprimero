import Link from "next/link";

import { LinePhoneLink, PhoneNumberText } from "@/components/layout/line-phone";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ENQUIRY_ANCHOR } from "@/features/enquiries/lib/enquiry-link";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig, verticalCatalogue } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact us",
  description: `How to reach ${siteConfig.name} about a quote, an existing booking, or a question about your personal data.`,
  path: "/contact",
});

/**
 * Contact page.
 *
 * Reachability is a Google Ads requirement, not a nicety: an advertiser that
 * cannot be contacted fails the Misrepresentation policy. Every channel is
 * rendered only once a real value is configured, and the page says plainly
 * when none is — an unanswered phone number in the footer is worse than an
 * honest gap.
 */
export default function ContactPage() {
  const email = configured(contactConfig.email);
  const privacyEmail = configured(contactConfig.privacyEmail);
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const supportHours = configured(contactConfig.supportHours);

  const addressParts = [
    configured(contactConfig.address.street),
    configured(contactConfig.address.city),
    configured(contactConfig.address.region),
    configured(contactConfig.address.postalCode),
    configured(contactConfig.address.country),
  ].filter(Boolean);

  const hasAnyChannel = Boolean(email || phone || addressParts.length > 0);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
        title="Contact us"
        intro="For a new trip, the quote form is the fastest route — it gives us everything we need in one go. For anything about an existing booking, use the channels below."
      />

      <Section>

        {!hasAnyChannel && (
          <Alert tone="warning" title="Contact details not configured" className="mt-8 max-w-2xl">
            <p>
              No contact channel has been set. Fill in <code>contactConfig</code>{" "}
              in <code>src/lib/config/site.ts</code> before launch — a travel site
              running ads without a reachable contact method will be rejected.
            </p>
          </Alert>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {email && (
            <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-5">
              <h2 className="text-h4 text-text">Email</h2>
              <p className="mt-2 text-body text-text-secondary">
                Best for anything with details attached — dates, names, booking
                references.
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-3 inline-block text-body font-semibold text-primary underline-offset-2 hover:underline"
              >
                {email}
              </a>
            </div>
          )}

          {phone && phoneDisplay && (
            <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-5">
              <h2 className="text-h4 text-text">Phone</h2>
              {supportHours && (
                <p className="mt-2 text-body text-text-secondary">
                  Answered {supportHours}.
                </p>
              )}
              <LinePhoneLink className="mt-3 inline-block text-body font-semibold text-primary underline-offset-2 hover:underline">
                <PhoneNumberText />
              </LinePhoneLink>
            </div>
          )}

          {addressParts.length > 0 && (
            <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-5">
              <h2 className="text-h4 text-text">Registered address</h2>
              <address className="mt-2 text-body not-italic text-text-secondary">
                {configured(siteConfig.legalName) && (
                  <span className="block text-text">{siteConfig.legalName}</span>
                )}
                {addressParts.join(", ")}
              </address>
            </div>
          )}
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-primary-softer p-6">
            <h2 className="text-h3 text-text">Planning a trip</h2>
            <p className="mt-2 text-body-lg text-gray-700">
              Send us where, when and who is travelling. An agent gets back to you
              with prices — nothing is charged until you confirm.
            </p>
            <ButtonLink href="/checkout" className="mt-5">
              Request a flight quote
            </ButtonLink>
            <p className="mt-4 text-body text-gray-700">
              For a room, a car or a cabin, the request form is on that
              vertical&apos;s own page:{" "}
              {verticalCatalogue
                .filter((vertical) => vertical.key !== "flights")
                .map((vertical, index, list) => (
                  <span key={vertical.href}>
                    <Link
                      href={`${vertical.href}#${ENQUIRY_ANCHOR}`}
                      className="font-semibold text-primary underline underline-offset-2"
                    >
                      {vertical.label.toLowerCase()}
                    </Link>
                    {index < list.length - 2 ? ", " : ""}
                    {index === list.length - 2 ? " or " : ""}
                    {index === list.length - 1 ? "." : ""}
                  </span>
                ))}
            </p>
          </div>

          <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-6">
            <h2 className="text-h3 text-text">Your personal data</h2>
            <p className="mt-2 text-body-lg text-gray-700">
              To access, correct or delete the data we hold about you, or to
              object to how we use it, contact us
              {privacyEmail ? (
                <>
                  {" "}
                  at{" "}
                  <a
                    href={`mailto:${privacyEmail}`}
                    className="text-primary underline underline-offset-2"
                  >
                    {privacyEmail}
                  </a>
                </>
              ) : (
                " using any channel above"
              )}
              . The{" "}
              <Link
                href="/privacy-policy"
                className="text-primary underline underline-offset-2"
              >
                privacy policy
              </Link>{" "}
              sets out your rights in full and how long we take to respond.
            </p>
          </div>
        </section>
      </Section>
    </>
  );
}
