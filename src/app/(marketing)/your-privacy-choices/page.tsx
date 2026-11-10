import Link from "next/link";

import { LegalDocument } from "@/components/content/legal-document";
import { configured } from "@/lib/config/placeholders";
import {
  dataProcessors,
  sellsOrSharesPersonalInformation,
  usStatePrivacyLaws,
} from "@/lib/config/legal";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * "Your Privacy Choices" — the opt-out page.
 *
 * The CPRA requires a business that sells or shares personal information to
 * carry a clear, conspicuous link of this name and to honour an opt-out
 * without making the user create an account. Several other state laws now
 * require the same thing under their own names, so this page serves all of
 * them rather than one page per state.
 *
 * `sellsOrSharesPersonalInformation` is derived from the marketing tags this
 * site actually declares. Running Google Ads remarketing generally counts as
 * "sharing" for cross-context behavioural advertising even where no money
 * changes hands, so the honest answer is usually yes — and the page wording
 * follows the config rather than the other way round.
 */
export const metadata = buildMetadata({
  title: "Your privacy choices",
  description:
    "Opt out of targeted advertising and the sharing of your personal information, and exercise your state privacy rights. No account required.",
  path: "/your-privacy-choices",
});

export default function YourPrivacyChoicesPage() {
  const privacyEmail =
    configured(contactConfig.privacyEmail) ?? configured(contactConfig.email);

  const marketingProcessors = dataProcessors.filter(
    (processor) => processor.category === "marketing",
  );

  return (
    <LegalDocument
      title="Your privacy choices"
      summary="How to opt out of targeted advertising and the sharing of your personal information, and how to exercise the rights your state gives you. You do not need an account and we will not charge you for it."
      sections={[
        {
          id: "what-we-share",
          heading: "What we share, and with whom",
          body: (
            <>
              {sellsOrSharesPersonalInformation ? (
                <>
                  <p>
                    <strong>
                      We do not sell your personal information for money.
                    </strong>{" "}
                    We do, however, share identifiers and information about how
                    you use this site with advertising partners so that our ads
                    can be measured and targeted. Under the California Consumer
                    Privacy Act as amended by the CPRA, and under several other
                    state laws, that counts as &ldquo;sharing&rdquo; for
                    cross-context behavioural advertising, and you have the
                    right to stop it.
                  </p>
                  <p>The partners this applies to are:</p>
                  <ul>
                    {marketingProcessors.map((processor) => (
                      <li key={processor.name}>
                        <strong>{processor.name}</strong> — {processor.purpose}{" "}
                        (
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
                </>
              ) : (
                <p>
                  We do not sell your personal information, and we do not share
                  it for cross-context behavioural advertising. No marketing or
                  advertising tags are active on this site.
                </p>
              )}
              <p>
                We never sell or share the personal information of anyone we
                know to be under 16.
              </p>
            </>
          ),
        },
        {
          id: "opt-out",
          heading: "How to opt out",
          body: (
            <>
              <p>
                There are three routes, and you can use whichever you prefer.
                None of them requires an account.
              </p>
              <ol>
                <li>
                  <strong>Reject advertising cookies on this site.</strong> Use
                  the cookie banner, or reopen your choices at any time from
                  the link in the site footer. Rejecting the marketing category
                  stops the advertising tags from loading at all, which is the
                  most complete option. Your choice is stored on your device,
                  so you will need to set it again on each browser you use.
                </li>
                <li>
                  <strong>Send a Global Privacy Control signal.</strong> If your
                  browser or extension sends the GPC signal, we treat it as a
                  valid opt-out request for that browser automatically. You do
                  not need to do anything else.
                </li>
                <li>
                  <strong>Email us.</strong>{" "}
                  {privacyEmail ? (
                    <>
                      Write to{" "}
                      <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a> with
                      the subject &ldquo;Opt out&rdquo;. We will confirm within
                      15 business days.
                    </>
                  ) : (
                    <>
                      Use the details on our{" "}
                      <Link href="/contact">contact page</Link> and tell us you
                      are making an opt-out request. We will confirm within 15
                      business days.
                    </>
                  )}
                </li>
              </ol>
              <p>
                An authorised agent may make a request on your behalf. We will
                ask for written proof of the authorisation, and we may ask you
                to confirm it directly.
              </p>
            </>
          ),
        },
        {
          id: "other-rights",
          heading: "Your other rights",
          body: (
            <>
              <p>
                Depending on where you live, you may also have the right to:
              </p>
              <ul>
                <li>
                  <strong>Know</strong> what personal information we hold about
                  you, where we got it, why we have it and who we disclosed it
                  to.
                </li>
                <li>
                  <strong>Get a copy</strong> of it in a portable format.
                </li>
                <li>
                  <strong>Correct</strong> anything inaccurate.
                </li>
                <li>
                  <strong>Delete</strong> it, subject to the records we are
                  legally required to keep — a booking we have already made for
                  you generates records we cannot simply erase.
                </li>
                <li>
                  <strong>Limit</strong> how we use sensitive personal
                  information.
                </li>
                <li>
                  <strong>Appeal</strong> a decision, if we refuse a request.
                </li>
              </ul>
              <p>
                We will not discriminate against you for exercising any of
                these. You will get the same prices and the same service.
              </p>
              <p>
                Full detail on what we collect and why is in the{" "}
                <Link href="/privacy-policy">privacy policy</Link>, and the
                Californian specifics are set out on the{" "}
                <Link href="/california-privacy-rights">
                  California privacy rights
                </Link>{" "}
                page.
              </p>
            </>
          ),
        },
        {
          id: "state-laws",
          heading: "Which law applies to you",
          body: (
            <>
              <p>
                These state privacy laws are currently in force and give
                residents a right to opt out of targeted advertising:
              </p>
              <ul>
                {usStatePrivacyLaws.map((entry) => (
                  <li key={entry.state}>
                    <strong>{entry.state}</strong> — {entry.law}
                  </li>
                ))}
              </ul>
              <p>
                {siteConfig.name} applies the opt-out described above to
                everyone who asks, wherever they live. We do not think it is
                sensible to honour the request only for people whose state
                happens to have passed a law.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
