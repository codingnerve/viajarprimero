import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { Prose } from "@/components/content/prose";
import { businessModel } from "@/lib/config/legal";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About us",
  description: `Who ${siteConfig.name} is and what we book: flights, hotels, car rental, cruises, private jets and vacation packages, with real agents.`,
  path: "/about",
});

/**
 * About page.
 *
 * Plain and short. It still states the operating entity and that we book as
 * an agent for the suppliers, because an ads reviewer looks for both here.
 */
export default function AboutPage() {
  const legalName = configured(siteConfig.legalName);
  const supportHours = configured(contactConfig.supportHours);
  const addressParts = [
    configured(contactConfig.address.street),
    configured(contactConfig.address.city),
    configured(contactConfig.address.region),
    configured(contactConfig.address.postalCode),
    configured(contactConfig.address.country),
  ].filter(Boolean);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        title={`About ${siteConfig.name}`}
        intro="A travel agency for flights, hotels, car rental, cruises, private jets and vacation packages — booked with a real agent."
      />

      <Section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Prose>
            <h2>What we do</h2>
            <p>
              We book travel: flights, hotels, car rental, cruises, private jet
              charter and complete vacation packages — for one traveller, a
              family or a whole group.
            </p>
            <p>
              Search on the site or call us. An agent finds options for your
              dates, tells you the full price and books it with you.
            </p>

            <h2>Why book with us</h2>
            <ul>
              <li>
                Real agents{supportHours ? `, ${supportHours}` : ""} — you talk
                to a person.
              </li>
              <li>The full price before you pay, taxes and fees included.</li>
              <li>Baggage, change and cancellation rules explained up front.</li>
              <li>Every part of your trip in one place.</li>
            </ul>

            <h2>Who we are</h2>
            {businessModel === "agency" ? (
              <p>
                We are a travel agency. We book on behalf of the airlines,
                hotels, rental companies, cruise lines and charter operators
                that provide the travel — we do not fly aircraft, own hotels or
                run ships ourselves. Each booking follows that supplier&apos;s
                own terms for changes and refunds.
              </p>
            ) : (
              <p>
                We sell travel as principal, which means we carry the contractual
                obligation to you for the arrangements we sell.
              </p>
            )}

            <h2>Get in touch</h2>
            <p>
              Call us, use the chat, or see the{" "}
              <Link href="/contact">contact page</Link>. Questions about your
              personal data are covered in the{" "}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>
          </Prose>

          <aside>
            <div className="rounded-xs bg-surface ring-1 ring-inset ring-border p-5">
              <h2 className="text-h4 text-text">Business details</h2>
              {legalName || addressParts.length > 0 ? (
                <dl className="mt-3 space-y-3 text-body">
                  {legalName && (
                    <div>
                      <dt className="text-text-secondary">Operating entity</dt>
                      <dd className="text-text">{legalName}</dd>
                    </div>
                  )}
                  {addressParts.length > 0 && (
                    <div>
                      <dt className="text-text-secondary">Registered address</dt>
                      <dd className="text-text">{addressParts.join(", ")}</dd>
                    </div>
                  )}
                  {contactConfig.accreditations.length > 0 && (
                    <div>
                      <dt className="text-text-secondary">Accreditations</dt>
                      <dd className="text-text">
                        <ul>
                          {contactConfig.accreditations.map((item) => (
                            <li key={item.id}>
                              {item.label}: {item.id}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <Alert tone="warning" title="Not yet configured" className="mt-3">
                  <p>
                    Set the legal entity name and registered address in{" "}
                    <code>src/lib/config/site.ts</code>. A travel site advertising
                    without identifiable business details will not pass review.
                  </p>
                </Alert>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
