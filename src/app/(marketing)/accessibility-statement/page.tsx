import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/content/legal-document";
import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Accessibility statement",
  description: `How ${siteConfig.name} approaches accessibility, what we have built in, what we know is imperfect, and how to tell us about a barrier.`,
  path: "/accessibility-statement",
});

/**
 * Accessibility statement.
 *
 * Written as a commitment and a description of the current state, not a
 * conformance certificate. Claiming full WCAG 2.2 AA conformance without an
 * audit to back it is the same category of unverifiable claim as an
 * accreditation badge we do not hold.
 */
export default function AccessibilityPage() {
  const email = configured(contactConfig.email);

  const sections: LegalSection[] = [
    {
      id: "our-approach",
      heading: "Our approach",
      body: (
        <>
          <p>
            Booking a flight should not require perfect eyesight, a steady hand
            or a mouse. We build this site to be usable with a keyboard alone,
            with a screen reader, and at whatever text size you need.
          </p>
          <p>
            We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2
            at Level AA. We describe this as our target rather than a completed
            certification, because we have not commissioned an independent audit
            — and saying otherwise would be a claim we cannot substantiate.
          </p>
        </>
      ),
    },
    {
      id: "what-we-have-done",
      heading: "What is built in",
      body: (
        <ul>
          <li>
            Every interactive control is reachable and operable with a keyboard,
            with a visible focus outline that we do not remove.
          </li>
          <li>
            A skip link at the top of every page jumps straight to the main
            content.
          </li>
          <li>
            Form fields have visible, persistent labels — never a placeholder
            standing in for one — and errors appear next to the field they
            belong to and are announced to screen readers.
          </li>
          <li>
            Touch targets are sized for a finger, not a cursor, throughout the
            booking flow.
          </li>
          <li>
            Colour is never the only way information is conveyed; status is
            always carried by text or an icon as well.
          </li>
          <li>
            Text is set in a scalable unit and reflows rather than truncating
            when you enlarge it.
          </li>
          <li>
            Motion is limited to short, purposeful transitions, and is
            suppressed for anyone whose system asks for reduced motion.
          </li>
        </ul>
      ),
    },
    {
      id: "known-limitations",
      heading: "Known limitations",
      body: (
        <>
          <p>
            We would rather list these than let you discover them:
          </p>
          <ul>
            <li>
              The date fields use the browser&apos;s own date picker, so the
              experience varies between browsers and assistive technologies. You
              can always type a date directly instead.
            </li>
            <li>
              The airport pickers use a native suggestion list, which some
              screen readers announce less clearly than a custom combobox would.
              Typing an airport code works without the suggestions.
            </li>
            <li>
              Content supplied by airlines — fare rules and carrier conditions —
              is outside our control and may not meet the same standard.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "if-you-hit-a-barrier",
      heading: "If something blocks you",
      body: (
        <>
          <p>
            Tell us
            {email ? (
              <>
                {" "}
                at <a href={`mailto:${email}`}>{email}</a>
              </>
            ) : (
              " through our contact page"
            )}
            . Describe what you were trying to do and what got in the way, and
            include the page address if you can. We treat accessibility reports
            as bugs, not suggestions.
          </p>
          <p>
            If something on this site stops you completing a booking, contact us
            through any channel on the{" "}
            <Link href="/contact">contact page</Link> and we will complete it
            with you directly. You should not have to fight an interface to
            travel.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalDocument
      title="Accessibility statement"
      summary="How we build this site to be usable by everyone, what we know is still imperfect, and how to tell us when something blocks you."
      sections={sections}
    />
  );
}
