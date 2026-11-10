import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { dataProcessors } from "@/lib/config/legal";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: `How ${siteConfig.name} collects, uses and protects your information when you visit our website or book travel with us.`,
  path: "/privacy-policy",
});

/**
 * Privacy policy.
 *
 * Written in plain English for travellers, not lawyers. The partner table is
 * generated from `dataProcessors`, so it cannot drift from the tags the site
 * actually loads. Have counsel review it before publishing.
 */
export default function PrivacyPolicyPage() {
  const companyName = configured(siteConfig.legalName) ?? siteConfig.name;
  const privacyEmail =
    configured(contactConfig.privacyEmail) ?? configured(contactConfig.email);

  const emailUs = privacyEmail ? (
    <>
      email us at <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
    </>
  ) : (
    <>contact us</>
  );

  const sections: LegalSection[] = [
    {
      id: "about-this-policy",
      heading: "About this policy",
      body: (
        <>
          <p>
            {companyName} runs {siteConfig.name} at {siteConfig.url}. This
            policy explains what information we collect when you use our
            website or book travel with us, how we use it, who we share it
            with, and the choices you have.
          </p>
          <p>
            If you have a question about your information, {emailUs} or use
            our <Link href="/contact">contact page</Link>.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      heading: "Information we collect",
      body: (
        <>
          <h3>Information you give us</h3>
          <ul>
            <li>
              <strong>Trip details</strong> — where and when you want to
              travel, how many people are going, and any preferences.
            </li>
            <li>
              <strong>Contact details</strong> — your name, email address and
              phone number.
            </li>
            <li>
              <strong>Traveller details</strong> — names as they appear on
              passports, dates of birth and, when an airline or country asks
              for them, passport details. We only ask for these when you book.
            </li>
            <li>
              <strong>Messages</strong> — anything you send us by email, chat,
              phone or through a form.
            </li>
          </ul>

          <h3>Information collected automatically</h3>
          <ul>
            <li>
              <strong>Device and usage information</strong> — such as your IP
              address, browser type and the pages you visit.
            </li>
            <li>
              <strong>Cookies</strong> — explained in our{" "}
              <Link href="/cookie-policy">cookie policy</Link>. Anything beyond
              the cookies the site needs to work is only used if you agree.
            </li>
          </ul>

          <h3>Health and accessibility needs</h3>
          <p>
            If you tell us about a medical need, a mobility requirement or a
            dietary request, we use it only to arrange that help, and share it
            only with the airline, hotel or supplier who provides it.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-it",
      heading: "How we use your information",
      body: (
        <>
          <ul>
            <li>To answer your questions and send you travel options.</li>
            <li>To make, change and look after your bookings.</li>
            <li>To send booking confirmations and updates about your trip.</li>
            <li>To keep the records that tax and accounting laws require.</li>
            <li>To keep our website secure and prevent fraud.</li>
            <li>To understand how our website is used, so we can improve it.</li>
            <li>
              To send offers by email — only if you have agreed, and you can
              unsubscribe at any time.
            </li>
          </ul>
          <p>
            <strong>We do not sell your personal information.</strong>
          </p>
        </>
      ),
    },
    {
      id: "who-we-share-it-with",
      heading: "Who we share it with",
      body: (
        <>
          <p>We only share what each company needs to do its part:</p>
          <ul>
            <li>
              <strong>Travel suppliers</strong> — the airlines, hotels, car
              rental companies, cruise lines and charter operators who provide
              your trip. Their own privacy policies apply to your information.
            </li>
            <li>
              <strong>Payment providers</strong> — to take payment. They handle
              your card details; we do not store full card numbers.
            </li>
            <li>
              <strong>Service providers</strong> — companies that host our
              website, send our emails or run our support tools, working on our
              behalf under contract.
            </li>
            <li>
              <strong>Government authorities</strong> — when the law requires
              it, for example passenger information for border control.
            </li>
          </ul>

          {dataProcessors.length > 0 && (
            <>
              <h3>Analytics and advertising partners</h3>
              <p>These are only used if you agree to the matching cookies:</p>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Partner</th>
                      <th>Purpose</th>
                      <th>Their policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProcessors.map((processor) => (
                      <tr key={processor.name}>
                        <td>{processor.name}</td>
                        <td>{processor.purpose}</td>
                        <td>
                          <a
                            href={processor.policyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy notice
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      ),
    },
    {
      id: "travel-abroad",
      heading: "When you travel abroad",
      body: (
        <p>
          When your trip takes you to another country, your details are sent
          to the airlines, hotels and authorities there. Privacy laws in those
          countries may be different from where you live. We only send what is
          needed for your trip.
        </p>
      ),
    },
    {
      id: "how-long-we-keep-it",
      heading: "How long we keep it",
      body: (
        <>
          <ul>
            <li>
              <strong>Enquiries that do not become a booking</strong> — up to
              24 months.
            </li>
            <li>
              <strong>Booking and payment records</strong> — as long as tax
              and accounting laws require, usually up to seven years.
            </li>
            <li>
              <strong>Email preferences</strong> — while you are subscribed,
              plus a record of when you unsubscribed.
            </li>
          </ul>
          <p>After that, we delete the information or make it anonymous.</p>
        </>
      ),
    },
    {
      id: "how-we-protect-it",
      heading: "How we protect it",
      body: (
        <p>
          Our website uses HTTPS, only staff who need booking information can
          see it, and we work with service providers who keep data secure. No
          website can promise perfect security, but if a breach puts your
          information at risk, we will tell you as the law requires.
        </p>
      ),
    },
    {
      id: "your-choices",
      heading: "Your choices and rights",
      body: (
        <>
          <p>Depending on where you live, you can ask us to:</p>
          <ul>
            <li>show you the information we hold about you;</li>
            <li>correct anything that is wrong;</li>
            <li>
              delete your information, unless we have to keep it — for example
              records of a completed booking;
            </li>
            <li>stop sending you marketing emails;</li>
            <li>
              change your cookie choices, on our{" "}
              <Link href="/your-privacy-choices">privacy choices</Link> page.
            </li>
          </ul>
          <p>
            <strong>California residents</strong> can also ask what personal
            information we collect and share, and opt out of any sale or
            sharing of it. We do not sell personal information, and we will
            never treat you differently for using these rights.
          </p>
          <p>
            To make a request, {emailUs}. We may ask you to confirm who you are
            first, to protect your information, and we will reply within the
            time the law allows.
          </p>
        </>
      ),
    },
    {
      id: "children",
      heading: "Children",
      body: (
        <p>
          Our website is for adults. When children travel, we collect their
          details from the adult who makes the booking.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: (
        <p>
          When we update this policy, we change the date at the top of this
          page. If a change is important, we will also tell you by email or
          with a notice on our website.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Privacy policy"
      summary="How we collect, use and protect your information when you use our website or book travel with us."
      sections={sections}
    />
  );
}
