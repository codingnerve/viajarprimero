import Link from "next/link";

import { LegalDocument } from "@/components/content/legal-document";
import { configured } from "@/lib/config/placeholders";
import {
  dataProcessors,
  enquiryRetentionPeriod,
  sellsOrSharesPersonalInformation,
} from "@/lib/config/legal";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * California privacy rights notice (CCPA as amended by the CPRA).
 *
 * Separate from /your-privacy-choices deliberately: that page is the opt-out
 * mechanism the law requires to be reachable in one click, this one is the
 * detailed notice at collection. Merging them would bury the opt-out, which is
 * the specific failure the "clear and conspicuous link" requirement exists to
 * prevent.
 *
 * Every category below has to match what the site actually collects. A notice
 * listing categories we do not collect is as wrong as one omitting categories
 * we do.
 */
export const metadata = buildMetadata({
  title: "California privacy rights",
  description:
    "Notice at collection for California residents: the categories of personal information we collect, why, who we disclose them to, and how to exercise your CCPA and CPRA rights.",
  path: "/california-privacy-rights",
});

export default function CaliforniaPrivacyRightsPage() {
  const privacyEmail =
    configured(contactConfig.privacyEmail) ?? configured(contactConfig.email);

  return (
    <LegalDocument
      title="California privacy rights"
      summary="A notice for California residents under the California Consumer Privacy Act, as amended by the California Privacy Rights Act. It sets out what we collect, why we have it, who we give it to, and what you can require us to do about it."
      sections={[
        {
          id: "scope",
          heading: "Who this applies to",
          body: (
            <>
              <p>
                This notice applies to California residents. If you live
                elsewhere in the United States, your state may give you similar
                rights — see{" "}
                <Link href="/your-privacy-choices">your privacy choices</Link>,
                which lists them. Everything in our general{" "}
                <Link href="/privacy-policy">privacy policy</Link> applies to
                you as well; this page adds the California-specific detail
                rather than replacing it.
              </p>
            </>
          ),
        },
        {
          id: "categories",
          heading: "What we collect and why",
          body: (
            <>
              <p>
                In the last 12 months we have collected the following
                categories of personal information. We collect it from you
                directly when you send us a request, and automatically from
                your device when you use the site.
              </p>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">Examples</th>
                      <th scope="col">Why we have it</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Identifiers</td>
                      <td>
                        Name, email address, phone number, IP address, cookie
                        identifiers
                      </td>
                      <td>
                        To answer your enquiry, to send you a quote, and to make
                        a booking on your behalf
                      </td>
                    </tr>
                    <tr>
                      <td>Commercial information</td>
                      <td>
                        Trips you asked us about, quotes we sent, bookings we
                        made
                      </td>
                      <td>
                        To service the booking and to keep the records a travel
                        agency is required to keep
                      </td>
                    </tr>
                    <tr>
                      <td>Internet and network activity</td>
                      <td>
                        Pages viewed, referring site, approximate location from
                        IP, device and browser
                      </td>
                      <td>
                        To keep the site working, to measure it in aggregate, and
                        — only with your consent — to measure our advertising
                      </td>
                    </tr>
                    <tr>
                      <td>Geolocation data</td>
                      <td>
                        Approximate city-level location inferred from IP address
                      </td>
                      <td>
                        To show relevant currency and content. We do not collect
                        precise geolocation
                      </td>
                    </tr>
                    <tr>
                      <td>Inferences</td>
                      <td>
                        Which destinations you appear interested in, drawn from
                        the pages you view
                      </td>
                      <td>
                        Only where you have consented to advertising cookies
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Sensitive personal information.</strong> We do not seek
                it. If a booking genuinely requires it — a passport number for
                ticketing, or an accessibility requirement you choose to tell
                us — we use it only to arrange that booking and for no other
                purpose. We do not use or disclose sensitive personal
                information to infer characteristics about you.
              </p>
              <p>
                We do not knowingly collect personal information from anyone
                under 16.
              </p>
            </>
          ),
        },
        {
          id: "disclosure",
          heading: "Who we disclose it to",
          body: (
            <>
              <p>
                We disclose personal information for business purposes to the
                suppliers who actually deliver your travel — the airline,
                hotel, rental company or cruise line — because a booking cannot
                be made without doing so. We also use the service providers
                listed below.
              </p>
              <ul>
                {dataProcessors.map((processor) => (
                  <li key={processor.name}>
                    <strong>{processor.name}</strong> — {processor.purpose} (
                    <a
                      href={processor.policyUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      their privacy notice
                    </a>
                    )
                  </li>
                ))}
              </ul>
              <p>
                <strong>We do not sell personal information for money</strong>,
                and we have not done so in the last 12 months.
                {sellsOrSharesPersonalInformation ? (
                  <>
                    {" "}
                    We do share identifiers and internet activity with
                    advertising partners for cross-context behavioural
                    advertising, which the CPRA defines as
                    &ldquo;sharing&rdquo;. You can stop that at any time on{" "}
                    <Link href="/your-privacy-choices">
                      your privacy choices
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    {" "}
                    We also do not share it for cross-context behavioural
                    advertising.
                  </>
                )}
              </p>
            </>
          ),
        },
        {
          id: "retention",
          heading: "How long we keep it",
          body: (
            <p>
              We keep enquiry and quote records for {enquiryRetentionPeriod}.
              Where we have actually made a booking for you, we keep the
              records associated with it for as long as tax, accounting and
              travel-industry rules require, which is longer. We do not keep
              personal information for longer than the purpose it was collected
              for requires.
            </p>
          ),
        },
        {
          id: "rights",
          heading: "Your rights",
          body: (
            <>
              <p>As a California resident you have the right to:</p>
              <ul>
                <li>
                  <strong>Know and access</strong> the specific pieces and
                  categories of personal information we have collected about
                  you, the sources, the purposes, and the categories of third
                  party we disclosed them to.
                </li>
                <li>
                  <strong>Delete</strong> personal information we hold about
                  you, subject to the exceptions the CCPA allows — we cannot
                  delete records of a booking we are legally required to keep.
                </li>
                <li>
                  <strong>Correct</strong> inaccurate personal information.
                </li>
                <li>
                  <strong>Opt out</strong> of the sharing of your personal
                  information for cross-context behavioural advertising.
                </li>
                <li>
                  <strong>Limit</strong> the use and disclosure of sensitive
                  personal information.
                </li>
                <li>
                  <strong>Not be retaliated against</strong> for exercising any
                  of these rights. We will not charge you a different price or
                  give you a lesser service.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "how-to-exercise",
          heading: "How to make a request",
          body: (
            <>
              <p>
                To opt out of sharing, go to{" "}
                <Link href="/your-privacy-choices">your privacy choices</Link>{" "}
                — no account, no form and no charge. We also honour Global
                Privacy Control signals automatically.
              </p>
              <p>
                For access, deletion or correction requests,{" "}
                {privacyEmail ? (
                  <>
                    email{" "}
                    <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
                  </>
                ) : (
                  <>
                    use the details on our{" "}
                    <Link href="/contact">contact page</Link>
                  </>
                )}{" "}
                and tell us which right you are exercising. We will acknowledge
                within 10 business days and respond within 45 calendar days,
                extending once by a further 45 days where the request is
                complex — we will tell you if that happens.
              </p>
              <p>
                We have to verify who you are before we hand over or delete
                personal information. We will match the details you give us
                against what we already hold, and we will ask for more only
                where the request is for specific pieces of information. An
                authorised agent may act for you with written permission, and
                we may ask you to confirm it directly.
              </p>
              <p>
                If we refuse a request we will tell you why, and you may appeal
                by replying to our response.
              </p>
            </>
          ),
        },
        {
          id: "shine-the-light",
          heading: "Shine the Light",
          body: (
            <p>
              California Civil Code section 1798.83 lets California residents
              ask a business for a list of the personal information it
              disclosed to third parties for their own direct marketing
              purposes in the previous calendar year.{" "}
              {siteConfig.name} does not disclose personal information to third
              parties for their own direct marketing purposes, so there would
              be nothing to list — but you are welcome to ask, using the
              contact details above.
            </p>
          ),
        },
      ]}
    />
  );
}
