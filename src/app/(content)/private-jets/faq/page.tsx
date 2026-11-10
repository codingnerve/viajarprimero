import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { jetFaqs } from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Private jet charter FAQ",
  description:
    "Straight answers on private jet charter: how it is priced, whether it beats business class, what an empty leg really is, baggage limits, pets, documents, and what happens if the aircraft goes technical.",
  path: "/private-jets/faq",
});

/**
 * Private aviation FAQ.
 *
 * This page carries FAQPage structured data for the full set, which is why the
 * landing page only marks up the five it displays — asserting the same
 * questions on two URLs is a duplicate-content signal and the kind of thing
 * that gets rich results withdrawn.
 *
 * Every answer here is a machine-readable assertion once it is marked up, so
 * they are written to be true as stated rather than reassuring in tone. Two of
 * them tell a prospective customer not to charter.
 */
export default function JetFaqPage() {
  return (
    <>
      <JsonLd
        schema={faqSchema(
          jetFaqs.map(({ question, answer }) => ({ question, answer })),
        )}
      />

      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "FAQ", path: "/private-jets/faq" },
        ]}
        eyebrow="Private aviation"
        title="Private jet charter, answered plainly"
        intro="The questions people actually ask before a first charter — including the ones where the honest answer is that chartering is the wrong choice."
        actions={
          <>
            <ButtonLink href="/private-jets/request-a-quote">
              Request a charter quote
            </ButtonLink>
            <ButtonLink href="/private-jets/charter" variant="outline">
              How charter works
            </ButtonLink>
          </>
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <h2 className="text-h3 text-balance text-text">
              {jetFaqs.length} questions
            </h2>
            <p className="mt-3 text-body-sm text-text-secondary">
              Where an answer summarises a policy, the policy page itself
              governs. Our fees are on the{" "}
              <Link
                href="/fees-and-charges"
                className="font-medium text-primary underline underline-offset-2"
              >
                fees and charges
              </Link>{" "}
              page and what happens when a trip changes is in the{" "}
              <Link
                href="/refund-and-cancellation-policy"
                className="font-medium text-primary underline underline-offset-2"
              >
                refund policy
              </Link>
              .
            </p>
          </div>

          <Accordion
            items={jetFaqs}
            name="jet-faq"
            className="border-t border-border"
          />
        </div>

        <p className="measure mt-16 text-body-sm text-text-secondary">
          Something not covered here? Ask us directly on the{" "}
          <Link
            href="/contact"
            className="font-medium text-primary underline underline-offset-2"
          >
            contact page
          </Link>
          , or send the trip and we will answer it alongside the quote. We would
          rather answer a hard question before you book than after.
        </p>
      </Section>
    </>
  );
}
