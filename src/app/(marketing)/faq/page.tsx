import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/content/faqs";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Frequently asked questions",
  description:
    "Fees, refunds, ticket confirmation, travel documents and how we handle your data — the questions worth answering before you book.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        schema={faqSchema(
          faqs.map(({ question, answer }) => ({ question, answer })),
        )}
      />

      <PageIntro
        breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]}
        title="Frequently asked questions"
        intro="Short answers to the questions that actually affect what you pay and what you can do afterwards. Where an answer summarises a policy, the policy page itself governs."
      />

      <Section>

        <Accordion items={faqs} className="max-w-3xl" />

        <p className="mt-8 measure text-body-lg text-text-secondary">
          Not covered here? The{" "}
          <Link href="/terms-and-conditions" className="text-primary underline underline-offset-2">
            terms and conditions
          </Link>
          ,{" "}
          <Link
            href="/refund-and-cancellation-policy"
            className="text-primary underline underline-offset-2"
          >
            refund policy
          </Link>{" "}
          and{" "}
          <Link href="/fees-and-charges" className="text-primary underline underline-offset-2">
            fee schedule
          </Link>{" "}
          go into more detail, our{" "}
          <Link href="/guides" className="text-primary underline underline-offset-2">
            travel guides
          </Link>{" "}
          work through the situations that need more than a paragraph, or{" "}
          <Link href="/contact" className="text-primary underline underline-offset-2">
            contact us
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
