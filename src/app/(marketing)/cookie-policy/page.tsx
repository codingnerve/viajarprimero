import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { cookieInventory } from "@/lib/config/legal";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cookie policy",
  description:
    "Every cookie this site sets, what it does, how long it lasts, and how to change or withdraw your consent.",
  path: "/cookie-policy",
});

const CATEGORY_LABELS = {
  essential: "Essential",
  analytics: "Analytics",
  marketing: "Marketing",
} as const;

/**
 * Cookie policy.
 *
 * The table is rendered from `cookieInventory`, so the policy and the consent
 * banner describe the same set of cookies by construction. If you add a tag,
 * add it to that config — a cookie policy that under-declares is a regulatory
 * problem and undermines the consent you collected.
 */
export default function CookiePolicyPage() {
  const contactEmail =
    configured(contactConfig.privacyEmail) ?? configured(contactConfig.email);

  const byCategory = (category: keyof typeof CATEGORY_LABELS) =>
    cookieInventory.filter((cookie) => cookie.category === category);

  const sections: LegalSection[] = [
    {
      id: "what-cookies-are",
      heading: "What cookies are",
      body: (
        <p>
          A cookie is a small file a website stores in your browser. Some are
          needed for a site to work at all; others record how a site is used or
          which advert brought you to it. This policy covers cookies and
          similar technologies such as local storage and tracking pixels, which
          work differently but raise the same questions.
        </p>
      ),
    },
    {
      id: "how-we-use-them",
      heading: "How we use them",
      body: (
        <>
          <p>We group cookies into three categories.</p>
          <h3>Essential</h3>
          <p>
            Needed for the site to function — including remembering the cookie
            choice you make, so we do not ask again on every page. These are set
            without consent because the site cannot work without them, and they
            are not used to profile you.
          </p>
          <h3>Analytics</h3>
          <p>
            Tell us in aggregate which pages are used and where people give up,
            so we can fix what is not working. Set only if you consent.
          </p>
          <h3>Marketing</h3>
          <p>
            Let us measure which adverts lead to a booking and avoid showing the
            same advert to people who have already acted. Set only if you
            consent.
          </p>
          <p>
            <strong>
              Nothing outside the essential category is set until you choose to
              allow it.
            </strong>{" "}
            Closing the banner without choosing is not consent, and we treat it
            as a refusal.
          </p>
        </>
      ),
    },
    {
      id: "cookies-we-set",
      heading: "The cookies we set",
      body: (
        <>
          {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(
            (category) => {
              const cookies = byCategory(category);
              if (cookies.length === 0) return null;

              return (
                <div key={category}>
                  <h3>{CATEGORY_LABELS[category]}</h3>
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th>Cookie</th>
                          <th>Set by</th>
                          <th>Purpose</th>
                          <th>Lasts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cookies.map((cookie) => (
                          <tr key={cookie.name}>
                            <td>
                              <code>{cookie.name}</code>
                            </td>
                            <td>{cookie.provider}</td>
                            <td>{cookie.purpose}</td>
                            <td>{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            },
          )}
          <p>
            Third-party cookies are governed by the provider that sets them; the{" "}
            <Link href="/privacy-policy">privacy policy</Link> links to each
            provider&apos;s own notice.
          </p>
        </>
      ),
    },
    {
      id: "changing-your-mind",
      heading: "Changing or withdrawing consent",
      body: (
        <>
          <p>You can change your choice at any time:</p>
          <ul>
            <li>
              <strong>On this site</strong> — clear this site&apos;s stored data
              in your browser. The consent banner will appear again on your next
              visit and you can choose differently.
            </li>
            <li>
              <strong>In your browser</strong> — every major browser lets you
              block or delete cookies, either for all sites or for this one.
              Blocking essential cookies will stop parts of the site working.
            </li>
          </ul>
          <p>
            Withdrawing consent stops future use. It does not undo processing
            that already happened while consent was in place.
          </p>
        </>
      ),
    },
    {
      id: "do-not-track",
      heading: "Do Not Track and global privacy signals",
      body: (
        <p>
          Browsers vary in how they express a tracking preference and there is
          no single agreed standard, so we do not claim to honour Do Not Track
          headers. Our consent banner is the reliable control on this site: if
          you decline a category there, we do not set those cookies regardless
          of any browser signal.
        </p>
      ),
    },
    {
      id: "contact",
      heading: "Questions",
      body: (
        <p>
          If you want to know more about a specific cookie, or you think this
          page is out of date, tell us
          {contactEmail ? (
            <>
              {" "}
              at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </>
          ) : (
            " through our contact page"
          )}
          . {siteConfig.name} keeps this list under review as the site changes.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Cookie policy"
      summary="Every cookie this site sets, what it is for, how long it lasts, and how to change your mind."
      sections={sections}
    />
  );
}
